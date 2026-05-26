import { useState } from 'react'
import type { Meta, StoryObj } from '@storybook/react-vite'
import { DetailPanelSidebar } from './detail-panel-sidebar'
import { UserPoolList, type UserPoolItem } from './user-pool-list'
import { StorybookCard, StorybookGrid, StorybookPage, StorybookSection } from '@storybook-support/storybook-layout'

const meta = {
  title: 'Components/Data Display/DetailPanelSidebar',
  component: DetailPanelSidebar,
  tags: ['autodocs'],
  parameters: {
    layout: 'fullscreen',
    a11y: { test: 'error' },
  },
} satisfies Meta<typeof DetailPanelSidebar>

export default meta

type Story = StoryObj<typeof meta>

const USERS: UserPoolItem[] = [
  { id: 'alice@example.com', label: 'Alice Park', tooltip: 'alice@example.com' },
  { id: 'bob@example.com', label: 'Bob Kim', tooltip: 'bob@example.com' },
  { id: 'carol@example.com', label: 'Carol Lim', tooltip: 'carol@example.com' },
]

const slotStyle = {
  padding: 'var(--ig-space-4)',
  border: '1px dashed var(--ig-color-border-subtle)',
  borderRadius: 'var(--ig-radius-sm)',
  fontSize: 'var(--ig-font-size-xs)',
  color: 'var(--ig-color-text-muted)',
} as const

const HeaderSlot = (
  <div style={{ padding: 'var(--ig-space-5)', borderBottom: '1px solid var(--ig-color-border-subtle)' }}>
    <div style={{ fontWeight: 700, color: 'var(--ig-color-text-primary)', marginBottom: 'var(--ig-space-2)' }}>
      wafer-line-a-batch-04.jpg
    </div>
    <div style={{ fontSize: 'var(--ig-font-size-xs)', color: 'var(--ig-color-text-muted)' }}>
      2560 × 1920 · 184 KB · Uploaded 2026-05-21
    </div>
  </div>
)

const BodySlot = (
  <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
    {['Defect', 'Crack', 'Stain', 'Scratch', 'Dent', 'Rust', 'Edge anomaly', 'Particle'].map((label) => (
      <div key={label} style={slotStyle}>{label}</div>
    ))}
  </div>
)

const CommentsSlot = (
  <div style={slotStyle}>CommentsPanel slot — 자체 collapsible header 를 가진 컴포넌트가 들어온다고 가정</div>
)

function LabelersSlot() {
  const [selected, setSelected] = useState<Set<string>>(new Set(['alice@example.com']))
  return (
    <UserPoolList
      users={USERS}
      selectedIds={selected}
      defaultOpen
      onToggle={(id) =>
        setSelected((prev) => {
          const next = new Set(prev)
          if (next.has(id)) next.delete(id)
          else next.add(id)
          return next
        })
      }
    />
  )
}

export const Review: Story = {
  args: { headerSlot: <div /> },
  render: () => (
    <StorybookPage
      title="DetailPanelSidebar"
      description="dialog 의 sidebar slot 에 들어가는 표준 상세 패널 사이드바. 위(고정) header → 가운데(flex-grow, 스크롤) body → 아래(고정) footerSlots[] 레이아웃."
    >
      <StorybookSection title="Slot composition" description="채워진 슬롯 조합별 사이드바 모습.">
        <StorybookGrid columns="repeat(auto-fit, minmax(320px, 1fr))">
          <StorybookCard title="All slots filled" subtitle="header + body + 2 footer slots">
            <div style={{ width: 320, height: 560, border: '1px solid var(--ig-color-border-subtle)', borderRadius: 'var(--ig-radius-md)', overflow: 'hidden' }}>
              <DetailPanelSidebar
                headerSlot={HeaderSlot}
                bodySlot={BodySlot}
                bodySectionTitle="Class"
                footerSlots={[CommentsSlot, <LabelersSlot key="l" />]}
              />
            </div>
          </StorybookCard>
          <StorybookCard title="Header + body only" subtitle="footer 없음">
            <div style={{ width: 320, height: 560, border: '1px solid var(--ig-color-border-subtle)', borderRadius: 'var(--ig-radius-md)', overflow: 'hidden' }}>
              <DetailPanelSidebar headerSlot={HeaderSlot} bodySlot={BodySlot} bodySectionTitle="Class" />
            </div>
          </StorybookCard>
          <StorybookCard title="Header only" subtitle="최소 구성">
            <div style={{ width: 320, height: 320, border: '1px solid var(--ig-color-border-subtle)', borderRadius: 'var(--ig-radius-md)', overflow: 'hidden' }}>
              <DetailPanelSidebar headerSlot={HeaderSlot} />
            </div>
          </StorybookCard>
        </StorybookGrid>
      </StorybookSection>
    </StorybookPage>
  ),
}
