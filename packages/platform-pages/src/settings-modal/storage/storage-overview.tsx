import { Grid, Text } from '@ingradient/ui/primitives'
import { Card, Skeleton } from '@ingradient/ui/components'

const LABEL_STYLE = { marginBottom: 'var(--ig-space-1)' }
const SUB_STYLE = { marginLeft: 'var(--ig-space-1)' }

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
      <Grid gap="var(--ig-space-5)" minItemWidth="var(--ig-popup-2xs)">
        {Array.from({ length: loadingCount }, (_, i) => <Skeleton key={i} $height="var(--ig-layout-sidebar-header)" />)}
      </Grid>
    )
  }
  return (
    <Grid gap="var(--ig-space-5)" minItemWidth="var(--ig-popup-2xs)">
      {items.map((item, i) => (
        <Card key={i} elevation="raised" flat border="strong" radius="var(--ig-radius-xxs)" padding="var(--ig-space-6)">
          <Text as="div" size="var(--ig-font-size-2xs)" tone="muted" style={LABEL_STYLE}>{item.label}</Text>
          <Text as="div" size="var(--ig-font-size-3xl)" weight="semibold">
            {item.value}
            {item.sub ? <Text as="span" size="var(--ig-font-size-xs)" tone="soft" weight="regular" style={SUB_STYLE}>{item.sub}</Text> : null}
          </Text>
        </Card>
      ))}
    </Grid>
  )
}
