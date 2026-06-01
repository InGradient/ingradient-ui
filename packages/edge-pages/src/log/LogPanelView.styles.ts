import styled from 'styled-components';
import { ModalBackdrop, surfacePanel } from '@ingradient/ui';

export const Container = styled.div`
  display: flex;
  flex-direction: column;
  height: 100%;
`;

export const Header = styled.div`
  padding: var(--ig-space-5);
  border-bottom: var(--ig-border-1px) solid var(--ig-color-border-subtle);
  font-size: var(--ig-font-size-sm);
  font-weight: var(--ig-font-weight-semibold);
  color: var(--ig-color-text-muted);
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-shrink: 0;
`;

export const FilterButtonWrap = styled.div`
  position: relative;
`;

export const FilterActionButton = styled.button`
  display: inline-flex;
  align-items: center;
  gap: var(--ig-space-2);
  height: var(--ig-control-height-sm);
  padding: 0 var(--ig-space-4);
  border: var(--ig-border-1px) solid transparent;
  border-radius: var(--ig-radius-xs);
  background: transparent;
  color: var(--ig-color-text-muted);
  cursor: pointer;
  transition: all 0.16s ease;

  &:hover {
    color: var(--ig-color-text-primary);
    background: var(--ig-color-surface-interactive);
    border-color: var(--ig-color-border-subtle);
  }
`;

export const FilterPopover = styled.div`
  position: absolute;
  top: 100%;
  right: 0;
  margin-top: 6px;
  min-width: 210px;
  padding: var(--ig-space-5);
  background: var(--ig-color-surface-raised);
  border: var(--ig-border-1px) solid var(--ig-color-border-strong);
  border-radius: var(--ig-radius-sm);
  box-shadow: var(--ig-shadow-panel);
  z-index: 100;
  font-size: var(--ig-font-size-xs);
  font-weight: normal;
  color: var(--ig-color-text-secondary);
`;

export const FilterSection = styled.div`
  margin-bottom: var(--ig-space-5);
  &:last-child { margin-bottom: 0; }
`;

export const FilterSectionTitle = styled.div`
  font-weight: var(--ig-font-weight-semibold);
  color: var(--ig-color-text-muted);
  margin-bottom: var(--ig-space-3);
  font-size: var(--ig-font-size-2xs);
  text-transform: uppercase;
  letter-spacing: var(--ig-letter-spacing-wider);
`;

export const FilterRow = styled.label`
  display: flex;
  align-items: center;
  gap: var(--ig-space-3);
  cursor: pointer;
  margin-bottom: var(--ig-space-2);
  &:last-child { margin-bottom: 0; }
`;

export const DateRow = styled.div`
  display: flex;
  align-items: center;
  gap: var(--ig-space-3);
  margin-bottom: var(--ig-space-2);
`;

export const DateLabel = styled.span`
  min-width: var(--ig-control-height-md);
  color: var(--ig-color-text-muted);
`;

export const FilterButtonLabel = styled.span`
  margin-left: 4px;
`;

export const LogList = styled.div`
  flex: 1;
  min-height: 0;
  overflow-y: auto;
  padding: var(--ig-space-3);
  min-width: 0;
`;

export const LogItem = styled.div<{ type: 'error' | 'info' | 'success' }>`
  display: flex;
  align-items: start;
  gap: var(--ig-space-3);
  padding: var(--ig-space-3);
  margin-bottom: var(--ig-space-1);
  border-radius: var(--ig-radius-xs);
  cursor: default;
  background-color: ${({ type }) =>
    type === 'error' ? 'rgba(239, 68, 68, 0.08)' :
    type === 'success' ? 'rgba(43, 181, 114, 0.08)' : 'transparent'};

  &:hover { background-color: var(--ig-color-surface-interactive); }
`;

export const LogTime = styled.span`
  font-size: var(--ig-font-size-2xs);
  color: var(--ig-color-text-soft);
  min-width: 45px;
  margin-top: var(--ig-space-2px);
  flex-shrink: 0;
`;

export const LogMessage = styled.div`
  font-size: var(--ig-font-size-xs);
  color: var(--ig-color-text-secondary);
  line-height: var(--ig-line-height-snug);
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
`;

export const DetailPanel = styled.div<{ $visible: boolean }>`
  ${surfacePanel}
  background: var(--ig-color-surface-raised);
  position: fixed;
  left: 254px;
  top: 58px;
  bottom: 14px;
  width: 272px;
  z-index: 50;
  border-radius: var(--ig-radius-lg);
  display: ${({ $visible }) => ($visible ? 'flex' : 'none')};
  flex-direction: column;
  pointer-events: ${({ $visible }) => ($visible ? 'auto' : 'none')};
  overflow: hidden;
`;

export const DetailImageClickable = styled.img`
  width: 100%;
  border-radius: var(--ig-radius-xs);
  border: var(--ig-border-1px) solid var(--ig-color-border-subtle);
  margin-bottom: 10px;
  background: var(--ig-color-bg-canvas);
  cursor: zoom-in;
  transition: opacity 0.16s ease;
  &:hover { opacity: 0.88; }
`;

export { ModalBackdrop as ImageModalOverlay };

export const ImageModalImg = styled.img`
  max-width: 90vw;
  max-height: 90vh;
  border-radius: var(--ig-radius-sm);
  border: var(--ig-border-1px) solid var(--ig-color-border-strong);
  box-shadow: 0 40px 80px var(--ig-color-image-option-bg);
  object-fit: contain;
`;

export const DetailContent = styled.div`
  padding: var(--ig-space-4);
  overflow-y: auto;
  flex: 1;
  min-height: 0;
`;

export const DetailPlaceholder = styled.div`
  color: var(--ig-color-text-soft);
  font-size: var(--ig-font-size-xs);
  text-align: center;
  padding: var(--ig-space-7) 8px;
`;

export const OpenImageButton = styled.button`
  display: inline-flex;
  align-items: center;
  gap: var(--ig-space-2);
  margin-bottom: 10px;
  padding: var(--ig-space-2) 10px;
  font-size: var(--ig-font-size-2xs);
  color: var(--ig-color-accent-soft);
  background: rgba(77, 136, 255, 0.1);
  border: var(--ig-border-1px) solid var(--ig-color-border-subtle);
  border-radius: var(--ig-radius-xs);
  cursor: pointer;
  transition: background 0.16s ease;
  &:hover { background: rgba(77, 136, 255, 0.2); }
`;

export const LogPlaceholder = styled.div`
  padding: var(--ig-space-5);
  font-size: var(--ig-font-size-xs);
  color: var(--ig-color-text-soft);
`;

