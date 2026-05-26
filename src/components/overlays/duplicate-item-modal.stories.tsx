import type { Meta, StoryObj } from '@storybook/react-vite'
import { DuplicateItemModal } from './duplicate-item-modal'

const meta: Meta<typeof DuplicateItemModal> = {
  title: 'Components/Overlays/DuplicateItemModal',
  component: DuplicateItemModal,
  parameters: { layout: 'fullscreen' },
}
export default meta

type Story = StoryObj<typeof meta>

export const Default: Story = {
  args: { open: true, defaultName: 'Item — copy', onClose: () => undefined, onSubmit: () => undefined },
}
export const WithOption: Story = {
  args: {
    open: true,
    defaultName: 'Wafer batch — copy',
    title: 'Duplicate dataset',
    option: { label: 'Copy labels and annotations', defaultChecked: true },
    onClose: () => undefined,
    onSubmit: () => undefined,
  },
}
export const Submitting: Story = {
  args: { open: true, defaultName: 'Wafer batch — copy', submitting: true, onClose: () => undefined, onSubmit: () => undefined },
}
