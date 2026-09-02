import type { Meta, StoryObj } from '@storybook/react-vite'
import { expect } from 'storybook/test'
import { aspectRatios, borderWidthScale, chartColors, chartHeights, controlSizes, effectsScale, foundationColors, iconSizes, layoutScale, motionScale, opacityScale, popupSizes, radiusScale, spacingScale, transformScale, typographyScale, zIndexScale } from '../../src/tokens'
import { StorybookCard, StorybookGrid, StorybookMetaBar, StorybookPage, StorybookSection, StorybookStack } from '@storybook-support/storybook-layout'
import { ColorTokenCard, TokenExplorer, TokenTable, type TokenEntry, type TokenSearchEntry } from './token-overview/token-showcase'

const meta = {
  title: 'Foundations/Token Overview',
  tags: ['autodocs'],
  parameters: {
    layout: 'fullscreen',
    a11y: { test: 'error' },
    handoff: { service: 'platform', version: '0.0.1' },
  },
} satisfies Meta

export default meta
type Story = StoryObj<typeof meta>

const semanticColors: TokenEntry[] = [
  { name: 'Canvas', value: 'theme dependent', cssVar: '--ig-color-bg-canvas', usage: 'Application background' },
  { name: 'Panel', value: 'theme dependent', cssVar: '--ig-color-surface-panel', usage: 'Section and page panels' },
  { name: 'Raised', value: 'theme dependent', cssVar: '--ig-color-surface-raised', usage: 'Cards above a panel' },
  { name: 'Primary text', value: 'theme dependent', cssVar: '--ig-color-text-primary', usage: 'Default readable text' },
  { name: 'Muted text', value: 'theme dependent', cssVar: '--ig-color-text-muted', usage: 'Secondary metadata' },
  { name: 'Accent', value: 'theme dependent', cssVar: '--ig-color-accent', usage: 'Primary action and selection' },
  { name: 'Focus ring', value: 'theme dependent', cssVar: '--ig-color-accent-ring', usage: 'Keyboard focus outline' },
  { name: 'Danger alert', value: 'theme dependent', cssVar: '--ig-color-alert-danger-bg', usage: 'Error surface background' },
]

const typographyEntries: TokenEntry[] = [
  { name: 'Sans family', value: typographyScale.fontSans, cssVar: '--ig-font-sans', usage: 'Default UI text' },
  { name: 'Mono family', value: typographyScale.fontMono, cssVar: '--ig-font-mono', usage: 'Code and numerical readouts' },
  { name: 'Body size', value: typographyScale.sizeMd, cssVar: '--ig-font-size-md', usage: 'Default text primitive size' },
  { name: 'Heading size', value: typographyScale.size2xl, cssVar: '--ig-font-size-2xl', usage: 'Heading level 3 scale' },
  { name: 'Semibold', value: typographyScale.weightSemibold, cssVar: '--ig-font-weight-semibold', usage: 'Emphasized labels' },
  { name: 'Base line height', value: typographyScale.lineHeightBase, cssVar: '--ig-line-height-base', usage: 'Text primitive default' },
]

const spacingEntries: TokenEntry[] = Object.entries(spacingScale)
  .filter(([name]) => /^\d+$/.test(name))
  .map(([name, value]) => ({ name: `space.${name}`, value, cssVar: `--ig-space-${name}`, usage: 'Layout gap and padding' }))

const shapeEntries: TokenEntry[] = [
  ...Object.entries(radiusScale).map(([name, value]) => ({ name: `radius.${name}`, value, cssVar: `--ig-radius-${name}`, usage: 'Corner radius' })),
  ...Object.entries(borderWidthScale).map(([name, value]) => ({ name: `border.${name}`, value, kind: 'ts' as const, usage: 'Border-width constant' })),
]

const globalLayoutEntries: TokenEntry[] = [
  'pageMaxWidth', 'topbarHeight', 'sidebarHeader', 'sidebarCollapse', 'panelMinHeight', 'loadingPanelHeight', 'shadowYOffset', 'shadowBlur', 'formLabelCol', 'formLabelColWide',
].map((name) => ({ name, value: layoutScale[name as keyof typeof layoutScale], kind: 'ts' as const, usage: 'Global shell or shared form geometry' }))

const edgeGeometryEntries: TokenEntry[] = [
  'captureBar', 'captureGrid', 'histogramWidth', 'histogramHeight', 'datasetCardMinHeight', 'datasetCardRecentMinHeight', 'logTimeMin', 'logDetailLeft', 'logDetailTop', 'logDetailWidth',
].map((name) => ({ name, value: layoutScale[name as keyof typeof layoutScale], kind: 'ts' as const, usage: 'Edge feature geometry — migration planned' }))

