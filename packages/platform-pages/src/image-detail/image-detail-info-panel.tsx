import type { ReactNode } from 'react'
import { iconSizeNumbers } from '@ingradient/ui'
import { Stack, Text } from '@ingradient/ui/primitives'
import { TextButton, ChevronDownIcon, ChevronRightIcon } from '@ingradient/ui/components'
import { InfoRow, InfoRowLabel, InfoRowValue } from '@ingradient/ui/components'

const SECTION_STYLE = {
  padding: 'var(--ig-space-5)',
  borderBottom: 'var(--ig-border-1px) solid var(--ig-color-border-subtle)',
}

const DETAILS_TOGGLE_STYLE = { padding: 'var(--ig-space-2) 0' }
const DETAILS_BODY_STYLE = { paddingTop: 'var(--ig-space-2)' }

export interface ImageDetailInfo {
  name?: string
  created_at?: string
  captured_at?: string
  upload_source?: string
  camera_ip?: string
  camera_type?: string
  camera_model?: string
  edge_device?: string
  dimensions?: { width: number; height: number }
  size_bytes?: number
  uploader?: string
  labeled_by?: string
  labeled_at?: string
  upload_quality?: string
  sequence_id?: string
  sequence_step?: number
  pattern_label?: string
  package_version?: number
  capture_duration_ms?: number
}

export interface ImageDetailInfoPanelProps {
  image: ImageDetailInfo
  positionLabel?: string
  detailsOpen: boolean
  onToggleDetails: () => void
  cameraParamsSlot?: ReactNode
  title?: string
}

function formatBytes(bytes?: number): string {
  if (!bytes) return '—'
  if (bytes < 1024) return `${bytes} B`
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`
  return `${(bytes / 1024 / 1024).toFixed(2)} MB`
}

function rowIfValue(label: string, value: string | number | undefined | null) {
  if (value === undefined || value === null || value === '') return null
  return (
    <InfoRow key={label}>
      <InfoRowLabel>{label}</InfoRowLabel>
      <InfoRowValue>{value}</InfoRowValue>
    </InfoRow>
  )
}

export function ImageDetailInfoPanel({
  image,
  positionLabel,
  detailsOpen,
  onToggleDetails,
  cameraParamsSlot,
  title = 'Image info',
}: ImageDetailInfoPanelProps) {
  return (
    <Stack gap="var(--ig-space-3)" style={SECTION_STYLE}>
      <Text size="var(--ig-font-size-sm)" weight="semibold" tone="muted" uppercase letterSpacing="normal">{title}</Text>
      {positionLabel ? (
        <InfoRow>
          <InfoRowLabel>Position</InfoRowLabel>
          <InfoRowValue>{positionLabel}</InfoRowValue>
        </InfoRow>
      ) : null}
      <InfoRow>
        <InfoRowLabel>File</InfoRowLabel>
        <InfoRowValue title={image.name}>{image.name ?? '—'}</InfoRowValue>
      </InfoRow>
      <InfoRow>
        <InfoRowLabel>Uploaded</InfoRowLabel>
        <InfoRowValue>{image.created_at ?? '—'}</InfoRowValue>
      </InfoRow>
      <InfoRow>
        <InfoRowLabel>Captured</InfoRowLabel>
        <InfoRowValue>{image.captured_at ?? '—'}</InfoRowValue>
      </InfoRow>
      <TextButton
        tone="accent"
        size="sm"
        iconLeading={detailsOpen
          ? <ChevronDownIcon size={iconSizeNumbers.sm} />
          : <ChevronRightIcon size={iconSizeNumbers.sm} />}
        onClick={onToggleDetails}
        style={DETAILS_TOGGLE_STYLE}
      >
        {detailsOpen ? 'Hide details' : 'Show details'}
      </TextButton>
      {detailsOpen ? (
        <Stack gap="var(--ig-space-3)" style={DETAILS_BODY_STYLE}>
          {rowIfValue('Upload Source', image.upload_source)}
          {rowIfValue('Camera IP', image.camera_ip)}
          {rowIfValue('Camera Type', image.camera_type)}
          {rowIfValue('Camera Model', image.camera_model)}
          {rowIfValue('Edge Device', image.edge_device)}
          {rowIfValue('Uploaded By', image.uploader)}
          {image.package_version != null ? rowIfValue('Package Ver.', `v${image.package_version}`) : null}
          {image.capture_duration_ms != null
            ? rowIfValue('Capture Duration', `${image.capture_duration_ms} ms`)
            : null}
          {image.dimensions
            ? rowIfValue('Dimensions', `${image.dimensions.width} × ${image.dimensions.height}`)
            : null}
          {rowIfValue('Size', formatBytes(image.size_bytes))}
          {rowIfValue('Labeled By', image.labeled_by)}
          {rowIfValue('Labeled At', image.labeled_at)}
          {rowIfValue('Quality', image.upload_quality)}
          {image.sequence_id
            ? rowIfValue(
                'Sequence',
                typeof image.sequence_step === 'number'
                  ? `Seq ${image.sequence_step + 1}`
                  : image.sequence_id,
              )
            : null}
          {rowIfValue('Pattern', image.pattern_label)}
        </Stack>
      ) : null}
      {cameraParamsSlot}
    </Stack>
  )
}
