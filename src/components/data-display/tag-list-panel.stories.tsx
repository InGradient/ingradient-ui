import React from 'react'
import type { Meta, StoryObj } from '@storybook/react-vite'
import { TagListSearch, type TagSearchCandidate } from './tag-list-panel'
import { StorybookCard, StorybookGrid, StorybookPage, StorybookSection } from '@storybook-support/storybook-layout'

const meta = {
  title: 'Components/Data Display/TagListSearch',
  component: TagListSearch,
  tags: ['autodocs'],
  parameters: {
    layout: 'fullscreen',
    a11y: { test: 'error' },
  },
} satisfies Meta<typeof TagListSearch>

export default meta

type Story = StoryObj<typeof meta>

const candidates: TagSearchCandidate[] = [
  { id: 'defect', label: 'Defect', color: '#ef4444' },
  { id: 'crack', label: 'Crack', color: '#f97316' },
  { id: 'stain', label: 'Stain', color: '#eab308' },
  { id: 'scratch', label: 'Scratch', color: '#22c55e' },
  { id: 'dent', label: 'Dent', color: '#3b82f6' },
  { id: 'rust', label: 'Rust', color: '#a855f7' },
]

export const Review: Story = {
  args: { candidates: [], onSelect: () => undefined },
  render: () => {
    const [selected, setSelected] = React.useState<string | null>(null)

    return (
      <StorybookPage
        title="TagListSearch"
        description="Search-and-pick combobox for tag-style entities (classes, labels). Filters candidates by typed query, shows color swatches, and renders an empty state with optional fallback action."
      >
        <StorybookSection title="Variants">
          <StorybookGrid columns="repeat(auto-fit, minmax(var(--ig-popup-sm), 1fr))">
            <StorybookCard title="Default" subtitle={`selected: ${selected ?? 'none'}`}>
              <TagListSearch candidates={candidates} onSelect={setSelected} />
            </StorybookCard>
            <StorybookCard title="Custom placeholder">
              <TagListSearch
                candidates={candidates}
                onSelect={setSelected}
                placeholder="Search classes..."
              />
            </StorybookCard>
            <StorybookCard title="Empty state with action">
              <TagListSearch
                candidates={[]}
                onSelect={setSelected}
                emptyMessage="No tags yet."
                emptyAction={{ label: 'Create new', onClick: () => undefined }}
              />
            </StorybookCard>
          </StorybookGrid>
        </StorybookSection>
      </StorybookPage>
    )
  },
}
