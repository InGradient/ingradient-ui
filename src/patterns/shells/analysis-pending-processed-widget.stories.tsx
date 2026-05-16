import type { Meta, StoryObj } from '@storybook/react-vite'
import { AnalysisPendingProcessedWidget } from './analysis-pending-processed-widget'

const meta: Meta<typeof AnalysisPendingProcessedWidget> = {
  title: 'Patterns/Shells/AnalysisPendingProcessedWidget',
  component: AnalysisPendingProcessedWidget,
}
export default meta
type Story = StoryObj<typeof AnalysisPendingProcessedWidget>

export const Default: Story = {
  args: {
    pending: 321,
    processed: 892,
    pieData: [
      { name: 'Processed', value: 892, color: '#35c6a7' },
      { name: 'Pending', value: 321, color: '#ffd179' },
    ],
  },
}

export const Empty: Story = { args: { pending: 0, processed: 0, pieData: [] } }
