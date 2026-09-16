/**
 * Unit tests for raster-to-point vectorisation (the "Stream Risk Points"
 * output), independent of the WASM reprojection path so they run fast and
 * without a `geolibre-wasm` tool init.
 */

import { describe, expect, it } from "vitest";

import { buildPointVector } from "../src/core/points";
import type { GridRef } from "../src/core/grid";

const ref: GridRef = {
  width: 2,
  height: 2,
  // Origin (0, 10), 1x1 cells, north-up.
  geoTransform: new Float64Array([0, 1, 0, 10, 0, -1]),
  epsg: undefined,
};

describe("buildPointVector", () => {
  it("places one point per finite cell at the cell centre", () => {
    // Row-major: (0,0)=1, (0,1)=NaN, (1,0)=NaN, (1,1)=4.
    const data = new Float64Array([1, NaN, NaN, 4]);
    const result = buildPointVector(data, ref, "scimap_risk");

    expect(result.featureCount).toBe(2);
    expect(result.geojson.features).toHaveLength(2);

    const [first, second] = result.geojson.features;
    expect(first.properties.scimap_risk).toBe(1);
    expect(first.geometry.coordinates).toEqual([0.5, 9.5]);
    expect(second.properties.scimap_risk).toBe(4);
    expect(second.geometry.coordinates).toEqual([1.5, 8.5]);
  });

  it("returns an empty collection when nothing is finite", () => {
    const data = new Float64Array([NaN, NaN, NaN, NaN]);
    const result = buildPointVector(data, ref, "scimap_risk");
    expect(result.featureCount).toBe(0);
    expect(result.geojson.features).toEqual([]);
  });

  it("carries negative values through, matching positive_only=False", () => {
    const data = new Float64Array([-2.5, 0, NaN, NaN]);
    const result = buildPointVector(data, ref, "scimap_risk");
    expect(result.featureCount).toBe(2);
    expect(result.geojson.features.map((f) => f.properties.scimap_risk)).toEqual([-2.5, 0]);
  });
});
