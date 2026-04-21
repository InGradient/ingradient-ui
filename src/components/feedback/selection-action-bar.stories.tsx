import React from 'react'
import type { Meta, StoryObj } from '@storybook/react-vite'
import { Button } from '../inputs/button'
import { Badge } from './badge'
import { SelectionActionBar } from './selection-action-bar'
import { StorybookCard, StorybookGrid, StorybookPage, StorybookSection, StorybookStack } from '@storybook-support/storybook-layout'

const bulkActions = (
  <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
    <Button variant="secondary" size="sm">Assign</Button>
    <Button variant="secondary" size="sm">Archive</Button>
    <Button variant="accent" size="sm">Export</Button>
  </div>
)

const meta = {
  title: 'Components/Feedback/SelectionActionBar',
  component: SelectionActionBar,
  tags: ['autodocs'],
  parameters: {
    a11y: {
      test: 'error',
    },
  },
} satisfies Meta<typeof SelectionActionBar>

export default meta

type Story = StoryObj<typeof meta>

function PlaygroundDemo() {
  const items = [
    { id: 'alpha', label: 'Alpha queue', tone: 'accent' as const },
    { id: 'beta', label: 'Beta review', tone: 'warning' as const },
    { id: 'gamma', label: 'Gamma export', tone: 'success' as const },
    { id: 'delta', label: 'Delta audit', tone: 'neutral' as const },
  ]
  const [selectedIds, setSelectedIds] = React.useState<string[]>(['alpha', 'gamma'])

  const toggle = (id: string) => {
    setSelectedIds((current) => (current.includes(id) ? current.filter((item) => item !== id) : [...current, id]))
  }

  const clearSelection = () => setSelectedIds([])
  const selectAll = () => setSelectedIds(items.map((item) => item.id))

  return (
    <StorybookStack gap={14}>
      <SelectionActionBar
        selectedCount={selectedIds.length}
        totalCount={items.length}
        onClearSelection={clearSelection}
        onSelectAll={selectAll}
        actions={bulkActions}
      />
      {selectedIds.length === 0 ? (
        <div style={{ fontSize: 13, color: 'var(--ig-color-text-soft)' }}>
          Hidden state: the bar intentionally disappears when nothing is selected.
        </div>
      ) : null}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: 12 }}>
        {items.map((item) => {
          const active = selectedIds.includes(item.id)
          return (
            <button
              key={item.id}
              type="button"
              onClick={() => toggle(item.id)}
              style={{
                display: 'flex',
                flexDirection: 'column',
                gap: 8,
                padding: 14,
                borderRadius: 18,
                border: '1px solid var(--ig-color-border-subtle)',
                background: active ? 'var(--ig-color-surface-active)' : 'var(--ig-color-surface-panel)',
                color: 'var(--ig-color-text-primary)',
                textAlign: 'left',
                cursor: 'pointer',
              }}
            >
              <div style={{ fontWeight: 600 }}>{item.label}</div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <Badge $tone={item.tone}>{active ? 'Selected' : 'Idle'}</Badge>
                <span style={{ fontSize: 12, color: 'var(--ig-color-text-soft)' }}>
                  click to toggle
                </span>
              </div>
            </button>
          )
        })}
      </div>
    </StorybookStack>
  )
}

export const Playground: Story = {
  args: {
    selectedCount: 1,
    totalCount: 4,
    onClearSelection: () => undefined,
  },
  render: () => <PlaygroundDemo />,
}

export const Review: Story = {
  args: {
    selectedCount: 1,
    totalCount: 12,
    onClearSelection: () => undefined,
  },
  render: () => (
    <StorybookPage
      title="Selection Action Bar"
      description="SelectionActionBar is the shared batch-action surface for dense operational screens. Review it independently so bulk actions do not hide inside page-specific layouts."
    >
      <StorybookSection
        title="Batch action states"
        description="Check single selection, batch review, and hidden state behavior before composing this into tables, grids, or media browsers."
      >
        <StorybookGrid columns="repeat(auto-fit, minmax(260px, 1fr))">
          <StorybookCard title="Single selection" subtitle="minimal toolbar">
            <SelectionActionBar
              selectedCount={1}
              totalCount={12}
              onClearSelection={() => undefined}
              actions={<Button variant="secondary" size="sm">Open detail</Button>}
            />
          </StorybookCard>
          <StorybookCard title="Batch review" subtitle="select all + actions">
            <SelectionActionBar
              selectedCount={6}
              totalCount={24}
              onClearSelection={() => undefined}
              onSelectAll={() => undefined}
              actions={bulkActions}
            />
          </StorybookCard>
          <StorybookCard title="Hidden state" subtitle="zero selection">
            <div style={{ fontSize: 13, color: 'var(--ig-color-text-soft)' }}>
              When `selectedCount` is `0`, the component returns `null`. Consumers should not reserve vertical space for it.
            </div>
          </StorybookCard>
        </StorybookGrid>
      </StorybookSection>
    </StorybookPage>
  ),
}
