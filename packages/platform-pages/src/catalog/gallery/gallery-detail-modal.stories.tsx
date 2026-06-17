import { useState } from 'react'
import type { Meta, StoryObj } from '@storybook/react-vite'
import { GalleryDetailModal } from './gallery-detail-modal'
import { Button } from '@ingradient/ui/components'
import sample1 from '../../../../../stories/assets/20230808.jpg'

const meta: Meta<typeof GalleryDetailModal> = {
  title: 'Platform Pages/Catalog/Gallery/GalleryDetailModal',
  component: GalleryDetailModal,
  parameters: { layout: 'fullscreen' },
}
export default meta

type Story = StoryObj<typeof meta>

const sampleImage = {
  id: 'img-1',
  name: '20230808-wafer-001.jpg',
  thumb_url: sample1 as string,
  sync_state: 'synced' as const,
  width: 4096,
  height: 3072,
  size_bytes: 3_245_678,
  uploader: 'jhlee',
  created_at: '2024-03-12 09:24',
  dataset_id: 'Wafer line A',
  sequence_id: 'seq-1',
  pattern_label: 'A',
}

function Demo() {
  const [open, setOpen] = useState(true)
  return (
    <div style={{ padding: 'var(--ig-space-7)' }}>
      <Button onClick={() => setOpen(true)}>Open modal</Button>
      <GalleryDetailModal image={sampleImage} open={open} onClose={() => setOpen(false)} />
    </div>
  )
}

export const Default: Story = { render: () => <Demo /> }
