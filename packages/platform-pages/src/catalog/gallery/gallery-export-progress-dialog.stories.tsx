import type { Meta, StoryObj } from '@storybook/react-vite'
import { GalleryExportProgressDialog } from './gallery-export-progress-dialog'

const meta: Meta<typeof GalleryExportProgressDialog> = {
  title: 'Platform Pages/Catalog/Gallery/GalleryExportProgressDialog',
  component: GalleryExportProgressDialog,
  parameters: { layout: 'fullscreen' },
}

export default meta
type Story = StoryObj<typeof GalleryExportProgressDialog>

const baseArgs = {
  open: true,
  jobId: 'job_abc',
  onClose: () => undefined,
  onDownloadAgain: () => undefined,
}

export const Queued: Story = {
  args: { ...baseArgs, job: { status: 'queued', stage: 'queued', progress: 0, processed_samples: 0, total_samples: 1248 } },
}
export const CollectingSamples: Story = {
  args: {
    ...baseArgs,
    job: { status: 'running', stage: 'collecting_samples', progress: 28, processed_samples: 350, total_samples: 1248 },
  },
}
export const PackagingZip: Story = {
  args: {
    ...baseArgs,
    job: { status: 'running', stage: 'packaging_zip', progress: 84, processed_samples: 1050, total_samples: 1248 },
  },
}
export const Completed: Story = {
  args: {
    ...baseArgs,
    job: { status: 'completed', stage: 'starting_download', progress: 100, processed_samples: 1248, total_samples: 1248 },
    downloadedJobId: 'job_abc',
  },
}
export const Failed: Story = {
  args: {
    ...baseArgs,
    job: { status: 'failed', stage: 'failed', progress: 64, processed_samples: 800, total_samples: 1248, error: 'Disk full' },
  },
}
