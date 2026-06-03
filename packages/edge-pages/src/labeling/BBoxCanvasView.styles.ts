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
  height: var(--ig-control-height-capture);
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
  right: var(--ig-space-7);
  display: flex;
  align-items: center;
  gap: var(--ig-space-4);
`;

export const IconBtn = styled.button<{ $variant?: 'primary' | 'danger' | 'secondary' }>`
  width: var(--ig-control-height-mid-plus);
  height: var(--ig-control-height-mid-plus);
  display: inline-flex;
  align-items: center;
  justify-content: center;
  border-radius: var(--ig-radius-pill);
  border: var(--ig-border-1px) solid transparent;
  cursor: pointer;
  transition: opacity var(--ig-motion-swift);
  &:hover { opacity: var(--ig-opacity-emphatic); }
  &:disabled { opacity: var(--ig-opacity-ghost); cursor: not-allowed; }
  ${(p) =>
    p.$variant === 'primary'
      ? `background: var(--ig-color-accent); color: var(--ig-color-text-primary);`
      : p.$variant === 'danger'
        ? `background: var(--ig-color-coral-tint-18); color: var(--ig-color-danger); border-color: var(--ig-color-coral-tint-28);`
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
  top: var(--ig-space-4);
  left: var(--ig-space-4);
  font-size: var(--ig-font-size-2xs);
  color: var(--ig-color-white-45);
  pointer-events: none;
  background: var(--ig-color-overlay-mid);
  padding: var(--ig-space-1) var(--ig-space-3);
  border-radius: var(--ig-radius-xs);
  z-index: var(--ig-z-capture);
`;

export const PixelInfo = styled.div`
  position: absolute;
  bottom: var(--ig-space-4);
  right: var(--ig-space-4);
  font-family: var(--ig-font-mono, ui-monospace, Menlo, monospace);
  font-size: var(--ig-font-size-2xs);
  color: var(--ig-color-white-90);
  background: var(--ig-color-overlay-darker);
  padding: var(--ig-space-1) var(--ig-space-3);
  border-radius: var(--ig-radius-xs);
  pointer-events: none;
  white-space: nowrap;
  z-index: var(--ig-z-capture);
  display: flex;
  align-items: center;
  gap: var(--ig-space-3);
`;

export const PixelSwatch = styled.span<{ $color: string }>`
  display: inline-block;
  width: var(--ig-space-4);
  height: var(--ig-space-4);
  border-radius: var(--ig-space-2px);
  background: ${(p) => p.$color};
  border: var(--ig-border-1px) solid var(--ig-color-white-30);
`;

export const BlockMsg = styled.div`
  position: absolute;
  bottom: var(--ig-space-4);
  left: 50%;
  transform: translateX(-50%);
  font-size: var(--ig-font-size-xs);
  color: var(--ig-color-warning);
  background: var(--ig-color-modal-backdrop);
  padding: var(--ig-space-1) var(--ig-space-5);
  border-radius: var(--ig-radius-xs);
  pointer-events: none;
  white-space: nowrap;
  z-index: var(--ig-z-capture);
`;

export const FullscreenBtn = styled.button`
  position: absolute;
  top: var(--ig-space-4);
  right: var(--ig-space-4);
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
  z-index: var(--ig-z-capture-super);
  transition: background var(--ig-motion-swift);
  &:hover { background: var(--ig-color-modal-backdrop); }
`;

export const AnnotationToggleBtn = styled(FullscreenBtn)<{ $active?: boolean }>`
  right: var(--ig-control-height-2xl);
  background: ${(p) => (p.$active ? 'var(--ig-color-blue-tint-62)' : 'var(--ig-color-overlay-dim)')};
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
  padding: var(--ig-space-4) var(--ig-space-5) 0;
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
  width: var(--ig-control-height-mid-plus);
  height: var(--ig-control-height-mid-plus);
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
  padding: var(--ig-space-1) var(--ig-space-5);
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
  background: ${(p) => (p.$active ? 'var(--ig-color-accent-soft-surface-hover)' : 'transparent')};
  color: var(--ig-color-text-primary);
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: background var(--ig-motion-fast-ease);
  &:hover { background: var(--ig-color-white-08); }
`;
