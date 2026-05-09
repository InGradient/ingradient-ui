import React from 'react'
import type { Meta, StoryObj } from '@storybook/react-vite'
import { Grid3x3, List, Table2 } from 'lucide-react'
import { ModeSwitcher } from './mode-switcher'
import { StorybookCard, StorybookGrid, StorybookPage, StorybookSection } from '@storybook-support/storybook-layout'

const meta = {
  title: 'Components/Inputs/ModeSwitcher',
  component: ModeSwitcher,
  tags: ['autodocs'],
  parameters: {
    layout: 'fullscreen',
    a11y: { test: 'todo' },
  },
} satisfies Meta<typeof ModeSwitcher>

export default meta

type Story = StoryObj<typeof meta>

export const Review: Story = {
  args: { options: [], value: '', onChange: () => undefined },
  render: () => {
    const [view, setView] = React.useState('grid')
    const [period, setPeriod] = React.useState('24h')

    return (
      <StorybookPage
        title="ModeSwitcher"
        description="Toolbar segmented selector for view/period/mode toggles. Inline-flex segment row. Use for 2-4 short options where the choice is between tightly-related views."
      >
        <StorybookSection title="With icons" description="Common toolbar pattern (grid / list / table view).">
          <StorybookGrid columns="repeat(auto-fit, minmax(280px, 1fr))">
            <StorybookCard title="View mode" subtitle={`current: ${view}`}>
              <ModeSwitcher
                value={view}
                onChange={setView}
                options={[
                  { value: 'grid', label: 'Grid', icon: <Grid3x3 size={14} /> },
                  { value: 'list', label: 'List', icon: <List size={14} /> },
                  { value: 'table', label: 'Table', icon: <Table2 size={14} /> },
                ]}
              />
            </StorybookCard>
            <StorybookCard title="Time period (no icons)" subtitle={`current: ${period}`}>
              <ModeSwitcher
                value={period}
                onChange={setPeriod}
                options={[
                  { value: '1h', label: '1H' },
                  { value: '24h', label: '24H' },
                  { value: '7d', label: '7D' },
                  { value: '30d', label: '30D' },
                ]}
              />
            </StorybookCard>
          </StorybookGrid>
        </StorybookSection>

        <StorybookSection title="Sizes" description="sm and md.">
          <StorybookGrid columns="repeat(auto-fit, minmax(280px, 1fr))">
            <StorybookCard title="md (default)">
              <ModeSwitcher
                value={view}
                onChange={setView}
                options={[
                  { value: 'grid', label: 'Grid' },
                  { value: 'list', label: 'List' },
                  { value: 'table', label: 'Table' },
                ]}
              />
            </StorybookCard>
            <StorybookCard title="sm">
              <ModeSwitcher
                size="sm"
                value={view}
                onChange={setView}
                options={[
                  { value: 'grid', label: 'Grid' },
                  { value: 'list', label: 'List' },
                  { value: 'table', label: 'Table' },
                ]}
              />
            </StorybookCard>
          </StorybookGrid>
        </StorybookSection>
      </StorybookPage>
    )
  },
}
