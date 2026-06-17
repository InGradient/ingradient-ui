import { useCallback, type ReactNode } from 'react'
import { DndContext, DragOverlay, pointerWithin, useDraggable, useDroppable } from '@dnd-kit/core'
import { DragHandle } from '@ingradient/ui'
import { AnalysisWidgetShell } from './analysis-widget-shell'
import { useWidgetDragLayout } from './use-widget-drag-layout'
import {
  rowBelowDropId,
  widgetDragId,
  widgetDropId,
  type WidgetEdgeDropPosition,
} from './widget-layout'
import {
  DragOverlayCard,
  DragOverlayTitle,
  Row,
  RowDropIndicator,
  RowDropZone,
  Rows,
  WidgetDropZone,
  WidgetShell,
} from './DraggableAnalysisWidgetGrid.styles'

export interface DraggableAnalysisWidgetGridProps<K extends string> {
  layout: K[][]
  widgets: Partial<Record<K, ReactNode>>
  widgetTitles: Record<K, string>
  widgetKeys: readonly K[]
  visibility?: Partial<Record<K, boolean>>
  onLayoutChange?: (next: K[][]) => void
  onDownloadWidget?: (key: K, node: HTMLElement | null) => void
  emptyState?: ReactNode
  className?: string
}

export function DraggableAnalysisWidgetGrid<K extends string>({
  layout,
  widgets,
  widgetTitles,
  widgetKeys,
  visibility,
  onLayoutChange,
  onDownloadWidget,
  emptyState,
  className,
}: DraggableAnalysisWidgetGridProps<K>) {
  const drag = useWidgetDragLayout<K>(layout, widgetKeys, onLayoutChange)

  const isVisible = (key: K) => visibility?.[key] !== false && !!widgets[key]
  const visibleRows = drag.normalizedLayout
    .map((row) => row.filter(isVisible))
    .filter((row) => row.length > 0)

  if (visibleRows.length === 0 && emptyState) {
    return <>{emptyState}</>
  }

  const handleDownload = useCallback(
    (key: K) => {
      onDownloadWidget?.(key, drag.widgetRefs.current[key] ?? null)
    },
    [onDownloadWidget, drag.widgetRefs],
  )

  return (
    <DndContext
      sensors={drag.sensors}
      collisionDetection={pointerWithin}
      onDragStart={drag.handleDragStart}
      onDragOver={drag.handleDragOver}
      onDragEnd={drag.handleDragEnd}
      onDragCancel={drag.handleDragCancel}
    >
      <Rows className={className}>
        {visibleRows.map((row, rowIndex) => (
          <Row key={`row-${rowIndex}-${row.join('-')}`} $count={row.length}>
            <RowBelow widgetKey={row[row.length - 1]} active={isRowBelowActive(drag.dropPreview, row)} />
            <RowDropIndicator $active={isRowBelowActive(drag.dropPreview, row)} data-report-hide />
            {row.map((key) => (
              <WidgetSlot
                key={key}
                widgetKey={key}
                title={widgetTitles[key]}
                body={widgets[key]}
                dragging={drag.draggingKey === key}
                dropTarget={resolveDropTarget(drag.dropPreview, key, drag.draggingKey)}
                onDownload={() => handleDownload(key)}
                shellRef={(node) => {
                  drag.widgetRefs.current[key] = node
                }}
                showDropZone={(pos) =>
                  drag.dropPreview?.targetKey === key && drag.dropPreview.position === pos
                }
              />
            ))}
          </Row>
        ))}
      </Rows>
      <DragOverlay>
        {drag.draggingKey ? (
          <DragOverlayCard>
            <DragOverlayTitle>{widgetTitles[drag.draggingKey]}</DragOverlayTitle>
          </DragOverlayCard>
        ) : null}
      </DragOverlay>
    </DndContext>
  )
}

function isRowBelowActive<K extends string>(
  dropPreview: { targetKey: K; position: string } | null,
  row: K[],
): boolean {
  return !!(dropPreview?.position === 'below' && row.includes(dropPreview.targetKey))
}

function resolveDropTarget<K extends string>(
  dropPreview: { targetKey: K; position: string } | null,
  key: K,
  draggingKey: K | null,
): false | 'before' | 'after' {
  if (!dropPreview) return false
  if (dropPreview.targetKey !== key) return false
  if (draggingKey === key) return false
  if (dropPreview.position !== 'before' && dropPreview.position !== 'after') return false
  return dropPreview.position
}

interface SlotProps<K extends string> {
  widgetKey: K
  title: string
  body: ReactNode
  dragging: boolean
  dropTarget: false | 'before' | 'after'
  onDownload: () => void
  shellRef: (node: HTMLDivElement | null) => void
  showDropZone: (pos: 'before' | 'after') => boolean
}

function WidgetSlot<K extends string>({
  widgetKey,
  title,
  body,
  dragging,
  dropTarget,
  onDownload,
  shellRef,
  showDropZone,
}: SlotProps<K>) {
  const draggable = useDraggable({ id: widgetDragId(widgetKey) })
  return (
    <WidgetShell ref={shellRef} $dragging={dragging} $dropTarget={dropTarget} data-widget-key={widgetKey}>
      <EdgeDropZone widgetKey={widgetKey} position="before" active={showDropZone('before')} />
      <EdgeDropZone widgetKey={widgetKey} position="after" active={showDropZone('after')} />
      <AnalysisWidgetShell
        onDownload={onDownload}
        extraActions={
          <div
            ref={draggable.setNodeRef}
            {...draggable.attributes}
            {...draggable.listeners}
            aria-label={`Drag ${title}`}
          >
            <DragHandle ariaLabel={`Drag ${title}`} title="Drag to reorder" />
          </div>
        }
      >
        {body}
      </AnalysisWidgetShell>
    </WidgetShell>
  )
}

function EdgeDropZone<K extends string>({
  widgetKey,
  position,
  active,
}: {
  widgetKey: K
  position: WidgetEdgeDropPosition
  active: boolean
}) {
  const { setNodeRef } = useDroppable({ id: widgetDropId(widgetKey, position) })
  return <WidgetDropZone ref={setNodeRef} $position={position} $active={active} aria-hidden="true" />
}

function RowBelow<K extends string>({ widgetKey, active }: { widgetKey: K; active: boolean }) {
  const { setNodeRef } = useDroppable({ id: rowBelowDropId(widgetKey) })
  return <RowDropZone ref={setNodeRef} $active={active} aria-hidden="true" />
}
