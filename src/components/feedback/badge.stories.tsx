import type { Meta, StoryObj } from '@storybook/react-vite'
import { Badge, Chip } from './badge'
import { StorybookCard, StorybookGrid, StorybookPage, StorybookSection } from '@storybook-support/storybook-layout'

const meta = {
  title: 'Components/Feedback/Badge',
  component: Badge,
  tags: ['autodocs'],
  parameters: {
    layout: 'fullscreen',
    a11y: { test: 'error' },
  },
} satisfies Meta<typeof Badge>

export default meta

type Story = StoryObj<typeof meta>

export const Review: Story = {
  args: {},
  render: () => (
    <StorybookPage
      title="Badge"
      description="Inline tag for category, status, or count. Five tones: neutral / accent / success / warning / danger. Use Chip for the bordered variant."
    >
      <StorybookSection title="Tones" description="Five $tone variants.">
        <StorybookGrid columns="repeat(auto-fit, minmax(180px, 1fr))">
          <StorybookCard title="neutral (default)">
            <Badge>Default</Badge>
          </StorybookCard>
          <StorybookCard title="accent">
            <Badge $tone="accent">Accent</Badge>
          </StorybookCard>
          <StorybookCard title="success">
            <Badge $tone="success">Synced</Badge>
          </StorybookCard>
          <StorybookCard title="warning">
            <Badge $tone="warning">Pending</Badge>
          </StorybookCard>
          <StorybookCard title="danger">
            <Badge $tone="danger">Failed</Badge>
          </StorybookCard>
        </StorybookGrid>
      </StorybookSection>

      <StorybookSection title="Chip variant" description="Same as Badge with subtle border. Use when on busy backgrounds.">
        <StorybookGrid columns="repeat(auto-fit, minmax(180px, 1fr))">
          <StorybookCard title="neutral">
            <Chip>Tag</Chip>
          </StorybookCard>
          <StorybookCard title="accent">
            <Chip $tone="accent">Active</Chip>
          </StorybookCard>
          <StorybookCard title="success">
            <Chip $tone="success">Done</Chip>
          </StorybookCard>
        </StorybookGrid>
      </StorybookSection>

      <StorybookSection title="Use cases" description="Realistic combinations.">
        <StorybookGrid columns="repeat(auto-fit, minmax(280px, 1fr))">
          <StorybookCard title="Image meta row" subtitle="quality + format">
            <div style={{ display: 'flex', gap: 'var(--ig-space-2)' }}>
              <Badge $tone="success">High (q95)</Badge>
              <Badge>JPG</Badge>
            </div>
          </StorybookCard>
          <StorybookCard title="Sync state list" subtitle="multiple states">
            <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--ig-space-2)', alignItems: 'flex-start' }}>
              <Badge $tone="success">Synced</Badge>
              <Badge $tone="warning">Uploading</Badge>
              <Badge $tone="danger">Upload Failed</Badge>
              <Badge>Local only</Badge>
            </div>
          </StorybookCard>
          <StorybookCard title="Count badge" subtitle="numeric inside Badge">
            <div style={{ display: 'flex', gap: 'var(--ig-space-2)' }}>
              <Badge $tone="accent">12</Badge>
              <Badge $tone="warning">3</Badge>
              <Badge $tone="danger">99+</Badge>
            </div>
          </StorybookCard>
        </StorybookGrid>
      </StorybookSection>
    </StorybookPage>
  ),
}
