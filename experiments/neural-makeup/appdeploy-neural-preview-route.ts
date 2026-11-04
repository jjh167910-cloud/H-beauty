/**
 * Optional, research-only AppDeploy route. DO NOT add to the production salon.
 *
 * Integration in the separate preview backend:
 *   import { neuralPreviewRoutes } from './neural-preview-routes';
 *   export const handler = router({ ...existingRoutes, ...neuralPreviewRoutes(ADMIN_EMAILS) });
 *
 * Unlike the local v19.2 engine, this requires explicit consent to transmit
 * both images to the managed Gemini image service. Owner authorization first.
 * No user images are written to AppDeploy Storage by this module.
 */
import {
  ai, error, json, requireAdminEmailAllowlist, requireAuth,
} from '@appdeploy/sdk';

type RefImage = { data: string; mimeType: 'image/jpeg' | 'image/png' | 'image/webp' };
type RequestBody = {
  source?: RefImage;
  reference?: RefImage;
  region?: 'full' | 'eyes' | 'lips';
  intensity?: 'subtle' | 'medium' | 'bold';
  consent?: boolean;
};

const mimeTypes = new Set(['image/jpeg', 'image/png', 'image/webp']);
const regions = new Set(['full', 'eyes', 'lips']);
const intensities = new Set(['subtle', 'medium', 'bold']);

function validImage(image: RefImage | undefined): image is RefImage {
  if (!image || !mimeTypes.has(image.mimeType) ||
      typeof image.data !== 'string' || image.data.length < 32 ||
      image.data.length > 3_200_000 ||
      !/^[A-Za-z0-9+/]+={0,2}$/.test(image.data)) {
    return false;
  }
  return true;
}

function composeInstruction(region: string, intensity: string): string {
  const regionText = {
    full: 'eyeshadow, eyeliner, lashes, blush, complexion cosmetics and lip color',
    eyes: 'eyeshadow, eyeliner and mascara only; leave lips and complexion as supplied',
    lips: 'lipstick hue, finish and subtle texture only; leave eyes and complexion untouched',
  }[region];
  const intensityText = {
    subtle: 'Keep an understated, natural salon finish.',
    medium: 'Use the makeup intensity visible in the reference.',
    bold: 'Preserve the clear, bold reference cosmetics without changing anatomical features.',
  }[intensity];
  return [
    'Perform a constrained PHOTOREALISTIC COSMETIC IMAGE EDIT.',
    'IMAGE 1: the source person and the ONLY identity and composition reference.',
    'IMAGE 2: makeup appearance reference ONLY; do not copy their facial identity.',
    'Create exactly ONE standalone photographic edit of image 1.',
    'Preserve exactly the original person, their face shape, eye shape and color,',
    'nose, lips anatomy, expression, teeth, age appearance, hairline, hair,',
    'earrings, clothing, head pose, camera framing, background and lighting.',
    'Do NOT change anatomy, enlarge eyes or lips, slim cheeks, whiten skin,',
    'remove natural facial texture, or use beauty smoothing.',
    'Keep true pores, fine hairs and natural local shadows.',
    'Transfer only these cosmetic properties from image 2:',
    regionText,
    intensityText,
    'Respect eyelid and lip borders and feather all makeup softly into real skin.',
    'Avoid double irises, unnaturally symmetric eyes, floating makeup,',
    'face substitution, identity drift, artifacts or changed hairstyles.',
    'Match the crop, orientation and aspect ratio of image 1.',
    'NO before/after collage, labels, text, watermark, frames or extra people.',
  ].join(' ');
}

export function neuralPreviewRoutes(adminEmails: string[]) {
  if (!adminEmails.length) throw Error('Owner allowlist required');
  return {
    'POST /api/neural-makeup-preview': [
      requireAuth(),
      requireAdminEmailAllowlist(adminEmails),
      async ({ body }: { body: unknown }) => {
        const p = body as RequestBody | null;
        if (!p || p.consent !== true) {
          return error('Explicit upload and cloud processing consent required', 400);
        }
        if (!validImage(p.source) || !validImage(p.reference)) {
          return error('Two valid JPEG, PNG or WebP images are required', 400);
        }
        if (p.source.data.length + p.reference.data.length > 5_600_000) {
          return error('Combined image payload exceeds the safety limit', 413);
        }
        if (!regions.has(p.region || '') || !intensities.has(p.intensity || '')) {
          return error('Invalid cosmetic region or intensity', 400);
        }
        try {
          const generated = await ai.imageGen({
            prompt: composeInstruction(p.region!, p.intensity!),
            images: [p.source, p.reference],
            maxOutputBytes: 1_000_000,
          });
          return json({
            image: generated.image,
            experimental: true,
            cloud_processed: true,
            photorealism_certified: false,
            no_personal_image_stored_by_app: true,
          });
        } catch {
          // Do not leak provider internals or either image into public logs.
          return error('Image generation did not complete; no cosmetic result was saved', 502);
        }
      },
    ],
  };
}
