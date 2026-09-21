import { describe, expect, it } from 'vitest'
import { toBboxes, toDrawingObjects } from './canvas-helpers'

describe('canvas class identity', () => {
  const boxes = [{ classId: 'first', x: 0, y: 0, w: 0.2, h: 0.2 }, { classId: 'second', x: 0.3, y: 0.3, w: 0.2, h: 0.2 }]
  it('keeps the surviving class after a preceding rectangle is removed', () => {
    const objects = toDrawingObjects(boxes, {}).slice(1)
    expect(toBboxes(objects, boxes, 'third')[0].classId).toBe('second')
  })
  it('preserves classes for stable hook-generated IDs during later edits', () => {
    const previous = toDrawingObjects(boxes, {}).map((object, index) => ({ ...object, id: `drawing-${index}` }))
    expect(toBboxes(previous.slice(1), boxes, 'third', previous)[0].classId).toBe('second')
  })
  it('assigns the selected class only to newly drawn objects', () => {
    expect(toBboxes([{ id: 'new-drawing', type: 'rect', x: 0, y: 0, w: 0.5, h: 0.5 }], boxes, 'third')[0].classId).toBe('third')
  })
})
