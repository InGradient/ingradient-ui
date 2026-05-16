import type { Meta, StoryObj } from '@storybook/react-vite'
import { ClassPoolList } from './class-pool-list'

const meta: Meta<typeof ClassPoolList> = {
  title: 'Patterns/ClassPoolList',
  component: ClassPoolList,
  parameters: { layout: 'padded' },
  decorators: [(Story) => <div style={{ width: 280 }}><Story /></div>],
}
export default meta

type Story = StoryObj<typeof meta>

const CLASSES = [
  { id: 'c1', name: 'Crack', color: '#ff6b6b', count: 412 },
  { id: 'c2', name: 'Scratch', color: '#feca57', count: 318 },
  { id: 'c3', name: 'Dent', color: '#48dbfb', count: 247 },
  { id: 'c4', name: 'Discoloration', color: '#1dd1a1', count: 165 },
  { id: 'c5', name: 'Stain', color: '#a55eea', count: 105 },
]

export const Default: Story = { args: { classes: CLASSES } }
export const Removable: Story = { args: { classes: CLASSES, onRemove: () => undefined } }
export const Empty: Story = { args: { classes: [] } }
