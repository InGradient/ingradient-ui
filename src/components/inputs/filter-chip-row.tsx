import styled from 'styled-components'
import { Inline, Text } from '../../primitives'

const ROW_STYLE = {
  padding: 'var(--ig-space-5) var(--ig-space-9)',
  borderBottom: 'var(--ig-border-1px) solid var(--ig-color-border-strong)',
  flexShrink: 0,
}

const Chip = styled.button<{ $active: boolean }>`
  padding: var(--ig-space-2) var(--ig-space-5);
  font-size: var(--ig-font-size-sm);
  border-radius: var(--ig-radius-pill);
  border: var(--ig-border-1px) solid ${(p) => (p.$active ? 'var(--ig-color-accent)' : 'var(--ig-color-border-strong)')};
  background: ${(p) => (p.$active ? 'var(--ig-color-accent-soft-surface-hover)' : 'transparent')};
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

const COUNT_STYLE = { marginLeft: 'var(--ig-space-2px)' }

export interface FilterChipItem {
  id: string
  label: string
  count?: number
}

export interface FilterChipRowProps {
  /** uppercase 라벨 (왼쪽). 기본 'Filter'. */
  label?: string
  items: FilterChipItem[]
  /** 빈 set 이면 모두 active 로 간주 (toggle 로 explicitly off 되기 전엔 전체 노출). */
  activeIds: Set<string>
  loading?: boolean
  loadingText?: string
  emptyText?: string
  onToggle?: (id: string) => void
}

/**
 * Horizontal toggle chip row with label + per-item count badge.
 * Empty activeIds set 은 "전체 활성" 으로 해석 (toggle 시작 전 default state).
 * Dataset / class / member / 일반 다중 선택 필터링에 generic.
 */
export function FilterChipRow({
  label = 'Filter', items, activeIds, loading,
  loadingText = 'Loading…',
  emptyText = 'No items',
  onToggle,
}: FilterChipRowProps) {
  return (
    <Inline gap={3} wrap="wrap" style={ROW_STYLE}>
      <Text as="span" size="var(--ig-font-size-xs)" weight="semibold" tone="soft" uppercase letterSpacing="normal" style={{ marginRight: 'var(--ig-space-1)' }}>{label}</Text>
      {loading ? (
        <Text as="span" tone="soft" size="var(--ig-font-size-sm)">{loadingText}</Text>
      ) : items.length === 0 ? (
        <Text as="span" tone="soft" size="var(--ig-font-size-sm)">{emptyText}</Text>
      ) : (
        items.map((it) => {
          const isActive = activeIds.size === 0 || activeIds.has(it.id)
          return (
            <Chip
              key={it.id}
              type="button"
              $active={isActive}
              onClick={() => onToggle?.(it.id)}
              aria-pressed={isActive}
            >
              {it.label}
              {typeof it.count === 'number' ? (
                <Text as="span" size="var(--ig-font-size-2xs)" tone="soft" style={COUNT_STYLE}>{it.count}</Text>
              ) : null}
            </Chip>
          )
        })
      )}
    </Inline>
  )
}
