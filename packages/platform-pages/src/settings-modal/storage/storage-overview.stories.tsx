import type { Meta, StoryObj } from '@storybook/react-vite'
import { StorageOverview } from './storage-overview'

const items = [
  { label: 'Total Images', value: '128,402' },
  { label: 'Total Storage', value: '482.3 GB' },
  { label: 'Preview Generated', value: '120,108', sub: '(93.5%)' },
  { label: 'Skipped (≤1024px)', value: '8,294' },
]

const meta: Meta<typeof StorageOverview> = {
  title: 'Platform Pages/Storage/StorageOverview',
  component: StorageOverview,
  parameters: { layout: 'fullscreen' },
  decorators: [(Story) => <div style={{ width: 1000, padding: 20, background: 'var(--ig-color-surface-panel)' }}><Story /></div>],
}
export default meta

type Story = StoryObj<typeof meta>

export const Default: Story = { args: { items } }
export const Loading: Story = { args: { items: [], loading: true } }
export const ThreeCards: Story = { args: { items: items.slice(0, 3) } }
