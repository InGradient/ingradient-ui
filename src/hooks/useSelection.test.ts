import { describe, it, expect } from 'vitest'
import { renderHook, act } from '@testing-library/react'
import { useSelection } from './useSelection'

const items = [{ id: 'a' }, { id: 'b' }, { id: 'c' }, { id: 'd' }]

describe('useSelection', () => {
  it('starts with empty selection', () => {
    const { result } = renderHook(() => useSelection(items))
    expect(result.current.selectedIds.size).toBe(0)
  })

  it('single select sets one item', () => {
    const { result } = renderHook(() => useSelection(items))
    act(() => result.current.onSelectionChange('single', 'b'))
    expect(result.current.selectedIds.size).toBe(1)
    expect(result.current.selectedIds.has('b')).toBe(true)
  })

  it('toggle adds and removes', () => {
    const { result } = renderHook(() => useSelection(items))
    act(() => result.current.onSelectionChange('toggle', 'a'))
    expect(result.current.selectedIds.has('a')).toBe(true)

    act(() => result.current.onSelectionChange('toggle', 'a'))
    expect(result.current.selectedIds.has('a')).toBe(false)
  })

  it('range select selects contiguous items', () => {
    const { result } = renderHook(() => useSelection(items))
    act(() => result.current.onSelectionChange('range', 'c', 'a'))
    expect(result.current.selectedIds.size).toBe(3)
    expect(result.current.selectedIds.has('a')).toBe(true)
    expect(result.current.selectedIds.has('b')).toBe(true)
    expect(result.current.selectedIds.has('c')).toBe(true)
  })

  it('selectAll selects all items', () => {
    const { result } = renderHook(() => useSelection(items))
    act(() => result.current.selectAll())
    expect(result.current.selectedIds.size).toBe(4)
  })

  it('selectAll with explicit ids', () => {
    const { result } = renderHook(() => useSelection(items))
    act(() => result.current.selectAll(['a', 'c']))
    expect(result.current.selectedIds.size).toBe(2)
  })

  it('clearSelection resets', () => {
    const { result } = renderHook(() => useSelection(items))
    act(() => result.current.selectAll())
    act(() => result.current.clearSelection())
    expect(result.current.selectedIds.size).toBe(0)
  })
})
