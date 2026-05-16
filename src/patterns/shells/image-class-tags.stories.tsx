import type { Meta, StoryObj } from '@storybook/react-vite'
import { ImageClassTags } from './image-class-tags'

const meta: Meta<typeof ImageClassTags> = {
  title: 'Patterns/ImageClassTags',
  component: ImageClassTags,
  parameters: { layout: 'centered' },
}
export default meta

type Story = StoryObj<typeof meta>

export const Default: Story = {
  args: {
    tags: [
      { id: 'cl-1', name: 'Crack', color: '#ff6b6b', count: 3 },
      { id: 'cl-2', name: 'Scratch', color: '#feca57' },
      { id: 'cl-3', name: 'Dent', color: '#48dbfb', count: 1 },
    ],
  },
}

export const Empty: Story = { args: { tags: [] } }
