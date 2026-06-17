import { useState } from 'react'
import type { Meta, StoryObj } from '@storybook/react-vite'
import { GalleryImagesTable, type GalleryImagesTableImage } from './gallery-images-table'
import sample1 from '../../../../../stories/assets/20230808.jpg'
import sample2 from '../../../../../stories/assets/20230816.jpg'
import sample3 from '../../../../../stories/assets/20230823.jpg'

const meta: Meta<typeof GalleryImagesTable> = {
  title: 'Platform Pages/Catalog/Gallery/GalleryImagesTable',
  component: GalleryImagesTable,
  parameters: { layout: 'fullscreen' },
}
export default meta

type Story = StoryObj<typeof meta>

const IMAGES: GalleryImagesTableImage[] = [
  { id: '1', thumb_url: sample1 as string, name: '20230808-wafer-001.jpg', dataset_id: 'd1', sequence_id: 'seq-1', sequence_step: 0, pattern_label: 'A', sync_state: 'synced', created_at: '2024-03-12' },
  { id: '2', thumb_url: sample2 as string, name: '20230816-wafer-002.jpg', dataset_id: 'd1', sequence_id: 'seq-1', sequence_step: 1, pattern_label: 'A', sync_state: 'uploading', created_at: '2024-03-12' },
  { id: '3', thumb_url: sample3 as string, name: 'long-very-long-filename-batch-2024-q4-line-a-wafer-003.jpg', dataset_id: 'd2', sync_state: 'upload_failed', created_at: '2024-03-13' },
]

function Demo() {
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set(['1']))
  return (
    <div style={{ padding: 'var(--ig-space-5)' }}>
      <GalleryImagesTable
        images={IMAGES}
        selectedIds={selectedIds}
        datasetNameById={{ d1: 'Wafer line A', d2: 'Surface defects' }}
        onToggleSelect={(id, checked) => setSelectedIds((prev) => {
          const next = new Set(prev)
          if (checked) next.add(id); else next.delete(id)
          return next
        })}
        onRowClick={(id) => console.log('row', id)}
        onOpenMenu={(id) => console.log('menu', id)}
      />
    </div>
  )
}

export const Default: Story = { render: () => <Demo /> }
