import React from 'react'
import styled, { css } from 'styled-components'

const tabsTone = css`
  display: inline-flex;
  position: relative;
  padding: var(--ig-space-1);
  border-radius: var(--ig-radius-lg);
  border: 1px solid var(--ig-color-border-subtle);
  background: var(--ig-color-tab-surface);
  gap: var(--ig-space-1);
`

const TabsRoot = styled.div<{ $variant: 'pill' | 'underline' }>`
  ${(p) =>
    p.$variant === 'underline'
      ? css`
          display: inline-flex;
          position: relative;
          align-items: stretch;
          gap: 0;
          width: 100%;
          border-bottom: 1px solid var(--ig-color-border-subtle);
        `
      : tabsTone}
`

const TabsHighlight = styled.div<{ $left: number; $width: number; $visible: boolean; $variant: 'pill' | 'underline' }>`
  position: absolute;
  left: ${(p) => `${p.$left}px`};
  width: ${(p) => `${p.$width}px`};
  ${({ $variant }) =>
    $variant === 'underline'
      ? css`
          bottom: -1px;
          height: 2px;
          border-radius: var(--ig-radius-pill);
          background: var(--ig-color-accent-soft);
        `
      : css`
          top: var(--ig-space-1);
          height: calc(100% - calc(var(--ig-space-1) * 2));
          border-radius: var(--ig-radius-sm);
          background: var(--ig-color-tab-highlight);
        `}
  opacity: ${(p) => (p.$visible ? 1 : 0)};
  pointer-events: none;
  transition: left 0.22s ease, width 0.22s ease, opacity 0.16s ease;
`

const TabButton = styled.button<{ $active: boolean; $variant: 'pill' | 'underline' }>`
  position: relative;
  z-index: 1;
  border: 0;
  border-radius: ${(p) => (p.$variant === 'underline' ? '0' : 'var(--ig-radius-sm)')};
  background: transparent;
  padding: ${(p) => (p.$variant === 'underline' ? 'var(--ig-space-4) var(--ig-space-9)' : 'var(--ig-space-4) var(--ig-space-6)')};
  color: ${(p) => (p.$variant === 'underline' ? (p.$active ? 'var(--ig-color-accent-soft)' : 'var(--ig-color-text-muted)') : p.$active ? 'var(--ig-color-text-primary)' : 'var(--ig-color-text-muted)')};
  cursor: pointer;
  font-weight: ${(p) => (p.$variant === 'underline' ? (p.$active ? 600 : 500) : 600)};
  transition: color var(--ig-motion-fast);
`

export function Tabs({
  items,
  value,
  onChange,
  variant = 'pill',
  className,
  style,
}: {
  items: Array<{ value: string; label: string }>
  value: string
  onChange: (value: string) => void
  variant?: 'pill' | 'underline'
  className?: string
  style?: React.CSSProperties
}) {
  const rootRef = React.useRef<HTMLDivElement | null>(null)
  const buttonRefs = React.useRef<Record<string, HTMLButtonElement | null>>({})
  const [highlight, setHighlight] = React.useState({ left: 0, width: 0, visible: false })

  React.useLayoutEffect(() => {
    const root = rootRef.current
    const activeButton = buttonRefs.current[value]
    if (!root || !activeButton) return setHighlight((prev) => ({ ...prev, visible: false }))
    const update = () => {
      const rootRect = root.getBoundingClientRect()
      const activeRect = activeButton.getBoundingClientRect()
      setHighlight({ left: activeRect.left - rootRect.left, width: activeRect.width, visible: true })
    }
    update()
    const resizeObserver = new ResizeObserver(update)
    resizeObserver.observe(root)
    resizeObserver.observe(activeButton)
    window.addEventListener('resize', update)
    return () => {
      resizeObserver.disconnect()
      window.removeEventListener('resize', update)
    }
  }, [items, value])

  return (
    <TabsRoot ref={rootRef} $variant={variant} className={className} style={style}>
      <TabsHighlight $left={highlight.left} $width={highlight.width} $visible={highlight.visible} $variant={variant} />
      {items.map((item) => (
        <TabButton
          key={item.value}
          ref={(node) => {
            buttonRefs.current[item.value] = node
          }}
          type="button"
          $active={item.value === value}
          $variant={variant}
          onClick={() => onChange(item.value)}
        >
          {item.label}
        </TabButton>
      ))}
    </TabsRoot>
  )
}

export const TabsNav = styled.div`
  ${tabsTone}
`
