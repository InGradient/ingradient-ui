import type { Meta, StoryObj } from '@storybook/react-vite'
import { WidgetGrid, type WidgetGridLayout } from './widget-grid'

type WidgetKey =
  | 'data_collection'
  | 'timeline'
  | 'labeling_status'
  | 'class_ratio'
  | 'labeling_by_person'
  | 'defects_by_source'
  | 'pending_processed'
  | 'dataset_distribution'

const allKeys: WidgetKey[] = ['data_collection', 'timeline', 'labeling_status', 'class_ratio', 'labeling_by_person', 'defects_by_source', 'pending_processed', 'dataset_distribution']

function placeholder(key: WidgetKey, color: string) {
  return (
    <div style={{
      height: 220,
      background: color,
      borderRadius: 8,
      border: '1px solid var(--ig-color-border-strong)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      color: 'var(--ig-color-text-primary)',
      fontWeight: 600,
    }}>
      {key}
    </div>
  )
}

const widgets: Partial<Record<WidgetKey, React.ReactNode>> = {
  data_collection: placeholder('data_collection', '#1f3a5f'),
  timeline: placeholder('timeline', '#3a1f5f'),
  labeling_status: placeholder('labeling_status', '#1f5f4a'),
  class_ratio: placeholder('class_ratio', '#5f3a1f'),
  labeling_by_person: placeholder('labeling_by_person', '#5f1f3a'),
  defects_by_source: placeholder('defects_by_source', '#3a5f1f'),
  pending_processed: placeholder('pending_processed', '#1f5f5a'),
  dataset_distribution: placeholder('dataset_distribution', '#5f5a1f'),
}

const defaultLayout: WidgetGridLayout<WidgetKey> = [
  ['data_collection', 'timeline'],
  ['labeling_status', 'class_ratio', 'pending_processed'],
  ['labeling_by_person', 'defects_by_source'],
  ['dataset_distribution'],
]

const meta: Meta<typeof WidgetGrid<WidgetKey>> = {
  title: 'Platform Pages/Dashboard/WidgetGrid',
  component: WidgetGrid,
  parameters: { layout: 'fullscreen' },
  decorators: [(Story) => <div style={{ width: 1100, padding: 20, background: 'var(--ig-color-bg-canvas)' }}><Story /></div>],
}
export default meta

type Story = StoryObj<typeof meta>

export const FullLayout: Story = {
  args: { layout: defaultLayout, widgets },
}

export const ThreePerRow: Story = {
  args: { layout: [allKeys.slice(0, 3), allKeys.slice(3, 6), allKeys.slice(6)], widgets },
}

export const TwoPerRow: Story = {
  args: { layout: [allKeys.slice(0, 2), allKeys.slice(2, 4), allKeys.slice(4, 6), allKeys.slice(6)], widgets },
}

export const OnePerRow: Story = {
  args: { layout: allKeys.map((k) => [k]), widgets },
}

export const HiddenSome: Story = {
  args: {
    layout: defaultLayout, widgets,
    visibility: { data_collection: true, timeline: true, labeling_status: false, class_ratio: false, labeling_by_person: true, defects_by_source: true, pending_processed: false, dataset_distribution: false },
  },
}

export const AllHidden: Story = {
  args: {
    layout: defaultLayout, widgets,
    visibility: Object.fromEntries(allKeys.map((k) => [k, false])) as Partial<Record<WidgetKey, boolean>>,
    emptyState: (
      <div style={{ padding: 24, textAlign: 'center', color: 'var(--ig-color-text-muted)' }}>
        No widgets visible. Enable some via Customize.
      </div>
    ),
  },
}
