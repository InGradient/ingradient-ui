import type { Meta, StoryObj } from '@storybook/react-vite'
import { EmptyText } from './empty-text'
import { StorybookCard, StorybookGrid, StorybookPage, StorybookSection } from '@storybook-support/storybook-layout'

const meta = {
  title: 'Components/Feedback/EmptyText',
  component: EmptyText,
  tags: ['autodocs'],
  parameters: {
    a11y: { test: 'error' },
  },
} satisfies Meta<typeof EmptyText>

export default meta

type Story = StoryObj<typeof meta>

const BOX_STYLE = { minHeight: 'var(--ig-popup-2xs)', display: 'flex', flexDirection: 'column' as const }

export const Review: Story = {
  args: { children: 'No items' },
  render: () => (
    <StorybookPage
      title="EmptyText"
      description="섹션·패널 안의 가벼운 '항목 없음' 텍스트. 아이콘·제목·설명·액션을 갖춘 블록형 EmptyState 와 달리 stateTitleText + 중앙정렬만. 목록/표의 빈 상태에 사용."
    >
      <StorybookSection title="상태" description="기본 / 짧은 문구 / 긴 문구 줄바꿈.">
        <StorybookGrid columns="repeat(auto-fit, minmax(var(--ig-popup-xs), 1fr))">
          <StorybookCard title="default" subtitle="빈 목록">
            <div style={BOX_STYLE}><EmptyText>No items</EmptyText></div>
          </StorybookCard>
          <StorybookCard title="short" subtitle="짧은 안내">
            <div style={BOX_STYLE}><EmptyText>No join codes</EmptyText></div>
          </StorybookCard>
          <StorybookCard title="long text" subtitle="긴 문구 줄바꿈/중앙정렬">
            <div style={BOX_STYLE}><EmptyText>No connected classes for this dataset. Connect a class to start labeling images here.</EmptyText></div>
          </StorybookCard>
        </StorybookGrid>
      </StorybookSection>
    </StorybookPage>
  ),
}
