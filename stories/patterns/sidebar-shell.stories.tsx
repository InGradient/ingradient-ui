import React from 'react'
import type { Meta, StoryObj } from '@storybook/react-vite'
import { SidebarShell } from '../../src/patterns'
import { NotificationBadge } from '../../src/components'
import { StorybookCard, StorybookGrid, StorybookPage, StorybookSection } from '@storybook-support/storybook-layout'
import {
  BrandMark, NoticeIcon, ProjectButton,
  baseActions, baseItems,
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

export const Review: Story = {
  args: { expanded: true },
  render: () => {
    const [expanded, setExpanded] = React.useState(true)

    return (
      <StorybookPage
        title="SidebarShell"
        description="App-wide desktop sidebar pattern. Slot-based — caller provides brand, top action, items, actions. Shell owns layout, collapse animation, container-query nav row reflow, hover-active styling, and brand-area hover swap."
      >
        <StorybookSection
          title="Interactive demo"
          description="펼침/접힘 토글. 펼침: brand + collapse chevron (우측). 접힘: brand 만 (중앙) — 마우스 호버 시 brand 자리에 expand chevron swap, 클릭 시 펼침."
        >
          <StorybookGrid columns="1fr">
            <StorybookCard
              title={expanded ? 'Expanded (180px)' : 'Collapsed (72px)'}
              subtitle="브랜드 영역 hover 해보세요"
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
                <div style={{ flex: 1, padding: 'var(--ig-space-7)', color: 'var(--ig-color-text-muted)' }}>
                  Main content area — 우측 컨텐츠는 sidebar 폭에 맞춰 자동 reflow.
                </div>
              </div>
            </StorybookCard>
          </StorybookGrid>
        </StorybookSection>

        <StorybookSection
          title="Active row + badge"
          description="`linkComponent` 로 NavLink 를 넘기면 활성 row 가 자동 강조. action 의 badge prop 으로 NotificationBadge 합성."
        >
          <StorybookGrid columns="1fr">
            <StorybookCard title="/catalog active + notice 3" subtitle="caller wires NavLink + Badge">
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
                  navLabel="Active demo"
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
            <StorybookCard title="width={{ expanded: 240, collapsed: 64 }}" subtitle="wider expanded, slimmer collapsed">
              <div style={FRAME_STYLE}>
                <SidebarShell
                  expanded
                  brand={<BrandMark expanded />}
                  topAction={<ProjectButton expanded />}
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
