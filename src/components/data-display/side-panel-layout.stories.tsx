import type { Meta, StoryObj } from '@storybook/react-vite'
import { SidePanelLayout } from './side-panel-layout'
import { SwatchItemList } from './swatch-item-list'

const CLASSES = [
  { id: 'c1', name: 'Crack', color: '#ff6b6b', count: 412 },
  { id: 'c2', name: 'Scratch', color: '#feca57', count: 318 },
  { id: 'c3', name: 'Dent', color: '#48dbfb', count: 247 },
]

const meta: Meta<typeof SidePanelLayout> = {
  title: 'Components/Data Display/SidePanelLayout',
  component: SidePanelLayout,
  parameters: { layout: 'fullscreen' },
  decorators: [(Story) => <div style={{ width: 320, height: '100vh', borderLeft: '1px solid var(--ig-color-border-subtle)' }}><Story /></div>],
}
export default meta

type Story = StoryObj<typeof meta>

export const Default: Story = {
  args: {
    sections: [
      {
        title: 'Class',
        body: <SwatchItemList items={CLASSES.map((c) => ({ id: c.id, label: c.name, color: c.color, count: c.count }))} onRemove={() => undefined} />,
      },
      {
        title: 'Members',
        body: <div style={{ color: 'var(--ig-color-text-muted)', fontSize: 'var(--ig-font-size-sm)' }}>Member pool slot</div>,
      },
    ],
  },
}

export const EmptyState: Story = {
  args: {
    sections: [
      {
        title: 'Class',
        body: <span style={{ color: 'var(--ig-color-text-muted)', fontSize: 'var(--ig-font-size-sm)' }}>No items.</span>,
      },
    ],
  },
}
