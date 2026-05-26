import { useState } from 'react'
import type { Meta, StoryObj } from '@storybook/react-vite'
import { UserPoolList, type UserPoolItem } from './user-pool-list'
import { StorybookCard, StorybookGrid, StorybookPage, StorybookSection } from '@storybook-support/storybook-layout'

const meta = {
  title: 'Components/Data Display/UserPoolList',
  component: UserPoolList,
  tags: ['autodocs'],
  parameters: {
    layout: 'fullscreen',
    a11y: { test: 'error' },
  },
} satisfies Meta<typeof UserPoolList>

export default meta

type Story = StoryObj<typeof meta>

const USERS: UserPoolItem[] = [
  { id: 'alice@example.com', label: 'Alice Park', tooltip: 'alice@example.com' },
  { id: 'bob@example.com', label: 'Bob Kim', tooltip: 'bob@example.com' },
  { id: 'carol@example.com', label: 'Carol Lim', tooltip: 'carol@example.com' },
  { id: 'dave@example.com', label: 'dave@example.com' },
  { id: 'eve@example.com', label: 'Eve Choi', tooltip: 'eve@example.com' },
]

function InteractiveList({ initial, defaultOpen }: { initial?: Set<string>; defaultOpen?: boolean }) {
  const [selected, setSelected] = useState(initial ?? new Set<string>())
  return (
    <div style={{ width: 280 }}>
      <UserPoolList
        users={USERS}
        selectedIds={selected}
        defaultOpen={defaultOpen}
        onToggle={(id) =>
          setSelected((prev) => {
            const next = new Set(prev)
            if (next.has(id)) next.delete(id)
            else next.add(id)
            return next
          })
        }
      />
    </div>
  )
}

export const Review: Story = {
  args: { users: USERS, selectedIds: new Set(), onToggle: () => undefined },
  render: () => (
    <StorybookPage
      title="UserPoolList"
      description="collapsible header + count badge + 사용자 row 리스트. 비활성 row 는 opacity 로 dim 된다."
    >
      <StorybookSection title="States" description="open / closed × selection 조합.">
        <StorybookGrid columns="repeat(auto-fit, minmax(280px, 1fr))">
          <StorybookCard title="Collapsed (default)" subtitle="header 만 표시">
            <InteractiveList />
          </StorybookCard>
          <StorybookCard title="Expanded, no selection" subtitle="모두 dim">
            <InteractiveList defaultOpen />
          </StorybookCard>
          <StorybookCard title="Expanded, 2 selected" subtitle="선택만 highlight">
            <InteractiveList defaultOpen initial={new Set(['alice@example.com', 'carol@example.com'])} />
          </StorybookCard>
          <StorybookCard title="Empty" subtitle="users=[] → 미렌더">
            <div style={{ width: 280, padding: 'var(--ig-space-3)', border: '1px dashed var(--ig-color-border-subtle)', borderRadius: 'var(--ig-radius-sm)' }}>
              <UserPoolList users={[]} selectedIds={new Set()} onToggle={() => undefined} />
              <span style={{ fontSize: 'var(--ig-font-size-xs)', color: 'var(--ig-color-text-muted)' }}>
                (no render — wrapper 점선만 표시)
              </span>
            </div>
          </StorybookCard>
        </StorybookGrid>
      </StorybookSection>
    </StorybookPage>
  ),
}
