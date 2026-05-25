import { useState } from 'react'
import styled from 'styled-components'
import { Text } from '../../primitives'
import { ClassInfoSection } from './class-info-section'
import { ReferenceImageDropZone } from './reference-image-drop-zone'
import { BboxNavigation } from './bbox-navigation'

const Hint = styled.span`
  color: var(--ig-color-text-muted);
  font-size: 12px;
  line-height: 1.5;
  display: block;
  margin-top: -2px;
`

const Stack = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
  gap: var(--ig-space-5);
`

const Preview = styled.img`
  width: 100%;
  border-radius: var(--ig-radius-xs);
  border: 1px solid var(--ig-color-white-12);
  background: var(--ig-color-white-04);
  object-fit: contain;
  max-height: 300px;
`

const EmptyText = styled.span`
  color: var(--ig-color-text-muted);
  font-size: 12px;
  line-height: 1.5;
`

const EmptyStateWrap = styled.div`
  display: flex;
  flex-direction: column;
  gap: var(--ig-space-3);
  align-items: flex-start;
`


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
    <ClassInfoSection title={title}>
      <Hint>{hint}</Hint>
      <ReferenceImageDropZone
        dragging={dragging}
        hasImage={!!imageUrl}
        onDropImageId={(id) => onApply?.(id)}
        onSetDragging={onSetDragging}
      >
        <Stack>
          {imageUrl ? (
            <Preview src={imageUrl} alt={alt} />
          ) : (
            <EmptyStateWrap>
              <EmptyText>{emptyText}</EmptyText>
            </EmptyStateWrap>
          )}
          {candidates.length > 1 ? (
            <BboxNavigation index={bboxIndex} total={candidates.length} onChange={handleBboxChange} />
          ) : null}
          {pending ? <Text tone="accent" size="12px" weight={600}>Updating reference image…</Text> : null}
          {errorMessage ? <Text tone="accent" size="12px" weight={600}>{errorMessage}</Text> : null}
        </Stack>
      </ReferenceImageDropZone>
    </ClassInfoSection>
  )
}
