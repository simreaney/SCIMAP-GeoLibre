import { createRequire } from "node:module";
import { readFileSync } from "node:fs";
import { dirname, join } from "node:path";

import { defineConfig, type Plugin } from "vite";

/** Binaries `geolibre-wasm` ships but does not expose through its exports map. */
const WASM_FILES = ["geolibre_wasm_bg.wasm", "geolibre-cli.wasm"] as const;

/**
 * Neutralise the glue modules' `new URL('<file>.wasm', import.meta.url)`
 * defaults.
 *
 * We always pass an explicit source to `init` and `initTools` (see
 * `src/core/wasm.ts`), so those branches are dead — but the bundler still
 * resolves them, and in library mode that means base64-inlining 28 MB of wasm
 * into the entry file. Rewriting them to a bare filename keeps the modules
 * valid while leaving nothing for the asset pipeline to inline.
 */
function stripWasmAutoResolution(): Plugin {
  const patterns: Array<[RegExp, string]> = [
    [
      /new URL\('geolibre_wasm_bg\.wasm', import\.meta\.url\)/g,
      "'geolibre_wasm_bg.wasm'",
    ],
    [/new URL\("\.\/geolibre-cli\.wasm", import\.meta\.url\)/g, "'geolibre-cli.wasm'"],
  ];

  return {
    name: "scimap-strip-wasm-auto-resolution",
    enforce: "pre",
    transform(code, id) {
      if (!id.includes("geolibre-wasm")) return null;

      let out = code;
      for (const [pattern, replacement] of patterns) out = out.replace(pattern, replacement);
      return out === code ? null : { code: out, map: null };
    },
  };
}

/**
 * Copy the geolibre-wasm binaries into `dist/` under their original names.
 *
 * The package's `exports` map does not expose them as importable subpaths, and
 * they are too large to inline. `src/core/wasm.ts` resolves them by these exact
 * names at runtime.
 */
function emitWasmBinaries(): Plugin {
  return {
    name: "scimap-emit-wasm",
    generateBundle() {
      // The package's exports map covers only "." and "./tools", so the
      // directory has to be derived from the main entry rather than resolved
      // through a subpath.
      const require = createRequire(import.meta.url);
      const packageDir = dirname(require.resolve("geolibre-wasm"));

      for (const fileName of WASM_FILES) {
        this.emitFile({
          type: "asset",
          fileName,
          source: readFileSync(join(packageDir, fileName)),
        });
      }
    },
  };
}

// GeoLibre loads an external plugin by importing its entry as an ES module via
// `import(blob:URL)`, so the bundle must be a single self-contained ESM file
// with no code splitting and no bare import specifiers left in it.
export default defineConfig({
  plugins: [stripWasmAutoResolution(), emitWasmBinaries()],
  build: {
    target: "es2022",
    outDir: "dist",
    emptyOutDir: true,
    sourcemap: true,
    // Both geolibre-wasm glue modules default to
    // `new URL('<file>.wasm', import.meta.url)`. We always pass an explicit
    // source instead (see src/core/wasm.ts), but the bundler still resolves
    // those branches — and lib mode inlines assets unless told otherwise, which
    // would base64 28 MB of wasm into the entry file.
    assetsInlineLimit: 0,
    lib: {
      entry: "src/index.ts",
      formats: ["es"],
      fileName: () => "index.js",
    },
    rollupOptions: {
      output: {
        inlineDynamicImports: true,
        assetFileNames: "style.css",
      },
    },
  },
  worker: {
    // The compute worker is inlined into the bundle so the plugin stays a
    // single entry file that can be loaded from a blob URL.
    format: "es",
    // Worker bundles are a separate Rollup pass and do not inherit `plugins`.
    // Without this the worker — which is where geolibre-wasm is actually used —
    // base64-inlines both binaries and is then itself inlined into index.js.
    plugins: () => [stripWasmAutoResolution()],
    rollupOptions: {
      output: { inlineDynamicImports: true },
    },
  },
  test: {
    environment: "node",
    include: ["test/**/*.test.ts"],
  },
});
