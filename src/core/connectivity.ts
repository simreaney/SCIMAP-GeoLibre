/**
 * Network index of connectivity (SAGA-style flow-path trace).
 *
 * Port of `qgis_plugin/core/connectivity.py`. Each cell's connectivity score is
 * the minimum topographic wetness index found along its downstream flow path up
 * to the channel network, normalised to [0, 1] between the 5th and 95th
 * percentiles.
 */

import { nanPercentiles } from "./grid";
import { normalisePercentile } from "./erosion";

/** Maps WhiteboxTools D8 pointer value -> [dcol, drow] in array coordinates. */
export const WBT_D8: ReadonlyArray<readonly [number, number, number]> = [
  [1, 1, 0], //   E
  [2, 1, -1], //  NE
  [4, 0, -1], //  N
  [8, -1, -1], // NW
  [16, -1, 0], // W
  [32, -1, 1], // SW
  [64, 0, 1], //  S
  [128, 1, 1], // SE
];

export interface ConnectivityProgress {
  (progress: number, message?: string): void;
}

/** Downstream successor index per cell from a WhiteboxTools D8 pointer grid. */
export function buildDownstreamIndexFromD8(
  d8: Float64Array,
  valid: Uint8Array,
  width: number,
  height: number,
): Int32Array {
  const n = width * height;
  const downstream = new Int32Array(n).fill(-1);

  // Pointer value -> neighbour offset, indexed directly by the D8 code so the
  // whole grid resolves in one pass. Codes outside the table stay unlinked.
  const dcol = new Int8Array(129);
  const drow = new Int8Array(129);
  const known = new Uint8Array(129);
  for (const [value, dc, dr] of WBT_D8) {
    dcol[value] = dc;
    drow[value] = dr;
    known[value] = 1;
  }

  for (let fi = 0; fi < n; fi++) {
    const code = d8[fi];
    if (!Number.isInteger(code) || code < 0 || code > 128 || !known[code]) continue;

    const nr = ((fi / width) | 0) + drow[code];
    const nc = (fi % width) + dcol[code];
    if (nr < 0 || nr >= height || nc < 0 || nc >= width) continue;

    const next = nr * width + nc;
    // Only link into cells that are themselves valid, so flow paths terminate
    // at the edge of the catchment rather than leaking outside it.
    if (valid[next]) downstream[fi] = next;
  }
  return downstream;
}

/** Downstream successor index per cell by steepest descent over a filled DEM. */
export function buildDownstreamIndexFromDem(
  dem: Float64Array,
  valid: Uint8Array,
  width: number,
  height: number,
): Int32Array {
  const n = width * height;
  const downstream = new Int32Array(n).fill(-1);
  const sqrt2 = Math.SQRT2;

  // Same neighbour order as the Python kernel: N, NE, E, SE, S, SW, W, NW.
  const offsets: ReadonlyArray<readonly [number, number, number]> = [
    [-1, 0, 1.0],
    [-1, 1, sqrt2],
    [0, 1, 1.0],
    [1, 1, sqrt2],
    [1, 0, 1.0],
    [1, -1, sqrt2],
    [0, -1, 1.0],
    [-1, -1, sqrt2],
  ];

  for (let fi = 0; fi < n; fi++) {
    if (!valid[fi]) continue;

    const cr = (fi / width) | 0;
    const cc = fi % width;
    const z0 = dem[fi];
    let bestGrad = 0.0;
    let bestIdx = -1;

    for (const [dr, dc, dist] of offsets) {
      const nr = cr + dr;
      const nc = cc + dc;
      if (nr < 0 || nr >= height || nc < 0 || nc >= width) continue;
      const next = nr * width + nc;
      if (!valid[next]) continue;

      const grad = (z0 - dem[next]) / dist;
      if (grad > bestGrad) {
        bestGrad = grad;
        bestIdx = next;
      }
    }
    downstream[fi] = bestIdx;
  }
  return downstream;
}

/**
 * Flow-path connectivity by pointer doubling (binary lifting) over the
 * downstream successor map.
 *
 * Walking each cell's full downstream chain independently is O(N * L) with L the
 * average path length to the channel network — hundreds to thousands of cells in
 * real catchments, almost all of it redundant since neighbouring cells share
 * most of their path. Pointer doubling advances every cell's successor by 2x per
 * round, folding in the running min-TWI, so the raster converges in O(log L)
 * rounds of O(N) work.
 *
 * Recurrence solved, per valid cell x with successor d(x):
 *   f(x) = twi(x)                   if d(x) is absent
 *   f(x) = min(twi(x), twi(d(x)))   if d(x) is a channel/terminal cell
 *   f(x) = min(twi(x), f(d(x)))     otherwise
 */
