/**
 * H-Beauty experimental v19.3: identity-preserving OFFLINE hybrid transfer.
 * Stage 1: existing released v19.1 neural/preset face-detail renderer.
 * Stage 2: reference-conditioned chroma transfer with optical protection.
 * This is NOT a new trained state-of-the-art model.
 *
 * Integration: place at the root of an approved v19.2 offline archive beside
 * ai-v17.js and reference-transfer.js, then use it from reference-ui.js.
 */
import { paintLook } from './ai-v17.js';
import { transferReference } from './reference-transfer.js';

const OPTIONS = ['soft', 'natural', 'bold'];
const MAX_DIMENSION = 3072;
const EYE_LIP_OPTIONS = ['eyes', 'lips', 'blush'];

export async function transferReferenceHybrid(source, reference, triangles, params = {}) {
  if (!source?.photo || !reference?.photo ||
      !Array.isArray(source?.points) || !Array.isArray(reference?.points)) {
    throw Error('Both images need prepared face geometry.');
  }
  const values = Object.fromEntries(EYE_LIP_OPTIONS.map(k => [k, Number(params[k] ?? 0)]));
  if (!Object.values(values).every(n => Number.isFinite(n) && n >= 0 && n <= 1)) {
    throw Error('Invalid intensity values.');
  }
  if (![source.photo, reference.photo].every(c =>
      c.width > 0 && c.height > 0 && c.width <= MAX_DIMENSION && c.height <= MAX_DIMENSION)) {
    throw Error('Unsupported photo dimensions.');
  }
  const noEffect = !values.eyes && !values.lips && !values.blush;
  if (noEffect) {
    const output = document.createElement('canvas');
    output.width = source.photo.width;
    output.height = source.photo.height;
    output.getContext('2d').drawImage(source.photo, 0, 0);
    return { canvas: output, renderer: 'identity' };
  }
  if (!params.preset || !/^[a-z0-9-]{2,48}$/.test(params.preset) ||
      !OPTIONS.includes(params.level)) {
    throw Error('Choose a supported detailed makeup look and intensity.');
  }
  // paintLook is the existing offline image engine, not a cloud service.
  const detailed = await paintLook(source, params.preset, params.level, null, null);
  if (!detailed || detailed.width !== source.photo.width ||
      detailed.height !== source.photo.height) {
    throw Error('The offline preset renderer returned invalid dimensions.');
  }
  const output = transferReference(
    detailed, source.points, reference.photo, reference.points,
    triangles, values,
  );
  if (output.width !== source.photo.width || output.height !== source.photo.height) {
    throw Error('Final image dimensions changed unexpectedly.');
  }
  return {canvas: output, renderer: 'offline-hybrid'};
}
