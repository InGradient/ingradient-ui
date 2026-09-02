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

export const LongContentAndEmpty: Story = {
  name: 'Long content and empty state',
  parameters: { viewport: { defaultViewport: 'mobile' } },
  render: () => (
    <StorybookPage title="Long content and empty state" description="Use a bounded Container and responsive Grid for real content. An empty state stays centered without requiring a page-specific layout primitive.">
      <StorybookSection title="Long content in a responsive collection" description="Titles and supporting copy wrap within their own cards instead of widening the page.">
        <Container maxWidth={720} padding="var(--ig-space-4)">
          <Grid minItemWidth={160} gap="var(--ig-space-3)">
            {[
              ['Deflectometry calibration results', '검사 기준과 함께 다음 작업자에게 전달할 상세 측정 결과입니다.'],
              ['Production quality review queue', 'Long English metadata remains inside the card at a narrow viewport.'],
              ['128 images awaiting annotation', '이미지 수, 시간, 장비 이름처럼 길이가 다른 정보도 읽기 쉽게 유지합니다.'],
            ].map(([title, description]) => <Box key={title} padding="var(--ig-space-4)" style={{ border: 'var(--ig-border-1px) solid var(--ig-color-border-subtle)', borderRadius: 'var(--ig-radius-lg)', background: 'var(--ig-color-surface-raised)' }}><Stack gap="var(--ig-space-3)"><strong>{title}</strong><span style={{ color: 'var(--ig-color-text-secondary)', fontSize: 'var(--ig-font-size-sm)' }}>{description}</span></Stack></Box>)}
          </Grid>
        </Container>
      </StorybookSection>
      <StorybookSection title="Empty composition" description="The same generic primitives can center a calm empty state without embedding product behavior into Layout.">
        <Box display="flex" direction="column" align="center" justify="center" gap="var(--ig-space-3)" padding="var(--ig-space-7)" style={{ minHeight: 'var(--ig-layout-sidebar-header)', border: 'var(--ig-border-1px) dashed var(--ig-color-border-subtle)', borderRadius: 'var(--ig-radius-xl)', textAlign: 'center' }}>
          <strong>No datasets to review</strong>
          <span style={{ color: 'var(--ig-color-text-secondary)', fontSize: 'var(--ig-font-size-sm)' }}>Try changing the active project or upload a new dataset.</span>
        </Box>
      </StorybookSection>
    </StorybookPage>
  ),
}
