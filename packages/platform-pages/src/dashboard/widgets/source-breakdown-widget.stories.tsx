import type { Meta, StoryObj } from '@storybook/react-vite'
import { SourceBreakdownWidget, type SourceBreakdownSource } from './source-breakdown-widget'

const bySource: SourceBreakdownSource[] = [
  {
    source: 'camera',
    camera_ip: '10.0.0.1',
    defect_counts: [
      { class_id: 'cl-1', name: 'Crack', count: 412 },
      { class_id: 'cl-2', name: 'Scratch', count: 218 },
      { class_id: 'cl-3', name: 'Stain', count: 94 },
    ],
  },
  {
    source: 'camera',
    camera_ip: '10.0.0.2',
    defect_counts: [
      { class_id: 'cl-1', name: 'Crack', count: 312 },
      { class_id: 'cl-4', name: 'Contamination', count: 88 },
    ],
  },
  {
    source: 'upload',
    camera_ip: null,
    defect_counts: [
      { class_id: 'cl-1', name: 'Crack', count: 100 },
      { class_id: 'cl-5', name: 'Discoloration', count: 23 },
    ],
  },
]

const meta: Meta<typeof SourceBreakdownWidget> = {
  title: 'Platform Pages/Dashboard Widgets/SourceBreakdownWidget',
  component: SourceBreakdownWidget,
  parameters: { layout: 'fullscreen' },
  decorators: [(Story) => <div style={{ width: 700, padding: 20, background: 'var(--ig-color-bg-canvas)' }}><Story /></div>],
}
export default meta

type Story = StoryObj<typeof meta>

export const Default: Story = { args: { bySource } }
export const SingleSource: Story = { args: { bySource: [bySource[0]] } }
export const SourceNoDefects: Story = {
  args: { bySource: [{ source: 'camera', camera_ip: '10.0.0.5', defect_counts: [] }] },
}
export const Empty: Story = { args: { bySource: [] } }
