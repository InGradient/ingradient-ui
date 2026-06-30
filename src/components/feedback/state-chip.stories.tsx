import type { Meta, StoryObj } from '@storybook/react-vite'
import { StateChip, type StateChipStyle } from './state-chip'
import { StorybookCard, StorybookGrid, StorybookPage, StorybookSection } from '@storybook-support/storybook-layout'

const meta = {
  title: 'Components/Feedback/StateChip',
  component: StateChip,
  tags: ['autodocs'],
  parameters: {
    a11y: { test: 'error' },
  },
} satisfies Meta<typeof StateChip>

export default meta

type Story = StoryObj<typeof meta>

type DemoState = 'running' | 'queued' | 'draft' | 'failed'

const STATE_STYLES: Record<DemoState, StateChipStyle> = {
  running: { bg: 'var(--ig-color-status-running-bg)', color: 'var(--ig-color-status-running-text)' },
  queued: { bg: 'var(--ig-color-blue-tint-14)', color: 'var(--ig-color-status-queued-text)' },
  draft: { bg: 'var(--ig-color-status-draft-bg)', color: 'var(--ig-color-status-draft-text)' },
  failed: { bg: 'var(--ig-color-alert-danger-bg)', color: 'var(--ig-color-status-failed-text)' },
}

export const Review: Story = {
  args: { state: 'running', label: 'Running', stateStyles: STATE_STYLES },
  render: () => (
    <StorybookPage
      title="StateChip"
      description="상태를 색 칩(pill)으로 표시. state 키 + stateStyles 맵으로 색을 매핑한다. showDot 로 점 표시, collapseUntilHover 로 hover 전까지 라벨을 접는다."
    >
      <StorybookSection title="State" description="stateStyles 로 매핑한 각 상태의 칩.">
        <StorybookGrid columns="repeat(auto-fit, minmax(var(--ig-popup-xs), 1fr))">
          <StorybookCard title="running" subtitle="실행 중">
            <StateChip state="running" label="Running" stateStyles={STATE_STYLES} />
          </StorybookCard>
          <StorybookCard title="queued" subtitle="대기열">
            <StateChip state="queued" label="Queued" stateStyles={STATE_STYLES} />
          </StorybookCard>
          <StorybookCard title="draft" subtitle="임시저장">
            <StateChip state="draft" label="Draft" stateStyles={STATE_STYLES} />
          </StorybookCard>
          <StorybookCard title="failed" subtitle="실패">
            <StateChip state="failed" label="Failed" stateStyles={STATE_STYLES} />
          </StorybookCard>
        </StorybookGrid>
      </StorybookSection>

      <StorybookSection title="Options" description="showDot=false / collapseUntilHover (hover·focus 시 라벨 노출).">
        <StorybookGrid columns="repeat(auto-fit, minmax(var(--ig-popup-xs), 1fr))">
          <StorybookCard title="showDot=false" subtitle="점 없이 라벨만">
            <StateChip state="running" label="Running" stateStyles={STATE_STYLES} showDot={false} />
          </StorybookCard>
          <StorybookCard title="collapseUntilHover" subtitle="hover 전까지 접힘">
            <StateChip state="queued" label="Queued" stateStyles={STATE_STYLES} collapseUntilHover />
          </StorybookCard>
        </StorybookGrid>
      </StorybookSection>
    </StorybookPage>
  ),
}
