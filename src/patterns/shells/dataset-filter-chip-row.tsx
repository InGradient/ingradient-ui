import type { ReactNode } from 'react'
import styled from 'styled-components'

const Row = styled.div`
  padding: 12px 20px;
  border-bottom: 1px solid var(--ig-color-border-strong);
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  align-items: center;
  flex-shrink: 0;
  min-width: 0;
`

const Label = styled.span`
  font-size: 12px;
  font-weight: 600;
  color: var(--ig-color-text-soft);
  text-transform: uppercase;
  letter-spacing: 0.04em;
  margin-right: 4px;
`

const Chip = styled.button<{ $active: boolean }>`
  padding: 6px 12px;
  font-size: 13px;
  border-radius: 999px;
  border: 1px solid ${(p) => (p.$active ? 'var(--ig-color-accent)' : 'var(--ig-color-border-strong)')};
  background: ${(p) => (p.$active ? 'var(--ig-color-blue-tint-18)' : 'transparent')};
  color: ${(p) => (p.$active ? 'var(--ig-color-accent-soft)' : 'var(--ig-color-text-muted)')};
  cursor: pointer;
  display: inline-flex;
  align-items: center;
  gap: 6px;
  transition: border-color var(--ig-motion-fast), color var(--ig-motion-fast), background var(--ig-motion-fast);
  &:hover {
    border-color: var(--ig-color-accent);
    color: var(--ig-color-text-primary);
  }
`

const Count = styled.span`
  font-size: 11px;
  color: var(--ig-color-text-soft);
  margin-left: 2px;
`

const Hint = styled.span`
  color: var(--ig-color-text-soft);
  font-size: 13px;
`

export interface DatasetFilterChipRowItem {
  id: string
  name: string
  image_count: number
}

export interface DatasetFilterChipRowProps {
  leading?: ReactNode
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
  leading, label = 'Dataset', datasets, activeIds, loading,
  loadingText = 'Loading datasets…',
  emptyText = 'No linked datasets',
  onToggle,
}: DatasetFilterChipRowProps) {
  return (
    <Row>
      {leading}
      <Label>{label}</Label>
      {loading ? (
        <Hint>{loadingText}</Hint>
      ) : datasets.length === 0 ? (
        <Hint>{emptyText}</Hint>
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
              <Count>{d.image_count}</Count>
            </Chip>
          )
        })
      )}
    </Row>
  )
}
