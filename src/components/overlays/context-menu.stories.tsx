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
      test: 'error',
    },
  },
} satisfies Meta

export default meta

type Story = StoryObj<typeof meta>

// transform: translateZ(0) 로 fixed positioning 의 containing block 을 이 wrapper 로
// 강제 — demo card 안에 contained. production 에서는 viewport 기준이지만 demo 만 contained.
const DEMO_WRAPPER_STYLE: React.CSSProperties = {
  position: 'relative',
  transform: 'translateZ(0)',
  minHeight: 280,
  border: '1px dashed var(--ig-color-border-subtle)',
  borderRadius: 20,
  padding: 18,
  color: 'var(--ig-color-text-soft)',
  background: 'var(--ig-color-surface-panel)',
}

function ContextMenuReviewDemo() {
  const wrapperRef = React.useRef<HTMLDivElement>(null)
  const [anchor, setAnchor] = React.useState<{ x: number; y: number } | null>(null)
  const [subOpen, setSubOpen] = React.useState(false)
  const [selection, setSelection] = React.useState('No action selected yet.')

  const openAtButton = (event: React.MouseEvent<HTMLButtonElement>) => {
    const btn = event.currentTarget
    const wrap = wrapperRef.current
    if (!wrap) return
    const btnRect = btn.getBoundingClientRect()
    const wrapRect = wrap.getBoundingClientRect()
    setAnchor({
      x: btnRect.left - wrapRect.left,
      y: btnRect.bottom - wrapRect.top + 4,
    })
  }

  const close = () => {
    setAnchor(null)
    setSubOpen(false)
  }

  return (
    <StorybookGrid columns="minmax(0, 1.1fr) minmax(var(--ig-popup-sm), 0.9fr)">
      <StorybookCard title="Menu review" subtitle="trigger button anchors menu">
        <StorybookStack gap={12}>
          <div style={{ fontSize: 13, color: 'var(--ig-color-text-soft)' }}>
            Click the button — menu appears just below it. In production, ContextMenuList uses viewport-fixed positioning from cursor coordinates.
          </div>
          <span style={{ fontSize: 13, color: 'var(--ig-color-text-secondary)' }}>{selection}</span>
          <div ref={wrapperRef} style={DEMO_WRAPPER_STYLE}>
            <Button variant="secondary" onClick={openAtButton}>
              Open context menu
            </Button>
            {anchor ? (
              <>
                <ContextMenuBackdrop aria-hidden onClick={close} />
                <ContextMenuList $x={anchor.x} $y={anchor.y} style={{ position: 'absolute' }} onClick={(event) => event.stopPropagation()}>
                  <ContextMenuButton
                    $danger
                    onClick={() => {
                      setSelection('Delete selected.')
                      close()
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
                      <ContextMenuSub $left={anchor.x + 150} $top={anchor.y + 36} style={{ position: 'absolute' }}>
                        {['Primary', 'Review', 'Archived'].map((label) => (
                          <ContextMenuSubItem
                            key={label}
                            type="button"
                            onClick={() => {
                              setSelection(`Class changed to ${label}.`)
                              close()
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
            Use ContextMenu when you already have cursor coordinates (mouse event, right-click) and want a positioned action list.
          </div>
          <div style={{ fontSize: 13, color: 'var(--ig-color-text-secondary)' }}>
            Prefer `MenuPopover` for anchored button menus and `DialogShell` for explicit confirmation flows.
          </div>
          <div style={{ fontSize: 13, color: 'var(--ig-color-text-soft)' }}>
            Production: position: fixed with viewport coords. This story overrides to absolute + wrapper-relative coords so the menu stays inside the demo card.
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
