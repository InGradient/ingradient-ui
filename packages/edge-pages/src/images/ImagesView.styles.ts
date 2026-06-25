import { rotations } from '@ingradient/ui'
import styled from 'styled-components';

export const DeletingLabel = styled.span`
  display: inline-flex;
  align-items: center;
  gap: var(--ig-space-2);
`;

export const GroupBadge = styled.div`
  background: var(--ig-color-overlay-strong);
  color: var(--ig-color-text-primary);
  font-size: var(--ig-font-size-2xs);
  font-weight: var(--ig-font-weight-semibold);
  padding: var(--ig-space-2px) var(--ig-space-2);
  border-radius: var(--ig-radius-xs);
`;

export const GroupBadgeWrap = styled.div`
  position: absolute;
  top: var(--ig-space-2);
  right: var(--ig-space-2);
  display: flex;
  align-items: center;
  gap: var(--ig-space-2);
  z-index: var(--ig-z-capture-high);
`;

export const GroupDeleteBtn = styled.button`
  width: var(--ig-control-height-xs);
  height: var(--ig-control-height-xs);
  display: flex;
  align-items: center;
  justify-content: center;
  border: var(--ig-border-1px) solid var(--ig-color-white-20);
  border-radius: var(--ig-radius-pill);
  background: var(--ig-color-danger-overlay);
  color: var(--ig-color-text-primary);
  cursor: pointer;
  opacity: 1;
  transform: translateX(0);
  transition: transform var(--ig-motion-fast-ease), background var(--ig-motion-fast-ease), border-color var(--ig-motion-fast-ease);
  box-shadow: 0 var(--ig-space-1) var(--ig-space-5) rgba(0, 0, 0, 0.28);
  pointer-events: auto;
  position: relative;
  z-index: var(--ig-z-capture);
  flex-shrink: 0;
  &:disabled {
    opacity: var(--ig-opacity-subtle);
    background: var(--ig-color-slate-tint-86);
    cursor: not-allowed;
  }
  &:hover:not(:disabled) {
    background: var(--ig-color-danger-overlay-hover);
    border-color: var(--ig-color-white-32);
    transform: scale(var(--ig-scale-hover-lift));
  }
`;

// ImageCell / ImageCellCheckbox / ImageLabel / ImageThumbWrap:
// @ingradient/ui ImageGrid + EdgeImagesGrid 로 이동 (PR-1.5, 2026-05-09)

export const ImagesFilterButton = styled.button<{ $active?: boolean }>`
  width: var(--ig-control-height-sm);
  height: var(--ig-control-height-sm);
  display: inline-flex;
  align-items: center;
  justify-content: center;
  border-radius: var(--ig-radius-xs);
  border: var(--ig-border-1px) solid ${(p) => (p.$active ? 'var(--ig-color-accent)' : 'transparent')};
  background: ${(p) => (p.$active ? 'var(--ig-color-selection-bg)' : 'transparent')};
  color: ${(p) => (p.$active ? 'var(--ig-color-accent-soft)' : 'var(--ig-color-text-muted)')};
  cursor: pointer;
  transition: all var(--ig-motion-fast-ease);

  &:hover {
    color: var(--ig-color-text-primary);
    background: var(--ig-color-surface-interactive);
    border-color: var(--ig-color-border-subtle);
  }
`;

export const ImagesFilterDateLabel = styled.span`
  width: var(--ig-control-height-sm-plus);
  flex-shrink: 0;
  color: var(--ig-color-text-muted);
`;

export const ImagesFilterDateRow = styled.div`
  display: flex;
  align-items: center;
  gap: var(--ig-space-3);
  margin-top: var(--ig-space-3);
`;

// ImagesFilterPopover / ImagesFilterSection / ImagesFilterTitle: ui FilterPopover + FilterPopoverSection 로 이동 (PR-B4, 2026-05-09)

export const ImagesFilterRow = styled.label`
  display: flex;
  align-items: center;
  gap: var(--ig-space-3);
  cursor: pointer;
`;

export const ImagesFilterWrap = styled.div`
  position: relative;
`;

export const ImagesContainer = styled.div`
  flex: 1;
  min-height: 0;
  overflow-y: auto;
  padding: var(--ig-space-7);
`;

export const ImagesWrapper = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  overflow: hidden;
  position: relative;
`;

// VirtualScrollTrack / VirtualGridRow: ui VirtualizedImageGrid 가 자체 처리 (PR-1.5, 2026-05-09)

export const ModalBBoxCanvasWrap = styled.div`
  position: relative;
  flex: 1;
  min-height: 0;
  width: 100%;
  display: flex;
  flex-direction: column;
