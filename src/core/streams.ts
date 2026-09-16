/**
 * Vector stream network extraction and risk attribution.
 *
 * Port of the vectorisation tail of `ScimapRiskAlgorithm.processAlgorithm` plus
 * `vectors.attribute_stream_network`. The WASM tool picks its output driver from
 * the file extension, so asking for `.geojson` skips the shapefile sidecars the
 * QGIS plugin has to juggle.
 */

import { transform_points_epsg } from "geolibre-wasm";

import type { GridRef } from "./grid";
import { initRaster, sampleAt } from "./raster";
import { requireFile, run } from "./tools";

/** Minimal GeoJSON shapes; the tool only ever emits lines. */
interface Feature {
  type: "Feature";
  geometry: { type: string; coordinates: unknown } | null;
  properties: Record<string, unknown>;
}

interface FeatureCollection {
  type: "FeatureCollection";
  features: Feature[];
}

/** Walk every coordinate pair in a geometry, applying `visit` in place. */
function eachCoordinate(coords: unknown, visit: (xy: number[]) => void): void {
  if (!Array.isArray(coords)) return;
  if (typeof coords[0] === "number") {
    visit(coords as number[]);
    return;
  }
  for (const child of coords) eachCoordinate(child, visit);
}

export interface StreamNetworkOptions {
  /** `streamVector` (D8-consistent) is used for vectorisation, not `streams`
   * (FD8-thresholded) — see the note in `hydrology.ts`. */
  hydrologyFiles: { d8: Uint8Array; streamVector: Uint8Array };
  /** SCIMAP risk raster sampled onto each vertex. */
  risk: Float64Array;
  ref: GridRef;
  fieldName?: string;
}

export interface StreamNetworkResult {
  /** WGS84 FeatureCollection ready for `addGeoJsonLayer`. */
  geojson: FeatureCollection;
  featureCount: number;
}

/**
 * Extract the stream network as WGS84 GeoJSON, attributed with SCIMAP risk.
 *
 * Each feature's risk is the mean of the finite raster values under its
 * vertices, matching the per-feature sampling the QGIS plugin does.
 */
export async function buildStreamNetwork(
  options: StreamNetworkOptions,
): Promise<StreamNetworkResult> {
  const { hydrologyFiles, risk, ref, fieldName = "Risk" } = options;
  await initRaster();

  const files = await run(
    "rasterStreamsToVector",
    {
      streams_raster: "/work/stream.tif",
      d8_pntr: "/work/d8.tif",
      output: "/work/streams.geojson",
      esri_pntr: false,
    },
    { "stream.tif": hydrologyFiles.streamVector, "d8.tif": hydrologyFiles.d8 },
  );

  const raw = requireFile(files, "streams.geojson", "raster_streams_to_vector");
  const collection = JSON.parse(new TextDecoder().decode(raw)) as FeatureCollection;
  const features = collection.features ?? [];

  // Attribute in the source CRS, where the raster's geo-transform applies.
  for (const feature of features) {
    if (!feature.geometry) continue;

    let sum = 0;
    let count = 0;
    eachCoordinate(feature.geometry.coordinates, ([x, y]) => {
      const value = sampleAt(risk, ref, x, y);
      if (Number.isFinite(value)) {
        sum += value;
        count += 1;
      }
    });

    feature.properties ??= {};
    feature.properties[fieldName] = count > 0 ? sum / count : null;
  }

  // MapLibre only takes WGS84, and WhiteboxTools writes the network in the
  // DEM's CRS without a .prj, so reproject every vertex in one batch.
  if (ref.epsg !== undefined && ref.epsg !== 4326) {
    const points: number[] = [];
    const slots: number[][] = [];
    for (const feature of features) {
      if (!feature.geometry) continue;
      eachCoordinate(feature.geometry.coordinates, (xy) => {
        points.push(xy[0], xy[1]);
        slots.push(xy);
      });
    }

    if (points.length > 0) {
      const transformed = transform_points_epsg(ref.epsg, 4326, new Float64Array(points));
      for (let i = 0; i < slots.length; i++) {
        slots[i][0] = transformed[i * 2];
        slots[i][1] = transformed[i * 2 + 1];
      }
    }
  }

  return {
    geojson: { type: "FeatureCollection", features },
    featureCount: features.length,
  };
}
