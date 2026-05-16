import type { Meta, StoryObj } from '@storybook/react-vite'
import { MemberPoolList } from './member-pool-list'

const meta: Meta<typeof MemberPoolList> = {
  title: 'Patterns/MemberPoolList',
  component: MemberPoolList,
  parameters: { layout: 'padded' },
  decorators: [(Story) => <div style={{ width: 280 }}><Story /></div>],
}
export default meta

type Story = StoryObj<typeof meta>

const MEMBERS = [
  { id: 'm1', name: 'June Lee', role: 'Owner' },
  { id: 'm2', name: 'Soyeon Park', role: 'Maintainer' },
  { id: 'm3', name: 'Daniel Kim', role: 'Labeler' },
  { id: 'm4', name: 'Mira Choi', role: 'Reviewer' },
]

export const Default: Story = { args: { members: MEMBERS } }
export const Removable: Story = { args: { members: MEMBERS, onRemove: () => undefined } }
export const Empty: Story = { args: { members: [] } }
