/**
 * Erosion / runoff-generation risk and percentile normalisation.
 *
 * Port of `qgis_plugin/core/erosion.py`.
 */

import { nanPercentiles } from "./grid";

/** Compute erosion risk matching SCIMAP core with optional stream power. */
export function computeErosionRisk(
  accum: Float64Array,
  slopeDeg: Float64Array,
  cellArea: number,
  useStreamPower = true,
): Float64Array {
  const n = accum.length;
  const risk = new Float64Array(n);

  if (!useStreamPower) {
    for (let i = 0; i < n; i++) {
      const v = Math.abs(accum[i]) * cellArea;
      risk[i] = Number.isFinite(v) ? v : NaN;
    }
    return risk;
  }

  const toRadians = Math.PI / 180;
  for (let i = 0; i < n; i++) {
    // Avoid tan(90 deg) singularities creating inf/NaN stripes in outputs.
    const slopeSafe = Math.min(Math.max(slopeDeg[i], 0), 89);
    const v = Math.abs(accum[i]) * cellArea * Math.tan(slopeSafe * toRadians);
    risk[i] = Number.isFinite(v) ? v : NaN;
  }
  return risk;
}

/** Rescale `array` to [0, 1] between its pLow and pHigh percentiles. */
export function normalisePercentile(
  array: Float64Array,
  pLow = 5,
  pHigh = 95,
): Float64Array {
  const n = array.length;
  const out = new Float64Array(n);

  const [lo, hiRaw] = nanPercentiles(array, [pLow, pHigh]);
  if (!Number.isFinite(lo)) {
    out.fill(NaN);
    return out;
  }

  const hi = hiRaw <= lo ? lo + 1.0 : hiRaw;
  const span = hi - lo;
  for (let i = 0; i < n; i++) {
    const v = array[i];
    if (!Number.isFinite(v)) {
      out[i] = NaN;
      continue;
    }
    out[i] = Math.min(Math.max((v - lo) / span, 0), 1);
  }
  return out;
}
