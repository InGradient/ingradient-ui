import { useState } from 'react'
import type { Meta, StoryObj } from '@storybook/react-vite'
import { GalleryToolbar } from './gallery-toolbar'
import { Button } from '@ingradient/ui/components'
import { SearchField } from '@ingradient/ui/components'
import { ModeSwitcher } from '@ingradient/ui/components'

const meta: Meta<typeof GalleryToolbar> = {
  title: 'Platform Pages/Catalog/Gallery/GalleryToolbar',
  component: GalleryToolbar,
  parameters: { layout: 'fullscreen' },
}
export default meta

type Story = StoryObj<typeof meta>

function Demo({ selectionCount = 0 }: { selectionCount?: number }) {
  const [search, setSearch] = useState('')
  const [viewMode, setViewMode] = useState('grid')
  return (
    <GalleryToolbar
      search={<SearchField placeholder="Search images" value={search} onChange={(e) => setSearch(e.target.value)} size="sm" />}
      filters={<>
        <Button variant="secondary" size="sm">Status: All</Button>
        <Button variant="secondary" size="sm">Dataset: All</Button>
        <Button variant="secondary" size="sm">Sort: Recent</Button>
      </>}
      viewMode={<ModeSwitcher size="sm" value={viewMode} onChange={setViewMode}
        options={[{ value: 'grid', label: 'Grid' }, { value: 'table', label: 'Table' }, { value: 'stats', label: 'Stats' }]} />}
      actions={<>
        <Button variant="secondary" size="sm">Export</Button>
        <Button variant="accent" size="sm">+ Upload</Button>
      </>}
      selectionCount={selectionCount}
      totalCount={50}
      selectionActions={<>
        <Button variant="secondary" size="sm">Move</Button>
        <Button variant="secondary" size="sm" tone="danger">Delete</Button>
      </>}
    />
  )
}

export const NoSelection: Story = { render: () => <Demo /> }
export const WithSelection: Story = { render: () => <Demo selectionCount={3} /> }
