import type { Meta, StoryObj } from '@storybook/react-vite'
import { CatalogMobileShell } from './catalog-mobile-shell'
import { MobileDropdown } from '../../components/inputs/mobile-dropdown'
import { MobileBottomToolbar } from '../../components/navigation/mobile-bottom-toolbar'
import { DownloadIcon, FilterIcon, GridIcon, SortIcon, UploadIcon } from '../../components/icons/catalog-icons'

const options = [
  { id: 'd1', name: 'Wafer line A — production batch 2024Q4' },
  { id: 'd2', name: 'Surface defects' },
  { id: 'd3', name: 'Pixel segmentation' },
]

const galleryActions = [
  { key: 'view', label: 'View', icon: <GridIcon />, active: true },
  { key: 'filter', label: 'Filter', icon: <FilterIcon /> },
  { key: 'sort', label: 'Sort', icon: <SortIcon /> },
  { key: 'export', label: 'Export', icon: <DownloadIcon /> },
  { key: 'upload', label: 'Upload', icon: <UploadIcon /> },
]

const meta: Meta<typeof CatalogMobileShell> = {
  title: 'Patterns/Shells/CatalogMobileShell',
  component: CatalogMobileShell,
  parameters: { layout: 'fullscreen' },
  decorators: [(Story) => <div style={{ width: 390, height: 720, border: '1px solid var(--ig-color-border-subtle)' }}><Story /></div>],
}
export default meta

type Story = StoryObj<typeof meta>

export const Default: Story = {
  args: {
    topBar: <MobileDropdown options={options} currentId="d1" open={false} onToggle={() => undefined} onSelect={() => undefined} />,
    body: <div style={{ flex: 1, padding: 16, color: 'var(--ig-color-text-muted)' }}>Gallery content</div>,
    bottomBar: <MobileBottomToolbar actions={galleryActions} />,
  },
}

export const DatasetDropdownOpen: Story = {
  args: {
    topBar: <MobileDropdown options={options} currentId="d1" open onToggle={() => undefined} onSelect={() => undefined} />,
    body: <div style={{ flex: 1, padding: 16, color: 'var(--ig-color-text-muted)' }}>Gallery content</div>,
    bottomBar: <MobileBottomToolbar actions={galleryActions} />,
  },
}
