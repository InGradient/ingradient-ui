import React from 'react'
import type { Meta, StoryObj } from '@storybook/react-vite'
import { MediaDialogShell } from '../../src/patterns'
import { Button } from '../../src/components'
import { StorybookCard, StorybookGrid, StorybookPage, StorybookSection } from '@storybook-support/storybook-layout'
import {
  MockCanvas,
  MockSidebar,
  MockToolbar,
  ResizableDemo,
  sampleImages,
} from './media-dialog-shell.stories.helpers'

const meta = {
  title: 'Patterns/Dialogs/MediaDialogShell',
  component: MediaDialogShell,
  tags: ['autodocs'],
  parameters: {
    layout: 'fullscreen',
    a11y: { test: 'error' },
  },
} satisfies Meta<typeof MediaDialogShell>

export default meta

type Story = StoryObj<typeof meta>

export const Review: Story = {
  args: { main: null, ariaLabel: 'Review' },
  render: () => (
    <StorybookPage
      title="MediaDialogShell"
      description="Fullscreen modal shell for media/canvas dialogs (image-detail, video review). Slot-based — main (toolbar + canvas) + optional sidebar (resizable) + overlay (ContextMenu) + extras (Dialogs). Backdrop click → onClose."
    >
      <StorybookSection title="Basic" description="Default 95vw × calc(100vh - 80px). main + sidebar at 320px wide.">
        <StorybookGrid columns="1fr">
          <StorybookCard title="With sidebar" subtitle="default sidebar width 320">
            <div style={{ position: 'relative', height: 520, border: '1px solid var(--ig-color-border-subtle)', borderRadius: 12, overflow: 'hidden' }}>
              <MediaDialogShell
                main={<><MockToolbar label="Toolbar mock" /><MockCanvas src={sampleImages[0]} /></>}
                sidebar={<MockSidebar title="Classes" items={['Dent', 'Scratch', 'Glare']} />}
                width="100%"
                height="100%"
                ariaLabel="Basic dialog"
                positioning="absolute"
              />
            </div>
          </StorybookCard>
        </StorybookGrid>
      </StorybookSection>

      <StorybookSection title="Without sidebar" description="main 만 전체 너비.">
        <StorybookGrid columns="1fr">
          <StorybookCard title="Sidebar omitted" subtitle="full-width main area">
            <div style={{ position: 'relative', height: 460, border: '1px solid var(--ig-color-border-subtle)', borderRadius: 12, overflow: 'hidden' }}>
              <MediaDialogShell
                main={<><MockToolbar label="Full-width toolbar" /><MockCanvas src={sampleImages[1]} /></>}
                width="100%"
                height="100%"
                ariaLabel="No sidebar"
                positioning="absolute"
              />
            </div>
          </StorybookCard>
        </StorybookGrid>
      </StorybookSection>

      <StorybookSection title="Resizable sidebar" description="onSidebarResize handler 로 caller 가 width state 관리. 4px 디바이더 드래그.">
        <StorybookGrid columns="1fr">
          <StorybookCard title="Drag the divider" subtitle="220~560px clamp">
            <div style={{ position: 'relative', height: 520, border: '1px solid var(--ig-color-border-subtle)', borderRadius: 12, overflow: 'hidden' }}>
              <ResizableDemo />
            </div>
          </StorybookCard>
        </StorybookGrid>
      </StorybookSection>

      <StorybookSection title="With overlay (ContextMenu mock)" description="overlay prop 으로 absolute-positioned 자식 (e.g. ContextMenu) 표시.">
        <StorybookGrid columns="1fr">
          <StorybookCard title="ContextMenu mock at top-right" subtitle="overlay slot 가 ModalContent sibling">
            <div style={{ position: 'relative', height: 460, border: '1px solid var(--ig-color-border-subtle)', borderRadius: 12, overflow: 'hidden' }}>
              <MediaDialogShell
                main={<><MockToolbar label="Toolbar" /><MockCanvas src={sampleImages[2]} /></>}
                width="100%"
                height="100%"
                positioning="absolute"
                overlay={
                  <div
                    style={{
                      position: 'absolute',
                      top: 60,
                      right: 60,
                      background: 'var(--ig-color-surface-raised)',
                      border: '1px solid var(--ig-color-border-subtle)',
                      borderRadius: 8,
                      padding: 10,
                      zIndex: 50,
                      fontSize: 12,
                      color: 'var(--ig-color-text-primary)',
                    }}
                  >
                    Mock ContextMenu
                  </div>
                }
                ariaLabel="With overlay"
              />
            </div>
          </StorybookCard>
        </StorybookGrid>
      </StorybookSection>

      <StorybookSection title="With extras (Dialogs mock)" description="extras prop 으로 Overlay 외부 동일 z-layer 자식 (e.g. ConfirmDialog).">
        <StorybookGrid columns="1fr">
          <StorybookCard title="ConfirmDialog mock outside content" subtitle="extras slot 가 Overlay sibling">
            <div style={{ position: 'relative', height: 460, border: '1px solid var(--ig-color-border-subtle)', borderRadius: 12, overflow: 'hidden' }}>
              <MediaDialogShell
                main={<><MockToolbar label="Toolbar" /><MockCanvas src={sampleImages[3]} /></>}
                width="100%"
                height="100%"
                positioning="absolute"
                extras={
                  <div
                    style={{
                      position: 'absolute',
                      inset: 0,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      background: 'rgba(0, 0, 0, 0.55)',
                      zIndex: 60,
                    }}
                  >
                    <div style={{ background: 'var(--ig-color-surface-raised)', borderRadius: 12, padding: 20, display: 'flex', flexDirection: 'column', gap: 12 }}>
                      <strong style={{ fontSize: 14 }}>Delete image?</strong>
                      <div style={{ display: 'flex', gap: 8, justifyContent: 'flex-end' }}>
                        <Button variant="secondary" type="button">Cancel</Button>
                        <Button tone="danger" type="button">Delete</Button>
                      </div>
                    </div>
                  </div>
                }
                ariaLabel="With extras"
              />
            </div>
          </StorybookCard>
        </StorybookGrid>
      </StorybookSection>
    </StorybookPage>
  ),
}
