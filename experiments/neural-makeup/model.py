"""H-Beauty original, experimental region-aware neural cosmetic-transfer core.

Input: RGB source/reference, plus four soft masks each (eyes, lips, cheeks,
complexion). Reference features are pooled per region rather than spatially
warped into the source, reducing the opportunity to copy reference identity.
This module does not include weights and is not a production renderer.
"""
from __future__ import annotations

import torch
from torch import Tensor, nn
from torch.nn import functional as F

REGIONS = ('eyes', 'lips', 'cheeks', 'complexion')


class ConvBlock(nn.Module):
    def __init__(self, input_channels: int, output_channels: int):
        super().__init__()
        self.layers = nn.Sequential(
            nn.Conv2d(input_channels, output_channels, 3, padding=1),
            nn.GroupNorm(8, output_channels),
            nn.SiLU(),
            nn.Conv2d(output_channels, output_channels, 3, padding=1),
            nn.GroupNorm(8, output_channels),
            nn.SiLU(),
        )

    def forward(self, x: Tensor) -> Tensor:
        return self.layers(x)


class AppearanceNet(nn.Module):
    """Region-conditioned learnable delta/alpha predictor, hard-masked outside."""

    def __init__(self, width: int = 32, regions: int = 4):
        super().__init__()
        if width % 8 or width < 16 or regions != len(REGIONS):
            raise ValueError('width must be >=16 and divisible by 8; regions=4')
        self.source_encoder = ConvBlock(3 + regions, width)
        self.source_deep = ConvBlock(width, width * 2)
        self.reference_encoder = ConvBlock(3 + regions, width)
        self.reference_deep = ConvBlock(width, width * 2)
        self.style_projection = nn.Sequential(
            nn.Linear(width * 2, width * 2),
            nn.SiLU(),
            nn.Linear(width * 2, width * 2),
        )
        self.fuse = ConvBlock(width * 4, width * 2)
        self.decoder = ConvBlock(width * 3, width)
        self.head = nn.Conv2d(width, 4, 1)
        # Conservative but differentiable initial appearance: zero delta.
        nn.init.zeros_(self.head.weight)
        with torch.no_grad():
            self.head.bias[:3].zero_()
            self.head.bias[3].fill_(-2.0)

    def forward(
        self,
        source: Tensor,
        reference: Tensor,
        source_regions: Tensor,
        reference_regions: Tensor,
    ) -> Tensor:
        if source.ndim != 4 or source.shape[1] != 3 or reference.shape != source.shape:
            raise ValueError('source/reference must be matching BCHW RGB tensors')
        if source_regions.shape != (source.shape[0], 4, *source.shape[-2:]):
            raise ValueError('source_regions must be Bx4xHxW')
        if reference_regions.shape != source_regions.shape:
            raise ValueError('reference_regions must match source_regions')
        if source.shape[-1] < 32 or source.shape[-2] < 32:
            raise ValueError('minimum spatial size is 32 x 32')

        src_mask = source_regions.clamp(0.0, 1.0)
        ref_mask = reference_regions.clamp(0.0, 1.0)
        src_early = self.source_encoder(torch.cat([source, src_mask], dim=1))
        src_deep = self.source_deep(F.avg_pool2d(src_early, 2))
        ref_early = self.reference_encoder(torch.cat([reference, ref_mask], dim=1))
        ref_deep = self.reference_deep(F.avg_pool2d(ref_early, 2))

        mask_size = src_deep.shape[-2:]
        ref_small = F.interpolate(ref_mask, size=mask_size, mode='area')
        src_small = F.interpolate(src_mask, size=mask_size, mode='area')

        # Reference identity geometry is not copied; only per-region statistics.
        denominator = ref_small.sum(dim=(2, 3)).clamp_min(1e-6)
        style = torch.einsum('bchw,brhw->brc', ref_deep, ref_small)
        style = self.style_projection(style / denominator.unsqueeze(-1))
        valid = (ref_small.sum(dim=(2, 3)) > 1e-6).to(style.dtype)
        style = style * valid.unsqueeze(-1)
        style_field = torch.einsum('brc,brhw->bchw', style, src_small)

        fused = self.fuse(torch.cat([src_deep, style_field], dim=1))
        decoded = self.decoder(torch.cat([
            F.interpolate(fused, size=src_early.shape[-2:],
                          mode='bilinear', align_corners=False),
            src_early,
        ], dim=1))
        predicted = self.head(decoded)
        # No reference makeup in a region means no edit in that region.
        # This fail-closed gate protects users from hallucinated cosmetics.
        reference_present = (ref_mask.sum(dim=(2, 3)) > 1e-6).to(src_mask.dtype)
        eligible = src_mask * reference_present[:, :, None, None]
        edit_gate = eligible.sum(dim=1, keepdim=True).clamp(0, 1)
        alpha = predicted[:, 3:4].sigmoid() * edit_gate
        delta = predicted[:, :3].tanh()
        transferred = (source + 0.85 * alpha * delta).clamp(0, 1)
        return torch.where(edit_gate > 0, transferred, source)


def training_loss(output: Tensor, target: Tensor, source: Tensor, masks: Tensor) -> Tensor:
    if output.shape != target.shape or source.shape != target.shape:
        raise ValueError('training images must have identical dimensions')
    gate = masks.sum(dim=1, keepdim=True).clamp(0, 1)
    editable = ((output - target).abs() * gate).sum() / (gate.sum() * 3 + 1e-6)
    horizontal = (
        (output[:, :, :, 1:] - output[:, :, :, :-1]) -
        (target[:, :, :, 1:] - target[:, :, :, :-1])
    ).abs().mean()
    protected = ((output - source).abs() * (1 - gate)).mean()
    return editable + 0.12 * horizontal + 2.0 * protected
