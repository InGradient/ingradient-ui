import type { Meta, StoryObj } from '@storybook/react-vite'
import styled from 'styled-components'
import { Stack } from '../layout/flex'
import { Heading } from './heading'
import { Text } from './text'
import { H1, H2, H3, H4, B1, B2, B3, C1, L1 } from './type-scale'

const meta = {
  title: 'Primitives/Typography',
  tags: ['autodocs'],
  parameters: {
    layout: 'fullscreen',
    a11y: { test: 'error' },
    docs: {
      description: {
        component: `
**Type scale primitives** — design system 의 의미적 텍스트 스타일 묶음.

| 토큰 | 출처 | font-size | weight | 권장 용도 |
|---|---|---|---|---|
| **H1** | Heading level=1 | \`5xl\` (28px) | 800 | Page hero title |
| **H2** | Heading level=2 | \`4xl\` (24px) | 700 | Section title |
| **H3** | Heading level=3 | \`2xl\` (18px) | 600 | Subsection title |
| **H4** | Heading level=4 | \`xl\` (16px) | 600 | Block title, dialog title |
| **B1** | Text | \`lg\` (15px) | 400 | Body large — emphasis body |
| **B2** | Text | \`md\` (14px) | 400 | Body medium — default body |
| **B3** | Text | \`sm\` (13px) | 400 | Body small — dense table, secondary |
| **C1** | Text + muted | \`xs\` (12px) | 400 | Caption — meta, footnote |
| **L1** | Text + uppercase | \`xs\` (12px) | 600 + 0.06em | Label — uppercase chip-like |

- \`H1~H4\` 는 의미적 \`h1~h4\` element 로 렌더 (a11y).
- \`B1/B2/B3\`, \`C1\`, \`L1\` 은 \`span\` 기본 — \`as\` prop 으로 다른 태그.
- 자유로운 size/weight 가 필요하면 underlying \`<Heading>\` / \`<Text>\` 직접 사용.
- 더 작은 텍스트 (10px, 11px) 는 \`<Text size="var(--ig-font-size-3xs)" />\` 또는 \`2xs\` 토큰 직접 사용 (mobile small label, icon-sized chip 등).
        `,
      },
    },
  },
} satisfies Meta

export default meta

type Story = StoryObj<typeof meta>

const Page = styled.div`
  padding: var(--ig-space-8);
  background: var(--ig-color-bg-canvas);
`

const Card = styled.div`
  padding: var(--ig-space-6);
  border-radius: var(--ig-radius-xl);
  border: 1px solid var(--ig-color-border-subtle);
  background: var(--ig-color-surface-panel);
`

const Row = styled.div`
  display: grid;
  grid-template-columns: 80px minmax(0, 1fr);
  gap: var(--ig-space-4);
  align-items: baseline;
`

const Tag = styled.span`
  color: var(--ig-color-text-muted);
  font-size: var(--ig-font-size-xs);
  font-weight: 700;
  letter-spacing: 0.06em;
`

/** Type scale 전체 한눈에. 가장 자주 보는 review 페이지. */
export const TypeScale: Story = {
  render: () => (
    <Page>
      <Stack gap={24}>
        <Card>
          <Stack gap={12}>
            <Heading level={2}>Type scale</Heading>
            <Text tone="secondary" as="p">
              H1~H4 / B1~B3 / C1 / L1 토큰의 시각 비교. 각 row 좌측의 태그는 named export 이름.
            </Text>
          </Stack>
        </Card>

        <Card>
          <Stack gap={14}>
            <Row><Tag>H1</Tag><H1>Page hero title</H1></Row>
            <Row><Tag>H2</Tag><H2>Section title</H2></Row>
            <Row><Tag>H3</Tag><H3>Subsection title</H3></Row>
            <Row><Tag>H4</Tag><H4>Block / dialog title</H4></Row>
            <Row><Tag>B1</Tag><B1>Body large — emphasis or lead paragraph.</B1></Row>
            <Row><Tag>B2</Tag><B2>Body medium — default reading copy for cards and dialogs.</B2></Row>
            <Row><Tag>B3</Tag><B3>Body small — dense table cells, secondary text.</B3></Row>
            <Row><Tag>C1</Tag><C1>Caption — meta information, timestamps, footnotes.</C1></Row>
            <Row><Tag>L1</Tag><L1>Section label</L1></Row>
          </Stack>
        </Card>
      </Stack>
    </Page>
  ),
}

/** Text 의 자유 props (tone, mono, uppercase 등). Type scale 로 안 잡히는 경우 사용. */
export const TextVariants: Story = {
  render: () => (
    <Page>
      <Card>
        <Stack gap={14}>
          <Heading level={3}>Free-form Text props</Heading>
          <Text tone="secondary" as="p">
            Type scale 으로 잡히지 않는 케이스 — 자유로운 size/weight/tone 이 필요한 경우 underlying <code>Text</code> 직접 사용.
          </Text>
          <Stack gap={10}>
            <Row><Tag>default</Tag><Text>Primary body copy for tables, cards, and dialogs.</Text></Row>
            <Row><Tag>secondary</Tag><Text tone="secondary">Supporting copy for descriptions and secondary metadata.</Text></Row>
            <Row><Tag>muted</Tag><Text tone="muted">Muted labels for helper text and chrome.</Text></Row>
            <Row><Tag>accent</Tag><Text tone="accent" weight={600}>Accent text for emphasis without elevating to a badge or button.</Text></Row>
            <Row><Tag>mono</Tag><Text fontFamily="mono" tabularNums>build-2026.05.27  09:41:03</Text></Row>
          </Stack>
        </Stack>
      </Card>
    </Page>
  ),
}
