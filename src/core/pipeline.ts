/**
 * The SCIMAP Sediment and Network Index pipelines.
 *
 * Ports `ScimapRiskAlgorithm.processAlgorithm` (via `sediment.py`) and
 * `ScimapNetworkIndexAlgorithm.processAlgorithm` from the QGIS plugin. Every
 * numeric step delegates to the parity-tested modules in this directory; what
 * lives here is the orchestration and the output packaging.
 */

import {
  CEH_TO_SCIMAP,
  DEFAULT_WEIGHTS,
  FD8_EXPONENT,
  RAMP_CONNECTIVITY,
  RAMP_EROSION,
  RAMP_LANDCOVER,
  UNMAPPED_FALLBACK_CLASS,
  type ColourRamp,
} from "../data/defaults";
import { combineScimapOutput, scaleRainfall } from "./combine";
import { computeNetworkConnectivity, type ConnectivityMethod } from "./connectivity";
import { computeErosionRisk, normalisePercentile } from "./erosion";
import { applyMask, type GridRef } from "./grid";
import { runHydrology, type DepressionMethod, type HydrologyResult } from "./hydrology";
import { buildRiskWeight } from "./landcover";
import { buildPointVector } from "./points";
import { alignToReference, decodeRaster, encodeByteCog, encodeCog, readRasterRef } from "./raster";
import { buildStreamNetwork } from "./streams";
import { requireFile, run } from "./tools";

export type Progress = (progress: number, message?: string) => void;

/** A raster ready to be handed to `addCogLayer`. */
export interface RasterOutput {
  key: string;
  name: string;
  cog: Uint8Array;
  ramp: ColourRamp;
  rescale: [number, number];
}

export interface VectorOutput {
  key: string;
  name: string;
  geojson: unknown;
  riskField: string;
}

export interface PipelineResult {
  rasters: RasterOutput[];
  vectors: VectorOutput[];
  ref: GridRef;
  /** Human-readable notes surfaced in the panel's log. */
  notes: string[];
}

export interface SedimentInputs {
  dem: Uint8Array;
  landcover: Uint8Array;
  rainfall: Uint8Array;
  streamThresholdM2: number;
  useStreamPower: boolean;
  depressionMethod: DepressionMethod;
  landcoverIsPreweighted: boolean;
  landcoverIsScimapClasses: boolean;
  weights: ReadonlyMap<number, number>;
  remap: ReadonlyMap<number, number>;
  fallbackClass: number;
  ramp?: ColourRamp | null;
  emitLandcoverClasses: boolean;
  /** Also export the "Stream Risk Points" vector (one point per stream cell). */
  emitStreamRiskPoints: boolean;
  /** Connectivity algorithm; defaults to the Network Index flow-path trace. */
  connectivityMethod?: ConnectivityMethod;
}

export interface NetworkIndexInputs {
  dem: Uint8Array;
  streamThresholdM2: number;
  depressionMethod: DepressionMethod;
  ramp?: ColourRamp | null;
  /** Connectivity algorithm; defaults to the Network Index flow-path trace. */
  connectivityMethod?: ConnectivityMethod;
}

/** Honour a single user-chosen ramp, else the per-layer SCIMAP default. */
function pickRamp(override: ColourRamp | null | undefined, fallback: ColourRamp): ColourRamp {
  return override ?? fallback;
}

/**
 * Fail early when the DEM carries no embedded CRS.
 *
 * `encodeCog`/`encodeByteCog` skip `set_epsg` for an undefined EPSG, so every
 * output raster of a CRS-less run would silently ship with no georeferencing
 * at all. GeoLibre's own COG loader crashes on that (an unhandled promise
 * rejection deep in its GeoTIFF/CRS parser) rather than reporting it, so this
 * catches the same condition here with a message the user can act on.
 */
function requireDemCrs(demRef: GridRef): void {
  if (demRef.epsg === undefined) {
    throw new Error(
      "The DEM has no coordinate reference system embedded in its GeoTIFF " +
        "metadata (a sidecar .prj or .tfw file is not enough). Re-save it " +
        "with its CRS embedded — e.g. `gdal_translate -a_srs EPSG:<code> " +
        "-of COG in.tif out.tif` — and try again.",
    );
  }
}

/**
 * Route an area-weighted loading downslope with WhiteboxTools `dinf_mass_flux`.
 * Returns null on failure so the caller falls back to local scaling exactly
 * as the QGIS plugin does.
 */
