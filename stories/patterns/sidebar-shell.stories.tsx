import React from 'react'
import type { Meta, StoryObj } from '@storybook/react-vite'
import { SidebarShell } from '../../src/patterns'
import { NotificationBadge } from '../../src/components'
import { StorybookCard, StorybookGrid, StorybookPage, StorybookSection } from '@storybook-support/storybook-layout'
import {
  BrandMark, NoticeIcon, ProjectButton,
  baseActions, baseItems, expandableItems,
} from './sidebar-shell.stories.helpers'

const meta = {
  title: 'Patterns/Navigation/SidebarShell',
  component: SidebarShell,
  tags: ['autodocs'],
  parameters: {
    layout: 'fullscreen',
    a11y: { test: 'error' },
  },
} satisfies Meta<typeof SidebarShell>

export default meta

type Story = StoryObj<typeof meta>

const FRAME_STYLE: React.CSSProperties = { display: 'flex', height: 540 }
const CONTENT_STYLE: React.CSSProperties = { flex: 1, padding: 'var(--ig-space-7)', color: 'var(--ig-color-text-muted)' }

export const Review: Story = {
  args: { expanded: true },
  render: () => {
    const [expanded, setExpanded] = React.useState(true)

    return (
      <StorybookPage
        title="SidebarShell"
        description="App-wide desktop sidebar pattern. Slot-based — caller provides brand, top action, items, actions. Shell owns layout, collapse animation, brand-area hover swap, expandable items, container-query reflow, active-row styling."
      >
        <StorybookSection
          title="Interactive demo"
          description="펼침/접힘 토글. 펼침: brand + collapse chevron (우측). 접힘: brand 만 (중앙) — hover 시 brand 자리에 expand chevron swap, 클릭 시 펼침. 활성 row 는 NavLink 가 자동 강조."
        >
          <StorybookGrid columns="1fr">
            <StorybookCard
              title={expanded ? 'Expanded (180px)' : 'Collapsed (72px)'}
              subtitle="brand 영역 hover · row 클릭 시 active 강조"
            >
              <div style={FRAME_STYLE}>
                <SidebarShell
                  expanded={expanded}
                  onToggleExpanded={() => setExpanded((p) => !p)}
                  brand={<BrandMark expanded={expanded} />}
                  topAction={<ProjectButton expanded={expanded} />}
                  items={baseItems}
                  actions={baseActions}
                  navLabel="Demo"
                />
                <div style={CONTENT_STYLE}>
                  Main content area — sidebar 폭에 맞춰 자동 reflow.
                </div>
              </div>
            </StorybookCard>
          </StorybookGrid>
        </StorybookSection>

        <StorybookSection
          title="Expandable items"
          description="`item.children` 가 있으면 row 가 expand button 으로 렌더 — 클릭 시 토글, 우측 chevron 회전. ingradient-os 의 projects/conversations 패턴."
        >
          <StorybookGrid columns="1fr">
            <StorybookCard title="Projects 그룹 펼침" subtitle="children 3개 (datasets)">
              <div style={FRAME_STYLE}>
                <SidebarShell
                  expanded
                  brand={<BrandMark expanded />}
                  items={expandableItems}
                  actions={baseActions}
                  navLabel="Expandable demo"
                />
                <div style={CONTENT_STYLE}>
                  Projects 행 클릭 시 sub-items 펼침/접힘. 사이드바 접힘 상태에선 children 숨김.
                </div>
              </div>
            </StorybookCard>
          </StorybookGrid>
        </StorybookSection>

        <StorybookSection
          title="With notice badge"
          description="action 의 badge prop 으로 NotificationBadge 합성. 접힘 상태에서도 badge 가 아이콘 위에 노출."
        >
          <StorybookGrid columns="1fr">
            <StorybookCard title="Notice 3" subtitle="caller wires NotificationBadge">
              <div style={FRAME_STYLE}>
                <SidebarShell
                  expanded
                  brand={<BrandMark expanded />}
                  topAction={<ProjectButton expanded />}
                  items={baseItems}
                  actions={[
                    {
                      key: 'notice',
                      title: 'Notice',
                      label: 'Notice',
                      icon: <NoticeIcon />,
                      badge: (
                        <NotificationBadge value="3" tone="danger">
                          <NoticeIcon />
                        </NotificationBadge>
                      ),
                    },
                    baseActions[1],
                  ]}
                  navLabel="Notice demo"
                />
              </div>
            </StorybookCard>
          </StorybookGrid>
        </StorybookSection>

        <StorybookSection
          title="Custom width"
          description="`width` prop 으로 폭 오버라이드. 기본 expanded/collapsed = 180/72."
        >
          <StorybookGrid columns="1fr">
            <StorybookCard title="width={{ expanded: 240, collapsed: 64 }}">
              <div style={FRAME_STYLE}>
                <SidebarShell
                  expanded
                  brand={<BrandMark expanded />}
                  items={baseItems}
                  actions={baseActions}
                  width={{ expanded: 240, collapsed: 64 }}
                  navLabel="Custom width demo"
                />
              </div>
            </StorybookCard>
          </StorybookGrid>
        </StorybookSection>
      </StorybookPage>
    )
  },
}
