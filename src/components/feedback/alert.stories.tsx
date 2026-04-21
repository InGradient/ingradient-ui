import type { Meta, StoryObj } from '@storybook/react-vite'
import { Alert, InlineMessage } from './alert'
import { StorybookCard, StorybookGrid, StorybookStack } from '@storybook-support/storybook-layout'

const meta = {
  title: 'Components/Feedback/Alert',
  component: Alert,
  tags: ['autodocs'],
  args: {
    $tone: 'info',
    children: 'This workspace is currently read-only while review mode is active.',
  },
} satisfies Meta<typeof Alert>

export default meta

type Story = StoryObj<typeof meta>

export const Playground: Story = {}

export const Review: Story = {
  render: () => (
    <StorybookGrid columns="repeat(auto-fit, minmax(260px, 1fr))">
      <StorybookCard title="Alert tones" subtitle="페이지 수준 메시지">
        <StorybookStack>
          <Alert $tone="info">Review mode is active for this dataset.</Alert>
          <Alert $tone="success">Export completed and is ready to publish.</Alert>
          <Alert $tone="warning">Some labels are missing required metadata.</Alert>
          <Alert $tone="danger">The selected item could not be saved.</Alert>
        </StorybookStack>
      </StorybookCard>
      <StorybookCard title="Inline message" subtitle="좁은 공간의 보조 메시지">
        <StorybookStack>
          <InlineMessage $tone="info">2 comments were added after your last sync.</InlineMessage>
          <InlineMessage $tone="warning">Reviewer approval is still required.</InlineMessage>
        </StorybookStack>
      </StorybookCard>
    </StorybookGrid>
  ),
}
