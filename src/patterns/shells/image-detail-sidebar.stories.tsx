import { useState } from 'react'
import type { Meta, StoryObj } from '@storybook/react-vite'
import { ImageDetailSidebar } from './image-detail-sidebar'
import { UserPoolList, type UserPoolItem } from '../../components/data-display/user-pool-list'
import { StorybookCard, StorybookGrid, StorybookPage, StorybookSection } from '@storybook-support/storybook-layout'

const meta = {
  title: 'Patterns/ImageDetailSidebar',
  component: ImageDetailSidebar,
  tags: ['autodocs'],
  parameters: {
    layout: 'fullscreen',
    a11y: { test: 'error' },
  },
} satisfies Meta<typeof ImageDetailSidebar>

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

const InfoSlot = (
  <div style={{ padding: 'var(--ig-space-5)', borderBottom: '1px solid var(--ig-color-border-subtle)' }}>
    <div style={{ fontWeight: 700, color: 'var(--ig-color-text-primary)', marginBottom: 'var(--ig-space-2)' }}>
      wafer-line-a-batch-04.jpg
    </div>
    <div style={{ fontSize: 'var(--ig-font-size-xs)', color: 'var(--ig-color-text-muted)' }}>
      2560 × 1920 · 184 KB · Uploaded 2026-05-21
    </div>
  </div>
)

const ClassSlot = (
  <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
    {['Defect', 'Crack', 'Stain', 'Scratch', 'Dent', 'Rust', 'Edge anomaly', 'Particle'].map((label) => (
      <div key={label} style={slotStyle}>{label}</div>
    ))}
  </div>
)

const CommentsSlot = (
  <div style={slotStyle}>CommentsPanel slot — 자체 collapsible header를 가진 컴포넌트가 들어온다고 가정</div>
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
  args: { infoPanel: <div /> },
  render: () => (
    <StorybookPage
      title="ImageDetailSidebar"
      description="MediaDialogShell의 sidebar slot에 들어가는 표준 image detail 사이드바. 위(고정) Info → 가운데(flex-grow, 스크롤) Class → 아래(고정) Comments + Labelers 레이아웃."
    >
      <StorybookSection title="Slot composition" description="채워진 슬롯 조합별 사이드바 모습.">
        <StorybookGrid columns="repeat(auto-fit, minmax(320px, 1fr))">
          <StorybookCard title="All slots filled" subtitle="info + class + comments + labelers">
            <div style={{ width: 320, height: 560, border: '1px solid var(--ig-color-border-subtle)', borderRadius: 'var(--ig-radius-md)', overflow: 'hidden' }}>
              <ImageDetailSidebar
                infoPanel={InfoSlot}
                classSlot={ClassSlot}
                commentsSlot={CommentsSlot}
                labelersSlot={<LabelersSlot />}
              />
            </div>
          </StorybookCard>
          <StorybookCard title="Info + class only" subtitle="하단 고정 슬롯 없음">
            <div style={{ width: 320, height: 560, border: '1px solid var(--ig-color-border-subtle)', borderRadius: 'var(--ig-radius-md)', overflow: 'hidden' }}>
              <ImageDetailSidebar infoPanel={InfoSlot} classSlot={ClassSlot} />
            </div>
          </StorybookCard>
          <StorybookCard title="Info only" subtitle="최소 구성">
            <div style={{ width: 320, height: 320, border: '1px solid var(--ig-color-border-subtle)', borderRadius: 'var(--ig-radius-md)', overflow: 'hidden' }}>
              <ImageDetailSidebar infoPanel={InfoSlot} />
            </div>
          </StorybookCard>
        </StorybookGrid>
      </StorybookSection>
    </StorybookPage>
  ),
}
