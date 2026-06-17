import type { Meta, StoryObj } from '@storybook/react-vite'
import { LabeledSwatchRow } from './labeled-swatch-row'

const meta: Meta<typeof LabeledSwatchRow> = {
  title: 'Components/Data Display/LabeledSwatchRow',
  component: LabeledSwatchRow,
  decorators: [(Story) => (
    <ul style={{ listStyle: 'none', margin: 0, padding: 0, width: 260, background: 'var(--ig-color-surface-panel)' }}>
      <Story />
    </ul>
  )],
}
export default meta

type Story = StoryObj<typeof meta>

export const Default: Story = {
  args: { id: 'c-1', label: 'Crack', color: '#ef4444', count: 312 },
}

export const Selected: Story = {
  args: { id: 'c-1', label: 'Crack', color: '#ef4444', count: 312, selected: true },
}

export const NoCount: Story = {
  args: { id: 'c-1', label: 'Stain', color: '#3b82f6' },
}

export const LongName: Story = {
  args: { id: 'c-1', label: 'A-very-long-label-for-testing-overflow-behavior', color: '#10b981', count: 9 },
}
