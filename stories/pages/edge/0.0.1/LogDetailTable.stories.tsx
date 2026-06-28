import type { Meta, StoryObj } from '@storybook/react-vite'
import { LogDetailTableView } from '@ingradient/edge-pages'
import { StorybookCard, StorybookGrid, StorybookPage, StorybookSection } from '@storybook-support/storybook-layout'

/**
 * Edge 로그 디테일 테이블 (`packages/edge-pages/src/log/LogDetailTableView`).
 * 로그 엔트리 펼침 detail — raw text 를 줄 단위 parse 하거나 key-value 객체를 mono 표로.
 * 카탈로그 Table(컬럼 그리드)과 구조가 달라 edge 전용 유지(#0.3) 한 부품.
 * ui-refactoring-rule §11(상태 문서화), §0.3(edge 전용 → pages 계층).
 */
const meta = {
  title: 'Pages/Edge/0.0.1/LogDetailTable',
  component: LogDetailTableView,
  tags: ['autodocs'],
  parameters: {
    layout: 'fullscreen',
    a11y: { test: 'error' },
  },
} satisfies Meta<typeof LogDetailTableView>

export default meta

type Story = StoryObj<typeof meta>

const SAMPLE_TEXT = `device: edge-cam-01
status: connected
firmware: 2.4.1
last sync: 2026-06-28 14:03:21
note: reconnected after capture timeout`

const SAMPLE_DETAILS = {
  level: 'error',
  code: 'E_CAPTURE_TIMEOUT',
  attempts: 3,
  durationMs: 8421,
  recovered: true,
}

const BoxStyle = { maxWidth: 'var(--ig-popup-md)' }

export const States: Story = {
  render: () => (
    <StorybookPage
      title="LogDetailTable"
      description="로그 엔트리 detail 렌더러. Edge 패턴은 raw text 를 'key: value' 줄 단위로 parse, Phase 11 호환은 Record 객체를 그대로 표시. mono 폰트 2열."
    >
      <StorybookSection title="Text parse" description="raw text 를 줄 단위로 parse — ':' 있으면 key/value, 없으면 한 줄 전체.">
        <StorybookGrid columns="1fr">
          <StorybookCard title="text prop" subtitle="device/status/firmware … 5줄">
            <div style={BoxStyle}><LogDetailTableView text={SAMPLE_TEXT} /></div>
          </StorybookCard>
        </StorybookGrid>
      </StorybookSection>

      <StorybookSection title="Key-value details" description="Record<string, unknown> 를 key/value 표로. 객체/숫자/불리언 직렬화.">
        <StorybookGrid columns="1fr">
          <StorybookCard title="details prop" subtitle="level/code/attempts/durationMs/recovered">
            <div style={BoxStyle}><LogDetailTableView details={SAMPLE_DETAILS} /></div>
          </StorybookCard>
        </StorybookGrid>
      </StorybookSection>
    </StorybookPage>
  ),
}
