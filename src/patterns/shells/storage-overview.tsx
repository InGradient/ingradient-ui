import styled from 'styled-components'
import { Skeleton } from '../../components/feedback/skeleton'

const Grid = styled.div`
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 12px;
`

const Card = styled.div`
  background: var(--ig-color-surface-raised);
  border: 1px solid var(--ig-color-border-strong);
  border-radius: 8px;
  padding: 14px;
`

const Label = styled.div`
  font-size: 11px;
  color: var(--ig-color-text-muted);
  margin-bottom: 4px;
`

const Value = styled.div`
  font-size: 20px;
  font-weight: 600;
  color: var(--ig-color-text-primary);
`

const Sub = styled.span`
  font-size: 12px;
  color: var(--ig-color-text-soft);
  font-weight: 400;
  margin-left: 4px;
`

export interface StorageOverviewItem {
  label: string
  value: string | number
  sub?: string
}

export interface StorageOverviewProps {
  items: StorageOverviewItem[]
  loading?: boolean
  /** loading 시 보일 카드 갯수 (기본 4) */
  loadingCount?: number
}

export function StorageOverview({ items, loading, loadingCount = 4 }: StorageOverviewProps) {
  if (loading) {
    return (
      <Grid>
        {Array.from({ length: loadingCount }, (_, i) => <Skeleton key={i} $height="72px" />)}
      </Grid>
    )
  }
  return (
    <Grid>
      {items.map((item, i) => (
        <Card key={i}>
          <Label>{item.label}</Label>
          <Value>
            {item.value}
            {item.sub ? <Sub>{item.sub}</Sub> : null}
          </Value>
        </Card>
      ))}
    </Grid>
  )
}
