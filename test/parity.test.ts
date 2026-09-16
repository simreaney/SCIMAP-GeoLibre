/**
 * Golden-file parity against the QGIS plugin's Python core.
 *
 * Fixtures are produced by `scripts/dump_reference.py`, which runs
 * `qgis_plugin/core` over a small synthetic catchment. If these fail, the
 * TypeScript port has drifted from the reference implementation.
 */

import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { describe, expect, it } from "vitest";

import {
  computeConnectivityFlowPathTrace,
  computePdsl,
  computeTwi,
} from "../src/core/connectivity";
import { combineScimapOutput, scaleRainfall } from "../src/core/combine";
import { computeErosionRisk, normalisePercentile } from "../src/core/erosion";
import { buildRiskWeight } from "../src/core/landcover";
import { CEH_TO_SCIMAP, DEFAULT_WEIGHTS } from "../src/data/defaults";

const FIXTURES = fileURLToPath(new URL("./fixtures/", import.meta.url));

interface Manifest {
  width: number;
  height: number;
  cellArea: number;
  streamCellThreshold: number;
  arrays: Record<string, "f64" | "u8">;
}

const manifest: Manifest = JSON.parse(
  readFileSync(new URL("./fixtures/manifest.json", import.meta.url), "utf-8"),
);

function loadF64(name: string): Float64Array {
  const buf = readFileSync(`${FIXTURES}${name}.bin`);
  return new Float64Array(buf.buffer, buf.byteOffset, buf.byteLength / 8);
}

function loadU8(name: string): Uint8Array {
  const buf = readFileSync(`${FIXTURES}${name}.bin`);
  return new Uint8Array(buf.buffer, buf.byteOffset, buf.byteLength);
}

/**
 * Assert two arrays agree, treating NaN as a matching value so the NoData
 * pattern is compared as strictly as the numbers are.
 */
function expectClose(actual: Float64Array, expected: Float64Array, tolerance = 1e-9): void {
  expect(actual.length).toBe(expected.length);

  let mismatches = 0;
  let worst = 0;
  let worstIndex = -1;

  for (let i = 0; i < expected.length; i++) {
    const a = actual[i];
    const e = expected[i];
    const aNaN = Number.isNaN(a);
    const eNaN = Number.isNaN(e);

    if (aNaN !== eNaN) {
      mismatches += 1;
      if (worstIndex < 0) worstIndex = i;
      continue;
    }
    if (aNaN) continue;

    const diff = Math.abs(a - e);
    if (diff > worst) {
      worst = diff;
      if (diff > tolerance) worstIndex = i;
    }
    if (diff > tolerance) mismatches += 1;
  }

  if (mismatches > 0) {
    const i = worstIndex;
    throw new Error(
      `${mismatches}/${expected.length} values differ (max abs diff ${worst}); ` +
        `first at index ${i}: got ${actual[i]}, expected ${expected[i]}`,
    );
  }
}

const { width, height, cellArea, streamCellThreshold } = manifest;

const dem = loadF64("dem");
const slope = loadF64("slope");
const accum = loadF64("accum");
const rainfall = loadF64("rainfall");
const d8 = loadF64("d8");
const mask = loadU8("mask");
const channel = loadU8("channel");
const landcover = loadF64("landcover");

describe("fixture", () => {
  it("matches the declared grid size", () => {
    expect(dem.length).toBe(width * height);
  });
});

describe("scaleRainfall", () => {
  it("matches the Python in-catchment mean normalisation", () => {
    expectClose(scaleRainfall(rainfall, mask), loadF64("rain_scaled"));
  });
});

describe("computeTwi", () => {
  it("matches the Python rainfall-weighted TWI", () => {
    const rainScaled = loadF64("rain_scaled");
    expectClose(computeTwi(accum, slope, rainScaled), loadF64("twi"));
  });
});

describe("computeErosionRisk", () => {
  it("matches with stream power", () => {
    expectClose(computeErosionRisk(accum, slope, cellArea, true), loadF64("erosion_raw"));
  });

  it("matches with upslope area only", () => {
    expectClose(
      computeErosionRisk(accum, slope, cellArea, false),
      loadF64("erosion_no_power"),
    );
  });
});

describe("buildRiskWeight", () => {
  it("matches the Python remap, reclass and fallback backfill", () => {
    const result = buildRiskWeight(landcover, {
      weights: DEFAULT_WEIGHTS,
      remap: CEH_TO_SCIMAP,
      alreadyScimap: false,
      fallbackClass: 7,
    });
    expectClose(result.riskWeight, loadF64("risk_weight"));
    expectClose(result.scimapClasses, loadF64("scimap_classes"));
  });

  it("reports the land-cover ID that is absent from the weight table", () => {
    const result = buildRiskWeight(landcover, {
      weights: DEFAULT_WEIGHTS,
      remap: CEH_TO_SCIMAP,
      alreadyScimap: false,
      fallbackClass: 7,
    });
    // The fixture plants a 99 that no CEH remap entry covers.
    expect(result.unmapped).toContain(99);
    expect(result.fallbackCells).toBeGreaterThan(0);
  });
});

describe("normalisePercentile", () => {
  it("matches np.nanpercentile-based rescaling", () => {
    const erosionRaw = loadF64("erosion_raw");
    const riskWeight = loadF64("risk_weight");
    const scaled = new Float64Array(erosionRaw.length);
    for (let i = 0; i < scaled.length; i++) scaled[i] = erosionRaw[i] * riskWeight[i];

    const normalised = normalisePercentile(scaled, 5, 95);
    for (let i = 0; i < normalised.length; i++) {
      if (!mask[i]) normalised[i] = NaN;
    }
    expectClose(normalised, loadF64("erosion_risk"));
  });
});

describe("computeConnectivityFlowPathTrace", () => {
  const twi = loadF64("twi");

  it("matches the Python trace over the D8 pointer grid", () => {
    const result = computeConnectivityFlowPathTrace(d8, twi, {
      width,
      height,
      mask,
      channelMask: channel,
    });
    expectClose(result, loadF64("connectivity_d8"));
  });

  it("matches the Python trace over the steepest-descent DEM successors", () => {
    const result = computeConnectivityFlowPathTrace(d8, twi, {
      width,
      height,
      mask,
      channelMask: channel,
      dem,
    });
    expectClose(result, loadF64("connectivity_dem"));
  });
});

describe("computePdsl", () => {
  const twi = loadF64("twi");

  it("matches the Python PDSL trace over the D8 pointer grid", () => {
    const result = computePdsl(d8, twi, {
      width,
      height,
      mask,
      channelMask: channel,
    });
    expectClose(result, loadF64("pdsl_d8"));
  });

  it("matches the Python PDSL trace over the steepest-descent DEM successors", () => {
    const result = computePdsl(d8, twi, {
      width,
      height,
      mask,
      channelMask: channel,
      dem,
    });
    expectClose(result, loadF64("pdsl_dem"));
  });
});

describe("combineScimapOutput", () => {
  it("matches the Python risk-concentration combination", () => {
    const result = combineScimapOutput({
      erosionRisk: loadF64("erosion_risk"),
      connectivity: loadF64("connectivity_d8"),
      accum,
      mask,
      cellArea,
      rainfallScaled: loadF64("rain_scaled"),
      streamCellThreshold,
    });
    expectClose(result.riskConcentration, loadF64("risk_concentration"));
    expectClose(result.channelRiskConcentration, loadF64("channel_risk_concentration"));
  });
});
