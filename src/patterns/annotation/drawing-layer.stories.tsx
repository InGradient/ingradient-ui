import type { Meta, StoryObj } from '@storybook/react-vite'
import { DrawingLayer, type DrawingObject } from './drawing-layer'
import { ImageViewer } from '../../components/data-display/image-viewer'
import { StorybookCard, StorybookGrid, StorybookPage, StorybookSection, StorybookStack } from '@storybook-support/storybook-layout'

const CANVAS_WIDTH = 640
const CANVAS_HEIGHT = 360

const sampleObjects: DrawingObject[] = [
  { id: 'dent', type: 'rect', x: 0.13, y: 0.18, w: 0.22, h: 0.18, color: '#ff7f66', label: 'Dent' },
  { id: 'glare', type: 'point', x: 0.69, y: 0.41, color: '#7ce0be', label: 'Glare' },
  { id: 'scratch', type: 'rect', x: 0.52, y: 0.58, w: 0.16, h: 0.12, color: '#6fb6ff', label: 'Scratch' },
]

const ZOOM_SAMPLE_IMAGE = `data:image/svg+xml;utf8,${encodeURIComponent(`
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${CANVAS_WIDTH} ${CANVAS_HEIGHT}">
    <defs>
      <linearGradient id="bg" x1="0" x2="1" y1="0" y2="1">
        <stop offset="0%" stop-color="#112f57" />
        <stop offset="100%" stop-color="#1d7568" />
      </linearGradient>
    </defs>
    <rect width="${CANVAS_WIDTH}" height="${CANVAS_HEIGHT}" fill="url(#bg)" />
    <circle cx="160" cy="120" r="80" fill="rgba(255,255,255,0.16)" />
    <circle cx="500" cy="240" r="64" fill="rgba(255,255,255,0.12)" />
    <rect x="80" y="80" width="200" height="120" rx="14" fill="rgba(255,255,255,0.08)" stroke="rgba(255,255,255,0.25)" />
    <rect x="380" y="180" width="180" height="120" rx="14" fill="rgba(255,255,255,0.06)" stroke="rgba(255,255,255,0.2)" />
  </svg>
`)}`

const meta = {
  title: 'Patterns/Annotation/DrawingLayer',
  component: DrawingLayer,
  tags: ['autodocs'],
  parameters: {
    a11y: {
      test: 'error',
    },
  },
  args: {
    objects: sampleObjects,
    showLabels: true,
    showHandles: true,
  },
} satisfies Meta<typeof DrawingLayer>

export default meta

type Story = StoryObj<typeof meta>

function DrawingFrame({ children }: { children: React.ReactNode }) {
  return (
    <div
      style={{
        position: 'relative',
        minHeight: 280,
        borderRadius: 22,
        overflow: 'hidden',
        border: '1px solid var(--ig-color-border-subtle)',
        background:
          'linear-gradient(135deg, rgba(17,47,87,0.92) 0%, rgba(27,88,117,0.9) 45%, rgba(34,114,102,0.88) 100%)',
      }}
    >
      <div
        style={{
          position: 'absolute',
          inset: 0,
          background:
            'radial-gradient(circle at 22% 28%, rgba(255,255,255,0.14), transparent 24%), radial-gradient(circle at 72% 62%, rgba(255,255,255,0.12), transparent 28%)',
        }}
      />
      {children}
    </div>
  )
}

export const Playground: Story = {
  render: (args) => (
    <DrawingFrame>
      <DrawingLayer {...args} />
    </DrawingFrame>
  ),
}