async function routeMassFlux(
  hydro: HydrologyResult,
  loading: Float64Array,
  label: string,
  notes: string[],
): Promise<Float64Array | null> {
  try {
    const n = loading.length;
    const ones = new Float64Array(n).fill(1);
    const zeros = new Float64Array(n);

    const files = await run(
      "dinfMassFlux",
      {
        dem: "/work/dem_fill.tif",
        loading: "/work/loading.tif",
        efficiency: "/work/efficiency.tif",
        absorption: "/work/absorption.tif",
        output: "/work/routed_accum.tif",
      },
      {
        "dem_fill.tif": hydro.files.demFilled,
        "loading.tif": encodeCog(loading, { ref: hydro.ref }),
        "efficiency.tif": encodeCog(ones, { ref: hydro.ref }),
        "absorption.tif": encodeCog(zeros, { ref: hydro.ref }),
      },
    );

    const routed = await decodeRaster(
      requireFile(files, "routed_accum.tif", "dinf_mass_flux"),
    );
    return applyMask(routed.data, hydro.mask);
  } catch (error) {
    notes.push(
      `${label} mass-flux routing failed (${
        error instanceof Error ? error.message : String(error)
      }); using local scaling fallback.`,
    );
    return null;
  }
}

/**
 * Rainfall-weighted contributing area via `dinf_mass_flux`, matching the web
 * application.
 */
async function routeRainfallMassFlux(
  hydro: HydrologyResult,
  rainScaled: Float64Array,
  notes: string[],
): Promise<Float64Array | null> {
  const n = rainScaled.length;
  // Rainfall as a local mass input in m²-equivalent units, so the routed
  // accumulation can be used directly as rainfall-weighted catchment area.
  const loading = new Float64Array(n);
  for (let i = 0; i < n; i++) {
    loading[i] = Number.isFinite(rainScaled[i]) ? rainScaled[i] * hydro.cellArea : 0;
  }
  return routeMassFlux(hydro, loading, "Rainfall-weighted", notes);
}

/**
 * Routed accumulation of the erosion x connectivity risk loading via
 * `dinf_mass_flux`, matching the web application: the numerator is
 * area-weighted risk loading routed the same way as the rainfall
 * denominator, so the ratio stays on a common areal basis and reflects risk
 * contributed from the entire upslope area, not only in-channel cells.
 */
async function routeRiskMassFlux(
  hydro: HydrologyResult,
  sourceRisk: Float64Array,
  notes: string[],
): Promise<Float64Array | null> {
  const n = sourceRisk.length;
  const loading = new Float64Array(n);
  for (let i = 0; i < n; i++) {
    loading[i] = Number.isFinite(sourceRisk[i]) ? sourceRisk[i] * hydro.cellArea : 0;
  }
  return routeMassFlux(hydro, loading, "Erosion-connectivity risk", notes);
}

