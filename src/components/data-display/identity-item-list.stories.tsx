import type { Meta, StoryObj } from '@storybook/react-vite'
import { IdentityItemList, type IdentityItem } from './identity-item-list'

const meta: Meta<typeof IdentityItemList> = {
  title: 'Components/Data Display/IdentityItemList',
  component: IdentityItemList,
  parameters: { layout: 'padded' },
  decorators: [(Story) => <div style={{ width: 'var(--ig-popup-sm)' }}><Story /></div>],
}

export default meta

type Story = StoryObj<typeof meta>

const ITEMS: IdentityItem[] = [
  { id: 'u1', label: 'June Lee', meta: 'Owner', initials: 'JL' },
  { id: 'u2', label: 'Soyeon Park', meta: 'Maintainer', initials: 'SP' },
  { id: 'u3', label: 'Daniel Kim', meta: 'Reviewer', initials: 'DK' },
]

export const Default: Story = { args: { items: ITEMS } }

export const Removable: Story = {
  args: { items: ITEMS, onRemove: () => undefined },
}

export const WithoutMeta: Story = {
  args: { items: ITEMS.map(({ meta: _meta, ...item }) => item) },
}

export const Empty: Story = { args: { items: [] } }
