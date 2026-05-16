import type { Meta, StoryObj } from '@storybook/react-vite'
import { IgpExportModal } from './igp-export-modal'

const meta: Meta<typeof IgpExportModal> = {
  title: 'Patterns/IgpExportModal',
  component: IgpExportModal,
  parameters: { layout: 'fullscreen' },
}
export default meta

type Story = StoryObj<typeof meta>

export const Preparing: Story = {
  args: { open: true, phase: 'preparing', progress: 5, onClose: () => undefined },
}
export const Compressing: Story = {
  args: { open: true, phase: 'compressing', progress: 64, onClose: () => undefined },
}
export const Ready: Story = {
  args: { open: true, phase: 'ready', downloadUrl: '#', filename: 'wafer-batch.igp', onClose: () => undefined },
}
export const Error: Story = {
  args: { open: true, phase: 'error', errorMessage: 'Compression failed — try again.', onClose: () => undefined },
}
