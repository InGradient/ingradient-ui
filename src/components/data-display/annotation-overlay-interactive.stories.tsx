import React from 'react'
import type { Meta, StoryObj } from '@storybook/react-vite'
import { AnnotationOverlay, type AnnotationOverlayBbox, type AnnotationOverlayPoint } from './annotation-overlay'
import {
  IMAGE_HEIGHT,
  IMAGE_WIDTH,
  MIN_BBOX_SIZE,
  ToolButton,
  ToolGroup,
  classColorMap,
  classOptions,
  coverCropRegion,
  svgThumb,
} from './annotation-overlay-interactive.helpers'
import { StorybookCard, StorybookPage, StorybookSection } from '@storybook-support/storybook-layout'

const meta = {
  title: 'Components/Data Display/AnnotationOverlay',
  component: AnnotationOverlay,
  tags: ['autodocs'],
  parameters: {
    a11y: { test: 'error' },
  },
} satisfies Meta<typeof AnnotationOverlay>

export default meta

type Story = StoryObj<typeof meta>

type Tool = 'bbox' | 'point'

function InteractiveDemo() {
  const [tool, setTool] = React.useState<Tool>('bbox')
  const [classId, setClassId] = React.useState<string>(classOptions[0].id)
  const [bboxes, setBboxes] = React.useState<AnnotationOverlayBbox[]>([])
  const [points, setPoints] = React.useState<AnnotationOverlayPoint[]>([])
  const [drag, setDrag] = React.useState<{ startX: number; startY: number; currentX: number; currentY: number } | null>(null)

  const { vx, vy, vw, vh } = coverCropRegion(IMAGE_WIDTH, IMAGE_HEIGHT)
  const toImageX = (cx: number) => vx + cx * vw
  const toImageY = (cy: number) => vy + cy * vh

  const getContainerCoords = (event: React.MouseEvent) => {
    const rect = event.currentTarget.getBoundingClientRect()
    const cx = (event.clientX - rect.left) / rect.width
    const cy = (event.clientY - rect.top) / rect.height
    return { cx: Math.max(0, Math.min(1, cx)), cy: Math.max(0, Math.min(1, cy)) }
  }

  const handlePointerDown = (event: React.MouseEvent) => {
    const { cx, cy } = getContainerCoords(event)
    if (tool === 'point') {
      setPoints((prev) => [...prev, { classId, x: toImageX(cx), y: toImageY(cy) }])
    } else {
      setDrag({ startX: cx, startY: cy, currentX: cx, currentY: cy })
    }
  }

  const handlePointerMove = (event: React.MouseEvent) => {
    if (!drag) return
    const { cx, cy } = getContainerCoords(event)
    setDrag({ ...drag, currentX: cx, currentY: cy })
  }

  const finishDrag = () => {
    if (!drag) return
    const x1 = Math.min(drag.startX, drag.currentX)
    const y1 = Math.min(drag.startY, drag.currentY)
    const x2 = Math.max(drag.startX, drag.currentX)
    const y2 = Math.max(drag.startY, drag.currentY)
    if (x2 - x1 >= MIN_BBOX_SIZE && y2 - y1 >= MIN_BBOX_SIZE) {
      setBboxes((prev) => [
        ...prev,
        { classId, x: toImageX(x1), y: toImageY(y1), w: (x2 - x1) * vw, h: (y2 - y1) * vh },
      ])
    }
    setDrag(null)
  }

  const previewBbox: AnnotationOverlayBbox | null = drag
    ? {
        classId,
        x: toImageX(Math.min(drag.startX, drag.currentX)),
        y: toImageY(Math.min(drag.startY, drag.currentY)),
        w: Math.abs(drag.currentX - drag.startX) * vw,
        h: Math.abs(drag.currentY - drag.startY) * vh,
      }
    : null

  const bboxesToRender = previewBbox ? [...bboxes, previewBbox] : bboxes

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
      <div style={{ display: 'flex', alignItems: 'center', flexWrap: 'wrap', gap: 12 }}>
        <ToolGroup label="Tool">
          <ToolButton active={tool === 'bbox'} onClick={() => setTool('bbox')}>Bbox</ToolButton>
          <ToolButton active={tool === 'point'} onClick={() => setTool('point')}>Point</ToolButton>
        </ToolGroup>
        <ToolGroup label="Class">
          {classOptions.map((c) => (
            <ToolButton
              key={c.id}
              active={classId === c.id}
              onClick={() => setClassId(c.id)}
              accentColor={c.color}
            >
              {c.label}
            </ToolButton>
          ))}
        </ToolGroup>
        <ToolButton onClick={() => { setBboxes([]); setPoints([]) }}>Clear all</ToolButton>
        <span style={{ marginLeft: 'auto', color: 'var(--ig-color-text-soft)', fontSize: 12 }}>
          Bboxes: {bboxes.length} · Points: {points.length}
        </span>
      </div>
      <div
        style={{
          position: 'relative',
          width: '100%',
          maxWidth: 420,
          aspectRatio: '1 / 1',
          borderRadius: 12,
          overflow: 'hidden',
          background: `center / cover no-repeat url("${svgThumb('Draw here', '#112f57', '#1d7568')}")`,
          cursor: 'crosshair',
          userSelect: 'none',
        }}
        onMouseDown={handlePointerDown}
        onMouseMove={handlePointerMove}
        onMouseUp={finishDrag}
        onMouseLeave={finishDrag}
      >
        <AnnotationOverlay
          bboxes={bboxesToRender}
          points={points}
          getColor={(id) => (id ? classColorMap[id] : undefined)}
          imageWidth={IMAGE_WIDTH}
          imageHeight={IMAGE_HEIGHT}
          fillOpacity={0.22}
          emphasize
        />
      </div>
    </div>
  )
}

export const Interactive: Story = {
  args: { getColor: (id) => (id ? classColorMap[id] : undefined), imageWidth: IMAGE_WIDTH, imageHeight: IMAGE_HEIGHT },
  render: () => (
    <StorybookPage
      title="AnnotationOverlay — Interactive"
      description="Drag to draw bboxes, click to drop points. Use the toolbar to switch tool and class. AnnotationOverlay itself stays display-only (pointer-events: none) — input is wired by the surrounding frame."
    >
      <StorybookSection title="Draw on a landscape thumbnail" description="cover-crop boundary respected — clicks outside the visible square are clamped.">
        <StorybookCard title="Bbox + Point demo" subtitle="dent / scratch / glare 클래스 전환 가능">
          <InteractiveDemo />
        </StorybookCard>
      </StorybookSection>
    </StorybookPage>
  ),
}
