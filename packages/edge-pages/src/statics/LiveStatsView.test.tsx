import { describe, expect, it, vi } from 'vitest'
import { fireEvent, render, screen } from '@testing-library/react'
import { LiveStatsView } from './LiveStatsView'
import type { LiveStats, LiveStatsLabels } from './types'

const L: LiveStatsLabels = {
  section: 'Live status', loading: 'Loading', note: (t) => `last ${t}`,
  range: { hour: '1 hour', day: '1 day', week: '1 week' }, rangeAriaLabel: 'Range',
  todayAuto: 'Auto today', todayManual: 'Manual today', totalSub: (s, i) => `Total ${s} · ${i}`,
  errorsToday: 'Errors today', autoCapture: 'Auto time', manualCapture: 'Manual time',
  durationSub: (a, p, n) => `avg ${a} p95 ${p} n ${n}`, plc: (l) => `PLC p95 (limit ${l})`,
  plcSub: (a, o, n) => `avg ${a} over ${o}/${n}`, memory: 'Memory', memorySub: (m, r, b) => `${m}/${r}/${b}`,
  disk: 'Disk', diskSub: (p, d) => `${p}/day ${d} days`, autoChart: 'Auto chart', manualChart: 'Manual chart',
  memoryChart: 'Memory chart', seriesAuto: 'Auto', seriesManual: 'Manual', seriesPlc: 'PLC',
  seriesMain: 'Main', seriesRenderer: 'Renderer', seriesBackend: 'Backend',
}
const count = { sequences: 0, images: 0 }
const dur = { count: 0, avg_ms: null, median_ms: null, p95_ms: null }
const S: LiveStats = {
  generated_at: '2026-11-02T09:00:00.000Z', range_ms: 3_600_000,
  today: { auto: { sequences: 412, images: 13596 }, manual: count, unknown: count }, total: { auto: { sequences: 8214, images: 271062 }, manual: count, unknown: count },
  errors_today: 0, capture: { auto: { count: 412, avg_ms: 2140, median_ms: 2080, p95_ms: 2610 }, manual: dur },
  plc: { count: 412, avg_s: 2.31, p95_s: 2.48, over_limit: 3, limit_s: 2.5 },
  recent: [], samples: [], disk: { free_gb: 214, used_per_day_gb: 9.6, days_left: 2 },
}

describe('LiveStatsView', () => {
  it('shows only the header and range switch while loading', () => {
    render(<LiveStatsView stats={null} range="hour" labels={L} onRangeChange={() => undefined} />)
    expect(screen.getByText('Loading')).toBeInTheDocument()
    expect(screen.queryByText('Auto today')).not.toBeInTheDocument()
  })
  it('renders the cards, flags PLC over limit and low disk, and reports range changes', () => {
    const onRangeChange = vi.fn()
    render(<LiveStatsView stats={S} range="hour" labels={L} onRangeChange={onRangeChange} formatTime={() => '09:00:00'} />)
    expect(screen.getByText('last 09:00:00')).toBeInTheDocument()
    expect(screen.getByText('412')).toBeInTheDocument()
    expect(screen.getByText('2.08')).toBeInTheDocument()
    const warned = [...document.querySelectorAll('[data-live-warn="true"]')].map((e) => e.textContent)
    expect(warned.some((t) => t?.includes('PLC p95'))).toBe(true)
    expect(warned.some((t) => t?.includes('Disk'))).toBe(true)
    expect(warned.some((t) => t?.includes('Errors today'))).toBe(false)
    expect(screen.queryByText('Auto chart')).not.toBeInTheDocument()
    fireEvent.click(screen.getByRole('radio', { name: '1 day' }))
    expect(onRangeChange).toHaveBeenCalledWith('day')
  })
})
