import { Box, Grid, Text } from '@ingradient/ui/primitives'
import { Skeleton } from '@ingradient/ui/components'

const CARD_STYLE = {
  background: 'var(--ig-color-surface-raised)',
  border: 'var(--ig-border-1px) solid var(--ig-color-border-strong)',
  borderRadius: 'var(--ig-radius-xxs)',
  padding: 'var(--ig-space-6)',
}

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
      <Grid gap="var(--ig-space-5)" columns="repeat(4, 1fr)">
        {Array.from({ length: loadingCount }, (_, i) => <Skeleton key={i} $height="var(--ig-layout-sidebar-header)" />)}
      </Grid>
    )
  }
  return (
    <Grid gap="var(--ig-space-5)" columns="repeat(4, 1fr)">
      {items.map((item, i) => (
        <Box key={i} style={CARD_STYLE}>
          <Text size="var(--ig-font-size-2xs)" tone="muted" style={LABEL_STYLE}>{item.label}</Text>
          <Text size="var(--ig-font-size-3xl)" weight={600}>
            {item.value}
            {item.sub ? <Text as="span" size="var(--ig-font-size-xs)" tone="soft" weight={400} style={SUB_STYLE}>{item.sub}</Text> : null}
          </Text>
        </Box>
      ))}
    </Grid>
  )
}
