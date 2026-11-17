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
  height: var(--ig-control-height-3xl-plus);
  display: flex;
  align-items: center;
  justify-content: center;
  background: var(--ig-color-surface-panel);
  box-shadow: inset 0 var(--ig-border-1px) 0 var(--ig-color-white-08);
  padding: 0 var(--ig-spacing-16);
  position: relative;
`;


export const RightActions = styled.div`
  position: absolute;
  right: var(--ig-spacing-16);
  display: flex;
  align-items: center;
  gap: var(--ig-spacing-8);
`;

export const BBoxCount = styled.div`
  font-size: var(--ig-text-body-sm);
  line-height: var(--ig-text-body-sm-leading);
  color: var(--ig-color-text-muted);
  min-width: var(--ig-control-height-3xl);
  text-align: center;
`;

export const HintOverlay = styled.div`
  position: absolute;
  top: var(--ig-spacing-8);
  left: var(--ig-spacing-8);
  font-size: var(--ig-text-micro);
  line-height: var(--ig-text-micro-leading);
  color: var(--ig-color-white-45);
  pointer-events: none;
  background: var(--ig-color-overlay-mid);
  padding: var(--ig-spacing-4) var(--ig-spacing-8);
  border-radius: var(--ig-radius-xs);
  z-index: var(--ig-z-capture);
`;

export const PixelInfo = styled.div`
  position: absolute;
  bottom: var(--ig-spacing-8);
  right: var(--ig-spacing-8);
  font-family: var(--ig-font-mono, ui-monospace, Menlo, monospace);
  font-size: var(--ig-text-micro);
  line-height: var(--ig-text-micro-leading);
  color: var(--ig-color-white-90);
  background: var(--ig-color-overlay-darker);
  padding: var(--ig-spacing-4) var(--ig-spacing-8);
  border-radius: var(--ig-radius-xs);
  pointer-events: none;
  white-space: nowrap;
  z-index: var(--ig-z-capture);
  display: flex;
  align-items: center;
  gap: var(--ig-spacing-8);
`;

export const PixelSwatch = styled.span<{ $color: string }>`
  display: inline-block;
  width: var(--ig-size-swatch-sm);
  height: var(--ig-size-swatch-sm);
  border-radius: var(--ig-spacing-2);
  background: ${(p) => p.$color};
  border: var(--ig-border-1px) solid var(--ig-color-white-30);
`;

export const BlockMsg = styled.div`
  position: absolute;
  bottom: var(--ig-spacing-8);
  left: 50%;
  transform: translateX(-50%);
  font-size: var(--ig-text-caption);
  line-height: var(--ig-text-caption-leading);
  color: var(--ig-color-warning);
  background: var(--ig-color-modal-backdrop);
  padding: var(--ig-spacing-4) var(--ig-spacing-12);
  border-radius: var(--ig-radius-xs);
  pointer-events: none;
  white-space: nowrap;
  z-index: var(--ig-z-capture);
`;

// ── Modal-style chrome (Header / Hint / Toolbar) ─────────────────────────────

export const Header = styled.div`
  display: flex;
  align-items: center;
  width: 100%;
  flex-shrink: 0;
  gap: var(--ig-spacing-8);
  padding: var(--ig-spacing-8) var(--ig-spacing-12) 0;
`;

export const HeaderLeft = styled.div`
  display: flex;
  gap: var(--ig-spacing-8);
  flex-shrink: 0;
`;

export const HeaderSpacer = styled.div`
  flex: 1;
`;

export const HintBar = styled.div`
  flex-shrink: 0;
  text-align: center;
  font-size: var(--ig-text-micro);
  line-height: var(--ig-text-micro-leading);
  color: var(--ig-color-text-muted);
  padding: var(--ig-spacing-4) var(--ig-spacing-12);
`;

export const ToolbarSpacer = styled.div`
  flex: 1;
`;

export const ModeToggleGroup = styled.div`
  display: flex;
  gap: var(--ig-spacing-8);
  margin-right: var(--ig-spacing-8);
`;

