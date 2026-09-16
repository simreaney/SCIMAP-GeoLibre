/**
 * The slice of GeoLibre's plugin API this plugin uses.
 *
 * GeoLibre does not publish its API types as a package, so they are declared
 * here from `docs/plugin-api.md`. Everything the host added after v1.0 is
 * optional, matching the doc's "typed optional for forward-compatibility"
 * convention — call sites must use `?.` and cope with absence.
 */

export type GeoLibreRightPanelDock =
  | "left-of-layers"
  | "right-of-layers"
  | "left-of-style"
  | "right-of-style"
  | "replace-style"
  | "replace-layers";

export interface GeoLibreRightPanelRegistration {
  id: string;
  title: string | (() => string);
  dock?: GeoLibreRightPanelDock;
  icon?: string;
  defaultWidth?: number;
  render: (container: HTMLElement) => void | (() => void);
  onOpen?: () => void;
  onCollapse?: () => void;
  onClose?: () => void;
}

export type GeoLibreToolbarMenuItem =
  | { type?: "action"; id: string; label: string; icon?: string; disabled?: boolean; onSelect: () => void }
  | { type: "submenu"; id: string; label: string; icon?: string; items: GeoLibreToolbarMenuItem[] }
  | { type: "separator"; id?: string };

export interface GeoLibreToolbarMenu {
  id: string;
  label: string;
  icon?: string;
  items: GeoLibreToolbarMenuItem[];
}

export interface GeoLibreCogLayerOptions {
  bands?: string;
  colormap?: string;
  rescaleMin?: number;
  rescaleMax?: number;
  nodata?: number;
  opacity?: number;
  beforeLayerId?: string;
}

export interface GeoLibreAppAPI {
  addGeoJsonLayer(name: string, data: unknown, sourcePath?: string): string;
  addCogLayer?(name: string, url: string, options?: GeoLibreCogLayerOptions): Promise<string>;
  fitBounds?(bounds: [number, number, number, number]): void;
  getMap?(): unknown;

  registerRightPanel?(panel: GeoLibreRightPanelRegistration): () => void;
  unregisterRightPanel?(id: string): void;
  openRightPanel?(id: string): boolean;
  closeRightPanel?(id: string): void;

  registerToolbarMenu?(menu: GeoLibreToolbarMenu): () => void;
  unregisterToolbarMenu?(id: string): void;
}

export interface GeoLibrePlugin {
  id: string;
  name: string;
  version: string;
  activeByDefault?: boolean;
  activate: (app: GeoLibreAppAPI) => boolean | void;
  deactivate: (app: GeoLibreAppAPI) => void;
  getProjectState?: () => unknown;
  applyProjectState?: (app: GeoLibreAppAPI, state: unknown) => boolean | void;
}
