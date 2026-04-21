import type { Meta, StoryObj } from '@storybook/react-vite'
import { EmptyState } from './empty-state'
import { Button } from '../inputs/button'
import { StorybookCard, StorybookGrid } from '@storybook-support/storybook-layout'

const meta = {
  title: 'Components/Feedback/EmptyState',
  component: EmptyState,
  tags: ['autodocs'],
  args: {
    title: 'No results found',
    description: 'Adjust filters or create a new item to populate this view.',
  },
} satisfies Meta<typeof EmptyState>

export default meta

type Story = StoryObj<typeof meta>

export const Playground: Story = {
  args: {
    action: {
      label: 'Create item',
      onClick: () => undefined,
    },
  },
}

export const Review: Story = {
  render: () => (
    <StorybookGrid columns="repeat(auto-fit, minmax(280px, 1fr))">
      <StorybookCard title="Empty collection" subtitle="처음 진입했을 때">
        <EmptyState
          title="No workspaces yet"
          description="Create the first workspace to invite reviewers and start collecting feedback."
          action={{ label: 'Create workspace', onClick: () => undefined }}
        />
      </StorybookCard>
      <StorybookCard title="Filtered result" subtitle="필터 결과가 없는 경우">
        <EmptyState
          title="No matching items"
          description="Try a broader keyword or remove one of the active filters."
        >
          <Button variant="secondary">Reset filters</Button>
        </EmptyState>
      </StorybookCard>
    </StorybookGrid>
  ),
}
