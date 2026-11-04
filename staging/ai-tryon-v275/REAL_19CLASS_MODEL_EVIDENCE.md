# Verified 19-class BiSeNet CPU inference — evidence (2026-11-04)

## Scope of proof
GitHub Actions [run 41743061971](https://github.com/jjh167910-cloud/H-beauty/actions/runs/41743061971) on `research/neural-makeup-v20` completed successfully.

Actual model: ResNet18 BiSeNet, 53,205,364 bytes, SHA-256:
`0d9bd318e46987c3bdbfacae9e2c0f461cae1c6ac6ea6d43bbe541a91727e33f`

Test source: repository catalog photo `public/makeup/looks/no-makeup.webp`, 900×1200 pixels.
Input contract: float NCHW `[batch,3,512,512]`. Output contract: float `[1,19,512,512]`. ONNX CPU session run was real, not synthetic.
Observed CPU inference: **171.159 ms excluding loading** on a hosted GitHub Actions runner (not an Android benchmark).
Nonzero classes included skin, brows, eyes, ear, earring, nose, mouth, upper/lower lips, neck and hair.

Artifacts, run ID 41743061971, artifact ID 13281652735:
- `resnet18.onnx` — verified original downloaded model.
- `face_parsing_labels.png` — actual inferred 19-class semantic labels.
- `face_parsing_overlay.png` — visible mask overlay.
- `face_parsing_report.json` — raw output dimensions and class counts.
- `model-sha256.txt` — pinned model integrity.

This evidence closes *CPU model execution* for this specific image. It does NOT establish segmentation accuracy across skin tones, ages or poses, Android performance, offline browser support, GPU/WebGL inference, identity-preserving makeup, or actual production deployment.

## Deployment gate
v27.5 staging is **not deployed**. The `HBeauty_v27_5_Isolated_Staging_Kit.zip` release asset is still absent from the pinned GitHub Release. The staging job now fails early and never invokes Cloudflare until the complete archive is present. The production `h-beauty` Worker is unrelated and must remain untouched.

## Licensing
Upstream [yakhyo/face-parsing](https://github.com/yakhyo/face-parsing) labels its repository MIT. For commercial distribution, independently verify checkpoint rights, upstream dependencies and training-data limitations; repository code licensing alone is not an unconditional grant of dataset/model rights.
