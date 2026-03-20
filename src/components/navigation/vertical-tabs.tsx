import React from 'react'
import styled from 'styled-components'

export type VerticalTabsItem = {
  value: string
  label: React.ReactNode
  badge?: React.ReactNode
  icon?: React.ReactNode
  disabled?: boolean
}

export type VerticalTabsRadius = 'xs' | 'sm' | 'md' | 'lg'

const verticalTabsRadiusStyles: Record<VerticalTabsRadius, { root: string; item: string }> = {
  xs: {
    root: 'var(--ig-radius-sm)',
    item: 'var(--ig-radius-xs)',
  },
  sm: {
    root: 'var(--ig-radius-md)',
    item: 'var(--ig-radius-sm)',
  },
  md: {
    root: 'var(--ig-radius-lg)',
    item: 'var(--ig-radius-md)',
  },
  lg: {
    root: 'var(--ig-radius-xl)',
    item: 'var(--ig-radius-lg)',
  },
}

const Root = styled.div<{ $radius: VerticalTabsRadius }>`
  position: relative;
  display: flex;
  flex-direction: column;
  gap: var(--ig-space-1);
  width: 100%;
  padding: var(--ig-space-2);
  border: 1px solid var(--ig-color-border-subtle);
  border-radius: ${(p) => verticalTabsRadiusStyles[p.$radius].root};
  background: var(--ig-color-surface-panel);
`

const Highlight = styled.div<{ $top: number; $height: number; $visible: boolean; $radius: VerticalTabsRadius }>`
  position: absolute;
  left: var(--ig-space-2);
  right: var(--ig-space-2);
  top: ${(p) => `${p.$top}px`};
  height: ${(p) => `${p.$height}px`};
  border-left: 3px solid var(--ig-color-accent-soft);
  border-radius: ${(p) => verticalTabsRadiusStyles[p.$radius].item};
  background: var(--ig-color-tab-highlight);
  opacity: ${(p) => (p.$visible ? 1 : 0)};
  pointer-events: none;
  transition:
    top 0.22s ease,
    height 0.22s ease,
    opacity 0.16s ease;
`

const ItemButton = styled.button<{ $active: boolean; $radius: VerticalTabsRadius }>`
  position: relative;
  z-index: 1;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: var(--ig-space-3);
  width: 100%;
  min-height: 44px;
  padding: var(--ig-space-4) var(--ig-space-4) var(--ig-space-4) var(--ig-space-5);
  border: 0;
  border-radius: ${(p) => verticalTabsRadiusStyles[p.$radius].item};
  background: transparent;
  color: ${(p) => (p.$active ? 'var(--ig-color-accent-soft)' : 'var(--ig-color-text-muted)')};
  font-size: var(--ig-font-size-sm);
  font-weight: ${(p) => (p.$active ? 600 : 500)};
  text-align: left;
  cursor: pointer;
  transition:
    color var(--ig-motion-fast),
    background-color var(--ig-motion-fast);

  &:hover:not(:disabled) {
    background: var(--ig-color-surface-interactive);
    color: ${(p) => (p.$active ? 'var(--ig-color-accent-soft)' : 'var(--ig-color-text-primary)')};
  }

  &:focus-visible {
    outline: none;
    box-shadow: var(--ig-shadow-focus-ring);
  }

  &:disabled {
    opacity: 0.48;
    cursor: not-allowed;
  }
`

const ItemMain = styled.span`
  display: inline-flex;
  align-items: center;
  gap: var(--ig-space-3);
  min-width: 0;
`

const ItemLabel = styled.span`
  min-width: 0;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
`

const ItemBadge = styled.span`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  min-width: 18px;
  height: 18px;
  padding: 0 var(--ig-space-2);
  border-radius: var(--ig-radius-pill);
  background: var(--ig-color-badge-accent);
  color: var(--ig-color-text-primary);
  font-size: 10px;
  font-weight: 700;
  line-height: 1;
`

export function VerticalTabs({
  items,
  value,
  onChange,
  radius = 'md',
  className,
  style,
}: {
  items: VerticalTabsItem[]
  value: string
  onChange: (value: string) => void
  radius?: VerticalTabsRadius
  className?: string
  style?: React.CSSProperties
}) {
  const rootRef = React.useRef<HTMLDivElement | null>(null)
  const buttonRefs = React.useRef<Record<string, HTMLButtonElement | null>>({})
  const [highlight, setHighlight] = React.useState({ top: 0, height: 0, visible: false })

  React.useLayoutEffect(() => {
    const root = rootRef.current
    const activeButton = buttonRefs.current[value]
    if (!root || !activeButton) return setHighlight((prev) => ({ ...prev, visible: false }))
    const update = () => {
      const rootRect = root.getBoundingClientRect()
      const activeRect = activeButton.getBoundingClientRect()
      setHighlight({ top: activeRect.top - rootRect.top, height: activeRect.height, visible: true })
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

  const enabledItems = items.filter((item) => !item.disabled)

  const moveFocus = (nextValue: string) => {
    onChange(nextValue)
    requestAnimationFrame(() => buttonRefs.current[nextValue]?.focus())
  }

  return (
    <Root ref={rootRef} role="tablist" aria-orientation="vertical" className={className} style={style} $radius={radius}>
      <Highlight $top={highlight.top} $height={highlight.height} $visible={highlight.visible} $radius={radius} />
      {items.map((item) => {
        const currentIndex = enabledItems.findIndex((candidate) => candidate.value === item.value)
        return (
          <ItemButton
            key={item.value}
            ref={(node) => {
              buttonRefs.current[item.value] = node
            }}
            type="button"
            role="tab"
            aria-selected={item.value === value}
            aria-disabled={item.disabled || undefined}
            disabled={item.disabled}
            $active={item.value === value}
            $radius={radius}
            onClick={() => !item.disabled && onChange(item.value)}
            onKeyDown={(event) => {
              if (item.disabled || currentIndex < 0) return
              if (event.key === 'ArrowDown') {
                event.preventDefault()
                moveFocus(enabledItems[(currentIndex + 1) % enabledItems.length].value)
              }
              if (event.key === 'ArrowUp') {
                event.preventDefault()
                moveFocus(enabledItems[(currentIndex - 1 + enabledItems.length) % enabledItems.length].value)
              }
              if (event.key === 'Home') {
                event.preventDefault()
                moveFocus(enabledItems[0].value)
              }
              if (event.key === 'End') {
                event.preventDefault()
                moveFocus(enabledItems[enabledItems.length - 1].value)
              }
            }}
          >
            <ItemMain>
              {item.icon}
              <ItemLabel>{item.label}</ItemLabel>
            </ItemMain>
            {item.badge != null ? <ItemBadge>{item.badge}</ItemBadge> : null}
          </ItemButton>
        )
      })}
    </Root>
  )
}
