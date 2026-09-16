#!/usr/bin/env python3
"""Emit golden reference arrays from the QGIS plugin's compute core.

The TypeScript port in ``src/core`` must reproduce ``qgis_plugin/core`` exactly.
This script runs the Python implementation over a small deterministic fixture
and writes the inputs and outputs as raw little-endian binaries plus a JSON
manifest, which ``test/parity.test.ts`` reads back and compares against.

The modules imported here are pure NumPy, so QGIS is not required::

    python3 scripts/dump_reference.py
"""

import json
import os
import sys

import numpy as np

# Import the QGIS plugin's core package without pulling in its QGIS-dependent
# siblings: `qgis_plugin.core.landcover` imports `..data.defaults`, so the
# repository root has to be on the path and the package imported by name.
REPO_ROOT = os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
sys.path.insert(0, REPO_ROOT)

from qgis_plugin.core import connectivity, erosion, landcover  # noqa: E402
from qgis_plugin.data.defaults import CEH_TO_SCIMAP, DEFAULT_WEIGHTS  # noqa: E402

OUT_DIR = os.path.join(os.path.dirname(os.path.dirname(os.path.abspath(__file__))), "test", "fixtures")

WIDTH, HEIGHT = 40, 32
CELL_SIZE = 25.0
CELL_AREA = CELL_SIZE * CELL_SIZE
STREAM_CELL_THRESHOLD = 12.0


def build_fixture():
    """A small synthetic catchment: a tilted bowl with a diagonal valley."""
    rng = np.random.default_rng(20260729)
    rows, cols = HEIGHT, WIDTH
    yy, xx = np.mgrid[0:rows, 0:cols].astype(np.float64)

    # Valley floor running diagonally, with a regional tilt and mild noise so
    # the flow field is non-trivial but fully reproducible.
    dem = (
        120.0
        - 0.9 * yy
        - 0.35 * xx
        + 6.0 * np.abs((xx * 0.6) - yy * 0.5) / 3.0
        + rng.normal(0.0, 0.15, size=(rows, cols))
    )

    # Carve a NoData notch so masking behaviour is exercised.
    mask = np.ones((rows, cols), dtype=bool)
    mask[0:3, 0:5] = False
    mask[rows - 2 :, cols - 6 :] = False

    slope = np.clip(np.abs(np.gradient(dem)[0]) * 12.0, 0.0, 89.0)
    accum = rng.gamma(shape=2.0, scale=9.0, size=(rows, cols))
    accum[~mask] = np.nan

    rainfall = 900.0 + 140.0 * (yy / max(rows - 1, 1)) + rng.normal(0.0, 8.0, size=(rows, cols))

    # D8 pointer derived from steepest descent, encoded WhiteboxTools-style.
    d8 = np.zeros((rows, cols), dtype=np.int32)
    codes = [(1, 1, 0), (2, 1, -1), (4, 0, -1), (8, -1, -1),
             (16, -1, 0), (32, -1, 1), (64, 0, 1), (128, 1, 1)]
    for r in range(rows):
        for c in range(cols):
            best_grad, best_code = 0.0, 0
            for code, dc, dr in codes:
                nr, nc = r + dr, c + dc
                if not (0 <= nr < rows and 0 <= nc < cols):
                    continue
                dist = np.hypot(dr, dc)
                grad = (dem[r, c] - dem[nr, nc]) / dist
                if grad > best_grad:
                    best_grad, best_code = grad, code
            d8[r, c] = best_code

    channel = (accum > 28.0) & mask

    lc_ids = rng.integers(1, 24, size=(rows, cols)).astype(np.float64)
    # Include an ID outside the CEH table so the fallback path is exercised.
    lc_ids[5, 5] = 99.0
    lc_ids[~mask] = np.nan

    return dem, slope, accum, rainfall, d8, mask, channel, lc_ids


def scale_rainfall(rain_arr, mask_arr):
    """Mirror of ScimapAlgorithmBase.scale_rainfall."""
    rain_mean = np.nanmean(rain_arr[mask_arr]) if np.any(mask_arr) else np.nanmean(rain_arr)
    if rain_mean == 0 or np.isnan(rain_mean):
        rain_mean = 1.0
    return rain_arr / rain_mean


