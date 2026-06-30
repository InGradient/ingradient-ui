import type { Meta, StoryObj } from '@storybook/react-vite'
import { TwoColumnDialog } from './two-column-dialog'
import { StorybookPage, StorybookSection } from '@storybook-support/storybook-layout'

const meta = {
  title: 'Components/Overlays/TwoColumnDialog',
  component: TwoColumnDialog,
  tags: ['autodocs'],
  parameters: {
    a11y: { test: 'error' },
  },
} satisfies Meta<typeof TwoColumnDialog>

export default meta

type Story = StoryObj<typeof meta>

const SidebarItem = ({ label, active }: { label: string; active?: boolean }) => (
  <div
    style={{
      padding: 'var(--ig-space-3) var(--ig-space-5)',
      fontSize: 14,
      color: active ? 'var(--ig-color-text-primary)' : 'var(--ig-color-text-muted)',
      background: active ? 'var(--ig-color-surface-raised)' : 'transparent',
    }}
  >
    {label}
  </div>
)

export const Review: Story = {
  args: { title: 'Workspace settings', onClose: () => {}, children: null },
  render: () => (
    <StorybookPage
      title="TwoColumnDialog"
      description="좌측 사이드바 + 우측 메인 패널 구조의 모달 다이얼로그. 설정·관리 화면처럼 카테고리를 사이드바로 두고 본문을 전환하는 용도. 포털로 document.body 에 렌더된다."
    >
      <StorybookSection
        title="기본"
        description="title + sidebar + children 으로 구성. onClose 로 닫기(backdrop·X 버튼)."
      >
        <TwoColumnDialog
          title="Workspace settings"
          onClose={() => {}}
          sidebar={
            <>
              <SidebarItem label="General" active />
              <SidebarItem label="Members" />
              <SidebarItem label="Datasets" />
              <SidebarItem label="Billing" />
            </>
          }
        >
          <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--ig-space-4)' }}>
            <h3 style={{ margin: 0 }}>General</h3>
            <p style={{ margin: 0, color: 'var(--ig-color-text-muted)', lineHeight: 1.6 }}>
              워크스페이스 이름, 기본 언어, 표시 설정을 관리합니다. 좌측에서 카테고리를 선택하면 이 영역의
              내용이 전환됩니다.
            </p>
          </div>
        </TwoColumnDialog>
      </StorybookSection>
    </StorybookPage>
  ),
}
