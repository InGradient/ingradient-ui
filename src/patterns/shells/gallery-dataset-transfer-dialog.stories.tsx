import { useState } from 'react'
import type { Meta, StoryObj } from '@storybook/react-vite'
import {
  GalleryDatasetTransferDialog,
  type DatasetTransferAction,
  type DatasetTransferOption,
} from './gallery-dataset-transfer-dialog'

const meta: Meta<typeof GalleryDatasetTransferDialog> = {
  title: 'Patterns/Shells/GalleryDatasetTransferDialog',
  component: GalleryDatasetTransferDialog,
  parameters: { layout: 'fullscreen' },
}

export default meta
type Story = StoryObj<typeof GalleryDatasetTransferDialog>

const DATASETS: DatasetTransferOption[] = [
  { id: 'ds_1', name: 'Wafer scratch v2' },
  { id: 'ds_2', name: 'PCB solder defects' },
  { id: 'ds_3', name: 'OLED edge cracks' },
  { id: 'ds_4', name: 'Lens contamination (long-form name example)' },
]

function Wrapper({ initialAction }: { initialAction: DatasetTransferAction }) {
  const [action, setAction] = useState<DatasetTransferAction | null>(initialAction)
  const [sourceId, setSourceId] = useState('ds_1')
  const [targetId, setTargetId] = useState('')
  return (
    <GalleryDatasetTransferDialog
      action={action}
      setAction={setAction}
      datasets={DATASETS}
      sourceId={sourceId}
      setSourceId={setSourceId}
      targetId={targetId}
      setTargetId={setTargetId}
      onCopy={() => undefined}
      onMove={() => undefined}
    />
  )
}

export const Copy: Story = { render: () => <Wrapper initialAction="copy" /> }
export const Move: Story = { render: () => <Wrapper initialAction="move" /> }
