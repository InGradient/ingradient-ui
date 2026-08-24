import type { Meta, StoryObj } from '@storybook/react-vite'
import styled from 'styled-components'
import { StorybookCard, StorybookGrid, StorybookPage, StorybookSection } from '@storybook-support/storybook-layout'
import { Box } from './box'
import { Container, Grid, Inline, Stack } from './flex'

const meta = {
  title: 'Primitives/Layout',
  tags: ['autodocs'],
  parameters: { layout: 'fullscreen', a11y: { test: 'error' } },
} satisfies Meta

export default meta
type Story = StoryObj<typeof meta>

const DemoBlock = styled.div`
  display: grid;
  min-height: var(--ig-control-height-2xl);
  place-items: center;
  padding: var(--ig-space-4);
  border: var(--ig-border-1px) solid var(--ig-color-border-subtle);
  border-radius: var(--ig-radius-md);
  background: var(--ig-color-surface-raised);
  color: var(--ig-color-text-secondary);
  font-size: var(--ig-font-size-sm);
  font-weight: var(--ig-font-weight-semibold);
`

export const Overview: Story = {
  render: () => (
    <StorybookPage title="Layout primitives" description="Use these primitives for generic composition: Box for a bounded layout need, Stack for vertical rhythm, Inline for horizontal flow, Grid for responsive collections, and Container for a page-width boundary.">
      <StorybookGrid columns="repeat(auto-fit, minmax(240px, 1fr))">
        <StorybookCard title="Box" subtitle="One-off display, padding, and dimension contract"><Box display="flex" gap="var(--ig-space-3)" padding="var(--ig-space-4)" justify="space-between" style={{ borderRadius: 'var(--ig-radius-lg)', background: 'var(--ig-color-surface-panel)' }}><DemoBlock>Leading</DemoBlock><DemoBlock>Trailing</DemoBlock></Box></StorybookCard>
        <StorybookCard title="Stack" subtitle="Vertical rhythm"><Stack gap="var(--ig-space-3)"><DemoBlock>First</DemoBlock><DemoBlock>Second</DemoBlock><DemoBlock>Third</DemoBlock></Stack></StorybookCard>
        <StorybookCard title="Inline" subtitle="Horizontal flow with deliberate wrapping"><Inline gap="var(--ig-space-3)"><DemoBlock>Filter</DemoBlock><DemoBlock>Sort</DemoBlock><DemoBlock>Share</DemoBlock></Inline></StorybookCard>
        <StorybookCard title="Grid" subtitle="Responsive equal-width collection"><Grid minItemWidth={160} gap="var(--ig-space-3)"><DemoBlock>A</DemoBlock><DemoBlock>B</DemoBlock><DemoBlock>C</DemoBlock><DemoBlock>D</DemoBlock></Grid></StorybookCard>
      </StorybookGrid>
    </StorybookPage>
  ),
}

export const WrappingAndBounds: Story = {
  name: 'Wrapping and bounds',
  parameters: { viewport: { defaultViewport: 'mobile' } },
  render: () => (
    <StorybookPage title="Wrapping and bounds" description="Review this story at narrow widths. Inline wraps by default; use the nowrap setting only when the composition can safely remain on one line.">
      <StorybookSection title="Inline wrapping" description="Long labels remain visible instead of forcing horizontal overflow."><Inline gap="var(--ig-space-3)"><DemoBlock>Dataset filter</DemoBlock><DemoBlock>Longer sort control</DemoBlock><DemoBlock>Export selection</DemoBlock></Inline></StorybookSection>
      <StorybookSection title="Container and Grid" description="Container owns the outer width while Grid owns responsive item placement."><Container maxWidth={720} padding="var(--ig-space-4)"><Grid minItemWidth={140} gap="var(--ig-space-3)"><DemoBlock>Panel A</DemoBlock><DemoBlock>Panel B</DemoBlock><DemoBlock>Panel C</DemoBlock></Grid></Container></StorybookSection>
    </StorybookPage>
  ),
}
