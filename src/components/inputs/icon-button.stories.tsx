import type { Meta, StoryObj } from '@storybook/react-vite'
import { Search, Trash2, Plus, MoreHorizontal, Settings, X } from 'lucide-react'
import { IconButton } from './icon-button'
import { StorybookCard, StorybookGrid, StorybookPage, StorybookSection } from '@storybook-support/storybook-layout'

const meta = {
  title: 'Components/Inputs/IconButton',
  component: IconButton,
  tags: ['autodocs'],
  parameters: {
    layout: 'fullscreen',
    a11y: { test: 'todo' },
  },
} satisfies Meta<typeof IconButton>

export default meta

type Story = StoryObj<typeof meta>

export const Review: Story = {
  args: { 'aria-label': 'Action' },
  render: () => (
    <StorybookPage
      title="IconButton"
      description="Icon-only button. Use for compact toolbar actions where the icon is self-explanatory. Always pair with aria-label or a Tooltip for screen readers."
    >
      <StorybookSection title="Variants" description="solid, secondary, accent.">
        <StorybookGrid columns="repeat(auto-fit, minmax(220px, 1fr))">
          <StorybookCard title="solid">
            <IconButton variant="solid" aria-label="Search">
              <Search size={16} />
            </IconButton>
          </StorybookCard>
          <StorybookCard title="secondary">
            <IconButton variant="secondary" aria-label="Search">
              <Search size={16} />
            </IconButton>
          </StorybookCard>
          <StorybookCard title="accent">
            <IconButton variant="accent" aria-label="Add">
              <Plus size={16} />
            </IconButton>
          </StorybookCard>
          <StorybookCard title="more (secondary)">
            <IconButton variant="secondary" aria-label="More">
              <MoreHorizontal size={16} />
            </IconButton>
          </StorybookCard>
        </StorybookGrid>
      </StorybookSection>

      <StorybookSection title="Sizes" description="sm / md / lg.">
        <StorybookGrid columns="repeat(auto-fit, minmax(200px, 1fr))">
          <StorybookCard title="sm">
            <IconButton variant="secondary" size="sm" aria-label="Settings">
              <Settings size={14} />
            </IconButton>
          </StorybookCard>
          <StorybookCard title="md (default)">
            <IconButton variant="secondary" aria-label="Settings">
              <Settings size={16} />
            </IconButton>
          </StorybookCard>
          <StorybookCard title="lg">
            <IconButton variant="secondary" size="lg" aria-label="Settings">
              <Settings size={20} />
            </IconButton>
          </StorybookCard>
        </StorybookGrid>
      </StorybookSection>

      <StorybookSection title="Tones" description="Use tone='danger' for destructive actions.">
        <StorybookGrid columns="repeat(auto-fit, minmax(200px, 1fr))">
          <StorybookCard title="default tone">
            <IconButton variant="secondary" aria-label="Delete">
              <Trash2 size={16} />
            </IconButton>
          </StorybookCard>
          <StorybookCard title="danger tone">
            <IconButton variant="secondary" tone="danger" aria-label="Delete">
              <Trash2 size={16} />
            </IconButton>
          </StorybookCard>
          <StorybookCard title="secondary danger (close)">
            <IconButton variant="secondary" tone="danger" aria-label="Close">
              <X size={16} />
            </IconButton>
          </StorybookCard>
        </StorybookGrid>
      </StorybookSection>

      <StorybookSection title="Disabled">
        <StorybookGrid columns="repeat(auto-fit, minmax(200px, 1fr))">
          <StorybookCard title="disabled">
            <IconButton variant="secondary" disabled aria-label="Add">
              <Plus size={16} />
            </IconButton>
          </StorybookCard>
        </StorybookGrid>
      </StorybookSection>
    </StorybookPage>
  ),
}
