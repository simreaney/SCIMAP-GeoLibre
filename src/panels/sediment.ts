/**
 * SCIMAP Sediment panel.
 *
 * Mirrors the parameters of `ScimapStandardAlgorithm` in the QGIS plugin, with
 * the remap and risk-weight matrices rendered as editable tables.
 */

import {
  CEH_TO_SCIMAP,
  COLOUR_RAMPS,
  DEFAULT_STREAM_THRESHOLD_M2,
  DEFAULT_WEIGHTS,
  SCIMAP_CLASS_NAMES,
  UNMAPPED_FALLBACK_CLASS,
  type ColourRamp,
} from "../data/defaults";
import type { GeoLibreAppAPI, GeoLibreRightPanelRegistration } from "../geolibre";
import { resolveRasterInput, runJob } from "./runner";
import {
  checkboxField,
  lookupTable,
  numberField,
  progressLog,
  rasterField,
  section,
  selectField,
} from "./widgets";

export const SEDIMENT_PANEL_ID = "scimap-sediment";

export function sedimentPanel(app: GeoLibreAppAPI): GeoLibreRightPanelRegistration {
  return {
    id: SEDIMENT_PANEL_ID,
    title: "SCIMAP Sediment",
    defaultWidth: 380,
    render(container) {
      container.classList.add("scimap-panel");

      const intro = document.createElement("p");
      intro.className = "scimap-intro";
      intro.textContent =
        "Maps fine sediment and diffuse pollution risk from a DEM, a land cover map " +
        "and a rainfall map. Everything runs locally in your browser.";

      const dem = rasterField("Digital Elevation Model (DEM)");
      const landcover = rasterField("Land Cover Map / Risk Weighting");
      const rainfall = rasterField("Rainfall Map");

      const preweighted = checkboxField(
        "Land cover is already a risk weighting",
        false,
        "Use the raster's values as-is, skipping the remap and weight tables.",
      );
      const alreadyScimap = checkboxField(
        "Land cover already uses SCIMAP classes (1-7)",
        false,
      );

      const remap = lookupTable(
        "Land cover class → SCIMAP class",
        ["Land cover ID", "SCIMAP class"],
        CEH_TO_SCIMAP,
        { integerValues: true },
      );
      const weights = lookupTable(
        "SCIMAP class → risk weight",
        ["SCIMAP class", "Risk weight"],
        DEFAULT_WEIGHTS,
        { rowLabels: SCIMAP_CLASS_NAMES },
      );
      const fallbackClass = numberField(
        "SCIMAP class for unmapped land cover values",
        UNMAPPED_FALLBACK_CLASS,
        { min: 0, step: 1 },
      );

      const streamThreshold = numberField(
        "Stream initiation threshold (m²)",
        DEFAULT_STREAM_THRESHOLD_M2,
        { min: 0, step: 10000 },
      );
      const useStreamPower = checkboxField("Use stream power in erosion calculation", true);
      const connectivityMethod = selectField(
        "Connectivity algorithm",
        [
          ["flow_path_trace", "Network Index (flow-path trace, default)"],
          ["pdsl", "Percentage Downslope Saturated Length (PDSL)"],
        ] as const,
        "flow_path_trace",
      );
      const depression = selectField(
        "Depression removal",
        [
          ["breach", "Least-cost breach (default)"],
          ["fill", "Fill depressions"],
        ] as const,
        "breach",
        "The WASM toolset has no plain breach; results differ slightly from the QGIS plugin.",
      );
      const ramp = selectField(
        "Colour ramp",
        [
          ["", "SCIMAP defaults (per layer)"],
          ...COLOUR_RAMPS.map((name) => [name, name] as const),
        ] as ReadonlyArray<readonly [string, string]>,
        "",
      );
      const emitClasses = checkboxField("Also output the SCIMAP land cover classes", false);
      const emitStreamRiskPoints = checkboxField(
        "Also output stream risk points",
        false,
        "One point per stream cell, carrying the SCIMAP risk concentration.",
      );

      const run = document.createElement("button");
      run.type = "button";
      run.className = "scimap-run";
      run.textContent = "Run SCIMAP Sediment";

      const progress = progressLog();

      run.addEventListener("click", async () => {
        for (const [field, label] of [
          [dem, "DEM"],
          [landcover, "Land cover map"],
          [rainfall, "Rainfall map"],
        ] as const) {
          if (!field.hasValue()) {
            progress.log(`${label} is required.`);
            return;
          }
        }

        run.disabled = true;
        progress.reset();
        progress.set(0, "Reading input rasters...");

        try {
          const [demBuf, lcBuf, rainBuf] = await Promise.all([
            dem.read().then((v) => resolveRasterInput(v, "DEM")),
            landcover.read().then((v) => resolveRasterInput(v, "Land cover map")),
            rainfall.read().then((v) => resolveRasterInput(v, "Rainfall map")),
          ]);

          const { promise } = runJob(
            app,
            {
              type: "sediment",
              dem: demBuf,
              landcover: lcBuf,
              rainfall: rainBuf,
              streamThresholdM2: streamThreshold.get(),
              useStreamPower: useStreamPower.get(),
              depressionMethod: depression.get(),
              landcoverIsPreweighted: preweighted.get(),
              landcoverIsScimapClasses: alreadyScimap.get(),
              weights: weights.get(),
              remap: remap.get(),
              fallbackClass: fallbackClass.get(),
              ramp: (ramp.get() || null) as ColourRamp | null,
              emitLandcoverClasses: emitClasses.get(),
              emitStreamRiskPoints: emitStreamRiskPoints.get(),
              connectivityMethod: connectivityMethod.get(),
            },
            [demBuf, lcBuf, rainBuf],
            { onProgress: progress.set, onLog: progress.log },
          );

          await promise;
          progress.set(100, "SCIMAP Sediment complete.");
        } catch (error) {
          progress.log(
            `Failed: ${error instanceof Error ? error.message : String(error)}`,
          );
        } finally {
          run.disabled = false;
        }
      });

      container.append(
        intro,
        section("Inputs", [dem.element, landcover.element, rainfall.element]),
        section("Land cover weighting", [
          preweighted.element,
          alreadyScimap.element,
          remap.element,
          weights.element,
          fallbackClass.element,
        ]),
        section("Model", [
          streamThreshold.element,
          useStreamPower.element,
          connectivityMethod.element,
          depression.element,
        ]),
        section("Output", [ramp.element, emitClasses.element, emitStreamRiskPoints.element]),
        run,
        progress.element,
      );

      return () => container.replaceChildren();
    },
  };
}
