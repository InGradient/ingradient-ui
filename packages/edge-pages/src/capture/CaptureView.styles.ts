import { rotations } from '@ingradient/ui'
import styled, { css, keyframes } from 'styled-components';
import { withSurfaceDepth } from '@ingradient/ui/primitives'
import { edgeGeometry } from '../geometry'

const captureSpinAnim = keyframes`to { transform: rotate(${rotations.full}); }`;

export { Spinner as ConnectingSpinner } from '@ingradient/ui/components';

export const PreviewArea = styled.div`
  flex: 1;
  min-height: 0;
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
`;

export const CaptureZoomWrap = styled.div.attrs<{ $zoom: number; $panX: number; $panY: number }>((p) => ({
  style: {
    transform: `translate(${p.$panX}px, ${p.$panY}px) scale(${p.$zoom})`,
    transformOrigin: 'center center',
  },
}))`
  position: absolute;
  inset: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  pointer-events: none;
  > * { pointer-events: auto; }
`;

export const SetupMetrics = styled.div`
  position: absolute;
  top: var(--ig-spacing-16);
  left: var(--ig-spacing-16);
  z-index: var(--ig-z-raised-plus);
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: var(--ig-spacing-8);
  width: var(--ig-popup-sm);
`;

export const MetricLabel = styled.div`
  font-size: var(--ig-text-micro);
  color: var(--ig-color-white-62);
  text-transform: uppercase;
  letter-spacing: var(--ig-letter-spacing-normal);
`;

export const MetricValue = styled.div`
  font-size: var(--ig-text-body);
  font-weight: var(--ig-font-weight-bold);
  color: var(--ig-color-text-primary);
  margin-top: var(--ig-spacing-2);
`;

export const SetupBlockingOverlay = styled.div`
  position: absolute;
  inset: 0;
  z-index: var(--ig-z-capture-high);
  background: var(--ig-color-capture-overlay);
  display: flex;
  align-items: center;
  justify-content: center;
  pointer-events: none;
`;

const SetupBlockingCardBase = styled.div`
  background: var(--ig-color-capture-surface-loud);
  border: var(--ig-border-1px) solid var(--ig-color-white-12);
  border-radius: var(--ig-radius-lg);
  padding: var(--ig-spacing-16) var(--ig-spacing-24);
  color: var(--ig-color-text-primary);
  display: flex;
  align-items: center;
  gap: var(--ig-spacing-8);
  font-size: var(--ig-text-body-sm);
  font-weight: var(--ig-font-weight-semibold);
`;
export const SetupBlockingCard = withSurfaceDepth(SetupBlockingCardBase, { displayName: 'SetupBlockingCard' })

export const OverlayControls = styled.div`
  position: absolute;
  top: var(--ig-spacing-8);
  right: var(--ig-spacing-12);
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  gap: var(--ig-spacing-8);
  z-index: var(--ig-z-capture-high);
`;

const OverlayPopoverBase = styled.div`
  background: var(--ig-color-surface-header);
  border: var(--ig-border-1px) solid var(--ig-color-border-subtle);
  border-radius: var(--ig-radius-xs);
  backdrop-filter: var(--ig-blur-sm);
  box-shadow: var(--ig-shadow-panel);
  padding: var(--ig-spacing-8) var(--ig-spacing-12);
  min-width: var(--ig-popup-2xs-plus);
  display: flex;
  flex-direction: column;
  gap: var(--ig-spacing-8);
`;
export const OverlayPopover = withSurfaceDepth(OverlayPopoverBase, { floating: true, displayName: 'OverlayPopover' })

export const ControlRow = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  color: var(--ig-color-text-secondary);
  font-size: var(--ig-text-body-sm);
`;

export const CaptureBar = styled.div`
  height: ${edgeGeometry.captureBar};
  background-color: var(--ig-color-surface-panel);
  border-top: var(--ig-border-1px) solid var(--ig-color-border-subtle);
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 var(--ig-spacing-20);
  position: relative;
  flex-shrink: 0;
`;

export const CaptureButtonWrap = styled.div`
  position: absolute;
  left: 50%;
  transform: translateX(-50%);
