import type { Meta, StoryObj } from '@storybook/react-vite'
import { CatalogMobileShell } from './catalog-mobile-shell'
import { MobileDropdown } from '../../components/inputs/mobile-dropdown'
import { GalleryMobileToolbar } from './gallery-mobile-toolbar'

const options = [
  { id: 'd1', name: 'Wafer line A — production batch 2024Q4' },
  { id: 'd2', name: 'Surface defects' },
  { id: 'd3', name: 'Pixel segmentation' },
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
    bottomBar: <GalleryMobileToolbar viewMode="grid" onToggleView={() => undefined} />,
  },
}

export const DatasetDropdownOpen: Story = {
  args: {
    topBar: <MobileDropdown options={options} currentId="d1" open onToggle={() => undefined} onSelect={() => undefined} />,
    body: <div style={{ flex: 1, padding: 16, color: 'var(--ig-color-text-muted)' }}>Gallery content</div>,
    bottomBar: <GalleryMobileToolbar viewMode="grid" onToggleView={() => undefined} />,
  },
}