const patternGeometryEntries: TokenEntry[] = ['colorPlaneHeight', 'colorThumbSize']
  .map((name) => ({ name, value: layoutScale[name as keyof typeof layoutScale], kind: 'ts' as const, usage: 'Shared pattern geometry — ownership under review' }))

const scaleEntries: TokenEntry[] = [
  ...Object.entries(controlSizes).map(([name, value]) => ({ name: `control.${name}`, value, kind: 'ts' as const, usage: 'Control height const' })),
  ...Object.entries(iconSizes).map(([name, value]) => ({ name: `icon.${name}`, value, kind: 'ts' as const, usage: 'SVG / JSX numeric size' })),
  ...Object.entries(popupSizes).map(([name, value]) => ({ name: `popup.${name}`, value, kind: 'ts' as const, usage: 'Popup width const' })),
]

const effectEntries: TokenEntry[] = [
  ...Object.entries(motionScale).map(([name, value]) => ({ name: `motion.${name}`, value, kind: 'ts' as const, usage: 'Motion duration/easing' })),
  ...Object.entries(effectsScale).map(([name, value]) => ({ name, value, kind: 'ts' as const, usage: 'Backdrop blur' })),
  ...Object.entries(opacityScale).map(([name, value]) => ({ name: `opacity.${name}`, value, kind: 'ts' as const, usage: 'Opacity tier' })),
  ...Object.entries(zIndexScale).map(([name, value]) => ({ name: `z.${name}`, value, kind: 'ts' as const, usage: 'Layer order' })),
]

const visualizationEntries: TokenEntry[] = [
  ...Object.entries(chartHeights).map(([name, value]) => ({ name: `chartHeight.${name}`, value, kind: 'ts' as const, usage: 'Chart component height' })),
  ...Object.entries(aspectRatios).map(([name, value]) => ({ name: `aspect.${name}`, value, kind: 'ts' as const, usage: 'Image/video aspect ratio' })),
  ...Object.entries(transformScale).map(([name, value]) => ({ name: `transform.${name}`, value, kind: 'ts' as const, usage: 'Press, drag, and hover scale' })),
]

const tokenSearchEntries: TokenSearchEntry[] = [
  ...semanticColors.map((entry) => ({ ...entry, category: 'Semantic color' })),
  ...typographyEntries.map((entry) => ({ ...entry, category: 'Typography' })),
  ...spacingEntries.map((entry) => ({ ...entry, category: 'Spacing' })),
  ...shapeEntries.map((entry) => ({ ...entry, category: 'Shape' })),
  ...scaleEntries.map((entry) => ({ ...entry, category: 'Component scales' })),
  ...globalLayoutEntries.map((entry) => ({ ...entry, category: 'Global layout' })),
  ...edgeGeometryEntries.map((entry) => ({ ...entry, category: 'Edge feature geometry' })),
  ...patternGeometryEntries.map((entry) => ({ ...entry, category: 'Pattern geometry' })),
  ...effectEntries.map((entry) => ({ ...entry, category: 'Effects and layers' })),
  ...visualizationEntries.map((entry) => ({ ...entry, category: 'Visualization' })),
  ...Object.entries(chartColors).map(([name, value]) => ({ name: `chart.${name}`, value, kind: 'ts' as const, usage: 'Chart SVG and Recharts palette', category: 'Chart palette' })),
  ...Object.entries(foundationColors).map(([name, value]) => ({ name: `foundation.${name}`, value, kind: 'ts' as const, usage: 'Raw foundation source', category: 'Raw foundation palette' })),
]

function SemanticPair({ label, background, border, text }: { label: string; background: string; border: string; text: string }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--ig-space-2)', padding: 'var(--ig-space-5)', border: `var(--ig-border-1px) solid var(${border})`, borderRadius: 'var(--ig-radius-md)', background: `var(${background})`, color: `var(${text})` }}>
      <strong>{label}</strong>
      <span style={{ fontSize: 'var(--ig-font-size-xs)' }}>Background, border, and text are reviewed as one semantic contract.</span>
    </div>
  )
}

