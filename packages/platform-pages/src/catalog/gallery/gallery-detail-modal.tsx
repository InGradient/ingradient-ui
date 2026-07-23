import { iconSizeNumbers } from '@ingradient/ui'
import React from 'react'
import { Stack, Text } from '@ingradient/ui/primitives'
import { IconButton, ClosePanelIcon } from '@ingradient/ui/components'
import { SyncStatusChip, type SyncState } from './sync-status-chip'
import { InfoRow, InfoRowLabel, InfoRowValue } from '@ingradient/ui/components'
import { MediaDialogShell } from '@ingradient/ui/patterns'

const DEFAULT_MAIN_STYLE = {
  height: '100%',
}

const DEFAULT_THUMB_STYLE = {
  width: '100%',
  flex: 1,
  minHeight: 0,
  objectFit: 'contain' as const,
  background: 'var(--ig-color-bg-canvas)',
  display: 'block' as const,
}

const DEFAULT_SIDEBAR_STYLE = { padding: 'var(--ig-space-5)' }
const META_TITLE_STYLE = { marginBottom: 'var(--ig-space-2)' }

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
    <Stack style={DEFAULT_MAIN_STYLE}>
      <img src={image.thumb_url} alt={image.name} style={DEFAULT_THUMB_STYLE} />
    </Stack>
  )
}

function defaultSidebar(image: GalleryDetailModalImage) {
  return (
    <Stack gap="var(--ig-space-3)" style={DEFAULT_SIDEBAR_STYLE}>
      <Text size="var(--ig-font-size-sm)" weight="semibold" tone="muted" uppercase letterSpacing="normal" style={META_TITLE_STYLE}>Image info</Text>
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
    </Stack>
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
  const sidebarContent = sidebar === undefined ? defaultSidebar(image) : sidebar
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
          <ClosePanelIcon size={iconSizeNumbers.lg} />
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
