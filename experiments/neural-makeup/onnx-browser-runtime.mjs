/**
 * H-Beauty v20 research-only OFFLINE ONNX Runtime Web adapter.
 * No network requests, no photos uploaded, no bundled model weights.
 * Caller must bundle the ONNX Runtime Web JavaScript + WASM dependencies.
 * Final image retains original pixel dimensions. Neural tiles are lower-res.
 */

const MODEL_SCHEMA = 'hbeauty.neural.appearance.v0.1';
const MAX_PIXELS = 4_200_000;

function assertImage(image, label) {
  if (!image || !Number.isInteger(image.width) || !Number.isInteger(image.height) ||
      image.width <= 0 || image.height <= 0 ||
      !image.data || image.data.length !== image.width * image.height * 4) {
    throw Error(label + ': expected RGBA 8-bit pixels with width and height');
  }
}

function assertMasks(masks, width, height, label) {
  if (!(masks instanceof Float32Array) || masks.length !== 4 * width * height) {
    throw Error(label + ': required four planar Float32Array region masks');
  }
  for (let i = 0; i < masks.length; i++) {
    if (!Number.isFinite(masks[i]) || masks[i] < 0 || masks[i] > 1) {
      throw Error(label + ': masks must contain finite values in [0,1]');
    }
  }
}

function starts(length, tile, overlap) {
  if (length <= tile) return [0];
  const positions = [];
  const stride = tile - overlap;
  for (let p = 0; p <= length - tile; p += stride) positions.push(p);
  if (positions[positions.length - 1] !== length - tile) {
    positions.push(length - tile);
  }
  return positions;
}

function weightAt(offset, tile, positions, index) {
  let weight = 1;
  const start = positions[index];
  if (index) {
    const left = positions[index - 1] + tile - start;
    if (offset < left) weight *= .01 + .99 * offset / Math.max(1, left - 1);
  }
  if (index + 1 < positions.length) {
    const right = start + tile - positions[index + 1];
    if (offset >= tile - right) {
      weight *= .01 + .99 * (tile - offset - 1) / Math.max(1, right - 1);
    }
  }
  return weight;
}

async function hashHex(buffer) {
  const digest = await crypto.subtle.digest('SHA-256', buffer);
  return Array.from(new Uint8Array(digest), b =>
    b.toString(16).padStart(2, '0')).join('');
}

/**
 * Verify a locally selected ONNX file against its unmodified model manifest.
 * This explicitly does NOT provide production approval of a model.
 */
export async function createOfflineNeuralSession(ort, modelBytes, manifest) {
  if (!ort?.InferenceSession?.create || !ort?.Tensor) {
    throw Error('A bundled ONNX Runtime Web instance is required');
  }
  if (!(modelBytes instanceof ArrayBuffer)) {
    throw Error('Model must be supplied as local ArrayBuffer bytes');
  }
  const dims = manifest?.input_resolution;
  if (manifest?.schema !== MODEL_SCHEMA ||
      manifest?.status !== 'experimental_not_sota_approved' ||
      manifest?.offline_deployment_approved !== false ||
      !Array.isArray(dims) || dims.length !== 2 ||
      dims[0] !== dims[1] || !Number.isInteger(dims[0]) ||
      dims[0] < 32 || dims[0] > 512 || dims[0] % 16 !== 0) {
    throw Error('Missing or unsupported research model manifest');
  }
  if (modelBytes.byteLength !== manifest.bytes ||
      await hashHex(modelBytes) !== manifest.sha256) {
    throw Error('ONNX hash or byte length does not match the signed manifest');
  }
  const session = await ort.InferenceSession.create(
    new Uint8Array(modelBytes),
    {executionProviders: ['wasm'], graphOptimizationLevel: 'all'},
  );
  return {session, ort, tile: dims[0]};
}

/**
 * Native-size, overlap-blended, entirely local reconstruction.
 * source/reference are RGBA ImageData-like objects. Masks are planar,
 * ordered eyes/lips/cheeks/complexion, each with width*height float values.
 */
