import React from 'react'
import type { Meta, StoryObj } from '@storybook/react-vite'
import { Button, ConfirmDialog, DialogShell } from '@ingradient/ui/components'
import { SectionPanel } from '../../src/components/data-display'
import { CompactModalCard, ModalActions, ModalBackdrop, ModalTitle } from '../../src/components/overlays/modal-primitives'
import { HoverCard, MenuPopover } from '../../src/components/overlays/popovers'
import { StorybookCard, StorybookGrid, StorybookPage, StorybookSection, StorybookStack } from '@storybook-support/storybook-layout'

const meta = {
  title: 'Patterns/Overlay Blocks',
  tags: ['autodocs'],
  parameters: {
    layout: 'fullscreen',
  },
} satisfies Meta

export default meta

type Story = StoryObj<typeof meta>

export const Overview: Story = {
  render: () => {
    const [dialogOpen, setDialogOpen] = React.useState(false)
    const [confirmOpen, setConfirmOpen] = React.useState(false)
    const [compactOpen, setCompactOpen] = React.useState(false)

    return (
      <StorybookPage
        title="Overlay Blocks"
        description="Overlay blocks are the smaller contextual surfaces around dialogs, drawers, and menus. Review them as composable building blocks before introducing a feature-specific overlay."
      >
        <StorybookSection
          title="Composable overlay family"
          description="This story replaces the old showcase demo by keeping small anchored surfaces and modal primitives in one review screen."
        >
          <StorybookStack gap={18}>
            <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
              <Button onClick={() => setDialogOpen(true)}>Open dialog shell</Button>
              <Button variant="secondary" onClick={() => setConfirmOpen(true)}>Open confirm dialog</Button>
              <Button variant="secondary" onClick={() => setCompactOpen(true)}>Open compact modal</Button>
            </div>

            <StorybookGrid columns="repeat(auto-fit, minmax(240px, 1fr))">
              <StorybookCard title="MenuPopover" subtitle="anchored action group">
                <MenuPopover>
                  <StorybookStack gap={8}>
                    <div style={{ fontSize: 12, color: 'var(--ig-color-text-soft)' }}>Use for button-anchored actions.</div>
                    <Button size="sm" variant="secondary">Rename</Button>
                    <Button size="sm" variant="secondary">Archive</Button>
                    <Button size="sm" variant="accent">Promote</Button>
                  </StorybookStack>
                </MenuPopover>
              </StorybookCard>

              <StorybookCard title="HoverCard" subtitle="supporting context">
                <HoverCard>
                  <strong style={{ color: 'var(--ig-color-text-primary)' }}>Asset details</strong>
                  <div style={{ fontSize: 13, color: 'var(--ig-color-text-secondary)' }}>
                    Keep HoverCard focused on small supporting summaries, not on full workflows.
                  </div>
                  <div style={{ fontSize: 12, color: 'var(--ig-color-text-soft)' }}>
                    Updated 2 minutes ago by J. Kim
                  </div>
                </HoverCard>
              </StorybookCard>

              <StorybookCard title="SectionPanel" subtitle="shared dense container">
                <SectionPanel>
                  <div style={{ fontSize: 13, color: 'var(--ig-color-text-secondary)' }}>
                    Shared container for settings groups, compact inspectors, and structured supporting content.
                  </div>
                </SectionPanel>
              </StorybookCard>
            </StorybookGrid>

            {dialogOpen ? (
              <DialogShell
                title="Publish UI changes"
                description="Shared dialog shell for settings, forms, and multi-action flows."
                onClose={() => setDialogOpen(false)}
                actions={
                  <>
                    <Button variant="secondary" onClick={() => setDialogOpen(false)}>Cancel</Button>
                    <Button variant="accent" onClick={() => setDialogOpen(false)}>Publish</Button>
                  </>
                }
              >
                <div style={{ color: 'var(--ig-color-text-secondary)' }}>
                  Keep domain fields in the consumer layer, but review generic dialog rhythm and action layout here.
                </div>
              </DialogShell>
            ) : null}

            {confirmOpen ? (
              <ConfirmDialog
                title="Delete draft preset"
                description="This action removes the draft from the registry and cannot be undone."
                confirmLabel="Delete"
                confirmVariant="accent"
                onConfirm={() => setConfirmOpen(false)}
                onCancel={() => setConfirmOpen(false)}
              />
            ) : null}

            {compactOpen ? (
              <ModalBackdrop onClick={() => setCompactOpen(false)}>
                <CompactModalCard onClick={(event) => event.stopPropagation()}>
                  <StorybookStack gap={14}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', gap: 12, alignItems: 'center' }}>
                      <ModalTitle>Compact modal</ModalTitle>
                      <Button variant="secondary" onClick={() => setCompactOpen(false)}>Close</Button>
                    </div>
                    <div style={{ color: 'var(--ig-color-text-secondary)' }}>
                      Use compact modal cards for small decision surfaces, not for long, multi-pane workflows.
                    </div>
                    <ModalActions>
                      <Button variant="secondary" onClick={() => setCompactOpen(false)}>Later</Button>
                      <Button variant="accent" onClick={() => setCompactOpen(false)}>Continue</Button>
                    </ModalActions>
                  </StorybookStack>
                </CompactModalCard>
              </ModalBackdrop>
            ) : null}
          </StorybookStack>
        </StorybookSection>
      </StorybookPage>
    )
  },
}
