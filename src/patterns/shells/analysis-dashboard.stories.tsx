import type { Meta, StoryObj } from '@storybook/react-vite'
import { AnalysisDashboard } from './analysis-dashboard'
import { Card } from '../../components'

const meta: Meta<typeof AnalysisDashboard> = {
  title: 'Patterns/AnalysisDashboard',
  component: AnalysisDashboard,
  parameters: { layout: 'fullscreen' },
}
export default meta

type Story = StoryObj<typeof meta>

const SAMPLE_STATS = [
  { label: 'Total images', value: '1,247', hint: '+ 32 this week' },
  { label: 'Labeled', value: '892', hint: '71.5%' },
  { label: 'Pending', value: '321', hint: '25.8%' },
  { label: 'Errors', value: '34', hint: '2.7%' },
]

export const Default: Story = {
  render: () => (
    <AnalysisDashboard
      stats={SAMPLE_STATS}
      charts={<Card style={{ padding: 'var(--ig-space-7)', minHeight: 240, display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--ig-color-text-muted)' }}>(Chart placeholder)</Card>}
      tableSlot={<Card style={{ padding: 'var(--ig-space-5)', color: 'var(--ig-color-text-muted)' }}>(Table placeholder)</Card>}
    />
  ),
}

export const StatsOnly: Story = { args: { stats: SAMPLE_STATS } }
