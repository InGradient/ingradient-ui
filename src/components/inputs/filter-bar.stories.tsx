import React from 'react'
import type { Meta, StoryObj } from '@storybook/react-vite'
import { FilterBarLayout } from './filter-bar'
import { DropdownSelect } from './dropdown-select'
import { TextField } from './text-fields'
import { StorybookCard, StorybookGrid, StorybookPage, StorybookSection } from '@storybook-support/storybook-layout'

const meta = {
  title: 'Components/Inputs/FilterBarLayout',
  component: FilterBarLayout,
  tags: ['autodocs'],
  parameters: {
    layout: 'fullscreen',
    a11y: { test: 'todo' },
  },
} satisfies Meta<typeof FilterBarLayout>

export default meta

type Story = StoryObj<typeof meta>

export const Review: Story = {
  args: { children: null },
  render: () => {
    const [status, setStatus] = React.useState('all')
    const [type, setType] = React.useState('all')
    const [search, setSearch] = React.useState('')

    return (
      <StorybookPage
        title="FilterBarLayout"
        description="Inline filter row layout. Children are filter inputs (DropdownSelect, TextField, etc.). Optional onClear shows a 'Clear filters' button at the end."
      >
        <StorybookSection title="Variants">
          <StorybookGrid columns="1fr">
            <StorybookCard title="Without clear button" subtitle="children only">
              <FilterBarLayout>
                <DropdownSelect
                  value={status}
                  options={[
                    { value: 'all', label: 'All status' },
                    { value: 'active', label: 'Active' },
                    { value: 'archived', label: 'Archived' },
                  ]}
                  onChange={setStatus}
                />
                <DropdownSelect
                  value={type}
                  options={[
                    { value: 'all', label: 'All types' },
                    { value: 'classification', label: 'Classification' },
                    { value: 'object_detection', label: 'Object Detection' },
                  ]}
                  onChange={setType}
                />
              </FilterBarLayout>
            </StorybookCard>
            <StorybookCard title="With onClear" subtitle="'Clear filters' button at end">
              <FilterBarLayout onClear={() => { setStatus('all'); setType('all'); setSearch('') }}>
                <DropdownSelect
                  value={status}
                  options={[
                    { value: 'all', label: 'All status' },
                    { value: 'active', label: 'Active' },
                    { value: 'archived', label: 'Archived' },
                  ]}
                  onChange={setStatus}
                />
                <TextField
                  size="sm"
                  placeholder="Search..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                />
              </FilterBarLayout>
            </StorybookCard>
            <StorybookCard title="Custom clear label">
              <FilterBarLayout onClear={() => undefined} clearLabel="Reset all">
                <DropdownSelect value={status} options={[{ value: 'all', label: 'All' }]} onChange={() => undefined} />
              </FilterBarLayout>
            </StorybookCard>
          </StorybookGrid>
        </StorybookSection>
      </StorybookPage>
    )
  },
}
