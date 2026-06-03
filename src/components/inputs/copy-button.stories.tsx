import type { Meta, StoryObj } from '@storybook/react-vite'
import { CopyButton } from './copy-button'
import { StorybookCard, StorybookGrid, StorybookPage, StorybookSection } from '@storybook-support/storybook-layout'

const meta = {
  title: 'Components/Inputs/CopyButton',
  component: CopyButton,
  tags: ['autodocs'],
  parameters: {
    layout: 'fullscreen',
    a11y: { test: 'error' },
  },
} satisfies Meta<typeof CopyButton>

export default meta

type Story = StoryObj<typeof meta>

export const Review: Story = {
  args: { value: 'sample-value' },
  render: () => (
    <StorybookPage
      title="CopyButton"
      description="Copy-to-clipboard button. Shows copy icon by default, switches to check icon + 'Copied!' label after click. Uses useClipboard hook internally."
    >
      <StorybookSection title="Sizes" description="sm and md.">
        <StorybookGrid columns="repeat(auto-fit, minmax(var(--ig-popup-xs), 1fr))">
          <StorybookCard title="md (default)">
            <CopyButton value="abc-123" />
          </StorybookCard>
          <StorybookCard title="sm">
            <CopyButton value="abc-123" size="sm" />
          </StorybookCard>
        </StorybookGrid>
      </StorybookSection>

      <StorybookSection title="Custom labels">
        <StorybookGrid columns="repeat(auto-fit, minmax(var(--ig-popup-xs), 1fr))">
          <StorybookCard title="Custom button label">
            <CopyButton value="https://example.com">Copy URL</CopyButton>
          </StorybookCard>
          <StorybookCard title="Custom copied label">
            <CopyButton value="abc" copiedLabel="Done!">Copy</CopyButton>
          </StorybookCard>
        </StorybookGrid>
      </StorybookSection>

      <StorybookSection title="Use cases">
        <StorybookGrid columns="repeat(auto-fit, minmax(var(--ig-popup-sm), 1fr))">
          <StorybookCard title="Image ID copy" subtitle="alongside read-only field">
            <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--ig-space-3)' }}>
              <code style={{ fontSize: 'var(--ig-font-size-xs)', color: 'var(--ig-color-text-muted)' }}>
                img-7f2a8e91-2b4c
              </code>
              <CopyButton value="img-7f2a8e91-2b4c" size="sm">Copy ID</CopyButton>
            </div>
          </StorybookCard>
          <StorybookCard title="Long path copy">
            <CopyButton value="/var/lib/ingradient/captures/2026-05/sequence-1234">
              Copy path
            </CopyButton>
          </StorybookCard>
        </StorybookGrid>
      </StorybookSection>
    </StorybookPage>
  ),
}
