import test from 'node:test';
import assert from 'node:assert/strict';
import {webcrypto} from 'node:crypto';

if (!globalThis.crypto?.subtle) globalThis.crypto = webcrypto;

import {
  createOfflineNeuralSession, runOfflineNeuralTiled,
} from '../onnx-browser-runtime.mjs';

class FakeTensor {
  constructor(dtype, data, dims) {
    assert.equal(dtype, 'float32');
    this.data = new Float32Array(data);
    this.dims = dims;
  }
}

const fakeORT = {
  Tensor: FakeTensor,
  InferenceSession: {
    async create() {
      return {
        async run(feed) {
          const source = feed.source;
          const result = new Float32Array(source.data);
          const patchArea = source.dims[2] * source.dims[3];
          for (let i = 0; i < patchArea; i++) {
            result[i] = Math.min(1, result[i] + .2);
          }
          return {transferred: {
            data: result,
            dims: source.dims,
          }};
        },
      };
    },
  },
};

const create = async () => {
  const bytes = new Uint8Array([1, 2, 3, 4, 5, 6]).buffer;
  const digest = await crypto.subtle.digest('SHA-256', bytes);
  const sha256 = Array.from(new Uint8Array(digest), v =>
    v.toString(16).padStart(2, '0')).join('');
  const manifest = {
    schema: 'hbeauty.neural.appearance.v0.1',
    status: 'experimental_not_sota_approved',
    offline_deployment_approved: false,
    input_resolution: [64, 64],
    bytes: bytes.byteLength,
    sha256,
  };
  return {bytes, manifest};
};

function inputs(width = 110, height = 96) {
  const data = new Uint8ClampedArray(width * height * 4);
  for (let i = 0; i < width * height; i++) {
    data.set([89, 130, 160, 255], i * 4);
  }
  const masks = new Float32Array(4 * width * height);
  for (let y = 20; y < Math.min(height, 70); y++) {
    for (let x = 20; x < Math.min(width, 80); x++) {
      masks[1 * width * height + y * width + x] = 1;
    }
  }
  return {image: {data, width, height}, masks};
}

test('offline ONNX manifest verifies exact SHA256', async () => {
  const {bytes, manifest} = await create();
  const engine = await createOfflineNeuralSession(fakeORT, bytes, manifest);
  assert.equal(engine.tile, 64);
  await assert.rejects(
    createOfflineNeuralSession(fakeORT, bytes,
      {...manifest, sha256: '0'.repeat(64)}), /hash/,
  );
});

test('tiled output retains native size and EXACT unedited RGBA pixels', async () => {
  const {bytes, manifest} = await create();
  const engine = await createOfflineNeuralSession(fakeORT, bytes, manifest);
  const {image, masks} = inputs();
  const output = await runOfflineNeuralTiled(
    engine, image, image, masks, masks, {overlap: 16},
  );
  assert.equal(output.width, image.width);
  assert.equal(output.height, image.height);
  for (let i = 0; i < image.width * image.height; i++) {
    const edited = masks[image.width * image.height + i] > 0;
    const red = output.data[i * 4];
    assert.equal(red, edited ? 140 : 89);
    assert.equal(output.data[i * 4 + 1], 130);
    assert.equal(output.data[i * 4 + 2], 160);
    assert.equal(output.data[i * 4 + 3], 255);
  }
});

test('invalid region masks and research approval flags are rejected', async () => {
  const {bytes, manifest} = await create();
  await assert.rejects(
    createOfflineNeuralSession(fakeORT, bytes,
      {...manifest, offline_deployment_approved: true}), /manifest/,
  );
  const engine = await createOfflineNeuralSession(fakeORT, bytes, manifest);
  const {image, masks} = inputs();
  await assert.rejects(
    runOfflineNeuralTiled(engine, image, image,
      new Float32Array(6), masks), /masks/,
  );
});

test('small images use padding, without changing non-makeup regions', async () => {
  const {bytes, manifest} = await create();
  const engine = await createOfflineNeuralSession(fakeORT, bytes, manifest);
  const {image, masks} = inputs(44, 45);
  const output = await runOfflineNeuralTiled(
    engine, image, image, masks, masks, {overlap: 16},
  );
  assert.equal(output.width, 44);
  assert.equal(output.height, 45);
  assert.equal(output.data[0], image.data[0]);
});
