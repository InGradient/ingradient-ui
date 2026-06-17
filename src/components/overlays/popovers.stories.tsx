import React from 'react'
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
        <StorybookGrid columns="repeat(auto-fit, minmax(var(--ig-popup-sm), 1fr))">
          <StorybookCard title="Plain content" subtitle="title + description">
            <PopoverCard>
              <div style={{ fontSize: 'var(--ig-font-size-sm)', fontWeight: 'var(--ig-font-weight-semibold)', marginBottom: 'var(--ig-space-2)' }}>
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
        <StorybookGrid columns="repeat(auto-fit, minmax(var(--ig-popup-xs-plus), 1fr))">
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
        <StorybookGrid columns="repeat(auto-fit, minmax(var(--ig-popup-sm), 1fr))">
          <StorybookCard title="Default" subtitle="static (no anchor)">
            <MenuPopover>
              <MenuItem>Account settings</MenuItem>
              <MenuItem>Workspace</MenuItem>
              <MenuItem>Sign out</MenuItem>
            </MenuPopover>
          </StorybookCard>
          <StorybookCard title="With anchor" subtitle="button-triggered with rect-based positioning">
            <AnchoredMenuPopoverDemo />
          </StorybookCard>
        </StorybookGrid>
      </StorybookSection>

      <StorybookSection title="HoverCard" description="Larger card with shadow for hover-triggered preview content.">
        <StorybookGrid columns="repeat(auto-fit, minmax(var(--ig-popup-md), 1fr))">
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
                  <div style={{ fontSize: 'var(--ig-font-size-sm)', fontWeight: 'var(--ig-font-weight-semibold)' }}>Jane Doe</div>
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

function AnchoredMenuPopoverDemo() {
  const wrapperRef = React.useRef<HTMLDivElement>(null)
  const [anchor, setAnchor] = React.useState<{ top: number; left: number } | null>(null)
  return (
    <div
      ref={wrapperRef}
      style={{
        position: 'relative',
        transform: 'translateZ(0)',
        minHeight: 220,
        padding: 16,
        border: '1px dashed var(--ig-color-border-subtle)',
        borderRadius: 12,
        display: 'flex',
        flexDirection: 'column',
        gap: 12,
      }}
    >
      <button
        type="button"
        onClick={(event) => {
          if (anchor) {
            setAnchor(null)
            return
          }
          const btnRect = event.currentTarget.getBoundingClientRect()
          const wrapRect = wrapperRef.current?.getBoundingClientRect()
          if (!wrapRect) return
          setAnchor({ top: btnRect.bottom - wrapRect.top + 4, left: btnRect.left - wrapRect.left })
        }}
        style={{
          alignSelf: 'flex-start',
          padding: 'var(--ig-space-2) var(--ig-space-5)',
          fontSize: 13,
          borderRadius: 6,
          border: '1px solid var(--ig-color-border-subtle)',
          background: 'var(--ig-color-surface-raised)',
          color: 'var(--ig-color-text-primary)',
          cursor: 'pointer',
        }}
      >
        {anchor ? 'Close menu' : 'Open anchored menu'}
      </button>
      {anchor ? (
        <MenuPopover anchor={anchor} style={{ position: 'absolute' }}>
          <MenuItem>Top item</MenuItem>
          <MenuItem>Middle item</MenuItem>
          <MenuItem>Bottom item</MenuItem>
        </MenuPopover>
      ) : null}
    </div>
  )
}
