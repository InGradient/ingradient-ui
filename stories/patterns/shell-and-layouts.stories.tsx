import React from 'react'
import type { Meta, StoryObj } from '@storybook/react-vite'
import { Button, EmptyState, SearchField, Tabs, TagList } from '../../src/components'
import {
  AppShell,
  AppSidebar,
  DashboardGrid,
  FieldGroup,
  FieldHint,
  FieldLabel,
  FilterBar,
  InspectorLayout,
  ListDetailLayout,
  MobileNavDrawer,
  PageContent,
  PageHeader,
  PageHeaderRow,
  PageSubtitle,
  PageTitle,
  PageTitleBlock,
  Panel,
  PanelHeader,
  PanelHint,
  PanelTitle,
  SidebarFooter,
  SidebarNav,
  SidebarSection,
  SplitLayout,
  TopBar,
} from '../../src/patterns'
import { StorybookCard, StorybookGrid, StorybookPage, StorybookSection, StorybookStack } from '@storybook-support/storybook-layout'

const meta = {
  title: 'Patterns/Shell And Layouts',
  tags: ['autodocs'],
  parameters: {
    layout: 'fullscreen',
  },
} satisfies Meta

export default meta

type Story = StoryObj<typeof meta>

function PlaceholderPanel({
  title,
  hint,
  children,
}: {
  title: string
  hint?: string
  children: React.ReactNode
}) {
  return (
    <Panel>
      <PanelHeader>
        <PanelTitle>{title}</PanelTitle>
        {hint ? <PanelHint>{hint}</PanelHint> : null}
      </PanelHeader>
      <div style={{ padding: 20 }}>{children}</div>
    </Panel>
  )
}

export const Overview: Story = {
  render: () => (
    <StorybookPage
      title="Shell And Layout Patterns"
      description="Patterns are the reusable composition layer above raw components. Review them here before creating page-specific UI that only exists in one product flow."
    >
      <StorybookSection
        title="App shell"
        description="Use a page shell when the same navigation, header, and content rhythm needs to be shared across multiple pages."
      >
        <AppShell style={{ minHeight: 780 }}>
          <div style={{ display: 'grid', gridTemplateColumns: '280px minmax(0, 1fr)', gap: 20, minHeight: 0 }}>
            <AppSidebar>
              <SidebarSection>
                <div style={{ fontSize: 12, fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase', color: 'var(--ig-color-text-soft)' }}>
                  Workspace
                </div>
                <SidebarNav>
                  <Button variant="solid">Overview</Button>
                  <Button variant="secondary">Datasets</Button>
                  <Button variant="secondary">Labels</Button>
                  <Button variant="secondary">Exports</Button>
                </SidebarNav>
              </SidebarSection>
              <SidebarFooter>
                <TagList
                  items={[
                    { id: '1', label: 'admin', color: '#4d88ff' },
                    { id: '2', label: 'beta', color: '#35c6a7' },
                  ]}
                />
              </SidebarFooter>
            </AppSidebar>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 20, minWidth: 0 }}>
              <PageHeader>
                <PageHeaderRow>
                  <PageTitleBlock>
                    <PageTitle>Operations Workspace</PageTitle>
                    <PageSubtitle>Page shell keeps title, summary, and action rhythm consistent across screens.</PageSubtitle>
                  </PageTitleBlock>
                  <Button variant="accent">Create run</Button>
                </PageHeaderRow>
              </PageHeader>

              <PageContent>
                <FilterBar>
                  <SearchField
                    placeholder="Search runs, exports, or jobs"
                    value=""
                    onChange={() => undefined}
                    onClear={() => undefined}
                  />
                  <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
                    <Button variant="secondary">Filters</Button>
                  </div>
                </FilterBar>

                <DashboardGrid>
                  <PlaceholderPanel title="Active queue" hint="12 jobs">
                    <EmptyState
                      title="Queue ready"
                      description="Use panel patterns even when the content area is empty or deferred."
                    />
                  </PlaceholderPanel>
                  <PlaceholderPanel title="Review activity" hint="Last 24h">
                    <div style={{ height: 180, borderRadius: 'var(--ig-radius-lg)', background: 'var(--ig-color-surface-active)' }} />
                  </PlaceholderPanel>
                  <PlaceholderPanel title="Owner notes" hint="Updated now">
                    <StorybookStack gap={8}>
                      <div style={{ color: 'var(--ig-color-text-secondary)' }}>Keep high-friction content in its own panel.</div>
                      <div style={{ color: 'var(--ig-color-text-soft)', fontSize: 13 }}>
                        This keeps page-level spacing readable while preserving a reusable shell.
                      </div>
                    </StorybookStack>
                  </PlaceholderPanel>
                </DashboardGrid>
              </PageContent>
            </div>
          </div>
        </AppShell>
      </StorybookSection>

      <StorybookSection
        title="Layout primitives"
        description="These layouts are the reusable page composition pieces that should be preferred over product-specific CSS grids."
      >
        <StorybookStack gap={18}>
          <SplitLayout
            sidebar={
              <PlaceholderPanel title="Sidebar">
                <Tabs
                  items={[
                    { value: 'filters', label: 'Filters' },
                    { value: 'saved', label: 'Saved views' },
                  ]}
                  value="filters"
                  onChange={() => undefined}
                />
              </PlaceholderPanel>
            }
            content={<PlaceholderPanel title="Main content" hint="SplitLayout">Use this when both sidebar and inspector are optional.</PlaceholderPanel>}
            inspector={<PlaceholderPanel title="Inspector">Inspector content stays visible but detached from the main panel.</PlaceholderPanel>}
          />

          <ListDetailLayout>
            <PlaceholderPanel title="List column">List/detail is preferable when the left side is navigation, not full editing.</PlaceholderPanel>
            <PlaceholderPanel title="Detail column">Use a second panel for detail instead of nesting complex card stacks.</PlaceholderPanel>
          </ListDetailLayout>

          <InspectorLayout>
            <PlaceholderPanel title="Primary workspace">Primary content grows naturally while inspector width stays controlled.</PlaceholderPanel>
            <PlaceholderPanel title="Inspector">InspectorLayout is useful for comments, audit panels, or metadata.</PlaceholderPanel>
          </InspectorLayout>
        </StorybookStack>
      </StorybookSection>
    </StorybookPage>
  ),
}

