import React from 'react'
import type { Meta, StoryObj } from '@storybook/react-vite'
import {
  AnnotationToolbar,
  CanvasCoordReadout,
  LabelingCanvas,
  type AnnotationToolbarAction,
} from '../../src/patterns'
import {
  useCanvasMouse,
  useDrawingCanvas,
  useZoomPan,
  type DrawingObject,
} from '../../src/hooks'
import { StorybookCard, StorybookGrid, StorybookPage, StorybookSection } from '@storybook-support/storybook-layout'
import sampleImage from '../assets/20230808.jpg'
import {
  BboxIcon,
  ClassChip,
  CursorIcon,
  PointIcon,
  TrashIcon,
  ZoomInIcon,
  ZoomOutIcon,
  sampleClasses,
} from './labeling-canvas.stories.helpers'

const meta = {
  title: 'Patterns/LabelingCanvas',
  component: LabelingCanvas,
  tags: ['autodocs'],
  parameters: {
    layout: 'fullscreen',
    a11y: { test: 'error' },
  },
} satisfies Meta<typeof LabelingCanvas>

export default meta

type Story = StoryObj<typeof meta>

type Tool = 'cursor' | 'bbox' | 'point'

function InteractiveDemo() {
  const [tool, setTool] = React.useState<Tool>('bbox')
  const [classId, setClassId] = React.useState(sampleClasses[0].id)
  const [objects, setObjects] = React.useState<DrawingObject[]>([])
  const [imageAspect, setImageAspect] = React.useState(1)
  const [crosshair, setCrosshair] = React.useState<{ x: number; y: number } | null>(null)
  const imageAreaRef = React.useRef<HTMLDivElement | null>(null)

  const zp = useZoomPan({ minZoom: 1, maxZoom: 4 })

  const drawingMode: 'cursor' | 'rect' | 'point' =
    tool === 'bbox' ? 'rect' : tool === 'point' ? 'point' : 'cursor'

  const { selectedId, drawingPreview, cursor: drawingCursor, bindings: drawBindings } = useDrawingCanvas({
    objects,
    mode: drawingMode,
    onObjectsChange: setObjects,
  })

  const drawingBindings = {
    onMouseDown: drawBindings.onMouseDown,
    onMouseMove: drawBindings.onMouseMove,
    onMouseUp: drawBindings.onMouseUp,
    onMouseLeave: drawBindings.onMouseLeave,
  }

  const { mouseHandlers, cursor } = useCanvasMouse({
    tool,
    zoom: zp.zoom,
    drawingObjects: objects,
    drawingBindings,
    drawingCursor,
    startPan: zp.startPan,
    movePan: zp.movePan,
    endPan: zp.endPan,
    isZoomPanning: zp.isZoomPanning,
    pan: zp.pan,
    containerRef: imageAreaRef,
    onCrosshairUpdate: (n) => setCrosshair(n ? { x: n.nx, y: n.ny } : null),
  })

  const activeClass = sampleClasses.find((c) => c.id === classId) ?? sampleClasses[0]
  const previewColor = activeClass.color

  // Color objects by classId (caller responsibility). For demo we tag new objects with current classId.
  const taggedObjects: DrawingObject[] = React.useMemo(
    () => objects.map((o) => ({ ...o, color: o.color ?? activeClass.color, label: o.label ?? activeClass.label })),
    [objects, activeClass],
  )

  const toolbarActions: Array<AnnotationToolbarAction | 'separator'> = [
    { key: 'cursor', title: 'Select & move', icon: <CursorIcon />, active: tool === 'cursor', onClick: () => setTool('cursor') },
    { key: 'bbox', title: 'Draw bbox', icon: <BboxIcon />, active: tool === 'bbox', onClick: () => setTool('bbox') },
    { key: 'point', title: 'Add point', icon: <PointIcon />, active: tool === 'point', onClick: () => setTool('point') },
    'separator',
    { key: 'zoom-out', title: 'Zoom out', icon: <ZoomOutIcon />, disabled: zp.zoom <= 1, onClick: () => zp.handleWheel({ deltaY: 1, preventDefault: () => undefined } as unknown as WheelEvent) },
    { key: 'zoom-in', title: 'Zoom in', icon: <ZoomInIcon />, disabled: zp.zoom >= 4, onClick: () => zp.handleWheel({ deltaY: -1, preventDefault: () => undefined } as unknown as WheelEvent) },
    { key: 'clear', title: 'Clear all', icon: <TrashIcon />, danger: true, disabled: objects.length === 0, onClick: () => setObjects([]) },
  ]

  const coordText = (() => {
    if (selectedId) {
      const sel = objects.find((o) => o.id === selectedId)
      if (sel?.type === 'rect' && sel.w != null && sel.h != null) {
        return `bbox x=${sel.x.toFixed(3)} y=${sel.y.toFixed(3)} w=${sel.w.toFixed(3)} h=${sel.h.toFixed(3)}`
      }
      if (sel?.type === 'point') return `point x=${sel.x.toFixed(3)} y=${sel.y.toFixed(3)}`
    }
    if (crosshair) return `cursor x=${crosshair.x.toFixed(3)} y=${crosshair.y.toFixed(3)}`
    return ' '
  })()

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap' }}>
        <span style={{ color: 'var(--ig-color-text-soft)', fontSize: 12 }}>Class:</span>
        {sampleClasses.map((c) => (
          <ClassChip key={c.id} klass={c} active={c.id === classId} onClick={() => setClassId(c.id)} />
        ))}
        <span style={{ marginLeft: 'auto', color: 'var(--ig-color-text-soft)', fontSize: 12 }}>
          Objects: {objects.length} · Zoom: {zp.zoom.toFixed(2)}×
        </span>
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', borderRadius: 12, overflow: 'hidden', border: '1px solid var(--ig-color-border-subtle)' }}>
        <div style={{ position: 'relative', height: 420 }}>
          <LabelingCanvas
            imageUrl={sampleImage}
            alt="Sample for labeling"
            imageAspect={imageAspect}
            onImageLoad={(w, h) => setImageAspect(w / h)}
            zoom={zp.zoom}
            pan={zp.pan}
            objects={taggedObjects}
            preview={drawingPreview}
            selectedId={selectedId}
            showHandles={tool === 'cursor' && selectedId != null}
            showLabels
            previewColor={previewColor}
            mouseHandlers={mouseHandlers}
            cursor={cursor}
            crosshair={tool !== 'cursor' && crosshair ? { x: crosshair.x, y: crosshair.y, color: previewColor } : null}
            imageAreaRef={imageAreaRef}
            onWheel={zp.handleWheel}
          />
        </div>
        <CanvasCoordReadout>{coordText}</CanvasCoordReadout>
        <AnnotationToolbar placement="bottom" actions={toolbarActions} ariaLabel="Labeling demo" />
      </div>
    </div>
  )
}

