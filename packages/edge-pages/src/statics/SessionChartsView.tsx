import { BarChartCard, PieChartCard } from '@ingradient/ui/patterns'
import { PanelGrid, Panel, PanelTitle } from './StaticsView.styles'
import {
  DurationGrid, DurationCard, DurationLabel, DurationValue,
  Table, Th, Td,
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
      borderRadius: 6,
      padding: '8px 10px',
      color: 'var(--ig-color-text-primary)',
      fontSize: 12,
    }}>
      <div style={{ fontWeight: 700, marginBottom: 4 }}>{label}</div>
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

  return (
    <PanelGrid>
      <BarChartCard
        title={labels.captureByHour}
        data={countsByHour}
        xKey="label"
        series={[{ key: 'count', label: labels.count, color: CHART_BLUE }]}
        height={240}
      />
      <PieChartCard
        title={labels.outcomeTitle}
        data={outcomePieData}
        innerRadius={44}
        outerRadius={72}
        paddingAngle={3}
        height={240}
        emptyMessage={labels.noOutcomeStats}
      />
      <Panel>
        <PanelTitle>{labels.workAndLabelingTime}</PanelTitle>
        <DurationLabel style={{ marginBottom: 10 }}>{labels.captureWorkTime}</DurationLabel>
        <DurationGrid style={{ marginBottom: 14 }}>
          {(['average', 'median', 'p95'] as const).map((k) => (
            <DurationCard key={k}>
              <DurationLabel>{labels[k]}</DurationLabel>
              <DurationValue>{formatMs(durationSummary[`${k}_ms`])}</DurationValue>
            </DurationCard>
          ))}
        </DurationGrid>
        <DurationLabel style={{ marginBottom: 10 }}>{labels.labelingTime}</DurationLabel>
        <DurationGrid>
          {(['average', 'median', 'p95'] as const).map((k) => (
            <DurationCard key={k}>
              <DurationLabel>{labels[k]}</DurationLabel>
              <DurationValue>{formatMs(labelingDurationSummary[`${k}_ms`])}</DurationValue>
            </DurationCard>
          ))}
        </DurationGrid>
      </Panel>
      <BarChartCard
        title={labels.deflectometrySteps}
        data={stepBreakdown}
        xKey="step_key"
        series={[{ key: 'average_ms', label: labels.avgMs, color: CHART_GREEN }]}
        height={240}
        tooltipContent={<MsTooltip />}
        emptyMessage={labels.noDeflectometryData}
      />
      <div style={{ gridColumn: '1 / span 2', minHeight: 0 }}>
        <Panel>
          <PanelTitle>{labels.workerStats}</PanelTitle>
          {workerStats.length > 0 ? (
            <Table>
              <thead>
                <tr>
                  <Th>{labels.worker}</Th>
                  <Th>{labels.captures}</Th>
                  <Th>{labels.labels}</Th>
                  <Th>{labels.retakes}</Th>
                  <Th>{labels.retakeRate}</Th>
                </tr>
              </thead>
              <tbody>
                {workerStats.map((r) => (
                  <tr key={r.worker_id ?? r.worker_name}>
                    <Td>{r.worker_name}</Td>
                    <Td>{r.capture_count}</Td>
                    <Td>{r.labeling_count}</Td>
                    <Td>{r.retake_count}</Td>
                    <Td>{(r.retake_rate * 100).toFixed(1)}%</Td>
                  </tr>
                ))}
              </tbody>
            </Table>
          ) : (
            <div style={{ color: 'var(--ig-color-text-muted)', fontSize: 'var(--ig-font-size-sm)', padding: '24px 0', textAlign: 'center' }}>
              {labels.noWorkerStats}
            </div>
          )}
        </Panel>
      </div>
    </PanelGrid>
  )
}
