import type { Meta, StoryObj } from '@storybook/react-vite'
import { ClassListRow } from './class-list-row'

const meta: Meta<typeof ClassListRow> = {
  title: 'Patterns/Shells/ClassListRow',
  component: ClassListRow,
  decorators: [(Story) => (
    <ul style={{ listStyle: 'none', margin: 0, padding: 0, width: 260, background: 'var(--ig-color-surface-panel)' }}>
      <Story />
    </ul>
  )],
}
export default meta

type Story = StoryObj<typeof meta>

export const Default: Story = {
  args: { id: 'c-1', name: 'Crack', color: '#ef4444', count: 312 },
}

export const Selected: Story = {
  args: { id: 'c-1', name: 'Crack', color: '#ef4444', count: 312, selected: true },
}

export const NoCount: Story = {
  args: { id: 'c-1', name: 'Stain', color: '#3b82f6' },
}

export const LongName: Story = {
  args: { id: 'c-1', name: 'A-very-long-class-name-for-testing-overflow-behavior', color: '#10b981', count: 9 },
}
