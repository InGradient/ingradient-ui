import styled from 'styled-components'
import { Inline, Text } from '../../primitives'

const ROW_STYLE = {
  padding: 'var(--ig-space-5) var(--ig-space-9)',
  borderBottom: '1px solid var(--ig-color-border-strong)',
  flexShrink: 0,
}

const Chip = styled.button<{ $active: boolean }>`
  padding: var(--ig-space-2) var(--ig-space-5);
  font-size: 13px;
  border-radius: var(--ig-radius-pill);
  border: 1px solid ${(p) => (p.$active ? 'var(--ig-color-accent)' : 'var(--ig-color-border-strong)')};
  background: ${(p) => (p.$active ? 'var(--ig-color-blue-tint-18)' : 'transparent')};
  color: ${(p) => (p.$active ? 'var(--ig-color-accent-soft)' : 'var(--ig-color-text-muted)')};
  cursor: pointer;
  display: inline-flex;
  align-items: center;
  gap: var(--ig-space-2);
  transition: border-color var(--ig-motion-fast), color var(--ig-motion-fast), background var(--ig-motion-fast);
  &:hover {
    border-color: var(--ig-color-accent);
    color: var(--ig-color-text-primary);
  }
`

const COUNT_STYLE = { marginLeft: 2 }

export interface DatasetFilterChipRowItem {
  id: string
  name: string
  image_count: number
}

export interface DatasetFilterChipRowProps {
  label?: string
  datasets: DatasetFilterChipRowItem[]
  /** 빈 set 이면 모두 active 로 간주 (platform 규칙 — toggle 로 explicitly off 되기 전엔 전체 노출) */
  activeIds: Set<string>
  loading?: boolean
  loadingText?: string
  emptyText?: string
  onToggle?: (id: string) => void
}

export function DatasetFilterChipRow({
  label = 'Dataset', datasets, activeIds, loading,
  loadingText = 'Loading datasets…',
  emptyText = 'No linked datasets',
  onToggle,
}: DatasetFilterChipRowProps) {
  return (
    <Inline gap={3} wrap="wrap" style={ROW_STYLE}>
      <Text as="span" size="12px" weight={600} tone="soft" uppercase letterSpacing="0.04em" style={{ marginRight: 'var(--ig-space-1)' }}>{label}</Text>
      {loading ? (
        <Text as="span" tone="soft" size="13px">{loadingText}</Text>
      ) : datasets.length === 0 ? (
        <Text as="span" tone="soft" size="13px">{emptyText}</Text>
      ) : (
        datasets.map((d) => {
          const isActive = activeIds.size === 0 || activeIds.has(d.id)
          return (
            <Chip
              key={d.id}
              type="button"
              $active={isActive}
              onClick={() => onToggle?.(d.id)}
              aria-pressed={isActive}
            >
              {d.name}
              <Text as="span" size="11px" tone="soft" style={COUNT_STYLE}>{d.image_count}</Text>
            </Chip>
          )
        })
      )}
    </Inline>
  )
}
