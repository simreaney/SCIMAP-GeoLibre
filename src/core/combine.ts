/**
 * Rainfall scaling and the in-channel SCIMAP combination step.
 *
 * Port of `scale_rainfall` and `combine_scimap_output` from
 * `qgis_plugin/algorithms/base.py`.
 */

import { nanMean } from "./grid";

/** Normalise rainfall by its in-catchment mean. */
export function scaleRainfall(rain: Float64Array, mask: Uint8Array): Float64Array {
  let mean = nanMean(rain, mask);
  if (mean === 0 || !Number.isFinite(mean)) mean = 1.0;

  const out = new Float64Array(rain.length);
  for (let i = 0; i < rain.length; i++) out[i] = rain[i] / mean;
  return out;
}

export interface CombineOptions {
  erosionRisk: Float64Array;
  connectivity: Float64Array;
  accum: Float64Array;
  mask: Uint8Array;
  cellArea: number;
  rainfallScaled: Float64Array;
  /** Cells with at least this much upslope accumulation carry a stream risk score. */
  streamCellThreshold: number;
  /**
   * Rainfall-weighted contributing area from `dinf_mass_flux`. When absent the
   * local-scaling equivalent (`catchmentArea * rainfallScaled`) is used, which
   * is what the plugin falls back to when mass-flux routing fails.
   */
  rainfallWeightedArea?: Float64Array | null;
  /**
   * Routed accumulation of the erosion x connectivity risk loading from
   * `dinf_mass_flux`. When absent the local-scaling equivalent
   * (`sourceRisk * catchmentArea`) is used, which is what the plugin falls
   * back to when mass-flux routing fails.
   */
  scimapRoutedAccum?: Float64Array | null;
}

export interface CombineResult {
  /** Accumulated risk / rainfall-weighted area, valid over the whole catchment. */
  riskConcentration: Float64Array;
  /** The same ratio, restricted to cells at or above `streamCellThreshold`. */
  channelRiskConcentration: Float64Array;
}

/**
 * Combine erosion risk and connectivity into the SCIMAP risk concentration.
 *
 * `riskConcentration` is valid everywhere in the catchment, for attributing the
 * instream vector network (whose reaches extend upstream of the stream
 * initiation threshold); `channelRiskConcentration` restricts that same ratio
 * to cells at or above `streamCellThreshold`, for the stream-risk-points output.
 */
export function combineScimapOutput(options: CombineOptions): CombineResult {
  const {
    erosionRisk,
    connectivity,
    accum,
    mask,
    cellArea,
    rainfallScaled,
    streamCellThreshold,
    rainfallWeightedArea,
    scimapRoutedAccum,
  } = options;

  const n = erosionRisk.length;
  const tiny = 1e-10;

  const riskConcentration = new Float64Array(n).fill(NaN);

  for (let i = 0; i < n; i++) {
    const inMask = mask[i] === 1;
    if (!inMask) continue;

    const accumMasked = accum[i];
    const catchmentArea = Math.abs(accumMasked) * cellArea;
    const weightedArea = rainfallWeightedArea
      ? rainfallWeightedArea[i]
      : catchmentArea * rainfallScaled[i];

    const sourceRisk = erosionRisk[i] * connectivity[i];
    const routedAccum = scimapRoutedAccum ? scimapRoutedAccum[i] : sourceRisk * catchmentArea;

    riskConcentration[i] = routedAccum / (weightedArea + tiny);
  }

  // `np.abs(nan) >= threshold` is False, so NoData cells fall through to NaN.
  const channelRiskConcentration = new Float64Array(n);
  for (let i = 0; i < n; i++) {
    const inMask = mask[i] === 1;
    const accumMasked = inMask ? accum[i] : NaN;
    channelRiskConcentration[i] =
      inMask && Math.abs(accumMasked) >= streamCellThreshold ? riskConcentration[i] : NaN;
  }

  return { riskConcentration, channelRiskConcentration };
}