def combine_scimap_output(erosion_risk, conn, accum, mask_arr, cell_area,
                          rain_scaled, stream_cell_threshold):
    """Mirror of ScimapAlgorithmBase.combine_scimap_output (local routing).

    Returns ``(risk_concentration, channel_risk_concentration)``: the first is
    the accumulated-risk / rainfall-weighted-area ratio valid over the whole
    catchment, the second restricts that same ratio to cells at or above
    ``stream_cell_threshold``.
    """
    tiny = 1e-10
    accum_masked = np.where(mask_arr, accum, np.nan)
    source_risk = erosion_risk * conn
    catchment_area = np.abs(accum_masked) * cell_area
    rainfall_weighted_catchment_area = catchment_area * rain_scaled
    scimap_routed_accum = source_risk * catchment_area

    risk_concentration = scimap_routed_accum / (rainfall_weighted_catchment_area + tiny)
    risk_concentration[~mask_arr] = np.nan

    channel_risk_concentration = np.where(
        np.abs(accum_masked) >= stream_cell_threshold, risk_concentration, np.nan,
    )
    channel_risk_concentration[~mask_arr] = np.nan

    return risk_concentration, channel_risk_concentration


def main():
    os.makedirs(OUT_DIR, exist_ok=True)
    dem, slope, accum, rainfall, d8, mask, channel, lc_ids = build_fixture()

    rain_scaled = scale_rainfall(rainfall, mask)

    slope_masked = np.where(mask, slope, np.nan)
    accum_masked = np.where(mask, accum, np.nan)

    twi = connectivity.compute_twi(accum_masked, slope_masked, rain_scaled)

    conn_d8 = connectivity.compute_connectivity_flow_path_trace(
        d8, twi, mask, channel, None,
    )
    conn_dem = connectivity.compute_connectivity_flow_path_trace(
        d8, twi, mask, channel, dem,
    )
    pdsl_d8 = connectivity.compute_pdsl(
        d8, twi, mask, channel, None,
    )
    pdsl_dem = connectivity.compute_pdsl(
        d8, twi, mask, channel, dem,
    )

    eros_raw = erosion.compute_erosion_risk(accum_masked, slope_masked, CELL_AREA, True)
    eros_no_power = erosion.compute_erosion_risk(accum_masked, slope_masked, CELL_AREA, False)

    risk_weight, scimap_classes = landcover.build_risk_weight(
        lc_ids, DEFAULT_WEIGHTS, CEH_TO_SCIMAP,
        already_scimap=False, fallback_class=7,
    )

    erosion_risk = erosion.normalise_percentile(eros_raw * risk_weight, 5, 95)
    erosion_risk[~mask] = np.nan

    risk_concentration, channel_risk_concentration = combine_scimap_output(
        erosion_risk, conn_d8, accum, mask, CELL_AREA, rain_scaled, STREAM_CELL_THRESHOLD,
    )

    arrays = {
        "dem": dem,
        "slope": slope_masked,
        "accum": accum_masked,
        "rainfall": rainfall,
        "d8": d8.astype(np.float64),
        "mask": mask.astype(np.uint8),
        "channel": channel.astype(np.uint8),
        "landcover": lc_ids,
        "rain_scaled": rain_scaled,
        "twi": twi,
        "connectivity_d8": conn_d8,
        "connectivity_dem": conn_dem,
        "pdsl_d8": pdsl_d8,
        "pdsl_dem": pdsl_dem,
        "erosion_raw": eros_raw,
        "erosion_no_power": eros_no_power,
        "risk_weight": risk_weight,
        "scimap_classes": scimap_classes,
        "erosion_risk": erosion_risk,
        "risk_concentration": risk_concentration,
        "channel_risk_concentration": channel_risk_concentration,
    }

    for name, arr in arrays.items():
        dtype = np.uint8 if arr.dtype == np.uint8 else np.float64
        arr.astype(dtype).ravel(order="C").tofile(os.path.join(OUT_DIR, f"{name}.bin"))

    manifest = {
        "width": WIDTH,
        "height": HEIGHT,
        "cellSize": CELL_SIZE,
        "cellArea": CELL_AREA,
        "streamCellThreshold": STREAM_CELL_THRESHOLD,
        "arrays": {
            name: "u8" if arr.dtype == np.uint8 else "f64" for name, arr in arrays.items()
        },
    }
    with open(os.path.join(OUT_DIR, "manifest.json"), "w", encoding="utf-8") as handle:
        json.dump(manifest, handle, indent=2)

    print(f"Wrote {len(arrays)} reference arrays ({WIDTH}x{HEIGHT}) to {OUT_DIR}")


if __name__ == "__main__":
    main()
