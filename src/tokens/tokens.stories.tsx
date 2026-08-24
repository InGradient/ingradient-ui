import type { Meta, StoryObj } from '@storybook/react-vite'
import { StorybookMetaBar, StorybookPage, StorybookSection } from '@storybook-support/storybook-layout'

const meta = {
  title: 'Guides/Token Overview Migration',
  parameters: {
    layout: 'fullscreen',
    a11y: { test: 'error' },
  },
} satisfies Meta

export default meta
type Story = StoryObj<typeof meta>

export const CanonicalOverview: Story = {
  render: () => (
    <StorybookPage
      title="Token Overview moved"
      description="The former manually maintained token gallery has been retired because its lists could drift from the token registry. Use Foundations / Token Overview as the single canonical inspection surface."
      meta={<StorybookMetaBar items={[{ label: 'Canonical: Foundations / Token Overview', tone: 'accent' }, { label: 'Legacy gallery retired', tone: 'warning' }]} />}
    >
      <StorybookSection title="What changed" description="The canonical overview now distinguishes raw TS source values from mode-aware resolved CSS variables, separates global and product geometry, and includes semantic state combinations.">
        <ul style={{ margin: 0, paddingLeft: 'var(--ig-space-7)', color: 'var(--ig-color-text-muted)', lineHeight: 'var(--ig-line-height-relaxed)' }}>
          <li>Use the Storybook toolbar to review light/dark mode and density.</li>
          <li>Use the Raw foundation palette story only when defining semantic tokens.</li>
          <li>Use semantic aliases in product UI; do not copy raw palette values into components.</li>
        </ul>
      </StorybookSection>
    </StorybookPage>
  ),
}
