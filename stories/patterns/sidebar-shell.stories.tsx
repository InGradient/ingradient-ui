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

export const Review: Story = {
  args: { expanded: true },
  render: () => {
    const [expanded, setExpanded] = React.useState(true)
    return (
      <StorybookPage
        title="SidebarShell"
        description="App-wide desktop sidebar pattern. Slot-based — caller provides brand, top action, items (with optional linkComponent for routing), and actions. Shell owns collapse layout, container-query nav, hover/active styling."
      >
        <StorybookSection title="Expanded vs collapsed" description="Toggle with the close button (expanded only). Container query reformats nav rows when collapsed.">
          <StorybookGrid columns="auto auto">
            <StorybookCard title="Expanded" subtitle="default width 180">
              <div style={{ display: 'flex', height: 480 }}>
                <SidebarShell
                  expanded={expanded}
                  onToggleExpanded={() => setExpanded((p) => !p)}
                  brand={<BrandMark />}
                  topAction={<ProjectButton expanded={expanded} />}
                  items={baseItems}
                  actions={baseActions}
                  navLabel="Expanded demo"
                />
              </div>
            </StorybookCard>
            <StorybookCard title="Collapsed" subtitle="width 72, centered icons">
              <div style={{ display: 'flex', height: 480 }}>
                <SidebarShell
                  expanded={false}
                  onToggleExpanded={() => undefined}
                  brand={<BrandMark />}
                  topAction={<ProjectButton expanded={false} />}
                  items={baseItems}
                  actions={baseActions}
                  navLabel="Collapsed demo"
                />
              </div>
            </StorybookCard>
          </StorybookGrid>
        </StorybookSection>

        <StorybookSection title="Active row + badge" description="2nd item uses a FakeNavLink that sets `active` class for /catalog. Notice action carries a NotificationBadge.">
          <StorybookGrid columns="auto">
            <StorybookCard title="Active /catalog + notice badge" subtitle="caller wires NavLink + Badge">
              <div style={{ display: 'flex', height: 460 }}>
                <SidebarShell
                  expanded
                  brand={<BrandMark />}
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

        <StorybookSection title="Custom width" description="width prop overrides default 180/72.">
          <StorybookGrid columns="auto">
            <StorybookCard title="width={{ expanded: 240, collapsed: 64 }}" subtitle="wider expanded, slimmer collapsed">
              <div style={{ display: 'flex', height: 420 }}>
                <SidebarShell
                  expanded
                  brand={<BrandMark />}
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
