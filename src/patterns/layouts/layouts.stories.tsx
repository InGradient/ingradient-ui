import type { Meta, StoryObj } from '@storybook/react-vite'
import type { ReactNode } from 'react'
import { SplitLayout, DashboardGrid, ListDetailLayout, SettingsShell, InspectorLayout } from './layouts'
import { StorybookCard, StorybookPage, StorybookSection } from '@storybook-support/storybook-layout'

const meta = {
  title: 'Patterns/Layouts/Layouts',
  component: SplitLayout,
  tags: ['autodocs'],
  parameters: { a11y: { test: 'error' } },
} satisfies Meta<typeof SplitLayout>

export default meta
type Story = StoryObj<typeof meta>

const PH_STYLE = {
  background: 'var(--ig-color-surface-raised)',
  border: 'var(--ig-border-1px) solid var(--ig-color-border-subtle)',
  borderRadius: 'var(--ig-radius-md)',
  padding: 'var(--ig-space-5)',
  color: 'var(--ig-color-text-muted)',
  fontSize: 'var(--ig-font-size-sm)',
  minHeight: 'var(--ig-control-height-3xl)',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
} as const

function Ph({ children }: { children: ReactNode }) {
  return <div style={PH_STYLE}>{children}</div>
}

export const Review: Story = {
  args: { content: null },
  render: () => (
    <StorybookPage
      title="Layouts"
      description="페이지 본문에서 반복되는 2~3분할 그리드 레이아웃 모음. lg 이하에서는 단일 컬럼으로 접힌다. 모두 min-width:0 으로 자식 overflow 안전."
    >
      <StorybookSection title="SplitLayout" description="sidebar / content / inspector 3분할 (sidebar·inspector 옵션). 폭은 prop 으로 override.">
        <SplitLayout
          sidebar={<Ph>sidebar</Ph>}
          content={<Ph>content</Ph>}
          inspector={<Ph>inspector</Ph>}
        />
      </StorybookSection>

      <StorybookSection title="SplitLayout — content only" description="sidebar·inspector 미지정 시 단일 컬럼.">
        <SplitLayout content={<Ph>content (no sidebar/inspector)</Ph>} />
      </StorybookSection>

      <StorybookSection title="DashboardGrid" description="카드 auto-fit 그리드 (대시보드 위젯 배치).">
        <DashboardGrid>
          <Ph>widget 1</Ph>
          <Ph>widget 2</Ph>
          <Ph>widget 3</Ph>
          <Ph>widget 4</Ph>
        </DashboardGrid>
      </StorybookSection>

      <StorybookSection title="ListDetailLayout" description="좌측 목록 + 우측 상세 (고정폭 목록 + 가변 상세).">
        <ListDetailLayout>
          <Ph>list</Ph>
          <Ph>detail</Ph>
        </ListDetailLayout>
      </StorybookSection>

      <StorybookSection title="SettingsShell" description="좁은 좌측 내비 + 본문 (설정 화면).">
        <SettingsShell>
          <Ph>settings nav</Ph>
          <Ph>settings content</Ph>
        </SettingsShell>
      </StorybookSection>

      <StorybookSection title="InspectorLayout" description="본문 + 우측 인스펙터 (가변 본문 + 고정 인스펙터).">
        <InspectorLayout>
          <Ph>main</Ph>
          <Ph>inspector</Ph>
        </InspectorLayout>
      </StorybookSection>

      <StorybookSection title="래퍼 예시" description="StorybookCard 안에 넣어도 동일하게 반응형 동작.">
        <StorybookCard title="DashboardGrid" subtitle="카드 컨테이너 내부">
          <DashboardGrid>
            <Ph>A</Ph>
            <Ph>B</Ph>
          </DashboardGrid>
        </StorybookCard>
      </StorybookSection>
    </StorybookPage>
  ),
}
