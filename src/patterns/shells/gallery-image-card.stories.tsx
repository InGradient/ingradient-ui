import type { Meta, StoryObj } from '@storybook/react-vite'
import { GalleryImageCard } from './gallery-image-card'
import { Grid } from '../../primitives'
import sample1 from '../../../stories/assets/20230808.jpg'
import sample2 from '../../../stories/assets/20230816.jpg'
import sample3 from '../../../stories/assets/20230823.jpg'

const meta: Meta<typeof GalleryImageCard> = {
  title: 'Patterns/GalleryImageCard',
  component: GalleryImageCard,
  tags: ['autodocs'],
}
export default meta

type Story = StoryObj<typeof meta>

const baseImage = { id: 'img-1', name: '20230808-wafer-001.jpg', thumb_url: sample1 as string }

export const Default: Story = { args: { image: baseImage } }
export const Selected: Story = { args: { image: baseImage, selected: true } }
export const Synced: Story = { args: { image: { ...baseImage, sync_state: 'synced' } } }
export const Uploading: Story = { args: { image: { ...baseImage, sync_state: 'uploading' } } }
export const Failed: Story = { args: { image: { ...baseImage, sync_state: 'upload_failed' } } }
export const Archived: Story = { args: { image: { ...baseImage, archived: true } } }
export const Processing: Story = { args: { image: { ...baseImage, processing: true } } }
export const GroupOf5: Story = { args: { image: { ...baseImage, group_count: 5, sync_state: 'synced' } } }
export const LongName: Story = {
  args: { image: { ...baseImage, name: 'very-long-image-filename-2024-q4-batch-3-wafer-line-a-001-cropped.jpg' } },
}

export const Grid3x3: Story = {
  render: () => (
    <Grid columns="repeat(3, 1fr)" gap={3} style={{ width: 720 }}>
      <GalleryImageCard image={{ id: '1', name: 'A.jpg', thumb_url: sample1 as string, sync_state: 'synced' }} />
      <GalleryImageCard image={{ id: '2', name: 'B.jpg', thumb_url: sample2 as string, sync_state: 'uploading' }} selected />
      <GalleryImageCard image={{ id: '3', name: 'C.jpg', thumb_url: sample3 as string, sync_state: 'upload_failed' }} />
      <GalleryImageCard image={{ id: '4', name: 'D.jpg', thumb_url: sample1 as string, archived: true }} />
      <GalleryImageCard image={{ id: '5', name: 'E.jpg', thumb_url: sample2 as string, processing: true }} />
      <GalleryImageCard image={{ id: '6', name: 'F.jpg', thumb_url: sample3 as string, group_count: 12, sync_state: 'synced' }} />
    </Grid>
  ),
}
