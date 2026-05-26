import type { ReactNode } from 'react'
import styled from 'styled-components'

/** Coord readout — toolbar 와 분리된 별도 컴포넌트. 보통 canvas 아래 sibling 으로 배치.
 *  min-height + line-height 로 텍스트가 비어도 height 고정 (layout shift 방지). */
const CoordReadoutRoot = styled.div`
  font-size: 12px;
  font-family: ui-monospace, monospace;
  color: var(--ig-color-text-muted);
  user-select: all;
  padding: var(--ig-space-2) var(--ig-space-4);
  background: var(--ig-color-overlay-dim);
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  flex-shrink: 0;
  line-height: 1.4;
  min-height: calc(1.4em + 12px);
  box-sizing: border-box;
`

export interface CanvasCoordReadoutProps {
  children: ReactNode
  className?: string
  ariaLabel?: string
}

/**
 * Canvas 좌표 readout — canvas 아래 sibling 으로 배치되는 monospace 라벨.
 * toolbar placement 와 무관하게 canvas 아래 위치 유지.
 */
export function CanvasCoordReadout({
  children,
  className,
  ariaLabel,
}: CanvasCoordReadoutProps) {
  return (
    <CoordReadoutRoot
      className={className}
      role="status"
      aria-label={ariaLabel}
      aria-live="polite"
    >
      {children}
    </CoordReadoutRoot>
  )
}
