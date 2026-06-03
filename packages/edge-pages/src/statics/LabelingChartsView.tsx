import { chartHeights } from '@ingradient/ui'
import { iconSizeNumbers } from '@ingradient/ui'
import { useMemo } from 'react'
import { DropdownSelect } from '@ingradient/ui/components'
import { BarChartCard } from '@ingradient/ui/patterns'
import { PanelGrid } from './StaticsView.styles'
import { CHART_BLUE, CHART_GREEN, CHART_PURPLE, CHART_LEGEND_FALLBACK } from './chart-helpers'
import { buildClassTrend } from './trend-helpers'
import type { LabelingChartsViewProps, TrendMode } from './types'

interface TooltipPayload {
  dataKey?: string | number
  name?: string | number
  value?: string | number
  color?: string
}

function TrendTooltip({ active, label, payload }: { active?: boolean; label?: string | number; payload?: TooltipPayload[] }): JSX.Element | null {
  if (!active) return null
  const visible = (payload ?? []).filter((item) => Number(item.value ?? 0) > 0)
  if (visible.length === 0) return null
  return (
    <div style={{
      background: 'var(--ig-color-surface-raised)',
      border: 'var(--ig-border-1px) solid var(--ig-color-border-strong)',
      borderRadius: 'var(--ig-radius-sm)',
      padding: 'var(--ig-space-3) var(--ig-space-4)',
      color: 'var(--ig-color-text-primary)',
      fontSize: iconSizeNumbers.xs,
      boxShadow: '0 var(--ig-space-3) var(--ig-space-11) rgba(0,0,0,0.35)',
    }}>
      <div style={{ fontWeight: 700, marginBottom: 'var(--ig-space-2)' }}>{label}</div>
      {visible.map((item) => (
        <div key={String(item.dataKey ?? item.name)} style={{ display: 'flex', alignItems: 'center', gap: 'var(--ig-space-3)', lineHeight: 1.6 }}>
          <span style={{ width: 8, height: 'var(--ig-space-3)', borderRadius: 999, background: item.color ?? CHART_LEGEND_FALLBACK }} />
          <span>{item.name}</span>
          <span style={{ marginLeft: 'var(--ig-space-3)', fontWeight: 700 }}>{Number(item.value)}</span>
        </div>
      ))}
    </div>
  )
}

function AvgSizeTooltip({ active, label, payload }: { active?: boolean; label?: string | number; payload?: TooltipPayload[] }): JSX.Element | null {
  if (!active || !payload?.length) return null
  return (
    <div style={{
      background: 'var(--ig-color-surface-raised)',
      border: 'var(--ig-border-1px) solid var(--ig-color-border-strong)',
      borderRadius: 'var(--ig-radius-sm)',
      padding: 'var(--ig-space-3) var(--ig-space-4)',
      color: 'var(--ig-color-text-primary)',
      fontSize: iconSizeNumbers.xs,
    }}>
      <div style={{ fontWeight: 700, marginBottom: 'var(--ig-space-2)' }}>{label}</div>
      {payload.map((item) => {
        const display = item.dataKey === 'avg_w' ? 'Width' : 'Height'
        return (
          <div key={String(item.dataKey)} style={{ display: 'flex', justifyContent: 'space-between', gap: 12 }}>
            <span>{display}</span>
            <span style={{ fontWeight: 600 }}>{Number(item.value).toFixed(1)}px</span>
          </div>
        )
      })}
    </div>
  )
}

export function LabelingChartsView(props: LabelingChartsViewProps): JSX.Element {
  const { data, images, classes, trendMode, labels, onTrendModeChange } = props

  const trendClasses = useMemo(() => {
    const byId = new Map(classes.map((klass) => [klass.class_id, klass]))
    for (const image of images) {
      for (const bbox of image.bboxes ?? []) {
        if (!byId.has(bbox.classId)) {
          byId.set(bbox.classId, { class_id: bbox.classId, class_name: bbox.classId, color: 'var(--ig-color-text-muted)' })
        }
      }
    }
    return [...byId.values()]
  }, [classes, images])

  const trendData = useMemo(() => buildClassTrend(images, trendClasses, trendMode), [images, trendClasses, trendMode])
  const visibleTrendClasses = useMemo(
    () => trendClasses.filter((klass) => trendData.some((row) => Number(row[klass.class_id] ?? 0) > 0)),
    [trendClasses, trendData],
  )
  const trendSeries = useMemo(
    () => visibleTrendClasses.map((klass) => ({ key: klass.class_id, label: klass.class_name, color: klass.color })),
    [visibleTrendClasses],
  )

  const trendOptions = [
    { value: 'daily7', label: labels.trendDaily7 },
    { value: 'daily14', label: labels.trendDaily14 },
    { value: 'weeklyMonth', label: labels.trendWeeklyMonth },
  ]

  return (
    <PanelGrid>
      <BarChartCard
        title={labels.classLabelingTrend}
        data={visibleTrendClasses.length > 0 ? trendData : []}
        xKey="label"
        series={trendSeries}
        stacked
        height={chartHeights.xl}
        tooltipContent={<TrendTooltip />}
        headerExtra={
          <div style={{ width: 180 }}>
            <DropdownSelect value={trendMode} options={trendOptions} onChange={(value) => onTrendModeChange(value as TrendMode)} />
          </div>
        }
        emptyMessage={labels.noLabelingData}
      />
      <BarChartCard
        title={labels.classBboxCount}
        data={data.class_bbox_counts}
        xKey="class_name"
        series={[{ key: 'count', label: labels.count }]}
        layout="vertical"
        getCellColor={(d) => d.color}
        height={Math.max(240, data.class_bbox_counts.length * 36)}
        emptyMessage={labels.noLabelingData}
      />
      <BarChartCard
        title={labels.classImageCount}
        data={data.class_image_counts}
        xKey="class_name"
        series={[{ key: 'image_count', label: labels.images }]}
        layout="vertical"
        getCellColor={(d) => d.color}
        height={Math.max(240, data.class_image_counts.length * 36)}
        emptyMessage={labels.noLabelingData}
      />
      <BarChartCard
        title={labels.bboxPerImageDist}
        data={data.bbox_per_image_distribution}
        xKey="bucket"
        series={[{ key: 'count', label: labels.count, color: CHART_PURPLE }]}
        height={chartHeights.md}
        emptyMessage={labels.noLabelingData}
      />
      <BarChartCard
        title={labels.classAvgBboxSize}
        data={data.class_avg_size}
        xKey="class_name"
        series={[
          { key: 'avg_w', label: 'Width', color: CHART_BLUE },
          { key: 'avg_h', label: 'Height', color: CHART_GREEN },
        ]}
        layout="vertical"
        height={Math.max(240, data.class_avg_size.length * 36)}
        tooltipContent={<AvgSizeTooltip />}
        emptyMessage={labels.noLabelingData}
      />
    </PanelGrid>
  )
}
