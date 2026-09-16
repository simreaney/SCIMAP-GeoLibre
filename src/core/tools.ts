/**
 * The WhiteboxTools contract SCIMAP depends on, and a thin runner wrapper.
 *
 * GeoLibre ships `whitebox_next_gen` compiled to WASI WebAssembly, run over an
 * in-memory `/work` filesystem. Tool ids and parameter names differ from the
 * CamelCase ones the QGIS plugin passes to the native `whitebox_tools` binary,
 * so they are pinned here and asserted against `listManifests()` in
 * `test/tools.test.ts` — a rename upstream should fail a test, not a user's run.
 */

import { runTool } from "geolibre-wasm/tools";

/** Tool id + the parameter names this plugin actually passes. */
export const TOOL_CONTRACT = {
  breachDepressions: {
    id: "breach_depressions_least_cost",
    params: ["dem", "output", "max_dist", "fill_deps"],
  },
  fillDepressions: {
    id: "fill_depressions",
    params: ["dem", "output", "fix_flats"],
  },
  slope: {
    id: "slope",
    // Note: `input`, not `dem` as the native WhiteboxTools binary uses.
    params: ["input", "output", "units"],
  },
  fd8FlowAccum: {
    id: "fd8_flow_accum",
    params: ["dem", "output", "out_type", "exponent"],
  },
  d8FlowAccum: {
    id: "d8_flow_accum",
    // Note: `input`, not `dem` as the native WhiteboxTools binary uses.
    params: ["input", "output", "out_type"],
  },
  d8Pointer: {
    id: "d8_pointer",
    params: ["dem", "output", "esri_pntr"],
  },
  extractStreams: {
    id: "extract_streams",
    // Note: `flow_accumulation`, not `flow_accum`.
    params: ["flow_accumulation", "output", "threshold"],
  },
  rasterStreamsToVector: {
    id: "raster_streams_to_vector",
    // Note: `streams_raster`, not `streams`.
    params: ["streams_raster", "d8_pntr", "output", "esri_pntr"],
  },
  dinfMassFlux: {
    id: "dinf_mass_flux",
    params: ["dem", "loading", "efficiency", "absorption", "output"],
  },
  resample: {
    id: "resample",
    params: ["inputs", "base", "method", "output"],
  },
} as const;

export type ToolKey = keyof typeof TOOL_CONTRACT;

export class ToolError extends Error {
  constructor(
    readonly tool: string,
    readonly exitCode: number,
    readonly stdout: string[],
  ) {
    const tail = stdout.slice(-8).join("\n");
    super(`${tool} failed (exit ${exitCode})${tail ? `:\n${tail}` : ""}`);
    this.name = "ToolError";
  }
}

/** Files handed to a tool: raw bytes, or an http(s) URL the runner fetches. */
export type ToolInputs = Record<string, Uint8Array | ArrayBuffer | string>;

/**
 * Run one WhiteboxTools tool over the in-memory `/work` filesystem.
 *
 * `args` are given as a plain object; `undefined` values are dropped and
 * booleans are emitted as `--flag=true|false`, which the WASI CLI parses.
 * Returns the files the tool wrote, keyed by their name under `/work`.
 */
export async function run(
  key: ToolKey,
  args: Record<string, string | number | boolean | undefined>,
  inputs: ToolInputs = {},
): Promise<Record<string, Uint8Array>> {
  const { id } = TOOL_CONTRACT[key];

  const argv: string[] = [];
  for (const [name, value] of Object.entries(args)) {
    if (value === undefined) continue;
    argv.push(`--${name}=${value}`);
  }

  const result = await runTool(id, { args: argv, input: inputs });
  if (result.exitCode !== 0) {
    throw new ToolError(id, result.exitCode, result.stdout);
  }
  return result.files;
}

/** Pull one expected output out of a tool result, with a clear error if absent. */
export function requireFile(
  files: Record<string, Uint8Array>,
  name: string,
  tool: string,
): Uint8Array {
  const file = files[name];
  if (!file) {
    const produced = Object.keys(files).join(", ") || "nothing";
    throw new Error(`${tool} did not write ${name} (produced: ${produced})`);
  }
  return file;
}
