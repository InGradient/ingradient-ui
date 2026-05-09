import type { Meta, StoryObj } from '@storybook/react-vite'
import { ColorSwatch } from './color-swatch'
import { StorybookCard, StorybookGrid, StorybookPage, StorybookSection } from '@storybook-support/storybook-layout'

const meta = {
  title: 'Components/Data Display/ColorSwatch',
  component: ColorSwatch,
  tags: ['autodocs'],
  parameters: {
    layout: 'fullscreen',
    a11y: { test: 'todo' },
  },
} satisfies Meta<typeof ColorSwatch>

export default meta

type Story = StoryObj<typeof meta>

const sampleColors = ['#ef4444', '#f97316', '#eab308', '#22c55e', '#3b82f6', '#a855f7']

export const Review: Story = {
  args: { $color: '#ef4444' },
  render: () => (
    <StorybookPage
      title="ColorSwatch"
      description="Tiny color tile for class lists, palette previews, and inline color indicators. Three sizes (xs/sm/md) and two shapes (circle/square)."
    >
      <StorybookSection title="Sizes" description="xs / sm / md.">
        <StorybookGrid columns="repeat(auto-fit, minmax(200px, 1fr))">
          <StorybookCard title="xs">
            <div style={{ display: 'flex', gap: 'var(--ig-space-3)', alignItems: 'center' }}>
              {sampleColors.map((c) => (
                <ColorSwatch key={c} $color={c} $size="xs" />
              ))}
            </div>
          </StorybookCard>
          <StorybookCard title="sm">
            <div style={{ display: 'flex', gap: 'var(--ig-space-3)', alignItems: 'center' }}>
              {sampleColors.map((c) => (
                <ColorSwatch key={c} $color={c} $size="sm" />
              ))}
            </div>
          </StorybookCard>
          <StorybookCard title="md">
            <div style={{ display: 'flex', gap: 'var(--ig-space-3)', alignItems: 'center' }}>
              {sampleColors.map((c) => (
                <ColorSwatch key={c} $color={c} $size="md" />
              ))}
            </div>
          </StorybookCard>
        </StorybookGrid>
      </StorybookSection>

      <StorybookSection title="Shapes" description="circle (default) / square.">
        <StorybookGrid columns="repeat(auto-fit, minmax(200px, 1fr))">
          <StorybookCard title="circle (default)">
            <div style={{ display: 'flex', gap: 'var(--ig-space-3)' }}>
              {sampleColors.map((c) => (
                <ColorSwatch key={c} $color={c} $size="md" $shape="circle" />
              ))}
            </div>
          </StorybookCard>
          <StorybookCard title="square">
            <div style={{ display: 'flex', gap: 'var(--ig-space-3)' }}>
              {sampleColors.map((c) => (
                <ColorSwatch key={c} $color={c} $size="md" $shape="square" />
              ))}
            </div>
          </StorybookCard>
        </StorybookGrid>
      </StorybookSection>
    </StorybookPage>
  ),
}
