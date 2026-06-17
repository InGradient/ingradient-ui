import type { Meta, StoryObj } from '@storybook/react-vite'
import { AnalysisTimelineWidget } from './analysis-timeline-widget'

const meta: Meta<typeof AnalysisTimelineWidget> = {
  title: 'Platform Pages/Dashboard Widgets/AnalysisTimelineWidget',
  component: AnalysisTimelineWidget,
}
export default meta
type Story = StoryObj<typeof AnalysisTimelineWidget>

const DATA = [
  { label: 'W1', total: 120, labeled: 80, unlabeled: 40 },
  { label: 'W2', total: 160, labeled: 110, unlabeled: 50 },
  { label: 'W3', total: 200, labeled: 142, unlabeled: 58 },
  { label: 'W4', total: 180, labeled: 140, unlabeled: 40 },
  { label: 'W5', total: 240, labeled: 188, unlabeled: 52 },
  { label: 'W6', total: 280, labeled: 218, unlabeled: 62 },
]

export const Daily: Story = { args: { granularity: 'daily', chartData: DATA } }
export const Hourly: Story = { args: { granularity: 'hour', chartData: DATA } }
export const Empty: Story = { args: { granularity: 'daily', chartData: [] } }
