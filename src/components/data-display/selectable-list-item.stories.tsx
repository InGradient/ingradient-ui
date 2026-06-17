import React from 'react'
import type { Meta, StoryObj } from '@storybook/react-vite'
import { SelectableListItem } from './selectable-list-item'
import { Badge } from '../feedback/badge'
import { StorybookCard, StorybookGrid, StorybookPage, StorybookSection } from '@storybook-support/storybook-layout'

const meta = {
  title: 'Components/Data Display/SelectableListItem',
  component: SelectableListItem,
  tags: ['autodocs'],
  parameters: {
    layout: 'fullscreen',
    a11y: { test: 'error' },
  },
} satisfies Meta<typeof SelectableListItem>

export default meta

type Story = StoryObj<typeof meta>

const datasetRows = [
  { id: 'd1', name: 'Bottle defects', tag: 'OD' },
  { id: 'd2', name: 'Surface scratches', tag: 'CLS' },
  { id: 'd3', name: 'Crack samples', tag: 'OD' },
  { id: 'd4', name: 'Calibration set', tag: 'CLS' },
]

const classCards = [
  { id: 'c1', label: 'Defect', color: '#ef4444' },
  { id: 'c2', label: 'Crack', color: '#f97316' },
  { id: 'c3', label: 'Stain', color: '#eab308' },
]

export const Review: Story = {
  args: { variant: 'card', children: 'Item' },
  render: () => {
    const [selectedDataset, setSelectedDataset] = React.useState('d2')
    const [dragOverDataset, setDragOverDataset] = React.useState<string | null>(null)
    const [selectedClass, setSelectedClass] = React.useState('c2')

    return (
      <StorybookPage
        title="SelectableListItem"
        description="Selectable row used in two patterns: flat (sidebar list with drag-drop, e.g. catalog dataset list) and card (clickable card group, e.g. labeling class selection)."
      >
        <StorybookSection
          title="variant=flat"
          description="Sidebar list. Use as='li' inside a <ul>. Selected and dragOver states shown."
        >
          <StorybookGrid columns="1fr">
            <StorybookCard title="Dataset list (drag-drop target)" subtitle="hover row 2 to see drag-over highlight">
              <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
                {datasetRows.map((row) => (
                  <SelectableListItem
                    as="li"
                    key={row.id}
                    variant="flat"
                    selected={selectedDataset === row.id}
                    dragOver={dragOverDataset === row.id}
                    onClick={() => setSelectedDataset(row.id)}
                    onMouseEnter={() => setDragOverDataset(row.id === 'd2' ? row.id : null)}
                    onMouseLeave={() => setDragOverDataset(null)}
                  >
                    <span style={{ flex: 1 }}>{row.name}</span>
                    <Badge $tone="neutral">{row.tag}</Badge>
                  </SelectableListItem>
                ))}
              </ul>
            </StorybookCard>
          </StorybookGrid>
        </StorybookSection>

        <StorybookSection
          title="variant=card"
          description="Bordered card group. Each option is its own card with active state. Default element is <button>."
        >
          <StorybookGrid columns="repeat(auto-fit, minmax(var(--ig-popup-sm), 1fr))">
            <StorybookCard title="Class selection" subtitle="active card has accent border + tinted bg">
              <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--ig-space-1)' }}>
                {classCards.map((cls) => (
                  <SelectableListItem
                    key={cls.id}
                    variant="card"
                    selected={selectedClass === cls.id}
                    onClick={() => setSelectedClass(cls.id)}
                  >
                    <span
                      style={{
                        width: 12,
                        height: 12,
                        borderRadius: 2,
                        background: cls.color,
                        flexShrink: 0,
                      }}
                    />
                    {cls.label}
                  </SelectableListItem>
                ))}
              </div>
            </StorybookCard>
          </StorybookGrid>
        </StorybookSection>
      </StorybookPage>
    )
  },
}
