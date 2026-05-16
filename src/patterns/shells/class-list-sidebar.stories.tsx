import type { Meta, StoryObj } from '@storybook/react-vite'
import { ClassListSidebar } from './class-list-sidebar'

const baseClasses = [
  { id: 'c-1', name: 'Crack', color: '#ef4444', image_count: 312 },
  { id: 'c-2', name: 'Scratch', color: '#f59e0b', image_count: 187 },
  { id: 'c-3', name: 'Stain', color: '#3b82f6', image_count: 94 },
  { id: 'c-4', name: 'Contamination', color: '#10b981', image_count: 41 },
]

const meta: Meta<typeof ClassListSidebar> = {
  title: 'Patterns/Shells/ClassListSidebar',
  component: ClassListSidebar,
  parameters: { layout: 'fullscreen' },
  decorators: [(Story) => <div style={{ height: 600, display: 'flex' }}><Story /></div>],
}
export default meta

type Story = StoryObj<typeof meta>

export const Default: Story = { args: { classes: baseClasses, selectedClassId: 'c-1' } }

export const Loading: Story = { args: { classes: [], loading: true } }

export const Empty: Story = { args: { classes: [] } }

export const ManyClasses: Story = {
  args: {
    classes: Array.from({ length: 18 }, (_, i) => ({
      ...baseClasses[i % baseClasses.length],
      id: `c-many-${i}`,
      name: `${baseClasses[i % baseClasses.length].name} #${i + 1}`,
      image_count: 50 + i * 7,
    })),
    selectedClassId: 'c-many-3',
  },
}

export const LongNames: Story = {
  args: {
    classes: baseClasses.map((c, i) => i === 0
      ? { ...c, name: 'A-very-long-class-name-for-testing-overflow-behavior-in-list-views' }
      : c),
    selectedClassId: 'c-1',
  },
}

export const NoCounts: Story = {
  args: { classes: baseClasses.map(({ image_count, ...c }) => c), selectedClassId: 'c-2' },
}
