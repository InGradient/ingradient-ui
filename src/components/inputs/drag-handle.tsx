import type { MouseEventHandler } from 'react'
import styled from 'styled-components'
import { IconButton } from './icon-button'

const Handle = styled(IconButton).attrs({
  variant: 'secondary' as const,
  size: 'sm' as const,
})`
  cursor: grab;
  color: var(--ig-color-text-secondary);
  &:hover {
    color: var(--ig-color-text-primary);
  }
  &:active {
    cursor: grabbing;
  }
  svg {
    width: 16px;
    height: 16px;
  }
`

const DragDots = styled.span`
  display: inline-grid;
  width: 14px;
  height: 14px;
  grid-template-columns: repeat(2, 1fr);
  gap: var(--ig-space-2px);
  span {
    width: 100%;
    height: 100%;
    border-radius: var(--ig-radius-pill);
    background: currentColor;
    opacity: 0.72;
  }
`

export interface DragHandleProps {
  ariaLabel?: string
  title?: string
  onPointerDown?: MouseEventHandler<HTMLButtonElement>
  /** Spread caller's dnd-kit `attributes` here. */
  buttonProps?: Record<string, unknown>
  className?: string
}

export function DragHandle({
  ariaLabel = 'Drag to reorder',
  title = 'Drag to reorder',
  onPointerDown,
  buttonProps,
  className,
}: DragHandleProps) {
  return (
    <Handle
      type="button"
      aria-label={ariaLabel}
      title={title}
      onPointerDown={onPointerDown}
      className={className}
      {...buttonProps}
    >
      <DragDots aria-hidden="true">
        <span />
        <span />
        <span />
        <span />
      </DragDots>
    </Handle>
  )
}
