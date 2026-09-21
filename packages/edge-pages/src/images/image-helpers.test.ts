import { describe, expect, it } from 'vitest'
import { buildGroups, imagePassesDateFilter, type ImageItem } from './image-helpers'

const image = (id: string, capturedAt?: string): ImageItem => ({ id, capturedAt, src: '', fullSrc: '', label: id })
const now = new Date(2026, 4, 20, 23, 59, 59)

describe('image date filtering', () => {
  it('uses an injectable clock and rejects missing, invalid and future captures', () => {
    expect(imagePassesDateFilter(image('today', new Date(2026, 4, 20, 12).toISOString()), 'today', '', '', now)).toBe(true)
    expect(imagePassesDateFilter(image('missing'), 'today', '', '', now)).toBe(false)
    expect(imagePassesDateFilter(image('invalid', 'invalid'), 'last7', '', '', now)).toBe(false)
    expect(imagePassesDateFilter(image('future', new Date(2026, 4, 22).toISOString()), 'last30', '', '', now)).toBe(false)
    expect(imagePassesDateFilter(image('missing'), 'all', '', '', now)).toBe(true)
  })
  it('includes both local calendar-day boundaries and rejects reversed ranges', () => {
    const first = image('first', new Date(2026, 4, 19, 0, 0).toISOString())
    const last = image('last', new Date(2026, 4, 20, 23, 59, 59, 999).toISOString())
    expect(imagePassesDateFilter(first, 'custom', '2026-05-19', '2026-05-20', now)).toBe(true)
    expect(imagePassesDateFilter(last, 'custom', '2026-05-19', '2026-05-20', now)).toBe(true)
    expect(imagePassesDateFilter(first, 'custom', '2026-05-20', '2026-05-19', now)).toBe(false)
  })
  it('groups actual local members rather than inventing fixture counts', () => {
    const items = [0, 1, 2].map((step) => ({ ...image(String(step)), sequenceId: 'sequence', sequenceStep: step }))
    const groups = buildGroups(items, null)
    expect(groups.displayItems).toHaveLength(1)
    expect(groups.sequenceGroupMap.get('sequence')).toHaveLength(3)
    expect(groups.displayItems[0].id).toBe('2')
  })
})
