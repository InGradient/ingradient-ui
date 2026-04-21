import type { Meta, StoryObj } from '@storybook/react-vite'
import { Spinner } from './spinner'
import { StorybookCard, StorybookGrid, StorybookPage, StorybookSection } from '@storybook-support/storybook-layout'

const meta = {
  title: 'Components/Feedback/Spinner',
  component: Spinner,
  tags: ['autodocs'],
  parameters: {
    a11y: {
      test: 'todo',
    },
  },
} satisfies Meta<typeof Spinner>

export default meta

type Story = StoryObj<typeof meta>

export const Review: Story = {
  render: () => (
    <StorybookPage
      title="Spinner"
      description="Spinner is the compact loading indicator for inline and supporting status feedback."
    >
      <StorybookSection
        title="Tone and size review"
        description="Review spinner readability across common size and tone combinations."
      >
        <StorybookGrid columns="repeat(auto-fit, minmax(220px, 1fr))">
          <StorybookCard title="Sizes" subtitle="sm / md / lg">
            <div style={{ display: 'flex', gap: 16, alignItems: 'center' }}>
              <Spinner size="sm" />
              <Spinner size="md" />
              <Spinner size="lg" />
            </div>
          </StorybookCard>
          <StorybookCard title="Tones" subtitle="accent / white / muted">
            <div style={{ display: 'flex', gap: 16, alignItems: 'center' }}>
              <Spinner tone="accent" />
              <Spinner tone="white" />
              <Spinner tone="muted" />
            </div>
          </StorybookCard>
        </StorybookGrid>
      </StorybookSection>
    </StorybookPage>
  ),
}
