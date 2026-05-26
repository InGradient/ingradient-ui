import styled from 'styled-components'
import { LineChartCard } from '@ingradient/ui/patterns'
import type { SystemMonitorMonitorTabViewProps } from './types'

const Wrap = styled.div`display: flex; flex-direction: column; gap: var(--ig-space-5);`

const StatsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: var(--ig-space-4);
`

const StatCard = styled.div`
  padding: var(--ig-space-4);
  background: var(--ig-color-surface-raised);
  border: 1px solid var(--ig-color-border-subtle);
  border-radius: var(--ig-radius-sm);
`

const StatLabel = styled.div`
  font-size: var(--ig-font-size-2xs);
  color: var(--ig-color-text-muted);
  text-transform: uppercase;
  letter-spacing: 0.05em;
`

const StatValue = styled.div`
  font-size: var(--ig-font-size-2xl);
  font-weight: 700;
  color: var(--ig-color-text-primary);
  margin-top: var(--ig-space-2);
`

const Empty = styled.div`
  font-size: var(--ig-font-size-sm);
  color: var(--ig-color-text-muted);
  text-align: center;
  padding: var(--ig-space-7) 0;
`

export function SystemMonitorMonitorTabView(props: SystemMonitorMonitorTabViewProps): JSX.Element {
  const { latest, history, labels } = props
  if (!latest) return <Empty>{labels.empty}</Empty>

  return (
    <Wrap>
      <StatsGrid>
        <StatCard><StatLabel>{labels.cpu}</StatLabel><StatValue>{latest.cpu}%</StatValue></StatCard>
        <StatCard><StatLabel>{labels.memory}</StatLabel><StatValue>{latest.memory}%</StatValue></StatCard>
        <StatCard><StatLabel>{labels.disk}</StatLabel><StatValue>{latest.disk}%</StatValue></StatCard>
      </StatsGrid>
      <LineChartCard
        title=""
        data={history as unknown as Record<string, string | number>[]}
        xKey="ts"
        series={[
          { key: 'cpu',    label: labels.cpu,    color: '#60a5fa' },
          { key: 'memory', label: labels.memory, color: '#a78bfa' },
          { key: 'disk',   label: labels.disk,   color: '#34d399' },
        ]}
        height={240}
      />
    </Wrap>
  )
}
