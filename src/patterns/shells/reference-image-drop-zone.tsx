import type { DragEvent, ReactNode } from 'react'
import styled from 'styled-components'

const Zone = styled.div<{ $dragging?: boolean; $hasImage?: boolean }>`
  padding: ${(p) => (p.$hasImage ? '10px' : '20px')};
  border: 1px solid ${(p) => (p.$dragging ? 'rgba(77, 136, 255, 0.7)' : 'var(--ig-color-white-12)')};
  border-radius: 8px;
  background: ${(p) => (p.$dragging ? 'var(--ig-color-blue-tint-12)' : 'var(--ig-color-surface-raised)')};
  color: var(--ig-color-text-soft);
  font-size: 13px;
  text-align: left;
  min-height: ${(p) => (p.$hasImage ? '0' : '180px')};
  display: flex;
  align-items: center;
  justify-content: center;
  transition: border-color 0.16s ease, background 0.16s ease;
  overflow: visible;
`

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
    <Zone
      $dragging={dragging}
      $hasImage={hasImage}
      className={className}
      onDragOver={handleDragOver}
      onDragEnter={handleDragEnter}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
    >
      {children}
    </Zone>
  )
}
