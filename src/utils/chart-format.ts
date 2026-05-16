/**
 * Recharts Tooltip 의 `formatter` prop 호환 — 값을 toLocaleString 으로 포맷.
 * Returns [valueString, suffix] tuple.
 */
export function formatTooltipValue(
  value: number | string | readonly (number | string)[] | undefined,
  suffix = '',
): [string, string] {
  const rawValue = Array.isArray(value) ? value[0] : value
  const numericValue = typeof rawValue === 'number' ? rawValue : Number(rawValue ?? 0)
  return [numericValue.toLocaleString(), suffix]
}

/**
 * ms 단위 duration 을 `123 ms` 또는 `1.23 s` 로 포맷. null/NaN 은 em-dash.
 */
export function formatDurationMs(value: number | null | undefined): string {
  if (typeof value !== 'number' || Number.isNaN(value)) return '—'
  if (value < 1000) return `${Math.round(value)} ms`
  return `${(value / 1000).toFixed(2)} s`
}
