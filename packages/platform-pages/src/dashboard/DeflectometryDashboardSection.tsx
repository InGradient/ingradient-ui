import { BarChartCard } from '@ingradient/ui/components'
import { formatDurationMs } from '@ingradient/ui/utils'
import {
  Card,
  CardHead,
  CardTitle,
  EdgeSection,
  StatLabel,
  StatRow,
  StatValue,
} from './analysis-section.styles'
import type { EdgeAnalyticsView } from './edge-analytics-types'

export interface DeflectometryDashboardSectionProps {
  edgeAnalytics: EdgeAnalyticsView
}

/**
 * Deflectometry 활성 프로젝트의 Dashboard 하단 섹션.
 * - sequence steps 수, 평균 sequence 시간, capture session 수 요약
 * - step_breakdown 의 average_ms 를 BarChart 로 시각화
 */
export function DeflectometryDashboardSection({
  edgeAnalytics,
}: DeflectometryDashboardSectionProps) {
  const stepBreakdown = edgeAnalytics.step_breakdown ?? []
  const totalSteps = stepBreakdown.length
  const totalSequenceMs = stepBreakdown.reduce((sum, step) => sum + (step.average_ms ?? 0), 0)
  const chartData = stepBreakdown.map((step) => ({
    name: step.step_key,
    duration: Math.round(step.average_ms ?? 0),
  }))

  return (
    <EdgeSection>
      <Card>
        <CardHead>
          <CardTitle>Deflectometry summary</CardTitle>
        </CardHead>
        <StatRow>
          <StatLabel>Sequence steps tracked</StatLabel>
          <StatValue>{totalSteps.toLocaleString()}</StatValue>
        </StatRow>
        <StatRow>
          <StatLabel>Avg total sequence time</StatLabel>
          <StatValue>{totalSteps > 0 ? formatDurationMs(totalSequenceMs) : '—'}</StatValue>
        </StatRow>
        <StatRow>
          <StatLabel>Capture sessions</StatLabel>
          <StatValue>{edgeAnalytics.summary.total_capture_sessions.toLocaleString()}</StatValue>
        </StatRow>
      </Card>

      <div style={{ gridColumn: '1 / -1' }}>
        <BarChartCard
          title="Deflectometry step timing"
          data={chartData}
          xKey="name"
          series={[{ key: 'duration', label: 'Average (ms)', color: '#60a5fa' }]}
          height={280}
          emptyMessage="No deflectometry sequence data yet."
        />
      </div>
    </EdgeSection>
  )
}
