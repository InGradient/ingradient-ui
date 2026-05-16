import type { Meta, StoryObj } from '@storybook/react-vite'
import { CatalogShell } from './catalog-shell'

const meta: Meta<typeof CatalogShell> = {
  title: 'Patterns/CatalogShell',
  component: CatalogShell,
  parameters: { layout: 'fullscreen' },
}
export default meta

type Story = StoryObj<typeof meta>

const placeholder = (label: string, color: string) => (
  <div style={{ height: '100%', background: color, display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--ig-color-text-muted)' }}>{label}</div>
)

export const ThreeColumn: Story = {
  render: () => (
    <div style={{ height: '100vh' }}>
      <CatalogShell
        leftSidebar={placeholder('Left sidebar (datasets)', 'var(--ig-color-surface-panel)')}
        toolbar={placeholder('Toolbar', 'var(--ig-color-surface-muted)')}
        body={placeholder('Body (gallery / table / stats)', 'var(--ig-color-bg-canvas)')}
        rightSidebar={placeholder('Right sidebar (classes)', 'var(--ig-color-surface-panel)')}
      />
    </div>
  ),
}

export const NoRightSidebar: Story = {
  render: () => (
    <div style={{ height: '100vh' }}>
      <CatalogShell
        leftSidebar={placeholder('Left sidebar', 'var(--ig-color-surface-panel)')}
        toolbar={placeholder('Toolbar', 'var(--ig-color-surface-muted)')}
        body={placeholder('Body', 'var(--ig-color-bg-canvas)')}
      />
    </div>
  ),
}

export const SidebarCollapsed: Story = {
  render: () => (
    <div style={{ height: '100vh' }}>
      <CatalogShell
        sidebarCollapsed
        leftSidebar={placeholder('Left (hidden)', 'var(--ig-color-surface-panel)')}
        toolbar={placeholder('Toolbar', 'var(--ig-color-surface-muted)')}
        body={placeholder('Body', 'var(--ig-color-bg-canvas)')}
      />
    </div>
  ),
}
