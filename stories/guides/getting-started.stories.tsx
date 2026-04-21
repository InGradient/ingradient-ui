import type { Meta, StoryObj } from '@storybook/react-vite'
import { StorybookGrid, StorybookPage, StorybookSection } from '@storybook-support/storybook-layout'

const meta = {
  title: 'Guides/Getting Started',
  tags: ['autodocs'],
  parameters: {
    layout: 'fullscreen',
  },
} satisfies Meta

export default meta

type Story = StoryObj<typeof meta>

export const Overview: Story = {
  render: () => (
    <StorybookPage
      title="Getting Started With Ingradient UI Storybook"
      description="This Storybook is the primary interactive catalog for @ingradient/ui. Use it to review component contracts, compare states, inspect page compositions, and validate live examples that used to live in the design showcase app."
    >
      <StorybookSection title="What You Can Do Here">
        <StorybookGrid columns="repeat(auto-fit, minmax(220px, 1fr))">
          <div>Browse public components and patterns with autodocs.</div>
          <div>Compare review states like loading, empty, error, and permission variants.</div>
          <div>Inspect page stories with global role and data scale presets.</div>
          <div>Use sandboxes to compare tokens, surfaces, and interaction density.</div>
        </StorybookGrid>
      </StorybookSection>
      <StorybookSection title="Recommended Reading Order">
        <ol style={{ margin: 0, paddingLeft: 20, lineHeight: 1.8 }}>
          <li>`Guides/Getting Started` for the top-level structure.</li>
          <li>`Components/*` for individual contracts and states.</li>
          <li>`Patterns/*` and `Pages/*` for composition examples.</li>
          <li>`Sandboxes/*` for side-by-side comparison and token review.</li>
        </ol>
      </StorybookSection>
      <StorybookSection title="Global Toolbar">
        <ul style={{ margin: 0, paddingLeft: 20, lineHeight: 1.8 }}>
          <li>`Density` changes preview spacing around stories and helps review compact vs comfortable layouts.</li>
          <li>`Role` lets page stories distinguish viewer, editor, and admin states.</li>
          <li>`Data scale` lets page stories open sparse, realistic, and overloaded data presets.</li>
        </ul>
      </StorybookSection>
      <StorybookSection title="Authoring Rule">
        <p style={{ margin: 0, lineHeight: 1.7, color: 'var(--ig-color-text-muted)' }}>
          New public exports should ship with a `Playground` story, a `Review` story, and any required `Scenario` or `Page` stories. If users need the surface often, keep the matching Markdown companion in `docs/reference/**` in sync.
        </p>
      </StorybookSection>
    </StorybookPage>
  ),
}
