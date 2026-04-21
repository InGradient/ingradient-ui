import type { Meta, StoryObj } from '@storybook/react-vite'
import { IconGallery } from './icon-gallery'
import { StorybookPage, StorybookSection } from '@storybook-support/storybook-layout'

const meta = {
  title: 'Components/Icons/Icon Gallery',
  component: IconGallery,
  tags: ['autodocs'],
  parameters: {
    layout: 'fullscreen',
    a11y: {
      test: 'todo',
    },
  },
} satisfies Meta<typeof IconGallery>

export default meta

type Story = StoryObj<typeof meta>

export const Review: Story = {
  args: {
    size: 20,
  },
  render: () => (
    <StorybookPage
      title="Icon Gallery"
      description="The icon registry is the product-safe icon vocabulary for ingradient surfaces. Review available glyph names here before introducing a new symbol."
    >
      <StorybookSection
        title="Registry review"
        description="Use this gallery as the canonical visual index for reusable icons."
      >
        <IconGallery />
      </StorybookSection>
    </StorybookPage>
  ),
}
