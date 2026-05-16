import { useState } from 'react'
import type { Meta, StoryObj } from '@storybook/react-vite'
import { ProjectMemberInvite, type SearchableUserCandidate } from './project-member-invite'

const candidates: SearchableUserCandidate[] = [
  { id: 'u-a', name: 'Soyeon Park', email: 'soyeon@ingradient.ai' },
  { id: 'u-b', name: 'Junho Kim', email: 'junho@ingradient.ai' },
  { id: 'u-c', email: 'minji@ingradient.ai' },
]

const meta: Meta<typeof ProjectMemberInvite> = {
  title: 'Patterns/Shells/ProjectMemberInvite',
  component: ProjectMemberInvite,
  decorators: [(Story) => <div style={{ width: 700, padding: 20, background: 'var(--ig-color-surface-panel)' }}><Story /></div>],
}
export default meta

type Story = StoryObj<typeof meta>

export const Empty: Story = {
  args: { query: '', onChangeQuery: () => undefined, candidates: [], onAdd: () => undefined },
}

export const ShortQuery: Story = {
  args: { query: 'so', onChangeQuery: () => undefined, candidates: [], onAdd: () => undefined },
}

export const WithResults: Story = {
  args: { query: 'soy', onChangeQuery: () => undefined, candidates, onAdd: () => undefined },
}

export const NoResults: Story = {
  args: { query: 'xyz', onChangeQuery: () => undefined, candidates: [], onAdd: () => undefined },
}

export const Adding: Story = {
  args: { query: 'soy', onChangeQuery: () => undefined, candidates, addingMemberUserId: 'u-a', onAdd: () => undefined },
}

export const WithInviteMessage: Story = {
  args: { query: 'soy', onChangeQuery: () => undefined, candidates, inviteMessage: 'Member added.', onAdd: () => undefined },
}

export const Interactive: Story = {
  render: () => {
    const [q, setQ] = useState('')
    return <ProjectMemberInvite query={q} onChangeQuery={setQ} candidates={candidates.filter((c) => c.email.toLowerCase().includes(q.toLowerCase()) || (c.name ?? '').toLowerCase().includes(q.toLowerCase()))} onAdd={() => undefined} />
  },
}