function flowPathTracePointerDoubling(
  downstream: Int32Array,
  twi: Float64Array,
  valid: Uint8Array,
  terminal: Uint8Array,
  onProgress?: ConnectivityProgress,
): Float64Array {
  const n = twi.length;

  let val = new Float64Array(n).fill(NaN);
  let nxt = new Int32Array(n).fill(-1);
  let done = new Uint8Array(n);

  for (let fi = 0; fi < n; fi++) {
    if (!valid[fi]) continue;

    let v = twi[fi];
    const d = downstream[fi];
    if (d < 0) {
      val[fi] = v;
      done[fi] = 1;
    } else if (terminal[d]) {
      const dv = twi[d];
      if (Number.isFinite(dv) && dv < v) v = dv;
      val[fi] = v;
      done[fi] = 1;
    } else {
      val[fi] = v;
      nxt[fi] = d;
      done[fi] = 0;
    }
  }

  // Every round doubles the resolved path length, so convergence takes
  // ceil(log2(longest possible path)) rounds; +2 as a small safety margin, and
  // cycles are force-terminated once rounds are exhausted.
  const maxRounds = Math.max(1, Math.ceil(Math.log2(Math.max(n, 2))) + 2);

  for (let round = 0; round < maxRounds; round++) {
    let anyActive = false;
    for (let i = 0; i < n; i++) {
      if (valid[i] && !done[i]) {
        anyActive = true;
        break;
      }
    }
    if (!anyActive) break;

    const newVal = val.slice();
    const newNxt = nxt.slice();
    const newDone = done.slice();

    for (let fi = 0; fi < n; fi++) {
      if (done[fi]) continue;

      const j = nxt[fi];
      if (j < 0) {
        newDone[fi] = 1;
        continue;
      }

      let v = val[fi];
      const vj = val[j];
      if (Number.isFinite(vj) && vj < v) v = vj;

      newVal[fi] = v;
      newNxt[fi] = nxt[j];
      newDone[fi] = done[j];
    }

    val = newVal;
    nxt = newNxt;
    done = newDone;

    if (onProgress) {
      const frac = (round + 1) / maxRounds;
      const stage = Math.min(54, 51 + Math.round(frac * 3));
      onProgress(
        stage,
        `5.3 Tracing flow paths to channel network... round ${round + 1}/${maxRounds}`,
      );
    }
  }

  onProgress?.(54, "5.3 Tracing flow paths to channel network... 100%");

  const out = new Float64Array(n);
  for (let i = 0; i < n; i++) out[i] = valid[i] ? val[i] : NaN;
  return out;
}

/**
 * Rainfall-weighted topographic wetness index.
 *
 * `ln(|A| * rain + 1) - ln(tan(slope) + 0.001)`, evaluated only where every
 * input is finite so NoData does not leak into the trace.
 */
export function computeTwi(
  accum: Float64Array,
  slope: Float64Array,
  rainfallScaled: Float64Array,
): Float64Array {
  const n = slope.length;
  const twi = new Float64Array(n).fill(NaN);
  const toRadians = Math.PI / 180;

  for (let i = 0; i < n; i++) {
    const s = slope[i];
    const a = accum[i];
    const r = rainfallScaled[i];
    if (!Number.isFinite(s) || !Number.isFinite(a) || !Number.isFinite(r)) continue;

    // Keep TWI numerically stable: clamp slope and avoid non-positive logs.
    const slopeRad = Math.min(Math.max(s, 0), 89) * toRadians;
    const wetInput = Math.abs(a) * Math.max(r, 1e-6) + 1.0;
    const tanTerm = Math.tan(slopeRad + 0.001) + 0.001;
    if (wetInput <= 0 || tanTerm <= 0) continue;

    twi[i] = Math.log(wetInput) - Math.log(tanTerm);
  }
  return twi;
}

export interface FlowPathTraceOptions {
  width: number;
  height: number;
  /** Catchment mask; cells outside it never take part in the trace. */
  mask?: Uint8Array;
  /** Channel cells, which terminate a flow path. */
  channelMask?: Uint8Array;
  /** Filled DEM. When given, successors come from steepest descent, not D8. */
  dem?: Float64Array;
  onProgress?: ConnectivityProgress;
}

