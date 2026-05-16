import React from 'react'
import styled from 'styled-components'
import { SyncStatusChip, type SyncState } from '../../components/feedback/sync-status-chip'

const Body = styled.div`
  display: grid;
  grid-template-columns: 1fr 320px;
  gap: var(--ig-space-7);
  align-items: start;
  min-height: 0;
`

const LeftCol = styled.div`
  display: flex;
  flex-direction: column;
  gap: var(--ig-space-4);
  min-width: 0;
`

const RightCol = styled.div`
  display: flex;
  flex-direction: column;
  gap: var(--ig-space-5);
  min-width: 0;
`

const MetaList = styled.dl`
  display: grid;
  grid-template-columns: 96px 1fr;
  row-gap: var(--ig-space-3);
  column-gap: var(--ig-space-4);
  margin: 0;
  font-size: var(--ig-font-size-sm);
`

const Dt = styled.dt`
  color: var(--ig-color-text-muted);
`

const Dd = styled.dd`
  color: var(--ig-color-text-primary);
  margin: 0;
  overflow-wrap: anywhere;
`

const Section = styled.section`
  display: flex;
  flex-direction: column;
  gap: var(--ig-space-2);
`

const SectionTitle = styled.h4`
  margin: 0;
  font-size: var(--ig-font-size-xs);
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.04em;
  color: var(--ig-color-text-muted);
`

export interface ImageDetailViewerImage {
  id: string
  name: string
  sync_state?: SyncState
  width?: number
  height?: number
  size_bytes?: number
  uploader?: string
  created_at?: string
  dataset_name?: string
  sequence_label?: string
  pattern_label?: string
}

export interface ImageDetailViewerProps {
  image: ImageDetailViewerImage
  annotationViewer: React.ReactNode
  classTagsSlot?: React.ReactNode
  commentsSlot?: React.ReactNode
  className?: string
}

function formatSize(bytes?: number): string {
  if (!bytes) return '—'
  if (bytes < 1024) return `${bytes} B`
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`
  return `${(bytes / 1024 / 1024).toFixed(2)} MB`
}

export function ImageDetailViewer({
  image, annotationViewer, classTagsSlot, commentsSlot, className,
}: ImageDetailViewerProps) {
  return (
    <Body className={className}>
      <LeftCol>{annotationViewer}</LeftCol>
      <RightCol>
        <Section>
          <SectionTitle>Metadata</SectionTitle>
          <MetaList>
            {image.sync_state ? (<>
              <Dt>Sync</Dt>
              <Dd><SyncStatusChip state={image.sync_state} /></Dd>
            </>) : null}
            <Dt>Size</Dt>
            <Dd>{image.width && image.height ? `${image.width} × ${image.height}` : '—'} · {formatSize(image.size_bytes)}</Dd>
            <Dt>Dataset</Dt>
            <Dd>{image.dataset_name ?? '—'}</Dd>
            <Dt>Sequence</Dt>
            <Dd>{image.sequence_label ?? '—'}</Dd>
            <Dt>Pattern</Dt>
            <Dd>{image.pattern_label ?? '—'}</Dd>
            <Dt>Uploaded</Dt>
            <Dd>{image.created_at ?? '—'}{image.uploader ? ` by ${image.uploader}` : ''}</Dd>
          </MetaList>
        </Section>
        {classTagsSlot ? (
          <Section>
            <SectionTitle>Classes</SectionTitle>
            {classTagsSlot}
          </Section>
        ) : null}
        {commentsSlot ? (
          <Section>
            <SectionTitle>Comments</SectionTitle>
            {commentsSlot}
          </Section>
        ) : null}
      </RightCol>
    </Body>
  )
}
