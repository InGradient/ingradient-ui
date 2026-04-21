import type { Meta, StoryObj } from '@storybook/react-vite'
import { ProgressBar } from './progress'
import { StorybookCard, StorybookGrid, StorybookPage, StorybookSection, StorybookStack } from '@storybook-support/storybook-layout'

const meta = {
  title: 'Components/Feedback/Progress',
  component: ProgressBar,
  tags: ['autodocs'],
  parameters: {
    a11y: {
      test: 'todo',
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
        <StorybookGrid columns="repeat(auto-fit, minmax(220px, 1fr))">
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
    </StorybookPage>
  ),
}
