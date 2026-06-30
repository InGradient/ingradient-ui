import type { Meta, StoryObj } from '@storybook/react-vite'
import { MediaDialogShell } from './media-dialog-shell'
import { StorybookCard, StorybookGrid, StorybookPage, StorybookSection } from '@storybook-support/storybook-layout'

const meta = {
  title: 'Patterns/Dialogs/MediaDialogShell',
  component: MediaDialogShell,
  tags: ['autodocs'],
  parameters: {
    a11y: { test: 'error' },
  },
} satisfies Meta<typeof MediaDialogShell>

export default meta

type Story = StoryObj<typeof meta>

// positioning='absolute' → 가장 가까운 relative 조상에 가둬 in-card 데모 가능.
const HOST = { position: 'relative' as const, height: 'var(--ig-popup-lg)', overflow: 'hidden' as const }

const mainSurface = {
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  height: '100%',
  background: 'var(--ig-color-bg-canvas)',
  color: 'var(--ig-color-text-muted)',
  fontSize: 14,
}

const sampleMain = <div style={mainSurface}>Canvas / media viewport</div>
const sampleSidebar = (
  <div style={{ display: 'flex', flexDirection: 'column', gap: 8, padding: 12 }}>
    <strong style={{ fontSize: 14 }}>Details</strong>
    <span style={{ fontSize: 12, color: 'var(--ig-color-text-soft)' }}>Metadata · labels · history</span>
  </div>
)

export const Review: Story = {
  args: { main: sampleMain, positioning: 'absolute' },
  render: () => (
    <StorybookPage
      title="MediaDialogShell"
      description="전체화면 미디어/캔버스 모달 셸 — backdrop + content box + main 영역 + (옵션) resizable 우측 sidebar + topRight floating controls. positioning='absolute' 로 카드 안에 가둬 데모, 실제 사용은 'fixed'."
    >
      <StorybookSection title="레이아웃" description="main 단독 / main + sidebar(+resizer) / topRight 컨트롤.">
        <StorybookGrid columns="1fr">
          <StorybookCard title="main + sidebar" subtitle="resizer + topRight 포함">
            <div style={HOST}>
              <MediaDialogShell
                positioning="absolute"
                ariaLabel="Media viewer"
                onClose={() => {}}
                main={sampleMain}
                sidebar={sampleSidebar}
                onSidebarResize={() => {}}
                topRight={
                  <button type="button" style={{ fontSize: 12 }} onClick={() => {}}>
                    Close
                  </button>
                }
              />
            </div>
          </StorybookCard>
          <StorybookCard title="main only" subtitle="sidebar 없음 → main 전체 너비">
            <div style={HOST}>
              <MediaDialogShell
                positioning="absolute"
                ariaLabel="Media viewer (no sidebar)"
                onClose={() => {}}
                main={sampleMain}
              />
            </div>
          </StorybookCard>
        </StorybookGrid>
      </StorybookSection>
    </StorybookPage>
  ),
}
