/**
 * Flat row-major grid primitives shared by the SCIMAP compute core.
 *
 * The Python implementation leans on NumPy's NaN-aware reductions and masked
 * assignment. In TypeScript those become explicit loops over typed arrays, so
 * the semantics that matter for parity are pinned here in one place rather than
 * re-derived in every module.
 */

/** A single-band raster laid out row-major, `width * height` values long. */
export interface Grid {
  readonly width: number;
  readonly height: number;
  readonly data: Float64Array;
}

/** Georeferencing carried alongside a grid, in GDAL geo-transform order. */
export interface GridRef {
  readonly width: number;
  readonly height: number;
  /** `[xOrigin, pixelWidth, rowRotation, yOrigin, colRotation, pixelHeight]`. */
  readonly geoTransform: Float64Array;
  readonly epsg: number | undefined;
}

/** Area of one cell in CRS units squared, matching `abs(gt[1] * gt[5])`. */
export function cellArea(ref: GridRef): number {
  return Math.abs(ref.geoTransform[1] * ref.geoTransform[5]);
}

export function filled(n: number, value: number): Float64Array {
  const out = new Float64Array(n);
  if (value !== 0) out.fill(value);
  return out;
}

/**
 * Percentiles of the finite values in `values`, matching `np.nanpercentile`'s
 * default "linear" interpolation.
 *
 * Returns NaN for every requested percentile when nothing is finite, mirroring
 * NumPy's all-NaN behaviour rather than throwing.
 */
export function nanPercentiles(values: ArrayLike<number>, percentiles: number[]): number[] {
  const finite: number[] = [];
  for (let i = 0; i < values.length; i++) {
    const v = values[i];
    if (Number.isFinite(v)) finite.push(v);
  }
  if (finite.length === 0) return percentiles.map(() => NaN);

  finite.sort((a, b) => a - b);
  const last = finite.length - 1;

  return percentiles.map((p) => {
    const pos = (p / 100) * last;
    const lo = Math.floor(pos);
    const hi = Math.ceil(pos);
    if (lo === hi) return finite[lo];
    return finite[lo] + (finite[hi] - finite[lo]) * (pos - lo);
  });
}

/** Mean of the finite values under `mask`, or of all finite values when no mask. */
export function nanMean(values: ArrayLike<number>, mask?: Uint8Array): number {
  let sum = 0;
  let count = 0;
  for (let i = 0; i < values.length; i++) {
    if (mask && !mask[i]) continue;
    const v = values[i];
    if (Number.isFinite(v)) {
      sum += v;
      count += 1;
    }
  }
  return count === 0 ? NaN : sum / count;
}

/** Set every cell outside `mask` to NaN, in place. */
export function applyMask(data: Float64Array, mask: Uint8Array): Float64Array {
  for (let i = 0; i < data.length; i++) {
    if (!mask[i]) data[i] = NaN;
  }
  return data;
}

/**
 * Replace a raster's nodata sentinel with NaN.
 *
 * GeoTIFF nodata is compared exactly, as GDAL and the Python plugin both do
 * (`np.where(arr == nodata, np.nan, arr)`).
 */
export function nodataToNaN(data: Float64Array, nodata: number | undefined): Float64Array {
  if (nodata === undefined || !Number.isFinite(nodata)) return data;
  for (let i = 0; i < data.length; i++) {
    if (data[i] === nodata) data[i] = NaN;
  }
  return data;
}

/** Boolean validity mask: finite, and not equal to the nodata sentinel. */
export function validityMask(data: ArrayLike<number>, nodata: number | undefined): Uint8Array {
  const mask = new Uint8Array(data.length);
  const hasNodata = nodata !== undefined && Number.isFinite(nodata);
  for (let i = 0; i < data.length; i++) {
    const v = data[i];
    mask[i] = Number.isFinite(v) && !(hasNodata && v === nodata) ? 1 : 0;
  }
  return mask;
}
