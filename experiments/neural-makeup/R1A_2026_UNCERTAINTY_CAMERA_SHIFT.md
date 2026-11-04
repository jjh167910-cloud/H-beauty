# H-Beauty R1-A — uncertainty and reference-camera-shift study (5 Nov 2026)

**Synthetic-only applied research. No real-face data. No state-of-the-art/production claim.** This research branch is separate from both Cloudflare staging and the H-Beauty salon `main` branch.

## Objective and protocol
Extend R0's 5,635-parameter deterministic regional RGB-delta student with a 5,830-parameter model predicting **RGB delta means and heteroscedastic variances**, not pigment/opacity. Compare on held-out synthetic procedural identities, with an additional deterministic RGB camera shift applied only to the observed **reference** photograph. The source and target remain unchanged.

3 independent procedural training seeds: `20261104`, `20261105`, `20261106`. Each: 320 training, 96 independent calibration and 96 test synthetic identities, 45 epochs, CPU PyTorch. Original R0 procedural generator/regions and exact compositing preserved. Recalibrated simultaneous RGB 90% split-conformal intervals on a separate calibration set; guarantees require exchangeability, not present under camera shift.

## Three-seed mean full-image cosmetic-mask RGB MAE (0–255; lower better)

| Synthetic evaluation | Reference contrast | R0 MSE student | R1 NLL student | Mean R1 gain vs R0 |
|---|---:|---:|---:|---:|
| Familiar procedural reference | 6.456 | 4.328 | **4.064** | +0.264 |
| Shifted reference camera | 6.553 | 4.859 | **4.389** | +0.470 |

Individual R1 gains familiar: +0.594, +0.212, **-0.013**. Shifted: +0.508, +0.724, +0.178. Exploratory hierarchical 5,000-draw 95% bootstrap intervals: **[-0.005,+0.584]** familiar (includes zero), **[+0.193,+0.718]** shifted (specific synthetic transform only).

**90% interval coverage**: 90.10% familiar, **88.54%** shifted. Uncertainty-error correlation in first seed weak (~0.24 familiar, 0.18 shifted). A high-confidence/low-risk claim is NOT warranted. The 5,830-parameter, initialization-matched MSE control was outperformed by NLL in 2 of 3 seeds; one seed favored MSE.

## Image safety, data rights
- Strict source copy outside the authorized procedural cosmetic mask: exact zero RGB difference in all simulated tests. No face replacement.
- New fail-closed **metadata-only** future real-data preflight checks declared permissions for commercial model training/use, reference and source pseudonymous subject/session/capture/consent IDs, SHA256 image bytes, cross-split identity and capture leakage, safe local paths. **Cannot authenticate legal consent or detect near-duplicate faces.**
- **12/12 synthetic unit tests PASS**, including negative fixtures: missing rights, cross-split repeated identity, duplicate image bytes, path traversal, wrong SHA.
- Future real photos will be personal data when identifiable; GDPR lawful basis, revocable consent as applicable, retention/withdrawal and model output rights must be independently reviewed. See: https://commission.europa.eu/law/law-topic/data-protection/information-individuals_en and https://www.edpb.europa.eu/news/edpb-opinion-on-ai-models-gdpr-principles-support-responsible-ai_en

## Source integrity and transfer scope
Full code, R0 generator copy, data preflight, 3 synthetic checkpoints, charts, 3-page PDF, extended markdown report, 12 tests, model ablations and verified byte manifest are in the user's generated archive **`HBeauty_Applied_Research_R1_2026.zip`**:
- 27 file entries, ZIP SHA-256 **`e356fd49449c6a9f31059fd4bda991af6228a720c4043ca24415ee5fc4286806`**, 422,344 bytes.
- The GitHub connector provides text-file writes; this research **record** does NOT claim to have uploaded the checkpoint ZIP to GitHub.
- Command interface: `python -m pytest -q code/test_r1.py code/test_rights_gate.py`, then `python code/r1_uncertainty.py --seed 20261104 --train 320 --cal 96 --test 96 --epochs 45 --out results/seed20261104`, repeat seeds 20261105/06; `python code/summarize_r1.py` and `python code/capacity_ablation.py`.

## Research decision
**GO for methods validation and preparation of consented real-photo evaluation. NO-GO** for production model promotion, state-of-the-art claims, real-face effect sizes, identity fairness or physical Android performance. This is **R1-A**; the scientifically decisive **R1-B** is licensed paired real photos and a physically interpretable pigment/alpha appearance predictor, not more synthetic-only mask tuning.

References: WACV 2026 Chau et al., [WACV link](https://openaccess.thecvf.com/content/WACV2026/html/Chau_Towards_High-Fidelity_Identity-Preserving_Real-Time_Makeup_Transfer_Decoupling_Style_Generation_WACV_2026_paper.html); [MagicMakeup noncommercial research code](https://github.com/vivoCameraResearch/Magic-Makeup); [FRAM](https://github.com/zaczgao/Facial_Region-Aware_Makeup).
