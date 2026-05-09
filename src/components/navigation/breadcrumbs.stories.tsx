import type { Meta, StoryObj } from '@storybook/react-vite'
import { Breadcrumbs } from './breadcrumbs'
import { StorybookCard, StorybookGrid, StorybookPage, StorybookSection } from '@storybook-support/storybook-layout'

const meta = {
  title: 'Components/Navigation/Breadcrumbs',
  component: Breadcrumbs,
  tags: ['autodocs'],
  parameters: {
    layout: 'fullscreen',
    a11y: { test: 'todo' },
  },
} satisfies Meta<typeof Breadcrumbs>

export default meta

type Story = StoryObj<typeof meta>

export const Review: Story = {
  args: { items: [] },
  render: () => (
    <StorybookPage
      title="Breadcrumbs"
      description="Navigation breadcrumbs with optional href per item. Last item is rendered as text (no link) — represents current location."
    >
      <StorybookSection title="Variants" description="Different lengths and link patterns.">
        <StorybookGrid columns="1fr">
          <StorybookCard title="3 levels — full path with links" subtitle="all but last are links">
            <Breadcrumbs
              items={[
                { label: 'Catalog', href: '/catalog' },
                { label: 'Datasets', href: '/catalog/datasets' },
                { label: 'Bottle defects' },
              ]}
            />
          </StorybookCard>
          <StorybookCard title="2 levels" subtitle="parent → current">
            <Breadcrumbs
              items={[
                { label: 'Settings', href: '/settings' },
                { label: 'Connection' },
              ]}
            />
          </StorybookCard>
          <StorybookCard title="Single level" subtitle="no link, just current location">
            <Breadcrumbs items={[{ label: 'Dashboard' }]} />
          </StorybookCard>
          <StorybookCard title="Long path with no links" subtitle="all items as plain text (e.g. summary)">
            <Breadcrumbs
              items={[
                { label: 'Project A' },
                { label: 'Dataset X' },
                { label: 'Frame 5' },
              ]}
            />
          </StorybookCard>
        </StorybookGrid>
      </StorybookSection>
    </StorybookPage>
  ),
}
