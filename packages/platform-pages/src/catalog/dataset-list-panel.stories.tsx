import { useState } from 'react'
import type { Meta, StoryObj } from '@storybook/react-vite'
import { DatasetListPanel, type DatasetListPanelDataset } from './dataset-list-panel'
import { ContextMenuWithSubmenus } from '@ingradient/ui/components'

const SAMPLE: DatasetListPanelDataset[] = [
  { id: 'd1', name: 'Wafer line A — production batch 2024Q4', task_type: 'object_detection' },
  { id: 'd2', name: 'Surface defects', task_type: 'classification' },
  { id: 'd3', name: 'Pixel segmentation', task_type: 'segmentation' },
  { id: 'd4', name: 'Keypoint dataset', task_type: 'point' },
  { id: 'd5', name: 'Mixed batch', task_type: 'object_detection' },
]

const meta: Meta<typeof DatasetListPanel> = {
  title: 'Platform Pages/Catalog/DatasetListPanel',
  component: DatasetListPanel,
  parameters: { layout: 'fullscreen' },
  decorators: [
    (Story) => (
      <div style={{ width: 320, height: '100vh' }}>
        <Story />
      </div>
    ),
  ],
}
export default meta

type Story = StoryObj<typeof meta>

function InteractiveDemo({ initial }: { initial: DatasetListPanelDataset[] }) {
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set(['d1']))
  const [currentId, setCurrentId] = useState('d1')
  const [menuFor, setMenuFor] = useState<{ id: string; anchor: HTMLElement } | null>(null)
  return (
    <>
      <DatasetListPanel
        datasets={initial}
        selectedIds={selectedIds}
        currentId={currentId}
        onSelectAll={(checked) => setSelectedIds(checked ? new Set(initial.map((d) => d.id)) : new Set())}
        onToggleSelect={(id, checked) => {
          setSelectedIds((prev) => {
            const next = new Set(prev)
            if (checked) next.add(id); else next.delete(id)
            return next
          })
        }}
        onSelectCurrent={setCurrentId}
        onAddDataset={() => alert('Add dataset')}
        onOpenDatasetMenu={(id, anchor) => setMenuFor({ id, anchor })}
      />
      <ContextMenuWithSubmenus
        anchorEl={menuFor?.anchor ?? null}
        onClose={() => setMenuFor(null)}
        actions={[
          { key: 'rename', label: 'Rename', onClick: () => undefined },
          { key: 'dup', label: 'Duplicate', onClick: () => undefined },
          { key: 'export', label: 'Export', onClick: () => undefined },
          { key: 'delete', label: 'Delete', tone: 'danger', onClick: () => undefined },
        ]}
      />
    </>
  )
}

export const Interactive: Story = { render: () => <InteractiveDemo initial={SAMPLE} /> }

export const Empty: Story = {
  args: { datasets: [], selectedIds: new Set() },
}
export const Loading: Story = {
  args: { datasets: [], selectedIds: new Set(), loading: true },
}
export const NoProject: Story = {
  args: { datasets: [], selectedIds: new Set(), noProject: true },
}
export const DragOver: Story = {
  args: { datasets: SAMPLE, selectedIds: new Set(['d1']), currentId: 'd1', dragOverDatasetId: 'd2' },
}
