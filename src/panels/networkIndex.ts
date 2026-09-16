/**
 * Network Index panel.
 *
 * Mirrors `ScimapNetworkIndexAlgorithm`: connectivity from a DEM alone, using
 * uniform rainfall so the result reflects terrain only.
 */

import {
  COLOUR_RAMPS,
  DEFAULT_STREAM_THRESHOLD_M2,
  type ColourRamp,
} from "../data/defaults";
import type { GeoLibreAppAPI, GeoLibreRightPanelRegistration } from "../geolibre";
import { resolveRasterInput, runJob } from "./runner";
import { numberField, progressLog, rasterField, section, selectField } from "./widgets";

export const NETWORK_INDEX_PANEL_ID = "scimap-network-index";

export function networkIndexPanel(app: GeoLibreAppAPI): GeoLibreRightPanelRegistration {
  return {
    id: NETWORK_INDEX_PANEL_ID,
    title: "SCIMAP Network Index",
    defaultWidth: 380,
    render(container) {
      container.classList.add("scimap-panel");

      const intro = document.createElement("p");
      intro.className = "scimap-intro";
      intro.textContent =
        "Computes a SCIMAP hydrological connectivity index from a DEM using uniform " +
        "rainfall, so the result reflects terrain alone.";

      const dem = rasterField("Digital Elevation Model (DEM)");
      const streamThreshold = numberField(
        "Stream initiation threshold (m²)",
        DEFAULT_STREAM_THRESHOLD_M2,
        { min: 0, step: 10000 },
      );
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
      );
      const ramp = selectField(
        "Colour ramp",
        [
          ["", "SCIMAP default (viridis)"],
          ...COLOUR_RAMPS.map((name) => [name, name] as const),
        ] as ReadonlyArray<readonly [string, string]>,
        "",
      );

      const run = document.createElement("button");
      run.type = "button";
      run.className = "scimap-run";
      run.textContent = "Run Network Index";

      const progress = progressLog();

      run.addEventListener("click", async () => {
        if (!dem.hasValue()) {
          progress.log("DEM is required.");
          return;
        }

        run.disabled = true;
        progress.reset();
        progress.set(0, "Reading the DEM...");

        try {
          const demBuf = await dem.read().then((v) => resolveRasterInput(v, "DEM"));

          const { promise } = runJob(
            app,
            {
              type: "networkIndex",
              dem: demBuf,
              streamThresholdM2: streamThreshold.get(),
              depressionMethod: depression.get(),
              ramp: (ramp.get() || null) as ColourRamp | null,
              connectivityMethod: connectivityMethod.get(),
            },
            [demBuf],
            { onProgress: progress.set, onLog: progress.log },
          );

          await promise;
          progress.set(
            100,
            connectivityMethod.get() === "pdsl" ? "PDSL complete." : "Network Index complete.",
          );
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
        section("Input", [dem.element]),
        section("Model", [streamThreshold.element, connectivityMethod.element, depression.element]),
        section("Output", [ramp.element]),
        run,
        progress.element,
      );

      return () => container.replaceChildren();
    },
  };
}
