import type { Meta, StoryObj } from '@storybook/react-vite'
import { ResizablePanel } from './resizable-panel'
import { StorybookCard, StorybookGrid, StorybookPage, StorybookSection } from '@storybook-support/storybook-layout'

const meta = {
  title: 'Components/Data Display/ResizablePanel',
  component: ResizablePanel,
  tags: ['autodocs'],
  parameters: {
    layout: 'fullscreen',
    a11y: { test: 'todo' },
  },
} satisfies Meta<typeof ResizablePanel>

export default meta

type Story = StoryObj<typeof meta>

const placeholderStyle = (label: string, bg: string): React.CSSProperties => ({
  height: '100%',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  background: bg,
  borderRadius: 'var(--ig-radius-md)',
  padding: 'var(--ig-space-5)',
  color: 'var(--ig-color-text-muted)',
  fontSize: 'var(--ig-font-size-sm)',
})

export const Review: Story = {
  args: { children: [null, null] },
  render: () => (
    <StorybookPage
      title="ResizablePanel"
      description="Two-pane layout with draggable divider. Direction: horizontal (sidebar/main) or vertical (top/bottom split). Drag the divider to resize. storageKey persists size to localStorage."
    >
      <StorybookSection title="Horizontal" description="Sidebar + main content (default).">
        <StorybookGrid columns="1fr">
          <StorybookCard title="240px sidebar + main" subtitle="drag the vertical divider">
            <div style={{ height: 300, display: 'flex' }}>
              <ResizablePanel defaultSize={240} minSize={160} maxSize={420}>
                <div style={placeholderStyle('Sidebar', 'var(--ig-color-blue-tint-12)')}>Sidebar</div>
                <div style={placeholderStyle('Main content', 'var(--ig-color-surface-muted)')}>Main content</div>
              </ResizablePanel>
            </div>
          </StorybookCard>
        </StorybookGrid>
      </StorybookSection>

      <StorybookSection title="Vertical" description="Top + bottom split.">
        <StorybookGrid columns="1fr">
          <StorybookCard title="Top + Bottom" subtitle="drag the horizontal divider">
            <div style={{ height: 360, display: 'flex' }}>
              <ResizablePanel direction="vertical" defaultSize={140} minSize={80} maxSize={300}>
                <div style={placeholderStyle('Top pane', 'var(--ig-color-blue-tint-12)')}>Top pane</div>
                <div style={placeholderStyle('Bottom pane', 'var(--ig-color-surface-muted)')}>Bottom pane</div>
              </ResizablePanel>
            </div>
          </StorybookCard>
        </StorybookGrid>
      </StorybookSection>

      <StorybookSection title="With storageKey" description="Size persists across page reloads (localStorage).">
        <StorybookGrid columns="1fr">
          <StorybookCard title="storageKey='demo-resize'" subtitle="resize, reload page, your size is restored">
            <div style={{ height: 240, display: 'flex' }}>
              <ResizablePanel defaultSize={200} minSize={120} maxSize={400} storageKey="demo-resize">
                <div style={placeholderStyle('Sidebar', 'var(--ig-color-blue-tint-14)')}>Sidebar (saved)</div>
                <div style={placeholderStyle('Main', 'var(--ig-color-surface-muted)')}>Main</div>
              </ResizablePanel>
            </div>
          </StorybookCard>
        </StorybookGrid>
      </StorybookSection>
    </StorybookPage>
  ),
}
