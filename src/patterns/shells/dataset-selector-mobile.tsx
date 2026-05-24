import styled from 'styled-components'
import { ChevronDown } from 'lucide-react'

const Wrap = styled.div`
  flex: 1;
  min-width: 0;
  position: relative;
`

const Trigger = styled.button<{ $loading?: boolean }>`
  width: 100%;
  background: var(--ig-color-white-06);
  border: 1px solid rgba(255, 255, 255, 0.10);
  border-radius: var(--ig-radius-xs);
  padding: var(--ig-space-3) var(--ig-space-6);
  color: var(--ig-color-text-primary);
  font-size: 15px;
  font-weight: 600;
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

const TriggerLabel = styled.span`
  overflow: hidden;
  text-overflow: ellipsis;
`

const Dropdown = styled.div`
  position: absolute;
  top: calc(100% + 6px);
  left: 0;
  right: 0;
  background: linear-gradient(180deg, rgba(18, 24, 34, 0.98) 0%, rgba(10, 14, 20, 0.98) 100%);
  border: 1px solid rgba(148, 163, 184, 0.18);
  border-radius: var(--ig-radius-xl);
  box-shadow: var(--ig-shadow-popover);
  backdrop-filter: blur(16px);
  z-index: 200;
  overflow: hidden;
  max-height: 55vh;
  overflow-y: auto;
  min-height: 0;
`

const Option = styled.button<{ $active: boolean }>`
  width: 100%;
  display: flex;
  align-items: center;
  gap: var(--ig-space-4);
  padding: var(--ig-space-5) var(--ig-space-7);
  background: ${(p) => (p.$active ? 'var(--ig-color-blue-tint-14)' : 'none')};
  border: none;
  color: ${(p) => (p.$active ? 'var(--ig-color-accent)' : 'var(--ig-color-text-primary)')};
  font-size: 14px;
  text-align: left;
  cursor: pointer;
  &:hover { background: var(--ig-color-white-08); }
  &:not(:last-child) { border-bottom: 1px solid var(--ig-color-white-06); }
`

const Check = styled.span`
  margin-left: auto;
  color: var(--ig-color-accent);
  font-size: 12px;
`

export interface DatasetSelectorMobileOption {
  id: string
  name: string
}

export interface DatasetSelectorMobileProps {
  datasets: DatasetSelectorMobileOption[]
  currentId?: string
  loading?: boolean
  open: boolean
  onToggle: (open: boolean) => void
  onSelect: (id: string) => void
  placeholder?: string
}

export function DatasetSelectorMobile({
  datasets, currentId, loading, open, onToggle, onSelect,
  placeholder = 'Select dataset',
}: DatasetSelectorMobileProps) {
  const current = datasets.find((d) => d.id === currentId)
  const label = current?.name ?? (loading ? 'Loading…' : placeholder)
  return (
    <Wrap>
      <Trigger
        type="button"
        aria-haspopup="listbox"
        aria-expanded={open}
        $loading={loading}
        onClick={() => onToggle(!open)}
      >
        <TriggerLabel>{label}</TriggerLabel>
        <ChevronDown size={16} />
      </Trigger>
      {open && datasets.length > 0 ? (
        <Dropdown role="listbox">
          {datasets.map((d) => (
            <Option
              key={d.id}
              type="button"
              $active={d.id === currentId}
              role="option"
              aria-selected={d.id === currentId}
              onClick={() => { onSelect(d.id); onToggle(false) }}
            >
              {d.name}
              {d.id === currentId ? <Check>✓</Check> : null}
            </Option>
          ))}
        </Dropdown>
      ) : null}
    </Wrap>
  )
}
