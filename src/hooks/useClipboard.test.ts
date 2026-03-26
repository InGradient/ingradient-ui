import { describe, it, expect, vi, beforeEach } from 'vitest'
import { renderHook, act } from '@testing-library/react'
import { useClipboard } from './useClipboard'

describe('useClipboard', () => {
  beforeEach(() => {
    Object.assign(navigator, {
      clipboard: { writeText: vi.fn().mockResolvedValue(undefined) },
    })
  })

  it('starts with copied = false', () => {
    const { result } = renderHook(() => useClipboard())
    expect(result.current.copied).toBe(false)
  })

  it('sets copied to true after copy', async () => {
    const { result } = renderHook(() => useClipboard())
    await act(async () => { await result.current.copy('hello') })
    expect(result.current.copied).toBe(true)
    expect(navigator.clipboard.writeText).toHaveBeenCalledWith('hello')
  })

  it('resets copied after delay', async () => {
    vi.useFakeTimers()
    const { result } = renderHook(() => useClipboard({ resetDelay: 100 }))
    await act(async () => { await result.current.copy('test') })
    expect(result.current.copied).toBe(true)

    act(() => { vi.advanceTimersByTime(150) })
    expect(result.current.copied).toBe(false)
    vi.useRealTimers()
  })

  it('handles clipboard failure gracefully', async () => {
    Object.assign(navigator, {
      clipboard: { writeText: vi.fn().mockRejectedValue(new Error('denied')) },
    })
    const { result } = renderHook(() => useClipboard())
    await act(async () => { await result.current.copy('fail') })
    expect(result.current.copied).toBe(false)
  })
})
