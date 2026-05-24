import type { Meta, StoryObj } from '@storybook/react-vite'
import { ExpandSidebarBtn } from './expand-sidebar-btn'
import { StorybookCard, StorybookGrid, StorybookPage, StorybookSection } from '@storybook-support/storybook-layout'

const meta = {
  title: 'Patterns/ExpandSidebarBtn',
  component: ExpandSidebarBtn,
  tags: ['autodocs'],
  parameters: {
    layout: 'fullscreen',
    a11y: { test: 'error' },
  },
} satisfies Meta<typeof ExpandSidebarBtn>

export default meta

type Story = StoryObj<typeof meta>

export const Review: Story = {
  render: () => (
    <StorybookPage
      title="ExpandSidebarBtn"
      description="Collapsed sidebar 상태에서 사이드바를 다시 펼치는 트리거 버튼. menu icon + transparent 배경, hover시 surface-interactive로 강조."
    >
      <StorybookSection title="Variants" description="기본과 custom aria-label.">
        <StorybookGrid columns="repeat(auto-fit, minmax(180px, 1fr))">
          <StorybookCard title="Default" subtitle='aria-label="Expand sidebar"'>
            <ExpandSidebarBtn onClick={() => undefined} />
          </StorybookCard>
          <StorybookCard title="Custom aria-label" subtitle='aria-label="Show navigation"'>
            <ExpandSidebarBtn ariaLabel="Show navigation" onClick={() => undefined} />
          </StorybookCard>
        </StorybookGrid>
      </StorybookSection>

      <StorybookSection title="In context" description="collapsed sidebar 상단에 배치된 모습.">
        <StorybookGrid columns="1fr">
          <StorybookCard title="Collapsed sidebar header">
            <div
              style={{
                width: 64,
                padding: 'var(--ig-space-3)',
                background: 'var(--ig-color-surface-panel)',
                border: '1px solid var(--ig-color-border-subtle)',
                borderRadius: 'var(--ig-radius-md)',
              }}
            >
              <ExpandSidebarBtn />
            </div>
          </StorybookCard>
        </StorybookGrid>
      </StorybookSection>
    </StorybookPage>
  ),
}
