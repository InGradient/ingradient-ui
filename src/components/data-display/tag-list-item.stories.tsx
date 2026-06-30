import type { Meta, StoryObj } from '@storybook/react-vite'
import { TagListItem } from './tag-list-item'
import { StorybookCard, StorybookGrid, StorybookPage, StorybookSection } from '@storybook-support/storybook-layout'

const meta = {
  title: 'Components/Data Display/TagListItem',
  component: TagListItem,
  tags: ['autodocs'],
  parameters: {
    a11y: { test: 'error' },
  },
} satisfies Meta<typeof TagListItem>

export default meta

type Story = StoryObj<typeof meta>

export const Review: Story = {
  args: { color: '#3b82f6', label: 'Tag' },
  render: () => (
    <StorybookPage
      title="TagListItem"
      description="색상 swatch(sm) + 라벨 + 선택적 count 로 구성된 풀너비 버튼 행. 태그/클래스 목록의 한 줄. active 상태로 현재 선택 표시."
    >
      <StorybookSection title="상태" description="기본 / 활성 / count / 긴 라벨 ellipsis / 비활성.">
        <StorybookGrid columns="repeat(auto-fit, minmax(var(--ig-popup-xs), 1fr))">
          <StorybookCard title="default" subtitle="색상 + 라벨">
            <TagListItem color="#3b82f6" label="Person" onClick={() => {}} />
          </StorybookCard>
          <StorybookCard title="active" subtitle="현재 선택">
            <TagListItem color="#22c55e" label="Vehicle" active onClick={() => {}} />
          </StorybookCard>
          <StorybookCard title="with count" subtitle="우측 count">
            <TagListItem color="#f59e0b" label="Animal" count={128} onClick={() => {}} />
          </StorybookCard>
          <StorybookCard title="active + count" subtitle="선택 + count">
            <TagListItem color="#a855f7" label="Building" active count={42} onClick={() => {}} />
          </StorybookCard>
          <StorybookCard title="long label" subtitle="ellipsis 처리">
            <TagListItem color="#ef4444" label="Background / unlabeled region with very long name" count={7} onClick={() => {}} />
          </StorybookCard>
          <StorybookCard title="disabled" subtitle="비활성">
            <TagListItem color="#64748b" label="Disabled" disabled onClick={() => {}} />
          </StorybookCard>
        </StorybookGrid>
      </StorybookSection>
    </StorybookPage>
  ),
}
