import React from 'react'
import type { Meta, StoryObj } from '@storybook/react-vite'
import { Button } from '../inputs/button'
import { Drawer, ModalBackdrop } from './modal-primitives'
import { StorybookCard, StorybookGrid, StorybookPage, StorybookSection, StorybookStack } from '@storybook-support/storybook-layout'

const meta = {
  title: 'Components/Overlays/Drawer',
  component: Drawer,
  tags: ['autodocs'],
  parameters: {
    layout: 'fullscreen',
    a11y: {
      test: 'todo',
    },
  },
  args: {
    $side: 'right',
    children: null,
  },
} satisfies Meta<typeof Drawer>

export default meta

type Story = StoryObj<typeof meta>

function DrawerReviewDemo() {
  const [open, setOpen] = React.useState(false)

  return (
    <StorybookGrid columns="minmax(0, 1fr) minmax(280px, 0.9fr)">
      <StorybookCard title="Drawer review" subtitle="supporting side sheet">
        <StorybookStack gap={12}>
          <div style={{ fontSize: 13, color: 'var(--ig-color-text-soft)' }}>
            Drawer is for supporting context, filters, and side-panel settings. It should not hide the primary product workflow.
          </div>
          <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
            <Button variant="secondary" onClick={() => setOpen(true)}>
              Open right drawer
            </Button>
          </div>
          <div
            style={{
              minHeight: 260,
              borderRadius: 20,
              border: '1px dashed var(--ig-color-border-subtle)',
              background: 'var(--ig-color-surface-panel)',
              padding: 18,
              color: 'var(--ig-color-text-soft)',
            }}
          >
            Page content placeholder
          </div>
          {open ? (
            <ModalBackdrop onClick={() => setOpen(false)}>
              <Drawer $side="right" onClick={(event) => event.stopPropagation()}>
                <StorybookStack gap={16}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', gap: 12, alignItems: 'center' }}>
                    <strong style={{ color: 'var(--ig-color-text-primary)' }}>Workspace Filters</strong>
                    <Button variant="secondary" onClick={() => setOpen(false)}>
                      Close
                    </Button>
                  </div>
                  <div style={{ fontSize: 13, color: 'var(--ig-color-text-secondary)' }}>
                    Reusable side sheet for filters, metadata, and supporting actions.
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                    <label style={{ fontSize: 12, color: 'var(--ig-color-text-muted)' }}>Status</label>
                    <select
                      defaultValue="active"
                      style={{
                        width: '100%',
                        padding: '12px 14px',
                        borderRadius: 12,
                        border: '1px solid var(--ig-color-border-subtle)',
                        background: 'var(--ig-color-surface-muted)',
                        color: 'var(--ig-color-text-primary)',
                      }}
                    >
                      <option value="active">Active</option>
                      <option value="review">Needs review</option>
                      <option value="blocked">Blocked</option>
                    </select>
                  </div>
                  <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
                    <Button variant="secondary">Reset</Button>
                    <Button variant="accent">Apply filters</Button>
                  </div>
                </StorybookStack>
              </Drawer>
            </ModalBackdrop>
          ) : null}
        </StorybookStack>
      </StorybookCard>
      <StorybookCard title="Usage notes" subtitle="when it fits">
        <StorybookStack gap={10}>
          <div style={{ fontSize: 13, color: 'var(--ig-color-text-secondary)' }}>
            Prefer Drawer when context should stay adjacent to the current screen instead of interrupting it.
          </div>
          <div style={{ fontSize: 13, color: 'var(--ig-color-text-secondary)' }}>
            Prefer `DialogShell` for explicit confirm flows and `SplitLayout` when the side region should stay permanently visible.
          </div>
        </StorybookStack>
      </StorybookCard>
    </StorybookGrid>
  )
}

export const Review: Story = {
  render: () => (
    <StorybookPage
      title="Drawer"
      description="Drawer is the side-sheet primitive for supporting context. Keep it secondary, dismissible, and narrower than the main workspace."
    >
      <StorybookSection
        title="Side sheet review"
        description="Review common supporting-context usage without coupling the primitive to one product workflow."
      >
        <DrawerReviewDemo />
      </StorybookSection>
    </StorybookPage>
  ),
}
