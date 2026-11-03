import styled from 'styled-components';
import { withSurfaceDepth } from '@ingradient/ui/primitives'
import { ModalBackdrop, surfacePanel } from '@ingradient/ui';
import { edgeGeometry } from '../geometry'

export const Container = styled.div`
  display: flex;
  flex-direction: column;
  height: 100%;
`;

export const Header = styled.div`
  padding: var(--ig-spacing-12);
  box-shadow: inset 0 var(--ig-space-neg-1px) 0 var(--ig-color-border-subtle);
  font-size: var(--ig-text-body-sm);
  font-weight: var(--ig-font-weight-semibold);
  color: var(--ig-color-text-muted);
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-shrink: 0;
`;

/** 헤더 오른쪽 — 필터 버튼과 접기 버튼을 나란히 둔다. */

export const FilterButtonWrap = styled.div`
  position: relative;
`;

const FilterPopoverBase = styled.div`
  position: absolute;
  top: 100%;
  right: 0;
  margin-top: var(--ig-spacing-8);
  min-width: var(--ig-popup-xs-tight);
  padding: calc(var(--ig-spacing-12) - var(--ig-border-1px));
  background: var(--ig-color-surface-raised);
  border: var(--ig-border-1px) solid var(--ig-color-border-strong);
  border-radius: var(--ig-radius-sm);
  box-shadow: var(--ig-shadow-panel);
  z-index: var(--ig-z-dropdown);
  font-size: var(--ig-text-caption);
  font-weight: normal;
  color: var(--ig-color-text-secondary);
`;
export const FilterPopover = withSurfaceDepth(FilterPopoverBase, { floating: true, displayName: 'FilterPopover' })

export const FilterSection = styled.div`
  margin-bottom: var(--ig-spacing-12);
  &:last-child { margin-bottom: 0; }
`;

export const FilterSectionTitle = styled.div`
  font-weight: var(--ig-font-weight-semibold);
  color: var(--ig-color-text-muted);
  margin-bottom: var(--ig-spacing-8);
  font-size: var(--ig-text-micro);
  text-transform: uppercase;
  letter-spacing: var(--ig-letter-spacing-wider);
`;

export const FilterRow = styled.div`
  display: flex;
  align-items: center;
  gap: var(--ig-spacing-8);
  cursor: pointer;
  margin-bottom: var(--ig-spacing-8);
  &:last-child { margin-bottom: 0; }
`;

export const DateRow = styled.div`
  display: flex;
  align-items: center;
  gap: var(--ig-spacing-8);
  margin-bottom: var(--ig-spacing-8);
`;

export const DateLabel = styled.span`
  min-width: max-content;
  color: var(--ig-color-text-muted);
`;

export const FilterButtonLabel = styled.span`
  margin-left: var(--ig-spacing-4);
`;

export const LogList = styled.div`
  flex: 1;
  min-height: 0;
  overflow-y: auto;
  padding: var(--ig-spacing-8);
  min-width: 0;
`;

export const LogItem = styled.div<{ type: 'error' | 'info' | 'success' }>`
  display: flex;
  align-items: start;
  gap: var(--ig-spacing-8);
  padding: var(--ig-spacing-8);
  margin-bottom: var(--ig-spacing-4);
  border-radius: var(--ig-radius-sm);
  cursor: default;
  /* Like Platform lists: rows stay transparent and the status icon carries success/info.
     Only errors keep a tint so they stand out in a long log. */
  background-color: ${({ type }) => (type === 'error' ? 'var(--ig-color-danger-bg-soft)' : 'transparent')};

  &:hover { background-color: var(--ig-color-surface-interactive); }
  &:focus-visible {
    outline: var(--ig-border-2px) solid var(--ig-color-accent-ring);
    outline-offset: var(--ig-space-neg-2px);
  }
`;

export const LogTime = styled.span`
  font-size: var(--ig-text-micro);
  color: var(--ig-color-text-soft);
  min-width: ${edgeGeometry.logTimeMin};
  margin-top: var(--ig-spacing-2);
  flex-shrink: 0;
`;

export const LogMessage = styled.div`
  font-size: var(--ig-text-caption);
  color: var(--ig-color-text-secondary);
  line-height: var(--ig-line-height-snug);
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
`;

const DetailPanelBase = styled.div<{ $visible: boolean }>`
  ${surfacePanel}
  background: var(--ig-color-surface-raised);
  position: fixed;
  left: ${edgeGeometry.logDetailLeft};
  top: ${edgeGeometry.logDetailTop};
  bottom: var(--ig-spacing-12);
  width: ${edgeGeometry.logDetailWidth};
  z-index: var(--ig-z-overlay-low);
  border-radius: var(--ig-radius-lg);
  display: ${({ $visible }) => ($visible ? 'flex' : 'none')};
  flex-direction: column;
  pointer-events: ${({ $visible }) => ($visible ? 'auto' : 'none')};
  overflow: hidden;
`;
export const DetailPanel = withSurfaceDepth(DetailPanelBase, { floating: true, displayName: 'DetailPanel' })

export const DetailImageClickable = styled.img`
  width: 100%;
  border-radius: var(--ig-radius-xs);
  border: var(--ig-border-1px) solid var(--ig-color-border-subtle);
  margin-bottom: var(--ig-spacing-8);
  background: var(--ig-color-bg-canvas);
  cursor: zoom-in;
  transition: opacity var(--ig-motion-fast-ease);
  &:hover { opacity: var(--ig-opacity-prominent); }
`;

export { ModalBackdrop as ImageModalOverlay };

export const ImageModalImg = styled.img`
  max-width: 90vw;
  max-height: 90vh;
  border-radius: var(--ig-radius-sm);
  border: var(--ig-border-1px) solid var(--ig-color-border-strong);
  box-shadow: 0 var(--ig-layout-shadow-y-offset) var(--ig-layout-shadow-blur) var(--ig-color-image-option-bg);
  object-fit: contain;
`;

export const DetailContent = styled.div`
  padding: var(--ig-spacing-8);
  overflow-y: auto;
  flex: 1;
  min-height: 0;
`;

export const DetailPlaceholder = styled.div`
  color: var(--ig-color-text-soft);
  font-size: var(--ig-text-caption);
  text-align: center;
  padding: var(--ig-spacing-16) var(--ig-spacing-8);
`;

export const LogPlaceholder = styled.div`
  padding: var(--ig-spacing-12);
  font-size: var(--ig-text-caption);
  color: var(--ig-color-text-soft);
`;

