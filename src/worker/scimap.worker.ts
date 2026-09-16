/**
 * Compute worker: runs the WASI tool runner and the SCIMAP maths off the UI
 * thread, streaming progress back to the panel.
 */

import { transform_bbox_epsg } from "geolibre-wasm";

import type { GridRef } from "../core/grid";
import { initWasm } from "../core/wasm";
import { runNetworkIndex, runSediment, type PipelineResult } from "../core/pipeline";
import type { WorkerRequest, WorkerResponse } from "./protocol";

const post = (message: WorkerResponse, transfer: Transferable[] = []): void => {
  (self as unknown as Worker).postMessage(message, transfer);
};

/** WGS84 bounds of the output grid, for `fitBounds`. */
function boundsOf(ref: GridRef): [number, number, number, number] | null {
  const gt = ref.geoTransform;
  const minX = gt[0];
  const maxY = gt[3];
  const maxX = minX + gt[1] * ref.width;
  const minY = maxY + gt[5] * ref.height;

  const bbox = new Float64Array([
    Math.min(minX, maxX),
    Math.min(minY, maxY),
    Math.max(minX, maxX),
    Math.max(minY, maxY),
  ]);

  if (ref.epsg === undefined) return null;
  if (ref.epsg === 4326) return [bbox[0], bbox[1], bbox[2], bbox[3]];

  try {
    const out = transform_bbox_epsg(ref.epsg, 4326, bbox);
    if (out.length !== 4 || !out.every((v) => Number.isFinite(v))) return null;
    return [out[0], out[1], out[2], out[3]];
  } catch {
    // A CRS the projection engine does not know is not worth failing the run
    // over — the layers still render, they just do not auto-zoom.
    return null;
  }
}

function reply(jobId: number, result: PipelineResult): void {
  const transfer: Transferable[] = [];
  const rasters = result.rasters.map((raster) => {
    // Detach each COG so a multi-megabyte result is moved, not copied.
    const buffer = raster.cog.buffer.slice(
      raster.cog.byteOffset,
      raster.cog.byteOffset + raster.cog.byteLength,
    ) as ArrayBuffer;
    transfer.push(buffer);
    return {
      key: raster.key,
      name: raster.name,
      cog: buffer,
      ramp: raster.ramp as string,
      rescale: raster.rescale,
    };
  });

  post(
    {
      type: "done",
      jobId,
      rasters,
      vectors: result.vectors,
      bounds: boundsOf(result.ref),
      notes: result.notes,
    },
    transfer,
  );
}

self.onmessage = async (event: MessageEvent<WorkerRequest>) => {
  const request = event.data;
  const { jobId } = request;

  const onProgress = (progress: number, message?: string): void => {
    post({ type: "progress", jobId, progress, message });
  };

  try {
    onProgress(0, "Loading the GeoLibre WASM toolkit...");
    await initWasm(request.wasmUrls);

    if (request.type === "sediment") {
      const result = await runSediment(
        {
          dem: new Uint8Array(request.dem),
          landcover: new Uint8Array(request.landcover),
          rainfall: new Uint8Array(request.rainfall),
          streamThresholdM2: request.streamThresholdM2,
          useStreamPower: request.useStreamPower,
          depressionMethod: request.depressionMethod,
          landcoverIsPreweighted: request.landcoverIsPreweighted,
          landcoverIsScimapClasses: request.landcoverIsScimapClasses,
          weights: new Map(request.weights),
          remap: new Map(request.remap),
          fallbackClass: request.fallbackClass,
          ramp: request.ramp,
          emitLandcoverClasses: request.emitLandcoverClasses,
          emitStreamRiskPoints: request.emitStreamRiskPoints,
          connectivityMethod: request.connectivityMethod,
        },
        onProgress,
      );
      reply(jobId, result);
      return;
    }

    const result = await runNetworkIndex(
      {
        dem: new Uint8Array(request.dem),
        streamThresholdM2: request.streamThresholdM2,
        depressionMethod: request.depressionMethod,
        ramp: request.ramp,
        connectivityMethod: request.connectivityMethod,
      },
      onProgress,
    );
    reply(jobId, result);
  } catch (error) {
    post({
      type: "error",
      jobId,
      message: error instanceof Error ? error.message : String(error),
    });
  }
};
