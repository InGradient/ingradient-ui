import type { Meta, StoryObj } from '@storybook/react-vite'
import type { DashboardScenarioKey } from '../../../fixtures/platform/0.0.1/dashboard-scenarios'
import { createDashboardActionArgs } from './dashboard/dashboard-story-actions'
import { dashboardArgTypes, dashboardParameters } from './dashboard/dashboard-story-config'
import { DashboardScene } from './dashboard/dashboard-story-runtime'

const SCENARIOS = [
  'with-edge-analytics',
  'with-deflectometry',
] as const satisfies readonly DashboardScenarioKey[]

const meta = {
  title: 'Pages/Platform/0.0.1/Dashboard/Integrations',
  component: DashboardScene,
  tags: ['autodocs'],
  parameters: dashboardParameters(
    'Dashboard extensions backed by Edge analytics and Deflectometry capability data.',
  ),
  argTypes: dashboardArgTypes(SCENARIOS),
  args: { scenario: 'with-edge-analytics', ...createDashboardActionArgs() },
} satisfies Meta<typeof DashboardScene>

export default meta
type Story = StoryObj<typeof meta>

export const EdgeAnalytics: Story = { name: 'Edge analytics' }
export const Deflectometry: Story = {
  name: 'Deflectometry',
  args: { scenario: 'with-deflectometry' },
}
