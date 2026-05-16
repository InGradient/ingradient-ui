import React, { useEffect, useRef, useState } from 'react'
import styled from 'styled-components'

const Backdrop = styled.div`
  position: fixed;
  inset: 0;
  z-index: calc(var(--ig-z-context-menu) - 1);
`

const Menu = styled.div`
  position: fixed;
  z-index: var(--ig-z-context-menu);
  min-width: 180px;
  background: var(--ig-color-surface-raised);
  border: 1px solid var(--ig-color-border-strong);
  border-radius: var(--ig-radius-md);
  box-shadow: var(--ig-shadow-popover);
  padding: var(--ig-space-2);
  display: flex;
  flex-direction: column;
  gap: 2px;
`

const Item = styled.button<{ $tone?: 'default' | 'danger' }>`
  display: flex;
  align-items: center;
  gap: var(--ig-space-3);
  padding: var(--ig-space-2) var(--ig-space-3);
  border: none;
  background: transparent;
  color: ${(p) => (p.$tone === 'danger' ? 'var(--ig-color-danger)' : 'var(--ig-color-text-primary)')};
  font-size: var(--ig-font-size-sm);
  text-align: left;
  cursor: pointer;
  border-radius: var(--ig-radius-sm);
  transition: background-color var(--ig-motion-fast);
  &:hover:not(:disabled), &[data-active='true']:not(:disabled) {
    background: var(--ig-color-surface-interactive-hover);
  }
  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
`

const ItemRow = styled.div`
  position: relative;
  display: flex;
`

const ItemLabel = styled.span`
  flex: 1;
  text-align: left;
`

const Chevron = styled.span`
  margin-left: var(--ig-space-3);
  color: var(--ig-color-text-muted);
  font-size: var(--ig-font-size-xs);
`

const Separator = styled.hr`
  margin: var(--ig-space-1) 0;
  border: none;
  border-top: 1px solid var(--ig-color-border-subtle);
`

export interface DatasetMenuAction {
  key: string
  label: string
  tone?: 'default' | 'danger'
  disabled?: boolean
  onClick?: () => void
  subActions?: DatasetMenuAction[]
  separator?: boolean
}

export interface DatasetMenuProps {
  anchorEl: HTMLElement | null
  onClose: () => void
  actions: DatasetMenuAction[]
  offset?: number
  defaultOpenSubmenuKey?: string
  alignRight?: boolean
}

export function DatasetMenu({
  anchorEl, onClose, actions, offset = 4, defaultOpenSubmenuKey, alignRight = true,
}: DatasetMenuProps) {
  const menuRef = useRef<HTMLDivElement>(null)
  const [submenuKey, setSubmenuKey] = useState<string | null>(defaultOpenSubmenuKey ?? null)
  const [submenuPos, setSubmenuPos] = useState<{ top: number; left: number } | null>(null)

  useEffect(() => {
    if (!anchorEl) return
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
    }
    window.addEventListener('keydown', handleKey)
    return () => window.removeEventListener('keydown', handleKey)
  }, [anchorEl, onClose])

  useEffect(() => {
    setSubmenuKey(defaultOpenSubmenuKey ?? null)
  }, [defaultOpenSubmenuKey, anchorEl])

  useEffect(() => {
    if (!defaultOpenSubmenuKey || !anchorEl) return
    const id = window.requestAnimationFrame(() => {
      const item = menuRef.current?.querySelector<HTMLElement>(`[data-menu-key="${defaultOpenSubmenuKey}"]`)
      if (!item) return
      const r = item.getBoundingClientRect()
      setSubmenuPos({ top: r.top, left: r.right + 4 })
    })
    return () => window.cancelAnimationFrame(id)
  }, [defaultOpenSubmenuKey, anchorEl])

  if (!anchorEl) return null
  const rect = anchorEl.getBoundingClientRect()
  const top = rect.bottom + offset
  const left = alignRight ? Math.max(8, rect.right - 200) : Math.max(8, rect.left)

  const subActions = actions.find((a) => a.key === submenuKey)?.subActions

  return (
    <>
      <Backdrop onClick={onClose} />
      <Menu ref={menuRef} style={{ top, left }} role="menu">
        {actions.map((a, i) => {
          if (a.separator) return <Separator key={`sep-${i}`} />
          const hasSub = !!a.subActions && a.subActions.length > 0
          return (
            <ItemRow key={a.key}>
              <Item
                role={hasSub ? 'menuitem' : 'menuitem'}
                $tone={a.tone}
                disabled={a.disabled}
                data-menu-key={a.key}
                data-active={submenuKey === a.key ? 'true' : 'false'}
                aria-haspopup={hasSub || undefined}
                aria-expanded={hasSub ? submenuKey === a.key : undefined}
                onMouseEnter={(e) => {
                  if (!hasSub) { setSubmenuKey(null); return }
                  const target = e.currentTarget as HTMLElement
                  const r = target.getBoundingClientRect()
                  setSubmenuPos({ top: r.top, left: r.right + 4 })
                  setSubmenuKey(a.key)
                }}
                onClick={() => {
                  if (hasSub) return
                  a.onClick?.()
                  onClose()
                }}
                style={{ width: '100%' }}
              >
                <ItemLabel>{a.label}</ItemLabel>
                {hasSub ? <Chevron>›</Chevron> : null}
              </Item>
            </ItemRow>
          )
        })}
      </Menu>
      {submenuKey && subActions && submenuPos ? (
        <Menu style={{ top: submenuPos.top, left: submenuPos.left }} role="menu">
          {subActions.map((sa) => (
            <Item
              key={sa.key}
              role="menuitem"
              $tone={sa.tone}
              disabled={sa.disabled}
              onClick={() => { sa.onClick?.(); onClose() }}
            >
              {sa.label}
            </Item>
          ))}
        </Menu>
      ) : null}
    </>
  )
}
