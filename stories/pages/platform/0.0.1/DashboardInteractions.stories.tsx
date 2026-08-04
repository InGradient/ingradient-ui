import type { Meta, StoryObj } from '@storybook/react-vite'
import type { DashboardScenarioKey } from '../../../fixtures/platform/0.0.1/dashboard-scenarios'
import { createDashboardActionArgs } from './dashboard/dashboard-story-actions'
import { dashboardArgTypes, dashboardParameters } from './dashboard/dashboard-story-config'
import {
  playDashboardCustomize,
  playDashboardDateRange,
  playDashboardExports,
  playDashboardLayoutReset,
} from './dashboard/dashboard-story-plays'
import { DashboardScene } from './dashboard/dashboard-story-runtime'

const SCENARIOS = ['default', 'layout-1-per-row'] as const satisfies readonly DashboardScenarioKey[]

const meta = {
  title: 'Pages/Platform/0.0.1/Dashboard/Interactions',
  component: DashboardScene,
  tags: ['autodocs'],
  parameters: dashboardParameters(
    'Executable widget customization, date filtering, export, download, and layout-reset behavior.',
  ),
  argTypes: dashboardArgTypes(SCENARIOS),
  args: { scenario: 'default', ...createDashboardActionArgs() },
} satisfies Meta<typeof DashboardScene>

export default meta
type Story = StoryObj<typeof meta>

export const CustomizeWidgetsWorkflow: Story = {
  name: 'Customize widgets workflow',
  play: playDashboardCustomize,
}
export const DateRangeWorkflow: Story = {
  name: 'Date range workflow',
  play: playDashboardDateRange,
}
export const ExportWorkflow: Story = {
  name: 'Export workflow',
  play: playDashboardExports,
}
export const LayoutResetWorkflow: Story = {
  name: 'Layout reset workflow',
  args: { scenario: 'layout-1-per-row' },
  play: playDashboardLayoutReset,
}
