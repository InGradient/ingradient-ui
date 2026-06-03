import styled, { css, keyframes } from 'styled-components';

const captureSpinAnim = keyframes`to { transform: rotate(360deg); }`;

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
  top: var(--ig-space-7);
  left: var(--ig-space-7);
  z-index: 3;
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: var(--ig-space-3);
  width: var(--ig-popup-sm);
`;

export const MetricCard = styled.div`
  background: var(--ig-color-capture-surface);
  border: var(--ig-border-1px) solid var(--ig-color-white-12);
  border-radius: var(--ig-radius-sm);
  padding: var(--ig-space-3) var(--ig-space-4);
`;

export const MetricLabel = styled.div`
  font-size: var(--ig-font-size-2xs);
  color: var(--ig-color-white-62);
  text-transform: uppercase;
  letter-spacing: var(--ig-letter-spacing-normal);
`;

export const MetricValue = styled.div`
  font-size: var(--ig-font-size-md);
  font-weight: var(--ig-font-weight-bold);
  color: var(--ig-color-text-primary);
  margin-top: var(--ig-space-2px);
`;

export const SetupBlockingOverlay = styled.div`
  position: absolute;
  inset: 0;
  z-index: 4;
  background: var(--ig-color-capture-overlay);
  display: flex;
  align-items: center;
  justify-content: center;
  pointer-events: none;
`;

export const SetupBlockingCard = styled.div`
  background: var(--ig-color-capture-surface-loud);
  border: var(--ig-border-1px) solid var(--ig-color-white-12);
  border-radius: var(--ig-radius-lg);
  padding: var(--ig-space-8) var(--ig-space-10);
  color: var(--ig-color-text-primary);
  display: flex;
  align-items: center;
  gap: var(--ig-space-4);
  font-size: var(--ig-font-size-sm);
  font-weight: var(--ig-font-weight-semibold);
`;

export const PlaceholderText = styled.div`
  color: var(--ig-color-text-soft);
  font-size: var(--ig-font-size-4xl);
`;

export const OverlayControls = styled.div`
  position: absolute;
  top: var(--ig-space-4);
  right: var(--ig-space-6);
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  gap: var(--ig-space-2);
  z-index: 4;
`;

export const OverlayHeader = styled.button`
  width: var(--ig-control-height-md);
  height: var(--ig-control-height-md);
  display: flex;
  align-items: center;
  justify-content: center;
  background: var(--ig-color-overlay-dim);
  border: none;
  border-radius: var(--ig-radius-xs);
  color: var(--ig-color-text-primary);
  cursor: pointer;
  transition: background var(--ig-motion-swift);
  &:hover { background: var(--ig-color-modal-backdrop); }
`;

export const OverlayPopover = styled.div`
  background: var(--ig-color-surface-header);
  border: var(--ig-border-1px) solid var(--ig-color-border-subtle);
  border-radius: var(--ig-radius-xs);
  backdrop-filter: var(--ig-blur-lg);
  box-shadow: var(--ig-shadow-panel);
  padding: var(--ig-space-4) var(--ig-space-5);
  min-width: var(--ig-popup-2xs-plus);
  display: flex;
  flex-direction: column;
  gap: var(--ig-space-4);
`;

export const ControlRow = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  color: var(--ig-color-text-secondary);
  font-size: var(--ig-font-size-sm);
`;

export const ControlLabel = styled.span`
  display: flex;
  align-items: center;
  gap: var(--ig-space-2);
`;

export const CaptureBar = styled.div`
  height: var(--ig-layout-capture-bar);
  background-color: var(--ig-color-surface-panel);
  border-top: var(--ig-border-1px) solid var(--ig-color-border-subtle);
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 var(--ig-space-9);
  position: relative;
  flex-shrink: 0;
`;

export const CaptureButtonWrap = styled.div`
  position: absolute;
  left: 50%;
  transform: translateX(-50%);
`;

