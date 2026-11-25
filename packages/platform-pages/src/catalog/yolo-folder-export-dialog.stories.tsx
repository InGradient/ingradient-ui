import type { Meta, StoryObj } from '@storybook/react-vite'
import { YoloFolderExportDialog } from './yolo-folder-export-dialog'

const meta: Meta<typeof YoloFolderExportDialog> = {
  id: 'platform-pages-catalog-yolofolderexportdialog',
  title: 'Components/Platform/Catalog/YoloFolderExportDialog',
  component: YoloFolderExportDialog,
  parameters: { layout: 'fullscreen' },
  args: { open: true, datasetName: 'Surface defects', onClose: () => undefined, onSubmit: () => undefined },
}
export default meta

type Story = StoryObj<typeof meta>

export const Form: Story = { args: { phase: 'form' } }
export const Running: Story = { args: { phase: 'running', progress: 64 } }
export const Completed: Story = {
  args: { phase: 'completed', outputDir: '/data/exports/surface-defects', carriedEntries: ['notes.json', 'README.md'] },
}
export const Failed: Story = {
  args: { phase: 'failed', error: 'Output folder already exists.' },
}
