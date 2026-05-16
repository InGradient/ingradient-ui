import type { Meta, StoryObj } from '@storybook/react-vite'
import sample from '../../../stories/assets/20230808.jpg'
import { ImageInspectorCanvas } from './image-inspector-canvas'

const SAMPLE_URL = sample as unknown as string

const meta = {
  title: 'Patterns/Shells/ImageInspectorCanvas',
  component: ImageInspectorCanvas,
  parameters: { layout: 'centered' },
  decorators: [
    (Story) => (
      <div style={{ width: 640, background: 'var(--ig-color-surface-canvas)', padding: 16 }}>
        <Story />
      </div>
    ),
  ],
  args: {
    imageUrl: SAMPLE_URL,
    imageAlt: 'sample wafer',
  },
} satisfies Meta<typeof ImageInspectorCanvas>

export default meta

type Story = StoryObj<typeof meta>

const SAMPLE_BOXES = [
  { id: 'b-1', label: 'Crack', color: '#ff6b6b', x: 0.12, y: 0.18, width: 0.32, height: 0.24 },
  { id: 'b-2', label: 'Scratch', color: '#feca57', x: 0.55, y: 0.42, width: 0.28, height: 0.18 },
  { id: 'b-3', label: 'Dent', color: '#48dbfb', x: 0.32, y: 0.62, width: 0.18, height: 0.2 },
]

const SAMPLE_POINTS = [
  { id: 'p-1', label: 'Bubble', color: '#a55eea', x: 0.45, y: 0.28 },
  { id: 'p-2', label: 'Spot', color: '#1dd1a1', x: 0.7, y: 0.55 },
]

export const Empty: Story = { args: { boxes: [], points: [] } }

export const WithBoxes: Story = { args: { boxes: SAMPLE_BOXES } }

export const WithPoints: Story = { args: { points: SAMPLE_POINTS } }

export const BoxesAndPoints: Story = {
  args: { boxes: SAMPLE_BOXES, points: SAMPLE_POINTS },
}

export const NoLabels: Story = {
  args: { boxes: SAMPLE_BOXES, showLabels: false },
}

export const HighZoom: Story = {
  args: { boxes: SAMPLE_BOXES, maxZoom: 20 },
}
