import type { Meta, StoryObj } from '@storybook/react-vite'
import { HoverCard, Menu, MenuPopover, PopoverCard } from './popovers'
import { StorybookCard, StorybookGrid, StorybookPage, StorybookSection } from '@storybook-support/storybook-layout'

const meta = {
  title: 'Components/Overlays/Popovers',
  parameters: {
    layout: 'fullscreen',
    a11y: { test: 'error' },
  },
} satisfies Meta

export default meta

type Story = StoryObj

export const Review: Story = {
  render: () => (
    <StorybookPage
      title="Popovers"
      description="Surface primitives for floating panels. Combine with useClickOutside, IntersectionObserver, or react portals to build context menus, hover cards, and inline popovers."
    >
      <StorybookSection title="PopoverCard" description="General-purpose container. Used for inline expandable content, tip cards.">
        <StorybookGrid columns="repeat(auto-fit, minmax(280px, 1fr))">
          <StorybookCard title="Plain content" subtitle="title + description">
            <PopoverCard>
              <div style={{ fontSize: 'var(--ig-font-size-sm)', fontWeight: 600, marginBottom: 'var(--ig-space-2)' }}>
                Quick tip
              </div>
              <div style={{ fontSize: 'var(--ig-font-size-xs)', color: 'var(--ig-color-text-muted)' }}>
                Use Cmd+K to open the global search palette.
              </div>
            </PopoverCard>
          </StorybookCard>
        </StorybookGrid>
      </StorybookSection>

      <StorybookSection title="Menu" description="Dropdown menu container. Pair with menu item buttons.">
        <StorybookGrid columns="repeat(auto-fit, minmax(240px, 1fr))">
          <StorybookCard title="Action menu" subtitle="3 menu items">
            <Menu>
              <MenuItem>Rename</MenuItem>
              <MenuItem>Duplicate</MenuItem>
              <MenuItem $danger>Delete</MenuItem>
            </Menu>
          </StorybookCard>
        </StorybookGrid>
      </StorybookSection>

      <StorybookSection title="MenuPopover" description="Larger popover with shadow. Anchored variant supports fixed positioning via anchor prop.">
        <StorybookGrid columns="repeat(auto-fit, minmax(280px, 1fr))">
          <StorybookCard title="Default" subtitle="static (no anchor)">
            <MenuPopover>
              <MenuItem>Account settings</MenuItem>
              <MenuItem>Workspace</MenuItem>
              <MenuItem>Sign out</MenuItem>
            </MenuPopover>
          </StorybookCard>
          <StorybookCard title="With anchor" subtitle="anchor={{top: 60, left: 30}} → fixed positioning">
            <div style={{ position: 'relative', minHeight: 180 }}>
              <MenuPopover anchor={{ top: 60, left: 30 }}>
                <MenuItem>Top item</MenuItem>
                <MenuItem>Middle item</MenuItem>
                <MenuItem>Bottom item</MenuItem>
              </MenuPopover>
            </div>
          </StorybookCard>
        </StorybookGrid>
      </StorybookSection>

      <StorybookSection title="HoverCard" description="Larger card with shadow for hover-triggered preview content.">
        <StorybookGrid columns="repeat(auto-fit, minmax(320px, 1fr))">
          <StorybookCard title="Profile preview" subtitle="hover preview pattern">
            <HoverCard>
              <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--ig-space-3)' }}>
                <div
                  style={{
                    width: 40,
                    height: 40,
                    borderRadius: '50%',
                    background: 'var(--ig-color-blue-tint-28)',
                  }}
                />
                <div>
                  <div style={{ fontSize: 'var(--ig-font-size-sm)', fontWeight: 600 }}>Jane Doe</div>
                  <div style={{ fontSize: 'var(--ig-font-size-xs)', color: 'var(--ig-color-text-muted)' }}>
                    jane@example.com
                  </div>
                </div>
              </div>
              <div style={{ fontSize: 'var(--ig-font-size-xs)', color: 'var(--ig-color-text-secondary)' }}>
                ML engineer · joined 2024-09 · 142 datasets labeled
              </div>
            </HoverCard>
          </StorybookCard>
        </StorybookGrid>
      </StorybookSection>
    </StorybookPage>
  ),
}

function MenuItem({ children, $danger }: { children: React.ReactNode; $danger?: boolean }) {
  return (
    <button
      type="button"
      style={{
        width: '100%',
        padding: 'var(--ig-space-3) var(--ig-space-4)',
        background: 'none',
        border: 'none',
        textAlign: 'left',
        fontSize: 'var(--ig-font-size-sm)',
        color: $danger ? 'var(--ig-color-danger)' : 'var(--ig-color-text-primary)',
        cursor: 'pointer',
        borderRadius: 'var(--ig-radius-sm)',
      }}
    >
      {children}
    </button>
  )
}
