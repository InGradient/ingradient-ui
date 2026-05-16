import { useState } from 'react'
import type { Meta, StoryObj } from '@storybook/react-vite'
import { DashboardCustomizePopover } from './dashboard-customize-popover'

const dashboardItems = [
  { key: 'show_data_collection', label: 'Data Collection' },
  { key: 'show_timeline', label: 'Images Over Time' },
  { key: 'show_labeling_status', label: 'Labeling Status' },
  { key: 'show_class_ratio', label: 'Class Ratio' },
  { key: 'show_labeling_by_person', label: 'Labeling by Person' },
  { key: 'show_defects_by_source', label: 'Defects by Source' },
  { key: 'show_pending_processed', label: 'Pending vs Processed' },
  { key: 'show_dataset_distribution', label: 'Dataset Distribution' },
]

const allOn = Object.fromEntries(dashboardItems.map((i) => [i.key, true]))
const allOff = Object.fromEntries(dashboardItems.map((i) => [i.key, false]))
const mixed = { ...allOff, show_data_collection: true, show_timeline: true, show_labeling_status: true }

const meta: Meta<typeof DashboardCustomizePopover> = {
  title: 'Patterns/Shells/DashboardCustomizePopover',
  component: DashboardCustomizePopover,
  decorators: [(Story) => <div style={{ position: 'relative', padding: 60, background: 'var(--ig-color-surface-panel)' }}><Story /></div>],
}
export default meta

type Story = StoryObj<typeof meta>

const noop = () => undefined

export const AllOn: Story = { args: { items: dashboardItems, visibility: allOn, onToggle: noop } }
export const AllOff: Story = { args: { items: dashboardItems, visibility: allOff, onToggle: noop } }
export const Mixed: Story = { args: { items: dashboardItems, visibility: mixed, onToggle: noop } }

export const Interactive: Story = {
  render: () => {
    const [vis, setVis] = useState<Record<string, boolean>>(allOn)
    return (
      <DashboardCustomizePopover
        items={dashboardItems}
        visibility={vis}
        onToggle={(key, checked) => setVis((prev) => ({ ...prev, [key]: checked }))}
      />
    )
  },
}
