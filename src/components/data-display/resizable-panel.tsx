import React, { useCallback, useRef, useState, useEffect } from 'react'
import styled from 'styled-components'

const Container = styled.div<{ $direction: 'horizontal' | 'vertical' }>`
  display: flex;
  flex-direction: ${(p) => (p.$direction === 'horizontal' ? 'row' : 'column')};
  flex: 1;
  min-width: 0;
  min-height: 0;
`

const Panel = styled.div`
  overflow: auto;
  min-width: 0;
  min-height: 0;
`

const Handle = styled.div<{ $direction: 'horizontal' | 'vertical' }>`
  flex-shrink: 0;
  ${(p) =>
    p.$direction === 'horizontal'
      ? 'width: 4px; cursor: col-resize;'
      : 'height: 4px; cursor: row-resize;'}
  background: transparent;
  transition: background var(--ig-motion-fast);
  &:hover, &:active {
    background: var(--ig-color-accent-soft);
  }
`

export interface ResizablePanelProps {
  direction?: 'horizontal' | 'vertical'
  defaultSize?: number
  minSize?: number
  maxSize?: number
  storageKey?: string
  children: [React.ReactNode, React.ReactNode]
  className?: string
}

export function ResizablePanel({
  direction = 'horizontal', defaultSize = 240,
  minSize = 100, maxSize = 600, storageKey, children, className,
}: ResizablePanelProps) {
  const [size, setSize] = useState(() => {
    if (storageKey) {
      const saved = localStorage.getItem(storageKey)
      if (saved) return Math.max(minSize, Math.min(maxSize, Number(saved)))
    }
    return defaultSize
  })

  const dragging = useRef(false)
  const startPos = useRef(0)
  const startSize = useRef(0)

  useEffect(() => {
    if (storageKey) localStorage.setItem(storageKey, String(size))
  }, [size, storageKey])

  const onMouseDown = useCallback(
    (e: React.MouseEvent) => {
      e.preventDefault()
      dragging.current = true
      startPos.current = direction === 'horizontal' ? e.clientX : e.clientY
      startSize.current = size

      const onMove = (ev: MouseEvent) => {
        if (!dragging.current) return
        const delta = (direction === 'horizontal' ? ev.clientX : ev.clientY) - startPos.current
        setSize(Math.max(minSize, Math.min(maxSize, startSize.current + delta)))
      }
      const onUp = () => {
        dragging.current = false
        document.removeEventListener('mousemove', onMove)
        document.removeEventListener('mouseup', onUp)
      }
      document.addEventListener('mousemove', onMove)
      document.addEventListener('mouseup', onUp)
    },
    [direction, size, minSize, maxSize],
  )

  const sizeStyle = direction === 'horizontal'
    ? { width: size, flexShrink: 0 }
    : { height: size, flexShrink: 0 }

  return (
    <Container $direction={direction} className={className}>
      <Panel style={sizeStyle}>{children[0]}</Panel>
      <Handle $direction={direction} onMouseDown={onMouseDown} />
      <Panel style={{ flex: 1 }}>{children[1]}</Panel>
    </Container>
  )
}
