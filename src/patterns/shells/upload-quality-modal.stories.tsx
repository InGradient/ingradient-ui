import type { Meta, StoryObj } from '@storybook/react-vite'
import { UploadQualityModal } from './upload-quality-modal'

const meta: Meta<typeof UploadQualityModal> = {
  title: 'Patterns/UploadQualityModal',
  component: UploadQualityModal,
  parameters: { layout: 'fullscreen' },
}
export default meta

type Story = StoryObj<typeof meta>

export const Default: Story = {
  args: { open: true, fileCount: 12, onClose: () => undefined, onConfirm: () => undefined },
}
