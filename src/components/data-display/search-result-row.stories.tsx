import { useState } from 'react'
import type { Meta, StoryObj } from '@storybook/react-vite'
import { SearchResultRow } from './search-result-row'
import { StorybookCard, StorybookGrid, StorybookPage, StorybookSection } from '@storybook-support/storybook-layout'

const meta = {
  title: 'Components/Data Display/SearchResultRow',
  component: SearchResultRow,
  tags: ['autodocs'],
  parameters: {
    layout: 'fullscreen',
    a11y: { test: 'error' },
  },
} satisfies Meta<typeof SearchResultRow>

export default meta

type Story = StoryObj<typeof meta>

const SAMPLE = [
  { id: 'u1', name: 'Joon Ho Lee', email: 'joon@example.com' },
  { id: 'u2', name: 'Min-jun Park', email: 'minjun@example.com' },
  { id: 'u3', name: '', email: 'guest@example.com' },
]

function Demo() {
  const [pendingId, setPendingId] = useState<string | null>(null)
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 8, width: 360 }}>
      {SAMPLE.map((u) => (
        <SearchResultRow
          key={u.id}
          primary={u.name || u.email}
          secondary={u.name ? u.email : undefined}
          actionLabel={pendingId === u.id ? 'Adding…' : 'Add'}
          disabled={pendingId === u.id}
          onClick={() => {
            setPendingId(u.id)
            setTimeout(() => setPendingId(null), 800)
          }}
        />
      ))}
    </div>
  )
}

export const Review: Story = {
  args: { primary: 'Joon Ho Lee', secondary: 'joon@example.com', actionLabel: 'Add' },
  render: () => (
    <StorybookPage
      title="SearchResultRow"
      description="Full-width selectable button used in user/member search results. Primary line + optional secondary muted line + trailing action label."
    >
      <StorybookSection title="States" description="Idle / hover / disabled — disabled is shown when an async action is pending.">
        <StorybookGrid columns="repeat(auto-fit, minmax(320px, 1fr))">
          <StorybookCard title="Idle" subtitle="name + email + Add">
            <SearchResultRow primary="Joon Ho Lee" secondary="joon@example.com" actionLabel="Add" />
          </StorybookCard>
          <StorybookCard title="No secondary" subtitle="email-only candidate">
            <SearchResultRow primary="guest@example.com" actionLabel="Invite" />
          </StorybookCard>
          <StorybookCard title="Disabled / loading" subtitle="async action pending">
            <SearchResultRow primary="Min-jun Park" secondary="minjun@example.com" actionLabel="Adding…" disabled />
          </StorybookCard>
        </StorybookGrid>
      </StorybookSection>

      <StorybookSection title="Interactive demo" description="Click a row to simulate async add.">
        <StorybookGrid columns="1fr">
          <StorybookCard title="List with async add" subtitle="3 candidate rows">
            <Demo />
          </StorybookCard>
        </StorybookGrid>
      </StorybookSection>
    </StorybookPage>
  ),
}
