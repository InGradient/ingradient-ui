import type { Meta, StoryObj } from '@storybook/react-vite'
import {
  AppSidebar,
  MobileNavDrawer,
  SidebarFooter,
  SidebarNav,
  SidebarSection,
  TopBar,
} from './navigation'
import { StorybookCard, StorybookGrid, StorybookPage, StorybookSection } from '@storybook-support/storybook-layout'

const meta = {
  title: 'Patterns/Navigation/Navigation',
  component: AppSidebar,
  tags: ['autodocs'],
  parameters: {
    a11y: { test: 'error' },
  },
} satisfies Meta<typeof AppSidebar>

export default meta

type Story = StoryObj<typeof meta>

const linkStyle = { fontSize: 'var(--ig-font-size-md)', color: 'var(--ig-color-text-muted)' }
const labelStyle = {
  fontSize: 'var(--ig-font-size-2xs)',
  fontWeight: 'var(--ig-font-weight-bold)',
  letterSpacing: 'var(--ig-letter-spacing-wider)',
  textTransform: 'uppercase' as const,
  color: 'var(--ig-color-text-soft)',
}

const navLinks = (
  <>
    <a href="#" style={linkStyle}>Datasets</a>
    <a href="#" style={linkStyle}>Jobs</a>
    <a href="#" style={linkStyle}>Projects</a>
  </>
)

export const Review: Story = {
  render: () => (
    <StorybookPage
      title="Navigation"
      description="네비게이션 셸 프리미티브 모음 — AppSidebar(좌측 패널) / TopBar(상단 바) / SidebarNav·SidebarSection·SidebarFooter(사이드바 내부 슬롯) / MobileNavDrawer(모바일 슬라이드 드로어). 라우팅·active 상태는 caller 책임, 여기선 surface·레이아웃만 제공."
    >
      <StorybookSection title="AppSidebar + 슬롯" description="AppSidebar 안에 SidebarSection · SidebarNav · SidebarFooter 를 합성.">
        <StorybookGrid columns="repeat(auto-fit, minmax(var(--ig-popup-sm), max-content))">
          <StorybookCard title="composed sidebar" subtitle="section + nav + footer">
            <AppSidebar>
              <SidebarSection>
                <span style={labelStyle}>Workspace</span>
                {navLinks}
              </SidebarSection>
              <SidebarNav aria-label="Secondary">
                <span style={labelStyle}>Resources</span>
                <a href="#" style={linkStyle}>Docs</a>
                <a href="#" style={linkStyle}>API keys</a>
              </SidebarNav>
              <SidebarFooter>
                <a href="#" style={linkStyle}>Settings</a>
              </SidebarFooter>
            </AppSidebar>
          </StorybookCard>
          <StorybookCard title="MobileNavDrawer" subtitle="$open=true (열림 상태)">
            <div style={{ position: 'relative', height: 'var(--ig-popup-md)', overflow: 'hidden' }}>
              <MobileNavDrawer $open style={{ position: 'absolute' }}>
                <span style={labelStyle}>Menu</span>
                {navLinks}
              </MobileNavDrawer>
            </div>
          </StorybookCard>
        </StorybookGrid>
      </StorybookSection>

      <StorybookSection title="TopBar" description="상단 바 — 좌측 브랜드, 우측 액션을 space-between 배치.">
        <StorybookGrid columns="1fr">
          <StorybookCard title="top bar">
            <TopBar>
              <strong style={{ fontSize: 'var(--ig-font-size-lg)' }}>Ingradient</strong>
              <a href="#" style={linkStyle}>Account</a>
            </TopBar>
          </StorybookCard>
        </StorybookGrid>
      </StorybookSection>
    </StorybookPage>
  ),
}
