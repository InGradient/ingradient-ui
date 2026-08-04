import type { Meta, StoryObj } from '@storybook/react-vite'
import type { DashboardScenarioKey } from '../../../fixtures/platform/0.0.1/dashboard-scenarios'
import { createDashboardActionArgs } from './dashboard/dashboard-story-actions'
import { dashboardArgTypes, dashboardParameters } from './dashboard/dashboard-story-config'
import { DashboardScene } from './dashboard/dashboard-story-runtime'

const SCENARIOS = [
  'no-project',
  'loading',
  'error',
  'no-data',
  'no-project-name',
] as const satisfies readonly DashboardScenarioKey[]

const meta = {
  title: 'Pages/Platform/0.0.1/Dashboard/System States',
  component: DashboardScene,
  tags: ['autodocs'],
  parameters: dashboardParameters(
    'Project availability, loading, error, empty-analysis, and incomplete-header states.',
  ),
  argTypes: dashboardArgTypes(SCENARIOS),
  args: { scenario: 'no-project', ...createDashboardActionArgs() },
} satisfies Meta<typeof DashboardScene>

export default meta
type Story = StoryObj<typeof meta>

export const NoProjectSelected: Story = { name: 'No project selected' }
export const Loading: Story = { name: 'Loading', args: { scenario: 'loading' } }
export const LoadError: Story = { name: 'Load error', args: { scenario: 'error' } }
export const NoAnalysisData: Story = {
  name: 'No analysis data',
  args: { scenario: 'no-data' },
}
export const MissingProjectName: Story = {
  name: 'Missing project name',
  args: { scenario: 'no-project-name' },
}
