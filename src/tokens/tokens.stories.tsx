import type { Meta, StoryObj } from '@storybook/react-vite'
import styled from 'styled-components'
import { StorybookCard, StorybookGrid, StorybookPage, StorybookSection } from '@storybook-support/storybook-layout'

const meta = {
  title: 'Foundation/Tokens',
  parameters: {
    layout: 'fullscreen',
    a11y: { test: 'todo' },
  },
} satisfies Meta

export default meta

type Story = StoryObj

const Swatch = styled.div<{ $bg: string; $border?: boolean }>`
  width: 100%;
  height: 56px;
  border-radius: var(--ig-radius-sm);
  background: ${(p) => p.$bg};
  border: ${(p) => (p.$border ? '1px solid var(--ig-color-border-subtle)' : 'none')};
`

const TokenLabel = styled.div`
  font-size: var(--ig-font-size-2xs);
  color: var(--ig-color-text-muted);
  font-family: monospace;
  margin-top: var(--ig-space-2);
  word-break: break-all;
`

const TokenName = styled.div`
  font-size: var(--ig-font-size-xs);
  color: var(--ig-color-text-primary);
  font-weight: 600;
  margin-top: var(--ig-space-1);
`

function ColorTile({ varName, label, withBorder }: { varName: string; label?: string; withBorder?: boolean }) {
  return (
    <div>
      <Swatch $bg={`var(${varName})`} $border={withBorder} />
      <TokenName>{label ?? varName.replace('--ig-color-', '')}</TokenName>
      <TokenLabel>{varName}</TokenLabel>
    </div>
  )
}

function SpacingTile({ varName }: { varName: string }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--ig-space-3)' }}>
      <div style={{ width: `var(${varName})`, height: 24, background: 'var(--ig-color-accent)', borderRadius: 2 }} />
      <TokenLabel style={{ marginTop: 0 }}>{varName}</TokenLabel>
    </div>
  )
}

function RadiusTile({ varName, label }: { varName: string; label: string }) {
  return (
    <div>
      <div
        style={{
          width: '100%',
          height: 80,
          background: 'var(--ig-color-surface-raised)',
          border: '1px solid var(--ig-color-border-subtle)',
          borderRadius: `var(${varName})`,
        }}
      />
      <TokenName>{label}</TokenName>
      <TokenLabel>{varName}</TokenLabel>
    </div>
  )
}

function FontSizeTile({ varName, label }: { varName: string; label: string }) {
  return (
    <div style={{ borderBottom: '1px solid var(--ig-color-border-subtle)', paddingBottom: 'var(--ig-space-3)' }}>
      <div style={{ fontSize: `var(${varName})`, color: 'var(--ig-color-text-primary)' }}>
        {label} · The quick brown fox
      </div>
      <TokenLabel>{varName}</TokenLabel>
    </div>
  )
}

