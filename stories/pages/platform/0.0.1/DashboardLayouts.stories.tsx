import type { Meta, StoryObj } from '@storybook/react-vite'
import type { DashboardScenarioKey } from '../../../fixtures/platform/0.0.1/dashboard-scenarios'
import { createDashboardActionArgs } from './dashboard/dashboard-story-actions'
import { dashboardArgTypes, dashboardParameters } from './dashboard/dashboard-story-config'
import { DashboardScene } from './dashboard/dashboard-story-runtime'

const SCENARIOS = [
  'layout-3-per-row',
  'layout-1-per-row',
] as const satisfies readonly DashboardScenarioKey[]

const meta = {
  title: 'Pages/Platform/0.0.1/Dashboard/Layouts',
  component: DashboardScene,
  tags: ['autodocs'],
  parameters: dashboardParameters(
    'Supported dense and single-column Dashboard widget arrangements around the canonical layout.',
  ),
  argTypes: dashboardArgTypes(SCENARIOS),
  args: { scenario: 'layout-3-per-row', ...createDashboardActionArgs() },
} satisfies Meta<typeof DashboardScene>

export default meta
type Story = StoryObj<typeof meta>

export const ThreePerRow: Story = { name: 'Three per row' }
export const OnePerRow: Story = {
  name: 'One per row',
  args: { scenario: 'layout-1-per-row' },
}
