import type { MouseEventHandler } from 'react'
import styled from 'styled-components'
import { IconButton } from '../../components/inputs/icon-button'

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
  gap: 2px;
  span {
    width: 100%;
    height: 100%;
    border-radius: var(--ig-radius-pill);
    background: currentColor;
    opacity: 0.72;
  }
`

export interface WidgetDragHandleProps {
  /** ARIA label — default "Drag to reorder". */
  ariaLabel?: string
  /** title attribute — default "Drag to reorder". */
  title?: string
  /** Pointer-down handler — caller can use dnd-kit useDraggable's listeners. */
  onPointerDown?: MouseEventHandler<HTMLButtonElement>
  /** Spread caller's dnd-kit `attributes` here. */
  buttonProps?: Record<string, unknown>
  className?: string
}

/**
 * Widget header drag handle — platform 의 `WidgetDragHandle` + `DragDots` 시각 동일.
 * 2x2 도트 그리드 + cursor: grab. 클릭으로 동작하진 않으며, caller 가
 * `@dnd-kit/core` 의 `useDraggable()` 에서 attributes + listeners 를 prop 로 전달.
 */
export function WidgetDragHandle({
  ariaLabel = 'Drag to reorder',
  title = 'Drag to reorder',
  onPointerDown,
  buttonProps,
  className,
}: WidgetDragHandleProps) {
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
