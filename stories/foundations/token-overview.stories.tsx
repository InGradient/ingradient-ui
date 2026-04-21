import type { Meta, StoryObj } from '@storybook/react-vite'
import { foundationColors, motionScale, radiusScale, shadowScale, spacingScale, typographyScale } from '../../src/tokens'
import { StorybookCard, StorybookGrid, StorybookPage, StorybookSection, StorybookStack } from '@storybook-support/storybook-layout'

const meta = {
  title: 'Foundations/Token Overview',
  tags: ['autodocs'],
  parameters: {
    layout: 'fullscreen',
  },
} satisfies Meta

export default meta

type Story = StoryObj<typeof meta>

const colorEntries = Object.entries(foundationColors)
const spacingEntries = Object.entries(spacingScale)
const radiusEntries = Object.entries(radiusScale)
const typeEntries = Object.entries(typographyScale)
const shadowEntries = Object.entries(shadowScale)
const motionEntries = Object.entries(motionScale)

function colorPreview(value: string) {
  return (
    <div
      style={{
        height: 84,
        borderRadius: 'var(--ig-radius-lg)',
        border: '1px solid var(--ig-color-border-subtle)',
        background: value,
      }}
    />
  )
}

export const Overview: Story = {
  render: () => (
    <StorybookPage
      title="Foundation Tokens"
      description="Foundations are the raw building blocks behind components and patterns. This view is for fast token inspection before reviewing semantic or page-level stories."
    >
      <StorybookSection
        title="Color primitives"
        description="Raw color tokens should be inspected here, but consumed through semantic tokens or recipes in product-facing components."
      >
        <StorybookGrid columns="repeat(auto-fit, minmax(180px, 1fr))">
          {colorEntries.map(([name, value]) => (
            <StorybookCard key={name} title={name} subtitle={value}>
              <StorybookStack gap={10}>
                {colorPreview(value)}
                <code style={{ fontSize: 12, color: 'var(--ig-color-text-soft)' }}>{value}</code>
              </StorybookStack>
            </StorybookCard>
          ))}
        </StorybookGrid>
      </StorybookSection>

      <StorybookGrid columns="minmax(0, 1.5fr) minmax(0, 1fr)">
        <StorybookSection
          title="Typography scale"
          description="Use type tokens to compare hierarchy and rhythm before applying component-specific recipes."
        >
          <StorybookStack gap={12}>
            {typeEntries.map(([name, value]) => (
              <div key={name} style={{ display: 'grid', gridTemplateColumns: '120px minmax(0, 1fr)', gap: 12, alignItems: 'baseline' }}>
                <code style={{ fontSize: 12, color: 'var(--ig-color-text-soft)' }}>{name}</code>
                <div style={{ fontFamily: typographyScale.fontSans, fontSize: value }}>
                  The quick brown fox jumps over the lazy dog.
                </div>
              </div>
            ))}
          </StorybookStack>
        </StorybookSection>

        <StorybookSection
          title="Spacing scale"
          description="Spacing is easier to review with relative bars than plain numbers."
        >
          <StorybookStack gap={10}>
            {spacingEntries.map(([name, value]) => (
              <div key={name} style={{ display: 'grid', gridTemplateColumns: '48px minmax(0, 1fr) 56px', gap: 12, alignItems: 'center' }}>
                <code style={{ fontSize: 12, color: 'var(--ig-color-text-soft)' }}>{name}</code>
                <div style={{ height: 12, borderRadius: 999, background: 'var(--ig-color-surface-active)' }}>
                  <div
                    style={{
                      width: value,
                      minWidth: 8,
                      height: '100%',
                      borderRadius: 999,
                      background: 'var(--ig-color-accent-ring)',
                    }}
                  />
                </div>
                <code style={{ fontSize: 12, color: 'var(--ig-color-text-soft)' }}>{value}</code>
              </div>
            ))}
          </StorybookStack>
        </StorybookSection>
      </StorybookGrid>

      <StorybookGrid columns="repeat(auto-fit, minmax(260px, 1fr))">
        <StorybookSection
          title="Radius"
          description="Corner radius affects the overall brand feel more than most teams expect."
        >
          <StorybookGrid columns="repeat(auto-fit, minmax(110px, 1fr))">
            {radiusEntries.map(([name, value]) => (
              <div
                key={name}
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  gap: 8,
                  alignItems: 'center',
                  padding: 12,
                  border: '1px solid var(--ig-color-border-subtle)',
                  borderRadius: 'var(--ig-radius-lg)',
                }}
              >
                <div
                  style={{
                    width: 64,
                    height: 64,
                    borderRadius: value,
                    border: '1px solid var(--ig-color-border-strong)',
                    background: 'var(--ig-color-surface-raised)',
                  }}
                />
                <code style={{ fontSize: 12 }}>{name}</code>
              </div>
            ))}
          </StorybookGrid>
        </StorybookSection>

        <StorybookSection
          title="Shadows"
          description="Shadow tokens should be reviewed with the same surface color used by core panels."
        >
          <StorybookStack gap={14}>
            {shadowEntries.map(([name, value]) => (
              <div key={name} style={{ display: 'grid', gridTemplateColumns: '96px minmax(0, 1fr)', gap: 14, alignItems: 'center' }}>
                <code style={{ fontSize: 12, color: 'var(--ig-color-text-soft)' }}>{name}</code>
                <div
                  style={{
                    minHeight: 72,
                    borderRadius: 'var(--ig-radius-xl)',
                    background: 'var(--ig-color-surface-panel)',
                    boxShadow: value,
                    border: '1px solid var(--ig-color-border-subtle)',
                  }}
                />
              </div>
            ))}
          </StorybookStack>
        </StorybookSection>

        <StorybookSection
          title="Motion"
          description="Motion tokens stay intentionally small and should remain easy to reason about."
        >
          <StorybookStack gap={12}>
            {motionEntries.map(([name, value]) => (
              <div
                key={name}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  gap: 12,
                  padding: 12,
                  border: '1px solid var(--ig-color-border-subtle)',
                  borderRadius: 'var(--ig-radius-lg)',
                  background: 'var(--ig-color-surface-raised)',
                }}
              >
                <strong style={{ fontSize: 14 }}>{name}</strong>
                <code style={{ fontSize: 12, color: 'var(--ig-color-text-soft)' }}>{value}</code>
              </div>
            ))}
          </StorybookStack>
        </StorybookSection>
      </StorybookGrid>
    </StorybookPage>
  ),
}
