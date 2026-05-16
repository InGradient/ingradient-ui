import type { Meta, StoryObj } from '@storybook/react-vite'
import { AnalysisDataCollectionWidget } from './analysis-data-collection-widget'

const meta: Meta<typeof AnalysisDataCollectionWidget> = {
  title: 'Patterns/Shells/AnalysisDataCollectionWidget',
  component: AnalysisDataCollectionWidget,
}
export default meta
type Story = StoryObj<typeof AnalysisDataCollectionWidget>

const DATA = [
  { name: 'Wafer A', count: 412 },
  { name: 'Wafer B', count: 318 },
  { name: 'Surface', count: 247 },
  { name: 'Pixel seg', count: 165 },
  { name: 'Keypoint', count: 105 },
]

export const Default: Story = { args: { chartData: DATA, totalImages: 1247 } }
export const Empty: Story = { args: { chartData: [], totalImages: 0 } }
