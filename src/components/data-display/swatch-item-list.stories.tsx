import type { Meta, StoryObj } from '@storybook/react-vite'
import { SwatchItemList } from './swatch-item-list'

const meta: Meta<typeof SwatchItemList> = {
  title: 'Components/Data Display/SwatchItemList',
  component: SwatchItemList,
  parameters: { layout: 'padded' },
  decorators: [(Story) => <div style={{ width: 280 }}><Story /></div>],
}
export default meta

type Story = StoryObj<typeof meta>

const ITEMS = [
  { id: 'c1', label: 'Crack', color: '#ff6b6b', count: 412 },
  { id: 'c2', label: 'Scratch', color: '#feca57', count: 318 },
  { id: 'c3', label: 'Dent', color: '#48dbfb', count: 247 },
  { id: 'c4', label: 'Discoloration', color: '#1dd1a1', count: 165 },
  { id: 'c5', label: 'Stain', color: '#a55eea', count: 105 },
]

export const Default: Story = { args: { items: ITEMS } }
export const Removable: Story = { args: { items: ITEMS, onRemove: () => undefined } }
export const Empty: Story = { args: { items: [] } }
