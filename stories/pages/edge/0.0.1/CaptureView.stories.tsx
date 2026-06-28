import type { ReactNode } from 'react'
import type { Meta, StoryObj } from '@storybook/react-vite'
import { StorybookCard, StorybookGrid, StorybookPage, StorybookSection } from '@storybook-support/storybook-layout'
import { CaptureContent } from './workspace/build-capture-content'

/**
 * Edge 캡처 뷰 (`packages/edge-pages/src/capture/CaptureView`).
 * Workspace/Capture 탭에서만 보이던 부품을 셔터 버튼 링 상태별로 분리 검수.
 * 셔터 링은 파란 accent 버튼 위 on-accent 흰 장식이라 #0.3 page 전용 유지 항목.
 * ui-refactoring-rule §11(상태 문서화), §0.3(edge 전용 → pages 계층).
 */
const meta = {
  title: 'Pages/Edge/0.0.1/CaptureView',
  tags: ['autodocs'],
  parameters: {
    layout: 'fullscreen',
    a11y: { test: 'error' },
  },
} satisfies Meta

export default meta

type Story = StoryObj<typeof meta>

/** CaptureView 는 라이브 스트림 전체를 채우므로 고정 높이 프레임 안에 렌더. */
function Frame({ children }: { children: ReactNode }) {
  return (
    <div style={{ height: 420, border: 'var(--ig-border-1px) solid var(--ig-color-border-subtle)', borderRadius: 'var(--ig-radius-sm)', overflow: 'hidden', display: 'flex' }}>
      {children}
    </div>
  )
}

export const States: Story = {
  render: () => (
    <StorybookPage
      title="CaptureView"
      description="Edge 캡처 뷰의 셔터 버튼 링 상태. 정지 시 흰 정지 링, 촬영 중에는 흰 스피너 링이 돈다. 링은 파란 셔터 버튼 위 on-accent 흰 장식(테마 토큰화 시 light 모드 역전이라 raw 유지)."
    >
      <StorybookSection title="셔터 버튼 링" description="isCapturing 에 따라 정지 링 / 스피너 링.">
        <StorybookGrid columns="1fr 1fr">
          <StorybookCard title="Ready" subtitle="정지 흰 링 (border 2px, rgba 255 0.5)">
            <Frame><CaptureContent isCapturing={false} /></Frame>
          </StorybookCard>
          <StorybookCard title="Capturing" subtitle="촬영중 스피너 링 (border 3px, rgba 255 0.25 + white-90 top)">
            <Frame><CaptureContent isCapturing /></Frame>
          </StorybookCard>
        </StorybookGrid>
      </StorybookSection>
    </StorybookPage>
  ),
}
