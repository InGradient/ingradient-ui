import type { Meta, StoryObj } from '@storybook/react-vite'
import { DialogCloseButton } from './dialog-close-button'
import { StorybookCard, StorybookGrid, StorybookPage, StorybookSection } from '@storybook-support/storybook-layout'

const meta = {
  title: 'Components/Overlays/DialogCloseButton',
  component: DialogCloseButton,
  tags: ['autodocs'],
  parameters: {
    layout: 'fullscreen',
    a11y: { test: 'error' },
  },
} satisfies Meta<typeof DialogCloseButton>

export default meta

type Story = StoryObj<typeof meta>

export const Review: Story = {
  render: () => (
    <StorybookPage
      title="DialogCloseButton"
      description="다이얼로그 헤더의 닫기 버튼. transparent border / background에서 hover시 surface-interactive로 강조된다."
    >
      <StorybookSection title="States" description="기본 / hover / disabled.">
        <StorybookGrid columns="repeat(auto-fit, minmax(var(--ig-popup-xs-narrow), 1fr))">
          <StorybookCard title="Default" subtitle="standalone">
            <DialogCloseButton onClick={() => undefined} />
          </StorybookCard>
          <StorybookCard title="Disabled" subtitle="비활성화">
            <DialogCloseButton disabled />
          </StorybookCard>
          <StorybookCard title="Custom aria-label" subtitle='aria-label="Dismiss"'>
            <DialogCloseButton aria-label="Dismiss" title="Dismiss" />
          </StorybookCard>
        </StorybookGrid>
      </StorybookSection>

      <StorybookSection title="In context" description="다이얼로그 헤더 우측에 배치된 모습.">
        <StorybookGrid columns="1fr">
          <StorybookCard title="Dialog header">
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                padding: 'var(--ig-space-5) var(--ig-space-6)',
                background: 'var(--ig-color-surface-raised)',
                border: '1px solid var(--ig-color-border-subtle)',
                borderRadius: 'var(--ig-radius-md)',
                gap: 'var(--ig-space-4)',
              }}
            >
              <strong style={{ color: 'var(--ig-color-text-primary)' }}>Dataset settings</strong>
              <DialogCloseButton />
            </div>
          </StorybookCard>
        </StorybookGrid>
      </StorybookSection>
    </StorybookPage>
  ),
}
