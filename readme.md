# SCIMAP for GeoLibre

A [GeoLibre](https://geolibre.app) plugin that brings SCIMAP catchment risk
mapping into the browser. It adds a **SCIMAP** toolbar menu with two panels,
**SCIMAP Sediment** and **Network Index**, that compute diffuse pollution risk
and hydrological connectivity directly from a DEM, land cover and rainfall —
no server, no installed GIS software.

Everything runs client-side in a Web Worker: WhiteboxTools compiled to
WebAssembly (via [`geolibre-wasm`](https://www.npmjs.com/package/geolibre-wasm))
does the hydrology, and the SCIMAP maths is a TypeScript port of the
[QGIS plugin's](../qgis_plugin) Python core, checked against it with golden-file
parity tests.

## Panels

| Panel | Purpose |
|---|---|
| **SCIMAP Sediment** | Fine sediment / diffuse pollution risk from a DEM, a land cover map and a rainfall map |
| **Network Index** | Connectivity from a DEM alone, using uniform rainfall — also offers the PDSL (Percentage Downslope Saturated Length) alternative algorithm |

Open either from **SCIMAP → SCIMAP Sediment / Network Index** in the toolbar
once the plugin is active. Both panels take rasters as a local file
(`.tif`/`.tiff`) or an http(s) URL — GeoLibre's plugin API has no way to read
raster bytes back out of an already-loaded map layer, so inputs are supplied
directly rather than picked from the layer list. Progress and log messages
appear at the bottom of the panel while a run is in progress.

## Land cover risk weighting

Sediment carries the same two-step weighting as the QGIS plugin so you don't
need a pre-weighted raster:

1. Land cover IDs are mapped to SCIMAP classes 1–7 via an editable remap
   table, pre-filled with the CEH Land Cover Map mapping (LCM 1–23 → SCIMAP
   1–7).
2. Each SCIMAP class gets a risk weight, defaulting to the SCIMAP values
   (Woodland 0.2, Arable 1.0, Improved Grassland 0.3, Extensive Grassland
   0.15, Moorland 0.3, Urban 0.5, Other 0.5).

Values present in the raster but absent from the remap are backfilled with a
fallback class's weight (class 7 by default). Tick **Land cover already uses
SCIMAP classes (1-7)** to skip the remap, or **Land cover is already a risk
weighting** to use the raster as-is.

## How it works

Both panels share the same hydrology preamble, then diverge:

1. Remove DEM depressions — least-cost breach by default, or fill.
2. Compute slope, FD8 flow accumulation, D8 flow direction, and extract the
   stream network.
3. Rainfall and land cover are resampled onto the DEM's grid if they don't
   already match it.
4. **Erosion risk** = `|accumulation| × cell area × tan(slope)`, scaled by the
   land cover risk weight where applicable, then normalised between its 5th
   and 95th percentiles. Stream power (the `tan(slope)` term) can be turned
   off.
5. **Connectivity** — either the Network Index flow-path trace (each cell
   takes the minimum topographic wetness index along its downstream path to
   the channel network) or PDSL.
6. Sediment only: risk concentration = routed erosion × connectivity, divided
   by routed rainfall-weighted catchment area, both routed across the whole
   catchment with WhiteboxTools' `dinf_mass_flux`. If that routing fails, it
   falls back to a local-scaling approximation and logs a warning.
7. Sediment only: the stream network is vectorised with the mean risk
   concentration attached as a `Risk` field (**Instream Risk Concentration**),
   plus optional per-cell **Stream Risk Points**.

Outputs are added straight to the map as Cloud-Optimised GeoTIFF raster layers
and GeoJSON vector layers, styled with the same colour ramps as the SCIMAP web
application (Magma for erosion, Viridis for connectivity, a single override
ramp if you pick one).

The WASM toolset has no plain `BreachDepressions`; `breach_depressions_least_cost`
is used instead, so outputs will not be bit-identical to the QGIS plugin even
with identical inputs.

## Requirements

- A GeoLibre build with plugin panel support (`registerRightPanel` and
  `registerToolbarMenu`); the plugin refuses to activate without them.
- A browser with WebAssembly and Web Worker support.
- The DEM must carry a coordinate reference system embedded in its own GeoTIFF
  metadata — a sidecar `.prj`/`.tfw` is not enough, and the run fails with a
  message telling you how to fix it (`gdal_translate -a_srs EPSG:<code> -of
  COG in.tif out.tif`).
- Raster inputs given as a URL need CORS to allow the fetch; the plugin fetches
  them itself so a CORS failure is reported clearly rather than as an opaque
  worker error.

Raster outputs need `app.addCogLayer` — on a GeoLibre build without it, the
sediment/connectivity rasters are skipped with a log message but the
Instream Risk Concentration vector still gets added.

## Installing into GeoLibre

### 1. Build

```sh
cd geolibre_plugin
npm install
npm run build
```

This produces `dist/index.js`, `dist/style.css` and the two WhiteboxTools WASM
binaries (`dist/geolibre_wasm_bg.wasm`, `dist/geolibre-cli.wasm`, ~28 MB
combined) — a single self-contained ESM bundle plus its wasm payload, matching
what GeoLibre's external-plugin loader expects. `plugin.json` at the plugin
root already points at these files.

### 2. Choose an install path

GeoLibre loads external plugins three ways; pick whichever fits how you're
running GeoLibre:

- **Zip, installed by hand** — zip `plugin.json` and `dist/` together so
  `plugin.json` sits at the archive root:

  ```sh
  cd geolibre_plugin
  zip -r ../scimap-geolibre-plugin.zip plugin.json dist
  ```

  Then, in GeoLibre, **Settings → Manage Plugins → Settings → Install from
  file** and pick the zip. GeoLibre validates the manifest and the
  entry/style files before installing; reinstalling the same plugin `id`
  replaces the previous copy. On the desktop app the zip is copied into the
  app's plugin data directory; on the web app it's unpacked into IndexedDB.

- **Bundled drop-in** — for a GeoLibre instance you build yourself, copy
  `plugin.json` and `dist/` into that build's `public/plugins/scimap/`
  directory and rebuild (or restart the dev server). It then loads
  automatically with no Settings entry needed; add `"activeByDefault": true`
  to `plugin.json` to skip the Plugins menu step too.

- **Manifest URL** — host `plugin.json` and `dist/` on any HTTPS server (or
  `localhost` for development) at the same relative layout, then add the
  `plugin.json` URL under **Settings → Manage Plugins → Settings**. GeoLibre
  fetches the manifest and resolves `entry`/`style` relative to it.

External plugins run as trusted code in the host page, so only install a build
you built or fetched yourself.

### 3. Activate it

If it wasn't marked `activeByDefault`, turn it on from the **Plugins** menu →
**SCIMAP**. The **SCIMAP** toolbar menu then opens the two panels.

### Offline use

`src/core/wasm.ts` resolves the two WASM binaries next to the plugin bundle
when it's served over http(s) (true for the bundled drop-in and manifest-URL
installs), so those deployments work fully offline. A plugin loaded from a zip
or from a `blob:` URL has no directory to resolve against, so it falls back to
a version-pinned CDN (`cdn.jsdelivr.net/npm/geolibre-wasm@1.4.0/`) and needs
network access on first use. Call `setWasmBase()` before the first run to
point at a self-hosted copy instead.

## Development

| Script | Purpose |
|---|---|
| `npm run build` | Production build to `dist/` |
| `npm run dev` | Rebuild on change |
| `npm test` | Run the Vitest suite, including QGIS parity checks |
| `npm run typecheck` | `tsc --noEmit` |
| `npm run reference` | Regenerate `test/fixtures/` from `qgis_plugin/core` |

Layout:

- `src/core/` — hydrology, erosion, connectivity, land cover weighting and
  output packaging; ported from and parity-tested against `qgis_plugin/core`.
- `src/panels/` — the two right-panel UIs and the small DOM widget helpers
  they share.
- `src/worker/` — the compute worker the panels run each job in.
- `src/data/defaults.ts` — land cover mappings, default weights and colour
  ramps, mirrored from `qgis_plugin/data/defaults.py`.
- `src/geolibre.d.ts` — the slice of GeoLibre's plugin API this plugin uses,
  hand-transcribed since GeoLibre doesn't publish it as a package.

## Citation

Reaney, S., Lane, S., Heathwaite, A., and Dugdale, L. (2011).
Risk-based modelling of diffuse land use impacts from rural landscapes upon
salmonid fry abundance. *Ecological Modelling*, 222(4), 1016-1029.
https://doi.org/10.1016/j.ecolmodel.2010.08.022
