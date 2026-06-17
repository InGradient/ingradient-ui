import type { Meta, StoryObj } from '@storybook/react-vite'
import { FilterPopoverTrigger } from './filter-popover-trigger'
import { Stack } from '../../primitives'

const meta: Meta<typeof FilterPopoverTrigger> = {
  title: 'Components/Inputs/FilterPopoverTrigger',
  component: FilterPopoverTrigger,
  parameters: { layout: 'centered' },
}
export default meta

type Story = StoryObj<typeof meta>

export const Default: Story = {
  args: {
    label: 'Filter',
    panel: (
      <Stack gap={3}>
        <strong style={{ fontSize: 'var(--ig-font-size-sm)' }}>Filter images</strong>
        <span style={{ color: 'var(--ig-color-text-muted)', fontSize: 'var(--ig-font-size-xs)' }}>Date range / Class / Member / Pattern</span>
      </Stack>
    ),
  },
}

export const Active: Story = { args: { label: 'Filter', active: true, panel: <span>2 filters applied</span> } }
export const OpenByDefault: Story = {
  args: {
    label: 'Filter',
    defaultOpen: true,
    panel: (
      <Stack gap={3}>
        <strong style={{ fontSize: 'var(--ig-font-size-sm)' }}>Filter images</strong>
        <span style={{ color: 'var(--ig-color-text-muted)', fontSize: 'var(--ig-font-size-xs)' }}>Date range / Class / Member / Pattern</span>
      </Stack>
    ),
  },
}
