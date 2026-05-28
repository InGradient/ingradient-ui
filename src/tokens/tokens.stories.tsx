import type { Meta, StoryObj } from '@storybook/react-vite'
import styled from 'styled-components'
import { StorybookCard, StorybookGrid, StorybookPage, StorybookSection } from '@storybook-support/storybook-layout'

const meta = {
  title: 'Foundation/Tokens',
  parameters: {
    layout: 'fullscreen',
    a11y: { test: 'error' },
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

function BorderWidthTile({ varName }: { varName: string }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--ig-space-3)' }}>
      <div style={{ width: 80, height: 24, borderTop: `var(${varName}) solid var(--ig-color-accent)` }} />
      <TokenLabel style={{ marginTop: 0 }}>{varName}</TokenLabel>
    </div>
  )
}

function MotionTile({ varName, label }: { varName: string; label: string }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--ig-space-3)' }}>
      <div
        style={{
          width: 80,
          height: 12,
          borderRadius: 'var(--ig-radius-pill)',
          background: 'var(--ig-color-accent-soft-surface)',
          position: 'relative',
          overflow: 'hidden',
        }}
      >
        <div
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            height: '100%',
            width: '30%',
            background: 'var(--ig-color-accent)',
            animation: `motionDemo var(${varName}) infinite alternate`,
          }}
        />
      </div>
      <div style={{ minWidth: 90, color: 'var(--ig-color-text-primary)' }}>{label}</div>
      <TokenLabel style={{ marginTop: 0 }}>{varName}</TokenLabel>
    </div>
  )
}

function ZIndexTile({ varName, value }: { varName: string; value: number }) {
  return (
    <div style={{ display: 'flex', alignItems: 'baseline', gap: 'var(--ig-space-3)' }}>
      <div style={{ width: 56, textAlign: 'right', fontFamily: 'var(--ig-font-mono)', color: 'var(--ig-color-text-primary)' }}>
        {value}
      </div>
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
            <SpacingTile varName="--ig-space-1px" />
            <SpacingTile varName="--ig-space-2px" />
            <SpacingTile varName="--ig-space-3px" />
            {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13].map((n) => (
              <SpacingTile key={n} varName={`--ig-space-${n}`} />
            ))}
          </div>
        </StorybookCard>
      </StorybookSection>

      <StorybookSection title="Border width" description="--ig-border-1px / -2px / -3px.">
        <StorybookCard title="Border widths">
          <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--ig-space-2)' }}>
            <BorderWidthTile varName="--ig-border-1px" />
            <BorderWidthTile varName="--ig-border-2px" />
            <BorderWidthTile varName="--ig-border-3px" />
          </div>
        </StorybookCard>
      </StorybookSection>

      <StorybookSection title="Motion" description="Transition + animation duration tokens. 막대가 token duration 마다 좌우로 이동.">
        <StorybookCard title="Motion tokens">
          <style>{`@keyframes motionDemo { from { transform: translateX(0); } to { transform: translateX(160%); } }`}</style>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--ig-space-3)' }}>
            <MotionTile varName="--ig-motion-fast" label="fast (0.16s)" />
            <MotionTile varName="--ig-motion-normal" label="normal (0.24s)" />
            <MotionTile varName="--ig-motion-slow" label="slow (0.36s)" />
            <MotionTile varName="--ig-motion-spinner" label="spinner (0.7s)" />
            <MotionTile varName="--ig-motion-shimmer" label="shimmer (1s)" />
            <MotionTile varName="--ig-motion-skeleton" label="skeleton (1.3s)" />
          </div>
        </StorybookCard>
      </StorybookSection>

      <StorybookSection title="Z-index" description="Layering scale — micro layer 부터 tooltip 까지.">
        <StorybookCard title="Z-index tokens">
          <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--ig-space-2)' }}>
            <ZIndexTile varName="--ig-z-base" value={1} />
            <ZIndexTile varName="--ig-z-raised" value={2} />
            <ZIndexTile varName="--ig-z-capture" value={5} />
            <ZIndexTile varName="--ig-z-sticky" value={10} />
            <ZIndexTile varName="--ig-z-header" value={20} />
            <ZIndexTile varName="--ig-z-overlay" value={24} />
            <ZIndexTile varName="--ig-z-dropdown" value={100} />
            <ZIndexTile varName="--ig-z-mobile-nav-backdrop" value={110} />
            <ZIndexTile varName="--ig-z-mobile-nav" value={120} />
            <ZIndexTile varName="--ig-z-mobile-menu" value={200} />
            <ZIndexTile varName="--ig-z-popover" value={500} />
            <ZIndexTile varName="--ig-z-context-menu" value={1000} />
            <ZIndexTile varName="--ig-z-drawer" value={1100} />
            <ZIndexTile varName="--ig-z-modal" value={1200} />
            <ZIndexTile varName="--ig-z-tooltip" value={9999} />
          </div>
        </StorybookCard>
      </StorybookSection>

      <StorybookSection title="Radius" description="Border radius scale.">
        <StorybookGrid columns="repeat(auto-fit, minmax(180px, 1fr))">
          <RadiusTile varName="--ig-radius-2xs" label="2xs" />
          <RadiusTile varName="--ig-radius-xxs" label="xxs" />
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
            <FontSizeTile varName="--ig-font-size-3xs" label="3xs" />
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
