import type { Meta, StoryObj } from '@storybook/react-vite'
import { VideoPlayer } from './video-player'

const SAMPLE_VIDEO =
  'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4'
const SAMPLE_POSTER =
  'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/images/BigBuckBunny.jpg'

const meta = {
  title: 'Components/Data Display/VideoPlayer',
  component: VideoPlayer,
  parameters: { layout: 'centered' },
  decorators: [(Story) => <div style={{ width: 480 }}><Story /></div>],
} satisfies Meta<typeof VideoPlayer>

export default meta

type Story = StoryObj<typeof meta>

export const SixteenNine: Story = {
  args: { ratio: '16/9', src: SAMPLE_VIDEO, poster: SAMPLE_POSTER },
}
export const Square: Story = {
  args: { ratio: '1/1', src: SAMPLE_VIDEO, poster: SAMPLE_POSTER },
}
export const FourThree: Story = {
  args: { ratio: '4/3', src: SAMPLE_VIDEO, poster: SAMPLE_POSTER },
}
export const Portrait: Story = {
  args: { ratio: '9/16', src: SAMPLE_VIDEO, poster: SAMPLE_POSTER },
}
export const NoControls: Story = {
  args: { ratio: '16/9', src: SAMPLE_VIDEO, poster: SAMPLE_POSTER, controls: false, autoPlay: true, muted: true, loop: true },
}
export const FallbackGradient: Story = {
  args: { ratio: '16/9', src: 'data:video/mp4;base64,' },
}