export const NavigationReview: Story = {
  render: () => (
    <StorybookPage
      title="Navigation Surfaces"
      description="Quick review surface for sidebar and top bar rhythm."
    >
      <StorybookSection title="Navigation shells" description="Compare top bar emphasis and sidebar density in the same place.">
        <StorybookStack gap={18}>
          <TopBar>
            <div style={{ fontWeight: 700 }}>Ingradient UI</div>
            <div style={{ display: 'flex', gap: 12 }}>
              <Button variant="secondary">Docs</Button>
              <Button variant="secondary">Share</Button>
            </div>
          </TopBar>

          <div style={{ display: 'grid', gridTemplateColumns: '280px minmax(0, 1fr)', gap: 20 }}>
            <AppSidebar>
              <SidebarSection>
                <FieldGroup>
                  <FieldLabel>Workspace switcher</FieldLabel>
                  <FieldHint>Use labels and hints as part of navigation composition, not ad-hoc text blocks.</FieldHint>
                </FieldGroup>
                <SidebarNav>
                  <Button variant="solid">Overview</Button>
                  <Button variant="secondary">Assets</Button>
                  <Button variant="secondary">Members</Button>
                </SidebarNav>
              </SidebarSection>
            </AppSidebar>
            <PlaceholderPanel title="Content region">Top bar and sidebar surfaces can be reviewed independently from a real page.</PlaceholderPanel>
          </div>
        </StorybookStack>
      </StorybookSection>
    </StorybookPage>
  ),
}

export const SidebarShellParity: Story = {
  render: () => {
    const [drawerOpen, setDrawerOpen] = React.useState(true)

    return (
      <StorybookPage
        title="Sidebar Shell Parity"
        description="SidebarShell review needs both desktop and mobile parity. This surface keeps the left rail, drawer rhythm, and compact mobile entry point visible together."
      >
        <StorybookSection
          title="Desktop rail and mobile drawer"
          description="Check the same navigation content in a persistent desktop rail and an on-demand mobile drawer before product-specific page work begins."
        >
          <StorybookGrid columns="minmax(280px, 360px) minmax(0, 1fr)">
            <StorybookCard title="Desktop sidebar" subtitle="persistent navigation rail">
              <AppSidebar style={{ minHeight: 520 }}>
                <SidebarSection>
                  <div style={{ fontSize: 12, fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase', color: 'var(--ig-color-text-soft)' }}>
                    Workspace
                  </div>
                  <SidebarNav>
                    <Button variant="solid">Overview</Button>
                    <Button variant="secondary">Datasets</Button>
                    <Button variant="secondary">Assets</Button>
                    <Button variant="secondary">Members</Button>
                  </SidebarNav>
                </SidebarSection>
                <SidebarFooter>
                  <TagList
                    items={[
                      { id: '1', label: 'editor', color: '#4d88ff' },
                      { id: '2', label: 'review', color: '#35c6a7' },
                    ]}
                  />
                </SidebarFooter>
              </AppSidebar>
            </StorybookCard>

            <StorybookCard title="Mobile drawer parity" subtitle="temporary navigation surface">
              <div
                style={{
                  position: 'relative',
                  minHeight: 520,
                  borderRadius: 24,
                  overflow: 'hidden',
                  border: '1px solid var(--ig-color-border-subtle)',
                  background: 'var(--ig-color-surface-base)',
                }}
              >
                <TopBar style={{ borderRadius: 0 }}>
                  <Button variant="secondary" onClick={() => setDrawerOpen((open) => !open)}>
                    {drawerOpen ? 'Close menu' : 'Open menu'}
                  </Button>
                  <div style={{ fontWeight: 700 }}>Workspace</div>
                  <Button variant="secondary">Search</Button>
                </TopBar>

                <div style={{ padding: 20, color: 'var(--ig-color-text-secondary)' }}>
                  Mobile pages should not invent a separate navigation model. They reuse the same content through a drawer.
                </div>

                {drawerOpen ? (
                  <div
                    style={{
                      position: 'absolute',
                      inset: 0,
                      background: 'rgba(10, 19, 33, 0.26)',
                    }}
                  />
                ) : null}

                <MobileNavDrawer
                  $open={drawerOpen}
                  style={{
                    position: 'absolute',
                    inset: '0 auto 0 0',
                    height: '100%',
                  }}
                >
                  <SidebarSection>
                    <div style={{ fontSize: 12, fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase', color: 'var(--ig-color-text-soft)' }}>
                      Workspace
                    </div>
                    <SidebarNav>
                      <Button variant="solid">Overview</Button>
                      <Button variant="secondary">Datasets</Button>
                      <Button variant="secondary">Assets</Button>
                      <Button variant="secondary">Members</Button>
                    </SidebarNav>
                  </SidebarSection>
                  <SidebarFooter>
                    <Button variant="secondary" onClick={() => setDrawerOpen(false)}>
                      Close drawer
                    </Button>
                  </SidebarFooter>
                </MobileNavDrawer>
              </div>
            </StorybookCard>
          </StorybookGrid>
        </StorybookSection>
      </StorybookPage>
    )
  },
}
