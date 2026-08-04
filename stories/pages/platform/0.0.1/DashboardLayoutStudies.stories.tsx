import type { Meta, StoryObj } from '@storybook/react-vite'
import {
  DashboardLayoutStudyScene,
  dashboardLayoutStudyArgTypes,
} from './dashboard/dashboard-layout-studies'
import { dashboardParameters } from './dashboard/dashboard-story-config'

const meta = {
  title: 'Pages/Platform/0.0.1/Dashboard/Layout Studies',
  component: DashboardLayoutStudyScene,
  tags: ['autodocs'],
  parameters: dashboardParameters(
    'Preserved non-production layout studies, each isolated from the canonical workspace for clear review.',
  ),
  argTypes: dashboardLayoutStudyArgTypes,
  args: { study: 'compact-masonry' as const },
} satisfies Meta<typeof DashboardLayoutStudyScene>

export default meta
type Story = StoryObj<typeof meta>

export const CompactMasonry: Story = { name: 'Compact masonry' }
export const SectionedGrid: Story = {
  name: 'Sectioned grid',
  args: { study: 'sectioned-grid' },
}
