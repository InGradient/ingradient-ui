import React from 'react'
import type { Meta, StoryObj } from '@storybook/react-vite'
import { AnnotationToolbar, type AnnotationToolbarAction } from '../../src/patterns'
import { StorybookCard, StorybookGrid, StorybookPage, StorybookSection } from '@storybook-support/storybook-layout'
import {
  BboxIcon,
  ClassificationIcon,
  CoordReadoutMock,
  CursorIcon,
  InfoIcon,
  PointIcon,
  RedoIcon,
  ResetIcon,
  TrashIcon,
  UndoIcon,
} from './annotation-toolbar.stories.helpers'

const meta = {
  title: 'Patterns/AnnotationToolbar',
  component: AnnotationToolbar,
  tags: ['autodocs'],
  parameters: {
    layout: 'fullscreen',
    a11y: { test: 'error' },
  },
} satisfies Meta<typeof AnnotationToolbar>

export default meta

type Story = StoryObj<typeof meta>

type Mode = 'cursor' | 'bbox' | 'point' | 'classification'

function PlatformDemo() {
  const [mode, setMode] = React.useState<Mode>('bbox')
  const [items, setItems] = React.useState(2)
  const modeActions: AnnotationToolbarAction[] = [
    { key: 'cursor', title: 'Cursor (select & move)', icon: <CursorIcon />, active: mode === 'cursor', onClick: () => setMode('cursor') },
    { key: 'bbox', title: 'Draw bbox', icon: <BboxIcon />, active: mode === 'bbox', onClick: () => setMode('bbox') },
    { key: 'point', title: 'Add point', icon: <PointIcon />, active: mode === 'point', onClick: () => setMode('point') },
    { key: 'classification', title: 'Classification', icon: <ClassificationIcon />, active: mode === 'classification', onClick: () => setMode('classification') },
  ]
  const historyActions: AnnotationToolbarAction[] = [
    { key: 'undo', title: 'Undo (Ctrl+Z)', icon: <UndoIcon />, disabled: items === 0, onClick: () => setItems((i) => Math.max(0, i - 1)) },
    { key: 'redo', title: 'Redo (Ctrl+Y)', icon: <RedoIcon />, disabled: items >= 4, onClick: () => setItems((i) => Math.min(4, i + 1)) },
    { key: 'reset', title: 'Reset', icon: <ResetIcon />, disabled: items === 0, onClick: () => setItems(0) },
  ]
  const dangerAction: AnnotationToolbarAction = {
    key: 'delete', title: 'Delete image', icon: <TrashIcon />, danger: true, onClick: () => undefined,
  }
  return (
    <AnnotationToolbar
      placement="absolute"
      ariaLabel="Platform demo"
      leading={<CoordReadoutMock text={`bbox x=0.18 y=0.22 w=0.22 h=0.18 · items=${items}`} />}
      actions={[...modeActions, 'separator', ...historyActions, dangerAction]}
      trailing={
        <button
          type="button"
          title="Info & classes"
          aria-label="Info & classes"
          style={{
            width: 40, height: 40, border: 'none', borderRadius: 8, background: 'transparent',
            color: 'var(--ig-color-text-primary)', cursor: 'pointer',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}
        >
          <InfoIcon />
        </button>
      }
    />
  )
}

function EdgeDemo() {
  const [mode, setMode] = React.useState<'cursor' | 'bbox'>('bbox')
  return (
    <AnnotationToolbar
      placement="inline"
      size="sm"
      ariaLabel="Edge demo"
      actions={[
        { key: 'cursor', title: 'Cursor', icon: <CursorIcon />, active: mode === 'cursor', onClick: () => setMode('cursor') },
        { key: 'bbox', title: 'Draw bbox', icon: <BboxIcon />, active: mode === 'bbox', onClick: () => setMode('bbox') },
      ]}
    />
  )
}

function MockCanvas() {
  return (
    <div
      style={{
        flex: 1,
        minHeight: 240,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: 'linear-gradient(135deg, #112f57 0%, #1d7568 100%)',
        color: 'rgba(255,255,255,0.5)',
        fontSize: 14,
      }}
    >
      Canvas (image + drawing layer here)
    </div>
  )
}

export const Review: Story = {
  args: { actions: [], ariaLabel: 'Review' },
  render: () => (
    <StorybookPage
      title="AnnotationToolbar"
      description="Horizontal action toolbar for labeling canvas. actions[] (with optional 'separator'), leading slot (CoordReadout), trailing slot (mobile-info / etc.). Two placements — `absolute` (platform image-detail bottom overlay) / `inline` (edge labeling below canvas)."
    >
      <StorybookSection title="Platform style (placement='absolute')" description="canvas 위 absolute bottom — overlay 형태.">
        <StorybookGrid columns="1fr">
          <StorybookCard title="Full toolbar (mode + history + delete + info)" subtitle="leading: CoordReadout · separator · trailing: info">
            <div style={{ position: 'relative', height: 280, borderRadius: 12, overflow: 'hidden' }}>
              <MockCanvas />
              <PlatformDemo />
            </div>
          </StorybookCard>
        </StorybookGrid>
      </StorybookSection>

      <StorybookSection title="Edge style (placement='inline', size='sm')" description="canvas 아래 flex inline — overlay 아님.">
        <StorybookGrid columns="1fr">
          <StorybookCard title="Minimal toolbar (2 modes)" subtitle="size='sm' (36px)">
            <div style={{ display: 'flex', flexDirection: 'column', borderRadius: 12, overflow: 'hidden' }}>
              <MockCanvas />
              <EdgeDemo />
            </div>
          </StorybookCard>
        </StorybookGrid>
      </StorybookSection>

      <StorybookSection title="States" description="active / disabled / danger 시각 확인.">
        <StorybookGrid columns="1fr">
          <StorybookCard title="State demo (static)" subtitle="placement='inline' for compact display">
            <AnnotationToolbar
              placement="inline"
              ariaLabel="State demo"
              actions={[
                { key: 'a1', title: 'Active mode', icon: <BboxIcon />, active: true, onClick: () => undefined },
                { key: 'a2', title: 'Inactive mode', icon: <PointIcon />, onClick: () => undefined },
                { key: 'a3', title: 'Disabled', icon: <UndoIcon />, disabled: true, onClick: () => undefined },
                'separator',
                { key: 'a4', title: 'Danger', icon: <TrashIcon />, danger: true, onClick: () => undefined },
                { key: 'a5', title: 'Danger disabled', icon: <TrashIcon />, danger: true, disabled: true, onClick: () => undefined },
              ]}
            />
          </StorybookCard>
        </StorybookGrid>
      </StorybookSection>
    </StorybookPage>
  ),
}
