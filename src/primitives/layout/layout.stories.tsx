import type { Meta, StoryObj } from '@storybook/react-vite'
import styled from 'styled-components'
import { Box } from './box'
import { Container, Grid, Inline, Stack } from './flex'

const meta = {
  title: 'Primitives/Layout',
  parameters: {
    layout: 'fullscreen',
    a11y: { test: 'error' },
  },
} satisfies Meta

export default meta

type Story = StoryObj<typeof meta>

const Page = styled.div`
  padding: var(--ig-space-8);
  background: var(--ig-color-bg-canvas);
`

const DemoBlock = styled.div`
  min-height: 56px;
  border-radius: var(--ig-radius-md);
  border: 1px solid var(--ig-color-border-subtle);
  background: var(--ig-color-surface-raised);
  color: var(--ig-color-text-secondary);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: var(--ig-font-size-sm);
  font-weight: 600;
`

const Section = styled.section`
  display: flex;
  flex-direction: column;
  gap: var(--ig-space-4);
`

const Title = styled.h3`
  margin: 0;
  color: var(--ig-color-text-primary);
  font-size: var(--ig-font-size-lg);
`

const Description = styled.p`
  margin: 0;
  color: var(--ig-color-text-secondary);
  font-size: var(--ig-font-size-sm);
`

export const Review: Story = {
  render: () => (
    <Page>
      <Stack gap={32}>
        <Section>
          <Stack gap={8}>
            <Title>Box</Title>
            <Description>Single primitive for padding, width, height, and flex-like alignment props.</Description>
          </Stack>
          <Box
            display="flex"
            gap={12}
            padding={16}
            align="center"
            justify="space-between"
            style={{
              borderRadius: 'var(--ig-radius-xl)',
              border: '1px solid var(--ig-color-border-subtle)',
              background: 'var(--ig-color-surface-panel)',
            }}
          >
            <DemoBlock>Leading</DemoBlock>
            <DemoBlock>Center</DemoBlock>
            <DemoBlock>Trailing</DemoBlock>
          </Box>
        </Section>

        <Section>
          <Stack gap={8}>
            <Title>Stack and Inline</Title>
            <Description>Vertical and horizontal flow helpers for most composition work.</Description>
          </Stack>
          <Grid minItemWidth={320} gap={16}>
            <Box
              padding={16}
              style={{
                borderRadius: 'var(--ig-radius-xl)',
                border: '1px solid var(--ig-color-border-subtle)',
                background: 'var(--ig-color-surface-panel)',
              }}
            >
              <Stack gap={12}>
                <DemoBlock>First row</DemoBlock>
                <DemoBlock>Second row</DemoBlock>
                <DemoBlock>Third row</DemoBlock>
              </Stack>
            </Box>
            <Box
              padding={16}
              style={{
                borderRadius: 'var(--ig-radius-xl)',
                border: '1px solid var(--ig-color-border-subtle)',
                background: 'var(--ig-color-surface-panel)',
              }}
            >
              <Inline gap={12}>
                <DemoBlock>Filter</DemoBlock>
                <DemoBlock>Sort</DemoBlock>
                <DemoBlock>Share</DemoBlock>
                <DemoBlock>Export</DemoBlock>
              </Inline>
            </Box>
          </Grid>
        </Section>

        <Section>
          <Stack gap={8}>
            <Title>Grid and Container</Title>
            <Description>Responsive structure primitives for shell and dashboard-level composition.</Description>
          </Stack>
          <Container maxWidth={960} padding={0}>
            <Grid minItemWidth={180} gap={12}>
              <DemoBlock>Panel A</DemoBlock>
              <DemoBlock>Panel B</DemoBlock>
              <DemoBlock>Panel C</DemoBlock>
              <DemoBlock>Panel D</DemoBlock>
            </Grid>
          </Container>
        </Section>
      </Stack>
    </Page>
  ),
}
