/**
 * Messages exchanged between the panel and the compute worker.
 *
 * Raster payloads move as transferable ArrayBuffers so a catchment-sized DEM is
 * never structurally cloned.
 */

import type { ColourRamp } from "../data/defaults";
import type { ConnectivityMethod } from "../core/connectivity";
import type { DepressionMethod } from "../core/hydrology";
import type { WasmUrls } from "../core/wasm";

interface BaseRequest {
  jobId: number;
  /**
   * Resolved on the main thread: the worker is inlined, so its own
   * `import.meta.url` is a blob and cannot resolve the WASM assets itself.
   */
  wasmUrls: WasmUrls;
}

export interface SedimentRequest extends BaseRequest {
  type: "sediment";
  dem: ArrayBuffer;
  landcover: ArrayBuffer;
  rainfall: ArrayBuffer;
  streamThresholdM2: number;
  useStreamPower: boolean;
  depressionMethod: DepressionMethod;
  landcoverIsPreweighted: boolean;
  landcoverIsScimapClasses: boolean;
  /** Serialised as entries because Maps survive structured clone but arrays are clearer. */
  weights: Array<[number, number]>;
  remap: Array<[number, number]>;
  fallbackClass: number;
  ramp: ColourRamp | null;
  emitLandcoverClasses: boolean;
  emitStreamRiskPoints: boolean;
  connectivityMethod: ConnectivityMethod;
}

export interface NetworkIndexRequest extends BaseRequest {
  type: "networkIndex";
  dem: ArrayBuffer;
  streamThresholdM2: number;
  depressionMethod: DepressionMethod;
  ramp: ColourRamp | null;
  connectivityMethod: ConnectivityMethod;
}

export type WorkerRequest = SedimentRequest | NetworkIndexRequest;

/**
 * `Omit` on a union collapses it to the shared keys, which would erase every
 * sediment-specific field. Distributing over the members keeps each variant
 * intact so the panels stay type-checked against the request they build.
 */
type DistributiveOmit<T, K extends PropertyKey> = T extends unknown ? Omit<T, K> : never;

/**
 * A request as the panels build it, before the runner stamps on the job id and
 * the resolved WASM asset URLs.
 */
export type WorkerRequestInput = DistributiveOmit<WorkerRequest, "jobId" | "wasmUrls">;

export interface WorkerRasterOutput {
  key: string;
  name: string;
  cog: ArrayBuffer;
  ramp: string;
  rescale: [number, number];
}

export interface WorkerVectorOutput {
  key: string;
  name: string;
  geojson: unknown;
  riskField: string;
}

export type WorkerResponse =
  | { type: "progress"; jobId: number; progress: number; message?: string }
  | {
      type: "done";
      jobId: number;
      rasters: WorkerRasterOutput[];
      vectors: WorkerVectorOutput[];
      /** WGS84 bounds for fitBounds, when the CRS could be converted. */
      bounds: [number, number, number, number] | null;
      notes: string[];
    }
  | { type: "error"; jobId: number; message: string };
