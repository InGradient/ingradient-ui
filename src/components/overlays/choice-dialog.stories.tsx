import type { Meta, StoryObj } from '@storybook/react-vite'
import { ChoiceDialog } from './choice-dialog'

const meta: Meta<typeof ChoiceDialog> = {
  title: 'Components/Overlays/ChoiceDialog',
  component: ChoiceDialog,
  parameters: { layout: 'fullscreen' },
  args: {
    open: true,
    title: 'Add images',
    options: [
      { value: 'upload', label: 'Upload files — Copies the files into storage.' },
      { value: 'register', label: 'Register a folder — Keeps the files where they are.' },
    ],
    onClose: () => undefined,
    onContinue: () => undefined,
  },
}
export default meta

type Story = StoryObj<typeof meta>

export const Default: Story = {}
export const FirstOptionDisabled: Story = {
  args: {
    options: [
      { value: 'upload', label: 'Upload files — Copies the files into storage.', disabled: true },
      { value: 'register', label: 'Register a folder — Keeps the files where they are.' },
    ],
  },
}
export const CustomLabels: Story = {
  args: { title: 'Export', cancelLabel: 'Back', continueLabel: 'Next' },
}