function TokenOverview({ globals }: { globals: Record<string, unknown> }) {
  const mode = globals.mode ?? 'inherit'
  const density = globals.density ?? 'inherit'

  return (
    <StorybookPage
      title="Token system"
      description="The canonical inspection surface for source tokens and their resolved CSS values. Use the Storybook toolbar to review mode and density; product feature geometry is deliberately separated from global foundations."
      meta={<StorybookMetaBar items={[{ label: 'Canonical overview', tone: 'accent' }, { label: `Mode: ${mode}` }, { label: `Density: ${density}` }]} />}
    >
      <StorybookSection title="How to read this page" description="CSS entries show the current value resolved on the document root. TS entries are intended for numeric JSX/SVG or JS-only APIs; do not treat their source values as mode-dependent CSS values.">
        <StorybookGrid columns="repeat(auto-fit, minmax(220px, 1fr))">
          <StorybookCard title="Semantic first" subtitle="Product UI should prefer semantic aliases."><span>Start with surface, text, state, and focus tokens. Use raw foundation colors only when defining a semantic contract.</span></StorybookCard>
          <StorybookCard title="CSS vs TS" subtitle="The badge declares the intended consumption path."><span>Use CSS variables in styles; use TS constants for numeric props and SVG/Recharts attributes.</span></StorybookCard>
          <StorybookCard title="Mode-aware review" subtitle="Resolved values update with the toolbar."><span>Check contrast and state combinations in both light and dark before approving a token change.</span></StorybookCard>
        </StorybookGrid>
      </StorybookSection>

      <StorybookSection title="Find a token" description="Search the full token registry by name, CSS variable, current value, or intended usage. Select a category to browse a focused list.">
        <TokenExplorer entries={tokenSearchEntries} />
      </StorybookSection>

      <StorybookSection title="Resolved semantic color" description="These are the application-facing color contracts. The swatch and value react to the active Storybook mode.">
        <StorybookGrid columns="repeat(auto-fit, minmax(180px, 1fr))">
          {semanticColors.map((entry) => <StorybookCard key={entry.name} title={entry.name}><ColorTokenCard entry={entry} includeName={false} /></StorybookCard>)}
        </StorybookGrid>
        <div style={{ marginTop: 'var(--ig-space-7)' }}><StorybookGrid columns="repeat(auto-fit, minmax(220px, 1fr))">
          <SemanticPair label="Success status" background="--ig-color-status-running-bg" border="--ig-color-alert-success-border" text="--ig-color-status-running-text" />
          <SemanticPair label="Warning status" background="--ig-color-status-draft-bg" border="--ig-color-alert-warning-border" text="--ig-color-status-draft-text" />
          <SemanticPair label="Danger alert" background="--ig-color-alert-danger-bg" border="--ig-color-alert-danger-border" text="--ig-color-alert-danger-text" />
        </StorybookGrid></div>
      </StorybookSection>

      <StorybookGrid columns="repeat(auto-fit, minmax(320px, 1fr))">
        <div style={{ alignSelf: 'start' }}><StorybookSection title="Typography contract" description="Use semantic primitive aliases instead of copying individual CSS values into page styles."><TokenTable entries={typographyEntries} /></StorybookSection></div>
        <div style={{ alignSelf: 'start' }}><StorybookSection title="Spacing scale" description="The numbered spacing scale is the default for layout rhythm."><TokenTable entries={spacingEntries} /></StorybookSection></div>
      </StorybookGrid>

      <StorybookSection title="Inventory map" description="Keep the overview short. Use the dedicated inventory stories for complete scale-by-scale listings.">
        <StorybookGrid columns="repeat(auto-fit, minmax(220px, 1fr))">
          <StorybookCard title="Shape" subtitle={`${shapeEntries.length} radius and border entries`}><span>Review corner and border tiers in <strong>Scale inventory</strong>.</span></StorybookCard>
          <StorybookCard title="Component scales" subtitle={`${scaleEntries.length} control, icon, and popup entries`}><span>Use these only for component APIs and numeric geometry.</span></StorybookCard>
          <StorybookCard title="Effects and layers" subtitle={`${effectEntries.length} motion, blur, opacity, and layer entries`}><span>Review non-essential motion with reduced-motion enabled.</span></StorybookCard>
          <StorybookCard title="Layout ownership" subtitle={`${globalLayoutEntries.length} global · ${edgeGeometryEntries.length} Edge · ${patternGeometryEntries.length} pattern`}><span>Do not add new product geometry to core layout tokens.</span></StorybookCard>
        </StorybookGrid>
      </StorybookSection>
    </StorybookPage>
  )
}

