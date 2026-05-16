import { useCallback, useMemo, useRef, useState } from 'react'
import {
  PointerSensor,
  useSensor,
  useSensors,
  type DragEndEvent,
  type DragOverEvent,
  type DragStartEvent,
} from '@dnd-kit/core'
import {
  moveWidget,
  normalizeLayout,
  parseRowBelowDropId,
  parseWidgetDragId,
  parseWidgetDropId,
  type WidgetDropPosition,
} from './widget-layout'

const POINTER_ACTIVATION_DISTANCE = 6

export interface UseWidgetDragLayoutResult<K extends string> {
  sensors: ReturnType<typeof useSensors>
  normalizedLayout: K[][]
  draggingKey: K | null
  dropPreview: { targetKey: K; position: WidgetDropPosition } | null
  widgetRefs: React.MutableRefObject<Partial<Record<K, HTMLDivElement | null>>>
  handleDragStart: (event: DragStartEvent) => void
  handleDragOver: (event: DragOverEvent) => void
  handleDragEnd: (event: DragEndEvent) => void
  handleDragCancel: () => void
}

/**
 * @dnd-kit 기반 widget 행렬 layout drag-reorder 훅.
 * - normalizedLayout 으로 layout 을 항상 정규화 (중복 제거 + 빈 row 제거)
 * - draggingKey, dropPreview 로 시각 hint 가능
 * - onLayoutChange 로 외부에 새 layout 전달
 */
export function useWidgetDragLayout<K extends string>(
  layout: K[][] | undefined,
  knownKeys: readonly K[],
  onLayoutChange?: (next: K[][]) => void,
): UseWidgetDragLayoutResult<K> {
  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: POINTER_ACTIVATION_DISTANCE } }),
  )
  const normalizedLayout = useMemo(
    () => normalizeLayout(layout, knownKeys),
    [layout, knownKeys],
  )
  const [draggingKey, setDraggingKey] = useState<K | null>(null)
  const [dropPreview, setDropPreview] = useState<{ targetKey: K; position: WidgetDropPosition } | null>(null)
  const widgetRefs = useRef<Partial<Record<K, HTMLDivElement | null>>>({})

  const handleDragStart = useCallback(
    (event: DragStartEvent) => {
      setDraggingKey(parseWidgetDragId(event.active.id, knownKeys))
    },
    [knownKeys],
  )

  const handleDragOver = useCallback(
    (event: DragOverEvent) => {
      const next =
        parseWidgetDropId(event.over?.id, knownKeys) ?? parseRowBelowDropId(event.over?.id, knownKeys)
      setDropPreview(next)
    },
    [knownKeys],
  )

  const handleDragEnd = useCallback(
    (event: DragEndEvent) => {
      const sourceKey = parseWidgetDragId(event.active.id, knownKeys)
      const target =
        parseWidgetDropId(event.over?.id, knownKeys) ?? parseRowBelowDropId(event.over?.id, knownKeys)
      if (sourceKey && target) {
        const next = moveWidget(normalizedLayout, sourceKey, target.targetKey, target.position, knownKeys)
        if (next) onLayoutChange?.(next)
      }
      setDraggingKey(null)
      setDropPreview(null)
    },
    [normalizedLayout, knownKeys, onLayoutChange],
  )

  const handleDragCancel = useCallback(() => {
    setDraggingKey(null)
    setDropPreview(null)
  }, [])

  return {
    sensors,
    normalizedLayout,
    draggingKey,
    dropPreview,
    widgetRefs,
    handleDragStart,
    handleDragOver,
    handleDragEnd,
    handleDragCancel,
  }
}
