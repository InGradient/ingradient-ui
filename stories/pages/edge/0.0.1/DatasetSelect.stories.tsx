import type { Meta, StoryObj } from '@storybook/react-vite'
import { useState } from 'react'
import {
  DatasetSelectView,
  AddDatasetModalView,
  ExportModalView,
  type DatasetSelectLabels,
  type AddDatasetModalLabels,
  type ExportModalLabels,
  type EdgeProjectGroup,
  type RecentDatasetEntry,
  type AddDatasetClass,
} from '@ingradient/edge-pages'
import { SAMPLE_GROUPS, SAMPLE_RECENT } from '../../../fixtures/edge/0.0.1/dataset-groups'
import { defineHandoff } from '../../../support/handoff'

const handoff = defineHandoff({
  service: 'edge',
  version: '0.0.1',
  page: 'DatasetSelect',
  referenceStory: 'Pages / Edge / 0.0.1 / DatasetSelect / WithGroups',
  preset: 'edge-0.0.1',
  fixturesPath: 'stories/fixtures/edge/0.0.1/dataset-groups.ts',
  requiredScenarios: ['empty-offline', 'empty-online', 'with-groups', 'with-recent', 'loading', 'fetch-error', 'add-modal', 'export-modal'],
  interactions: [
    'dataset card 클릭 → 캡처 화면 진입',
    'Add dataset 버튼 → AddDatasetModalView slot 열림',
    'dot menu → Export → ExportModalView slot 열림',
    'recent dataset 가로 스크롤',
  ],
  platformIntegration: [
    'groupedDatasets 는 useDatasetFetch hook 결과',
    'AccountMenu / CameraSettingsDialog / LangSelector 는 slot 으로 주입',
    'session expired ConfirmDialog 는 view 가 직접 render',
  ],
})

const DEFAULT_LABELS: DatasetSelectLabels = {
  title: 'Datasets',
  online: 'Online',
  offline: 'Offline',
  refresh: 'Refresh',
  settingsTitle: 'Settings',
  settingsDisabledTitle: 'Camera setup — permission required',
  recentLabel: 'Recent',
  recentBadge: 'Latest',
  addDataset: 'Add dataset',
  noClasses: 'No classes',
  more: 'More',
  export: 'Export',
  loading: 'Loading…',
  emptyOffline: 'No datasets available offline.',
  emptyOnline: 'No datasets yet.',
  createOnPlatform: 'Create the first project on the Platform.',
  sessionExpiredTitle: 'Session expired',
  sessionExpiredDesc: 'Please sign in again to continue.',
  sessionExpiredConfirm: 'Sign in',
  cancel: 'Cancel',
  images: (count) => `${count} images`,
  roleLabel: (role) => role,
}

const ADD_DATASET_LABELS: AddDatasetModalLabels = {
  title: 'Add dataset',
  cancel: 'Cancel',
  add: 'Add',
  adding: 'Adding…',
  datasetNameLabel: 'Dataset name',
  taskTypeLabel: 'Task type',
  classesLabel: (s, t) => `Classes (${s}/${t})`,
  taskTypeOptions: {
    classification: 'Classification',
    object_detection: 'Object Detection',
    segmentation: 'Segmentation',
    point: 'Point',
  },
}

const EXPORT_LABELS: ExportModalLabels = {
  title: 'Export',
  cancel: 'Cancel',
  close: 'Close',
  export: 'Export',
  exporting: 'Exporting…',
  complete: 'Export complete.',
  images: (count) => `${count} images`,
  localImages: (count) => `${count} local`,
}

const SAMPLE_CLASSES: AddDatasetClass[] = [
  { class_id: 'c1', class_name: 'scratch', color: '#f43f5e' },
  { class_id: 'c2', class_name: 'dent', color: '#f59e0b' },
  { class_id: 'c3', class_name: 'stain', color: '#10b981' },
]

const LANG_SLOT = <span style={{ color: 'var(--ig-color-text-muted)', fontSize: 12 }}>EN</span>
const ACCOUNT_SLOT = <span style={{ color: 'var(--ig-color-text-muted)', fontSize: 12 }}>Account ▾</span>

