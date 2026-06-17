import type { Meta, StoryObj } from '@storybook/react-vite'
import { ChipGroup } from './chip-group'
import { StorybookCard, StorybookGrid, StorybookPage, StorybookSection } from '@storybook-support/storybook-layout'

const meta = {
  title: 'Patterns/Forms/ChipGroup',
  component: ChipGroup,
  tags: ['autodocs'],
  parameters: {
    layout: 'fullscreen',
    a11y: { test: 'error' },
  },
} satisfies Meta<typeof ChipGroup>

export default meta

type Story = StoryObj<typeof meta>

const classItems = [
  { id: 'defect', label: 'Defect', color: '#ef4444' },
  { id: 'crack', label: 'Crack', color: '#f97316' },
  { id: 'stain', label: 'Stain', color: '#eab308' },
  { id: 'scratch', label: 'Scratch', color: '#22c55e' },
  { id: 'dent', label: 'Dent', color: '#3b82f6' },
  { id: 'rust', label: 'Rust', color: '#a855f7' },
  { id: 'gap', label: 'Gap', color: '#ec4899' },
]

const tagItems = [
  { id: 'frontend', label: 'frontend' },
  { id: 'design', label: 'design-system' },
  { id: 'a11y', label: 'a11y' },
]

export const Review: Story = {
  args: { items: [] },
  render: () => (
    <StorybookPage
      title="ChipGroup"
      description="Compact list of chips with optional color swatch. Used for class labels, tags, and other small categorical badges. maxVisible truncates with '+N more' overflow indicator."
    >
      <StorybookSection title="Variants" description="With/without color swatch.">
        <StorybookGrid columns="repeat(auto-fit, minmax(var(--ig-popup-md), 1fr))">
          <StorybookCard title="With color" subtitle="domain class chips">
            <ChipGroup items={classItems.slice(0, 5)} />
          </StorybookCard>
          <StorybookCard title="Plain labels" subtitle="no color">
            <ChipGroup items={tagItems} />
          </StorybookCard>
        </StorybookGrid>
      </StorybookSection>

      <StorybookSection title="maxVisible" description="Truncate when too many items.">
        <StorybookGrid columns="repeat(auto-fit, minmax(var(--ig-popup-md), 1fr))">
          <StorybookCard title="No truncation" subtitle="7 items, all shown">
            <ChipGroup items={classItems} />
          </StorybookCard>
          <StorybookCard title="maxVisible=3" subtitle="shows 3 + '+4 more'">
            <ChipGroup items={classItems} maxVisible={3} />
          </StorybookCard>
          <StorybookCard title="maxVisible=5" subtitle="shows 5 + '+2 more'">
            <ChipGroup items={classItems} maxVisible={5} />
          </StorybookCard>
        </StorybookGrid>
      </StorybookSection>

      <StorybookSection title="Click handler" description="onItemClick fires with chip id.">
        <StorybookGrid columns="1fr">
          <StorybookCard title="Logs to console" subtitle="open browser console to see clicks">
            <ChipGroup
              items={classItems.slice(0, 4)}
              onItemClick={(id) => {
                // eslint-disable-next-line no-console
                console.log('clicked', id)
              }}
            />
          </StorybookCard>
        </StorybookGrid>
      </StorybookSection>
    </StorybookPage>
  ),
}
