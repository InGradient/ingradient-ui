import { media } from '@ingradient/ui/tokens'
import styled from 'styled-components'
import { SectionPanel } from '@ingradient/ui/components'
import { stateTitleText } from '@ingradient/ui/primitives'

export const CHART_COLORS = [
  'var(--ig-color-chart-1)',
  'var(--ig-color-chart-2)',
  'var(--ig-color-chart-3)',
  'var(--ig-color-chart-4)',
  'var(--ig-color-chart-5)',
  'var(--ig-color-chart-6)',
]

export const Card = styled(SectionPanel)`
  background: var(--ig-color-surface-raised);
  border-color: var(--ig-color-border-strong);
  border-radius: var(--ig-radius-md);
  padding: var(--ig-space-7) var(--ig-space-9);
  gap: var(--ig-space-5);
`

export const CardHead = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: var(--ig-space-5);
  margin-bottom: var(--ig-space-4);
`

export const CardTitle = styled.span`
  font-size: var(--ig-font-size-sm);
  font-weight: var(--ig-font-weight-semibold);
  color: var(--ig-color-text-secondary);
`

export const StatRow = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: var(--ig-space-3) 0;
  border-bottom: var(--ig-border-1px) solid var(--ig-color-border-strong);
  &:last-child {
    border-bottom: none;
  }
`

export const StatLabel = styled.span`
  color: var(--ig-color-text-muted);
  font-size: var(--ig-font-size-md);
`

export const StatValue = styled.span`
  font-size: var(--ig-font-size-md);
  font-weight: var(--ig-font-weight-medium);
  color: var(--ig-color-text-primary);
`

export const EdgeSection = styled.div`
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: var(--ig-space-9);
  ${media.lg} {
    grid-template-columns: 1fr;
  }
`

export const Empty = styled.p`
  ${stateTitleText}
  margin: 0;
`

export const Table = styled.table`
  width: 100%;
  border-collapse: collapse;
  font-size: var(--ig-font-size-md);
  th,
  td {
    padding: var(--ig-space-3) var(--ig-space-5);
    text-align: left;
    border-bottom: var(--ig-border-1px) solid var(--ig-color-border-strong);
  }
  th {
    color: var(--ig-color-text-muted);
    font-weight: var(--ig-font-weight-medium);
  }
  td {
    color: var(--ig-color-text-primary);
  }
`
