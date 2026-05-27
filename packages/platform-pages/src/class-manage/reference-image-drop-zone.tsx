import type { DragEvent, ReactNode } from 'react'
import { DropZone } from '@ingradient/ui/components'

const EMPTY_STYLE = {
  padding: 'var(--ig-space-9)',
  minHeight: 180,
  fontSize: 13,
  textAlign: 'left' as const,
  overflow: 'visible' as const,
}

const HAS_IMAGE_STYLE = {
  padding: 'var(--ig-space-4)',
  fontSize: 13,
  textAlign: 'left' as const,
  overflow: 'visible' as const,
}

export interface ReferenceImageDropZoneProps {
  dragging?: boolean
  hasImage?: boolean
  children?: ReactNode
  /** drop 됐을 때 호출됨 — 첫 번째 인자는 dataTransfer 의 text/plain 값 (보통 imageId) */
  onDropImageId?: (imageId: string) => void
  onSetDragging?: (dragging: boolean) => void
  className?: string
}

export function ReferenceImageDropZone({
  dragging, hasImage, children, onDropImageId, onSetDragging, className,
}: ReferenceImageDropZoneProps) {
  const handleDragOver = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault()
    e.dataTransfer.dropEffect = 'copy'
    onSetDragging?.(true)
  }
  const handleDragEnter = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault()
    onSetDragging?.(true)
  }
  const handleDragLeave = (e: DragEvent<HTMLDivElement>) => {
    if (e.currentTarget.contains(e.relatedTarget as Node | null)) return
    onSetDragging?.(false)
  }
  const handleDrop = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault()
    const imageId = e.dataTransfer.getData('text/plain')
    onSetDragging?.(false)
    if (imageId) onDropImageId?.(imageId)
  }
  return (
    <DropZone
      variant="filled"
      active={dragging}
      className={className}
      style={hasImage ? HAS_IMAGE_STYLE : EMPTY_STYLE}
      onDragOver={handleDragOver}
      onDragEnter={handleDragEnter}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
    >
      {children}
    </DropZone>
  )
}
