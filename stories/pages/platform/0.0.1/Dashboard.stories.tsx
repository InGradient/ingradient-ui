import type { Meta, StoryObj } from '@storybook/react-vite'
import type { DashboardScenarioKey } from '../../../fixtures/platform/0.0.1/dashboard-scenarios'
import { createDashboardActionArgs } from './dashboard/dashboard-story-actions'
import { dashboardArgTypes, dashboardParameters } from './dashboard/dashboard-story-config'
import { DashboardScene } from './dashboard/dashboard-story-runtime'

const SCENARIOS = ['default'] as const satisfies readonly DashboardScenarioKey[]

const meta = {
  title: 'Pages/Platform/0.0.1/Dashboard/Workspace',
  component: DashboardScene,
  tags: ['autodocs'],
  parameters: dashboardParameters(
    'Canonical populated Dashboard workspace with the supported default widget layout.',
  ),
  argTypes: dashboardArgTypes(SCENARIOS),
  args: { scenario: 'default', ...createDashboardActionArgs() },
} satisfies Meta<typeof DashboardScene>

export default meta
type Story = StoryObj<typeof meta>

export const Overview: Story = { name: 'Overview' }
