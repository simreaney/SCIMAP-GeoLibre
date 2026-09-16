/**
 * Raster-to-point vectorisation.
 *
 * Port of `vectors.raster_to_point_vector` in the QGIS plugin: one point per
 * valid raster cell, at the cell centre, carrying the cell's value in a named
 * field. Used for the SCIMAP "Stream Risk Points" output.
 */

import { transform_points_epsg } from "geolibre-wasm";

import type { GridRef } from "./grid";

interface PointFeature {
  type: "Feature";
  geometry: { type: "Point"; coordinates: [number, number] };
  properties: Record<string, number>;
}

interface PointFeatureCollection {
  type: "FeatureCollection";
  features: PointFeature[];
}

export interface PointVectorResult {
  /** WGS84 FeatureCollection ready for `addGeoJsonLayer`. */
  geojson: PointFeatureCollection;
  featureCount: number;
}

/**
 * Convert every finite cell in `data` to a point feature at its cell centre.
 *
 * Mirrors `raster_to_point_vector`'s default (`positive_only=False`): every
 * cell with a finite value is exported, sign included.
 */
export function buildPointVector(
  data: Float64Array,
  ref: GridRef,
  fieldName: string,
): PointVectorResult {
  const gt = ref.geoTransform;
  const features: PointFeature[] = [];
  const points: number[] = [];

  for (let row = 0; row < ref.height; row++) {
    for (let col = 0; col < ref.width; col++) {
      const value = data[row * ref.width + col];
      if (!Number.isFinite(value)) continue;

      const x = gt[0] + (col + 0.5) * gt[1] + (row + 0.5) * gt[2];
      const y = gt[3] + (col + 0.5) * gt[4] + (row + 0.5) * gt[5];
      points.push(x, y);
      features.push({
        type: "Feature",
        geometry: { type: "Point", coordinates: [x, y] },
        properties: { [fieldName]: value },
      });
    }
  }

  // MapLibre only takes WGS84; reproject every point in one batch, matching
  // the stream-network vectorisation.
  if (ref.epsg !== undefined && ref.epsg !== 4326 && points.length > 0) {
    const transformed = transform_points_epsg(ref.epsg, 4326, new Float64Array(points));
    for (let i = 0; i < features.length; i++) {
      features[i].geometry.coordinates = [transformed[i * 2], transformed[i * 2 + 1]];
    }
  }

  return {
    geojson: { type: "FeatureCollection", features },
    featureCount: features.length,
  };
}
