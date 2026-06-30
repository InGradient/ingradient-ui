import type { Meta, StoryObj } from '@storybook/react-vite'
import { SidebarShell, type SidebarShellItem, type SidebarShellAction } from './sidebar-shell'
import { StorybookCard, StorybookGrid, StorybookPage, StorybookSection } from '@storybook-support/storybook-layout'

const meta = {
  title: 'Patterns/Navigation/SidebarShell',
  component: SidebarShell,
  tags: ['autodocs'],
  parameters: {
    a11y: { test: 'error' },
  },
} satisfies Meta<typeof SidebarShell>

export default meta

type Story = StoryObj<typeof meta>

function Dot() {
  return (
    <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth={2} aria-hidden>
      <circle cx="12" cy="12" r="7" />
    </svg>
  )
}

const items: SidebarShellItem[] = [
  { key: 'datasets', title: 'Datasets', label: 'Datasets', icon: <Dot />, to: '#' },
  { key: 'jobs', title: 'Jobs', label: 'Jobs', icon: <Dot />, to: '#' },
  {
    key: 'projects',
    title: 'Projects',
    label: 'Projects',
    icon: <Dot />,
    children: [
      { key: 'p-active', title: 'Active', label: 'Active', icon: <Dot />, to: '#' },
      { key: 'p-archived', title: 'Archived', label: 'Archived', icon: <Dot />, to: '#' },
    ],
  },
]

const actions: SidebarShellAction[] = [
  { key: 'settings', title: 'Settings', label: 'Settings', icon: <Dot />, onClick: () => {} },
]

const brand = <strong style={{ fontSize: 14 }}>Ingradient</strong>

export const Review: Story = {
  args: { expanded: true, items, actions },
  render: () => (
    <StorybookPage
      title="SidebarShell"
      description="앱 좌측 사이드바 셸 — brand/topAction/nav items(서브아이템 포함)/actions/자유 children 슬롯. expanded 토글로 펼침(라벨 노출)·접힘(아이콘만) 두 폭을 controlled 로 전환."
    >
      <StorybookSection title="펼침 / 접힘" description="expanded=true 는 라벨·서브아이템 노출, false 는 아이콘만.">
        <StorybookGrid columns="repeat(auto-fit, minmax(var(--ig-popup-2xs), max-content))">
          <StorybookCard title="expanded" subtitle="expanded=true">
            <SidebarShell
              expanded
              onToggleExpanded={() => {}}
              brand={brand}
              items={items}
              actions={actions}
            />
          </StorybookCard>
          <StorybookCard title="collapsed" subtitle="expanded=false (아이콘만)">
            <SidebarShell
              expanded={false}
              onToggleExpanded={() => {}}
              brand={brand}
              items={items}
              actions={actions}
            />
          </StorybookCard>
        </StorybookGrid>
      </StorybookSection>
    </StorybookPage>
  ),
}
