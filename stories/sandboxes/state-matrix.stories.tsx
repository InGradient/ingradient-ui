import { EmptyState } from '../../src/components/feedback/empty-state'
import { Spinner } from '../../src/components/feedback/spinner'
import { Skeleton } from '../../src/components/feedback/skeleton'
import { Alert } from '../../src/components/feedback/alert'
import { StorybookCard, StorybookGrid, StorybookPage, StorybookSection, StorybookStack } from '@storybook-support/storybook-layout'
import type { Meta, StoryObj } from '@storybook/react-vite'

const meta = {
  title: 'Sandboxes/State Matrix',
  tags: ['autodocs'],
  parameters: {
    layout: 'fullscreen',
  },
} satisfies Meta

export default meta

type Story = StoryObj<typeof meta>

export const Overview: Story = {
  render: () => (
    <StorybookPage
      title="State Matrix"
      description="This sandbox keeps common UI states visible together so teams can compare loading, empty, and error behavior before baking them into page stories."
    >
      <StorybookSection
        title="Common async states"
        description="Use this matrix when discussing state language, fallback density, and action guidance."
      >
        <StorybookGrid columns="repeat(auto-fit, minmax(260px, 1fr))">
          <StorybookCard title="Inline loading" subtitle="compact waiting state">
            <div style={{ display: 'flex', gap: 12, alignItems: 'center', color: 'var(--ig-color-text-secondary)' }}>
              <Spinner aria-label="Loading review data" />
              Loading review data...
            </div>
          </StorybookCard>

          <StorybookCard title="Skeleton loading" subtitle="structured placeholder">
            <StorybookStack gap={10}>
              <Skeleton $height="22px" />
              <Skeleton $height="16px" />
              <Skeleton $height="16px" />
              <Skeleton $height="64px" />
            </StorybookStack>
          </StorybookCard>

          <StorybookCard title="Empty state" subtitle="no content available">
            <EmptyState
              title="No matching workspaces"
              description="Try a broader keyword or clear one of the active filters."
              action={{ label: 'Reset filters', onClick: () => undefined }}
            />
          </StorybookCard>

          <StorybookCard title="Error guidance" subtitle="recoverable failure">
            <Alert $tone="danger">
              Workspace data could not be loaded. Retry the request or verify the current API connection.
            </Alert>
          </StorybookCard>
        </StorybookGrid>
      </StorybookSection>
    </StorybookPage>
  ),
}
