import type { Meta, StoryObj } from '@storybook/react-vite'
import styled from 'styled-components'
import { StorybookPage, StorybookSection } from '@storybook-support/storybook-layout'
import { Stack } from '../layout/flex'
import { Heading } from './heading'
import { Text } from './text'
import { B1, B2, B3, C1, H1, H2, H3, H4, L1 } from './type-scale'

const meta = {
  title: 'Primitives/Typography',
  tags: ['autodocs'],
  component: Text,
  parameters: { layout: 'fullscreen', a11y: { test: 'error' } },
} satisfies Meta<typeof Text>

export default meta
type Story = StoryObj<typeof meta>

const Row = styled.div`
  display: grid;
  grid-template-columns: var(--ig-popup-3xs) minmax(0, 1fr);
  gap: var(--ig-space-4);
  align-items: baseline;
  padding: var(--ig-space-3) 0;
  border-bottom: var(--ig-border-1px) solid var(--ig-color-border-subtle);

  @media (max-width: 480px) {
    grid-template-columns: 1fr;
    gap: var(--ig-space-2);
  }
`

const Tag = styled.code`
  color: var(--ig-color-text-muted);
  font-family: var(--ig-font-mono);
  font-size: var(--ig-font-size-xs);
  font-weight: var(--ig-font-weight-bold);
`

export const TypeScale: Story = {
  render: () => (
    <StorybookPage title="Typography primitives" description="Use semantic heading levels for document structure. Use H1–H4 and B1–L1 named exports when their contract fits; use Heading or Text directly for an explicit variant.">
      <StorybookSection title="Type scale" description="Samples use Korean, English, and numbers so wrapping and rhythm can be reviewed in realistic product copy.">
        <Stack gap={0}>
          <Row><Tag>H1</Tag><H1>검사 결과와 Production Quality Review</H1></Row>
          <Row><Tag>H2</Tag><H2>이미지 검사 프로젝트 개요</H2></Row>
          <Row><Tag>H3</Tag><H3>Line A · Surface Inspection 2026-08</H3></Row>
          <Row><Tag>H4</Tag><H4>Deflectometry calibration settings</H4></Row>
          <Row><Tag>B1</Tag><B1>검사 기준을 확인하고 다음 작업자에게 필요한 맥락을 전달합니다.</B1></Row>
          <Row><Tag>B2</Tag><B2>Default body copy for cards, dialogs, and standard product descriptions.</B2></Row>
          <Row><Tag>B3</Tag><B3>Dense secondary text · 128 images · updated 09:41</B3></Row>
          <Row><Tag>C1</Tag><C1>캡션, timestamp, helper text, and compact table metadata.</C1></Row>
          <Row><Tag>L1</Tag><L1>Inspection status</L1></Row>
        </Stack>
      </StorybookSection>
    </StorybookPage>
  ),
}

export const TextContract: Story = {
  name: 'Text contract',
  render: () => (
    <StorybookPage title="Text contract" description="Text owns tone, weight aliases, semantic element choice, mono figures, alignment, and letter spacing. Do not reproduce these rules with ad-hoc styled text.">
      <StorybookSection title="Tone matrix" description="All public tones are visible together for contrast review.">
        <Stack gap="var(--ig-space-3)">
          {(['default', 'secondary', 'muted', 'soft', 'accent', 'success', 'warning', 'danger'] as const).map((tone) => <Row key={tone}><Tag>{tone}</Tag><Text tone={tone}>검사 상태와 supporting copy를 위한 {tone} tone sample.</Text></Row>)}
        </Stack>
      </StorybookSection>
      <StorybookSection title="Variants" description="These variants cover common API decisions that are not apparent from the base type scale.">
        <Stack gap="var(--ig-space-4)">
          <Text as="p" weight="semibold">Semantic paragraph with a semantic weight alias</Text>
          <Text uppercase letterSpacing="wider" weight="bold" tone="muted">uppercase wider label</Text>
          <Text fontFamily="mono" tabularNums>build-2026.08.24 · 09:41:03 · 1,248 images</Text>
          <Text align="right" tone="secondary">Right-aligned table summary</Text>
          <Heading level={3}>Direct Heading level 3</Heading>
        </Stack>
      </StorybookSection>
    </StorybookPage>
  ),
}
