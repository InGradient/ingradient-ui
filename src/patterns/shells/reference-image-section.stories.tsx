import { useState } from 'react'
import type { Meta, StoryObj } from '@storybook/react-vite'
import { ReferenceImageSection } from './reference-image-section'
import sample1 from '../../../stories/assets/20230808.jpg'

const meta: Meta<typeof ReferenceImageSection> = {
  title: 'Patterns/ReferenceImageSection',
  component: ReferenceImageSection,
  decorators: [(Story) => <div style={{ width: 268, padding: 16, background: 'var(--ig-color-surface-panel)' }}><Story /></div>],
}
export default meta

type Story = StoryObj<typeof meta>

export const Empty: Story = { args: {} }

export const Dragging: Story = { args: { dragging: true } }

export const WithImage: Story = { args: { imageUrl: sample1 as string } }

export const MultiBbox: Story = {
  args: {
    imageUrl: sample1 as string,
    candidates: [
      { imageId: 'img-1', bboxIndex: 0 },
      { imageId: 'img-1', bboxIndex: 1 },
      { imageId: 'img-1', bboxIndex: 2 },
    ],
  },
}

export const Pending: Story = { args: { pending: true } }

export const Error: Story = { args: { errorMessage: 'Failed to update reference image. Try again.' } }

export const Interactive: Story = {
  render: () => {
    const [imageUrl, setImageUrl] = useState<string | null>(null)
    const [dragging, setDragging] = useState(false)
    return (
      <ReferenceImageSection
        imageUrl={imageUrl}
        dragging={dragging}
        onSetDragging={setDragging}
        onApply={() => setImageUrl(sample1 as string)}
      />
    )
  },
}
