import type { Meta, StoryObj } from '@storybook/react-vite'
import { ExportProgressModal } from './export-progress-modal'

const meta: Meta<typeof ExportProgressModal> = {
  title: 'Patterns/ExportProgressModal',
  component: ExportProgressModal,
  parameters: { layout: 'fullscreen' },
}
export default meta

type Story = StoryObj<typeof meta>

export const Preparing: Story = {
  args: { open: true, phase: 'preparing', progress: 5, onClose: () => undefined },
}
export const Processing: Story = {
  args: { open: true, phase: 'processing', progress: 64, onClose: () => undefined },
}
export const Ready: Story = {
  args: { open: true, phase: 'ready', downloadUrl: '#', filename: 'wafer-batch.zip', onClose: () => undefined },
}
export const Error: Story = {
  args: { open: true, phase: 'error', errorMessage: 'Compression failed — try again.', onClose: () => undefined },
}
export const Customized: Story = {
  args: {
    open: true,
    phase: 'processing',
    progress: 30,
    title: 'Export (.igp)',
    description: 'Export the dataset as a single .igp archive containing images, labels, and metadata.',
    phaseLabel: { processing: 'Compressing files…' },
    onClose: () => undefined,
  },
}
