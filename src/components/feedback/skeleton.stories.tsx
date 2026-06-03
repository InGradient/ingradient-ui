import type { Meta, StoryObj } from '@storybook/react-vite'
import { Skeleton } from './skeleton'
import { StorybookCard, StorybookGrid, StorybookPage, StorybookSection } from '@storybook-support/storybook-layout'

const meta = {
  title: 'Components/Feedback/Skeleton',
  component: Skeleton,
  tags: ['autodocs'],
  parameters: {
    layout: 'fullscreen',
    a11y: { test: 'error' },
  },
} satisfies Meta<typeof Skeleton>

export default meta

type Story = StoryObj<typeof meta>

export const Review: Story = {
  args: {},
  render: () => (
    <StorybookPage
      title="Skeleton"
      description="Loading placeholder with shimmer animation. Use during data fetch to reserve space and signal pending content."
    >
      <StorybookSection title="Heights" description="Default 16px, override with $height prop.">
        <StorybookGrid columns="repeat(auto-fit, minmax(var(--ig-popup-sm), 1fr))">
          <StorybookCard title="Default (16px)">
            <Skeleton />
          </StorybookCard>
          <StorybookCard title="$height=24px (heading)">
            <Skeleton $height="var(--ig-icon-3xl)" />
          </StorybookCard>
          <StorybookCard title="$height=80px (image placeholder)">
            <Skeleton $height="var(--ig-layout-topbar)" />
          </StorybookCard>
        </StorybookGrid>
      </StorybookSection>

      <StorybookSection title="Layouts" description="Common loading layouts.">
        <StorybookGrid columns="repeat(auto-fit, minmax(var(--ig-popup-sm), 1fr))">
          <StorybookCard title="Text block" subtitle="title + 3 lines">
            <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--ig-space-3)' }}>
              <Skeleton $height="var(--ig-font-size-3xl)" />
              <Skeleton />
              <Skeleton />
              <Skeleton style={{ width: '60%' }} />
            </div>
          </StorybookCard>
          <StorybookCard title="Card" subtitle="thumbnail + title + caption">
            <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--ig-space-3)' }}>
              <Skeleton $height="var(--ig-popup-icon-gallery-min)" />
              <Skeleton $height="var(--ig-space-8)" style={{ width: '70%' }} />
              <Skeleton style={{ width: '40%' }} />
            </div>
          </StorybookCard>
          <StorybookCard title="Row list" subtitle="3 rows">
            <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--ig-space-2)' }}>
              <Skeleton $height="var(--ig-font-size-3xl)" />
              <Skeleton $height="var(--ig-font-size-3xl)" />
              <Skeleton $height="var(--ig-font-size-3xl)" />
            </div>
          </StorybookCard>
        </StorybookGrid>
      </StorybookSection>
    </StorybookPage>
  ),
}
