import styled from 'styled-components';

export const DeletingLabel = styled.span`
  display: inline-flex;
  align-items: center;
  gap: 6px;
`;

export const GroupBadge = styled.div`
  background: rgba(0,0,0,0.55);
  color: var(--ig-color-text-primary);
  font-size: var(--ig-font-size-2xs);
  font-weight: 600;
  padding: 2px 6px;
  border-radius: var(--ig-radius-xs);
`;

export const GroupBadgeWrap = styled.div`
  position: absolute;
  top: 6px;
  right: 6px;
  display: flex;
  align-items: center;
  gap: var(--ig-space-2);
  z-index: 4;
`;

export const GroupDeleteBtn = styled.button`
  width: 28px;
  height: 28px;
  display: flex;
  align-items: center;
  justify-content: center;
  border: 1px solid rgba(255,255,255,0.2);
  border-radius: var(--ig-radius-pill);
  background: rgba(239, 68, 68, 0.92);
  color: var(--ig-color-text-primary);
  cursor: pointer;
  opacity: 1;
  transform: translateX(0);
  transition: transform 0.16s ease, background 0.16s ease, border-color 0.16s ease;
  box-shadow: 0 4px 12px rgba(0,0,0,0.28);
  pointer-events: auto;
  position: relative;
  z-index: 5;
  flex-shrink: 0;
  &:disabled {
    opacity: 0.7;
    background: rgba(75, 85, 99, 0.86);
    cursor: not-allowed;
  }
  &:hover:not(:disabled) {
    background: rgba(220, 38, 38, 0.96);
    border-color: rgba(255,255,255,0.32);
    transform: scale(1.04);
  }
`;

// ImageCell / ImageCellCheckbox / ImageLabel / ImageThumbWrap:
// @ingradient/ui ImageGrid + EdgeImagesGrid 로 이동 (PR-1.5, 2026-05-09)

export const ImagesFilterButton = styled.button<{ $active?: boolean }>`
  width: 32px;
  height: 32px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  border-radius: var(--ig-radius-xs);
  border: 1px solid ${(p) => (p.$active ? 'var(--ig-color-accent)' : 'transparent')};
  background: ${(p) => (p.$active ? 'var(--ig-color-blue-tint-14)' : 'transparent')};
  color: ${(p) => (p.$active ? 'var(--ig-color-accent-soft)' : 'var(--ig-color-text-muted)')};
  cursor: pointer;
  transition: all 0.16s ease;

  &:hover {
    color: var(--ig-color-text-primary);
    background: var(--ig-color-surface-interactive);
    border-color: var(--ig-color-border-subtle);
  }
`;

export const ImagesFilterDateLabel = styled.span`
  width: 34px;
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
  gap: 8px;
  padding: 8px 12px;
  background: rgba(0, 0, 0, 0.55);
  border-radius: 0 0 12px 12px;
  flex-shrink: 0;
`;

export const ModalBBoxToolbarBtn = styled.button<{ $active?: boolean }>`
  width: 36px;
  height: 36px;
  border: none;
  border-radius: 8px;
  background: ${(p) => (p.$active ? 'var(--ig-color-surface-active)' : 'transparent')};
  color: var(--ig-color-text-primary);
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: background 0.14s ease;
  &:hover { background: var(--ig-color-surface-interactive); }
  &:disabled { opacity: 0.45; cursor: default; }
`;

export const ModalCloseBtn = styled.button`
  flex-shrink: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 40px;
  height: 40px;
  border: 1px solid rgba(255,255,255,0.2);
  border-radius: var(--ig-radius-xs);
  background: rgba(0,0,0,0.5);
  color: white;
  cursor: pointer;
  &:hover { background: var(--ig-color-white-12); }
`;

export const ModalFilename = styled.div`
  color: rgba(255,255,255,0.55);
  font-size: var(--ig-font-size-xs);
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  max-width: 320px;
`;

export const ModalHeader = styled.div`
  display: flex;
  align-items: center;
  width: 100%;
  flex-shrink: 0;
  gap: 8px;
`;

export const ModalHeaderCenter = styled.div`
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  min-width: 0;
  overflow: hidden;
`;

export const ModalHeaderSpacer = styled.div`
  width: 40px;
  flex-shrink: 0;
`;

export const ModalHint = styled.div`
  flex-shrink: 0;
  color: rgba(255,255,255,0.35);
  font-size: var(--ig-font-size-2xs);
  text-align: center;
`;

export const ModalInner = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8px;
  width: 100%;
  height: 100%;
  padding: 10px 12px 14px;
  min-height: 0;
`;

export const ModalOverlay = styled.div`
  position: absolute;
  inset: 0;
  background: rgba(0, 0, 0, 0.92);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 100;
  border-radius: inherit;
`;

export const SelectAllCheckbox = styled.input`
  width: 15px;
  height: 15px;
  accent-color: var(--ig-color-accent);
  cursor: pointer;
`;

export const SelectionToolbar = styled.div`
  display: flex;
  align-items: center;
  gap: var(--ig-space-4);
  padding: 6px 16px;
  border-bottom: 1px solid var(--ig-color-border-subtle);
  background: var(--ig-color-surface-panel);
  flex-shrink: 0;
`;

export const SyncDot = styled.span<{ $color: string }>`
  width: 6px;
  height: 6px;
  border-radius: 50%;
  background: ${(p) => p.$color};
  display: inline-block;
  flex-shrink: 0;
`;

export const SyncStateIcon = styled.div<{ $state: string }>`
  position: absolute;
  bottom: 28px;
  left: 6px;
  z-index: 3;
  width: 22px;
  height: 22px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 50%;
  background: rgba(0, 0, 0, 0.5);
  color: ${(p) =>
    p.$state === 'upload_failed' ? 'var(--ig-color-danger)' :
    p.$state === 'uploading' ? 'var(--ig-color-accent)' :
    'rgba(255,255,255,0.7)'};
  @keyframes sync-spin { to { transform: rotate(360deg); } }
  ${(p) => p.$state === 'uploading' ? '& > svg { animation: sync-spin 1.5s linear infinite; }' : ''}
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
  gap: 8px;
  flex-shrink: 0;
`;

export const ModalHeaderIconBtn = styled.button<{ $active?: boolean }>`
  flex-shrink: 0;
  width: 40px;
  height: 40px;
  border: 1px solid rgba(255,255,255,0.2);
  border-radius: var(--ig-radius-xs);
  background: ${(p) => (p.$active ? 'rgba(255,255,255,0.18)' : 'rgba(0,0,0,0.5)')};
  color: white;
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
  color: rgba(255,255,255,0.7);
  font-size: var(--ig-font-size-xs);
  padding: 0 8px;
  font-weight: 600;
`;