/** SCIMAP connectivity: trace each cell's flow path downstream to the network. */
export function computeConnectivityFlowPathTrace(
  d8: Float64Array,
  twi: Float64Array,
  options: FlowPathTraceOptions,
): Float64Array {
  const { width, height, mask, channelMask, dem, onProgress } = options;
  const n = twi.length;

  onProgress?.(46, "5.1 Preparing connectivity mask...");

  const valid = new Uint8Array(n);
  for (let i = 0; i < n; i++) {
    valid[i] = Number.isFinite(twi[i]) && (!mask || mask[i] === 1) ? 1 : 0;
  }

  const terminal = new Uint8Array(n);
  if (channelMask) {
    for (let i = 0; i < n; i++) terminal[i] = channelMask[i] && valid[i] ? 1 : 0;
  }

  onProgress?.(48, "5.2 Building downstream flow index...");

  const downstream = dem
    ? buildDownstreamIndexFromDem(dem, valid, width, height)
    : buildDownstreamIndexFromD8(d8, valid, width, height);

  onProgress?.(51, "5.3 Tracing flow paths to channel network... 0%");

  const conn = flowPathTracePointerDoubling(downstream, twi, valid, terminal, onProgress);

  onProgress?.(55, "5.4 Normalising connectivity scores...");

  // Normalise to [0, 1] using the 5th/95th percentile of the in-mask values.
  const validVals: number[] = [];
  for (let i = 0; i < n; i++) if (valid[i]) validVals.push(conn[i]);

  if (validVals.length > 0) {
    const [c5, c95Raw] = nanPercentiles(validVals, [5, 95]);
    if (Number.isFinite(c5)) {
      const c95 = c95Raw <= c5 ? c5 + 1.0 : c95Raw;
      const span = c95 - c5;
      for (let i = 0; i < n; i++) {
        conn[i] = valid[i] ? Math.min(Math.max((conn[i] - c5) / span, 0), 1) : NaN;
      }
    }
  }

  onProgress?.(57, "5.5 Connectivity computation complete.");
  return conn;
}

/**
 * Percentage Downslope Saturated Length (PDSL) index of connectivity.
 *
 * Port of SAGA-GIS's `CHCIC::downslopeSaturatedLength`. For each valid cell,
 * the D8 flow path is traced downstream - over a normalised wetness index
 * grid - until it reaches a channel cell or leaves the valid area. The
 * cell's score is the fraction of downstream path cells whose wetness is at
 * least as high as the starting cell's own wetness. Cells with no downstream
 * path (channel cells, or cells that immediately drain off the valid area)
 * score 1.0.
 *
 * Unlike the flow-path trace above, each cell's score depends on its own
 * threshold (its own wetness value), so the result can't be folded with
 * pointer doubling — every cell independently walks its downstream path.
 */
export function computePdsl(
  d8: Float64Array,
  twi: Float64Array,
  options: FlowPathTraceOptions,
): Float64Array {
  const { width, height, mask, channelMask, dem, onProgress } = options;
  const n = twi.length;

  onProgress?.(46, "5.1 Preparing PDSL inputs...");

  const valid = new Uint8Array(n);
  for (let i = 0; i < n; i++) {
    valid[i] = Number.isFinite(twi[i]) && (!mask || mask[i] === 1) ? 1 : 0;
  }

  const wet = normalisePercentile(twi, 5, 95);

  onProgress?.(48, "5.2 Building downstream flow index...");

  const downstream = dem
    ? buildDownstreamIndexFromDem(dem, valid, width, height)
    : buildDownstreamIndexFromD8(d8, valid, width, height);

  // Force channel cells to terminate downslope tracing, matching SAGA's
  // CHCIC::downslopeSaturatedLength (D8 flow direction set to NoData at
  // channel cells so hillslope paths stop once they reach the network).
  if (channelMask) {
    for (let i = 0; i < n; i++) {
      if (channelMask[i] && valid[i]) downstream[i] = -1;
    }
  }

  onProgress?.(51, "5.3 Tracing downslope saturated length... 0%");

  const pdsl = new Float64Array(n).fill(NaN);
  for (let fi = 0; fi < n; fi++) {
    if (!valid[fi]) continue;

    const minWet = wet[fi];
    let idx = fi;
    let idxFast = fi;
    let steps = 0;
    let saturated = 0;

    for (;;) {
      const idxNext = downstream[idx];
      if (idxNext < 0) break;

      const v = wet[idxNext];
      if (Number.isFinite(v) && v >= minWet) saturated++;

      idx = idxNext;
      steps++;

      // Cycle detection for cyclic D8 pointers.
      idxFast = downstream[idxFast];
      if (idxFast < 0) continue;
      idxFast = downstream[idxFast];
      if (idxFast >= 0 && idx === idxFast) break;

      if (steps >= n) break;
    }

    pdsl[fi] = steps === 0 ? 1.0 : saturated / steps;
  }

  onProgress?.(57, "5.5 PDSL computation complete.");
  return pdsl;
}

export type ConnectivityMethod = "flow_path_trace" | "pdsl";

/** Compute TWI then apply the selected connectivity solver. */
export function computeNetworkConnectivity(
  d8: Float64Array,
  accum: Float64Array,
  slope: Float64Array,
  rainfallScaled: Float64Array,
  options: FlowPathTraceOptions,
  method: ConnectivityMethod = "flow_path_trace",
): Float64Array {
  options.onProgress?.(46, "5.1 Preparing TWI inputs for connectivity...");
  const twi = computeTwi(accum, slope, rainfallScaled);
  options.onProgress?.(48, "5.2 TWI prepared; running connectivity solver...");
  if (method === "pdsl") return computePdsl(d8, twi, options);
  return computeConnectivityFlowPathTrace(d8, twi, options);
}
