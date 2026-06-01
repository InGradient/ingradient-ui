import React, { useRef, useState } from 'react'
import type { Meta, StoryObj } from '@storybook/react-vite'
import { useClickOutside } from './useClickOutside'
import { Button } from '../components/inputs/button'
import { Checkbox } from '../components/inputs/toggles'
import { MenuPopover } from '../components/overlays/popovers'
import { StorybookCard, StorybookGrid, StorybookPage, StorybookSection } from '@storybook-support/storybook-layout'

const meta = {
  title: 'Hooks/useClickOutside',
  parameters: {
    layout: 'fullscreen',
    a11y: { test: 'error' },
  },
} satisfies Meta

export default meta

type Story = StoryObj

function BasicDropdown() {
  const [open, setOpen] = useState(false)
  const popoverRef = useRef<HTMLDivElement>(null)
  const triggerWrapRef = useRef<HTMLDivElement>(null)

  useClickOutside({
    refs: [popoverRef, triggerWrapRef],
    onClickOutside: () => setOpen(false),
    enabled: open,
    event: 'mousedown',
  })

  return (
    <div style={{ position: 'relative', display: 'inline-block' }}>
      <div ref={triggerWrapRef} style={{ display: 'inline-block' }}>
        <Button variant="secondary" size="sm" onClick={() => setOpen((v) => !v)}>
          {open ? 'Close' : 'Open'} dropdown
        </Button>
      </div>
      {open ? (
        <MenuPopover
          ref={popoverRef}
          style={{ position: 'absolute', top: 'calc(100% + 8px)', left: 0, padding: 'var(--ig-space-5)' }}
        >
          <div style={{ fontSize: 'var(--ig-font-size-sm)' }}>
            Click outside this popover or its trigger to close.
          </div>
        </MenuPopover>
      ) : null}
    </div>
  )
}

function DisabledDemo() {
  const [enabled, setEnabled] = useState(false)
  const [open, setOpen] = useState(true)
  const popoverRef = useRef<HTMLDivElement>(null)

  useClickOutside({
    refs: popoverRef,
    onClickOutside: () => setOpen(false),
    enabled,
  })

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--ig-space-3)' }}>
      <Checkbox label="Listener enabled" checked={enabled} onChange={(e) => setEnabled(e.target.checked)} />
      {open ? (
        <MenuPopover ref={popoverRef} style={{ padding: 'var(--ig-space-5)' }}>
          <div style={{ fontSize: 'var(--ig-font-size-sm)' }}>
            With listener disabled, clicking outside does nothing.
          </div>
        </MenuPopover>
      ) : (
        <Button variant="secondary" size="sm" onClick={() => setOpen(true)}>
          Reopen popover
        </Button>
      )}
    </div>
  )
}

export const Review: Story = {
  render: () => (
    <StorybookPage
      title="useClickOutside"
      description="Hook that fires a callback when a click happens outside of one or more refs. Use for dropdowns, popovers, and modals. Supports event='mousedown' (closes before button activates) and enabled flag for conditional listening."
    >
      <StorybookSection
        title="Basic dropdown"
        description="Click the button to open the popover. Click anywhere outside (including outside the trigger) to close."
      >
        <StorybookGrid columns="repeat(auto-fit, minmax(320px, 1fr))">
          <StorybookCard title="Trigger + popover" subtitle="event='mousedown', enabled when open">
            <div style={{ minHeight: 220 }}>
              <BasicDropdown />
            </div>
          </StorybookCard>
        </StorybookGrid>
      </StorybookSection>

      <StorybookSection
        title="Disabled flag"
        description="Toggle the listener on/off with the checkbox. When disabled, outside clicks are ignored."
      >
        <StorybookGrid columns="1fr">
          <StorybookCard title="Conditional listener" subtitle="useful when you want to attach the handler only while UI is open">
            <DisabledDemo />
          </StorybookCard>
        </StorybookGrid>
      </StorybookSection>
    </StorybookPage>
  ),
}
