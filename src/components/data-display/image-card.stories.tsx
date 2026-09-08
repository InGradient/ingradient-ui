import type { Meta, StoryObj } from '@storybook/react-vite'
import { expect, fn } from 'storybook/test'
import { ImageCard } from './image-card'
import { Grid } from '../../primitives'
import sample1 from '../../../stories/assets/20230808.jpg'
import sample2 from '../../../stories/assets/20230816.jpg'
import sample3 from '../../../stories/assets/20230823.jpg'

const meta: Meta<typeof ImageCard> = {
  title: 'Components/Data Display/ImageCard',
  component: ImageCard,
  tags: ['autodocs'],
  parameters: {
    a11y: {
      test: 'error',
    },
  },
}
export default meta

type Story = StoryObj<typeof meta>

const baseImage = { id: 'img-1', name: '20230808-wafer-001.jpg', thumb_url: sample1 as string }

const DemoChip = ({ label }: { label: string }) => (
  <span style={{
    padding: 'var(--ig-space-2px) var(--ig-space-2)',
    borderRadius: 'var(--ig-radius-pill)',
    background: 'var(--ig-color-surface-raised)',
    color: 'var(--ig-color-text-primary)',
    fontSize: 11,
    fontWeight: 'var(--ig-font-weight-semibold)',
  }}>{label}</span>
)

export const Default: Story = { args: { image: baseImage } }
export const Selected: Story = { args: { image: baseImage, selected: true } }
export const WithTopRightSlot: Story = { args: { image: baseImage, topRightSlot: <DemoChip label="Synced" /> } }
export const Archived: Story = { args: { image: { ...baseImage, archived: true } } }
export const Processing: Story = { args: { image: { ...baseImage, processing: true } } }
export const GroupOf5: Story = { args: { image: { ...baseImage, group_count: 5 }, topRightSlot: <DemoChip label="Synced" /> } }
export const LongName: Story = {
  args: { image: { ...baseImage, name: 'very-long-image-filename-2024-q4-batch-3-wafer-line-a-001-cropped.jpg' } },
}

export const KeyboardActivation: Story = {
  args: {
    image: baseImage,
    onOpen: fn(),
    onOpenMenu: fn(),
  },
  parameters: {
    docs: {
      description: {
        story: 'The primary image action and the overlay menu are sibling native buttons. Press Enter or Space on the image action to open the image without nesting interactive controls.',
      },
    },
  },
  play: async ({ canvas, userEvent, args }) => {
    const card = canvas.getByRole('button', { name: `Open image ${baseImage.name}` })
    card.focus()
    await userEvent.keyboard('{Enter}')
    await expect(args.onOpen).toHaveBeenCalledWith(baseImage.id)
  },
}

export const Grid3x3: Story = {
  render: () => (
    <Grid columns="repeat(3, 1fr)" gap={3} style={{ width: 720 }}>
      <ImageCard image={{ id: '1', name: 'A.jpg', thumb_url: sample1 as string }} topRightSlot={<DemoChip label="Synced" />} />
      <ImageCard image={{ id: '2', name: 'B.jpg', thumb_url: sample2 as string }} topRightSlot={<DemoChip label="Uploading" />} selected />
      <ImageCard image={{ id: '3', name: 'C.jpg', thumb_url: sample3 as string }} topRightSlot={<DemoChip label="Failed" />} />
      <ImageCard image={{ id: '4', name: 'D.jpg', thumb_url: sample1 as string, archived: true }} />
      <ImageCard image={{ id: '5', name: 'E.jpg', thumb_url: sample2 as string, processing: true }} />
      <ImageCard image={{ id: '6', name: 'F.jpg', thumb_url: sample3 as string, group_count: 12 }} topRightSlot={<DemoChip label="Synced" />} />
    </Grid>
  ),
}
