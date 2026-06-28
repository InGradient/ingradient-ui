import { chartHeights, EmptyState, Card } from '@ingradient/ui'
import styled from 'styled-components'
import { LineChartCard } from '@ingradient/ui/patterns'
import { CHART_BLUE, CHART_GREEN, CHART_PURPLE } from '../statics/chart-helpers'
import type { SystemMonitorMonitorTabViewProps } from './types'

const Wrap = styled.div`display: flex; flex-direction: column; gap: var(--ig-space-5);`

const StatsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: var(--ig-space-4);
`

const StatLabel = styled.div`
  font-size: var(--ig-font-size-2xs);
  color: var(--ig-color-text-muted);
  text-transform: uppercase;
  letter-spacing: var(--ig-letter-spacing-wide);
`

const StatValue = styled.div`
  font-size: var(--ig-font-size-2xl);
  font-weight: var(--ig-font-weight-bold);
  color: var(--ig-color-text-primary);
  margin-top: var(--ig-space-2);
`

export function SystemMonitorMonitorTabView(props: SystemMonitorMonitorTabViewProps): JSX.Element {
  const { latest, history, labels } = props
  if (!latest) return <EmptyState>{labels.empty}</EmptyState>

  return (
    <Wrap>
      <StatsGrid>
        <Card elevation="raised" flat radius="var(--ig-radius-sm)" padding="var(--ig-space-4)"><StatLabel>{labels.cpu}</StatLabel><StatValue>{latest.cpu}%</StatValue></Card>
        <Card elevation="raised" flat radius="var(--ig-radius-sm)" padding="var(--ig-space-4)"><StatLabel>{labels.memory}</StatLabel><StatValue>{latest.memory}%</StatValue></Card>
        <Card elevation="raised" flat radius="var(--ig-radius-sm)" padding="var(--ig-space-4)"><StatLabel>{labels.disk}</StatLabel><StatValue>{latest.disk}%</StatValue></Card>
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
    </Wrap>
  )
}
