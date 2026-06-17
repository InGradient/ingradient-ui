import type { Meta, StoryObj } from '@storybook/react-vite'
import { MobileBottomToolbar } from './mobile-bottom-toolbar'
import {
  DownloadIcon, FilterIcon, GridIcon, SortIcon, TableIcon, UploadIcon,
} from '../icons/catalog-icons'

const meta: Meta<typeof MobileBottomToolbar> = {
  title: 'Components/Navigation/MobileBottomToolbar',
  component: MobileBottomToolbar,
  decorators: [(Story) => <div style={{ width: 390, background: 'var(--ig-color-bg-canvas)' }}><Story /></div>],
}
export default meta

type Story = StoryObj<typeof meta>

const galleryActions = [
  { key: 'view', label: 'View', icon: <GridIcon />, active: true },
  { key: 'filter', label: 'Filter', icon: <FilterIcon /> },
  { key: 'sort', label: 'Sort', icon: <SortIcon /> },
  { key: 'export', label: 'Export', icon: <DownloadIcon /> },
  { key: 'upload', label: 'Upload', icon: <UploadIcon /> },
]

export const Default: Story = {
  args: { actions: galleryActions },
}

export const FilterActive: Story = {
  args: {
    actions: galleryActions.map((a) => (a.key === 'filter' ? { ...a, active: true } : a)),
  },
}

export const ExportDisabled: Story = {
  args: {
    actions: galleryActions.map((a) => (a.key === 'export' ? { ...a, disabled: true } : a)),
  },
}

export const TableView: Story = {
  args: {
    actions: galleryActions.map((a) =>
      a.key === 'view' ? { ...a, icon: <TableIcon /> } : a,
    ),
  },
}