`;

export const ModalBBoxToolbar = styled.div`
  display: flex;
  align-items: center;
  gap: var(--ig-space-3);
  padding: var(--ig-space-3) 12px;
  background: var(--ig-color-overlay-strong);
  border-radius: 0 0 var(--ig-radius-lg) var(--ig-radius-lg);
  flex-shrink: 0;
`;

export const ModalBBoxToolbarBtn = styled.button<{ $active?: boolean }>`
  width: var(--ig-control-height-md);
  height: var(--ig-control-height-md);
  border: none;
  border-radius: var(--ig-radius-md);
  background: ${(p) => (p.$active ? 'var(--ig-color-surface-active)' : 'transparent')};
  color: var(--ig-color-text-primary);
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: background var(--ig-motion-fast-ease);
  &:hover { background: var(--ig-color-surface-interactive); }
  &:disabled { opacity: var(--ig-opacity-faded); cursor: default; }
`;

export const ModalFilename = styled.div`
  color: var(--ig-color-white-55);
  font-size: var(--ig-font-size-xs);
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  max-width: var(--ig-popup-md);
`;

export const ModalHeader = styled.div`
  display: flex;
  align-items: center;
  width: 100%;
  flex-shrink: 0;
  gap: var(--ig-space-3);
`;

export const ModalHeaderCenter = styled.div`
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: var(--ig-space-3);
  min-width: 0;
  overflow: hidden;
`;

export const ModalHeaderSpacer = styled.div`
  width: var(--ig-control-height-mid-plus);
  flex-shrink: 0;
`;

export const ModalHint = styled.div`
  flex-shrink: 0;
  color: var(--ig-color-white-35);
  font-size: var(--ig-font-size-2xs);
  text-align: center;
`;

export const ModalInner = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: var(--ig-space-3);
  width: 100%;
  height: 100%;
  padding: var(--ig-space-4) 12px 14px;
  min-height: 0;
`;

export const ModalOverlay = styled.div`
  position: absolute;
  inset: 0;
  background: var(--ig-color-overlay-near-opaque);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: var(--ig-z-dropdown);
  border-radius: inherit;
`;

export const SelectionToolbar = styled.div`
  display: flex;
  align-items: center;
  gap: var(--ig-space-4);
  padding: var(--ig-space-2) 16px;
  border-bottom: var(--ig-border-1px) solid var(--ig-color-border-subtle);
  background: var(--ig-color-surface-panel);
  flex-shrink: 0;
`;

export const SyncDot = styled.span<{ $color: string }>`
  width: var(--ig-space-2);
  height: var(--ig-space-2);
  border-radius: 50%;
  background: ${(p) => p.$color};
  display: inline-block;
  flex-shrink: 0;
`;

export const SyncStateIcon = styled.div<{ $state: string }>`
  position: absolute;
  bottom: var(--ig-space-12);
  left: var(--ig-space-2);
  z-index: var(--ig-z-raised-plus);
  width: var(--ig-icon-2xl);
  height: var(--ig-icon-2xl);
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 50%;
  background: var(--ig-color-overlay-mid);
  color: ${(p) =>
    p.$state === 'upload_failed' ? 'var(--ig-color-danger)' :
    p.$state === 'uploading' ? 'var(--ig-color-accent)' :
    'var(--ig-color-white-70)'};
  @keyframes sync-spin { to { transform: rotate(${rotations.full}); } }
  ${(p) => p.$state === 'uploading' ? '& > svg { animation: sync-spin var(--ig-motion-sync-spin) linear infinite; }' : ''}
`;

export const SyncSummary = styled.div`
  display: flex;
  align-items: center;
  gap: var(--ig-space-3);
  font-size: var(--ig-font-size-2xs);
  color: var(--ig-color-text-muted);
`;

// ── Modal header left (Eye + Fullscreen) ─────────────────────────────────────
export const ModalHeaderLeft = styled.div`
  display: flex;
  gap: var(--ig-space-3);
  flex-shrink: 0;
`;

export const ModalHeaderIconBtn = styled.button<{ $active?: boolean }>`
  flex-shrink: 0;
  width: var(--ig-control-height-mid-plus);
  height: var(--ig-control-height-mid-plus);
  border: var(--ig-border-1px) solid var(--ig-color-white-20);
  border-radius: var(--ig-radius-xs);
  background: ${(p) => (p.$active ? 'var(--ig-color-white-18)' : 'var(--ig-color-overlay-mid)')};
  color: var(--ig-color-on-accent);
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  &:hover { background: var(--ig-color-white-12); }
`;

// ── Modal toolbar right slot (bbox count) ────────────────────────────────────
export const ModalToolbarSpacer = styled.div`
  flex: 1;
`;

export const ModalBboxCount = styled.div`
  color: var(--ig-color-white-70);
  font-size: var(--ig-font-size-xs);
  padding: 0 var(--ig-space-3);
  font-weight: var(--ig-font-weight-semibold);
`;
