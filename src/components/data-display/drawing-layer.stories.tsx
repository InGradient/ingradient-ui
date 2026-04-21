import type { Meta, StoryObj } from '@storybook/react-vite'
import { DrawingLayer, type DrawingObject } from './drawing-layer'
import { StorybookCard, StorybookGrid, StorybookPage, StorybookSection, StorybookStack } from '@storybook-support/storybook-layout'

const CANVAS_WIDTH = 640
const CANVAS_HEIGHT = 360

const sampleObjects: DrawingObject[] = [
  { id: 'dent', type: 'rect', x: 0.13, y: 0.18, w: 0.22, h: 0.18, color: '#ff7f66', label: 'Dent' },
  { id: 'glare', type: 'point', x: 0.69, y: 0.41, color: '#7ce0be', label: 'Glare' },
  { id: 'scratch', type: 'rect', x: 0.52, y: 0.58, w: 0.16, h: 0.12, color: '#6fb6ff', label: 'Scratch' },
]

const meta = {
  title: 'Components/Data Display/DrawingLayer',
  component: DrawingLayer,
  tags: ['autodocs'],
  parameters: {
    a11y: {
      test: 'todo',
    },
  },
  args: {
    objects: sampleObjects,
    containerWidth: CANVAS_WIDTH,
    containerHeight: CANVAS_HEIGHT,
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
                <DrawingLayer
                  objects={sampleObjects}
                  containerWidth={CANVAS_WIDTH}
                  containerHeight={CANVAS_HEIGHT}
                  showLabels
                />
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
                  containerWidth={CANVAS_WIDTH}
                  containerHeight={CANVAS_HEIGHT}
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
                  containerWidth={CANVAS_WIDTH}
                  containerHeight={CANVAS_HEIGHT}
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
    </StorybookPage>
  ),
}
