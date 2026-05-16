import type { Meta, StoryObj } from '@storybook/react-vite'
import { PagePrimaryHeader } from './page-primary-header'

const meta = {
  title: 'Patterns/Page/PagePrimaryHeader',
  component: PagePrimaryHeader,
  parameters: { layout: 'fullscreen' },
  args: {
    title: 'Class',
    subtitle: 'Review project classes, linked datasets, reference images, and mapping settings.',
  },
} satisfies Meta<typeof PagePrimaryHeader>

export default meta

type Story = StoryObj<typeof meta>

export const Default: Story = {}

export const WithProjectName: Story = {
  args: { rightSlot: 'Wafer-2026' },
}

export const NoSubtitle: Story = {
  args: { subtitle: undefined, rightSlot: 'Wafer-2026' },
}

export const LongTitle: Story = {
  args: {
    title: 'Class management for very long project names that may overflow',
    rightSlot: 'Wafer line A — Q2 2026 production',
  },
}
