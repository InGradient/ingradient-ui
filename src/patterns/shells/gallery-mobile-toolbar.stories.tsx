import type { Meta, StoryObj } from '@storybook/react-vite'
import { GalleryMobileToolbar } from './gallery-mobile-toolbar'

const meta: Meta<typeof GalleryMobileToolbar> = {
  title: 'Patterns/Shells/GalleryMobileToolbar',
  component: GalleryMobileToolbar,
  decorators: [(Story) => <div style={{ width: 390, background: 'var(--ig-color-surface-page)' }}><Story /></div>],
}
export default meta

type Story = StoryObj<typeof meta>

export const Default: Story = {
  args: { viewMode: 'grid', onToggleView: () => undefined },
}

export const FilterActive: Story = {
  args: { viewMode: 'grid', hasActiveFilter: true, onToggleView: () => undefined },
}

export const SortActive: Story = {
  args: { viewMode: 'grid', hasActiveSort: true, onToggleView: () => undefined },
}

export const ExportDisabled: Story = {
  args: { viewMode: 'grid', canExport: false, onToggleView: () => undefined },
}

export const TableView: Story = {
  args: { viewMode: 'table', onToggleView: () => undefined },
}
