export type WidgetDropPosition = 'before' | 'after' | 'below'
export type WidgetEdgeDropPosition = 'before' | 'after'
export type WidgetKeyboardDirection = 'left' | 'right' | 'up' | 'down'

const MAX_WIDGETS_PER_ROW = 3

export function flattenLayout<K extends string>(layout: K[][]): K[] {
  return layout.flat()
}

export function normalizeLayout<K extends string>(
  value: K[][] | null | undefined,
  knownKeys: readonly K[],
): K[][] {
  const source = Array.isArray(value) && value.length > 0 ? value : knownKeys.map((k) => [k] as K[])
  const seen = new Set<K>()
  const rows: K[][] = []
  for (const row of source) {
    if (!Array.isArray(row)) continue
    const normalizedRow: K[] = []
    for (const key of row) {
      if (knownKeys.includes(key) && !seen.has(key)) {
        normalizedRow.push(key)
        seen.add(key)
      }
    }
    if (normalizedRow.length > 0) {
      for (let i = 0; i < normalizedRow.length; i += MAX_WIDGETS_PER_ROW) {
        rows.push(normalizedRow.slice(i, i + MAX_WIDGETS_PER_ROW))
      }
    }
  }
  for (const key of knownKeys) {
    if (!seen.has(key)) rows.push([key])
  }
  return rows
}

export function moveWidget<K extends string>(
  current: K[][],
  sourceKey: K,
  targetKey: K,
  position: WidgetDropPosition,
  knownKeys: readonly K[],
): K[][] | null {
  if (sourceKey === targetKey) return null
  const next = current.map((row) => [...row]).filter((row) => row.length > 0) as K[][]
  let sourceRowIndex = -1
  let sourceItemIndex = -1
  let targetRowIndex = -1
  let targetItemIndex = -1

  next.forEach((row, rowIndex) => {
    const si = row.indexOf(sourceKey)
    if (si >= 0) {
      sourceRowIndex = rowIndex
      sourceItemIndex = si
    }
    const ti = row.indexOf(targetKey)
    if (ti >= 0) {
      targetRowIndex = rowIndex
      targetItemIndex = ti
    }
  })
  if (sourceRowIndex < 0 || targetRowIndex < 0) return null

  next[sourceRowIndex].splice(sourceItemIndex, 1)
  if (next[sourceRowIndex].length === 0) {
    next.splice(sourceRowIndex, 1)
    if (sourceRowIndex < targetRowIndex) targetRowIndex -= 1
  }

  if (position === 'below') {
    next.splice(targetRowIndex + 1, 0, [sourceKey])
  } else {
    const targetRow = next[targetRowIndex]
    if (targetRow.length >= MAX_WIDGETS_PER_ROW) {
      const insertRowIndex = position === 'before' ? targetRowIndex : targetRowIndex + 1
      next.splice(insertRowIndex, 0, [sourceKey])
    } else {
      const insertIndex = position === 'before' ? targetItemIndex : targetItemIndex + 1
      targetRow.splice(insertIndex, 0, sourceKey)
    }
  }
  return normalizeLayout(next, knownKeys)
}

export function moveWidgetByKeyboard<K extends string>(
  current: K[][],
  sourceKey: K,
  direction: WidgetKeyboardDirection,
  knownKeys: readonly K[],
): K[][] | null {
  const normalized = normalizeLayout(current, knownKeys)
  const rowIndex = normalized.findIndex((row) => row.includes(sourceKey))
  if (rowIndex < 0) return null
  const itemIndex = normalized[rowIndex].indexOf(sourceKey)
  const row = normalized[rowIndex]

  if (direction === 'left') {
    const previousRow = normalized[rowIndex - 1]
    const target = row[itemIndex - 1] ?? previousRow?.[previousRow.length - 1]
    return target ? moveWidget(normalized, sourceKey, target, 'before', knownKeys) : null
  }
  if (direction === 'right') {
    const target = row[itemIndex + 1] ?? normalized[rowIndex + 1]?.[0]
    return target ? moveWidget(normalized, sourceKey, target, 'after', knownKeys) : null
  }
  if (direction === 'up') {
    const previousRow = normalized[rowIndex - 1]
    const target = previousRow?.[previousRow.length - 1]
    return target ? moveWidget(normalized, sourceKey, target, 'after', knownKeys) : null
  }
  const nextRow = normalized[rowIndex + 1]
  const target = nextRow?.[nextRow.length - 1]
  return target ? moveWidget(normalized, sourceKey, target, 'after', knownKeys) : null
}

export function widgetDragId<K extends string>(key: K): string {
  return `widget:${key}`
}

export function widgetDropId<K extends string>(key: K, position: WidgetEdgeDropPosition): string {
  return `drop:${key}:${position}`
}

export function rowBelowDropId<K extends string>(key: K): string {
  return `row-below:${key}`
}

export function parseWidgetDragId<K extends string>(
  value: string | number | symbol | null | undefined,
  knownKeys: readonly K[],
): K | null {
  if (typeof value !== 'string' || !value.startsWith('widget:')) return null
  const key = value.slice('widget:'.length) as K
  return knownKeys.includes(key) ? key : null
}

export function parseWidgetDropId<K extends string>(
  value: string | number | symbol | null | undefined,
  knownKeys: readonly K[],
): { targetKey: K; position: WidgetEdgeDropPosition } | null {
  if (typeof value !== 'string' || !value.startsWith('drop:')) return null
  const [, targetKey, position] = value.split(':')
  if (knownKeys.includes(targetKey as K) && (position === 'before' || position === 'after')) {
    return { targetKey: targetKey as K, position }
  }
  return null
}

export function parseRowBelowDropId<K extends string>(
  value: string | number | symbol | null | undefined,
  knownKeys: readonly K[],
): { targetKey: K; position: 'below' } | null {
  if (typeof value !== 'string' || !value.startsWith('row-below:')) return null
  const targetKey = value.slice('row-below:'.length) as K
  return knownKeys.includes(targetKey) ? { targetKey, position: 'below' } : null
}
