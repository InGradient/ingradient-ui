import { useState } from 'react'
import type { Meta, StoryObj } from '@storybook/react-vite'
import {
  GalleryExportConfigDialog,
  type GalleryExportGroupBy,
  type GalleryExportImageFormat,
  type GalleryExportRange,
  type GalleryExportType,
} from './gallery-export-config-dialog'

const meta: Meta<typeof GalleryExportConfigDialog> = {
  title: 'Platform Pages/Catalog/Gallery/GalleryExportConfigDialog',
  component: GalleryExportConfigDialog,
  parameters: { layout: 'fullscreen' },
}

export default meta
type Story = StoryObj<typeof GalleryExportConfigDialog>

function Wrapper({
  initialRange = 'selected',
  initialGroupBy = 'none',
  selectedCount = 12,
  error,
}: {
  initialRange?: GalleryExportRange
  initialGroupBy?: GalleryExportGroupBy
  selectedCount?: number
  error?: string
}) {
  const [range, setRange] = useState<GalleryExportRange>(initialRange)
  const [exportType, setExportType] = useState<GalleryExportType>('images_and_labels')
  const [imageFormat, setImageFormat] = useState<GalleryExportImageFormat>('webp')
  const [groupBy, setGroupBy] = useState<GalleryExportGroupBy>(initialGroupBy)
  const [groupKeyRegex, setGroupKeyRegex] = useState('')
  return (
    <GalleryExportConfigDialog
      open
      range={range}
      setRange={setRange}
      selectedCount={selectedCount}
      exportType={exportType}
      setExportType={setExportType}
      imageFormat={imageFormat}
      setImageFormat={setImageFormat}
      groupBy={groupBy}
      setGroupBy={setGroupBy}
      groupKeyRegex={groupKeyRegex}
      setGroupKeyRegex={setGroupKeyRegex}
      allRangeTitle="All filtered images (1,248)"
      allRangeHint="Includes every image returned by current filters."
      error={error}
      onClose={() => undefined}
      onStart={() => undefined}
    />
  )
}

export const Default: Story = { render: () => <Wrapper /> }
export const NoSelection: Story = { render: () => <Wrapper initialRange="all" selectedCount={0} /> }
export const RegexGrouping: Story = { render: () => <Wrapper initialGroupBy="regex" /> }
export const WithError: Story = {
  render: () => <Wrapper error="Export config is missing image format." />,
}
