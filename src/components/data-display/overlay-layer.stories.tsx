import type { Meta, StoryObj } from '@storybook/react-vite'
import { Badge } from '../feedback/badge'
import { AspectRatioImage } from './aspect-ratio-image'
import { OverlayLayer } from './overlay-layer'

const SAMPLE = 'https://images.unsplash.com/photo-1503023345310-bd7c1de61c7d?w=600'

const meta = {
  title: 'Components/Data Display/OverlayLayer',
  component: OverlayLayer,
  parameters: { layout: 'centered' },
  decorators: [(Story) => <div style={{ width: 320 }}><Story /></div>],
} satisfies Meta<typeof OverlayLayer>

export default meta

type Story = StoryObj<typeof meta>

export const OverImage: Story = {
  render: () => (
    <AspectRatioImage ratio="1/1" src={SAMPLE} alt="overlay demo">
      <OverlayLayer>
        <div
          style={{
            position: 'absolute',
            top: 12,
            right: 12,
            display: 'flex',
            gap: 8,
          }}
        >
          <Badge $tone="accent">12</Badge>
          <Badge $tone="success">Done</Badge>
        </div>
      </OverlayLayer>
    </AspectRatioImage>
  ),
}
