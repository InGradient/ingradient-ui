const PATTERN_RE = /^([xy])_phase_(\d+)_of_(\d+)$/

export interface FormatPatternTabItem {
  name?: string | null
  pattern_label?: string | null
}

/**
 * Platform 의 sequence pattern 라벨 → 사람이 읽는 형식.
 * - `x_phase_2_of_5` → `X 3/5`
 * - `solid` → `Solid`
 * - `black` → `Black`
 * - 그 외 → item.name 또는 `#{index+1}`
 */
export function formatPatternTab(item: FormatPatternTabItem, index: number): string {
  const label = item.pattern_label
  if (!label) return item.name ?? `#${index + 1}`
  if (label === 'solid') return 'Solid'
  if (label === 'black') return 'Black'
  const match = label.match(PATTERN_RE)
  if (match) return `${match[1].toUpperCase()} ${Number(match[2]) + 1}/${match[3]}`
  return label
}
