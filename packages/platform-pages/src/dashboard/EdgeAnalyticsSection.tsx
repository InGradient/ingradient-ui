import { chartHeights } from '@ingradient/ui'
import { BarChartCard, PieChartCard } from '@ingradient/ui/patterns'
import { chartColors } from '@ingradient/ui'
import { formatDurationMs } from '@ingradient/ui/utils'
import { Table, type TableColumn } from '@ingradient/ui/components'
import {
  CHART_COLORS,
  Card,
  CardHead,
  CardTitle,
  EdgeSection,
  Empty,
  StatLabel,
  StatRow,
  StatValue,
} from './analysis-section.styles'
import type { EdgeAnalyticsView, EdgeWorkerStat } from './edge-analytics-types'

const WORKER_COLUMNS: TableColumn<EdgeWorkerStat>[] = [
  { key: 'worker', header: 'Worker', render: (row) => row.worker_name },
  { key: 'captures', header: 'Captures', numeric: true, render: (row) => row.capture_count.toLocaleString() },
  { key: 'labels', header: 'Labels', numeric: true, render: (row) => row.labeling_count.toLocaleString() },
  { key: 'retries', header: 'Retries', numeric: true, render: (row) => row.retry_count.toLocaleString() },
]

export interface EdgeAnalyticsSectionProps {
  edgeAnalytics: EdgeAnalyticsView
}

/**
 * Dashboard 하단의 Edge analytics 섹션.
 * - Edge session summary 카드 (capture/labeling sessions + average duration)
 * - outcome PieChart
 * - worker activity Table
 * - step duration BarChart
 * - labeling class distribution BarChart
 */
export function EdgeAnalyticsSection({ edgeAnalytics }: EdgeAnalyticsSectionProps) {
  const outcomeData = edgeAnalytics.outcome_ratios.map((entry, i) => ({
    name: entry.label,
    value: entry.count,
    color: CHART_COLORS[i % CHART_COLORS.length],
  }))
  const stepData = edgeAnalytics.step_breakdown.map((entry) => ({
    name: entry.step_key,
    duration: Math.round(entry.average_ms ?? 0),
  }))

  return (
    <EdgeSection>
      <Card>
        <CardHead>
          <CardTitle>Edge session summary</CardTitle>
        </CardHead>
        <StatRow>
          <StatLabel>Capture sessions</StatLabel>
          <StatValue>{edgeAnalytics.summary.total_capture_sessions.toLocaleString()}</StatValue>
        </StatRow>
        <StatRow>
          <StatLabel>Labeling sessions</StatLabel>
          <StatValue>{edgeAnalytics.summary.total_labeling_sessions.toLocaleString()}</StatValue>
        </StatRow>
        <StatRow>
          <StatLabel>Capture average</StatLabel>
          <StatValue>{formatDurationMs(edgeAnalytics.capture_duration.average_ms)}</StatValue>
        </StatRow>
        <StatRow>
          <StatLabel>Labeling average</StatLabel>
          <StatValue>{formatDurationMs(edgeAnalytics.labeling_duration.average_ms)}</StatValue>
        </StatRow>
      </Card>

      <PieChartCard
        title="Edge outcomes"
        data={outcomeData}
        height={chartHeights.md}
        innerRadius={48}
        outerRadius={80}
        paddingAngle={3}
        emptyMessage="No outcome data yet."
      />

      <Card>
        <CardHead>
          <CardTitle>Edge worker activity</CardTitle>
        </CardHead>
        {edgeAnalytics.worker_stats.length === 0 ? (
          <Empty>No Edge worker stats yet.</Empty>
        ) : (
          <Table columns={WORKER_COLUMNS} rows={edgeAnalytics.worker_stats} ariaLabel="Edge worker activity" />
        )}
      </Card>

      <BarChartCard
        title="Deflectometry step duration"
        data={stepData}
        xKey="name"
        series={[{ key: 'duration', label: 'Average (ms)', color: chartColors.green }]}
        height={chartHeights.md}
        emptyMessage="No Edge step timings yet."
      />

      <div style={{ gridColumn: '1 / -1' }}>
        <BarChartCard
          title="Edge labeling class distribution"
          data={edgeAnalytics.labeling_class_distribution.map((entry) => ({
            name: entry.name,
            count: entry.count,
            color: entry.color,
          }))}
          xKey="name"
          series={[{ key: 'count', label: 'Count' }]}
          layout="vertical"
          height={chartHeights.xl}
          getCellColor={(row) => (row as { color: string }).color}
          emptyMessage="No Edge labeling class stats yet."
        />
      </div>
    </EdgeSection>
  )
}
