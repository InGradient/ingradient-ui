import type { Meta, StoryObj } from '@storybook/react-vite'
import { AnalysisClassRatioWidget } from './analysis-class-ratio-widget'

const meta: Meta<typeof AnalysisClassRatioWidget> = {
  title: 'Platform Pages/Dashboard Widgets/AnalysisClassRatioWidget',
  component: AnalysisClassRatioWidget,
}
export default meta
type Story = StoryObj<typeof AnalysisClassRatioWidget>

const DATA = [
  { name: 'Crack', count: 412, ratio: 33, color: '#ff6b6b' },
  { name: 'Scratch', count: 318, ratio: 26, color: '#feca57' },
  { name: 'Dent', count: 247, ratio: 20, color: '#48dbfb' },
  { name: 'Stain', count: 165, ratio: 13, color: '#a55eea' },
  { name: 'Rust', count: 105, ratio: 8, color: '#1dd1a1' },
]

export const Default: Story = { args: { classRatio: DATA, chartData: DATA } }
export const Empty: Story = { args: { classRatio: [], chartData: [] } }