export const Overview: Story = { render: (_, context) => <TokenOverview globals={context.globals as Record<string, unknown>} /> }
export const Narrow: Story = { name: 'Narrow review', parameters: { viewport: { defaultViewport: 'mobile' } }, render: (_, context) => <TokenOverview globals={context.globals as Record<string, unknown>} /> }

export const TokenDiscovery: Story = {
  name: 'Token discovery',
  render: () => <StorybookPage title="Find a token" description="Search and category filtering are available from the canonical overview as well as this focused interaction surface."><StorybookSection title="Token registry"><TokenExplorer entries={tokenSearchEntries} /></StorybookSection></StorybookPage>,
  play: async ({ canvas, userEvent }) => {
    const search = canvas.getByRole('searchbox', { name: 'Search token names, values, or usage' })
    await userEvent.type(search, '--ig-color-accent')
    await expect(canvas.getByText('--ig-color-accent')).toBeInTheDocument()
    await expect(canvas.getByRole('button', { name: 'Copy Accent identifier' })).toBeEnabled()
    await userEvent.click(canvas.getByRole('button', { name: 'Clear search' }))
    await userEvent.click(canvas.getByRole('button', { name: 'Spacing' }))
    await expect(canvas.getByText('space.0')).toBeInTheDocument()
    await userEvent.click(canvas.getByRole('button', { name: 'All categories' }))
    await expect(canvas.getByText('Search by name, CSS variable, value, or usage. Or select a category to browse its tokens.')).toBeInTheDocument()
  },
}

export const LayoutInventory: Story = {
  name: 'Layout inventory',
  render: () => (
    <StorybookPage title="Layout ownership inventory" description="Complete layout token listing grouped by ownership. Product geometry remains visible but is explicitly not a generic foundation contract.">
      <StorybookGrid columns="repeat(auto-fit, minmax(300px, 1fr))">
        <StorybookSection title="Global layout" description="Shared shell and form geometry"><TokenTable entries={globalLayoutEntries} /></StorybookSection>
        <StorybookSection title="Edge feature geometry" description="F-07 migration target"><TokenTable entries={edgeGeometryEntries} /></StorybookSection>
        <StorybookSection title="Pattern geometry" description="Ownership under review"><TokenTable entries={patternGeometryEntries} /></StorybookSection>
      </StorybookGrid>
    </StorybookPage>
  ),
}

export const ScaleInventory: Story = {
  name: 'Scale inventory',
  render: () => (
    <StorybookPage title="Scale inventory" description="Complete source inventory for shape, component sizing, effects, and JS-only visualization constants.">
      <StorybookGrid columns="repeat(auto-fit, minmax(320px, 1fr))">
        <StorybookSection title="Shape"><TokenTable entries={shapeEntries} /></StorybookSection>
        <StorybookSection title="Component scales"><TokenTable entries={scaleEntries} /></StorybookSection>
        <StorybookSection title="Effects and layers"><TokenTable entries={effectEntries} /></StorybookSection>
        <StorybookSection title="JS-only visualization constants"><StorybookStack gap={16}>
          <TokenTable entries={visualizationEntries.filter((entry) => entry.name.startsWith('chartHeight.'))} />
          <TokenTable entries={visualizationEntries.filter((entry) => entry.name.startsWith('aspect.'))} />
          <TokenTable entries={visualizationEntries.filter((entry) => entry.name.startsWith('transform.'))} />
        </StorybookStack></StorybookSection>
      </StorybookGrid>
    </StorybookPage>
  ),
}

export const RawFoundationPalette: Story = {
  name: 'Raw foundation palette',
  render: () => (
    <StorybookPage title="Raw foundation palette" description="Source-only dark-palette values. These are not the current theme result; product UI should consume semantic aliases from the canonical overview.">
      <StorybookGrid columns="repeat(auto-fit, minmax(180px, 1fr))">
        {Object.entries(foundationColors).map(([name, value]) => <StorybookCard key={name} title={name}><ColorTokenCard entry={{ name, value, kind: 'ts', usage: 'Raw foundation source' }} /></StorybookCard>)}
      </StorybookGrid>
      <StorybookSection title="Chart palette" description="JS-only colors for SVG and Recharts attributes.">
        <StorybookGrid columns="repeat(auto-fit, minmax(180px, 1fr))">
          {Object.entries(chartColors).map(([name, value]) => <StorybookCard key={name} title={name}><ColorTokenCard entry={{ name, value, kind: 'ts' }} /></StorybookCard>)}
        </StorybookGrid>
      </StorybookSection>
    </StorybookPage>
  ),
}