export const Review: Story = {
  args: {
    imageAspect: 1,
    zoom: 1,
    pan: { x: 0, y: 0 },
    objects: [],
    alt: 'Review',
    mouseHandlers: { onMouseDown: () => undefined, onMouseMove: () => undefined, onMouseUp: () => undefined, onMouseLeave: () => undefined },
    cursor: 'default',
  },
  render: () => (
    <StorybookPage
      title="LabelingCanvas"
      description="이미지 + 줌/팬 + DrawingLayer + 마우스 합성 가 통합된 라벨링 canvas Pattern. useZoomPan + useDrawingCanvas + useCanvasMouse 3 hook 을 조합하여 실 라벨링 화면 구성."
    >
      <StorybookSection title="Interactive labeling demo" description="bbox 드래그 / point 클릭 / cursor mode 에서 zoom>1 시 빈 공간 드래그하면 pan. 우상단 zoom 버튼으로 확대 후 시도해보세요.">
        <StorybookGrid columns="1fr">
          <StorybookCard title="Full integration" subtitle="useZoomPan + useDrawingCanvas + useCanvasMouse + AnnotationToolbar + CoordReadout">
            <InteractiveDemo />
          </StorybookCard>
        </StorybookGrid>
      </StorybookSection>
    </StorybookPage>
  ),
}
