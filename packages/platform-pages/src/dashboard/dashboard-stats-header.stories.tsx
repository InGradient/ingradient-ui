import type { Meta, StoryObj } from '@storybook/react-vite'
import { DashboardStatsHeader } from './dashboard-stats-header'

const meta: Meta<typeof DashboardStatsHeader> = {
  title: 'Platform Pages/Dashboard/DashboardStatsHeader',
  component: DashboardStatsHeader,
  decorators: [(Story) => <div style={{ width: 280, padding: 16, background: 'var(--ig-color-surface-panel)' }}><Story /></div>],
}
export default meta

type Story = StoryObj<typeof meta>

export const LabelingStatus: Story = {
  args: {
    items: [
      { label: 'Labeled', value: '892 (71.5%)' },
      { label: 'Unlabeled', value: '321' },
      { label: 'Total', value: '1,247' },
    ],
  },
}

export const PendingProcessed: Story = {
  args: {
    items: [
      { label: 'Pending (unlabeled)', value: '321' },
      { label: 'Processed (labeled)', value: '892' },
    ],
  },
}

export const SingleStat: Story = { args: { items: [{ label: 'Total', value: '1,247' }] } }
