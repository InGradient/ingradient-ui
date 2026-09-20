// 데이터셋 선택 화면 fixture — FINEMTECH 현장 구성 그대로.
// 클래스 이름이 "한국어: 베트남어" 인 것은 현장 작업자가 베트남어를 읽기 때문이다.
import type {
  DatasetSelectLabels, EdgeClass, EdgeDataset, EdgeProjectGroup, RecentDatasetEntry,
} from '@ingradient/edge-pages'
import { PROJECT_NAME, PROJECT_NAME_PS } from './chrome'

export const DATASET_SELECT_LABELS: DatasetSelectLabels = {
  title: 'Projects / Datasets',
  online: 'Online',
  offline: 'Offline',
  refresh: 'Refresh',
  settingsTitle: 'Settings',
  settingsDisabledTitle: 'Settings',
  recentLabel: 'Recent',
  recentBadge: 'Recent',
  addDataset: 'Dataset',
  noClasses: 'No classes',
  more: 'More options',
  export: 'Export',
  loading: 'Loading...',
  emptyOffline: 'No datasets available.',
  emptyOnline: 'No projects yet.',
  createOnPlatform: 'Please create a project on INGRADIENT Platform.',
  sessionExpiredTitle: 'Session Expired',
  sessionExpiredDesc: 'Your session has expired. Go to the login screen?',
  sessionExpiredConfirm: 'Go to Login',
  cancel: 'Cancel',
  // 촬영은 묶음(패턴 한 벌) 단위라 장 수보다 묶음 수가 먼저 온다.
  images: (count, groupCount) => (groupCount == null
    ? `${count} img`
    : `${groupCount} groups (${count} img)`),
  roleLabel: (role) => role.charAt(0).toUpperCase() + role.slice(1),
}

const EXTRA_CLASS_COLORS = [
  '#8b5cf6', '#f59e0b', '#06b6d4', '#ec4899', '#84cc16', '#f97316', '#14b8a6',
]

/** 3개만 칩으로 보이고 나머지는 "+17" 로 접힌다. */
export const CLASSES: EdgeClass[] = [
  { class_id: 'c1', name: '정상: OK', color: '#3b82f6' },
  { class_id: 'c2', name: '눌림: Lõm', color: '#ef4444' },
  { class_id: 'c3', name: '돌출: Lỗi', color: '#22c55e' },
  ...Array.from({ length: 17 }, (_, i) => ({
    class_id: `c${i + 4}`,
    name: `결함 ${i + 1}: Lỗi ${i + 1}`,
    color: EXTRA_CLASS_COLORS[i % EXTRA_CLASS_COLORS.length],
  })),
]

function deflectometryDataset(
  id: string, name: string, groups: number, images: number,
): EdgeDataset {
  return {
    dataset_id: id,
    dataset_name: name,
    project_id: 'p-finemtech',
    project_name: PROJECT_NAME,
    deflectometry_enabled: true,
    role: 'owner',
    group_count: groups,
    image_count: images,
    classes: CLASSES,
    task_type: 'object_detection',
  }
}

const FINEMTECH_DATASETS: EdgeDataset[] = [
  deflectometryDataset('ds-ms-0405', 'MS 04.05', 0, 0),
  deflectometryDataset('ds-ms-q7', 'MS Q7', 0, 0),
  deflectometryDataset('ds-cns-0402', 'CNS 04.02', 0, 0),
  deflectometryDataset('ds-0608', '06.08 Combined', 2538, 2540),
  deflectometryDataset('ds-260720', '26.07.20 Total', 46, 989),
  deflectometryDataset('ds-0811', '08.11 Raw Materials', 13, 553),
  deflectometryDataset('ds-0821', '08.21 Raw Materials', 42, 4578),
  deflectometryDataset('ds-0825', '08.25 Filmed', 39, 4251),
  deflectometryDataset('ds-0826', '08.26 Other Films', 45, 4905),
  deflectometryDataset('ds-0827', '08.27 Films 2', 73, 7957),
  deflectometryDataset('ds-260902', '26.09.02 New Raw Material', 34, 3706),
]

export const LATEST_DATASET_ID = 'ds-260902'

export const SAMPLE_GROUPS: EdgeProjectGroup[] = [
  {
    project_id: 'p-finemtech',
    project_name: PROJECT_NAME,
    deflectometry_enabled: true,
    role: 'owner',
    datasets: FINEMTECH_DATASETS,
  },
  {
    project_id: 'p-finemtech-metal',
    project_name: PROJECT_NAME_PS,
    deflectometry_enabled: false,
    role: 'owner',
    datasets: [{
      dataset_id: 'ds-metal-default',
      dataset_name: 'default',
      project_id: 'p-finemtech-metal',
      project_name: PROJECT_NAME_PS,
      role: 'owner',
      group_count: 0,
      image_count: 0,
      classes: [],
      task_type: 'object_detection',
    }],
  },
]

/** 최근 목록은 마지막으로 연 순서. 맨 앞이 "Recent" 배지를 단다. */
export const SAMPLE_RECENT: RecentDatasetEntry[] = [
  'ds-260902', 'ds-0827', 'ds-0826', 'ds-0825', 'ds-0821',
].map((id, index) => ({
  dataset: FINEMTECH_DATASETS.find((d) => d.dataset_id === id) as EdgeDataset,
  isLatest: index === 0,
}))

export const TOTAL_DATASETS = FINEMTECH_DATASETS.length + 1
