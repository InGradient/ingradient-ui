// 화면 2 — 프로젝트/데이터셋 선택. 로그인 후 처음 보는 화면이다.
import { useState } from 'react'
import type { Meta, StoryObj } from '@storybook/react-vite'
import { expect, fn, userEvent, waitFor, within } from 'storybook/test'
import { DatasetSelectView } from '@ingradient/edge-pages'
import {
  DATASET_SELECT_LABELS, LATEST_DATASET_ID, SAMPLE_RECENT,
} from '../../../fixtures/edge/0.0.5'
import { defineHandoff } from '../../../support/handoff'
import { AccountSlot, EdgeAppFrame, LangSlot } from './shared/build-shell'
import { useDatasetRuntime } from './dataset-runtime'

const noop = (): undefined => undefined

interface SceneArgs {
  mode?: 'online' | 'offline'
  loading?: boolean
  fetchError?: string | null
  /** 데이터셋이 하나도 없을 때. */
  empty?: boolean
  sessionExpired?: boolean
  failFirstExport?: boolean
  onMockAction?: (action: string) => void
}

function DatasetSelectScene(args: SceneArgs): JSX.Element {
  return <DatasetSelectSession key={JSON.stringify({ ...args, onMockAction: undefined })} {...args} />
}

function DatasetSelectSession(args: SceneArgs): JSX.Element {
  const {
    mode = 'offline', loading = false, fetchError = null,
    empty = false, sessionExpired = false,
  } = args
  const [expiredOpen, setExpiredOpen] = useState(sessionExpired)
  const [mockStatus, setMockStatus] = useState('')
  const closeExpired = (action: 'confirm' | 'cancel') => {
    args.onMockAction?.(`session-expired-${action}`)
    setExpiredOpen(false)
    setMockStatus(action === 'confirm' ? 'Mock sign-in requested; no authentication was performed.' : 'Mock session dialog dismissed.')
  }
  const [openDotMenuDatasetId, setOpenDotMenuDatasetId] = useState<string | null>(null)
  const runtime = useDatasetRuntime(empty, args.failFirstExport ?? false, args.onMockAction)
  const groups = runtime.groups
  const recent = empty ? [] : SAMPLE_RECENT

  return (
    <EdgeAppFrame
      showFooter
      isConnected={mode === 'online'}
      content={(
        <>
        {mockStatus && <p role="status">{mockStatus}</p>}
        {runtime.status && <p role="status">{runtime.status}</p>}
        {!loading && !fetchError && runtime.createProjectForm}
        <DatasetSelectView
          mode={mode}
          connectionStatus={mode === 'online' ? 'connected' : 'disconnected'}
          connectionTitle={mode === 'online' ? 'Online' : 'Offline'}
          canSetupCamera
          loading={loading}
          fetchError={fetchError}
          recentDatasets={recent}
          groups={groups}
          totalDatasets={groups.reduce((total, group) => total + group.datasets.length, 0)}
          addDatasetModal={runtime.addDatasetModal}
          exportModal={runtime.exportModal}
          latestDatasetId={LATEST_DATASET_ID}
          openDotMenuDatasetId={openDotMenuDatasetId}
          sessionExpired={expiredOpen}
          labels={DATASET_SELECT_LABELS}
          langSelector={LangSlot}
          accountMenu={AccountSlot}
          onRefresh={noop}
          onOpenSettings={noop}
          onSelectDataset={noop}
          onAddDatasetClick={runtime.openAdd}
          onExportClick={(dataset) => { setOpenDotMenuDatasetId(null); runtime.openExport(dataset) }}
          onToggleDotMenu={setOpenDotMenuDatasetId}
          onSessionExpiredConfirm={() => closeExpired('confirm')}
          onSessionExpiredCancel={() => closeExpired('cancel')}
        />
        </>
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
  args: { onMockAction: fn() },
  tags: ['autodocs'],
  parameters: { layout: 'fullscreen', ...handoff, a11y: { test: 'error' } },
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

/**
 * 토큰이 만료돼 다시 로그인해야 하는 경우.
 * 확인 모달이 화면에 고정돼 뜨므로 Docs 에서는 빼고 사이드바에서만 연다 —
 * 아니면 문서 전체를 덮는다.
 */
export const SessionExpired: Story = {
  tags: ['!autodocs'],
  args: { mode: 'online', sessionExpired: true },
}

export const SessionExpiredEscapeWorkflow: Story = {
  ...SessionExpired,
  play: async ({ canvasElement, args }) => {
    const page = within(canvasElement.ownerDocument.body)
    await expect(page.getByRole('dialog')).toBeVisible()
    await userEvent.keyboard('{Escape}')
    await expect(page.queryByRole('dialog')).not.toBeInTheDocument()
    await expect(args.onMockAction).toHaveBeenCalledWith('session-expired-cancel')
  },
}

export const SessionExpiredCancelWorkflow: Story = {
  ...SessionExpired,
  play: async ({ canvasElement, args }) => {
    const page = within(canvasElement.ownerDocument.body)
    await userEvent.click(page.getByRole('button', { name: DATASET_SELECT_LABELS.cancel }))
    await expect(page.queryByRole('dialog')).not.toBeInTheDocument()
    await expect(args.onMockAction).toHaveBeenCalledWith('session-expired-cancel')
  },
}

export const AddDatasetWorkflow: Story = {
  args: {},
  play: async ({ canvasElement, args }) => {
    const page = within(canvasElement.ownerDocument.body)
    await userEvent.click(page.getAllByRole('button', { name: DATASET_SELECT_LABELS.addDataset })[0])
    const dialog = within(page.getByRole('dialog', { name: 'Add mock dataset' }))
    await userEvent.click(dialog.getByRole('button', { name: 'Add dataset' }))
    await expect(dialog.getByRole('alert')).toHaveTextContent('Enter a name.')
    await userEvent.type(dialog.getByLabelText('Dataset name'), 'Synthetic inspection')
    await userEvent.click(dialog.getByRole('button', { name: 'Add dataset' }))
    await expect(dialog.getByRole('button', { name: 'Adding…' })).toBeDisabled()
    await waitFor(() => expect(page.queryByRole('dialog')).not.toBeInTheDocument())
    await expect(page.getByText(/Mock dataset “Synthetic inspection” created/)).toBeVisible()
    await expect(args.onMockAction).toHaveBeenCalledWith('dataset-create-done')
  },
}

export const CreateProjectWorkflow: Story = {
  args: { empty: true, mode: 'online' },
  play: async ({ canvasElement, args }) => {
    const page = within(canvasElement.ownerDocument.body)
    await userEvent.click(page.getByRole('button', { name: 'Create mock project' }))
    await userEvent.click(page.getByRole('button', { name: 'Create project' }))
    await expect(page.getByRole('alert')).toHaveTextContent('Enter a name.')
    await userEvent.type(page.getByLabelText('Project name'), 'Synthetic project')
    await userEvent.click(page.getByRole('button', { name: 'Create project' }))
    await waitFor(() => expect(page.queryByRole('dialog')).not.toBeInTheDocument())
    await expect(page.getByText('Synthetic project', { exact: true })).toBeVisible()
    await expect(args.onMockAction).toHaveBeenCalledWith('project-create-done')
    await userEvent.click(page.getByRole('button', { name: DATASET_SELECT_LABELS.addDataset }))
    await expect(page.getByRole('dialog', { name: 'Add mock dataset' })).toBeVisible()
    await userEvent.keyboard('{Escape}')
    await expect(page.queryByRole('dialog')).not.toBeInTheDocument()
  },
}

export const AddDatasetCancelWorkflow: Story = {
  args: {},
  play: async ({ canvasElement, args }) => {
    const page = within(canvasElement.ownerDocument.body)
    const trigger = page.getAllByRole('button', { name: DATASET_SELECT_LABELS.addDataset })[0]
    await userEvent.click(trigger)
    await userEvent.type(page.getByLabelText('Dataset name'), 'Cancelled fixture')
    await userEvent.click(page.getByRole('button', { name: 'Add dataset' }))
    await userEvent.click(page.getByRole('button', { name: 'Cancel' }))
    await expect(page.queryByRole('dialog')).not.toBeInTheDocument()
    await expect(trigger).toHaveFocus()
    await expect(args.onMockAction).toHaveBeenCalledWith('create-cancel')
  },
}

export const ExportRetryWorkflow: Story = {
  args: { failFirstExport: true },
  play: async ({ canvasElement, args }) => {
    const page = within(canvasElement.ownerDocument.body)
    await userEvent.click(page.getAllByRole('button', { name: DATASET_SELECT_LABELS.more })[0])
    await userEvent.click(page.getByRole('menuitem', { name: DATASET_SELECT_LABELS.export }))
    await expect(page.getByRole('dialog', { name: 'Export mock dataset' })).toBeVisible()
    await userEvent.click(page.getByRole('button', { name: 'Export' }))
    await expect(page.getByRole('progressbar', { name: 'Exporting synthetic images' })).toBeVisible()
    await waitFor(() => expect(page.getByRole('alert')).toHaveTextContent('Synthetic export failed.'))
    await userEvent.click(page.getByRole('button', { name: 'Retry export' }))
    await waitFor(() => expect(page.getByText('Mock export complete. No archive or files were created.')).toBeVisible())
    await expect(args.onMockAction).toHaveBeenCalledWith('export-error')
    await expect(args.onMockAction).toHaveBeenCalledWith('export-done')
    await userEvent.click(within(page.getByRole('dialog')).getByRole('button', { name: 'Close' }))
    await expect(page.queryByRole('dialog')).not.toBeInTheDocument()
  },
}

export const ExportCancelWorkflow: Story = {
  args: {},
  play: async ({ canvasElement, args }) => {
    const page = within(canvasElement.ownerDocument.body)
    await userEvent.click(page.getAllByRole('button', { name: DATASET_SELECT_LABELS.more })[0])
    await userEvent.click(page.getByRole('menuitem', { name: DATASET_SELECT_LABELS.export }))
    await userEvent.click(page.getByRole('button', { name: 'Export' }))
    await userEvent.keyboard('{Escape}')
    await expect(page.queryByRole('dialog')).not.toBeInTheDocument()
    await expect(page.getByText('Mock export cancelled. No files were written.')).toBeVisible()
    await expect(args.onMockAction).toHaveBeenCalledWith('export-cancel')
  },
}

export const SessionExpiredConfirmWorkflow: Story = {
  ...SessionExpired,
  play: async ({ canvasElement, args }) => {
    const page = within(canvasElement.ownerDocument.body)
    await userEvent.click(page.getByRole('button', { name: DATASET_SELECT_LABELS.sessionExpiredConfirm }))
    await expect(page.queryByRole('dialog')).not.toBeInTheDocument()
    await expect(page.getByText(/Mock sign-in requested/)).toBeVisible()
    await expect(args.onMockAction).toHaveBeenCalledWith('session-expired-confirm')
  },
}
