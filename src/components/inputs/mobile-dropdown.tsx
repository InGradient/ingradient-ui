import styled from 'styled-components'
import { ChevronDown } from 'lucide-react'
import { Box, Text } from '../../primitives'
import { MenuItem } from '../overlays/menu-item'

const WRAP_STYLE = { flex: 1, minWidth: 0, position: 'relative' as const }
const TRIGGER_LABEL_STYLE = { overflow: 'hidden' as const, textOverflow: 'ellipsis' as const }
const CHECK_STYLE = { marginLeft: 'auto' }

const Trigger = styled.button<{ $loading?: boolean }>`
  width: 100%;
  background: var(--ig-color-white-06);
  border: var(--ig-border-1px) solid var(--ig-color-white-10);
  border-radius: var(--ig-radius-xs);
  padding: var(--ig-space-3) var(--ig-space-6);
  color: var(--ig-color-text-primary);
  font-size: var(--ig-font-size-lg);
  font-weight: var(--ig-font-weight-semibold);
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: var(--ig-space-2);
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  &:hover { background: var(--ig-color-surface-interactive-hover); }
  ${(p) => p.$loading && 'opacity: 0.7;'}
`

const Dropdown = styled.div`
  position: absolute;
  top: calc(100% + 6px);
  left: 0;
  right: 0;
  background: linear-gradient(180deg, var(--ig-color-surface-dropdown-mobile-top) 0%, var(--ig-color-surface-dropdown-mobile-bottom) 100%);
  border: var(--ig-border-1px) solid var(--ig-color-slate-tint-18);
  border-radius: var(--ig-radius-xl);
  box-shadow: var(--ig-shadow-popover);
  backdrop-filter: blur(16px);
  z-index: var(--ig-z-mobile-menu);
  overflow: hidden;
  max-height: 55vh;
  overflow-y: auto;
  min-height: 0;
  > button:not(:last-child) {
    border-bottom: var(--ig-border-1px) solid var(--ig-color-white-06);
  }
`

export interface MobileDropdownOption {
  id: string
  name: string
}

export interface MobileDropdownProps {
  options: MobileDropdownOption[]
  currentId?: string
  loading?: boolean
  open: boolean
  onToggle: (open: boolean) => void
  onSelect: (id: string) => void
  placeholder?: string
}

/**
 * Mobile-only full-width dropdown — sticky-blur glass dropdown surface.
 * Desktop 환경에선 DropdownSelect / DropdownLayout 을 사용.
 */
export function MobileDropdown({
  options, currentId, loading, open, onToggle, onSelect,
  placeholder = 'Select an option',
}: MobileDropdownProps) {
  const current = options.find((d) => d.id === currentId)
  const label = current?.name ?? (loading ? 'Loading…' : placeholder)
  return (
    <Box style={WRAP_STYLE}>
      <Trigger
        type="button"
        aria-haspopup="listbox"
        aria-expanded={open}
        $loading={loading}
        onClick={() => onToggle(!open)}
      >
        <Text as="span" style={TRIGGER_LABEL_STYLE}>{label}</Text>
        <ChevronDown size={16} />
      </Trigger>
      {open && options.length > 0 ? (
        <Dropdown role="listbox">
          {options.map((d) => (
            <MenuItem
              key={d.id}
              role="option"
              size="md"
              active={d.id === currentId}
              aria-selected={d.id === currentId}
              onClick={() => { onSelect(d.id); onToggle(false) }}
              iconTrailing={d.id === currentId ? <Text as="span" tone="accent" size="var(--ig-font-size-xs)" style={CHECK_STYLE}>✓</Text> : undefined}
            >
              {d.name}
            </MenuItem>
          ))}
        </Dropdown>
      ) : null}
    </Box>
  )
}
