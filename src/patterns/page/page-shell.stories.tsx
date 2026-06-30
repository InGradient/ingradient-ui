import type { Meta, StoryObj } from '@storybook/react-vite'
import {
  AppShell, PageHeader, PageHeaderRow, PageTitleBlock, PageTitle, PageSubtitle,
  PageContent, Panel, PanelHeader, PanelTitle, PanelHint, SectionTitle,
  Toolbar, FilterBar, FormSection, FieldGroup, FieldLabel, FieldHint,
} from './page-shell'
import { StorybookPage, StorybookSection } from '@storybook-support/storybook-layout'

const meta = {
  title: 'Patterns/Page/PageShell',
  component: AppShell,
  tags: ['autodocs'],
  parameters: { a11y: { test: 'error' } },
} satisfies Meta<typeof AppShell>

export default meta
type Story = StoryObj<typeof meta>

const HOST_STYLE = {
  height: 'var(--ig-popup-2xl)',
  border: 'var(--ig-border-1px) solid var(--ig-color-border-subtle)',
  borderRadius: 'var(--ig-radius-lg)',
  overflow: 'hidden',
} as const

const BODY_TEXT_STYLE = { color: 'var(--ig-color-text-muted)', fontSize: 'var(--ig-font-size-sm)' } as const

export const Review: Story = {
  render: () => (
    <StorybookPage
      title="PageShell"
      description="라이브러리 페이지의 공통 골격 styled 묶음. AppShell(헤더 고정 + 본문 스크롤) 안에 PageHeader / PageContent / Panel / Toolbar / FormSection 을 조합한다. md 이하에서 패딩·타이포가 줄어든다."
    >
      <StorybookSection title="구성 예시" description="AppShell → PageHeader(타이틀/부제 + 액션) → PageContent(Toolbar + Panel + FormSection).">
        <div style={HOST_STYLE}>
          <AppShell>
            <PageHeader>
              <PageHeaderRow>
                <PageTitleBlock>
                  <PageTitle>Datasets</PageTitle>
                  <PageSubtitle>프로젝트의 데이터셋과 라벨링 진행 상황을 관리합니다.</PageSubtitle>
                </PageTitleBlock>
                <span style={BODY_TEXT_STYLE}>[action slot]</span>
              </PageHeaderRow>
            </PageHeader>

            <PageContent>
              <Toolbar>
                <span style={BODY_TEXT_STYLE}>Toolbar — 좌측 컨트롤</span>
                <span style={BODY_TEXT_STYLE}>우측 액션</span>
              </Toolbar>

              <FilterBar>
                <span style={BODY_TEXT_STYLE}>FilterBar — 검색 입력 (1.2fr)</span>
                <span style={BODY_TEXT_STYLE}>필터</span>
              </FilterBar>

              <Panel>
                <PanelHeader>
                  <PanelTitle>Overview</PanelTitle>
                  <PanelHint>최근 7일</PanelHint>
                </PanelHeader>
                <div style={{ padding: 'var(--ig-space-7) var(--ig-space-8)', ...BODY_TEXT_STYLE }}>
                  <SectionTitle>Section</SectionTitle>
                  Panel 본문 — surfacePanel 표면 + 둥근 모서리. 내부 스크롤은 overflow:hidden + 자식이 담당.
                </div>
              </Panel>

              <FormSection>
                <SectionTitle>Settings</SectionTitle>
                <FieldGroup>
                  <FieldLabel>Project name</FieldLabel>
                  <span style={BODY_TEXT_STYLE}>[input slot]</span>
                  <FieldHint>표시 이름으로 사용됩니다.</FieldHint>
                </FieldGroup>
              </FormSection>
            </PageContent>
          </AppShell>
        </div>
      </StorybookSection>
    </StorybookPage>
  ),
}
