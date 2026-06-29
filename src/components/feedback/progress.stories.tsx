import type { Meta, StoryObj } from '@storybook/react-vite'
import { ProgressBar } from './progress'
import { StorybookCard, StorybookGrid, StorybookPage, StorybookSection, StorybookStack } from '@storybook-support/storybook-layout'

const meta = {
  title: 'Components/Feedback/Progress',
  component: ProgressBar,
  tags: ['autodocs'],
  parameters: {
    a11y: {
      test: 'error',
    },
  },
} satisfies Meta<typeof ProgressBar>

export default meta

type Story = StoryObj<typeof meta>

export const Review: Story = {
  args: {
    value: 48,
  },
  render: () => (
    <StorybookPage
      title="Progress"
      description="Progress bars are lightweight status indicators and should stay visually simple, especially in dense operational screens."
    >
      <StorybookSection
        title="Common progress states"
        description="Review the same component at representative values before introducing product-specific wrappers."
      >
        <StorybookGrid columns="repeat(auto-fit, minmax(var(--ig-popup-xs), 1fr))">
          {[
            ['Queued', 12],
            ['Processing', 48],
            ['Review', 76],
            ['Completed', 100],
          ].map(([label, value]) => (
            <StorybookCard key={label} title={String(label)} subtitle={`${value}%`}>
              <StorybookStack gap={10}>
                <ProgressBar value={Number(value)} />
                <div style={{ fontSize: 13, color: 'var(--ig-color-text-soft)' }}>
                  {label} state in a standard panel context.
                </div>
              </StorybookStack>
            </StorybookCard>
          ))}
        </StorybookGrid>
      </StorybookSection>

      <StorybookSection
        title="Indeterminate & tone"
        description="진행률 불명(작업 중)일 때 marquee 애니메이션, tone 으로 accent/danger/success 색."
      >
        <StorybookGrid columns="repeat(auto-fit, minmax(var(--ig-popup-xs), 1fr))">
          <StorybookCard title="Indeterminate" subtitle="작업 중 (marquee)">
            <StorybookStack gap={10}><ProgressBar indeterminate /></StorybookStack>
          </StorybookCard>
          <StorybookCard title="Danger" subtitle="실패 (tone=danger)">
            <StorybookStack gap={10}><ProgressBar value={100} tone="danger" /></StorybookStack>
          </StorybookCard>
          <StorybookCard title="Success" subtitle="완료 (tone=success)">
            <StorybookStack gap={10}><ProgressBar value={100} tone="success" /></StorybookStack>
          </StorybookCard>
        </StorybookGrid>
      </StorybookSection>
    </StorybookPage>
  ),
}
