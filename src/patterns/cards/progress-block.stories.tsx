import type { Meta, StoryObj } from '@storybook/react-vite'
import { ProgressBlock } from './progress-block'
import { StorybookCard, StorybookGrid, StorybookPage, StorybookSection } from '@storybook-support/storybook-layout'

const meta = {
  title: 'Patterns/Cards/ProgressBlock',
  component: ProgressBlock,
  tags: ['autodocs'],
  parameters: {
    layout: 'fullscreen',
    a11y: { test: 'error' },
  },
} satisfies Meta<typeof ProgressBlock>

export default meta

type Story = StoryObj<typeof meta>

export const Review: Story = {
  args: { label: 'Progress', value: 50 },
  render: () => (
    <StorybookPage
      title="ProgressBlock"
      description="Card-style progress indicator: label + percentage + bar + optional hint. Use for upload progress, sync status, completion meters."
    >
      <StorybookSection title="Values">
        <StorybookGrid columns="repeat(auto-fit, minmax(280px, 1fr))">
          <StorybookCard title="0%">
            <ProgressBlock label="Upload progress" value={0} />
          </StorybookCard>
          <StorybookCard title="35%">
            <ProgressBlock label="Upload progress" value={35} />
          </StorybookCard>
          <StorybookCard title="100%">
            <ProgressBlock label="Upload complete" value={100} />
          </StorybookCard>
        </StorybookGrid>
      </StorybookSection>

      <StorybookSection title="With hint">
        <StorybookGrid columns="1fr">
          <StorybookCard title="Hint text below bar">
            <ProgressBlock
              label="Sync queue"
              value={62}
              hint="124 of 200 images uploaded · ~2 min remaining"
            />
          </StorybookCard>
        </StorybookGrid>
      </StorybookSection>
    </StorybookPage>
  ),
}
