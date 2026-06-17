export function statColor(pct: number): string {
  if (pct >= 90) return 'var(--ig-color-danger)'
  if (pct >= 75) return 'var(--ig-color-warning)'
  return 'var(--ig-color-text-muted)'
}

export function fmtPct(pct: number | undefined): string {
  return pct != null ? `${pct}%` : '—'
}
