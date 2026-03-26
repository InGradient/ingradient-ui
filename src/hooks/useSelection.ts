import { useCallback, useRef, useState } from 'react'

export type SelectionAction = 'toggle' | 'range' | 'single'

export function useSelection<T extends { id: string }>(items: T[]) {
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set())
  const lastIndexRef = useRef<number | null>(null)
  const itemsRef = useRef(items)
  itemsRef.current = items

  const clearSelection = useCallback(() => {
    setSelectedIds(new Set())
    lastIndexRef.current = null
  }, [])

  const selectAll = useCallback((ids?: string[]) => {
    if (ids) {
      setSelectedIds(new Set(ids))
      return
    }
    const current = itemsRef.current
    if (current.length === 0) return
    setSelectedIds(new Set(current.map((i) => i.id)))
  }, [])

  const onSelectionChange = useCallback(
    (action: SelectionAction, id: string, rangeStartId?: string) => {
      setSelectedIds((prev) => {
        const next = new Set(prev)

        if (action === 'single') {
          next.clear()
          next.add(id)
          return next
        }

        if (action === 'toggle') {
          if (next.has(id)) next.delete(id)
          else next.add(id)
          return next
        }

        if (action === 'range' && rangeStartId) {
          const startIdx = items.findIndex((i) => i.id === rangeStartId)
          const endIdx = items.findIndex((i) => i.id === id)
          if (startIdx === -1 || endIdx === -1) return prev
          const [a, b] = startIdx < endIdx ? [startIdx, endIdx] : [endIdx, startIdx]
          for (let i = a; i <= b; i++) next.add(items[i].id)
          return next
        }

        return prev
      })
    },
    [items],
  )

  return { selectedIds, lastIndexRef, clearSelection, selectAll, onSelectionChange }
}
