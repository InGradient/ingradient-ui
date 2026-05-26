import type { Meta, StoryObj } from '@storybook/react-vite'
import { SelectableGridPanel } from './selectable-grid-panel'
import { DatasetFilterChipRow } from './shells/dataset-filter-chip-row'
import { Badge } from '../components'
import { AnnotationOverlay } from './annotation/annotation-overlay'
import { ImageGrid } from './gallery/image-grid'
import sample1 from '../../stories/assets/20230808.jpg'
import sample2 from '../../stories/assets/20230816.jpg'
import sample3 from '../../stories/assets/20230823.jpg'

const datasets = [
  { id: 'd-1', name: 'Wafer line A', image_count: 312 },
  { id: 'd-2', name: 'Surface defects', image_count: 187 },
]

const images = [
  { id: 'img-1', thumb_url: sample1 as string, name: 'wafer-001.jpg', width: 1024, height: 768, bboxes: [{ classId: 'c-1', x: 0.12, y: 0.18, w: 0.32, h: 0.24 }] },
  { id: 'img-2', thumb_url: sample2 as string, name: 'wafer-002.jpg', width: 1024, height: 768, bboxes: [{ classId: 'c-1', x: 0.45, y: 0.30, w: 0.25, h: 0.20 }] },
  { id: 'img-3', thumb_url: sample3 as string, name: 'wafer-003.jpg', width: 1024, height: 768, bboxes: [{ classId: 'c-1', x: 0.20, y: 0.50, w: 0.18, h: 0.18 }] },
]

const meta: Meta<typeof SelectableGridPanel> = {
  title: 'Patterns/SelectableGridPanel',
  component: SelectableGridPanel,
  parameters: { layout: 'fullscreen' },
  decorators: [(Story) => <div style={{ height: 600, display: 'flex' }}><Story /></div>],
}
export default meta

type Story = StoryObj<typeof meta>

export const NoSelection: Story = {
  args: { selectedId: null },
}

export const WithGrid: Story = {
  args: {
    selectedId: 'c-1',
    headerSlot: <DatasetFilterChipRow datasets={datasets} activeIds={new Set()} />,
    gridSlot: (
      <ImageGrid
        items={images}
        getThumbnailUrl={(img) => img.thumb_url}
        layout={{ minWidth: 120, gap: 4 }}
        renderCellOverlay={(img) => (
          <AnnotationOverlay
            bboxes={img.bboxes}
            getColor={() => '#ef4444'}
            selectedClassId="c-1"
            imageWidth={img.width}
            imageHeight={img.height}
            fillOpacity={0.22}
            emphasize
          />
        )}
        renderCellTopRight={() => <Badge $tone="neutral">3</Badge>}
      />
    ),
  },
}

export const Loading: Story = {
  args: {
    selectedId: 'c-1',
    headerSlot: <DatasetFilterChipRow datasets={datasets} activeIds={new Set()} />,
    loading: true,
  },
}

export const EmptyImages: Story = {
  args: {
    selectedId: 'c-1',
    headerSlot: <DatasetFilterChipRow datasets={datasets} activeIds={new Set()} />,
    empty: true,
  },
}
