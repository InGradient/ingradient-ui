import { chartHeights, EmptyState, Card } from '@ingradient/ui'
import styled from 'styled-components'
import { LineChartCard } from '@ingradient/ui/patterns'
import { CHART_BLUE, CHART_GREEN, CHART_PURPLE } from '../statics/chart-helpers'
import type { SystemMonitorMonitorTabViewProps } from './types'
import { Stack, Text } from '@ingradient/ui/primitives'


const StatsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: var(--ig-spacing-8);
`


const StatValue = styled.div`
  font-size: var(--ig-text-title);
  font-weight: var(--ig-font-weight-bold);
  color: var(--ig-color-text-primary);
  margin-top: var(--ig-spacing-8);
`

export function SystemMonitorMonitorTabView(props: SystemMonitorMonitorTabViewProps): JSX.Element {
  const { latest, history, labels } = props
  if (!latest) return <EmptyState>{labels.empty}</EmptyState>

  return (
    <Stack gap="var(--ig-spacing-12)">
      <StatsGrid>
        <Card elevation="raised" flat padding="var(--ig-spacing-8)"><Text as="div" size="var(--ig-text-micro)" tone="muted" uppercase letterSpacing="wide">{labels.cpu}</Text><StatValue>{latest.cpu}%</StatValue></Card>
        <Card elevation="raised" flat padding="var(--ig-spacing-8)"><Text as="div" size="var(--ig-text-micro)" tone="muted" uppercase letterSpacing="wide">{labels.memory}</Text><StatValue>{latest.memory}%</StatValue></Card>
        <Card elevation="raised" flat padding="var(--ig-spacing-8)"><Text as="div" size="var(--ig-text-micro)" tone="muted" uppercase letterSpacing="wide">{labels.disk}</Text><StatValue>{latest.disk}%</StatValue></Card>
      </StatsGrid>
      <LineChartCard
        title=""
        data={history as unknown as Record<string, string | number>[]}
        xKey="ts"
        series={[
          { key: 'cpu',    label: labels.cpu,    color: CHART_BLUE },
          { key: 'memory', label: labels.memory, color: CHART_PURPLE },
          { key: 'disk',   label: labels.disk,   color: CHART_GREEN },
        ]}
        height={chartHeights.md}
      />
    </Stack>
  )
}
