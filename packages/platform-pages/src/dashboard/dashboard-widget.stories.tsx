import type { Meta, StoryObj } from '@storybook/react-vite'
import { DashboardWidget } from './dashboard-widget'

const meta: Meta<typeof DashboardWidget> = {
  title: 'Platform Pages/Dashboard/DashboardWidget',
  component: DashboardWidget,
  parameters: { layout: 'padded' },
}
export default meta

type Story = StoryObj<typeof meta>

export const Default: Story = {
  args: {
    title: 'Images by dataset',
    subtitle: 'Last 30 days',
    children: <div style={{ height: 160, display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--ig-color-text-muted)' }}>(chart)</div>,
  },
}
