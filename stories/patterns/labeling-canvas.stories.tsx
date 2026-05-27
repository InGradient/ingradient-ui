import React from 'react'
import type { Meta, StoryObj } from '@storybook/react-vite'
import { ToolbarShell, type ToolbarShellAction } from '../../src/components/inputs/toolbar-shell'
import {
  CanvasCoordReadout,
  LabelingCanvas,
} from '../../src/patterns'
import {
  useCanvasMouse,
  useDrawingCanvas,
  useZoomPan,
  type DrawingObject,
} from '../../src/hooks'

const PRELOADED_BBOXES: DrawingObject[] = [
  { id: 'b1', type: 'rect', x: 0.18, y: 0.22, w: 0.28, h: 0.32, color: '#ff7f66', label: 'Dent' },
  { id: 'b2', type: 'rect', x: 0.55, y: 0.40, w: 0.30, h: 0.25, color: '#6fb6ff', label: 'Scratch' },
  { id: 'b3', type: 'rect', x: 0.30, y: 0.70, w: 0.20, h: 0.18, color: '#7ce0be', label: 'Glare' },
]

function ZoomInvariantCard({ zoom, label }: { zoom: number; label: string }) {
  const imageAreaRef = React.useRef<HTMLDivElement | null>(null)
  const wrapRef = React.useRef<HTMLDivElement | null>(null)
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
      <div style={{ fontSize: 12, color: 'var(--ig-color-text-soft)' }}>{label}</div>
      <div style={{ position: 'relative', height: 240, borderRadius: 12, overflow: 'hidden', border: '1px solid var(--ig-color-border-subtle)' }}>
        <LabelingCanvas
          imageUrl={sampleImage}
          alt={`Zoom ${zoom}x`}
          imageAspect={1}
          zoom={zoom}
          pan={{ x: 0, y: 0 }}
          objects={PRELOADED_BBOXES}
          showLabels
          mouseHandlers={{ onMouseDown: () => undefined, onMouseMove: () => undefined, onMouseUp: () => undefined, onMouseLeave: () => undefined }}
          cursor="default"
          imageAreaRef={imageAreaRef}
          wrapRef={wrapRef}
        />
      </div>
    </div>
  )
}
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
  title: 'Patterns/Annotation/LabelingCanvas',
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
  const wrapRef = React.useRef<HTMLDivElement | null>(null)

  const zp = useZoomPan({
    minZoom: 1,
    maxZoom: 4,
    /** wrap element size 를 측정해서 pan clamp — 줌해서 이미지가 캔버스 밖으로 너무 안 나가게. */
    getBounds: () => {
      const el = wrapRef.current
      if (!el) return null
      const rect = el.getBoundingClientRect()
      return { width: rect.width, height: rect.height }
    },
  })

  const drawingMode: 'cursor' | 'rect' | 'point' =
    tool === 'bbox' ? 'rect' : tool === 'point' ? 'point' : 'cursor'

  const activeClass = sampleClasses.find((c) => c.id === classId) ?? sampleClasses[0]
  const previewColor = activeClass.color

  // 새 object 는 *현재* class 로 영구 태그 (color/label 저장). 기존 object 는 보존.
  const handleObjectsChange = React.useCallback(
    (next: DrawingObject[]) => {
      setObjects((prev) => {
        const prevById = new Map(prev.map((o) => [o.id, o]))
        return next.map((o) => {
          const existing = prevById.get(o.id)
          if (existing) {
            // 기존 object — color/label 보존, 좌표/크기 등은 next 의 값 사용
            return { ...o, color: existing.color, label: existing.label }
          }
          // 새 object — 현재 class 로 태그
          return { ...o, color: o.color ?? activeClass.color, label: o.label ?? activeClass.label }
        })
      })
    },
    [activeClass],
  )

  const { selectedId, drawingPreview, cursor: drawingCursor, bindings: drawBindings } = useDrawingCanvas({
    objects,
    mode: drawingMode,
    onObjectsChange: handleObjectsChange,
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

  // Class chip 클릭 — cursor mode + 선택된 bbox 가 있으면 *그 bbox 만* class 변경.
  // 그 외에는 단순히 active class 만 변경 (다음에 그릴 bbox 의 기본 class).
  const handleClassClick = (id: string) => {
    setClassId(id)
    if (tool === 'cursor' && selectedId) {
      const klass = sampleClasses.find((c) => c.id === id)
      if (klass) {
        setObjects((prev) =>
          prev.map((o) => (o.id === selectedId ? { ...o, color: klass.color, label: klass.label } : o)),
        )
      }
    }
  }

  const toolbarActions: Array<ToolbarShellAction | 'separator'> = [
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
    return ' ' // NBSP — CoordReadoutRoot 의 min-height 와 함께 row height 고정
  })()

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap' }}>
        <span style={{ color: 'var(--ig-color-text-soft)', fontSize: 12 }}>Class:</span>
        {sampleClasses.map((c) => (
          <ClassChip key={c.id} klass={c} active={c.id === classId} onClick={() => handleClassClick(c.id)} />
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
            objects={objects}
            preview={drawingPreview}
            selectedId={selectedId}
            showHandles={tool === 'cursor' && selectedId != null}
            showLabels
            previewColor={previewColor}
            mouseHandlers={mouseHandlers}
            cursor={cursor}
            crosshair={tool !== 'cursor' && crosshair ? { x: crosshair.x, y: crosshair.y, color: previewColor } : null}
            imageAreaRef={imageAreaRef}
            wrapRef={wrapRef}
            onWheel={zp.handleWheel}
          />
        </div>
        <CanvasCoordReadout>{coordText}</CanvasCoordReadout>
        <ToolbarShell placement="bottom" actions={toolbarActions} ariaLabel="Labeling demo" />
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
          <StorybookCard title="Full integration" subtitle="useZoomPan + useDrawingCanvas + useCanvasMouse + ToolbarShell + CoordReadout">
            <InteractiveDemo />
          </StorybookCard>
        </StorybookGrid>
      </StorybookSection>

      <StorybookSection title="Zoom-invariant stroke & label" description="동일한 3 개 bbox 가 zoom 1× / 2× / 3× 에 표시됩니다. 이미지는 확대되지만 bbox 테두리 굵기와 class 라벨 크기는 픽셀 기준으로 일정 — 줌해도 UI 가독성이 유지됩니다 (DrawingLayer 의 zoom prop 기반 정규화).">
        <StorybookGrid columns="repeat(3, 1fr)">
          <StorybookCard title="Zoom 1×" subtitle="기준 배율">
            <ZoomInvariantCard zoom={1} label="stroke / label 픽셀 크기 = baseline" />
          </StorybookCard>
          <StorybookCard title="Zoom 2×" subtitle="이미지 2배 확대">
            <ZoomInvariantCard zoom={2} label="bbox 선·라벨 굵기는 1× 와 동일" />
          </StorybookCard>
          <StorybookCard title="Zoom 3×" subtitle="이미지 3배 확대">
            <ZoomInvariantCard zoom={3} label="3× 에서도 가독성 유지" />
          </StorybookCard>
        </StorybookGrid>
      </StorybookSection>
    </StorybookPage>
  ),
}
