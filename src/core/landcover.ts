/**
 * Land-cover remapping and risk-weight reclassification.
 *
 * Port of `qgis_plugin/core/landcover.py`.
 */

import { UNMAPPED_FALLBACK_CLASS } from "../data/defaults";

/** Remap raw land-cover class IDs to SCIMAP class IDs. */
export function remapLandcoverIds(
  landcover: Float64Array,
  remap: ReadonlyMap<number, number>,
): Float64Array {
  if (remap.size === 0) return landcover;

  const out = landcover.slice();
  for (let i = 0; i < landcover.length; i++) {
    const mapped = remap.get(landcover[i]);
    if (mapped !== undefined) out[i] = mapped;
  }
  return out;
}

/** Reclassify a land-cover array using a numeric lookup; unmatched cells go NaN. */
export function applyReclass(
  landcover: Float64Array,
  lookup: ReadonlyMap<number, number>,
): Float64Array {
  const out = new Float64Array(landcover.length).fill(NaN);
  for (let i = 0; i < landcover.length; i++) {
    const value = lookup.get(landcover[i]);
    if (value !== undefined) out[i] = value;
  }
  return out;
}

/** Sorted land-cover IDs present in the data but missing from `lookup`. */
export function findUnmappedLandcoverIds(
  landcover: Float64Array,
  lookup: ReadonlyMap<number, number>,
): number[] {
  const present = new Set<number>();
  for (let i = 0; i < landcover.length; i++) {
    const v = landcover[i];
    if (!Number.isFinite(v) || v <= 0) continue;
    const id = Math.trunc(v);
    if (!lookup.has(id)) present.add(id);
  }
  return [...present].sort((a, b) => a - b);
}

export interface RiskWeightResult {
  riskWeight: Float64Array;
  scimapClasses: Float64Array;
  /** IDs found in the raster with no weight assigned, for a UI warning. */
  unmapped: number[];
  /** Cells backfilled with the fallback class's weight. */
  fallbackCells: number;
}

export interface RiskWeightOptions {
  weights: ReadonlyMap<number, number>;
  remap?: ReadonlyMap<number, number>;
  /** Land cover already uses SCIMAP classes 1-7, so skip the remap. */
  alreadyScimap?: boolean;
  fallbackClass?: number;
}

/**
 * Turn a land-cover raster into a per-cell risk weight raster.
 *
 * Cells whose class is valid but carries no weight are backfilled with the
 * fallback class's weight so the output has no internal NoData holes, matching
 * the web application.
 */
export function buildRiskWeight(
  landcover: Float64Array,
  options: RiskWeightOptions,
): RiskWeightResult {
  const { weights, remap, alreadyScimap = true, fallbackClass = UNMAPPED_FALLBACK_CLASS } = options;

  const scimapClasses = alreadyScimap
    ? landcover
    : remapLandcoverIds(landcover, remap ?? new Map());

  const unmapped = findUnmappedLandcoverIds(scimapClasses, weights);
  const riskWeight = applyReclass(scimapClasses, weights);

  let fallbackCells = 0;
  const fallbackWeight = weights.get(Math.trunc(fallbackClass));
  if (fallbackWeight !== undefined) {
    for (let i = 0; i < riskWeight.length; i++) {
      const cls = scimapClasses[i];
      if (Number.isNaN(riskWeight[i]) && Number.isFinite(cls) && cls > 0) {
        riskWeight[i] = fallbackWeight;
        fallbackCells += 1;
      }
    }
  }

  return { riskWeight, scimapClasses, unmapped, fallbackCells };
}

/**
 * Convert the panel's key/value table rows into a lookup.
 *
 * Blank rows left behind by the table widget are skipped, mirroring
 * `matrix_to_lookup` in the QGIS plugin.
 */
export function rowsToLookup(
  rows: ReadonlyArray<readonly [string | number, string | number]>,
  integerValues = false,
): Map<number, number> {
  const lookup = new Map<number, number>();
  for (const [rawKey, rawValue] of rows) {
    if (rawKey === "" || rawKey === null || rawValue === "" || rawValue === null) continue;
    const key = Number(rawKey);
    const value = Number(rawValue);
    if (!Number.isFinite(key) || !Number.isFinite(value)) continue;
    lookup.set(Math.trunc(key), integerValues ? Math.trunc(value) : value);
  }
  return lookup;
}
