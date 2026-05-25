import React from 'react'
import styled from 'styled-components'
import { X } from 'lucide-react'
import { IconButton } from '../../components/inputs/icon-button'
import { SyncStatusChip, type SyncState } from '../../components/feedback/sync-status-chip'
import { InfoRow, InfoRowLabel, InfoRowValue } from '../../components/data-display/info-row'
import { MediaDialogShell } from './media-dialog-shell'

const DefaultMain = styled.div`
  display: flex;
  flex-direction: column;
  height: 100%;
  min-height: 0;
`

const DefaultThumb = styled.img`
  width: 100%;
  flex: 1;
  min-height: 0;
  object-fit: contain;
  background: var(--ig-color-bg-canvas);
  display: block;
`

const DefaultSidebar = styled.div`
  padding: var(--ig-space-5);
  display: flex;
  flex-direction: column;
  gap: var(--ig-space-3);
`

const DefaultMetaTitle = styled.div`
  font-size: var(--ig-font-size-sm);
  font-weight: 600;
  color: var(--ig-color-text-muted);
  text-transform: uppercase;
  letter-spacing: 0.04em;
  margin-bottom: var(--ig-space-2);
`

export interface GalleryDetailModalImage {
  id: string
  name: string
  thumb_url: string
  sync_state?: SyncState
  width?: number
  height?: number
  size_bytes?: number
  uploader?: string
  created_at?: string
  dataset_id?: string
  sequence_id?: string
  pattern_label?: string
}

export interface GalleryDetailModalProps {
  image: GalleryDetailModalImage | null
  open: boolean
  onClose: () => void
  actions?: React.ReactNode
  main?: React.ReactNode
  sidebar?: React.ReactNode
  children?: React.ReactNode
  sidebarWidth?: number
  onSidebarResize?: (event: React.MouseEvent<HTMLDivElement>) => void
  positioning?: 'fixed' | 'absolute'
  /**
   * Default top-right close button (X) 을 숨김. main 의 caller 가 자체
   * floating controls 로 close 를 렌더할 때 사용. default false.
   */
  hideDefaultClose?: boolean
}

function formatSize(bytes?: number): string {
  if (!bytes) return '—'
  if (bytes < 1024) return `${bytes} B`
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`
  return `${(bytes / 1024 / 1024).toFixed(2)} MB`
}

function defaultMain(image: GalleryDetailModalImage) {
  return (
    <DefaultMain>
      <DefaultThumb src={image.thumb_url} alt={image.name} />
    </DefaultMain>
  )
}

function defaultSidebar(image: GalleryDetailModalImage) {
  return (
    <DefaultSidebar>
      <DefaultMetaTitle>Image info</DefaultMetaTitle>
      {image.sync_state ? (
        <InfoRow>
          <InfoRowLabel>Sync</InfoRowLabel>
          <InfoRowValue>
            <SyncStatusChip state={image.sync_state} />
          </InfoRowValue>
        </InfoRow>
      ) : null}
      <InfoRow>
        <InfoRowLabel>Size</InfoRowLabel>
        <InfoRowValue>
          {image.width && image.height ? `${image.width} × ${image.height}` : '—'} ·{' '}
          {formatSize(image.size_bytes)}
        </InfoRowValue>
      </InfoRow>
      <InfoRow>
        <InfoRowLabel>Dataset</InfoRowLabel>
        <InfoRowValue>{image.dataset_id ?? '—'}</InfoRowValue>
      </InfoRow>
      <InfoRow>
        <InfoRowLabel>Sequence</InfoRowLabel>
        <InfoRowValue>{image.sequence_id ?? '—'}</InfoRowValue>
      </InfoRow>
      <InfoRow>
        <InfoRowLabel>Pattern</InfoRowLabel>
        <InfoRowValue>{image.pattern_label ?? '—'}</InfoRowValue>
      </InfoRow>
      <InfoRow>
        <InfoRowLabel>Uploaded</InfoRowLabel>
        <InfoRowValue>
          {image.created_at ?? '—'}
          {image.uploader ? ` by ${image.uploader}` : ''}
        </InfoRowValue>
      </InfoRow>
    </DefaultSidebar>
  )
}

export function GalleryDetailModal({
  image,
  open,
  onClose,
  actions,
  main,
  sidebar,
  children,
  sidebarWidth = 320,
  onSidebarResize,
  positioning = 'fixed',
  hideDefaultClose = false,
}: GalleryDetailModalProps) {
  if (!open || !image) return null
  const mainContent = main ?? children ?? defaultMain(image)
  const sidebarContent = sidebar ?? defaultSidebar(image)
  const topRight = hideDefaultClose && !actions ? null : (
    <>
      {actions}
      {hideDefaultClose ? null : (
        <IconButton
          variant="secondary"
          aria-label="Close"
          title="Close"
          onClick={(e) => {
            e.stopPropagation()
            onClose()
          }}
        >
          <X size={18} />
        </IconButton>
      )}
    </>
  )
  return (
    <MediaDialogShell
      onClose={onClose}
      ariaLabel={image.name}
      positioning={positioning}
      sidebarWidth={sidebarWidth}
      onSidebarResize={onSidebarResize}
      topRight={topRight}
      main={mainContent}
      sidebar={sidebarContent}
    />
  )
}
