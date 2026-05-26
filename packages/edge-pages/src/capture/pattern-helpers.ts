import type { DeflectometryConfigState } from './types'

const KNOWN_LABEL_TO_UI: Record<string, string> = {
  x_orig: 'X Orig',
  x_shift: 'X Shift',
  y_orig: 'Y Orig',
  y_shift: 'Y Shift',
  solid: 'Solid',
  black: 'Black',
  focus_peaking: 'Focus Peaking',
  derived_gradient_x: 'Gradient X',
  derived_gradient_y: 'Gradient Y',
  derived_modulation: 'Modulation',
}

export function buildPatternLabels(cfg: DeflectometryConfigState): string[] {
  const labels: string[] = []
  const n = Math.max(2, Math.min(16, cfg.phase_shift_count))
  const dirs = cfg.capture_directions
  if (dirs === 'x_only' || dirs === 'both') {
    if (n === 2) labels.push('x_orig', 'x_shift')
    else for (let i = 0; i < n; i++) labels.push(`x_phase_${i}_of_${n}`)
  }
  if (dirs === 'y_only' || dirs === 'both') {
    if (n === 2) labels.push('y_orig', 'y_shift')
    else for (let i = 0; i < n; i++) labels.push(`y_phase_${i}_of_${n}`)
  }
  if (cfg.include_solid) labels.push('solid')
  if (cfg.include_black) labels.push('black')
  return labels
}

export function patternLabelToUI(label: string): string {
  if (KNOWN_LABEL_TO_UI[label]) return KNOWN_LABEL_TO_UI[label]
  const m = label.match(/^([xy])_phase_(\d+)_of_(\d+)$/)
  if (m) return `${m[1].toUpperCase()} Phase ${Number(m[2]) + 1}/${m[3]}`
  return label
}

export function isDerivedPattern(label: string | null | undefined): boolean {
  return !!label && label.startsWith('derived_')
}

export const DERIVED_ORDER: readonly string[] = [
  'derived_gradient_x',
  'derived_gradient_y',
  'derived_modulation',
]

export function computeTotalPatterns(cfg: DeflectometryConfigState): number {
  let total = 0
  if (cfg.capture_directions === 'both') total += cfg.phase_shift_count * 2
  else total += cfg.phase_shift_count
  if (cfg.include_solid) total += 1
  if (cfg.include_black) total += 1
  return total
}

export function sortOriginalPatterns<T extends { patternLabel?: string | null; sequenceStep?: number | null }>(items: T[]): T[] {
  const rank = (label?: string | null): number => {
    if (label === 'solid') return 0
    if (label === 'black') return 1
    return 2
  }
  return [...items].sort((a, b) => {
    const ra = rank(a.patternLabel)
    const rb = rank(b.patternLabel)
    if (ra !== rb) return ra - rb
    return (a.sequenceStep ?? 0) - (b.sequenceStep ?? 0)
  })
}

export function sortDerivedPatterns<T extends { patternLabel?: string | null }>(items: T[]): T[] {
  const indexOf = (label?: string | null): number => {
    if (!label) return DERIVED_ORDER.length
    const i = DERIVED_ORDER.indexOf(label)
    return i >= 0 ? i : DERIVED_ORDER.length
  }
  return [...items].sort((a, b) => {
    const ia = indexOf(a.patternLabel)
    const ib = indexOf(b.patternLabel)
    if (ia !== ib) return ia - ib
    return (a.patternLabel ?? '').localeCompare(b.patternLabel ?? '')
  })
}

export function patternLabelToHintKey(label: string | null | undefined): string | null {
  if (!label) return null
  if (label.startsWith('derived_gradient_')) return 'tuning.patternHint.gradient'
  if (label === 'derived_modulation') return 'tuning.patternHint.modulation'
  if (label === 'solid') return 'tuning.patternHint.solid'
  if (label === 'black') return 'tuning.patternHint.black'
  if (label.startsWith('x_phase_') || label.startsWith('y_phase_')) return 'tuning.patternHint.phase'
  if (label === 'x_orig' || label === 'x_shift' || label === 'y_orig' || label === 'y_shift') {
    return 'tuning.patternHint.phase'
  }
  return null
}
