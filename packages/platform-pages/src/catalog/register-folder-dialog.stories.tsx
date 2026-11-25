import type { Meta, StoryObj } from '@storybook/react-vite'
import { RegisterFolderDialog } from './register-folder-dialog'

const meta: Meta<typeof RegisterFolderDialog> = {
  id: 'platform-pages-catalog-registerfolderdialog',
  title: 'Components/Platform/Catalog/RegisterFolderDialog',
  component: RegisterFolderDialog,
  parameters: { layout: 'fullscreen' },
  args: { open: true, onClose: () => undefined, onSubmit: () => undefined },
}
export default meta

type Story = StoryObj<typeof meta>

export const Form: Story = { args: { phase: 'form' } }
export const Running: Story = { args: { phase: 'running', progress: { done: 240, total: 600 } } }
export const RunningWithoutTotal: Story = { args: { phase: 'running' } }
export const Completed: Story = {
  args: {
    phase: 'completed',
    report: {
      images: 600,
      boxes: 1842,
      per_class: [
        { name: 'scratch', boxes: 912 },
        { name: 'dent', boxes: 530 },
        { name: 'stain', boxes: 400 },
      ],
      missing_labels: ['img_0041.png', 'img_0377.png'],
      orphan_labels: ['img_0999.txt'],
    },
  },
}
export const Failed: Story = {
  args: { phase: 'failed', error: 'Folder is not under an allowed root.' },
}
