import type { Meta, StoryObj } from '@storybook/react-vite'
import { CodeBlock } from './code-block'
import { StorybookCard, StorybookGrid, StorybookPage, StorybookSection } from '@storybook-support/storybook-layout'

const meta = {
  title: 'Components/Data Display/CodeBlock',
  component: CodeBlock,
  tags: ['autodocs'],
  parameters: {
    a11y: { test: 'error' },
  },
} satisfies Meta<typeof CodeBlock>

export default meta

type Story = StoryObj<typeof meta>

const MULTILINE = `train:
  batch_size: 32
  epochs: 100
  lr: 0.001`

export const Review: Story = {
  args: { children: 'a1b2c3d4e5f6' },
  render: () => (
    <StorybookPage
      title="CodeBlock"
      description="monospace 읽기 전용 텍스트 박스. fingerprint·파일 경로·토큰 등 사용자가 선택-복사하는 식별자를 담는다. user-select: all 로 클릭 시 전체 선택되고, word-break 로 긴 값은 줄바꿈된다."
    >
      <StorybookSection title="상태" description="짧은 식별자 / 긴 토큰 줄바꿈 / 여러 줄 스니펫.">
        <StorybookGrid columns="repeat(auto-fit, minmax(var(--ig-popup-xs), 1fr))">
          <StorybookCard title="default" subtitle="짧은 fingerprint">
            <CodeBlock>a1b2c3d4e5f6</CodeBlock>
          </StorybookCard>
          <StorybookCard title="long" subtitle="긴 토큰 break-all 줄바꿈">
            <CodeBlock>sk-proj-9f8e7d6c5b4a39281706f5e4d3c2b1a0998877665544332211</CodeBlock>
          </StorybookCard>
          <StorybookCard title="path" subtitle="파일 경로">
            <CodeBlock>/datasets/2026/train/images/batch-001/img_0001.png</CodeBlock>
          </StorybookCard>
          <StorybookCard title="multiline" subtitle="여러 줄 스니펫 (whiteSpace pre)">
            <CodeBlock style={{ whiteSpace: 'pre' }}>{MULTILINE}</CodeBlock>
          </StorybookCard>
        </StorybookGrid>
      </StorybookSection>
    </StorybookPage>
  ),
}
