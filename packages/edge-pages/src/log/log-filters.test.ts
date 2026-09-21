import { describe, expect, it } from 'vitest'
import { filterLogEntries, logPassesDateFilter } from './log-filters'

const filters = { datePreset: 'all' as const, dateFrom: '', dateTo: '', showProgress: false, showConnections: false, showDebug: false }
describe('log filtering', () => {
  const logs = [{ msg: 'Capture saved.' }, { msg: 'Broadcasting discovery' }, { msg: 'Connection established' }, { msg: '[DEBUG] trace' }]
  it('filters each optional category and preserves source indices', () => {
    expect(filterLogEntries(logs, filters).map(({ index }) => index)).toEqual([0])
    expect(filterLogEntries(logs, { ...filters, showConnections: true }).map(({ index }) => index)).toEqual([0, 2])
    expect(filterLogEntries(logs, { ...filters, showProgress: true, showConnections: true, showDebug: true })).toHaveLength(4)
  })
  it('uses inclusive local calendar-day bounds for custom dates', () => {
    expect(logPassesDateFilter({ createdAt: '2026-09-20T00:00:00' }, 'custom', '2026-09-20', '2026-09-20')).toBe(true)
    expect(logPassesDateFilter({ createdAt: '2026-09-20T23:59:59' }, 'custom', '2026-09-20', '2026-09-20')).toBe(true)
    expect(logPassesDateFilter({ createdAt: '2026-09-19T23:59:59' }, 'custom', '2026-09-20', '2026-09-20')).toBe(false)
    expect(logPassesDateFilter({}, 'today', '', '')).toBe(false)
  })
})
