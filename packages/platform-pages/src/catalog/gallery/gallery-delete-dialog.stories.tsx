import type { Meta, StoryObj } from '@storybook/react-vite'
import { GalleryDeleteDialog } from './gallery-delete-dialog'

const meta: Meta<typeof GalleryDeleteDialog> = {
  title: 'Platform Pages/Catalog/Gallery/GalleryDeleteDialog',
  component: GalleryDeleteDialog,
  parameters: { layout: 'fullscreen' },
}

export default meta
type Story = StoryObj<typeof GalleryDeleteDialog>

export const Single: Story = {
  args: {
    open: true,
    title: 'Delete image',
    description: 'Permanently delete "IMG_2031.jpg"? This cannot be undone.',
    confirmLabel: 'Delete',
    onClose: () => undefined,
    onConfirm: () => undefined,
  },
}

export const Bulk: Story = {
  args: {
    open: true,
    title: 'Delete 12 images',
    description: 'Permanently delete the 12 selected images? This cannot be undone.',
    confirmLabel: 'Delete 12 images',
    onClose: () => undefined,
    onConfirm: () => undefined,
  },
}

export const Deleting: Story = {
  args: {
    open: true,
    title: 'Delete 12 images',
    description: 'Permanently delete the 12 selected images? This cannot be undone.',
    isDeleting: true,
    onClose: () => undefined,
    onConfirm: () => undefined,
  },
}

export const WithError: Story = {
  args: {
    open: true,
    title: 'Delete image',
    description: 'Permanently delete "IMG_2031.jpg"? This cannot be undone.',
    error: 'Network error — please try again',
    onClose: () => undefined,
    onConfirm: () => undefined,
  },
}
