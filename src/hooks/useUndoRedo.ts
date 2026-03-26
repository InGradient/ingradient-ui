import { useCallback, useRef, useState } from 'react'

export interface UseUndoRedoOptions<T> {
  initialState: T
  maxHistory?: number
}

export function useUndoRedo<T>({ initialState, maxHistory = 50 }: UseUndoRedoOptions<T>) {
  const [state, setStateInternal] = useState<T>(initialState)
  const historyRef = useRef<T[]>([initialState])
  const indexRef = useRef(0)

  const setState = useCallback(
    (next: T) => {
      const history = historyRef.current
      const idx = indexRef.current
      // Truncate any forward history
      historyRef.current = history.slice(0, idx + 1)
      historyRef.current.push(next)
      // Cap at maxHistory
      if (historyRef.current.length > maxHistory) {
        historyRef.current = historyRef.current.slice(-maxHistory)
      }
      indexRef.current = historyRef.current.length - 1
      setStateInternal(next)
    },
    [maxHistory],
  )

  const undo = useCallback(() => {
    if (indexRef.current <= 0) return
    indexRef.current -= 1
    setStateInternal(historyRef.current[indexRef.current])
  }, [])

  const redo = useCallback(() => {
    if (indexRef.current >= historyRef.current.length - 1) return
    indexRef.current += 1
    setStateInternal(historyRef.current[indexRef.current])
  }, [])

  const reset = useCallback((newState: T) => {
    historyRef.current = [newState]
    indexRef.current = 0
    setStateInternal(newState)
  }, [])

  const canUndo = indexRef.current > 0
  const canRedo = indexRef.current < historyRef.current.length - 1

  return { state, setState, undo, redo, canUndo, canRedo, reset }
}
