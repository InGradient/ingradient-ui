import { useState } from 'react'
import type { Meta, StoryObj } from '@storybook/react-vite'
import { ImageDetailLabelersList, type ImageDetailLabelersListUser } from './image-detail-labelers-list'
import { StorybookCard, StorybookGrid, StorybookPage, StorybookSection } from '@storybook-support/storybook-layout'

const meta = {
  title: 'Patterns/ImageDetailLabelersList',
  component: ImageDetailLabelersList,
  tags: ['autodocs'],
  parameters: {
    layout: 'fullscreen',
    a11y: { test: 'error' },
  },
} satisfies Meta<typeof ImageDetailLabelersList>

export default meta

type Story = StoryObj<typeof meta>

const USERS: ImageDetailLabelersListUser[] = [
  { email: 'alice@example.com', name: 'Alice Park' },
  { email: 'bob@example.com', name: 'Bob Kim' },
  { email: 'carol@example.com', name: 'Carol Lim' },
  { email: 'dave@example.com' },
  { email: 'eve@example.com', name: 'Eve Choi' },
]

function InteractiveList({ initial, defaultOpen }: { initial?: Set<string>; defaultOpen?: boolean }) {
  const [selected, setSelected] = useState(initial ?? new Set<string>())
  return (
    <div style={{ width: 280 }}>
      <ImageDetailLabelersList
        users={USERS}
        selectedUsers={selected}
        defaultOpen={defaultOpen}
        onToggleUser={(email) =>
          setSelected((prev) => {
            const next = new Set(prev)
            if (next.has(email)) next.delete(email)
            else next.add(email)
            return next
          })
        }
      />
    </div>
  )
}

export const Review: Story = {
  args: { users: USERS, selectedUsers: new Set(), onToggleUser: () => undefined },
  render: () => (
    <StorybookPage
      title="ImageDetailLabelersList"
      description="image detail sidebar의 labelers 섹션. collapsible header + count badge + 사용자 row 리스트. 비활성 row는 opacity로 dim된다."
    >
      <StorybookSection title="States" description="open / closed × selection 조합.">
        <StorybookGrid columns="repeat(auto-fit, minmax(280px, 1fr))">
          <StorybookCard title="Collapsed (default)" subtitle="header만 표시">
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
              <ImageDetailLabelersList users={[]} selectedUsers={new Set()} onToggleUser={() => undefined} />
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
