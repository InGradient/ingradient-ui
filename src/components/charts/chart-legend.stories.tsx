import type { Meta, StoryObj } from '@storybook/react-vite'
import { ChartLegend } from './chart-legend'
import { StorybookCard, StorybookGrid, StorybookPage, StorybookSection } from '@storybook-support/storybook-layout'

const meta = {
  title: 'Components/Charts/ChartLegend',
  component: ChartLegend,
  tags: ['autodocs'],
  parameters: {
    layout: 'fullscreen',
    a11y: { test: 'error' },
  },
} satisfies Meta<typeof ChartLegend>

export default meta

type Story = StoryObj<typeof meta>

export const Review: Story = {
  args: { items: [] },
  render: () => (
    <StorybookPage
      title="ChartLegend"
      description="Inline color-swatch legend for charts. Pass via ChartContainer's legend slot or render standalone above any chart."
    >
      <StorybookSection title="Variants" description="Different label counts and color combinations.">
        <StorybookGrid columns="1fr">
          <StorybookCard title="2 items" subtitle="binary breakdown">
            <ChartLegend
              items={[
                { label: 'Labeled', color: 'var(--ig-color-accent)' },
                { label: 'Unlabeled', color: 'var(--ig-color-text-soft)' },
              ]}
            />
          </StorybookCard>
          <StorybookCard title="3 items — sync states">
            <ChartLegend
              items={[
                { label: 'Synced', color: 'var(--ig-color-success)' },
                { label: 'Pending', color: 'var(--ig-color-warning)' },
                { label: 'Failed', color: 'var(--ig-color-danger)' },
              ]}
            />
          </StorybookCard>
          <StorybookCard title="6 items — class palette" subtitle="wraps onto multiple rows">
            <ChartLegend
              items={[
                { label: 'Defect', color: '#ef4444' },
                { label: 'Crack', color: '#f97316' },
                { label: 'Stain', color: '#eab308' },
                { label: 'Scratch', color: '#22c55e' },
                { label: 'Dent', color: '#3b82f6' },
                { label: 'Rust', color: '#a855f7' },
              ]}
            />
          </StorybookCard>
        </StorybookGrid>
      </StorybookSection>
    </StorybookPage>
  ),
}
