import React from 'react'
import type { Meta, StoryObj } from '@storybook/react-vite'
import { Button, ModeSwitcher } from '@ingradient/ui/components'
import { useDrawingCanvas, type DrawingMode, type DrawingObject } from '../../hooks'
import { DrawingLayer } from './drawing-layer'
import { ImageViewer } from './image-viewer'
import { buildViewerObjects, resolveReviewScale, type ReviewScale } from '@storybook-support/../builders/review-builders'
import { StorybookCard, StorybookGrid, StorybookMetaBar, StorybookPage, StorybookSection, StorybookStack } from '@storybook-support/storybook-layout'

const VIEWER_WIDTH = 720
const VIEWER_HEIGHT = 420

const SAMPLE_IMAGE = `data:image/svg+xml;utf8,${encodeURIComponent(`
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${VIEWER_WIDTH} ${VIEWER_HEIGHT}">
    <defs>
      <linearGradient id="bg" x1="0" x2="1" y1="0" y2="1">
        <stop offset="0%" stop-color="#112f57" />
        <stop offset="100%" stop-color="#1d7568" />
      </linearGradient>
    </defs>
    <rect width="${VIEWER_WIDTH}" height="${VIEWER_HEIGHT}" fill="url(#bg)" />
    <circle cx="145" cy="122" r="72" fill="rgba(255,255,255,0.14)" />
    <circle cx="565" cy="308" r="110" fill="rgba(255,255,255,0.11)" />
    <rect x="102" y="92" width="210" height="120" rx="18" fill="rgba(255,255,255,0.09)" stroke="rgba(255,255,255,0.25)" />
    <rect x="410" y="178" width="156" height="104" rx="18" fill="rgba(255,255,255,0.07)" stroke="rgba(255,255,255,0.2)" />
    <text x="48" y="368" font-family="IBM Plex Sans, sans-serif" font-size="28" fill="white" opacity="0.92">Inspection Sample</text>
  </svg>
`)}` 

type ImageViewerStoryArgs = {
  annotationDensity: ReviewScale | 'auto'
  modePreset: DrawingMode
}

const meta = {
  title: 'Components/Data Display/ImageViewer',
  component: ImageViewer as unknown as React.ComponentType<ImageViewerStoryArgs>,
  tags: ['autodocs'],
  parameters: {
    layout: 'fullscreen',
    a11y: {
      test: 'todo',
    },
  },
  args: {
    annotationDensity: 'auto',
    modePreset: 'cursor',
  },
  argTypes: {
    annotationDensity: {
      control: 'inline-radio',
      options: ['auto', 'sparse', 'realistic', 'overloaded'],
    },
    modePreset: {
      control: 'inline-radio',
      options: ['cursor', 'rect', 'point'],
    },
  },
} satisfies Meta<ImageViewerStoryArgs>

export default meta

type Story = StoryObj<ImageViewerStoryArgs>

function ViewerReviewDemo({
  initialMode,
  scale,
}: {
  initialMode: DrawingMode
  scale: ReviewScale
}) {
  const initialObjects = React.useMemo<DrawingObject[]>(() => buildViewerObjects(scale), [scale])
  const [mode, setMode] = React.useState<DrawingMode>(initialMode)
  const [objects, setObjects] = React.useState<DrawingObject[]>(initialObjects)
  const [completedAction, setCompletedAction] = React.useState('No drawing action yet.')
  const { selectedId, drawingPreview, cursor, bindings } = useDrawingCanvas({
    objects,
    mode,
    onObjectsChange: setObjects,
    onComplete: (nextObjects, action) => {
      setCompletedAction(`${action ?? 'unknown'} completed with ${nextObjects.length} object(s).`)
    },
  })

  return (
    <StorybookGrid columns="minmax(0, 2fr) minmax(280px, 1fr)">
      <StorybookCard title="Viewer + overlay" subtitle="draw, select, inspect">
        <StorybookStack gap={12}>
          <div style={{ display: 'flex', justifyContent: 'space-between', gap: 12, flexWrap: 'wrap', alignItems: 'center' }}>
            <ModeSwitcher
              options={[
                { value: 'cursor', label: 'Select' },
                { value: 'rect', label: 'Rect' },
                { value: 'point', label: 'Point' },
              ]}
              value={mode}
              onChange={(next) => setMode(next as DrawingMode)}
              size="sm"
            />
            <Button variant="secondary" onClick={() => setObjects(initialObjects)}>
              Reset objects
            </Button>
          </div>
          <div
            style={{
              position: 'relative',
              height: 380,
              borderRadius: 24,
              overflow: 'hidden',
              border: '1px solid var(--ig-color-border-subtle)',
              background: 'var(--ig-color-surface-panel)',
              cursor,
            }}
            {...bindings}
          >
            <ImageViewer src={SAMPLE_IMAGE} alt="Inspection sample">
              <DrawingLayer
                objects={objects}
                selectedId={selectedId}
                drawingPreview={drawingPreview}
                showHandles
                showLabels
                showCrosshair={mode !== 'cursor'}
                cursorX={mode !== 'cursor' ? 0.5 : undefined}
                cursorY={mode !== 'cursor' ? 0.5 : undefined}
                containerWidth={VIEWER_WIDTH}
                containerHeight={VIEWER_HEIGHT}
              />
            </ImageViewer>
          </div>
          <div style={{ fontSize: 13, color: 'var(--ig-color-text-soft)' }}>
            Use mouse wheel to zoom, double-click to reset, then switch to rect or point mode to validate overlay behavior.
          </div>
        </StorybookStack>
      </StorybookCard>
      <StorybookCard title="State contract" subtitle="consumer-managed data">
        <StorybookStack gap={12}>
          <div style={{ fontSize: 13, color: 'var(--ig-color-text-secondary)' }}>
            Selected object: <strong>{selectedId ?? 'none'}</strong>
          </div>
          <div style={{ fontSize: 13, color: 'var(--ig-color-text-secondary)' }}>
            Current mode: <strong>{mode}</strong>
          </div>
          <div style={{ fontSize: 13, color: 'var(--ig-color-text-secondary)' }}>
            Last completion: <strong>{completedAction}</strong>
          </div>
          <div
            style={{
              border: '1px solid var(--ig-color-border-subtle)',
              borderRadius: 16,
              padding: 14,
              background: 'var(--ig-color-surface-panel)',
              fontSize: 13,
              color: 'var(--ig-color-text-soft)',
              whiteSpace: 'pre-wrap',
            }}
          >
            {JSON.stringify(objects, null, 2)}
          </div>
        </StorybookStack>
      </StorybookCard>
    </StorybookGrid>
  )
}

export const Review: Story = {
  render: (args, context) => {
    const scale = args.annotationDensity === 'auto' ? resolveReviewScale(context.globals.dataScale) : args.annotationDensity

    return (
      <StorybookPage
        title="Image Viewer"
        description="ImageViewer is the isolated inspection shell. Zoom/pan stays internal, while drawing data and workflow state remain under consumer control."
        meta={
          <StorybookMetaBar
            items={[
              { label: 'beta', tone: 'warning' },
              { label: 'consumer-verified', tone: 'accent' },
              { label: `${scale} overlays`, tone: scale === 'overloaded' ? 'warning' : 'neutral' },
            ]}
          />
        }
      >
        <StorybookSection
          title="Inspection review"
          description="This story replaces the old live example by keeping viewer interaction and overlay state visible together."
        >
          <ViewerReviewDemo initialMode={args.modePreset} scale={scale} />
        </StorybookSection>
      </StorybookPage>
    )
  },
}
