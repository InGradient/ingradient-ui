import { useState } from 'react'
import { Stack, Text } from '@ingradient/ui/primitives'
import { InfoSection } from '@ingradient/ui/components'
import { ReferenceImageDropZone } from './reference-image-drop-zone'
import { IndexedNavigation } from '@ingradient/ui/components'

const HINT_STYLE = { marginTop: -2 }
const STACK_STYLE = { width: '100%' }
const PREVIEW_STYLE = {
  width: '100%',
  borderRadius: 'var(--ig-radius-xs)',
  border: '1px solid var(--ig-color-white-12)',
  background: 'var(--ig-color-white-04)',
  objectFit: 'contain' as const,
  maxHeight: 300,
}

export interface ReferenceImageBboxCandidate {
  imageId: string
  bboxIndex: number
}

export interface ReferenceImageSectionProps {
  imageUrl?: string | null
  alt?: string
  dragging?: boolean
  pending?: boolean
  errorMessage?: string | null
  hint?: string
  emptyText?: string
  candidates?: ReferenceImageBboxCandidate[]
  onApply?: (imageId: string, bboxIndex?: number) => void
  onSetDragging?: (dragging: boolean) => void
  title?: string
}

export function ReferenceImageSection({
  imageUrl, alt = 'Reference image',
  dragging, pending, errorMessage,
  hint = "Drag a linked image here, or right-click a linked image and choose Add to Reference Image. Detection labels are cropped to the labeled region. Classification labels use the full image.",
  emptyText = 'No reference image yet.',
  candidates = [],
  onApply, onSetDragging,
  title = 'Reference image',
}: ReferenceImageSectionProps) {
  const [bboxIndex, setBboxIndex] = useState(0)
  const handleBboxChange = (next: number) => {
    setBboxIndex(next)
    const c = candidates[next]
    if (c) onApply?.(c.imageId, c.bboxIndex)
  }
  return (
    <InfoSection title={title}>
      <Text tone="muted" size="12px" style={{ ...HINT_STYLE, display: 'block', lineHeight: 1.5 }}>{hint}</Text>
      <ReferenceImageDropZone
        dragging={dragging}
        hasImage={!!imageUrl}
        onDropImageId={(id) => onApply?.(id)}
        onSetDragging={onSetDragging}
      >
        <Stack gap={5} style={STACK_STYLE}>
          {imageUrl ? (
            <img src={imageUrl} alt={alt} style={PREVIEW_STYLE} />
          ) : (
            <Stack gap={3} align="flex-start">
              <Text tone="muted" size="12px" style={{ lineHeight: 1.5 }}>{emptyText}</Text>
            </Stack>
          )}
          {candidates.length > 1 ? (
            <IndexedNavigation index={bboxIndex} total={candidates.length} onChange={handleBboxChange} prevLabel="Previous bbox" nextLabel="Next bbox" />
          ) : null}
          {pending ? <Text tone="accent" size="12px" weight={600}>Updating reference image…</Text> : null}
          {errorMessage ? <Text tone="accent" size="12px" weight={600}>{errorMessage}</Text> : null}
        </Stack>
      </ReferenceImageDropZone>
    </InfoSection>
  )
}
