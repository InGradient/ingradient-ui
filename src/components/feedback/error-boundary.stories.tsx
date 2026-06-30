import type { Meta, StoryObj } from '@storybook/react-vite'
import { DefaultErrorFallback } from './error-boundary'
import { StorybookCard, StorybookGrid, StorybookPage, StorybookSection } from '@storybook-support/storybook-layout'

const meta = {
  title: 'Components/Feedback/ErrorBoundary',
  component: DefaultErrorFallback,
  tags: ['autodocs'],
  parameters: {
    a11y: { test: 'error' },
  },
} satisfies Meta<typeof DefaultErrorFallback>

export default meta

type Story = StoryObj<typeof meta>

const BOX_STYLE = { minHeight: 'var(--ig-popup-sm)', display: 'flex', flexDirection: 'column' as const }

export const Review: Story = {
  args: { error: new Error('Failed to load dataset'), resetErrorBoundary: () => {} },
  render: () => (
    <StorybookPage
      title="ErrorBoundary"
      description="ErrorBoundary 가 에러를 잡았을 때 보여주는 기본 fallback UI (DefaultErrorFallback). 에러 메시지와 함께, resetErrorBoundary 가 있으면 재시도 버튼을 노출한다."
    >
      <StorybookSection title="상태" description="재시도 버튼 유무 / 에러 메시지 종류.">
        <StorybookGrid columns="repeat(auto-fit, minmax(var(--ig-popup-sm), 1fr))">
          <StorybookCard title="reset 가능" subtitle="재시도 버튼 노출">
            <div style={BOX_STYLE}>
              <DefaultErrorFallback error={new Error('Failed to load dataset')} resetErrorBoundary={() => {}} />
            </div>
          </StorybookCard>
          <StorybookCard title="reset 없음" subtitle="버튼 미노출">
            <div style={BOX_STYLE}>
              <DefaultErrorFallback error={new Error('Network request failed')} />
            </div>
          </StorybookCard>
          <StorybookCard title="non-Error 값" subtitle="문자열로 변환">
            <div style={BOX_STYLE}>
              <DefaultErrorFallback error="Unexpected token in JSON" resetErrorBoundary={() => {}} />
            </div>
          </StorybookCard>
        </StorybookGrid>
      </StorybookSection>
    </StorybookPage>
  ),
}
