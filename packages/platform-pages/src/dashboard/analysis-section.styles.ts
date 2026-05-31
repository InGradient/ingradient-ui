import styled from 'styled-components'
import { SectionPanel } from '@ingradient/ui/components'
import { stateTitleText } from '@ingradient/ui/primitives'

export const CHART_COLORS = [
  'var(--ig-color-accent)',
  '#6c5ce7',
  '#00b894',
  '#fdcb6e',
  '#e17055',
  '#74b9ff',
  '#a29bfe',
  '#55efc4',
]

export const Card = styled(SectionPanel)`
  background: var(--ig-color-surface-raised);
  border-color: var(--ig-color-border-strong);
  border-radius: 8px;
  padding: 16px 20px;
  gap: 12px;
`

export const CardHead = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  margin-bottom: 10px;
`

export const CardTitle = styled.span`
  font-size: 13px;
  font-weight: 600;
  color: var(--ig-color-text-secondary);
`

export const StatRow = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 8px 0;
  border-bottom: 1px solid var(--ig-color-border-strong);
  &:last-child {
    border-bottom: none;
  }
`

export const StatLabel = styled.span`
  color: var(--ig-color-text-muted);
  font-size: 14px;
`

export const StatValue = styled.span`
  font-size: 14px;
  font-weight: 500;
  color: var(--ig-color-text-primary);
`

export const EdgeSection = styled.div`
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 20px;
  @media (max-width: 1024px) {
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
  font-size: 14px;
  th,
  td {
    padding: 8px 12px;
    text-align: left;
    border-bottom: 1px solid var(--ig-color-border-strong);
  }
  th {
    color: var(--ig-color-text-muted);
    font-weight: 500;
  }
  td {
    color: var(--ig-color-text-primary);
  }
`
