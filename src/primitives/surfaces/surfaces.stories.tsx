import type { Meta, StoryObj } from '@storybook/react-vite'
import { Camera, Info } from 'lucide-react'
import { StorybookCard, StorybookGrid, StorybookPage, StorybookSection } from '@storybook-support/storybook-layout'
import { Inline, Stack } from '../layout/flex'
import { Divider, Icon, ScrollArea } from './misc'
import { Surface } from './surface'

const meta = {
  title: 'Primitives/Surfaces',
  tags: ['autodocs'],
  component: Surface,
  parameters: { layout: 'fullscreen', a11y: { test: 'error' } },
} satisfies Meta<typeof Surface>

export default meta
type Story = StoryObj<typeof meta>

function SurfaceExample({ elevation, title, description }: { elevation: 'panel' | 'raised' | 'card'; title: string; description: string }) {
  return <Surface elevation={elevation} radius="var(--ig-radius-xl)" style={{ padding: 'var(--ig-space-6)', minHeight: 'var(--ig-layout-sidebar-header)' }}><Stack gap="var(--ig-space-3)"><strong>{title}</strong><span style={{ color: 'var(--ig-color-text-secondary)', fontSize: 'var(--ig-font-size-sm)' }}>{description}</span></Stack></Surface>
}

export const Elevations: Story = {
  render: () => (
    <StorybookPage title="Surface primitives" description="Surface owns a generic elevation and radius treatment. Keep product-specific borders, shadows, and interaction states outside this primitive.">
      <StorybookSection title="Elevation comparison" description="Choose the lowest elevation that preserves hierarchy in the surrounding composition.">
        <StorybookGrid columns="repeat(auto-fit, minmax(220px, 1fr))">
          <StorybookCard title="Panel" subtitle="Page sections and sidebars"><SurfaceExample elevation="panel" title="Neutral shell" description="Baseline container for grouped content." /></StorybookCard>
          <StorybookCard title="Raised" subtitle="Emphasized cards and control groups"><SurfaceExample elevation="raised" title="Higher emphasis" description="Use when the content should lift above the panel." /></StorybookCard>
          <StorybookCard title="Card" subtitle="Dense, bordered content"><SurfaceExample elevation="card" title="Bounded card" description="Use for compact bundles of related information." /></StorybookCard>
        </StorybookGrid>
      </StorybookSection>
    </StorybookPage>
  ),
}

export const MiscPrimitives: Story = {
  render: () => (
    <StorybookPage title="Surface helpers" description="Divider, Icon, and ScrollArea are small composition helpers with independent contracts.">
      <StorybookSection title="Icon and divider" description="Icon standardizes icon-box sizing; Divider separates adjacent content without creating a new visual surface.">
        <Stack gap="var(--ig-space-4)"><Inline gap="var(--ig-space-3)" align="center"><Icon size={18}><Camera /></Icon><strong>Camera stream configuration</strong></Inline><Divider /><span style={{ color: 'var(--ig-color-text-secondary)' }}>Use a divider only when adjacent blocks need explicit separation.</span></Stack>
      </StorybookSection>
      <StorybookSection title="ScrollArea overflow" description="The content deliberately exceeds the viewport so scrolling can be reviewed independently.">
        <ScrollArea style={{ maxHeight: 180, paddingRight: 'var(--ig-space-2)' }}>
          <Stack gap={0}>{['Dataset summary and review notes', 'Annotation sync status', 'Upload queue details', 'Quality checks and validation hints', 'Secondary metadata fields', 'Long overflow content for scroll behavior'].map((item) => <div key={item} style={{ padding: 'var(--ig-space-3) 0', borderBottom: 'var(--ig-border-1px) solid var(--ig-color-border-subtle)' }}><Inline gap="var(--ig-space-3)" align="center"><Icon size={16}><Info /></Icon><span>{item}</span></Inline></div>)}</Stack>
        </ScrollArea>
      </StorybookSection>
    </StorybookPage>
  ),
}

export const BoundaryStates: Story = {
  name: 'Long and empty states',
  parameters: { viewport: { defaultViewport: 'mobile' } },
  render: () => (
    <StorybookPage title="Surface boundary states" description="Review how a generic surface behaves with no content and with long, keyboard-scrollable content at narrow widths.">
      <StorybookSection title="Empty surface" description="An empty state can remain quiet and centered without adding product-specific behavior to Surface.">
        <Surface elevation="card" radius="var(--ig-radius-xl)" style={{ minHeight: 'var(--ig-layout-sidebar-header)', padding: 'var(--ig-space-7)', textAlign: 'center' }}>
          <Stack gap="var(--ig-space-3)" align="center" justify="center"><strong>No saved connection profiles</strong><span style={{ color: 'var(--ig-color-text-secondary)', fontSize: 'var(--ig-font-size-sm)' }}>Create a profile to reuse this instrument configuration.</span></Stack>
        </Surface>
      </StorybookSection>
      <StorybookSection title="Long scroll rows" description="The focusable ScrollArea keeps long metadata reachable by mouse, trackpad, and keyboard.">
        <ScrollArea role="region" aria-label="Long dataset notes" style={{ maxHeight: 180, paddingRight: 'var(--ig-space-2)' }}>
          <Stack gap={0}>{[
            'Calibration note: the 2026-08-24 production run requires a final sensor alignment review before export.',
            'Operator handoff: compare the remaining 128 images with the baseline set from the previous validated batch.',
            'Quality summary: threshold warnings are expected for the current material, but failed measurements require escalation.',
            'Storage reminder: retain the original camera captures and the normalized output for the approved audit period.',
          ].map((item) => <div key={item} style={{ padding: 'var(--ig-space-4) 0', borderBottom: 'var(--ig-border-1px) solid var(--ig-color-border-subtle)' }}><Inline gap="var(--ig-space-3)" align="flex-start"><Icon size={16}><Info /></Icon><span style={{ color: 'var(--ig-color-text-secondary)', fontSize: 'var(--ig-font-size-sm)' }}>{item}</span></Inline></div>)}</Stack>
        </ScrollArea>
      </StorybookSection>
    </StorybookPage>
  ),
}
