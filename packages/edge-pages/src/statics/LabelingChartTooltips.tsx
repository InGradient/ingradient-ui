import { ChartTooltipContent, ColorSwatch, KeyValueRow, TooltipCard } from '@ingradient/ui/components'
import { CHART_LEGEND_FALLBACK } from './chart-helpers'

interface TooltipPayload {
  dataKey?: string | number
  name?: string | number
  value?: string | number
  color?: string
}
interface TooltipProps {
  active?: boolean
  label?: string | number
  payload?: TooltipPayload[]
}

export function TrendTooltip({ active, label, payload }: TooltipProps): JSX.Element | null {
  if (!active) return null
  const visible = (payload ?? []).filter((item) => Number(item.value ?? 0) > 0)
  if (!visible.length) return null
  // ChartTooltipContent currently ignores payload.color and only accepts string
  // labels. Compose its same shared shell/rows to retain per-class color swatches
  // without changing the generic component API or overriding its private CSS.
  return <TooltipCard>
    {label != null && <div style={{ marginBottom: 'var(--ig-space-3)', fontSize: 'var(--ig-font-size-xs)', fontWeight: 'var(--ig-font-weight-bold)', color: 'var(--ig-color-text-primary)' }}>{label}</div>}
    {visible.map((item, index) => <KeyValueRow key={`${item.dataKey ?? item.name}-${index}`}
      label={<span style={{ display: 'inline-flex', alignItems: 'center', gap: 'var(--ig-space-3)' }}>
        <ColorSwatch aria-hidden $size="xs" $color={item.color ?? CHART_LEGEND_FALLBACK} />{item.name}
      </span>} value={Number(item.value)} />)}
  </TooltipCard>
}

export function AvgSizeTooltip({ active, label, payload }: TooltipProps): JSX.Element | null {
  return <ChartTooltipContent active={active} label={label == null ? undefined : String(label)} payload={payload?.map((item) => ({
    name: item.dataKey === 'avg_w' ? 'Width' : 'Height',
    value: `${Number(item.value).toFixed(1)}px`,
  }))} />
}
