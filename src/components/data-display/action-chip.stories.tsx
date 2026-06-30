import type { Meta, StoryObj } from '@storybook/react-vite'
import { ActionChip } from './action-chip'
import { StorybookCard, StorybookGrid, StorybookPage, StorybookSection } from '@storybook-support/storybook-layout'

const meta = {
  title: 'Components/Data Display/ActionChip',
  component: ActionChip,
  tags: ['autodocs'],
  parameters: {
    a11y: { test: 'error' },
  },
} satisfies Meta<typeof ActionChip>

export default meta

type Story = StoryObj<typeof meta>

export const Review: Story = {
  args: { children: 'Chip' },
  render: () => (
    <StorybookPage
      title="ActionChip"
      description="버튼 기반 인터랙티브 pill 칩. 선택적 색상 swatch + 라벨. 칩 그룹·태그 선택기·필터 행에 사용. 정적(비인터랙티브) 태그 표시는 feedback 의 Chip 을 사용한다."
    >
      <StorybookSection title="상태" description="기본 / 색상 swatch / 비활성 / 긴 라벨.">
        <StorybookGrid columns="repeat(auto-fit, minmax(var(--ig-popup-xs), 1fr))">
          <StorybookCard title="default" subtitle="라벨만">
            <ActionChip onClick={() => {}}>All</ActionChip>
          </StorybookCard>
          <StorybookCard title="with color" subtitle="색상 swatch + 라벨">
            <ActionChip color="#3b82f6" onClick={() => {}}>Person</ActionChip>
          </StorybookCard>
          <StorybookCard title="disabled" subtitle="비활성">
            <ActionChip disabled onClick={() => {}}>Disabled</ActionChip>
          </StorybookCard>
          <StorybookCard title="long label" subtitle="긴 라벨 nowrap">
            <ActionChip color="#22c55e" onClick={() => {}}>Very long category label that stays on one line</ActionChip>
          </StorybookCard>
        </StorybookGrid>
      </StorybookSection>
    </StorybookPage>
  ),
}
