/**
 * The shared hydrology preamble, run through the WASM WhiteboxTools runner.
 *
 * Port of `ScimapAlgorithmBase.run_hydrology` in `qgis_plugin/algorithms/base.py`:
 * breach depressions, then derive slope, FD8 accumulation, D8 pointer and the
 * stream network, and load every array the downstream maths needs.
 */

import { FD8_EXPONENT } from "../data/defaults";
import { cellArea, validityMask, type GridRef } from "./grid";
import { decodeRaster } from "./raster";
import { requireFile, run } from "./tools";

export type DepressionMethod = "breach" | "fill";

export interface HydrologyOptions {
  demBytes: Uint8Array;
  /** Accumulation threshold in cells for the extracted stream network. */
  streamThreshold: number;
  depressionMethod?: DepressionMethod;
  onProgress?: (progress: number, message?: string) => void;
}

export interface HydrologyResult {
  ref: GridRef;
  cellArea: number;
  /** Depression-removed DEM, kept for the DEM-successor connectivity trace. */
  demFilled: Float64Array;
  slope: Float64Array;
  accum: Float64Array;
  d8: Float64Array;
  /** Valid-data mask taken from the original DEM, before depression removal. */
  mask: Uint8Array;
  channelMask: Uint8Array;
  /** Raw bytes retained so later tools can be fed without re-encoding. */
  files: {
    demFilled: Uint8Array;
    d8: Uint8Array;
    streams: Uint8Array;
    /** D8-consistent stream raster, for vectorisation only (see below). */
    streamVector: Uint8Array;
  };
}

/**
 * Note on depression removal: the WASM suite has no plain `BreachDepressions`.
 * `breach_depressions_least_cost` is the closest equivalent and is the default;
 * `fill_depressions` is offered as an alternative. Both differ slightly from the
 * QGIS plugin's `BreachDepressions`, so outputs will not be bit-identical.
 */
export async function runHydrology(options: HydrologyOptions): Promise<HydrologyResult> {
  const {
    demBytes,
    streamThreshold,
    depressionMethod = "breach",
    onProgress,
  } = options;

  onProgress?.(1, "1. Removing DEM depressions...");

  const demFilledBytes =
    depressionMethod === "fill"
      ? requireFile(
          await run(
            "fillDepressions",
            { dem: "/work/dem.tif", output: "/work/dem_fill.tif", fix_flats: true },
            { "dem.tif": demBytes },
          ),
          "dem_fill.tif",
          "fill_depressions",
        )
      : requireFile(
          await run(
            "breachDepressions",
            { dem: "/work/dem.tif", output: "/work/dem_fill.tif", fill_deps: true },
            { "dem.tif": demBytes },
          ),
          "dem_fill.tif",
          "breach_depressions_least_cost",
        );

  onProgress?.(10, "2. Calculating Slope, FD8 Flow Accumulation, and D8 Pointer...");

  const slopeBytes = requireFile(
    await run(
      "slope",
      { input: "/work/dem_fill.tif", output: "/work/slope.tif", units: "degrees" },
      { "dem_fill.tif": demFilledBytes },
    ),
    "slope.tif",
    "slope",
  );

  const accumBytes = requireFile(
    await run(
      "fd8FlowAccum",
      {
        dem: "/work/dem_fill.tif",
        output: "/work/accum.tif",
        out_type: "cells",
        exponent: FD8_EXPONENT,
      },
      { "dem_fill.tif": demFilledBytes },
    ),
    "accum.tif",
    "fd8_flow_accum",
  );

  onProgress?.(16, "2. Deriving D8 pointer and stream network...");

  // The D8 pointer is required by connectivity routing and by
  // raster_streams_to_vector. Whitebox pointer encoding, not ESRI.
  const d8Bytes = requireFile(
    await run(
      "d8Pointer",
      { dem: "/work/dem_fill.tif", output: "/work/d8.tif", esri_pntr: false },
      { "dem_fill.tif": demFilledBytes },
    ),
    "d8.tif",
    "d8_pointer",
  );

  const streamBytes = requireFile(
    await run(
      "extractStreams",
      {
        flow_accumulation: "/work/accum.tif",
        output: "/work/stream.tif",
        threshold: streamThreshold,
        zero_background: true,
      },
      { "accum.tif": accumBytes },
    ),
    "stream.tif",
    "extract_streams",
  );

  // raster_streams_to_vector traces the network by following the D8 pointer
  // from cell to cell, so the stream mask it walks must be D8-consistent.
  // Thresholding the FD8 (dispersive) accumulation above instead leaves cells
  // that pass the threshold without their D8 downstream neighbour also
  // passing it, which breaks the traced lines into many disconnected
  // fragments. Build a separate D8-based mask for vectorisation only; every
  // other use of `streams`/`channelMask` below (connectivity routing termini,
  // channel risk masking) stays on the FD8-based one to match the QGIS
  // plugin's and web application's science.
  const d8AccumBytes = requireFile(
    await run(
      "d8FlowAccum",
      {
        input: "/work/dem_fill.tif",
        output: "/work/d8_accum.tif",
        out_type: "cells",
      },
      { "dem_fill.tif": demFilledBytes },
    ),
    "d8_accum.tif",
    "d8_flow_accum",
  );

  const streamVectorBytes = requireFile(
    await run(
      "extractStreams",
      {
        flow_accumulation: "/work/d8_accum.tif",
        output: "/work/stream_vector.tif",
        threshold: streamThreshold,
        zero_background: true,
      },
      { "d8_accum.tif": d8AccumBytes },
    ),
    "stream_vector.tif",
    "extract_streams",
  );

  onProgress?.(22, "3. Loading arrays to process SCIMAP logic...");

  const slope = await decodeRaster(slopeBytes);
  const accum = await decodeRaster(accumBytes);
  const d8 = await decodeRaster(d8Bytes);
  const streams = await decodeRaster(streamBytes);
  const demFilled = await decodeRaster(demFilledBytes);
  const dem = await decodeRaster(demBytes);

  const ref: GridRef = {
    width: slope.width,
    height: slope.height,
    geoTransform: slope.geoTransform,
    // Slope inherits the DEM's CRS, but fall back to the DEM's own EPSG if the
    // tool dropped it so outputs stay georeferenced.
    epsg: slope.epsg ?? dem.epsg,
  };

  // Validity comes from the original DEM, as in the QGIS plugin: depression
  // removal can fill cells that were never real data.
  const mask = validityMask(dem.data, dem.nodata);

  const channelMask = new Uint8Array(mask.length);
  for (let i = 0; i < channelMask.length; i++) {
    channelMask[i] = streams.data[i] > 0 && mask[i] ? 1 : 0;
  }

  return {
    ref,
    cellArea: cellArea(ref),
    demFilled: demFilled.data,
    slope: slope.data,
    accum: accum.data,
    d8: d8.data,
    mask,
    channelMask,
    files: {
      demFilled: demFilledBytes,
      d8: d8Bytes,
      streams: streamBytes,
      streamVector: streamVectorBytes,
    },
  };
}
