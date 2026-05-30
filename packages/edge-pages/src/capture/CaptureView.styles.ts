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
  top: 16px;
  left: 16px;
  z-index: 3;
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: var(--ig-space-3);
  width: 240px;
`;

export const MetricCard = styled.div`
  background: rgba(17, 24, 39, 0.7);
  border: var(--ig-border-1px) solid var(--ig-color-white-12);
  border-radius: var(--ig-radius-sm);
  padding: var(--ig-space-3) 10px;
`;

export const MetricLabel = styled.div`
  font-size: var(--ig-font-size-2xs);
  color: rgba(255,255,255,0.62);
  text-transform: uppercase;
  letter-spacing: var(--ig-letter-spacing-normal);
`;

export const MetricValue = styled.div`
  font-size: var(--ig-font-size-md);
  font-weight: var(--ig-font-weight-bold);
  color: var(--ig-color-text-primary);
  margin-top: 2px;
`;

export const SetupBlockingOverlay = styled.div`
  position: absolute;
  inset: 0;
  z-index: 4;
  background: rgba(0, 0, 0, 0.36);
  display: flex;
  align-items: center;
  justify-content: center;
  pointer-events: none;
`;

export const SetupBlockingCard = styled.div`
  background: rgba(17, 24, 39, 0.86);
  border: var(--ig-border-1px) solid var(--ig-color-white-12);
  border-radius: var(--ig-radius-lg);
  padding: 18px 22px;
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
  top: 10px;
  right: 14px;
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  gap: var(--ig-space-2);
  z-index: 4;
`;

export const OverlayHeader = styled.button`
  width: 36px;
  height: 36px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: rgba(0, 0, 0, 0.45);
  border: none;
  border-radius: var(--ig-radius-xs);
  color: var(--ig-color-text-primary);
  cursor: pointer;
  transition: background 0.15s;
  &:hover { background: var(--ig-color-modal-backdrop); }
`;

export const OverlayPopover = styled.div`
  background: var(--ig-color-surface-header);
  border: var(--ig-border-1px) solid var(--ig-color-border-subtle);
  border-radius: var(--ig-radius-xs);
  backdrop-filter: blur(10px);
  box-shadow: var(--ig-shadow-panel);
  padding: var(--ig-space-4) 12px;
  min-width: 160px;
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
  height: 100px;
  background-color: var(--ig-color-surface-panel);
  border-top: var(--ig-border-1px) solid var(--ig-color-border-subtle);
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 20px;
  position: relative;
  flex-shrink: 0;
`;

export const CaptureButtonWrap = styled.div`
  position: absolute;
  left: 50%;
  transform: translateX(-50%);
`;

export const CaptureButton = styled.button<{ $capturing?: boolean }>`
  width: 64px;
  height: 64px;
  border-radius: 50%;
  background: linear-gradient(135deg, var(--ig-color-accent) 0%, var(--ig-color-accent-strong) 100%);
  border: 3px solid var(--ig-color-border-strong);
  cursor: pointer;
  transition: all 0.16s ease;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 0;
  box-shadow: 0 8px 24px rgba(41, 98, 217, 0.3);
  position: relative;

  &:active {
    transform: scale(0.95);
    box-shadow: 0 4px 12px rgba(41, 98, 217, 0.2);
  }

  ${(p) => p.$capturing
    ? css`
        cursor: not-allowed;
        &:after {
          content: '';
          display: block;
          width: 40px;
          height: 40px;
          border-radius: 50%;
          border: 3px solid rgba(255, 255, 255, 0.25);
          border-top-color: rgba(255, 255, 255, 0.9);
          animation: ${captureSpinAnim} 0.75s linear infinite;
        }
      `
    : css`
        &:after {
          content: '';
          display: block;
          width: 46px;
          height: 46px;
          border-radius: 50%;
          border: 2px solid rgba(255, 255, 255, 0.5);
        }
      `}

  & > svg {
    position: absolute;
    z-index: 1;
  }

  &:disabled:not([data-capturing]) {
    opacity: 0.45;
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
    linear-gradient(to right, transparent 49px, var(--ig-color-white-12) 50px, transparent 51px),
    linear-gradient(to bottom, transparent 49px, var(--ig-color-white-12) 50px, transparent 51px);
  background-size: 100px 100px;
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
    height: 1px;
    background-color: rgba(255, 255, 0, 0.5);
    transform: translateY(-50%);
  }
  &::after {
    content: '';
    position: absolute;
    left: 50%;
    top: 0; bottom: 0;
    width: 1px;
    background-color: rgba(255, 255, 0, 0.5);
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
  top: 14px;
  right: 14px;
  z-index: 3;
  padding: var(--ig-space-3);
  border-radius: var(--ig-radius-sm);
  background: rgba(12, 16, 22, 0.82);
  border: var(--ig-border-1px) solid var(--ig-color-white-12);
  backdrop-filter: blur(8px);
`;

export const HistogramImage = styled.img`
  display: block;
  width: 224px;
  height: 84px;
  border-radius: var(--ig-radius-xs);
`;

export const AbsolutePlaceholder = styled(PlaceholderText)`
  position: absolute;
  z-index: 1;
`;

export const CapturingBadge = styled.div`
  position: fixed;
  top: 64px;
  left: 50%;
  transform: translateX(-50%);
  z-index: 9999;
  background: rgba(0, 0, 0, 0.78);
  color: var(--ig-color-text-primary);
  font-size: var(--ig-font-size-md);
  font-weight: var(--ig-font-weight-semibold);
  letter-spacing: var(--ig-letter-spacing-normal);
  padding: var(--ig-space-2) 16px;
  border-radius: var(--ig-radius-sm, 6px);
  pointer-events: none;
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.4);
`;

export const CapturePreviewFullscreenBtn = styled.button`
  position: absolute;
  top: 10px;
  right: 60px;
  width: 36px;
  height: 36px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: rgba(0, 0, 0, 0.45);
  border: none;
  border-radius: var(--ig-radius-xs);
  color: var(--ig-color-text-primary);
  cursor: pointer;
  z-index: 4;
  transition: background 0.15s;
  &:hover { background: var(--ig-color-modal-backdrop); }
`;
