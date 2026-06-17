import type { Meta, StoryObj } from '@storybook/react-vite'
import { AspectRatioImage } from './aspect-ratio-image'

const SAMPLE = 'https://images.unsplash.com/photo-1503023345310-bd7c1de61c7d?w=600'

const meta = {
  title: 'Components/Data Display/AspectRatioImage',
  component: AspectRatioImage,
  parameters: { layout: 'centered' },
  decorators: [(Story) => <div style={{ width: 320 }}><Story /></div>],
} satisfies Meta<typeof AspectRatioImage>

export default meta

type Story = StoryObj<typeof meta>

export const Square: Story = { args: { ratio: '1/1', src: SAMPLE, alt: 'square' } }
export const FourThree: Story = { args: { ratio: '4/3', src: SAMPLE, alt: '4:3' } }
export const SixteenNine: Story = { args: { ratio: '16/9', src: SAMPLE, alt: '16:9' } }
export const SixteenTen: Story = { args: { ratio: '16/10', src: SAMPLE, alt: '16:10' } }

export const FallbackGradient: Story = {
  args: { ratio: '1/1', src: 'data:image/svg+xml;utf8,<svg/>', alt: 'fallback' },
}
