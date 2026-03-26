import { describe, it, expect } from 'vitest'
import { renderHook, act } from '@testing-library/react'
import { useUndoRedo } from './useUndoRedo'

describe('useUndoRedo', () => {
  it('starts with initialState', () => {
    const { result } = renderHook(() => useUndoRedo({ initialState: 'a' }))
    expect(result.current.state).toBe('a')
    expect(result.current.canUndo).toBe(false)
    expect(result.current.canRedo).toBe(false)
  })

  it('setState pushes to history', () => {
    const { result } = renderHook(() => useUndoRedo({ initialState: 0 }))
    act(() => result.current.setState(1))
    expect(result.current.state).toBe(1)
    expect(result.current.canUndo).toBe(true)
  })

  it('undo reverts to previous', () => {
    const { result } = renderHook(() => useUndoRedo({ initialState: 0 }))
    act(() => result.current.setState(1))
    act(() => result.current.setState(2))
    act(() => result.current.undo())
    expect(result.current.state).toBe(1)
    expect(result.current.canRedo).toBe(true)
  })

  it('redo goes forward', () => {
    const { result } = renderHook(() => useUndoRedo({ initialState: 0 }))
    act(() => result.current.setState(1))
    act(() => result.current.undo())
    act(() => result.current.redo())
    expect(result.current.state).toBe(1)
  })

  it('reset clears history', () => {
    const { result } = renderHook(() => useUndoRedo({ initialState: 0 }))
    act(() => result.current.setState(1))
    act(() => result.current.setState(2))
    act(() => result.current.reset(10))
    expect(result.current.state).toBe(10)
    expect(result.current.canUndo).toBe(false)
    expect(result.current.canRedo).toBe(false)
  })

  it('respects maxHistory', () => {
    const { result } = renderHook(() => useUndoRedo({ initialState: 0, maxHistory: 3 }))
    act(() => result.current.setState(1))
    act(() => result.current.setState(2))
    act(() => result.current.setState(3))
    act(() => result.current.setState(4))
    // History should be capped, can't undo all the way to 0
    act(() => result.current.undo())
    act(() => result.current.undo())
    expect(result.current.canUndo).toBe(false)
  })

  it('new setState after undo truncates forward history', () => {
    const { result } = renderHook(() => useUndoRedo({ initialState: 0 }))
    act(() => result.current.setState(1))
    act(() => result.current.setState(2))
    act(() => result.current.undo())
    act(() => result.current.setState(3))
    expect(result.current.state).toBe(3)
    expect(result.current.canRedo).toBe(false)
  })
})
