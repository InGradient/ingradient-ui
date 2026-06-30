import type { Meta, StoryObj } from '@storybook/react-vite'
import { TooltipCard } from './tooltip-card'
import { StorybookCard, StorybookGrid, StorybookPage, StorybookSection } from '@storybook-support/storybook-layout'

const meta = {
  title: 'Components/Feedback/TooltipCard',
  component: TooltipCard,
  tags: ['autodocs'],
  parameters: {
    a11y: { test: 'error' },
  },
} satisfies Meta<typeof TooltipCard>

export default meta

type Story = StoryObj<typeof meta>

export const Review: Story = {
  args: { children: '연결됨' },
  render: () => (
    <StorybookPage
      title="TooltipCard"
      description="raised surface 위에 띄우는 작은 카드 컨테이너. 툴팁·팝오버 내용 래퍼로 사용. children 만 받으며 div 속성을 그대로 전달한다."
    >
      <StorybookSection title="내용" description="짧은 한 줄 / 제목+본문 / 긴 문구.">
        <StorybookGrid columns="repeat(auto-fit, minmax(var(--ig-popup-xs), 1fr))">
          <StorybookCard title="single line" subtitle="짧은 안내">
            <TooltipCard>연결됨</TooltipCard>
          </StorybookCard>
          <StorybookCard title="title + body" subtitle="제목과 본문">
            <TooltipCard>
              <strong>Dataset</strong>
              <div style={{ color: 'var(--ig-color-text-muted)' }}>마지막 동기화 2분 전</div>
            </TooltipCard>
          </StorybookCard>
          <StorybookCard title="long text" subtitle="긴 문구 줄바꿈">
            <TooltipCard>
              이 클래스는 데이터셋에 연결되어 있으며, 라벨링이 시작되면 자동으로 이미지가 채워집니다.
            </TooltipCard>
          </StorybookCard>
        </StorybookGrid>
      </StorybookSection>
    </StorybookPage>
  ),
}
