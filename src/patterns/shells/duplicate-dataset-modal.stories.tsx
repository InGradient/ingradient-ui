import type { Meta, StoryObj } from '@storybook/react-vite'
import { DuplicateDatasetModal } from './duplicate-dataset-modal'

const meta: Meta<typeof DuplicateDatasetModal> = {
  title: 'Patterns/DuplicateDatasetModal',
  component: DuplicateDatasetModal,
  parameters: { layout: 'fullscreen' },
}
export default meta

type Story = StoryObj<typeof meta>

export const Default: Story = {
  args: { open: true, defaultName: 'Wafer batch — copy', onClose: () => undefined, onSubmit: () => undefined },
}
export const Submitting: Story = {
  args: { open: true, defaultName: 'Wafer batch — copy', submitting: true, onClose: () => undefined, onSubmit: () => undefined },
}
