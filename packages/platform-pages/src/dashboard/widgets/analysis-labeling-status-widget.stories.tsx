import type { Meta, StoryObj } from '@storybook/react-vite'
import { AnalysisLabelingStatusWidget } from './analysis-labeling-status-widget'

const meta: Meta<typeof AnalysisLabelingStatusWidget> = {
  title: 'Platform Pages/Dashboard Widgets/AnalysisLabelingStatusWidget',
  component: AnalysisLabelingStatusWidget,
}
export default meta
type Story = StoryObj<typeof AnalysisLabelingStatusWidget>

export const Default: Story = {
  args: {
    totalLabeled: 892,
    totalUnlabeled: 321,
    totalImages: 1247,
    labeledPct: 71.5,
    pieData: [
      { name: 'Labeled', value: 892, color: '#35c6a7' },
      { name: 'Unlabeled', value: 321, color: '#ffd179' },
      { name: 'Errors', value: 34, color: '#ff9a9a' },
    ],
  },
}

export const Empty: Story = {
  args: { totalLabeled: 0, totalUnlabeled: 0, totalImages: 0, labeledPct: 0, pieData: [] },
}
