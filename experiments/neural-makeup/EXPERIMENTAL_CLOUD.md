# Optional cloud neural comparator (NOT deployed)

This research-only adapter provides a real hosted Gemini image-editing path for controlled A/B comparison against the offline v19.2 engine. It is **not** an offline solution, an autonomous replacement, or a certified state-of-the-art makeup generator.

## Files

- appdeploy-neural-preview-route.ts — owner-authenticated backend adapter using the supported AppDeploy image-generation API, two image inputs, strict region/intensity choices, consent enforcement, and no intentional photo persistence in app storage.
- appdeploy-neural-preview-ui.ts — owner sign-in, source/reference upload, explicit opt-in, client-side compression, and output/download controls.

## Proposed integration — independent preview ONLY

After the hosting account's daily deployment limit resets, integrate these into the **separate AppDeploy preview**:

1. Place the route module in the preview's backend directory. Inside its existing router, spread neuralPreviewRoutes(ADMIN_EMAILS), reusing the existing owner email allowlist.
2. Add a dedicated preview-only mount element inside the AI engine tab and call mountNeuralPreviewPanel(mount) from the existing main UI. Do not insert any module into H-Beauty Cloudflare production or the offline installation archive.
3. Review the exact privacy copy before release. Source and reference photos are transmitted to the hosted Gemini image service only after checkbox consent; external provider terms apply, and request payloads may transit managed infrastructure. **Do not claim the entire request is local or offline.**
4. Keep owner-only access so anonymous guests cannot spend service credits. The endpoint is never invoked automatically. No images are intentionally placed in app storage or telemetry by these modules.
5. Compare results through the existing local quality lab; do not promote without blind multi-person testing, identity preservation tests, license review and the Android offline milestone.

## Limitations

The AppDeploy image-generation API chooses its managed Gemini image model. It exposes no guaranteed 2K native output setting in the available SDK and caps returned image bytes at 1,000,000. This is a **cloud-based, experimental neural quality comparator**, not proof that a native high-resolution offline salon model exists.

For offline production, prioritize the original model in this folder, train it with rights-cleared pairs, export signed ONNX, integrate ONNX Runtime Web and validate memory/latency/visual quality on actual Android hardware.
