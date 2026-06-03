import type { Meta, StoryObj } from '@storybook/react-vite'
import { StepIndicator } from './step-indicator'
import { StorybookCard, StorybookGrid, StorybookPage, StorybookSection } from '@storybook-support/storybook-layout'

const meta = {
  title: 'Components/Feedback/StepIndicator',
  component: StepIndicator,
  tags: ['autodocs'],
  parameters: {
    layout: 'fullscreen',
    a11y: { test: 'error' },
  },
} satisfies Meta<typeof StepIndicator>

export default meta

type Story = StoryObj<typeof meta>

export const Review: Story = {
  args: { items: [] },
  render: () => (
    <StorybookPage
      title="StepIndicator"
      description="Vertical list of progress steps with status-driven icons (Spinner / Check / X / Circle). Used for diagnostics flows, multi-step setup, and deployment progress."
    >
      <StorybookSection title="Status combinations" description="Each story shows a different point in a long-running flow.">
        <StorybookGrid columns="repeat(auto-fit, minmax(var(--ig-popup-class-sidebar), 1fr))">
          <StorybookCard title="All pending" subtitle="flow not started yet">
            <StepIndicator
              items={[
                { label: 'Connect to camera', status: 'pending' },
                { label: 'Verify GigE link', status: 'pending' },
                { label: 'Run capture test', status: 'pending' },
                { label: 'Generate report', status: 'pending' },
              ]}
            />
          </StorybookCard>
          <StorybookCard title="In progress" subtitle="step 2 running, step 1 done">
            <StepIndicator
              items={[
                { label: 'Connect to camera', status: 'done' },
                { label: 'Verify GigE link', status: 'running' },
                { label: 'Run capture test', status: 'pending' },
                { label: 'Generate report', status: 'pending' },
              ]}
            />
          </StorybookCard>
          <StorybookCard title="With error" subtitle="step 3 failed">
            <StepIndicator
              items={[
                { label: 'Connect to camera', status: 'done' },
                { label: 'Verify GigE link', status: 'done' },
                { label: 'Run capture test', status: 'error' },
                { label: 'Generate report', status: 'pending' },
              ]}
            />
          </StorybookCard>
          <StorybookCard title="All done" subtitle="flow completed successfully">
            <StepIndicator
              items={[
                { label: 'Connect to camera', status: 'done' },
                { label: 'Verify GigE link', status: 'done' },
                { label: 'Run capture test', status: 'done' },
                { label: 'Generate report', status: 'done' },
              ]}
            />
          </StorybookCard>
        </StorybookGrid>
      </StorybookSection>

      <StorybookSection title="Edge cases" description="Empty list and missing labels.">
        <StorybookGrid columns="repeat(auto-fit, minmax(var(--ig-popup-class-sidebar), 1fr))">
          <StorybookCard title="Empty" subtitle="no items">
            <StepIndicator items={[]} />
          </StorybookCard>
          <StorybookCard title="Empty label" subtitle="status only — placeholder ellipsis">
            <StepIndicator
              items={[
                { label: '', status: 'running' },
                { label: '', status: 'pending' },
              ]}
            />
          </StorybookCard>
        </StorybookGrid>
      </StorybookSection>
    </StorybookPage>
  ),
}
