import React from 'react'
import type { Meta, StoryObj } from '@storybook/react-vite'
import { Button, CopyButton, FieldRow, FilterBarLayout, FormGroup, ModeSwitcher, SearchField } from '@ingradient/ui/components'
import { ChipGroup, ResizablePanel } from '../../src/components/data-display'
import { StorybookCard, StorybookGrid, StorybookPage, StorybookSection, StorybookStack } from '@storybook-support/storybook-layout'

const meta = {
  title: 'Sandboxes/Interaction Utils Lab',
  tags: ['autodocs'],
  parameters: {
    layout: 'fullscreen',
  },
} satisfies Meta

export default meta

type Story = StoryObj<typeof meta>

export const Overview: Story = {
  render: () => {
    const [mode, setMode] = React.useState('cursor')
    const [query, setQuery] = React.useState('')

    return (
      <StorybookPage
        title="Interaction Utils Lab"
        description="This sandbox groups the smaller interaction utilities that are easier to review together than as isolated one-off stories."
      >
        <StorybookSection
          title="Utility review"
          description="Review copy, mode switching, chip overflow, filter rows, and resizable layout behavior from one page."
        >
          <StorybookGrid columns="repeat(auto-fit, minmax(280px, 1fr))">
            <StorybookCard title="Copy and mode controls" subtitle="compact interaction utilities">
              <StorybookStack gap={14}>
                <CopyButton value="ingradient-ui-token">Copy token</CopyButton>
                <ModeSwitcher
                  options={[
                    { value: 'cursor', label: 'Cursor' },
                    { value: 'rect', label: 'Rect' },
                    { value: 'point', label: 'Point' },
                  ]}
                  value={mode}
                  onChange={setMode}
                />
                <div style={{ fontSize: 13, color: 'var(--ig-color-text-secondary)' }}>
                  Active mode: <strong>{mode}</strong>
                </div>
              </StorybookStack>
            </StorybookCard>

            <StorybookCard title="Chip overflow" subtitle="dense metadata lists">
              <ChipGroup
                maxVisible={3}
                items={[
                  { id: '1', label: 'Defect', color: '#ff7f66' },
                  { id: '2', label: 'Review', color: '#4d88ff' },
                  { id: '3', label: 'Approved', color: '#35c6a7' },
                  { id: '4', label: 'Exported', color: '#e2b84a' },
                  { id: '5', label: 'Archived', color: '#9b7bff' },
                ]}
              />
            </StorybookCard>

            <StorybookCard title="Filter and form rhythm" subtitle="shared labeled controls">
              <StorybookStack gap={16}>
                <FilterBarLayout onClear={() => setQuery('')}>
                  <SearchField
                    placeholder="Filter labels"
                    value={query}
                    onChange={(event) => setQuery(event.target.value)}
                    onClear={() => setQuery('')}
                    size="sm"
                  />
                </FilterBarLayout>
                <FormGroup title="Workspace settings" description="Keep small form sections structured and repeatable.">
                  <FieldRow label="Name" hint="Visible in consumer-facing workspace lists.">
                    <input
                      defaultValue="Quality Review"
                      style={{
                        width: '100%',
                        padding: '12px 14px',
                        borderRadius: 12,
                        border: '1px solid var(--ig-color-border-subtle)',
                        background: 'var(--ig-color-surface-muted)',
                        color: 'var(--ig-color-text-primary)',
                      }}
                    />
                  </FieldRow>
                </FormGroup>
              </StorybookStack>
            </StorybookCard>
          </StorybookGrid>

          <StorybookCard title="Resizable panel" subtitle="workspace splitter utility">
            <div style={{ height: 260, border: '1px solid var(--ig-color-border-subtle)', borderRadius: 20, overflow: 'hidden' }}>
              <ResizablePanel defaultSize={240} minSize={160} maxSize={420} storageKey="storybook-utils-panel">
                {[
                  <div key="left" style={{ height: '100%', padding: 16, background: 'var(--ig-color-surface-panel)', color: 'var(--ig-color-text-secondary)' }}>
                    Left panel
                  </div>,
                  <div key="right" style={{ height: '100%', padding: 16, background: 'var(--ig-color-surface-raised)', color: 'var(--ig-color-text-secondary)' }}>
                    Right panel
                  </div>,
                ]}
              </ResizablePanel>
            </div>
            <div style={{ marginTop: 12, fontSize: 13, color: 'var(--ig-color-text-soft)' }}>
              Drag the divider to validate persisted width behavior and dense workspace composition.
            </div>
          </StorybookCard>
        </StorybookSection>
      </StorybookPage>
    )
  },
}
