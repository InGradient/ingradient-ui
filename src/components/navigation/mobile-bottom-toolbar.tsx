import type { ReactNode } from 'react'
import styled from 'styled-components'

const Bar = styled.div`
  position: sticky;
  bottom: 0;
  left: 0;
  right: 0;
  height: 60px;
  flex-shrink: 0;
  display: flex;
  align-items: center;
  justify-content: space-around;
  padding: 0 var(--ig-space-3);
  padding-bottom: env(safe-area-inset-bottom, var(--ig-space-0));
  background: var(--ig-color-surface-header);
  border-top: var(--ig-border-1px) solid var(--ig-color-border-subtle);
  backdrop-filter: blur(14px);
  z-index: 10;
`

const ToolBtn = styled.button<{ $active?: boolean }>`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: var(--ig-space-3px);
  min-width: 48px;
  height: 48px;
  padding: 0 var(--ig-space-2);
  border: none;
  background: none;
  color: ${(p) => (p.$active ? 'var(--ig-color-accent-soft)' : 'var(--ig-color-text-muted)')};
  cursor: pointer;
  border-radius: var(--ig-radius-xs);
  -webkit-tap-highlight-color: transparent;
  transition: color 0.15s, background 0.15s;
  &:hover:not(:disabled) { color: var(--ig-color-text-primary); background: var(--ig-color-white-07); }
  &:disabled { opacity: 0.4; cursor: not-allowed; }
  svg { width: 20px; height: 20px; flex-shrink: 0; }
  span { font-size: var(--ig-font-size-3xs); line-height: 1; white-space: nowrap; }
`

export interface MobileBottomToolbarAction {
  key: string
  label: string
  icon: ReactNode
  active?: boolean
  disabled?: boolean
  title?: string
  onClick?: () => void
}

export interface MobileBottomToolbarProps {
  actions: MobileBottomToolbarAction[]
  extraSlot?: ReactNode
}

export function MobileBottomToolbar({ actions, extraSlot }: MobileBottomToolbarProps) {
  return (
    <Bar>
      {actions.map((a) => (
        <ToolBtn
          key={a.key}
          type="button"
          $active={a.active}
          disabled={a.disabled}
          onClick={a.onClick}
          title={a.title ?? a.label}
        >
          {a.icon}
          <span>{a.label}</span>
        </ToolBtn>
      ))}
      {extraSlot}
    </Bar>
  )
}
