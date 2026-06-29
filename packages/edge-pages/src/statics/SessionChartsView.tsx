import { chartHeights, Card } from '@ingradient/ui'
import { iconSizeNumbers } from '@ingradient/ui'
import { BarChartCard, PieChartCard } from '@ingradient/ui/patterns'
import { Table, type TableColumn, EmptyState } from '@ingradient/ui/components'
import { PanelGrid, PanelTitle } from './StaticsView.styles'
import {
  DurationGrid, DurationLabel, DurationValue,
} from './SessionChartsView.styles'
import { CHART_BLUE, CHART_GREEN, CHART_WARNING, CHART_DANGER } from './chart-helpers'
import type { SessionChartsViewProps } from './types'

const outcomeColors: Record<string, string> = {
  success: CHART_BLUE,
  retry: CHART_WARNING,
  timeout: CHART_DANGER,
}

function formatMs(v: number | null): string {
  if (v == null || !Number.isFinite(v)) return '—'
  return v < 1000 ? `${Math.round(v)} ms` : `${(v / 1000).toFixed(2)} s`
}

type MsTooltipPayload = { value?: string | number }
function MsTooltip({ active, label, payload }: { active?: boolean; label?: string | number; payload?: MsTooltipPayload[] }): JSX.Element | null {
  if (!active || !payload?.length) return null
  const value = Number(payload[0]?.value ?? 0)
  return (
    <div style={{
      background: 'var(--ig-color-surface-raised)',
      border: 'var(--ig-border-1px) solid var(--ig-color-border-strong)',
      borderRadius: 'var(--ig-radius-sm)',
      padding: 'var(--ig-space-3) var(--ig-space-4)',
      color: 'var(--ig-color-text-primary)',
      fontSize: 'var(--ig-font-size-xs)',
    }}>
      <div style={{ fontWeight: 'var(--ig-font-weight-bold)', marginBottom: 'var(--ig-space-1)' }}>{label}</div>
      <div>{formatMs(value)}</div>
    </div>
  )
}

export function SessionChartsView(props: SessionChartsViewProps): JSX.Element {
  const { countsByHour, outcomeRatios, durationSummary, labelingDurationSummary, stepBreakdown, workerStats, labels } = props

  const outcomePieData = outcomeRatios.map((r) => ({
    name: r.label === 'success' ? labels.outcomeSuccess : r.label === 'retry' ? labels.outcomeRetry : labels.outcomeTimeout,
    value: r.count,
    color: outcomeColors[r.label],
  }))

  const workerColumns: TableColumn<typeof workerStats[number]>[] = [
    { key: 'worker_name', header: labels.worker, render: (r) => r.worker_name },
    { key: 'captures', header: labels.captures, numeric: true, render: (r) => r.capture_count },
    { key: 'labels', header: labels.labels, numeric: true, render: (r) => r.labeling_count },
    { key: 'retakes', header: labels.retakes, numeric: true, render: (r) => r.retake_count },
    { key: 'retakeRate', header: labels.retakeRate, numeric: true, render: (r) => `${(r.retake_rate * 100).toFixed(1)}%` },
  ]

  return (
    <PanelGrid>
      <BarChartCard
        title={labels.captureByHour}
        data={countsByHour}
        xKey="label"
        series={[{ key: 'count', label: labels.count, color: CHART_BLUE }]}
        height={chartHeights.md}
      />
      <PieChartCard
        title={labels.outcomeTitle}
        data={outcomePieData}
        innerRadius={44}
        outerRadius={72}
        paddingAngle={3}
        height={chartHeights.md}
        emptyMessage={labels.noOutcomeStats}
      />
      <Card elevation="raised" flat radius="var(--ig-radius-lg)" padding="var(--ig-space-6) var(--ig-space-7) var(--ig-space-7)" style={{ minHeight: 'var(--ig-layout-panel-min-height)' }}>
        <PanelTitle>{labels.workAndLabelingTime}</PanelTitle>
        <DurationLabel style={{ marginBottom: 'var(--ig-space-4)' }}>{labels.captureWorkTime}</DurationLabel>
        <DurationGrid style={{ marginBottom: 'var(--ig-space-6)' }}>
          {(['average', 'median', 'p95'] as const).map((k) => (
            <Card key={k} elevation="raised" flat radius="var(--ig-radius-sm)" padding="var(--ig-space-5)">
              <DurationLabel>{labels[k]}</DurationLabel>
              <DurationValue>{formatMs(durationSummary[`${k}_ms`])}</DurationValue>
            </Card>
          ))}
        </DurationGrid>
        <DurationLabel style={{ marginBottom: 'var(--ig-space-4)' }}>{labels.labelingTime}</DurationLabel>
        <DurationGrid>
          {(['average', 'median', 'p95'] as const).map((k) => (
            <Card key={k} elevation="raised" flat radius="var(--ig-radius-sm)" padding="var(--ig-space-5)">
              <DurationLabel>{labels[k]}</DurationLabel>
              <DurationValue>{formatMs(labelingDurationSummary[`${k}_ms`])}</DurationValue>
            </Card>
          ))}
        </DurationGrid>
      </Card>
      <BarChartCard
        title={labels.deflectometrySteps}
        data={stepBreakdown}
        xKey="step_key"
        series={[{ key: 'average_ms', label: labels.avgMs, color: CHART_GREEN }]}
        height={chartHeights.md}
        tooltipContent={<MsTooltip />}
        emptyMessage={labels.noDeflectometryData}
      />
      <div style={{ gridColumn: '1 / span 2', minHeight: 0 }}>
        <Card elevation="raised" flat radius="var(--ig-radius-lg)" padding="var(--ig-space-6) var(--ig-space-7) var(--ig-space-7)" style={{ minHeight: 'var(--ig-layout-panel-min-height)' }}>
          <PanelTitle>{labels.workerStats}</PanelTitle>
          {workerStats.length > 0 ? (
            <Table columns={workerColumns} rows={workerStats} ariaLabel={labels.workerStats} />
          ) : (
            <EmptyState>{labels.noWorkerStats}</EmptyState>
          )}
        </Card>
      </div>
    </PanelGrid>
  )
}
