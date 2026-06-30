import type { Meta, StoryObj } from '@storybook/react-vite'
import { KeyValueRow } from './key-value-row'
import { StorybookCard, StorybookGrid, StorybookPage, StorybookSection } from '@storybook-support/storybook-layout'

const meta = {
  title: 'Components/Data Display/KeyValueRow',
  component: KeyValueRow,
  tags: ['autodocs'],
  parameters: {
    a11y: { test: 'error' },
  },
} satisfies Meta<typeof KeyValueRow>

export default meta

type Story = StoryObj<typeof meta>

const BOX_STYLE = { width: '100%' }

export const Review: Story = {
  args: { label: 'Status', value: 'Active' },
  render: () => (
    <StorybookPage
      title="KeyValueRow"
      description="라벨(왼쪽)과 값(오른쪽)을 space-between 으로 양끝 정렬하는 한 줄 요약. 패널·툴팁의 메타데이터 목록에 사용. 여러 줄을 쌓으면 행 사이 간격이 자동 적용된다."
    >
      <StorybookSection title="기본" description="label/value 한 쌍.">
        <StorybookGrid columns="repeat(auto-fit, minmax(var(--ig-popup-xs), 1fr))">
          <StorybookCard title="default" subtitle="짧은 값">
            <div style={BOX_STYLE}><KeyValueRow label="Status" value="Active" /></div>
          </StorybookCard>
          <StorybookCard title="numeric" subtitle="숫자 값">
            <div style={BOX_STYLE}><KeyValueRow label="Images" value="1,248" /></div>
          </StorybookCard>
          <StorybookCard title="long value" subtitle="긴 값 양끝 정렬">
            <div style={BOX_STYLE}><KeyValueRow label="Path" value="/datasets/2026/train/images/batch-001" /></div>
          </StorybookCard>
        </StorybookGrid>
      </StorybookSection>
      <StorybookSection title="목록" description="여러 행을 쌓으면 행 사이 margin 이 자동 적용된다.">
        <StorybookGrid columns="repeat(auto-fit, minmax(var(--ig-popup-xs), 1fr))">
          <StorybookCard title="metadata" subtitle="패널 메타데이터 목록">
            <div style={BOX_STYLE}>
              <KeyValueRow label="Created" value="2026-06-30" />
              <KeyValueRow label="Owner" value="june" />
              <KeyValueRow label="Size" value="2.4 GB" />
            </div>
          </StorybookCard>
        </StorybookGrid>
      </StorybookSection>
    </StorybookPage>
  ),
}