export const Review: Story = {
  render: () => (
    <StorybookPage
      title="Foundation Tokens"
      description="All foundation tokens at a glance. Use this as a quick reference when picking colors, spacing, radius, or typography in component code."
    >
      <StorybookSection title="Brand & accent" description="Primary palette and accent variants.">
        <StorybookGrid columns="repeat(auto-fit, minmax(180px, 1fr))">
          <ColorTile varName="--ig-color-accent" />
          <ColorTile varName="--ig-color-accent-soft" />
          <ColorTile varName="--ig-color-accent-soft-surface" />
          <ColorTile varName="--ig-color-accent-ring" />
          <ColorTile varName="--ig-color-accent-border-strong" />
        </StorybookGrid>
      </StorybookSection>

      <StorybookSection title="Surface" description="Background layers from canvas → raised. Use surfaceMuted/Panel/Raised recipes for control fields and panels.">
        <StorybookGrid columns="repeat(auto-fit, minmax(180px, 1fr))">
          <ColorTile varName="--ig-color-bg-canvas" withBorder />
          <ColorTile varName="--ig-color-surface-muted" withBorder />
          <ColorTile varName="--ig-color-surface-panel" withBorder />
          <ColorTile varName="--ig-color-surface-raised" withBorder />
          <ColorTile varName="--ig-color-surface-interactive" withBorder />
          <ColorTile varName="--ig-color-surface-interactive-hover" withBorder />
          <ColorTile varName="--ig-color-surface-focus" withBorder />
        </StorybookGrid>
      </StorybookSection>

      <StorybookSection title="Text" description="Text color hierarchy.">
        <StorybookGrid columns="repeat(auto-fit, minmax(180px, 1fr))">
          <ColorTile varName="--ig-color-text-primary" />
          <ColorTile varName="--ig-color-text-secondary" />
          <ColorTile varName="--ig-color-text-muted" />
          <ColorTile varName="--ig-color-text-soft" />
        </StorybookGrid>
      </StorybookSection>

      <StorybookSection title="Border" description="Border strength variants.">
        <StorybookGrid columns="repeat(auto-fit, minmax(180px, 1fr))">
          <ColorTile varName="--ig-color-border-subtle" withBorder />
          <ColorTile varName="--ig-color-border-strong" withBorder />
        </StorybookGrid>
      </StorybookSection>

      <StorybookSection title="Status" description="Semantic colors for success / warning / danger.">
        <StorybookGrid columns="repeat(auto-fit, minmax(180px, 1fr))">
          <ColorTile varName="--ig-color-success" />
          <ColorTile varName="--ig-color-warning" />
          <ColorTile varName="--ig-color-danger" />
        </StorybookGrid>
      </StorybookSection>

      <StorybookSection title="White overlay (alpha)" description="Translucent white tints for hover/active states on dark surfaces.">
        <StorybookGrid columns="repeat(auto-fit, minmax(140px, 1fr))">
          <ColorTile varName="--ig-color-white-04" withBorder />
          <ColorTile varName="--ig-color-white-06" withBorder />
          <ColorTile varName="--ig-color-white-07" withBorder />
          <ColorTile varName="--ig-color-white-08" withBorder />
          <ColorTile varName="--ig-color-white-12" withBorder />
          <ColorTile varName="--ig-color-white-18" withBorder />
        </StorybookGrid>
      </StorybookSection>

      <StorybookSection title="Blue tint (accent alpha)" description="Translucent accent overlays for selection / hover states.">
        <StorybookGrid columns="repeat(auto-fit, minmax(140px, 1fr))">
          <ColorTile varName="--ig-color-blue-tint-12" withBorder />
          <ColorTile varName="--ig-color-blue-tint-14" withBorder />
          <ColorTile varName="--ig-color-blue-tint-16" withBorder />
          <ColorTile varName="--ig-color-blue-tint-18" withBorder />
          <ColorTile varName="--ig-color-blue-tint-28" withBorder />
          <ColorTile varName="--ig-color-blue-tint-38" withBorder />
        </StorybookGrid>
      </StorybookSection>

      <StorybookSection title="Spacing" description="--ig-space-1 through --ig-space-13. Reference scale.">
        <StorybookCard title="Spacing scale" subtitle="bar width = token value">
          <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--ig-space-2)' }}>
            {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13].map((n) => (
              <SpacingTile key={n} varName={`--ig-space-${n}`} />
            ))}
          </div>
        </StorybookCard>
      </StorybookSection>

      <StorybookSection title="Radius" description="Border radius scale.">
        <StorybookGrid columns="repeat(auto-fit, minmax(180px, 1fr))">
          <RadiusTile varName="--ig-radius-xs" label="xs" />
          <RadiusTile varName="--ig-radius-sm" label="sm" />
          <RadiusTile varName="--ig-radius-md" label="md" />
          <RadiusTile varName="--ig-radius-lg" label="lg" />
          <RadiusTile varName="--ig-radius-xl" label="xl" />
          <RadiusTile varName="--ig-radius-2xl" label="2xl" />
        </StorybookGrid>
      </StorybookSection>

      <StorybookSection title="Typography" description="Font size scale.">
        <StorybookCard title="Font sizes">
          <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--ig-space-3)' }}>
            <FontSizeTile varName="--ig-font-size-2xs" label="2xs" />
            <FontSizeTile varName="--ig-font-size-xs" label="xs" />
            <FontSizeTile varName="--ig-font-size-sm" label="sm" />
            <FontSizeTile varName="--ig-font-size-md" label="md" />
            <FontSizeTile varName="--ig-font-size-lg" label="lg" />
            <FontSizeTile varName="--ig-font-size-xl" label="xl" />
          </div>
        </StorybookCard>
      </StorybookSection>
    </StorybookPage>
  ),
}