/** SCIMAP Sediment: fine sediment and diffuse pollution risk. */
export async function runSediment(
  inputs: SedimentInputs,
  onProgress: Progress = () => {},
): Promise<PipelineResult> {
  const notes: string[] = [];

  const demRef = await readRasterRef(inputs.dem);
  requireDemCrs(demRef);

  // Cell size is needed to convert the user's threshold (m²) into cells
  // before hydrology runs, so stream extraction actually uses it rather than
  // a fixed fallback.
  const probeCellArea = Math.abs(demRef.geoTransform[1] * demRef.geoTransform[5]);
  const streamCellThreshold = Math.max(1, inputs.streamThresholdM2 / probeCellArea);

  const hydro = await runHydrology({
    demBytes: inputs.dem,
    streamThreshold: streamCellThreshold,
    depressionMethod: inputs.depressionMethod,
    onProgress,
  });

  onProgress(26, "3. Aligning rainfall and land cover to the DEM grid...");

  const rainfallAligned = await alignToReference(
    inputs.rainfall, inputs.dem, demRef, "bilinear",
  );
  const landcoverAligned = await alignToReference(
    inputs.landcover, inputs.dem, demRef, "nn",
  );

  const rainfall = await decodeRaster(rainfallAligned);
  const landcover = await decodeRaster(landcoverAligned);

  const rainScaled = scaleRainfall(rainfall.data, hydro.mask);

  // Mask land cover to the catchment before weighting, as the QGIS plugin does.
  const landcoverMasked = applyMask(landcover.data.slice(), hydro.mask);

  onProgress(30, "4. Building the land cover risk weighting...");

  let riskWeight: Float64Array;
  let scimapClasses: Float64Array | null = null;

  if (inputs.landcoverIsPreweighted) {
    notes.push("Using the land cover raster directly as a risk weighting.");
    riskWeight = landcoverMasked;
  } else {
    const built = buildRiskWeight(landcoverMasked, {
      weights: inputs.weights.size > 0 ? inputs.weights : DEFAULT_WEIGHTS,
      remap: inputs.remap.size > 0 ? inputs.remap : CEH_TO_SCIMAP,
      alreadyScimap: inputs.landcoverIsScimapClasses,
      fallbackClass: inputs.fallbackClass || UNMAPPED_FALLBACK_CLASS,
    });
    riskWeight = built.riskWeight;
    scimapClasses = built.scimapClasses;

    if (built.unmapped.length > 0) {
      notes.push(
        `Unassigned land-cover IDs in the catchment (${built.unmapped.length}): ` +
          built.unmapped.join(", "),
      );
    }
    if (built.fallbackCells > 0) {
      notes.push(
        `Applied fallback SCIMAP class ${inputs.fallbackClass} weight to ` +
          `${built.fallbackCells} unmapped cells.`,
      );
    }
  }

  onProgress(
    34,
    `4. Computing Erosion Risk (${inputs.useStreamPower ? "stream power" : "upslope area only"})...`,
  );

  const slope = applyMask(hydro.slope.slice(), hydro.mask);
  const accumMasked = applyMask(hydro.accum.slice(), hydro.mask);

  const erosionRaw = computeErosionRisk(
    accumMasked, slope, hydro.cellArea, inputs.useStreamPower,
  );
  for (let i = 0; i < erosionRaw.length; i++) erosionRaw[i] *= riskWeight[i];

  const erosionRisk = applyMask(normalisePercentile(erosionRaw, 5, 95), hydro.mask);

  onProgress(45, "5. Computing Network Connectivity...");

  const connectivity = computeNetworkConnectivity(
    hydro.d8, hydro.accum, slope, rainScaled,
    {
      width: hydro.ref.width,
      height: hydro.ref.height,
      mask: hydro.mask,
      channelMask: hydro.channelMask,
      dem: hydro.demFilled,
      onProgress,
    },
    inputs.connectivityMethod ?? "flow_path_trace",
  );

  onProgress(58, "6. Computing FD8-based rainfall-weighted and SCIMAP routed proxies...");

  // Always route both terms with WhiteboxTools DInfMassFlux, matching the
  // SCIMAP web application: the numerator is area-weighted risk loading and
  // the denominator area-weighted rainfall, so the ratio stays on a common
  // areal basis. `combineScimapOutput` falls back to local scaling on
  // failure. Only attempt to route the risk term if rainfall routing itself
  // succeeded — if `dinf_mass_flux` is broken, it's broken for both.
  const rainfallWeightedArea = await routeRainfallMassFlux(hydro, rainScaled, notes);

  const sourceRisk = new Float64Array(erosionRisk.length);
  for (let i = 0; i < sourceRisk.length; i++) {
    sourceRisk[i] = erosionRisk[i] * connectivity[i];
  }
  const scimapRoutedAccum = rainfallWeightedArea
    ? await routeRiskMassFlux(hydro, sourceRisk, notes)
    : null;

  const combined = combineScimapOutput({
    erosionRisk,
    connectivity,
    accum: hydro.accum,
    mask: hydro.mask,
    cellArea: hydro.cellArea,
    rainfallScaled: rainScaled,
    streamCellThreshold,
    rainfallWeightedArea,
    scimapRoutedAccum,
  });

  onProgress(70, "7. Encoding output rasters...");

  const ramp = inputs.ramp ?? null;
  const rasters: RasterOutput[] = [
    {
      key: "erosion",
      name: "SCIMAP Erosion Risk",
      cog: encodeCog(erosionRisk, { ref: hydro.ref }),
      ramp: pickRamp(ramp, RAMP_EROSION),
      rescale: [0, 1],
    },
    {
      key: "connectivity",
      name: "SCIMAP Network Connectivity",
      cog: encodeCog(connectivity, { ref: hydro.ref }),
      ramp: pickRamp(ramp, RAMP_CONNECTIVITY),
      rescale: [0, 1],
    },
  ];

  if (inputs.emitLandcoverClasses && scimapClasses) {
    rasters.push({
      key: "landcover_classes",
      name: "SCIMAP Land Cover Classes",
      cog: encodeByteCog(scimapClasses, hydro.ref),
      ramp: pickRamp(ramp, RAMP_LANDCOVER),
      rescale: [0, 7],
    });
  }

  onProgress(82, "8. Generating the Instream Risk Concentration network...");

  const vectors: VectorOutput[] = [];
  try {
    // Sample the un-gated ratio so every reach the vector network actually
    // covers gets a value, rather than only the (much coarser) reaches above
    // the stream initiation threshold.
    const network = await buildStreamNetwork({
      hydrologyFiles: hydro.files,
      risk: combined.riskConcentration,
      ref: hydro.ref,
    });
    vectors.push({
      key: "streams",
      name: "Instream Risk Concentration",
      geojson: network.geojson,
      riskField: "Risk",
    });
    notes.push(`Instream risk concentration network: ${network.featureCount} features.`);
  } catch (error) {
    notes.push(
      `Could not build the instream risk concentration network (${
        error instanceof Error ? error.message : String(error)
      }).`,
    );
  }

  if (inputs.emitStreamRiskPoints) {
    onProgress(92, "9. Exporting stream risk points...");
    const points = buildPointVector(combined.channelRiskConcentration, hydro.ref, "scimap_risk");
    vectors.push({
      key: "stream_risk_points",
      name: "Stream Risk Points",
      geojson: points.geojson,
      riskField: "scimap_risk",
    });
    notes.push(`Stream risk points: ${points.featureCount} features.`);
  }

  onProgress(100, "SCIMAP Sediment complete.");
  return { rasters, vectors, ref: hydro.ref, notes };
}