export const CaptureButton = styled.button<{ $capturing?: boolean }>`
  width: var(--ig-control-height-capture);
  height: var(--ig-control-height-capture);
  border-radius: 50%;
  background: linear-gradient(135deg, var(--ig-color-accent) 0%, var(--ig-color-accent-strong) 100%);
  border: var(--ig-border-3px) solid var(--ig-color-border-strong);
  cursor: pointer;
  transition: all var(--ig-motion-fast-ease);
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 0;
  box-shadow: 0 var(--ig-space-3) var(--ig-space-11) var(--ig-color-blue-strong-tint-30);
  position: relative;

  &:active {
    transform: scale(0.95);
    box-shadow: 0 var(--ig-space-1) var(--ig-space-5) var(--ig-color-blue-strong-tint-20);
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
          border: var(--ig-border-3px) solid rgba(255, 255, 255, 0.25);
          border-top-color: var(--ig-color-white-90);
          animation: ${captureSpinAnim} 0.75s linear infinite;
        }
      `
    : css`
        &:after {
          content: '';
          display: block;
          width: var(--ig-control-height-xl);
          height: var(--ig-control-height-xl);
          border-radius: 50%;
          border: var(--ig-border-2px) solid rgba(255, 255, 255, 0.5);
        }
      `}

  & > svg {
    position: absolute;
    z-index: 1;
  }

  &:disabled:not([data-capturing]) {
    opacity: var(--ig-opacity-faded);
    cursor: not-allowed;
    box-shadow: none;
  }
`;

export const StatusText = styled.div`
  color: var(--ig-color-text-soft);
  font-size: var(--ig-font-size-xs);
  flex-shrink: 0;
`;

export const GridOverlay = styled.div`
  position: absolute;
  inset: 0;
  pointer-events: none;
  z-index: 2;
  background-image:
    linear-gradient(to right, transparent calc(var(--ig-layout-capture-grid) / 2 - 1px), var(--ig-color-white-12) calc(var(--ig-layout-capture-grid) / 2), transparent calc(var(--ig-layout-capture-grid) / 2 + 1px)),
    linear-gradient(to bottom, transparent calc(var(--ig-layout-capture-grid) / 2 - 1px), var(--ig-color-white-12) calc(var(--ig-layout-capture-grid) / 2), transparent calc(var(--ig-layout-capture-grid) / 2 + 1px));
  background-size: var(--ig-layout-capture-grid) var(--ig-layout-capture-grid);
  background-position: center center;
`;

export const CenterCrosshair = styled.div`
  position: absolute;
  inset: 0;
  pointer-events: none;
  z-index: 2;
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
  z-index: 2;
  text-align: center;
  max-width: 90%;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: var(--ig-space-3);
`;

export const ConnectingSpinnerBox = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: var(--ig-space-5);
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

export const HistogramOverlay = styled.div`
  position: absolute;
  top: var(--ig-space-6);
  right: var(--ig-space-6);
  z-index: 3;
  padding: var(--ig-space-3);
  border-radius: var(--ig-radius-sm);
  background: var(--ig-color-capture-bg-loud);
  border: var(--ig-border-1px) solid var(--ig-color-white-12);
  backdrop-filter: var(--ig-blur-xs);
`;

export const HistogramImage = styled.img`
  display: block;
  width: var(--ig-layout-histogram-width);
  height: var(--ig-layout-histogram-height);
  border-radius: var(--ig-radius-xs);
`;

export const AbsolutePlaceholder = styled(PlaceholderText)`
  position: absolute;
  z-index: 1;
`;

export const CapturingBadge = styled.div`
  position: fixed;
  top: var(--ig-control-height-capture);
  left: 50%;
  transform: translateX(-50%);
  z-index: 9999;
  background: var(--ig-color-overlay-deep);
  color: var(--ig-color-text-primary);
  font-size: var(--ig-font-size-md);
  font-weight: var(--ig-font-weight-semibold);
  letter-spacing: var(--ig-letter-spacing-normal);
  padding: var(--ig-space-2) var(--ig-space-7);
  border-radius: var(--ig-radius-sm);
  pointer-events: none;
  box-shadow: 0 var(--ig-space-1) var(--ig-space-7) rgba(0, 0, 0, 0.4);
`;

export const CapturePreviewFullscreenBtn = styled.button`
  position: absolute;
  top: var(--ig-space-4);
  right: var(--ig-control-height-3xl);
  width: var(--ig-control-height-md);
  height: var(--ig-control-height-md);
  display: flex;
  align-items: center;
  justify-content: center;
  background: var(--ig-color-overlay-dim);
  border: none;
  border-radius: var(--ig-radius-xs);
  color: var(--ig-color-text-primary);
  cursor: pointer;
  z-index: 4;
  transition: background var(--ig-motion-swift);
  &:hover { background: var(--ig-color-modal-backdrop); }
`;