export const Review: Story = {
  render: () => (
    <StorybookPage
      title="Drawing Layer"
      description="DrawingLayer is the pure overlay surface. It should be reviewed separately from ImageViewer so object rendering, preview styling, and selection affordances stay stable."
    >
      <StorybookSection
        title="Overlay rendering states"
        description="Use this surface to compare selected objects, drafting preview, and passive annotation mode without viewer zoom or hook logic in the way."
      >
        <StorybookGrid columns="repeat(auto-fit, minmax(280px, 1fr))">
          <StorybookCard title="Annotation set" subtitle="labels enabled">
            <StorybookStack gap={10}>
              <DrawingFrame>
                <DrawingLayer objects={sampleObjects} showLabels />
              </DrawingFrame>
              <div style={{ fontSize: 13, color: 'var(--ig-color-text-soft)' }}>
                Base annotation review with labels and no active selection.
              </div>
            </StorybookStack>
          </StorybookCard>

          <StorybookCard title="Selected object" subtitle="handles + emphasis">
            <StorybookStack gap={10}>
              <DrawingFrame>
                <DrawingLayer
                  objects={sampleObjects}
                  selectedId="dent"
                  showLabels
                  showHandles
                />
              </DrawingFrame>
              <div style={{ fontSize: 13, color: 'var(--ig-color-text-soft)' }}>
                Selected rectangles must retain readable handles at arbitrary container sizes.
              </div>
            </StorybookStack>
          </StorybookCard>

          <StorybookCard title="Drafting preview" subtitle="crosshair + preview rect">
            <StorybookStack gap={10}>
              <DrawingFrame>
                <DrawingLayer
                  objects={sampleObjects}
                  showCrosshair
                  cursorX={0.44}
                  cursorY={0.56}
                  drawingPreview={{ x: 0.35, y: 0.34, w: 0.22, h: 0.18 }}
                />
              </DrawingFrame>
              <div style={{ fontSize: 13, color: 'var(--ig-color-text-soft)' }}>
                Draft state should stay visually distinct from committed annotations.
              </div>
            </StorybookStack>
          </StorybookCard>
        </StorybookGrid>
      </StorybookSection>

      <StorybookSection
        title="Zoom-stable rendering"
        description="Inside ImageViewer, DrawingLayer auto-reads zoom + container size from ImageViewerContext. Stroke width, label size, and selection handles stay constant on screen as the user zooms."
      >
        <StorybookGrid columns="repeat(auto-fit, minmax(360px, 1fr))">
          <StorybookCard title="Auto-supply (recommended)" subtitle="no zoom/size props needed">
            <StorybookStack gap={10}>
              <div
                style={{
                  position: 'relative',
                  height: 320,
                  borderRadius: 22,
                  overflow: 'hidden',
                  border: '1px solid var(--ig-color-border-subtle)',
                  background: 'var(--ig-color-surface-panel)',
                }}
              >
                <ImageViewer src={ZOOM_SAMPLE_IMAGE} alt="Zoom test">
                  <DrawingLayer objects={sampleObjects} selectedId="dent" showLabels showHandles />
                </ImageViewer>
              </div>
              <div style={{ fontSize: 13, color: 'var(--ig-color-text-soft)' }}>
                Wheel-zoom into the canvas — bbox stroke and class label visually do not grow.
                DrawingLayer reads <code>zoom</code> + container size from ImageViewerContext (PR-D1, D-016).
              </div>
            </StorybookStack>
          </StorybookCard>

          <StorybookCard title="Standalone (explicit props)" subtitle="caller wires zoom + size">
            <StorybookStack gap={10}>
              <DrawingFrame>
                <DrawingLayer
                  objects={sampleObjects}
                  selectedId="dent"
                  containerWidth={CANVAS_WIDTH}
                  containerHeight={CANVAS_HEIGHT}
                  zoom={1}
                  showLabels
                  showHandles
                />
              </DrawingFrame>
              <div style={{ fontSize: 13, color: 'var(--ig-color-text-soft)' }}>
                When DrawingLayer is rendered outside ImageViewer (e.g. edge BBoxCanvas with its own zoomPan hook),
                pass <code>zoom</code> + <code>containerWidth/Height</code> explicitly. Explicit props always override Context.
              </div>
            </StorybookStack>
          </StorybookCard>
        </StorybookGrid>
      </StorybookSection>
    </StorybookPage>
  ),
}
