import type { Meta, StoryObj } from '@storybook/react-vite'
import { useState } from 'react'
import { ImageDetailClassList, type ImageDetailClassListProps } from './image-detail-class-list'

const SAMPLE_CLASSES = [
  { id: 'cl-1', name: 'Crack', color: '#ff6b6b' },
  { id: 'cl-2', name: 'Scratch', color: '#feca57' },
  { id: 'cl-3', name: 'Dent', color: '#48dbfb' },
  { id: 'cl-4', name: 'Stain', color: '#a55eea' },
  { id: 'cl-5', name: 'Rust spot', color: '#1dd1a1' },
]

function Demo(props: Omit<ImageDetailClassListProps, 'onSelectClass'>) {
  const [selected, setSelected] = useState<string | null>(props.selectedClassId ?? null)
  return (
    <ImageDetailClassList
      {...props}
      selectedClassId={selected}
      onSelectClass={(id) => setSelected((prev) => (prev === id ? null : id))}
    />
  )
}

const meta = {
  title: 'Patterns/Shells/ImageDetailClassList',
  component: Demo,
  parameters: { layout: 'centered' },
  decorators: [
    (Story) => (
      <div style={{ width: 280, background: 'var(--ig-color-surface-panel)', padding: 12 }}>
        <Story />
      </div>
    ),
  ],
  args: { classes: SAMPLE_CLASSES },
} satisfies Meta<typeof Demo>

export default meta

type Story = StoryObj<typeof meta>

export const Default: Story = {}
export const Selected: Story = { args: { selectedClassId: 'cl-2' } }
export const Classified: Story = { args: { classifiedClassIds: ['cl-1', 'cl-3'] } }
export const Empty: Story = { args: { classes: [] } }
export const LongName: Story = {
  args: {
    classes: [
      { id: 'cl-1', name: 'Very long class name that overflows the row and should ellipsize', color: '#ff6b6b' },
      { id: 'cl-2', name: 'Short', color: '#48dbfb' },
    ],
  },
}
