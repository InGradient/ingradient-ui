import type { Meta, StoryObj } from '@storybook/react-vite'
import { KeyboardShortcutHint } from './keyboard-shortcut-hint'
import { StorybookCard, StorybookGrid, StorybookPage, StorybookSection } from '@storybook-support/storybook-layout'

const meta = {
  title: 'Components/Data Display/KeyboardShortcutHint',
  component: KeyboardShortcutHint,
  tags: ['autodocs'],
  parameters: {
    layout: 'fullscreen',
    a11y: { test: 'error' },
  },
} satisfies Meta<typeof KeyboardShortcutHint>

export default meta

type Story = StoryObj<typeof meta>

export const Review: Story = {
  args: { keys: ['Ctrl', 'K'] },
  render: () => (
    <StorybookPage
      title="KeyboardShortcutHint"
      description="Inline keyboard shortcut hint with key chips. Use in tooltips, menu items, or empty states to show keyboard alternatives."
    >
      <StorybookSection title="Sizes" description="sm and md.">
        <StorybookGrid columns="repeat(auto-fit, minmax(var(--ig-popup-xs), 1fr))">
          <StorybookCard title="md (default)">
            <KeyboardShortcutHint keys={['Ctrl', 'K']} />
          </StorybookCard>
          <StorybookCard title="sm">
            <KeyboardShortcutHint keys={['Ctrl', 'K']} size="sm" />
          </StorybookCard>
        </StorybookGrid>
      </StorybookSection>

      <StorybookSection title="Variants" description="Common shortcuts.">
        <StorybookGrid columns="repeat(auto-fit, minmax(var(--ig-popup-list-min), 1fr))">
          <StorybookCard title="Single key">
            <KeyboardShortcutHint keys={['Esc']} />
          </StorybookCard>
          <StorybookCard title="Two keys">
            <KeyboardShortcutHint keys={['Cmd', 'S']} />
          </StorybookCard>
          <StorybookCard title="Three keys">
            <KeyboardShortcutHint keys={['Cmd', 'Shift', 'P']} />
          </StorybookCard>
          <StorybookCard title="Arrow key">
            <KeyboardShortcutHint keys={['↑', '↓']} />
          </StorybookCard>
        </StorybookGrid>
      </StorybookSection>

      <StorybookSection title="Use case" description="Inline with description text.">
        <StorybookGrid columns="1fr">
          <StorybookCard title="Empty state hint">
            <div style={{ fontSize: 'var(--ig-font-size-sm)', color: 'var(--ig-color-text-muted)' }}>
              Press <KeyboardShortcutHint keys={['Cmd', 'K']} size="sm" /> to open the search palette.
            </div>
          </StorybookCard>
        </StorybookGrid>
      </StorybookSection>
    </StorybookPage>
  ),
}