export async function runOfflineNeuralTiled(
  engine, source, reference, sourceMasks, referenceMasks,
  {overlap = 48, maxPixels = MAX_PIXELS, onProgress = null} = {},
) {
  assertImage(source, 'source');
  assertImage(reference, 'reference');
  const width = source.width;
  const height = source.height;
  assertMasks(sourceMasks, width, height, 'source');
  assertMasks(referenceMasks, reference.width, reference.height, 'reference');
  if (width * height < 1024 || width * height > maxPixels) {
    throw Error('Input image exceeds supported offline device pixel budget');
  }
  const tile = engine.tile;
  if (!Number.isInteger(tile) || tile % 16 || tile < 32 ||
      !Number.isInteger(overlap) || overlap < 16 || overlap >= tile / 2) {
    throw Error('Invalid ONNX patch size or overlap');
  }
  const xs = starts(width, tile, overlap);
  const ys = starts(height, tile, overlap);
  const tileArea = tile * tile;
  const refRGBA = reference.data;
  const refW = reference.width;
  const refH = reference.height;
  const refColor = new Float32Array(3 * tileArea);
  const refMask = new Float32Array(4 * tileArea);

  // Reference is sampled globally, not copied pixel-for-pixel to the target.
  for (let y = 0; y < tile; y++) {
    const ry = Math.min(refH - 1, Math.floor((y + .5) * refH / tile));
    for (let x = 0; x < tile; x++) {
      const rx = Math.min(refW - 1, Math.floor((x + .5) * refW / tile));
      const a = y * tile + x;
      const b = ry * refW + rx;
      for (let c = 0; c < 3; c++) {
        refColor[c * tileArea + a] = refRGBA[b * 4 + c] / 255;
      }
      for (let k = 0; k < 4; k++) {
        refMask[k * tileArea + a] = referenceMasks[k * refW * refH + b];
      }
    }
  }

  const numer = new Float32Array(width * height * 3);
  const denom = new Float32Array(width * height);
  const inputColor = new Float32Array(3 * tileArea);
  const inputMask = new Float32Array(4 * tileArea);
  const T = engine.ort.Tensor;
  let completed = 0;
  const total = xs.length * ys.length;

  for (let iy = 0; iy < ys.length; iy++) {
    const sy = ys[iy];
    for (let ix = 0; ix < xs.length; ix++) {
      const sx = xs[ix];
      inputColor.fill(0);
      inputMask.fill(0);
      for (let ty = 0; ty < tile; ty++) {
        const gy = Math.min(height - 1, sy + ty);
        for (let tx = 0; tx < tile; tx++) {
          const gx = Math.min(width - 1, sx + tx);
          const local = ty * tile + tx;
          const global = gy * width + gx;
          for (let c = 0; c < 3; c++) {
            inputColor[c * tileArea + local] =
              source.data[global * 4 + c] / 255;
          }
          if (sy + ty < height && sx + tx < width) {
            for (let k = 0; k < 4; k++) {
              inputMask[k * tileArea + local] =
                sourceMasks[k * width * height + global];
            }
          }
        }
      }
      const shape3 = [1, 3, tile, tile];
      const shape4 = [1, 4, tile, tile];
      const outputs = await engine.session.run({
        source: new T('float32', inputColor, shape3),
        reference: new T('float32', refColor, shape3),
        source_regions: new T('float32', inputMask, shape4),
        reference_regions: new T('float32', refMask, shape4),
      });
      const out = outputs?.transferred;
      if (!out?.data || out.data.length !== 3 * tileArea ||
          out.dims?.join(',') !== shape3.join(',')) {
        throw Error('Unexpected ONNX output dimensions');
      }
      for (let ty = 0; ty < tile && sy + ty < height; ty++) {
        const wy = weightAt(ty, tile, ys, iy);
        for (let tx = 0; tx < tile && sx + tx < width; tx++) {
          const local = ty * tile + tx;
          const global = (sy + ty) * width + sx + tx;
          const weight = wy * weightAt(tx, tile, xs, ix);
          for (let c = 0; c < 3; c++) {
            const value = Number(out.data[c * tileArea + local]);
            if (!Number.isFinite(value)) throw Error('Nonfinite ONNX pixel');
            numer[global * 3 + c] += Math.max(0, Math.min(1, value)) * weight;
          }
          denom[global] += weight;
        }
      }
      completed++;
      if (typeof onProgress === 'function') onProgress(completed / total);
    }
  }

  const result = new Uint8ClampedArray(source.data);
  for (let i = 0; i < width * height; i++) {
    if (denom[i] <= 0) throw Error('Missing tile coverage');
    let editable = false;
    for (let k = 0; k < 4; k++) {
      if (sourceMasks[k * width * height + i] > 0) {
        editable = true;
        break;
      }
    }
    if (!editable) continue; // EXACT RGBA bytes preserved.
    for (let c = 0; c < 3; c++) {
      result[i * 4 + c] = Math.round(
        255 * numer[i * 3 + c] / denom[i],
      );
    }
  }
  return {data: result, width, height, experimental: true};
}
