import type { Meta, StoryObj } from '@storybook/react-vite'
import { AnnotationViewer } from './annotation-viewer'
import sample1 from '../../../stories/assets/20230808.jpg'

const meta: Meta<typeof AnnotationViewer> = {
  title: 'Patterns/AnnotationViewer',
  component: AnnotationViewer,
  parameters: { layout: 'padded' },
  decorators: [(Story) => <div style={{ width: 520 }}><Story /></div>],
}
export default meta

type Story = StoryObj<typeof meta>

export const WithBoxes: Story = {
  args: {
    imageUrl: sample1 as string,
    boxes: [
      { id: 'b1', label: 'Crack', color: '#ff6b6b', x: 0.12, y: 0.18, width: 0.32, height: 0.24 },
      { id: 'b2', label: 'Scratch', color: '#feca57', x: 0.55, y: 0.42, width: 0.28, height: 0.18 },
      { id: 'b3', label: 'Dent', color: '#48dbfb', x: 0.32, y: 0.62, width: 0.18, height: 0.20 },
    ],
  },
}

export const WithPolygons: Story = {
  args: {
    imageUrl: sample1 as string,
    polygons: [
      {
        id: 'p1', label: 'Crack', color: '#ff6b6b',
        points: [{ x: 0.1, y: 0.2 }, { x: 0.3, y: 0.15 }, { x: 0.4, y: 0.4 }, { x: 0.2, y: 0.5 }],
      },
    ],
  },
}
