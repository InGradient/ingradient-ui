import type { Meta, StoryObj } from '@storybook/react-vite'
import { Badge } from '../../components'
import { GalleryImageGrid } from './gallery-image-grid'
import sample1 from '../../../stories/assets/20230808.jpg'
import sample2 from '../../../stories/assets/20230816.jpg'
import sample3 from '../../../stories/assets/20230823.jpg'

const images = [
  { id: '1', name: 'A.jpg', thumb_url: sample1 as string, sync_state: 'synced' as const },
  { id: '2', name: 'B.jpg', thumb_url: sample2 as string, sync_state: 'uploading' as const },
  { id: '3', name: 'C.jpg', thumb_url: sample3 as string, sync_state: 'upload_failed' as const },
  { id: '4', name: 'D.jpg', thumb_url: sample1 as string, archived: true },
  { id: '5', name: 'E.jpg', thumb_url: sample2 as string, processing: true },
  { id: '6', name: 'F.jpg', thumb_url: sample3 as string, group_count: 12 },
]

const meta: Meta<typeof GalleryImageGrid> = {
  title: 'Patterns/GalleryImageGrid',
  component: GalleryImageGrid,
  tags: ['autodocs'],
  parameters: { layout: 'padded' },
}
export default meta

type Story = StoryObj<typeof meta>

export const Default: Story = {
  render: () => (
    <GalleryImageGrid
      items={images}
      selectedIds={new Set(['2'])}
      renderTopRight={(image) => (image.group_count ? <Badge $tone="neutral">4</Badge> : null)}
    />
  ),
}

export const Compact: Story = {
  render: () => <GalleryImageGrid items={images} minItemWidth={120} showKebab={false} />,
}

export const Padded: Story = {
  render: () => <GalleryImageGrid items={images} padded showKebab={false} />,
}
