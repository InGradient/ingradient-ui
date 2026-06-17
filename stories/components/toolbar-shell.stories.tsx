import React from 'react'
import type { Meta, StoryObj } from '@storybook/react-vite'
import { ToolbarShell, type ToolbarShellAction } from '../../src/components/inputs/toolbar-shell'
import { CanvasCoordReadout } from '../../src/patterns'
import { StorybookCard, StorybookGrid, StorybookPage, StorybookSection } from '@storybook-support/storybook-layout'
import {
  BboxIcon,
  ClassificationIcon,
  CursorIcon,
  InfoIcon,
  MockCanvas,
  PointIcon,
  RedoIcon,
  ResetIcon,
  TrashIcon,
  UndoIcon,
  sampleImage,
} from './toolbar-shell.stories.helpers'

const meta = {
  title: 'Components/Inputs/ToolbarShell',
  component: ToolbarShell,
  tags: ['autodocs'],
  parameters: {
    layout: 'fullscreen',
    a11y: { test: 'error' },
  },
} satisfies Meta<typeof ToolbarShell>

export default meta

type Story = StoryObj<typeof meta>

type Mode = 'cursor' | 'bbox' | 'point' | 'classification'

/** Single demo composer — toolbar 의 placement 에 맞춰 canvas 와 sibling 으로 배치.
 *  CoordReadout 은 항상 canvas 아래 (toolbar placement 와 무관). */
function ToolbarDemo({ placement, full }: { placement: 'bottom' | 'top' | 'left' | 'right'; full: boolean }) {
  const [mode, setMode] = React.useState<Mode>('bbox')
  const [items, setItems] = React.useState(2)

  const fullActions: Array<ToolbarShellAction | 'separator'> = [
    { key: 'cursor', title: 'Cursor (select & move)', icon: <CursorIcon />, active: mode === 'cursor', onClick: () => setMode('cursor') },
    { key: 'bbox', title: 'Draw bbox', icon: <BboxIcon />, active: mode === 'bbox', onClick: () => setMode('bbox') },
    { key: 'point', title: 'Add point', icon: <PointIcon />, active: mode === 'point', onClick: () => setMode('point') },
    { key: 'classification', title: 'Classification', icon: <ClassificationIcon />, active: mode === 'classification', onClick: () => setMode('classification') },
    'separator',
    { key: 'undo', title: 'Undo', icon: <UndoIcon />, disabled: items === 0, onClick: () => setItems((i) => Math.max(0, i - 1)) },
    { key: 'redo', title: 'Redo', icon: <RedoIcon />, disabled: items >= 4, onClick: () => setItems((i) => Math.min(4, i + 1)) },
    { key: 'reset', title: 'Reset', icon: <ResetIcon />, disabled: items === 0, onClick: () => setItems(0) },
    { key: 'delete', title: 'Delete image', icon: <TrashIcon />, danger: true, onClick: () => undefined },
  ]
  const minimalActions: ToolbarShellAction[] = [
    { key: 'cursor', title: 'Cursor', icon: <CursorIcon />, active: mode === 'cursor', onClick: () => setMode('cursor') },
    { key: 'bbox', title: 'Draw bbox', icon: <BboxIcon />, active: mode === 'bbox', onClick: () => setMode('bbox') },
  ]

  const trailing = full ? (
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
  ) : undefined

  const toolbar = (
    <ToolbarShell
      placement={placement}
      ariaLabel={`Demo ${placement}`}
      actions={full ? fullActions : minimalActions}
      trailing={trailing}
    />
  )

  const coordReadout = (
    <CanvasCoordReadout>
      bbox x=0.18 y=0.22 w=0.22 h=0.18 · items={items}
    </CanvasCoordReadout>
  )

  // toolbar 가 좌/우 일 때: 가로 row(toolbar + canvas) → 아래에 CoordReadout
  // toolbar 가 위/아래 일 때: 세로 column 안에서 순서 배치
  if (placement === 'left' || placement === 'right') {
    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: 0, borderRadius: 12, overflow: 'hidden', border: '1px solid var(--ig-color-border-subtle)' }}>
        <div style={{ display: 'flex', flexDirection: 'row', minHeight: 240 }}>
          {placement === 'left' ? toolbar : null}
          <MockCanvas src={sampleImage} />
          {placement === 'right' ? toolbar : null}
        </div>
        {coordReadout}
      </div>
    )
  }
  // top / bottom
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 0, borderRadius: 12, overflow: 'hidden', border: '1px solid var(--ig-color-border-subtle)' }}>
      {placement === 'top' ? toolbar : null}
      <MockCanvas src={sampleImage} />
      {coordReadout}
      {placement === 'bottom' ? toolbar : null}
    </div>
  )
}

export const Review: Story = {
  args: { actions: [], ariaLabel: 'Review' },
  render: () => (
    <StorybookPage
      title="ToolbarShell"
      description="Sibling-based toolbar — canvas 와 inline flex 안에 배치되어 겹치지 않음. 4 placements (bottom/top/left/right). CoordReadout 은 별도 컴포넌트 <CanvasCoordReadout> 로 항상 canvas 아래에 배치."
    >
      <StorybookSection title="Placement: bottom" description="기본값 — 가로 toolbar, canvas 아래.">
        <StorybookGrid columns="1fr">
          <StorybookCard title="Full toolbar" subtitle="4 mode + separator + 3 history + delete + trailing info">
            <ToolbarDemo placement="bottom" full />
          </StorybookCard>
        </StorybookGrid>
      </StorybookSection>

      <StorybookSection title="Placement: top" description="가로 toolbar, canvas 위. 동일 actions 배열 재사용.">
        <StorybookGrid columns="1fr">
          <StorybookCard title="Full toolbar above canvas">
            <ToolbarDemo placement="top" full />
          </StorybookCard>
        </StorybookGrid>
      </StorybookSection>

      <StorybookSection title="Placement: left" description="세로 toolbar, canvas 왼쪽. CoordReadout 은 여전히 아래.">
        <StorybookGrid columns="1fr">
          <StorybookCard title="Full toolbar at left">
            <ToolbarDemo placement="left" full />
          </StorybookCard>
        </StorybookGrid>
      </StorybookSection>

      <StorybookSection title="Placement: right" description="세로 toolbar, canvas 오른쪽. CoordReadout 은 여전히 아래.">
        <StorybookGrid columns="1fr">
          <StorybookCard title="Minimal toolbar at right" subtitle="2 mode buttons (edge style)">
            <ToolbarDemo placement="right" full={false} />
          </StorybookCard>
        </StorybookGrid>
      </StorybookSection>

      <StorybookSection title="States" description="active / disabled / danger 시각 (placement='bottom').">
        <StorybookGrid columns="1fr">
          <StorybookCard title="State demo (static)" subtitle="모든 state 시각화">
            <ToolbarShell
              placement="bottom"
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