/** Network Index: connectivity from a DEM alone, with uniform rainfall. */
export async function runNetworkIndex(
  inputs: NetworkIndexInputs,
  onProgress: Progress = () => {},
): Promise<PipelineResult> {
  const notes: string[] = [];

  // Stream extraction here uses the user's own threshold rather than the fixed
  // vector-network threshold the risk tools use.
  const demRef = await readRasterRef(inputs.dem);
  requireDemCrs(demRef);
  const probeCellArea = Math.abs(demRef.geoTransform[1] * demRef.geoTransform[5]);
  const streamCellThreshold = Math.max(1, inputs.streamThresholdM2 / probeCellArea);

  const hydro = await runHydrology({
    demBytes: inputs.dem,
    streamThreshold: streamCellThreshold,
    depressionMethod: inputs.depressionMethod,
    onProgress,
  });

  onProgress(45, "3. Loading arrays and computing network index...");

  const slope = applyMask(hydro.slope.slice(), hydro.mask);
  const accum = applyMask(hydro.accum.slice(), hydro.mask);
  const uniformRain = new Float64Array(accum.length).fill(1);

  const connectivityMethod = inputs.connectivityMethod ?? "flow_path_trace";
  const networkIndex = computeNetworkConnectivity(hydro.d8, accum, slope, uniformRain, {
    width: hydro.ref.width,
    height: hydro.ref.height,
    mask: hydro.mask,
    channelMask: hydro.channelMask,
    dem: hydro.demFilled,
    onProgress,
  }, connectivityMethod);

  onProgress(85, "4. Encoding the connectivity raster...");

  notes.push(`FD8 exponent ${FD8_EXPONENT}, ${hydro.channelMask.reduce((a, b) => a + b, 0)} channel cells.`);

  const outputName = connectivityMethod === "pdsl"
    ? "SCIMAP PDSL (Percentage Downslope Saturated Length)"
    : "SCIMAP Network Index";

  onProgress(100, `${connectivityMethod === "pdsl" ? "PDSL" : "Network Index"} complete.`);
  return {
    rasters: [
      {
        key: connectivityMethod === "pdsl" ? "pdsl" : "network_index",
        name: outputName,
        cog: encodeCog(networkIndex, { ref: hydro.ref }),
        ramp: pickRamp(inputs.ramp ?? null, RAMP_CONNECTIVITY),
        rescale: [0, 1],
      },
    ],
    vectors: [],
    ref: hydro.ref,
    notes,
  };
}
