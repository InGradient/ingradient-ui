// 화면 2 — 프로젝트/데이터셋 선택. 로그인 후 처음 보는 화면이다.
import { useState } from 'react'
import type { Meta, StoryObj } from '@storybook/react-vite'
import { DatasetSelectView } from '@ingradient/edge-pages'
import {
  DATASET_SELECT_LABELS, LATEST_DATASET_ID, SAMPLE_GROUPS, SAMPLE_RECENT, TOTAL_DATASETS,
} from '../../../fixtures/edge/0.0.5'
import { defineHandoff } from '../../../support/handoff'
import { AccountSlot, EdgeAppFrame, LangSlot } from './shared/build-shell'

const noop = (): undefined => undefined

interface SceneArgs {
  mode?: 'online' | 'offline'
  loading?: boolean
  fetchError?: string | null
  /** 데이터셋이 하나도 없을 때. */
  empty?: boolean
  sessionExpired?: boolean
}

function DatasetSelectScene(args: SceneArgs): JSX.Element {
  const {
    mode = 'offline', loading = false, fetchError = null,
    empty = false, sessionExpired = false,
  } = args
  const [openDotMenuDatasetId, setOpenDotMenuDatasetId] = useState<string | null>(null)
  const groups = empty ? [] : SAMPLE_GROUPS
  const recent = empty ? [] : SAMPLE_RECENT

  return (
    <EdgeAppFrame
      showFooter
      isConnected={mode === 'online'}
      content={(
        <DatasetSelectView
          mode={mode}
          connectionStatus={mode === 'online' ? 'connected' : 'disconnected'}
          connectionTitle={mode === 'online' ? 'Online' : 'Offline'}
          canSetupCamera
          loading={loading}
          fetchError={fetchError}
          recentDatasets={recent}
          groups={groups}
          totalDatasets={empty ? 0 : TOTAL_DATASETS}
          latestDatasetId={LATEST_DATASET_ID}
          openDotMenuDatasetId={openDotMenuDatasetId}
          sessionExpired={sessionExpired}
          labels={DATASET_SELECT_LABELS}
          langSelector={LangSlot}
          accountMenu={AccountSlot}
          onRefresh={noop}
          onOpenSettings={noop}
          onSelectDataset={noop}
          onAddDatasetClick={noop}
          onExportClick={noop}
          onToggleDotMenu={setOpenDotMenuDatasetId}
          onSessionExpiredConfirm={noop}
          onSessionExpiredCancel={noop}
        />
      )}
    />
  )
}

const handoff = defineHandoff({
  service: 'edge',
  version: '0.0.5',
  page: 'DatasetSelect',
  referenceStory: 'Pages / Edge / 0.0.5 / DatasetSelect / Offline',
  preset: 'edge-0.0.1',
  fixturesPath: 'stories/fixtures/edge/0.0.5/datasets.ts',
  requiredScenarios: ['offline', 'online', 'loading', 'empty', 'fetch-error', 'session-expired'],
  interactions: [
    '카드 클릭 → 촬영 화면 진입',
    '카드 우측 … → Export',
    '프로젝트 헤더의 + Dataset → 데이터셋 추가 모달',
  ],
  platformIntegration: [
    'groups / recentDatasets 는 로컬 DB + 플랫폼 동기화 결과',
    '"34 groups (3706 img)" 문장은 consumer 가 만든다 — View 는 labels.images 를 부를 뿐이다',
  ],
})

const meta = {
  title: 'Pages/Edge/0.0.5/DatasetSelect',
  component: DatasetSelectScene,
  tags: ['autodocs'],
  parameters: { layout: 'fullscreen', ...handoff },
} satisfies Meta<typeof DatasetSelectScene>

export default meta
type Story = StoryObj<SceneArgs>

/** 현장 기본 화면 — 최근 5개 + 프로젝트별 목록. */
export const Offline: Story = { args: {} }

/** 플랫폼에 연결된 상태. 배지와 동기화 표시가 달라진다. */
export const Online: Story = { args: { mode: 'online' } }

export const Loading: Story = { args: { loading: true } }

/** 첫 설치 직후 — 플랫폼에서 프로젝트를 먼저 만들어야 한다. */
export const Empty: Story = { args: { empty: true } }

export const FetchError: Story = {
  args: { mode: 'online', fetchError: 'Could not reach the platform.' },
}

/** 토큰이 만료돼 다시 로그인해야 하는 경우. */
export const SessionExpired: Story = { args: { mode: 'online', sessionExpired: true } }
