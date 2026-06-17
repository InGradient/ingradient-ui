import type { Meta, StoryObj } from '@storybook/react-vite'
import { ClassLightbox, type ClassLightboxItem } from './class-lightbox'
import sample1 from '../../../stories/assets/20230808.jpg'

const baseItem: ClassLightboxItem = {
  id: 'img-1',
  name: 'wafer-001.jpg',
  width: 1024,
  height: 768,
}

const meta: Meta<typeof ClassLightbox> = {
  title: 'Platform Pages/Class Manage/ClassLightbox',
  component: ClassLightbox,
  parameters: { layout: 'fullscreen' },
}
export default meta

type Story = StoryObj<typeof meta>

export const Single: Story = {
  args: {
    open: true,
    item: baseItem,
    imageUrl: sample1 as string,
    onClose: () => undefined,
  },
}

export const Closed: Story = {
  args: { open: false, item: baseItem, imageUrl: sample1 as string, onClose: () => undefined },
}
