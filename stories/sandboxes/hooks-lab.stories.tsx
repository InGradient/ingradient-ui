import React from 'react'
import type { Meta, StoryObj } from '@storybook/react-vite'
import { Button, SelectionActionBar } from '@ingradient/ui/components'
import { useClipboard, useSelection, useUndoRedo, useZoomPan } from '../../src/hooks'
import { StorybookCard, StorybookGrid, StorybookPage, StorybookSection, StorybookStack } from '@storybook-support/storybook-layout'

const meta = {
  title: 'Sandboxes/Hooks Lab',
  tags: ['autodocs'],
  parameters: {
    layout: 'fullscreen',
  },
} satisfies Meta

export default meta

type Story = StoryObj<typeof meta>

function SelectionDemo() {
  const items = [
    { id: 'alpha', label: 'Alpha' },
    { id: 'beta', label: 'Beta' },
    { id: 'gamma', label: 'Gamma' },
    { id: 'delta', label: 'Delta' },
  ]
  const { selectedIds, clearSelection, selectAll, onSelectionChange } = useSelection(items)

  return (
    <StorybookStack gap={12}>
      <SelectionActionBar
        selectedCount={selectedIds.size}
        totalCount={items.length}
        onClearSelection={clearSelection}
        onSelectAll={() => selectAll()}
        actions={
          <div style={{ display: 'flex', gap: 8 }}>
            <Button variant="secondary" onClick={() => selectAll()}>Select all</Button>
            <Button variant="secondary" onClick={clearSelection}>Clear</Button>
          </div>
        }
      />
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, minmax(0, 1fr))', gap: 10 }}>
        {items.map((item) => {
          const active = selectedIds.has(item.id)
          return (
            <button
              key={item.id}
              type="button"
              onClick={() => onSelectionChange('toggle', item.id)}
              style={{
                padding: 12,
                borderRadius: 16,
                border: '1px solid var(--ig-color-border-subtle)',
                background: active ? 'var(--ig-color-surface-active)' : 'var(--ig-color-surface-panel)',
                color: 'var(--ig-color-text-primary)',
                cursor: 'pointer',
              }}
            >
              {item.label}
            </button>
          )
        })}
      </div>
    </StorybookStack>
  )
}

function UndoRedoDemo() {
  const { state, setState, undo, redo, canUndo, canRedo, reset } = useUndoRedo({
    initialState: 'Draft copy',
  })

  return (
    <StorybookStack gap={12}>
      <div
        style={{
          padding: 14,
          borderRadius: 16,
          border: '1px solid var(--ig-color-border-subtle)',
          background: 'var(--ig-color-surface-panel)',
          color: 'var(--ig-color-text-primary)',
        }}
      >
        {state}
      </div>
      <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
        <Button variant="secondary" onClick={() => setState('Draft copy v2')}>Commit v2</Button>
        <Button variant="secondary" onClick={() => setState('Final approved copy')}>Commit final</Button>
        <Button variant="secondary" onClick={undo} disabled={!canUndo}>Undo</Button>
        <Button variant="secondary" onClick={redo} disabled={!canRedo}>Redo</Button>
        <Button variant="secondary" onClick={() => reset('Reset baseline')}>Reset</Button>
      </div>
    </StorybookStack>
  )
}

function ClipboardDemo() {
  const { copy, copied } = useClipboard({ resetDelay: 1200 })

  React.useEffect(() => {
    if (!('clipboard' in navigator)) {
      Object.defineProperty(navigator, 'clipboard', {
        configurable: true,
        value: {
          writeText: async () => undefined,
        },
      })
    }
  }, [])

  return (
    <StorybookStack gap={12}>
      <div style={{ color: 'var(--ig-color-text-secondary)', fontSize: 14 }}>
        Copy a deterministic string to validate hook state transitions.
      </div>
      <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
        <Button variant="accent" onClick={() => void copy('ingradient-ui smoke copy')}>
          Copy token label
        </Button>
        <span style={{ color: copied ? 'var(--ig-color-text-success)' : 'var(--ig-color-text-soft)' }}>
          {copied ? 'Copied' : 'Idle'}
        </span>
      </div>
    </StorybookStack>
  )
}

function ZoomPanDemo() {
  const { zoom, pan, reset } = useZoomPan({ minZoom: 1, maxZoom: 4, zoomStep: 0.5 })

  return (
    <StorybookStack gap={12}>
      <div
        style={{
          padding: 14,
          borderRadius: 16,
          border: '1px solid var(--ig-color-border-subtle)',
          background: 'var(--ig-color-surface-panel)',
          color: 'var(--ig-color-text-primary)',
        }}
      >
        zoom: {zoom.toFixed(2)} / pan: {pan.x}, {pan.y}
      </div>
      <div style={{ display: 'flex', gap: 8 }}>
        <Button variant="secondary" onClick={reset}>Reset</Button>
      </div>
      <div style={{ fontSize: 13, color: 'var(--ig-color-text-soft)' }}>
        Zoom/pan hooks are usually exercised through viewer components. This sandbox keeps the state contract visible.
      </div>
    </StorybookStack>
  )
}

export const Overview: Story = {
  render: () => (
    <StorybookPage
      title="Hooks Lab"
      description="Hooks are not public UI surfaces, but they are part of the library contract and worth reviewing in an isolated sandbox."
    >
      <StorybookSection
        title="Reusable state hooks"
        description="Keep hook demos focused on state contract and consumer wiring, not on rebuilding a product screen in Storybook."
      >
        <StorybookGrid columns="repeat(auto-fit, minmax(260px, 1fr))">
          <StorybookCard title="useSelection" subtitle="selection state and batch actions">
            <SelectionDemo />
          </StorybookCard>
          <StorybookCard title="useUndoRedo" subtitle="history stack transitions">
            <UndoRedoDemo />
          </StorybookCard>
          <StorybookCard title="useClipboard" subtitle="copy feedback state">
            <ClipboardDemo />
          </StorybookCard>
          <StorybookCard title="useZoomPan" subtitle="viewer state contract">
            <ZoomPanDemo />
          </StorybookCard>
        </StorybookGrid>
      </StorybookSection>
    </StorybookPage>
  ),
}
