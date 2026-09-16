/**
 * Worker lifecycle and result-to-map plumbing shared by both panels.
 */

import { resolveWasmUrls } from "../core/wasm";
import type { GeoLibreAppAPI } from "../geolibre";
import ScimapWorker from "../worker/scimap.worker?worker&inline";
import type { WorkerRequestInput, WorkerResponse } from "../worker/protocol";

export interface RunHandlers {
  onProgress(progress: number, message?: string): void;
  onLog(message: string): void;
}

let nextJobId = 1;

/** Object URLs held for the session so the COG layers keep resolving. */
const objectUrls: string[] = [];

export function releaseObjectUrls(): void {
  for (const url of objectUrls) URL.revokeObjectURL(url);
  objectUrls.length = 0;
}

/**
 * Run one job in a fresh worker and add its outputs to the map.
 *
 * A worker per run keeps the WASI instance's `/work` filesystem clean between
 * runs and guarantees a cancelled run leaves nothing behind.
 */
export function runJob(
  app: GeoLibreAppAPI,
  request: WorkerRequestInput,
  transfer: Transferable[],
  handlers: RunHandlers,
): { promise: Promise<void>; cancel: () => void } {
  const worker = new ScimapWorker();
  const jobId = nextJobId++;
  let settled = false;

  const promise = new Promise<void>((resolve, reject) => {
    worker.onmessage = async (event: MessageEvent<WorkerResponse>) => {
      const message = event.data;
      if (message.jobId !== jobId) return;

      if (message.type === "progress") {
        handlers.onProgress(message.progress, message.message);
        return;
      }

      if (message.type === "error") {
        settled = true;
        worker.terminate();
        reject(new Error(message.message));
        return;
      }

      settled = true;
      try {
        for (const note of message.notes) handlers.onLog(note);

        for (const raster of message.rasters) {
          const url = URL.createObjectURL(
            new Blob([raster.cog], { type: "image/tiff" }),
          );
          objectUrls.push(url);

          if (!app.addCogLayer) {
            handlers.onLog(
              `This GeoLibre build cannot add COG layers, so "${raster.name}" was skipped.`,
            );
            continue;
          }
          await app.addCogLayer(raster.name, url, {
            colormap: raster.ramp,
            rescaleMin: raster.rescale[0],
            rescaleMax: raster.rescale[1],
          });
          handlers.onLog(`Added raster layer: ${raster.name}`);
        }

        for (const vector of message.vectors) {
          app.addGeoJsonLayer(vector.name, vector.geojson);
          handlers.onLog(`Added vector layer: ${vector.name}`);
        }

        if (message.bounds) app.fitBounds?.(message.bounds);
        resolve();
      } catch (error) {
        reject(error instanceof Error ? error : new Error(String(error)));
      } finally {
        worker.terminate();
      }
    };

    worker.onerror = (event) => {
      settled = true;
      worker.terminate();
      reject(new Error(event.message || "The SCIMAP worker failed to start."));
    };
  });

  worker.postMessage({ ...request, jobId, wasmUrls: resolveWasmUrls() }, transfer);

  return {
    promise,
    cancel: () => {
      if (!settled) worker.terminate();
    },
  };
}

/**
 * Resolve a raster field's value into something the worker can pass to the
 * tool runner: bytes for a local file, or the URL string for a remote source.
 *
 * URLs are fetched here rather than in the worker so a CORS failure surfaces as
 * a clear message instead of an opaque tool error.
 */
export async function resolveRasterInput(
  value: ArrayBuffer | string,
  label: string,
): Promise<ArrayBuffer> {
  if (typeof value !== "string") return value;

  let url: URL;
  try {
    url = new URL(value);
  } catch {
    throw new Error(`${label}: "${value}" is not a valid URL.`);
  }
  if (url.protocol !== "https:" && url.protocol !== "http:") {
    throw new Error(`${label}: only http(s) URLs are supported.`);
  }

  const response = await fetch(url.href);
  if (!response.ok) {
    throw new Error(`${label}: fetch failed with HTTP ${response.status}.`);
  }
  return response.arrayBuffer();
}
