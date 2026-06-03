import styled from 'styled-components';

export const Wrap = styled.div`
  flex: 1;
  position: relative;
  display: flex;
  flex-direction: column;
  overflow: hidden;
`;

// ZoomWrap — PR-E1e-1 (2026-05-11) 에서 ui LabelingCanvas 의 ZoomWrap 으로 흡수.

export const Toolbar = styled.div`
  height: 64px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: var(--ig-color-surface-panel);
  border-top: var(--ig-border-1px) solid var(--ig-color-white-08);
  padding: 0 var(--ig-space-7);
  position: relative;
`;

export const CenterActions = styled.div`
  display: flex;
  align-items: center;
  gap: var(--ig-space-5);
`;

export const RightActions = styled.div`
  position: absolute;
  right: 16px;
  display: flex;
  align-items: center;
  gap: var(--ig-space-4);
`;

export const IconBtn = styled.button<{ $variant?: 'primary' | 'danger' | 'secondary' }>`
  width: 40px;
  height: 40px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  border-radius: var(--ig-radius-pill);
  border: var(--ig-border-1px) solid transparent;
  cursor: pointer;
  transition: opacity 0.15s;
  &:hover { opacity: 0.8; }
  &:disabled { opacity: 0.35; cursor: not-allowed; }
  ${(p) =>
    p.$variant === 'primary'
      ? `background: var(--ig-color-accent); color: var(--ig-color-text-primary);`
      : p.$variant === 'danger'
        ? `background: rgba(255,95,122,0.18); color: var(--ig-color-danger); border-color: rgba(255,95,122,0.28);`
        : `background: var(--ig-color-white-08); color: var(--ig-color-text-primary); border-color: var(--ig-color-white-12);`}
`;

export const BBoxCount = styled.div`
  font-size: var(--ig-font-size-sm);
  color: var(--ig-color-text-muted);
  min-width: var(--ig-control-height-3xl);
  text-align: center;
`;

export const HintOverlay = styled.div`
  position: absolute;
  top: 10px;
  left: 10px;
  font-size: var(--ig-font-size-2xs);
  color: rgba(255, 255, 255, 0.45);
  pointer-events: none;
  background: var(--ig-color-overlay-mid);
  padding: var(--ig-space-1) 8px;
  border-radius: var(--ig-radius-xs);
  z-index: 5;
`;

export const PixelInfo = styled.div`
  position: absolute;
  bottom: 10px;
  right: 10px;
  font-family: var(--ig-font-mono, ui-monospace, Menlo, monospace);
  font-size: var(--ig-font-size-2xs);
  color: var(--ig-color-white-90);
  background: rgba(0, 0, 0, 0.65);
  padding: var(--ig-space-1) 8px;
  border-radius: var(--ig-radius-xs);
  pointer-events: none;
  white-space: nowrap;
  z-index: 5;
  display: flex;
  align-items: center;
  gap: var(--ig-space-3);
`;

export const PixelSwatch = styled.span<{ $color: string }>`
  display: inline-block;
  width: 10px;
  height: 10px;
  border-radius: 2px;
  background: ${(p) => p.$color};
  border: var(--ig-border-1px) solid var(--ig-color-white-30);
`;

export const BlockMsg = styled.div`
  position: absolute;
  bottom: 10px;
  left: 50%;
  transform: translateX(-50%);
  font-size: var(--ig-font-size-xs);
  color: var(--ig-color-warning);
  background: var(--ig-color-modal-backdrop);
  padding: var(--ig-space-1) 12px;
  border-radius: var(--ig-radius-xs);
  pointer-events: none;
  white-space: nowrap;
  z-index: 5;
`;

export const FullscreenBtn = styled.button`
  position: absolute;
  top: 10px;
  right: 10px;
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
  z-index: 6;
  transition: background 0.15s;
  &:hover { background: var(--ig-color-modal-backdrop); }
`;

export const AnnotationToggleBtn = styled(FullscreenBtn)<{ $active?: boolean }>`
  right: 54px;
  background: ${(p) => (p.$active ? 'rgba(77, 136, 255, 0.62)' : 'var(--ig-color-overlay-dim)')};
  &:hover {
    background: ${(p) => (p.$active ? 'var(--ig-color-blue-tint-78)' : 'var(--ig-color-modal-backdrop)')};
  }
`;

// ── Modal-style chrome (Header / Hint / Toolbar) ─────────────────────────────

export const Header = styled.div`
  display: flex;
  align-items: center;
  width: 100%;
  flex-shrink: 0;
  gap: var(--ig-space-3);
  padding: var(--ig-space-4) 12px 0;
`;

export const HeaderLeft = styled.div`
  display: flex;
  gap: var(--ig-space-3);
  flex-shrink: 0;
`;

export const HeaderSpacer = styled.div`
  flex: 1;
`;

export const HeaderIconBtn = styled.button<{ $active?: boolean }>`
  flex-shrink: 0;
  width: 40px;
  height: 40px;
  border: var(--ig-border-1px) solid var(--ig-color-white-12);
  border-radius: var(--ig-radius-xs);
  background: ${(p) => (p.$active ? 'var(--ig-color-blue-tint-55)' : 'var(--ig-color-white-04)')};
  color: var(--ig-color-text-primary);
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  &:hover { background: var(--ig-color-white-12); }
`;

export const HintBar = styled.div`
  flex-shrink: 0;
  text-align: center;
  font-size: var(--ig-font-size-2xs);
  color: var(--ig-color-text-muted);
  padding: var(--ig-space-1) 12px;
`;

export const ToolbarSpacer = styled.div`
  flex: 1;
`;

export const ModeToggleGroup = styled.div`
  display: flex;
  gap: var(--ig-space-2);
  margin-right: var(--ig-space-3);
`;

export const ModeToggleBtn = styled.button<{ $active?: boolean }>`
  width: var(--ig-control-height-md);
  height: var(--ig-control-height-md);
  border: var(--ig-border-1px) solid ${(p) => (p.$active ? 'var(--ig-color-blue-tint-55)' : 'var(--ig-color-white-12)')};
  border-radius: var(--ig-radius-xs);
  background: ${(p) => (p.$active ? 'var(--ig-color-blue-tint-18)' : 'transparent')};
  color: var(--ig-color-text-primary);
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: background 0.14s ease;
  &:hover { background: var(--ig-color-white-08); }
`;
