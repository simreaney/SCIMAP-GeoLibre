/**
 * Locating and loading the `geolibre-wasm` binaries.
 *
 * The two payloads total ~28 MB, so inlining them as base64 would produce a
 * ~38 MB plugin bundle that every viewer downloads and re-parses. They are
 * emitted as separate files instead and fetched at runtime, which also lets the
 * browser cache them across sessions.
 *
 * Resolving them is the awkward part: GeoLibre loads an external plugin by
 * `import(blob:URL)`, so `import.meta.url` is a `blob:` URL with no directory to
 * resolve against — and the compute worker is inlined, so its own
 * `import.meta.url` is a blob too. Resolution therefore happens once on the main
 * thread via {@link resolveWasmUrls} and the result is passed into the worker.
 *
 * Installs that serve the plugin from a real directory (bundled drop-ins under
 * `public/plugins/<id>/`, or an unpacked development directory) get an http(s)
 * `import.meta.url`, resolve locally, and work fully offline. Everything else
 * falls back to a version-pinned CDN.
 */

import init from "geolibre-wasm";
import { initTools } from "geolibre-wasm/tools";

/** Pinned to the `geolibre-wasm` version in package.json. */
const PACKAGE_VERSION = "1.4.0";
const CDN_BASE = `https://cdn.jsdelivr.net/npm/geolibre-wasm@${PACKAGE_VERSION}/`;

/** Names the build's `scimap-emit-wasm` plugin writes into `dist/`. */
const BINDGEN_FILE = "geolibre_wasm_bg.wasm";
const CLI_FILE = "geolibre-cli.wasm";

export interface WasmUrls {
  /** The wasm-bindgen library module, backing GeoTiffReader and CogBuilder. */
  bindgen: string;
  /** The WASI tool runner binary. */
  cli: string;
}

let overrideBase: string | null = null;

/**
 * Point the loader at a directory holding the `geolibre-wasm` binaries.
 *
 * Useful for air-gapped deployments that host the files themselves; call before
 * the first run.
 */
export function setWasmBase(base: string): void {
  overrideBase = base.endsWith("/") ? base : `${base}/`;
}

function resolveOne(filename: string): string {
  if (overrideBase) return `${overrideBase}${filename}`;

  // The binaries sit beside the bundle, so they resolve locally whenever the
  // bundle itself was loaded over http(s) rather than from a blob URL.
  try {
    const resolved = new URL(filename, import.meta.url);
    if (resolved.protocol === "http:" || resolved.protocol === "https:") {
      return resolved.href;
    }
  } catch {
    // Fall through to the CDN.
  }
  return `${CDN_BASE}${filename}`;
}

/** Resolve both binaries. Call on the main thread, then pass to the worker. */
export function resolveWasmUrls(): WasmUrls {
  return { bindgen: resolveOne(BINDGEN_FILE), cli: resolveOne(CLI_FILE) };
}

let loading: Promise<void> | null = null;

/**
 * Load both WASM modules once; safe to await repeatedly.
 *
 * `urls` should come from {@link resolveWasmUrls} on the main thread. Omitting
 * it resolves locally, which is only correct outside an inlined worker.
 */
export function initWasm(urls: WasmUrls = resolveWasmUrls()): Promise<void> {
  loading ??= (async () => {
    try {
      await init({ module_or_path: urls.bindgen });
      await initTools(urls.cli);
    } catch (error) {
      // Clear the cache so a later attempt (e.g. after setWasmBase) can retry.
      loading = null;
      const origin = safeOrigin(urls.bindgen);
      throw new Error(
        `Could not load the GeoLibre WASM toolkit from ${origin}. Install SCIMAP ` +
          `as an unpacked plugin directory for offline use, or allow access to ` +
          `${CDN_BASE}. Cause: ` +
          (error instanceof Error ? error.message : String(error)),
      );
    }
  })();
  return loading;
}

function safeOrigin(url: string): string {
  try {
    return new URL(url).origin;
  } catch {
    return url;
  }
}
