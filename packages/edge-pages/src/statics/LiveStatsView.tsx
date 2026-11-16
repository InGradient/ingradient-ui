import { Card, LineChartCard, SegmentedControl } from '@ingradient/ui'
import { Inline, Text } from '@ingradient/ui/primitives'
import { ChartGrid, LiveGrid, LiveHead, SummaryLabel } from './StaticsView.styles'
import type { LiveCount, LiveDuration, LiveRange, LiveStatsViewProps } from './types'

const RANGES: LiveRange[] = ['hour', 'day', 'week']
const CHART_HEIGHT = 200

const sec = (ms: number | null): string => (ms == null ? '—' : (ms / 1000).toFixed(2))
const num = (n: number): string => n.toLocaleString()
const pad = (n: number): string => String(n).padStart(2, '0')
const defaultTime = (iso: string): string => {
  const d = new Date(iso)
  return `${pad(d.getHours())}:${pad(d.getMinutes())}:${pad(d.getSeconds())}`
}

/** Bucket start on the x axis: H:MM up to a day, M/D H for a week. */
function axisLabel(iso: string, range: LiveRange): string {
  const d = new Date(iso)
  return range === 'week' ? `${d.getMonth() + 1}/${d.getDate()} ${pad(d.getHours())}h` : `${pad(d.getHours())}:${pad(d.getMinutes())}`
}

/** Empty buckets stay as points without values, so the line breaks instead of joining distant times. */
function point(time: string, values: Record<string, number | null>): Record<string, string | number> {
  const out: Record<string, string | number> = { time }
  for (const [k, v] of Object.entries(values)) if (v != null) out[k] = v
  return out
}
const hasAny = (rows: Record<string, string | number>[]): boolean => rows.some((r) => Object.keys(r).length > 1)

function LiveCard({ label, value, sub, warn }: { label: string; value: string; sub?: string; warn?: boolean }) {
  return (
    <Card elevation="raised" flat tone={warn ? 'danger' : 'default'} padding="var(--ig-spacing-12) var(--ig-spacing-16)"
      data-live-warn={warn ? 'true' : undefined}>
      <SummaryLabel>{label}</SummaryLabel>
      <Text as="div" size="var(--ig-text-title)" weight="bold" tabularNums>{value}</Text>
      {sub && <Text as="div" size="var(--ig-text-micro)" tone="soft" tabularNums>{sub}</Text>}
    </Card>
  )
}

/**
 * Live status at the top of Statics: today's capture counts, capture speed, PLC response, memory and disk,
 * plus trend charts over the selected range. Data and refresh belong to the caller.
 */
export function LiveStatsView({ stats: s, range, labels: l, onRangeChange, formatTime = defaultTime, formatAxis = axisLabel }: LiveStatsViewProps): JSX.Element {
  const head = (
    <LiveHead>
      <Text as="div" size="var(--ig-text-micro)" tone="soft">{s ? l.note(formatTime(s.generated_at)) : l.loading}</Text>
      <Inline gap="var(--ig-spacing-8)" wrap="nowrap" role="group" aria-label={l.rangeAriaLabel}>
        <SegmentedControl size="sm" value={range} onChange={(v) => onRangeChange(v as LiveRange)}
          options={RANGES.map((r) => ({ value: r, label: l.range[r] }))} />
      </Inline>
    </LiveHead>
  )
  if (!s) return head

  const countSub = (c: LiveCount) => l.totalSub(num(c.sequences), num(c.images))
  const durSub = (d: LiveDuration) => l.durationSub(sec(d.avg_ms), sec(d.p95_ms), d.count)
  // Auto (~2 s) and manual (~30 s) differ in scale; one chart would flatten the auto line, so they are split.
  const autoData = s.recent.map((p) => point(formatAxis(p.at, range), { auto: p.auto_s, plc: p.plc_s }))
  const manualData = s.recent.map((p) => point(formatAxis(p.at, range), { manual: p.manual_s }))
  const memData = s.samples.map((m) => point(formatAxis(m.at, range), { main: m.main_mb, renderer: m.renderer_mb, backend: m.backend_mb }))
  const last = s.samples[s.samples.length - 1]
  const mb = (v: number | null | undefined) => (v == null ? '—' : String(v))

  return (
    <>
      {head}
      <LiveGrid>
        <LiveCard label={l.todayAuto} value={num(s.today.auto.sequences)} sub={countSub(s.total.auto)} />
        <LiveCard label={l.todayManual} value={num(s.today.manual.sequences)} sub={countSub(s.total.manual)} />
        <LiveCard label={l.errorsToday} value={num(s.errors_today)} warn={s.errors_today > 0} />
        <LiveCard label={l.autoCapture} value={sec(s.capture.auto.median_ms)} sub={durSub(s.capture.auto)} />
        <LiveCard label={l.manualCapture} value={sec(s.capture.manual.median_ms)} sub={durSub(s.capture.manual)} />
        <LiveCard label={l.plc(s.plc.limit_s)} value={s.plc.p95_s == null ? '—' : s.plc.p95_s.toFixed(2)}
          sub={l.plcSub(s.plc.avg_s == null ? '—' : String(s.plc.avg_s), s.plc.over_limit, s.plc.count)} warn={s.plc.over_limit > 0} />
        <LiveCard label={l.memory}
          value={last ? String(Math.round((last.main_mb ?? 0) + (last.renderer_mb ?? 0) + (last.backend_mb ?? 0))) : '—'}
          sub={last ? l.memorySub(mb(last.main_mb), mb(last.renderer_mb), mb(last.backend_mb)) : undefined} />
        <LiveCard label={l.disk} value={s.disk.free_gb == null ? '—' : num(s.disk.free_gb)}
          sub={s.disk.days_left == null ? undefined : l.diskSub(String(s.disk.used_per_day_gb ?? '—'), String(s.disk.days_left))}
          warn={s.disk.days_left != null && s.disk.days_left < 3} />
      </LiveGrid>
      <ChartGrid>
        {hasAny(autoData) && (
          <LineChartCard title={l.autoChart} data={autoData} xKey="time" height={CHART_HEIGHT}
            series={[{ key: 'auto', label: l.seriesAuto, color: 'var(--ig-color-accent)' }, { key: 'plc', label: l.seriesPlc, color: 'var(--ig-color-warning)' }]} />
        )}
        {hasAny(manualData) && (
          <LineChartCard title={l.manualChart} data={manualData} xKey="time" height={CHART_HEIGHT}
            series={[{ key: 'manual', label: l.seriesManual, color: 'var(--ig-color-success)' }]} />
        )}
        {hasAny(memData) && (
          <LineChartCard title={l.memoryChart} data={memData} xKey="time" height={CHART_HEIGHT}
            series={[
              { key: 'main', label: l.seriesMain, color: 'var(--ig-color-accent)' },
              { key: 'renderer', label: l.seriesRenderer, color: 'var(--ig-color-success)' },
              { key: 'backend', label: l.seriesBackend, color: 'var(--ig-color-warning)' },
            ]} />
        )}
      </ChartGrid>
    </>
  )
}
