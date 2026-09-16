/**
 * Assert the WhiteboxTools contract this plugin relies on still holds.
 *
 * `TOOL_CONTRACT` pins tool ids and parameter names that differ from the native
 * WhiteboxTools binary the QGIS plugin drives (`slope` takes `input` not `dem`,
 * `extract_streams` takes `flow_accumulation` not `flow_accum`,
 * `raster_streams_to_vector` takes `streams_raster` not `streams`). A
 * `geolibre-wasm` upgrade that renames any of them should fail here rather than
 * at runtime in a user's browser.
 */

import { readFileSync } from "node:fs";
import { beforeAll, describe, expect, it } from "vitest";

import { initTools, listManifests, listTools } from "geolibre-wasm/tools";

import { TOOL_CONTRACT, type ToolKey } from "../src/core/tools";

interface Manifest {
  id: string;
  params: Array<{ name: string; required?: boolean }>;
}

let toolIds: string[];
let manifests: Map<string, Manifest>;

beforeAll(async () => {
  const wasm = readFileSync(
    new URL("../node_modules/geolibre-wasm/geolibre-cli.wasm", import.meta.url),
  );
  await initTools(wasm);
  toolIds = await listTools();
  manifests = new Map(
    ((await listManifests()) as Manifest[]).map((m) => [m.id, m]),
  );
}, 120_000);

const entries = Object.entries(TOOL_CONTRACT) as Array<
  [ToolKey, (typeof TOOL_CONTRACT)[ToolKey]]
>;

describe("WhiteboxTools contract", () => {
  it.each(entries)("%s exists", (_key, tool) => {
    expect(toolIds).toContain(tool.id);
  });

  it.each(entries)("%s accepts every parameter SCIMAP passes", (_key, tool) => {
    const manifest = manifests.get(tool.id);
    expect(manifest, `no manifest for ${tool.id}`).toBeDefined();

    const available = new Set(manifest!.params.map((p) => p.name));
    for (const param of tool.params) {
      expect(available, `${tool.id} is missing --${param}`).toContain(param);
    }
  });

  it.each(entries)("%s has every required parameter covered", (_key, tool) => {
    const manifest = manifests.get(tool.id);
    const required = manifest!.params.filter((p) => p.required).map((p) => p.name);
    for (const param of required) {
      expect(tool.params as readonly string[], `${tool.id} does not pass required --${param}`)
        .toContain(param);
    }
  });
});