function AddModalScene() {
  const [name, setName] = useState('')
  const [taskType, setTaskType] = useState<'object_detection'>('object_detection')
  const [selectedClassIds, setSelectedClassIds] = useState(new Set(SAMPLE_CLASSES.map((c) => c.class_id)))
  return (
    <AddDatasetModalView
      name={name}
      taskType={taskType}
      selectedClassIds={selectedClassIds}
      allClasses={SAMPLE_CLASSES}
      namePlaceholder="2026-05-19"
      adding={false}
      error={null}
      labels={ADD_DATASET_LABELS}
      onNameChange={setName}
      onTaskTypeChange={(v) => setTaskType(v as 'object_detection')}
      onClassesChange={setSelectedClassIds}
      onSubmit={(e) => e.preventDefault()}
      onClose={() => undefined}
    />
  )
}

function ExportModalScene() {
  return (
    <ExportModalView
      datasetName="2026-05-19 morning shift"
      imageCount={1248}
      localImageCount={812}
      phase="idle"
      error={null}
      labels={EXPORT_LABELS}
      onClose={() => undefined}
      onExport={() => undefined}
    />
  )
}

type SceneArgs = Parameters<typeof DatasetSelectScene>[0]

function DatasetSelectScene(args: {
  mode?: 'online' | 'offline'
  loading?: boolean
  fetchError?: string | null
  groups?: EdgeProjectGroup[]
  recentDatasets?: RecentDatasetEntry[]
  showAddModal?: boolean
  showExportModal?: boolean
}) {
  const groups = args.groups ?? []
  const recent = args.recentDatasets ?? []
  const totalDatasets = groups.reduce((acc, g) => acc + g.datasets.length, 0)
  const [openDotMenuDatasetId, setOpenDotMenuDatasetId] = useState<string | null>(null)
  return (
    <DatasetSelectView
      mode={args.mode ?? 'online'}
      connectionStatus="connected"
      connectionTitle="Connected"
      canSetupCamera
      loading={args.loading ?? false}
      fetchError={args.fetchError ?? null}
      recentDatasets={recent}
      groups={groups}
      totalDatasets={totalDatasets}
      latestDatasetId={recent.find((r) => r.isLatest)?.dataset.dataset_id ?? null}
      openDotMenuDatasetId={openDotMenuDatasetId}
      sessionExpired={false}
      labels={DEFAULT_LABELS}
      langSelector={LANG_SLOT}
      accountMenu={ACCOUNT_SLOT}
      settingsDialog={null}
      exportModal={args.showExportModal ? <ExportModalScene /> : null}
      addDatasetModal={args.showAddModal ? <AddModalScene /> : null}
      onRefresh={() => undefined}
      onOpenSettings={() => undefined}
      onSelectDataset={() => undefined}
      onAddDatasetClick={() => undefined}
      onExportClick={() => undefined}
      onToggleDotMenu={setOpenDotMenuDatasetId}
      onSessionExpiredConfirm={() => undefined}
      onSessionExpiredCancel={() => undefined}
    />
  )
}

const meta = {
  title: 'Pages/Edge/0.0.1/DatasetSelect',
  component: DatasetSelectScene,
  tags: ['autodocs'],
  parameters: { layout: 'fullscreen', ...handoff },
} satisfies Meta<typeof DatasetSelectScene>

export default meta

type Story = StoryObj<SceneArgs>

export const EmptyOffline: Story = { args: { mode: 'offline' } }

export const EmptyOnline: Story = { args: { mode: 'online' } }

export const WithGroups: Story = { args: { mode: 'online', groups: SAMPLE_GROUPS } }

export const WithRecent: Story = {
  args: { mode: 'online', groups: SAMPLE_GROUPS, recentDatasets: SAMPLE_RECENT },
}

export const Loading: Story = { args: { mode: 'online', loading: true } }

export const FetchError: Story = {
  args: { mode: 'online', fetchError: 'Failed to fetch datasets. Check connectivity.' },
}

export const AddDatasetModalOpen: Story = {
  args: { mode: 'online', groups: SAMPLE_GROUPS, showAddModal: true },
}

export const ExportModalOpen: Story = {
  args: { mode: 'online', groups: SAMPLE_GROUPS, showExportModal: true },
}
