import React from 'react'
import type { Meta, StoryObj } from '@storybook/react-vite'
import { FilterPopover, FilterPopoverSection } from './filter-popover'
import { Switch } from '../inputs/toggles'
import { DropdownSelect } from '../inputs/dropdown-select'
import { StorybookCard, StorybookGrid, StorybookPage, StorybookSection } from '@storybook-support/storybook-layout'

const meta = {
  title: 'Components/Overlays/FilterPopover',
  component: FilterPopover,
  tags: ['autodocs'],
  parameters: {
    layout: 'fullscreen',
    a11y: { test: 'todo' },
  },
} satisfies Meta<typeof FilterPopover>

export default meta

type Story = StoryObj<typeof meta>

const dateOptions = [
  { value: 'all', label: 'All' },
  { value: 'today', label: 'Today' },
  { value: 'last7', label: 'Last 7 days' },
  { value: 'last30', label: 'Last 30 days' },
]

export const Review: Story = {
  args: { children: null },
  render: () => {
    const [localOnly, setLocalOnly] = React.useState(false)
    const [datePreset, setDatePreset] = React.useState('all')
    const [filterClassReset, setFilterClassReset] = React.useState(false)

    return (
      <StorybookPage
        title="FilterPopover"
        description="Popover with section list for filter UI. Use FilterPopoverSection for each filter group (title + content + optional right-aligned actions). Position via inline style (relative parent) or anchor prop (fixed positioning)."
      >
        <StorybookSection
          title="Static positioning"
          description="No anchor — caller controls positioning via parent container. Section content is free-form (Switch, DropdownSelect, etc)."
        >
          <StorybookGrid columns="repeat(auto-fit, minmax(320px, 1fr))">
            <StorybookCard title="Two sections" subtitle="Source + Date filters">
              <FilterPopover>
                <FilterPopoverSection title="Source">
                  <label style={{ display: 'flex', alignItems: 'center', gap: 'var(--ig-space-3)', cursor: 'pointer' }}>
                    <Switch checked={localOnly} onChange={(e) => setLocalOnly(e.target.checked)} />
                    <span>Local only</span>
                  </label>
                </FilterPopoverSection>
                <FilterPopoverSection title="Date">
                  <DropdownSelect
                    value={datePreset}
                    options={dateOptions}
                    onChange={(v) => setDatePreset(v)}
                  />
                </FilterPopoverSection>
              </FilterPopover>
            </StorybookCard>

            <StorybookCard title="With actions" subtitle="section header right-aligned button">
              <FilterPopover width={300}>
                <FilterPopoverSection
                  title="Classes"
                  actions={
                    <button
                      type="button"
                      onClick={() => setFilterClassReset((v) => !v)}
                      style={{
                        background: 'none',
                        border: 'none',
                        color: 'var(--ig-color-accent)',
                        fontSize: 11,
                        cursor: 'pointer',
                        padding: 0,
                      }}
                    >
                      {filterClassReset ? 'Cleared' : 'Reset'}
                    </button>
                  }
                >
                  <div style={{ fontSize: 12, color: 'var(--ig-color-text-muted)' }}>
                    {filterClassReset ? 'No filter applied.' : '3 classes selected'}
                  </div>
                </FilterPopoverSection>
                <FilterPopoverSection title="Labeled">
                  <div style={{ fontSize: 12, color: 'var(--ig-color-text-muted)' }}>
                    All / Labeled / Unlabeled toggle would go here.
                  </div>
                </FilterPopoverSection>
              </FilterPopover>
            </StorybookCard>
          </StorybookGrid>
        </StorybookSection>

        <StorybookSection
          title="Anchored (fixed positioning)"
          description="Pass anchor={{ top, left }} → fixed position with viewport-bounded max-height. Used for context-menu-style popovers triggered by buttons."
        >
          <StorybookGrid columns="1fr">
            <StorybookCard title="anchor prop" subtitle="floating at fixed coordinates (top: 80, left: 40)">
              <div style={{ position: 'relative', minHeight: 200 }}>
                <FilterPopover anchor={{ top: 80, left: 40 }} width={260}>
                  <FilterPopoverSection title="Source">
                    <label style={{ display: 'flex', alignItems: 'center', gap: 'var(--ig-space-3)' }}>
                      <Switch checked onChange={() => undefined} />
                      <span>Local only</span>
                    </label>
                  </FilterPopoverSection>
                </FilterPopover>
              </div>
            </StorybookCard>
          </StorybookGrid>
        </StorybookSection>
      </StorybookPage>
    )
  },
}
