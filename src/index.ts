/**
 * SCIMAP for GeoLibre.
 *
 * Registers a SCIMAP toolbar menu and two right panels, Sediment and Network
 * Index, both computed entirely in the browser: WhiteboxTools runs as WASI
 * WebAssembly and the SCIMAP maths is a parity-tested port of the QGIS plugin's
 * Python core.
 */

import "./style.css";

import type { GeoLibreAppAPI, GeoLibrePlugin } from "./geolibre";
import { NETWORK_INDEX_PANEL_ID, networkIndexPanel } from "./panels/networkIndex";
import { SEDIMENT_PANEL_ID, sedimentPanel } from "./panels/sediment";
import { releaseObjectUrls } from "./panels/runner";

const unregisters: Array<() => void> = [];

const plugin: GeoLibrePlugin = {
  id: "scimap",
  name: "SCIMAP",
  version: "0.1.0",

  activate(app: GeoLibreAppAPI) {
    if (!app.registerRightPanel || !app.registerToolbarMenu) {
      // Without panels there is nowhere to put the parameter forms, so fail the
      // activation rather than registering a menu that opens nothing.
      console.warn("[scimap] This GeoLibre build does not support plugin panels.");
      return false;
    }

    for (const panel of [sedimentPanel(app), networkIndexPanel(app)]) {
      const off = app.registerRightPanel(panel);
      if (off) unregisters.push(off);
    }

    const offMenu = app.registerToolbarMenu({
      id: "scimap-menu",
      label: "SCIMAP",
      items: [
        {
          id: "scimap-open-sediment",
          label: "SCIMAP Sediment",
          onSelect: () => app.openRightPanel?.(SEDIMENT_PANEL_ID),
        },
        {
          id: "scimap-open-network-index",
          label: "Network Index",
          onSelect: () => app.openRightPanel?.(NETWORK_INDEX_PANEL_ID),
        },
      ],
    });
    if (offMenu) unregisters.push(offMenu);

    return true;
  },

  deactivate(app: GeoLibreAppAPI) {
    app.closeRightPanel?.(SEDIMENT_PANEL_ID);
    app.closeRightPanel?.(NETWORK_INDEX_PANEL_ID);

    for (const off of unregisters.splice(0)) {
      try {
        off();
      } catch (error) {
        console.warn("[scimap] Failed to unregister a UI surface.", error);
      }
    }
    releaseObjectUrls();
  },
};

export default plugin;
export { plugin };
