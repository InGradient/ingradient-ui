import type { Meta, StoryObj } from '@storybook/react-vite'
import { ChartContainer } from './chart-container'
import { ChartLegend } from './chart-legend'
import { StorybookCard, StorybookGrid, StorybookPage, StorybookSection } from '@storybook-support/storybook-layout'

const meta = {
  title: 'Components/Charts/ChartContainer',
  component: ChartContainer,
  tags: ['autodocs'],
  parameters: {
    layout: 'fullscreen',
    a11y: { test: 'error' },
  },
} satisfies Meta<typeof ChartContainer>

export default meta

type Story = StoryObj<typeof meta>

function Placeholder({ label }: { label: string }) {
  return (
    <div
      style={{
        width: '100%',
        height: '100%',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: 'var(--ig-color-blue-tint-12)',
        borderRadius: 'var(--ig-radius-md)',
        color: 'var(--ig-color-text-muted)',
        fontSize: 'var(--ig-font-size-sm)',
      }}
    >
      {label}
    </div>
  )
}

const sampleLegend = [
  { label: 'Synced', color: 'var(--ig-color-success)' },
  { label: 'Pending', color: 'var(--ig-color-warning)' },
  { label: 'Failed', color: 'var(--ig-color-danger)' },
]

export const Review: Story = {
  args: { title: 'Container', children: null },
  render: () => (
    <StorybookPage
      title="ChartContainer"
      description="Chart shell with title, description, height, optional legend slot, and loading/empty states. Use as wrapper around recharts (or any visualization) for consistent presentation."
    >
      <StorybookSection title="Basic" description="Title + description + chart area.">
        <StorybookGrid columns="1fr">
          <StorybookCard title="Default (height=260)">
            <ChartContainer
              title="Capture volume"
              description="Daily image capture trend across all datasets."
            >
              <Placeholder label="(chart area)" />
            </ChartContainer>
          </StorybookCard>
        </StorybookGrid>
      </StorybookSection>

      <StorybookSection title="With legend" description="Legend slot in header (right-aligned).">
        <StorybookGrid columns="1fr">
          <StorybookCard title="Sync state breakdown" subtitle="legend prop accepts any ReactNode">
            <ChartContainer
              title="Sync state"
              description="Image sync status across the last 24 hours."
              legend={<ChartLegend items={sampleLegend} />}
            >
              <Placeholder label="(stacked bar chart area)" />
            </ChartContainer>
          </StorybookCard>
        </StorybookGrid>
      </StorybookSection>

      <StorybookSection title="States" description="Loading and empty.">
        <StorybookGrid columns="repeat(auto-fit, minmax(360px, 1fr))">
          <StorybookCard title="Loading" subtitle="loading=true → skeleton">
            <ChartContainer title="Capture volume" description="Loading recent data" loading>
              <Placeholder label="(would render chart)" />
            </ChartContainer>
          </StorybookCard>
          <StorybookCard title="Empty" subtitle="empty=true → empty message">
            <ChartContainer
              title="Capture volume"
              description="No captures recorded yet."
              empty
              emptyMessage="No data for the selected range."
            >
              <Placeholder label="(would render chart)" />
            </ChartContainer>
          </StorybookCard>
        </StorybookGrid>
      </StorybookSection>

      <StorybookSection title="Custom height" description="height prop in pixels.">
        <StorybookGrid columns="1fr">
          <StorybookCard title="height=180 (compact)">
            <ChartContainer title="Compact chart" description="Smaller frame for dashboard tile" height={180}>
              <Placeholder label="(short chart)" />
            </ChartContainer>
          </StorybookCard>
          <StorybookCard title="height=380 (large)">
            <ChartContainer title="Large chart" description="More vertical space for dense data" height={380}>
              <Placeholder label="(tall chart)" />
            </ChartContainer>
          </StorybookCard>
        </StorybookGrid>
      </StorybookSection>
    </StorybookPage>
  ),
}
