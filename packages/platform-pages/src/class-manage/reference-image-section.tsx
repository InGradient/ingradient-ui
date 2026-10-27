import { useState } from 'react'
import { Stack, Text } from '@ingradient/ui/primitives'
import { InfoSection } from '@ingradient/ui/components'
import { ReferenceImageDropZone } from './reference-image-drop-zone'
import { IndexedNavigation } from '@ingradient/ui/components'

const HINT_STYLE = { marginTop: 'var(--ig-space-neg-2px)' }
const STACK_STYLE = { width: '100%' }
const PREVIEW_STYLE = {
  width: '100%',
  // The preview sits inside the drop-zone frame, so it must be less rounded than the frame.
  borderRadius: 'var(--ig-radius-2xs)',
  border: 'var(--ig-border-1px) solid var(--ig-color-white-12)',
  background: 'var(--ig-color-white-04)',
  objectFit: 'contain' as const,
  maxHeight: 'var(--ig-layout-panel-min-height)',
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
  showTitle?: boolean
}

export function ReferenceImageSection({
  imageUrl, alt = 'Reference image',
  dragging, pending, errorMessage,
  hint = "Drag a linked image here, or right-click a linked image and choose Add to Reference Image. Detection labels are cropped to the labeled region. Classification labels use the full image.",
  emptyText = 'No reference image yet.',
  candidates = [],
  onApply, onSetDragging,
  title = 'Reference image',
  showTitle = true,
}: ReferenceImageSectionProps) {
  const [bboxIndex, setBboxIndex] = useState(0)
  const handleBboxChange = (next: number) => {
    setBboxIndex(next)
    const c = candidates[next]
    if (c) onApply?.(c.imageId, c.bboxIndex)
  }
  const content = (
    <>
      <Text tone="muted" size="var(--ig-text-caption)" style={{ ...HINT_STYLE, display: 'block', lineHeight: 'var(--ig-line-height-relaxed)' }}>{hint}</Text>
      <ReferenceImageDropZone
        dragging={dragging}
        hasImage={!!imageUrl}
        onDropImageId={(id) => onApply?.(id)}
        onSetDragging={onSetDragging}
      >
        <Stack gap="var(--ig-spacing-12)" style={STACK_STYLE}>
          {imageUrl ? (
            <img src={imageUrl} alt={alt} style={PREVIEW_STYLE} />
          ) : (
            <Stack gap="var(--ig-spacing-8)" align="flex-start">
              <Text tone="muted" size="var(--ig-text-caption)" style={{ lineHeight: 'var(--ig-line-height-relaxed)' }}>{emptyText}</Text>
            </Stack>
          )}
          {candidates.length > 1 ? (
            <IndexedNavigation index={bboxIndex} total={candidates.length} onChange={handleBboxChange} prevLabel="Previous bbox" nextLabel="Next bbox" />
          ) : null}
          {pending ? <Text tone="accent" size="var(--ig-text-caption)" weight="semibold">Updating reference image…</Text> : null}
          {errorMessage ? <Text tone="accent" size="var(--ig-text-caption)" weight="semibold">{errorMessage}</Text> : null}
        </Stack>
      </ReferenceImageDropZone>
    </>
  )
  return showTitle ? <InfoSection title={title}>{content}</InfoSection> : content
}
