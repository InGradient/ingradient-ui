import { describe, it, expect } from 'vitest'
import { renderHook, act } from '@testing-library/react'
import { useZoomPan, ZOOM_MIN_DEFAULT } from './useZoomPan'

describe('useZoomPan', () => {
  it('initializes with default zoom and pan', () => {
    const { result } = renderHook(() => useZoomPan())
    expect(result.current.zoom).toBe(ZOOM_MIN_DEFAULT)
    expect(result.current.pan).toEqual({ x: 0, y: 0 })
  })

  it('respects custom minZoom option', () => {
    const { result } = renderHook(() => useZoomPan({ minZoom: 0.5 }))
    expect(result.current.zoom).toBe(0.5)
  })

  it('resets zoom and pan', () => {
    const { result } = renderHook(() => useZoomPan())
    act(() => result.current.reset())
    expect(result.current.zoom).toBe(ZOOM_MIN_DEFAULT)
    expect(result.current.pan).toEqual({ x: 0, y: 0 })
  })

  it('handleWheel zooms in on negative deltaY', () => {
    const { result } = renderHook(() => useZoomPan())
    act(() => {
      result.current.handleWheel({ deltaY: -100, preventDefault: () => {} } as unknown as WheelEvent)
    })
    expect(result.current.zoom).toBeGreaterThan(ZOOM_MIN_DEFAULT)
  })

  it('handleWheel does not exceed maxZoom', () => {
    const { result } = renderHook(() => useZoomPan({ maxZoom: 2 }))
    for (let i = 0; i < 20; i++) {
      act(() => {
        result.current.handleWheel({ deltaY: -100, preventDefault: () => {} } as unknown as WheelEvent)
      })
    }
    expect(result.current.zoom).toBeLessThanOrEqual(2)
  })

  it('pan drag cycle works', () => {
    const { result } = renderHook(() => useZoomPan())
    act(() => result.current.startPan(0, 0, 0, 0))
    expect(result.current.isZoomPanning()).toBe(true)

    act(() => { result.current.movePan(100, 50) })
    expect(result.current.pan.x).toBe(100)
    expect(result.current.pan.y).toBe(50)

    act(() => result.current.endPan())
    expect(result.current.isZoomPanning()).toBe(false)
  })

  it('ignores small pan movements below threshold', () => {
    const { result } = renderHook(() => useZoomPan())
    act(() => result.current.startPan(0, 0, 0, 0))
    const moved = result.current.movePan(2, 2)
    expect(moved).toBe(false)
    expect(result.current.pan).toEqual({ x: 0, y: 0 })
  })
})
