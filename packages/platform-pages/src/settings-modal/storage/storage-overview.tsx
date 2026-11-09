import styled from 'styled-components'
import { Grid, Text } from '@ingradient/ui/primitives'
import { Card, Skeleton } from '@ingradient/ui/components'

const LabelBox = styled(Text)`
  margin-bottom: var(--ig-spacing-4);
`
const SubBox = styled(Text)`
  margin-left: var(--ig-spacing-4);
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
      <Grid gap="var(--ig-spacing-12)" minItemWidth="var(--ig-layout-size-grid-cell-min)">
        {Array.from({ length: loadingCount }, (_, i) => <Skeleton key={i} $height="var(--ig-layout-sidebar-header)" />)}
      </Grid>
    )
  }
  return (
    <Grid gap="var(--ig-spacing-12)" minItemWidth="var(--ig-layout-size-grid-cell-min)">
      {items.map((item, i) => (
        <Card key={i} elevation="raised" flat border="strong" radius="var(--ig-radius-xxs)" padding="var(--ig-spacing-12)">
          <LabelBox forwardedAs="div" size="var(--ig-text-micro)" tone="muted">{item.label}</LabelBox>
          <Text as="div" size="var(--ig-text-title)" weight="semibold">
            {item.value}
            {item.sub ? <SubBox forwardedAs="span" size="var(--ig-text-caption)" tone="soft" weight="regular">{item.sub}</SubBox> : null}
          </Text>
        </Card>
      ))}
    </Grid>
  )
}
