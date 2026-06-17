import { useState } from 'react'
import type { Meta, StoryObj } from '@storybook/react-vite'
import { ResizableColumnsLayout } from './resizable-columns-layout'

const meta: Meta<typeof ResizableColumnsLayout> = {
  title: 'Components/Data Display/ResizableColumnsLayout',
  component: ResizableColumnsLayout,
  parameters: { layout: 'fullscreen' },
  decorators: [(Story) => <div style={{ height: 480 }}><Story /></div>],
}
export default meta

type Story = StoryObj<typeof meta>

const SECTION_STYLE = { padding: 16, height: '100%', overflow: 'auto' as const }

export const ThreeColumn: Story = {
  args: {
    columns: [
      { width: 280, resizable: true, minWidth: 200, maxWidth: 480 },
      { width: 'auto' },
      { width: 320, resizable: true, minWidth: 240, maxWidth: 480, background: 'var(--ig-color-surface-panel)' },
    ],
    children: (
      <>
        <aside style={SECTION_STYLE}>Left sidebar</aside>
        <main style={SECTION_STYLE}>Body — drag handles 좌우로 resize</main>
        <aside style={SECTION_STYLE}>Right inspector</aside>
      </>
    ),
  },
}

export const TwoColumn: Story = {
  args: {
    columns: [
      { width: 320, resizable: true, minWidth: 220, maxWidth: 480 },
      { width: 'auto' },
    ],
    children: (
      <>
        <aside style={SECTION_STYLE}>Left list</aside>
        <main style={SECTION_STYLE}>Detail</main>
      </>
    ),
  },
}

export const CollapsibleLeft: Story = {
  render: () => {
    const [collapsed, setCollapsed] = useState(false)
    return (
      <ResizableColumnsLayout
        columns={[
          { width: 320, resizable: true, minWidth: 220, maxWidth: 480, collapsed },
          { width: 'auto' },
        ]}
      >
        <aside style={SECTION_STYLE}>Collapsible sidebar</aside>
        <main style={SECTION_STYLE}>
          <button type="button" onClick={() => setCollapsed((c) => !c)}>
            {collapsed ? 'Expand' : 'Collapse'} left
          </button>
        </main>
      </ResizableColumnsLayout>
    )
  },
}

export const HiddenRight: Story = {
  render: () => {
    const [showInspector, setShowInspector] = useState(true)
    return (
      <ResizableColumnsLayout
        columns={[
          { width: 280, resizable: true, minWidth: 200, maxWidth: 400 },
          { width: 'auto' },
          { width: 320, resizable: true, minWidth: 240, maxWidth: 480, hidden: !showInspector, background: 'var(--ig-color-surface-panel)' },
        ]}
      >
        <aside style={SECTION_STYLE}>Left list</aside>
        <main style={SECTION_STYLE}>
          <button type="button" onClick={() => setShowInspector((s) => !s)}>
            {showInspector ? 'Hide' : 'Show'} inspector
          </button>
        </main>
        <aside style={SECTION_STYLE}>Inspector (hide 가능)</aside>
      </ResizableColumnsLayout>
    )
  },
}

export const PersistedWidth: Story = {
  args: {
    storageKey: 'sb-resizable-columns-demo',
    columns: [
      { width: 280, resizable: true, minWidth: 200, maxWidth: 480 },
      { width: 'auto' },
      { width: 320, resizable: true, minWidth: 240, maxWidth: 480, background: 'var(--ig-color-surface-panel)' },
    ],
    children: (
      <>
        <aside style={SECTION_STYLE}>Left — resize 후 새로고침해도 width 유지</aside>
        <main style={SECTION_STYLE}>Body</main>
        <aside style={SECTION_STYLE}>Right — localStorage 'sb-resizable-columns-demo'</aside>
      </>
    ),
  },
}
