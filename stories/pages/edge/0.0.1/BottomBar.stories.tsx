import React from 'react'
import type { Meta, StoryObj } from '@storybook/react-vite'
import { BottomBarView } from '@ingradient/edge-pages'
import { StorybookCard, StorybookGrid, StorybookPage, StorybookSection } from '@storybook-support/storybook-layout'
import { NORMAL_STATS, HIGH_STATS, CRITICAL_STATS } from '../../../fixtures/edge/0.0.1/system-stats'
import { BOTTOM_BAR_LABELS } from './shared/labels'

/**
 * Edge 하단 상태바 (`packages/edge-pages/src/chrome/BottomBarView`).
 * Workspace 셸 안에서만 보이던 부품을 상태별로 분리 검수 — SyncChip / StatChip /
 * 연결 상태 / 삭제 진행. ui-refactoring-rule §11(상태 문서화), §0.3(edge 전용 → pages 계층).
 */
const meta = {
  title: 'Pages/Edge/0.0.1/BottomBar',
  component: BottomBarView,
  tags: ['autodocs'],
  parameters: {
    layout: 'fullscreen',
    a11y: { test: 'error' },
  },
} satisfies Meta<typeof BottomBarView>

export default meta

type Story = StoryObj<typeof meta>

type BarProps = React.ComponentProps<typeof BottomBarView>

/** 공통 기본값 위에 상태별 override 만 얹어 렌더. 실제 셸의 하단바와 동일 props 계약. */
function Bar(overrides: Partial<BarProps>) {
  return (
    <div style={{ border: 'var(--ig-border-1px) solid var(--ig-color-border-subtle)', borderRadius: 'var(--ig-radius-sm)', overflow: 'hidden' }}>
      <BottomBarView
        isConnected
        syncStatus="idle"
        syncPending={0}
        syncFailed={0}
        stats={NORMAL_STATS}
        deleteProgress={false}
        labels={BOTTOM_BAR_LABELS}
        onOpenMonitor={() => undefined}
        {...overrides}
      />
    </div>
  )
}

export const States: Story = {
  args: {
    isConnected: true,
    syncStatus: 'idle',
    syncPending: 0,
    syncFailed: 0,
    stats: NORMAL_STATS,
    deleteProgress: false,
    labels: BOTTOM_BAR_LABELS,
    onOpenMonitor: () => undefined,
  },
  render: () => (
    <StorybookPage
      title="BottomBar"
      description="Edge 하단 상태바의 상태별 시각. SyncChip(동기화 진행/완료/실패)·StatChip(CPU/메모리/디스크)·연결 상태·삭제 진행을 한 화면에서 검수."
    >
      <StorybookSection title="Sync 상태 (SyncChip)" description="syncStatus 별 칩 색/문구. idle 은 칩 없음, error 는 danger.">
        <StorybookGrid columns="1fr">
          <StorybookCard title="Idle" subtitle="동기화 없음 — SyncChip 미표시">
            {Bar({ syncStatus: 'idle' })}
          </StorybookCard>
          <StorybookCard title="Syncing" subtitle="syncPending=3 — 진행 중 칩(muted)">
            {Bar({ syncStatus: 'syncing', syncPending: 3 })}
          </StorybookCard>
          <StorybookCard title="Done" subtitle="동기화 완료 — success 칩">
            {Bar({ syncStatus: 'done' })}
          </StorybookCard>
          <StorybookCard title="Error" subtitle="syncFailed=2 — danger 칩">
            {Bar({ syncStatus: 'error', syncFailed: 2 })}
          </StorybookCard>
        </StorybookGrid>
      </StorybookSection>

      <StorybookSection title="시스템 통계 (StatChip)" description="stats 값에 따라 StatChip 색이 정상/경고/위험으로 변함.">
        <StorybookGrid columns="1fr">
          <StorybookCard title="Normal" subtitle="cpu32 / mem45 / disk58">
            {Bar({ stats: NORMAL_STATS })}
          </StorybookCard>
          <StorybookCard title="High" subtitle="cpu88 / mem92 / disk78">
            {Bar({ stats: HIGH_STATS })}
          </StorybookCard>
          <StorybookCard title="Critical" subtitle="cpu95 / mem97 / disk93">
            {Bar({ stats: CRITICAL_STATS })}
          </StorybookCard>
        </StorybookGrid>
      </StorybookSection>

      <StorybookSection title="연결 / 삭제" description="연결 끊김·삭제 진행 상태.">
        <StorybookGrid columns="1fr">
          <StorybookCard title="Disconnected" subtitle="isConnected=false — 연결 끊김 표시">
            {Bar({ isConnected: false })}
          </StorybookCard>
          <StorybookCard title="Delete in progress" subtitle="deleteProgress=true">
            {Bar({ deleteProgress: true })}
          </StorybookCard>
        </StorybookGrid>
      </StorybookSection>
    </StorybookPage>
  ),
}
