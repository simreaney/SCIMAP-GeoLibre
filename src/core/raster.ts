/**
 * GeoTIFF decoding and COG encoding on top of `geolibre-wasm`.
 *
 * Replaces the GDAL calls the QGIS plugin makes: `gdal.Open` + `ReadAsArray`
 * becomes `GeoTiffReader`, `driver.Create` becomes `CogBuilder`, and
 * `gdal.Warp` onto the DEM grid becomes the `resample` tool with the DEM as its
 * base raster.
 */

import { CogBuilder, GeoTiffReader } from "geolibre-wasm";

import type { GridRef } from "./grid";
import { nodataToNaN } from "./grid";
import { requireFile, run } from "./tools";
import { initWasm } from "./wasm";

/** Re-exported so call sites have one obvious place to await the toolkit. */
export const initRaster = initWasm;

export interface DecodedRaster extends GridRef {
  /** Band 0 as f64 with the nodata sentinel already replaced by NaN. */
  data: Float64Array;
  nodata: number | undefined;
}

/**
 * Decode band 0 of a GeoTIFF to f64.
 *
 * Any GDAL scale/offset is applied so values are physical, matching what
 * `ReadAsArray` returns for a scaled band.
 */
export async function decodeRaster(bytes: Uint8Array): Promise<DecodedRaster> {
  await initRaster();

  const reader = new GeoTiffReader(bytes);
  try {
    const data = reader.read_band_f64(0);
    const transform = reader.value_transform();
    if (transform.length === 2 && (transform[0] !== 1 || transform[1] !== 0)) {
      const [scale, offset] = transform;
      for (let i = 0; i < data.length; i++) data[i] = data[i] * scale + offset;
    }

    const nodata = reader.nodata;
    nodataToNaN(data, nodata);

    const geoTransform = reader.geo_transform();
    return {
      width: reader.width,
      height: reader.height,
      geoTransform:
        geoTransform.length === 6 ? geoTransform : new Float64Array([0, 1, 0, 0, 0, -1]),
      epsg: reader.epsg,
      nodata,
      data,
    };
  } finally {
    reader.free();
  }
}

/** Grid metadata only — cheap enough to call before deciding to align. */
export async function readRasterRef(bytes: Uint8Array): Promise<GridRef> {
  await initRaster();
  const reader = new GeoTiffReader(bytes);
  try {
    const geoTransform = reader.geo_transform();
    return {
      width: reader.width,
      height: reader.height,
      geoTransform:
        geoTransform.length === 6 ? geoTransform : new Float64Array([0, 1, 0, 0, 0, -1]),
      epsg: reader.epsg,
    };
  } finally {
    reader.free();
  }
}

/** True when two rasters share dimensions, geo-transform and CRS. */
export function gridsMatch(a: GridRef, b: GridRef): boolean {
  if (a.width !== b.width || a.height !== b.height) return false;
  if (a.epsg !== undefined && b.epsg !== undefined && a.epsg !== b.epsg) return false;

  for (let i = 0; i < 6; i++) {
    // Sub-millimetre agreement on origin and pixel size; anything looser and
    // the arrays would not line up cell-for-cell.
    if (Math.abs(a.geoTransform[i] - b.geoTransform[i]) > 1e-6) return false;
  }
  return true;
}

export type ResampleMethod = "nn" | "bilinear" | "cc";

/**
 * Resample `bytes` onto the DEM's grid when it does not already match.
 *
 * Mirrors `raster_io.align_to_reference` in the QGIS plugin: near-neighbour for
 * categorical land cover, bilinear for continuous rainfall.
 */
export async function alignToReference(
  bytes: Uint8Array,
  demBytes: Uint8Array,
  demRef: GridRef,
  method: ResampleMethod,
): Promise<Uint8Array> {
  const ref = await readRasterRef(bytes);
  if (gridsMatch(ref, demRef)) return bytes;

  const files = await run(
    "resample",
    {
      inputs: "/work/align_src.tif",
      base: "/work/align_base.tif",
      method,
      output: "/work/aligned.tif",
    },
    { "align_src.tif": bytes, "align_base.tif": demBytes },
  );
  return requireFile(files, "aligned.tif", "resample");
}

export interface EncodeOptions {
  ref: GridRef;
  nodata?: number;
  compression?: string;
}

/**
 * Encode an f32 raster as a COG.
 *
 * SCIMAP outputs are all in [0, 1] or a small physical range, so f32 halves the
 * payload with no meaningful precision loss. NaN is written as the nodata
 * sentinel because MapLibre's COG reader keys transparency off nodata.
 */
export function encodeCog(
  data: Float64Array,
  { ref, nodata = -9999, compression = "deflate" }: EncodeOptions,
): Uint8Array {
  const pixels = new Float32Array(data.length);
  for (let i = 0; i < data.length; i++) {
    pixels[i] = Number.isFinite(data[i]) ? data[i] : nodata;
  }

  const builder = new CogBuilder(ref.width, ref.height, 1);
  try {
    builder.set_compression(compression);
    builder.set_geo_transform(ref.geoTransform);
    builder.set_nodata(nodata);
    if (ref.epsg !== undefined) builder.set_epsg(ref.epsg);
    // Overviews keep the layer readable when zoomed out; MapLibre reads the
    // pyramid rather than decoding full resolution at every zoom.
    builder.set_overview_levels(new Uint32Array([2, 4, 8]));
    return builder.write_f32(pixels);
  } finally {
    builder.free();
  }
}

/** Encode an integer class raster (e.g. SCIMAP land-cover classes) as a COG. */
export function encodeByteCog(data: Float64Array, ref: GridRef): Uint8Array {
  const pixels = new Uint8Array(data.length);
  for (let i = 0; i < data.length; i++) {
    pixels[i] = Number.isFinite(data[i]) ? Math.max(0, Math.min(255, Math.round(data[i]))) : 0;
  }

  const builder = new CogBuilder(ref.width, ref.height, 1);
  try {
    builder.set_compression("deflate");
    builder.set_geo_transform(ref.geoTransform);
    builder.set_nodata(0);
    if (ref.epsg !== undefined) builder.set_epsg(ref.epsg);
    return builder.write_u8(pixels);
  } finally {
    builder.free();
  }
}

/**
 * Sample a raster at a map coordinate using its inverse geo-transform.
 *
 * Replaces the `gdal.InvGeoTransform` / `ApplyGeoTransform` pair the QGIS plugin
 * uses to attribute the stream network. Assumes a north-up grid, which every
 * WhiteboxTools output is.
 */
export function sampleAt(
  data: Float64Array,
  ref: GridRef,
  x: number,
  y: number,
): number {
  const gt = ref.geoTransform;
  const col = Math.floor((x - gt[0]) / gt[1]);
  const row = Math.floor((y - gt[3]) / gt[5]);
  if (col < 0 || col >= ref.width || row < 0 || row >= ref.height) return NaN;
  return data[row * ref.width + col];
}
