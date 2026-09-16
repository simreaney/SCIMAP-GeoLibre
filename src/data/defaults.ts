/**
 * SCIMAP land-cover classes, remap tables and default risk weights.
 *
 * Transcribed from `qgis_plugin/data/defaults.py`, which in turn lifts these
 * from `config.yaml` in the SCIMAP web application. Keep the two in step.
 */

/** SCIMAP land-cover classes shown in the parameters table. */
export const SCIMAP_CLASSES: ReadonlyArray<readonly [number, string]> = [
  [1, "Woodland"],
  [2, "Arable"],
  [3, "Improved Grassland"],
  [4, "Extensive Grassland"],
  [5, "Moorland"],
  [6, "Urban"],
  [7, "Other"],
];

export const SCIMAP_CLASS_NAMES: ReadonlyMap<number, string> = new Map(SCIMAP_CLASSES);

/**
 * Any valid land-cover value not explicitly listed in CEH_TO_SCIMAP is
 * assigned to this SCIMAP class.
 */
export const UNMAPPED_FALLBACK_CLASS = 7;

/** CEH Land Cover Map class IDs (1-23) -> SCIMAP classes (1-7). */
export const CEH_TO_SCIMAP: ReadonlyMap<number, number> = new Map([
  [1, 1], //  Broadleaved woodland -> Woodland
  [2, 1], //  Coniferous woodland -> Woodland
  [3, 2], //  Arable and horticulture -> Arable
  [4, 3], //  Improved grassland -> Improved Grassland
  [5, 4], //  Rough grassland -> Extensive Grassland
  [6, 4], //  Neutral grassland -> Extensive Grassland
  [7, 4], //  Calcareous grassland -> Extensive Grassland
  [8, 4], //  Acid grassland -> Extensive Grassland
  [9, 5], //  Fen, marsh, swamp -> Moorland
  [10, 5], // Heather -> Moorland
  [11, 5], // Heather grassland -> Moorland
  [12, 5], // Bog -> Moorland
  [13, 5], // Montane habitats -> Moorland
  [14, 7], // Inland rock -> Other
  [15, 7], // Saltwater -> Other
  [16, 7], // Freshwater -> Other
  [17, 7], // Supra-littoral rock -> Other
  [18, 7], // Supra-littoral sediment -> Other
  [19, 7], // Littoral rock -> Other
  [20, 7], // Littoral sediment -> Other
  [21, 7], // Saltmarsh -> Other
  [22, 6], // Urban -> Urban
  [23, 6], // Suburban -> Urban
]);

/** Default SCIMAP Sediment risk weights by SCIMAP class ID. */
export const DEFAULT_WEIGHTS: ReadonlyMap<number, number> = new Map([
  [1, 0.2], //  Woodland
  [2, 1.0], //  Arable
  [3, 0.3], //  Improved Grassland
  [4, 0.15], // Extensive Grassland
  [5, 0.3], //  Moorland
  [6, 0.5], //  Urban
  [7, 0.5], //  Other
]);

/** Colour ramps offered for result styling; matches the web application's whitelist. */
export const COLOUR_RAMPS = [
  "magma",
  "viridis",
  "plasma",
  "inferno",
  "cividis",
  "spectral",
  "turbo",
] as const;

export type ColourRamp = (typeof COLOUR_RAMPS)[number];

/** Per-layer ramp defaults, mirroring the QGIS plugin's RAMP_* constants. */
export const RAMP_EROSION: ColourRamp = "magma";
export const RAMP_CONNECTIVITY: ColourRamp = "viridis";
export const RAMP_SCIMAP: ColourRamp = "plasma";
export const RAMP_LANDCOVER: ColourRamp = "viridis";

/**
 * Stream-network extraction threshold used by the risk tools, matching the web
 * application. The resulting channel cells are the terminal targets for
 * connectivity routing, and are independent of the user's stream initiation
 * threshold (which only controls which cells carry a SCIMAP score).
 */
export const STREAM_VECTOR_THRESHOLD = 250;

/** Default stream initiation threshold in m². */
export const DEFAULT_STREAM_THRESHOLD_M2 = 800000.0;

/** FD8 flow accumulation exponent used throughout SCIMAP. */
export const FD8_EXPONENT = 2.0;
