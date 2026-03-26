import React from 'react'
import {
  Root, Highlight, ItemButton, ItemMain, ItemLabel, ItemBadge,
  type VerticalTabsRadius,
} from './vertical-tabs.styles'

export type { VerticalTabsRadius }

export type VerticalTabsItem = {
  value: string
  label: React.ReactNode
  badge?: React.ReactNode
  icon?: React.ReactNode
  disabled?: boolean
}

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
        const currentIndex = enabledItems.findIndex((c) => c.value === item.value)
        return (
          <ItemButton
            key={item.value}
            ref={(node) => { buttonRefs.current[item.value] = node }}
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
