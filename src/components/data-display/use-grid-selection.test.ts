import { describe, it, expect } from 'vitest'
import type React from 'react'
import { classifySelectionAction } from './use-grid-selection'

function event(props: Partial<React.MouseEvent>): React.MouseEvent {
  return { shiftKey: false, ctrlKey: false, metaKey: false, ...props } as React.MouseEvent
}

describe('classifySelectionAction', () => {
  it('returns single for plain click', () => {
    expect(classifySelectionAction(event({}))).toBe('single')
  })

  it('returns toggle for ctrl+click', () => {
    expect(classifySelectionAction(event({ ctrlKey: true }))).toBe('toggle')
  })

  it('returns toggle for meta+click (mac)', () => {
    expect(classifySelectionAction(event({ metaKey: true }))).toBe('toggle')
  })

  it('returns range for shift+click', () => {
    expect(classifySelectionAction(event({ shiftKey: true }))).toBe('range')
  })

  it('prioritizes range when shift+ctrl pressed together', () => {
    expect(classifySelectionAction(event({ shiftKey: true, ctrlKey: true }))).toBe('range')
  })
})
