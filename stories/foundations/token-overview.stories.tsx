import type { Meta, StoryObj } from '@storybook/react-vite'
import {
  aspectRatios,
  chartColors,
  chartHeights,
  controlSizes,
  foundationColors,
  iconSizes,
  layoutScale,
  motionScale,
  opacityScale,
  popupSizes,
  radiusScale,
  shadowScale,
  spacingScale,
  transformScale,
  typographyScale,
  zIndexScale,
} from '../../src/tokens'
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
const controlEntries = Object.entries(controlSizes)
const popupEntries = Object.entries(popupSizes)
const iconEntries = Object.entries(iconSizes)
const layoutEntries = Object.entries(layoutScale)
const opacityEntries = Object.entries(opacityScale)
const zIndexEntries = Object.entries(zIndexScale)
const aspectEntries = Object.entries(aspectRatios)
const transformEntries = Object.entries(transformScale)
const chartColorEntries = Object.entries(chartColors)
const chartHeightEntries = Object.entries(chartHeights)

function colorPreview(value: string) {
  return (
    <div
      style={{
        height: 'var(--ig-layout-histogram-height)',
        borderRadius: 'var(--ig-radius-lg)',
        border: 'var(--ig-border-1px) solid var(--ig-color-border-subtle)',
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
              <div key={name} style={{ display: 'grid', gridTemplateColumns: 'var(--ig-icon-gallery-min) minmax(0, 1fr)', gap: 'var(--ig-space-5)', alignItems: 'baseline' }}>
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
              <div key={name} style={{ display: 'grid', gridTemplateColumns: 'var(--ig-control-height-xl) minmax(0, 1fr) var(--ig-control-height-2xl-wide)', gap: 'var(--ig-space-5)', alignItems: 'center' }}>
                <code style={{ fontSize: 12, color: 'var(--ig-color-text-soft)' }}>{name}</code>
                <div style={{ height: 'var(--ig-space-5)', borderRadius: 999, background: 'var(--ig-color-surface-active)' }}>
                  <div
                    style={{
                      width: value,
                      minWidth: 'var(--ig-space-3)',
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
                  gap: 'var(--ig-space-3)',
                  alignItems: 'center',
                  padding: 'var(--ig-space-5)',
                  border: 'var(--ig-border-1px) solid var(--ig-color-border-subtle)',
                  borderRadius: 'var(--ig-radius-lg)',
                }}
              >
                <div
                  style={{
                    width: 'var(--ig-control-height-capture)',
                    height: 'var(--ig-control-height-capture)',
                    borderRadius: value,
                    border: 'var(--ig-border-1px) solid var(--ig-color-border-strong)',
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
              <div key={name} style={{ display: 'grid', gridTemplateColumns: 'var(--ig-control-height-capture) minmax(0, 1fr)', gap: 'var(--ig-space-6)', alignItems: 'center' }}>
                <code style={{ fontSize: 12, color: 'var(--ig-color-text-soft)' }}>{name}</code>
                <div
                  style={{
                    minHeight: 'var(--ig-layout-sidebar-brand)',
                    borderRadius: 'var(--ig-radius-xl)',
                    background: 'var(--ig-color-surface-panel)',
                    boxShadow: value,
                    border: 'var(--ig-border-1px) solid var(--ig-color-border-subtle)',
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
                  gap: 'var(--ig-space-5)',
                  padding: 'var(--ig-space-5)',
                  border: 'var(--ig-border-1px) solid var(--ig-color-border-subtle)',
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

      <StorybookGrid columns="repeat(auto-fit, minmax(260px, 1fr))">
        <StorybookSection
          title="Control height"
          description="Button / input / chip / select tier — `controlSizes` const."
        >
          <StorybookStack gap={8}>
            {controlEntries.map(([name, value]) => (
              <div key={name} style={{ display: 'flex', alignItems: 'center', gap: 'var(--ig-space-5)' }}>
                <code style={{ fontSize: 12, minWidth: 'var(--ig-popup-3xs)', color: 'var(--ig-color-text-soft)' }}>{name}</code>
                <div style={{ width: 'var(--ig-icon-gallery-min)', height: value, background: 'var(--ig-color-accent-soft-surface)', borderRadius: 'var(--ig-radius-sm)' }} />
                <code style={{ fontSize: 12, color: 'var(--ig-color-text-soft)' }}>{value}</code>
              </div>
            ))}
          </StorybookStack>
        </StorybookSection>

        <StorybookSection
          title="Popup size"
          description="Popover / dropdown / dialog 의 width tier."
        >
          <StorybookStack gap={8}>
            {popupEntries.map(([name, value]) => (
              <div key={name} style={{ display: 'flex', alignItems: 'center', gap: 'var(--ig-space-5)' }}>
                <code style={{ fontSize: 12, minWidth: 'var(--ig-popup-3xs)', color: 'var(--ig-color-text-soft)' }}>{name}</code>
                <div style={{ width: value, height: 'var(--ig-space-3)', background: 'var(--ig-color-accent-ring)', borderRadius: 999 }} />
                <code style={{ fontSize: 12, color: 'var(--ig-color-text-soft)' }}>{value}</code>
              </div>
            ))}
          </StorybookStack>
        </StorybookSection>

        <StorybookSection
          title="Icon size"
          description="Inline SVG / lucide icon tier — `iconSizes` const."
        >
          <StorybookStack gap={8}>
            {iconEntries.map(([name, value]) => (
              <div key={name} style={{ display: 'flex', alignItems: 'center', gap: 'var(--ig-space-5)' }}>
                <code style={{ fontSize: 12, minWidth: 'var(--ig-popup-3xs)', color: 'var(--ig-color-text-soft)' }}>{name}</code>
                <div style={{ width: value, height: value, background: 'var(--ig-color-accent)', borderRadius: 'var(--ig-radius-2xs)', flexShrink: 0 }} />
                <code style={{ fontSize: 12, color: 'var(--ig-color-text-soft)' }}>{value}</code>
              </div>
            ))}
          </StorybookStack>
        </StorybookSection>
      </StorybookGrid>

      <StorybookGrid columns="repeat(auto-fit, minmax(260px, 1fr))">
        <StorybookSection
          title="Layout"
          description="Page dimensions — topbar / sidebar / capture / log / histogram / dataset card."
        >
          <StorybookStack gap={6}>
            {layoutEntries.map(([name, value]) => (
              <div key={name} style={{ display: 'flex', justifyContent: 'space-between', padding: 'var(--ig-space-2) var(--ig-space-4)', border: 'var(--ig-border-1px) solid var(--ig-color-border-subtle)', borderRadius: 'var(--ig-radius-sm)' }}>
                <code style={{ fontSize: 12 }}>{name}</code>
                <code style={{ fontSize: 12, color: 'var(--ig-color-text-soft)' }}>{value}</code>
              </div>
            ))}
          </StorybookStack>
        </StorybookSection>

        <StorybookSection
          title="Opacity"
          description="Tier — hidden/ghost/faded/disabled/overlay/muted/subtle/emphatic/loud/prominent/near."
        >
          <StorybookStack gap={8}>
            {opacityEntries.map(([name, value]) => (
              <div key={name} style={{ display: 'flex', alignItems: 'center', gap: 'var(--ig-space-5)' }}>
                <code style={{ fontSize: 12, minWidth: 'var(--ig-popup-3xs)', color: 'var(--ig-color-text-soft)' }}>{name}</code>
                <div style={{ width: 80, height: 'var(--ig-control-height-sm)', background: 'var(--ig-color-accent)', opacity: value, borderRadius: 'var(--ig-radius-md)' }} />
                <code style={{ fontSize: 12, color: 'var(--ig-color-text-soft)' }}>{value}</code>
              </div>
            ))}
          </StorybookStack>
        </StorybookSection>

        <StorybookSection
          title="Z-index"
          description="Layering scale — hidden(0) → tooltip(9999)."
        >
          <StorybookStack gap={4}>
            {zIndexEntries.map(([name, value]) => (
              <div key={name} style={{ display: 'flex', justifyContent: 'space-between', padding: 'var(--ig-space-1) var(--ig-space-4)', borderBottom: 'var(--ig-border-1px) solid var(--ig-color-border-subtle)' }}>
                <code style={{ fontSize: 12 }}>{name}</code>
                <code style={{ fontSize: 12, color: 'var(--ig-color-text-soft)' }}>{value}</code>
              </div>
            ))}
          </StorybookStack>
        </StorybookSection>
      </StorybookGrid>

      <StorybookGrid columns="repeat(auto-fit, minmax(260px, 1fr))">
        <StorybookSection
          title="Transform scale"
          description="Press / drag / hover-lift micro motion."
        >
          <StorybookStack gap={10}>
            {transformEntries.map(([name, value]) => (
              <div key={name} style={{ display: 'flex', alignItems: 'center', gap: 'var(--ig-space-5)' }}>
                <code style={{ fontSize: 12, minWidth: 'var(--ig-popup-3xs)', color: 'var(--ig-color-text-soft)' }}>{name}</code>
                <div style={{ width: 80, height: 'var(--ig-control-height-mid-plus)', background: 'var(--ig-color-accent-soft-surface)', transform: `scale(${value})`, borderRadius: 'var(--ig-radius-md)' }} />
                <code style={{ fontSize: 12, color: 'var(--ig-color-text-soft)' }}>{value}</code>
              </div>
            ))}
          </StorybookStack>
        </StorybookSection>

        <StorybookSection
          title="Aspect ratio"
          description="Image / video 비율 tier — square / landscape / wide / ultra-wide / portrait."
        >
          <StorybookGrid columns="repeat(auto-fit, minmax(110px, 1fr))">
            {aspectEntries.map(([name, value]) => (
              <div key={name} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6 }}>
                <div style={{ width: '100%', aspectRatio: value, background: 'var(--ig-color-accent-soft-surface)', borderRadius: 'var(--ig-radius-md)' }} />
                <code style={{ fontSize: 12 }}>{name}</code>
                <code style={{ fontSize: 'var(--ig-icon-2xs)', color: 'var(--ig-color-text-soft)' }}>{value}</code>
              </div>
            ))}
          </StorybookGrid>
        </StorybookSection>

        <StorybookSection
          title="Chart palette"
          description="Recharts JS const — SVG attribute 영역. CSS var() 적용 불가."
        >
          <StorybookGrid columns="repeat(auto-fit, minmax(110px, 1fr))">
            {chartColorEntries.map(([name, value]) => (
              <div key={name} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6 }}>
                <div style={{ width: '100%', height: 'var(--ig-control-height-xl)', background: value, borderRadius: 'var(--ig-radius-md)' }} />
                <code style={{ fontSize: 12 }}>{name}</code>
                <code style={{ fontSize: 'var(--ig-icon-2xs)', color: 'var(--ig-color-text-soft)' }}>{value}</code>
              </div>
            ))}
          </StorybookGrid>
        </StorybookSection>

        <StorybookSection
          title="Chart height"
          description="LineChartCard / BarChartCard 의 height — `chartHeights` const."
        >
          <StorybookStack gap={4}>
            {chartHeightEntries.map(([name, value]) => (
              <div key={name} style={{ display: 'flex', justifyContent: 'space-between', padding: 'var(--ig-space-1) var(--ig-space-4)', borderBottom: 'var(--ig-border-1px) solid var(--ig-color-border-subtle)' }}>
                <code style={{ fontSize: 12 }}>{name}</code>
                <code style={{ fontSize: 12, color: 'var(--ig-color-text-soft)' }}>{value}px</code>
              </div>
            ))}
          </StorybookStack>
        </StorybookSection>
      </StorybookGrid>
    </StorybookPage>
  ),
}
