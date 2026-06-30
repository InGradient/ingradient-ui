import type { Meta, StoryObj } from '@storybook/react-vite'
import { StatusDot } from './status-dot'
import { StorybookCard, StorybookGrid, StorybookPage, StorybookSection } from '@storybook-support/storybook-layout'

const meta = {
  title: 'Components/Feedback/StatusDot',
  component: StatusDot,
  tags: ['autodocs'],
  parameters: {
    a11y: { test: 'error' },
  },
} satisfies Meta<typeof StatusDot>

export default meta

type Story = StoryObj<typeof meta>

export const Review: Story = {
  args: { $tone: 'neutral' },
  render: () => (
    <StorybookPage
      title="StatusDot"
      description="색으로만 상태를 표시하는 작은 점(dot) 인디케이터. 연결/동기화 등 상태를 caller 가 $tone 으로 매핑한다. 도메인 무관."
    >
      <StorybookSection title="Tone" description="success / warning / danger / neutral 4가지 상태 색.">
        <StorybookGrid columns="repeat(auto-fit, minmax(var(--ig-popup-xs), 1fr))">
          <StorybookCard title="success" subtitle="연결됨">
            <StatusDot $tone="success" aria-label="연결됨" />
          </StorybookCard>
          <StorybookCard title="warning" subtitle="주의">
            <StatusDot $tone="warning" aria-label="주의" />
          </StorybookCard>
          <StorybookCard title="danger" subtitle="오류">
            <StatusDot $tone="danger" aria-label="오류" />
          </StorybookCard>
          <StorybookCard title="neutral" subtitle="비활성/대기">
            <StatusDot $tone="neutral" aria-label="대기" />
          </StorybookCard>
        </StorybookGrid>
      </StorybookSection>
    </StorybookPage>
  ),
}
