import type { Meta, StoryObj } from '@storybook/react-vite'
import { DragDropDecideModal } from './drag-drop-decide-modal'

const meta: Meta<typeof DragDropDecideModal> = {
  title: 'Platform Pages/Catalog/DragDropDecideModal',
  component: DragDropDecideModal,
  parameters: { layout: 'fullscreen' },
}
export default meta

type Story = StoryObj<typeof meta>

export const Default: Story = {
  args: { open: true, sourceDatasetName: 'Wafer A', targetDatasetName: 'Wafer B', itemCount: 12, onClose: () => undefined, onConfirm: () => undefined },
}
