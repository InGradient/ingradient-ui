import React from 'react'
import type { Meta, StoryObj } from '@storybook/react-vite'
import { Button } from '../inputs/button'
import {
  ContextMenuBackdrop,
  ContextMenuButton,
  ContextMenuItem,
  ContextMenuList,
  ContextMenuSub,
  ContextMenuSubItem,
} from './context-menu'
import { StorybookCard, StorybookGrid, StorybookPage, StorybookSection, StorybookStack } from '@storybook-support/storybook-layout'

const meta = {
  title: 'Components/Overlays/ContextMenu',
  tags: ['autodocs'],
  parameters: {
    layout: 'fullscreen',
    a11y: {
      test: 'todo',
    },
  },
} satisfies Meta

export default meta

type Story = StoryObj<typeof meta>

function ContextMenuReviewDemo() {
  const [open, setOpen] = React.useState(false)
  const [subOpen, setSubOpen] = React.useState(false)
  const [selection, setSelection] = React.useState('No action selected yet.')

  return (
    <StorybookGrid columns="minmax(0, 1.1fr) minmax(280px, 0.9fr)">
      <StorybookCard title="Menu review" subtitle="cursor-positioned actions">
        <StorybookStack gap={12}>
          <div style={{ fontSize: 13, color: 'var(--ig-color-text-soft)' }}>
            Open the menu from the trigger below. In product surfaces this usually maps to a right-click event or an item overflow action.
          </div>
          <div style={{ display: 'flex', gap: 12, alignItems: 'center', flexWrap: 'wrap' }}>
            <Button variant="secondary" onClick={() => setOpen(true)}>
              Open context menu
            </Button>
            <span style={{ fontSize: 13, color: 'var(--ig-color-text-secondary)' }}>{selection}</span>
          </div>
          <div
            style={{
              minHeight: 220,
              border: '1px dashed var(--ig-color-border-subtle)',
              borderRadius: 20,
              padding: 18,
              position: 'relative',
              color: 'var(--ig-color-text-soft)',
              background: 'var(--ig-color-surface-panel)',
            }}
          >
            Triggering surface placeholder
            {open ? (
              <>
                <ContextMenuBackdrop
                  aria-hidden
                  onClick={() => {
                    setOpen(false)
                    setSubOpen(false)
                  }}
                />
                <ContextMenuList $x={220} $y={260} onClick={(event) => event.stopPropagation()}>
                  <ContextMenuButton
                    $danger
                    onClick={() => {
                      setSelection('Delete selected.')
                      setOpen(false)
                    }}
                  >
                    Delete
                  </ContextMenuButton>
                  <ContextMenuItem
                    onMouseEnter={() => setSubOpen(true)}
                    onMouseLeave={() => setSubOpen(false)}
                  >
                    <ContextMenuButton as="div" style={{ cursor: 'default' }}>
                      Set class ›
                    </ContextMenuButton>
                    {subOpen ? (
                      <ContextMenuSub $left={352} $top={260}>
                        {['Primary', 'Review', 'Archived'].map((label) => (
                          <ContextMenuSubItem
                            key={label}
                            type="button"
                            onClick={() => {
                              setSelection(`Class changed to ${label}.`)
                              setOpen(false)
                              setSubOpen(false)
                            }}
                          >
                            {label}
                          </ContextMenuSubItem>
                        ))}
                      </ContextMenuSub>
                    ) : null}
                  </ContextMenuItem>
                </ContextMenuList>
              </>
            ) : null}
          </div>
        </StorybookStack>
      </StorybookCard>
      <StorybookCard title="Usage notes" subtitle="when to use it">
        <StorybookStack gap={10}>
          <div style={{ fontSize: 13, color: 'var(--ig-color-text-secondary)' }}>
            Use ContextMenu when you already have cursor coordinates and want a fixed-position action list.
          </div>
          <div style={{ fontSize: 13, color: 'var(--ig-color-text-secondary)' }}>
            Prefer `MenuPopover` for anchored button menus and `DialogShell` for explicit confirmation flows.
          </div>
          <div style={{ fontSize: 13, color: 'var(--ig-color-text-soft)' }}>
            This story keeps submenu and click-outside behavior visible without coupling the primitive to domain actions.
          </div>
        </StorybookStack>
      </StorybookCard>
    </StorybookGrid>
  )
}

export const Review: Story = {
  render: () => (
    <StorybookPage
      title="Context Menu"
      description="ContextMenu primitives are for cursor-driven secondary actions. The consumer owns coordinates, open state, and the action payload."
    >
      <StorybookSection
        title="Interaction review"
        description="Review destructive action, submenu behavior, and click-outside handling together."
      >
        <ContextMenuReviewDemo />
      </StorybookSection>
    </StorybookPage>
  ),
}
