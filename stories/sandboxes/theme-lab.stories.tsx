import type { Meta, StoryObj } from '@storybook/react-vite'
import { Alert, Button, EmptyState } from '@ingradient/ui/components'
import { StorybookCard, StorybookGrid, StorybookPage, StorybookSection, StorybookStack } from '@storybook-support/storybook-layout'

const meta = {
  title: 'Sandboxes/Theme Lab',
  tags: ['autodocs'],
  parameters: {
    layout: 'fullscreen',
  },
} satisfies Meta

export default meta

type Story = StoryObj<typeof meta>

export const Overview: Story = {
  render: (_, context) => (
    <StorybookPage
      title="Theme Lab"
      description="Global toolbar values are available to every story. Use this sandbox to inspect the current preview shell and compare common surfaces before moving into component or page stories."
    >
      <StorybookSection
        title="Current globals"
        description="지금 선택된 toolbar 값이 preview와 page story에 어떻게 전달되는지 확인한다."
      >
        <StorybookGrid columns="repeat(auto-fit, minmax(180px, 1fr))">
          <StorybookCard title="Theme">{String(context.globals.theme)}</StorybookCard>
          <StorybookCard title="Density">{String(context.globals.density)}</StorybookCard>
          <StorybookCard title="Role">{String(context.globals.role)}</StorybookCard>
          <StorybookCard title="Data scale">{String(context.globals.dataScale)}</StorybookCard>
        </StorybookGrid>
      </StorybookSection>
      <StorybookSection
        title="Core surfaces"
        description="대표 피드백/액션 컴포넌트를 같은 화면에 두고 tone과 surface contrast를 빠르게 본다."
      >
        <StorybookGrid columns="repeat(auto-fit, minmax(260px, 1fr))">
          <StorybookCard title="Actions">
            <StorybookStack gap={12}>
              <Button variant="solid">Primary action</Button>
              <Button variant="secondary">Secondary action</Button>
              <Button variant="accent">Accent action</Button>
            </StorybookStack>
          </StorybookCard>
          <StorybookCard title="Feedback">
            <StorybookStack gap={12}>
              <Alert $tone="info">Information tone</Alert>
              <Alert $tone="warning">Warning tone</Alert>
              <Alert $tone="danger">Danger tone</Alert>
            </StorybookStack>
          </StorybookCard>
          <StorybookCard title="Empty states">
            <EmptyState
              title="No items yet"
              description="Use empty states as a distinct UI state, not as a blank table."
              action={{ label: 'Create item', onClick: () => undefined }}
            />
          </StorybookCard>
        </StorybookGrid>
      </StorybookSection>
    </StorybookPage>
  ),
}
