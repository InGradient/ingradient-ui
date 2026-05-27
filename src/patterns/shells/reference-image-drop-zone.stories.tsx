import type { Meta, StoryObj } from '@storybook/react-vite'
import { ReferenceImageDropZone } from './reference-image-drop-zone'
import sample1 from '../../../stories/assets/20230808.jpg'

const meta: Meta<typeof ReferenceImageDropZone> = {
  title: 'Patterns/ReferenceImageDropZone',
  component: ReferenceImageDropZone,
  decorators: [(Story) => <div style={{ width: 268, padding: 16, background: 'var(--ig-color-surface-panel)' }}><Story /></div>],
}
export default meta

type Story = StoryObj<typeof meta>

export const Empty: Story = {
  args: { children: <span style={{ color: 'var(--ig-color-text-muted)', fontSize: 12 }}>No reference image yet.</span> },
}

export const Dragging: Story = {
  args: { dragging: true, children: <span style={{ color: 'var(--ig-color-text-muted)', fontSize: 12 }}>Drop here to set reference</span> },
}

export const WithImage: Story = {
  args: {
    hasImage: true,
    children: <img src={sample1 as string} alt="reference" style={{ width: '100%', borderRadius: 10, maxHeight: 240, objectFit: 'contain' }} />,
  },
}