`;

/** Camera shutter: a large round trigger with a capture spinner. No shared Button role matches it (DESIGN §9), so it stays local. */
export const CaptureButton = styled.button<{ $capturing?: boolean }>`
  width: var(--ig-control-height-3xl-plus);
  height: var(--ig-control-height-3xl-plus);
  border-radius: 50%;
  background: linear-gradient(135deg, var(--ig-color-accent) 0%, var(--ig-color-accent-strong) 100%);
  border: var(--ig-border-2px) solid var(--ig-color-border-strong);
  cursor: pointer;
  transition: all var(--ig-motion-fast-ease);
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 0;
  box-shadow: 0 var(--ig-spacing-8) var(--ig-spacing-24) var(--ig-color-blue-strong-tint-30);
  position: relative;

  &:active {
    transform: scale(var(--ig-scale-press));
    box-shadow: 0 var(--ig-spacing-4) var(--ig-spacing-12) var(--ig-color-blue-strong-tint-20);
  }

  ${(p) => p.$capturing
    ? css`
        cursor: not-allowed;
        &:after {
          content: '';
          display: block;
          width: var(--ig-control-height-mid-plus);
          height: var(--ig-control-height-mid-plus);
          border-radius: 50%;
          border: var(--ig-border-2px) solid var(--ig-color-border-strong);
          border-top-color: var(--ig-color-white-90);
          animation: ${captureSpinAnim} var(--ig-motion-spinner-fast) linear infinite;
        }
      `
    : css`
        &:after {
          content: '';
          display: block;
          width: var(--ig-control-height-xl);
          height: var(--ig-control-height-xl);
          border-radius: 50%;
          border: var(--ig-border-2px) solid var(--ig-color-text-muted);
        }
      `}

  & > svg {
    position: absolute;
    z-index: var(--ig-z-base);
  }

  &:disabled:not([data-capturing]) {
    opacity: var(--ig-opacity-faded);
    cursor: not-allowed;
    box-shadow: none;
  }
`;

export const StatusText = styled.div`
  color: var(--ig-color-text-soft);
  font-size: var(--ig-text-caption);
  flex-shrink: 0;
`;

export const GridOverlay = styled.div`
  position: absolute;
  inset: 0;
  pointer-events: none;
  z-index: var(--ig-z-raised);
  background-image:
    linear-gradient(to right, transparent calc(${edgeGeometry.captureGrid} / 2 - var(--ig-space-1px)), var(--ig-color-white-12) calc(${edgeGeometry.captureGrid} / 2), transparent calc(${edgeGeometry.captureGrid} / 2 + var(--ig-space-1px))),
    linear-gradient(to bottom, transparent calc(${edgeGeometry.captureGrid} / 2 - var(--ig-space-1px)), var(--ig-color-white-12) calc(${edgeGeometry.captureGrid} / 2), transparent calc(${edgeGeometry.captureGrid} / 2 + var(--ig-space-1px)));
  background-size: ${edgeGeometry.captureGrid} ${edgeGeometry.captureGrid};
  background-position: center center;
`;

export const CenterCrosshair = styled.div`
  position: absolute;
  inset: 0;
  pointer-events: none;
  z-index: var(--ig-z-raised);
  &::before {
    content: '';
    position: absolute;
    top: 50%;
    left: 0; right: 0;
    height: var(--ig-space-1px);
    background-color: var(--ig-color-yellow-tint-50);
    transform: translateY(-50%);
  }
  &::after {
    content: '';
    position: absolute;
    left: 50%;
    top: 0; bottom: 0;
    width: var(--ig-space-1px);
    background-color: var(--ig-color-yellow-tint-50);
    transform: translateX(-50%);
  }
`;

export const ConnectingBox = styled.div`
  position: absolute;
  z-index: var(--ig-z-raised);
  text-align: center;
  max-width: 90%;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: var(--ig-spacing-8);
`;

export const StreamImg = styled.img`
  width: 100%;
  height: 100%;
  object-fit: contain;
  object-position: center;
  display: block;
`;

export const FocusPeakingOverlay = styled.img`
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  object-fit: contain;
  pointer-events: none;
`;

const HistogramOverlayBase = styled.div`
  position: absolute;
  top: var(--ig-spacing-12);
  right: var(--ig-spacing-12);
  z-index: var(--ig-z-raised-plus);
  padding: var(--ig-spacing-8);
  border-radius: var(--ig-radius-sm);
  background: var(--ig-color-capture-bg-loud);
  border: var(--ig-border-1px) solid var(--ig-color-white-12);
  backdrop-filter: var(--ig-blur-xs);
`;
export const HistogramOverlay = withSurfaceDepth(HistogramOverlayBase, { floating: true, displayName: 'HistogramOverlay' })

export const HistogramImage = styled.img`
  display: block;
  width: ${edgeGeometry.histogramWidth};
  height: ${edgeGeometry.histogramHeight};
  border-radius: var(--ig-radius-xs);
`;

export const CapturingBadge = styled.div`
  position: fixed;
  top: var(--ig-control-height-3xl-plus);
  left: 50%;
  transform: translateX(-50%);
  z-index: var(--ig-z-tooltip);
  background: var(--ig-color-overlay-deep);
  color: var(--ig-color-text-primary);
  font-size: var(--ig-text-body);
  font-weight: var(--ig-font-weight-semibold);
  letter-spacing: var(--ig-letter-spacing-normal);
  padding: var(--ig-spacing-8) var(--ig-spacing-16);
  border-radius: var(--ig-radius-sm);
  pointer-events: none;
  box-shadow: 0 var(--ig-spacing-4) var(--ig-spacing-16) var(--ig-color-shadow-strong);
`;
