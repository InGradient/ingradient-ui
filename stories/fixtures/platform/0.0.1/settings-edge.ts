import type {
  DeflectometryConfig,
  DeflectometryPatternLabel,
  EdgeDatasetOption,
  EdgeImportJobView,
  EdgeMemberOption,
  EdgePackageOptions,
  EdgePackageView,
} from '@ingradient/platform-pages'
import { DEFAULT_DEFLECTOMETRY_CONFIG } from '@ingradient/platform-pages'

export const mockEdgeOptions: EdgePackageOptions = {
  require_labeling: true,
  require_min_bbox_count: 1,
  block_next_without_labeling: false,
}

export const mockEdgeDefl: DeflectometryConfig = DEFAULT_DEFLECTOMETRY_CONFIG

export const mockEdgeDatasets: EdgeDatasetOption[] = [
  { id: 'ds-1', name: 'Wafer line A' },
  { id: 'ds-2', name: 'Wafer line B' },
  { id: 'ds-3', name: 'Surface defects' },
]

export const mockEdgeMembers: EdgeMemberOption[] = [
  { id: 'pm-1', user_id: 'u-1', name: 'June Lee', email: 'june@example.com' },
  { id: 'pm-2', user_id: 'u-2', name: 'Soyeon Park', email: 'soyeon@example.com' },
  { id: 'pm-3', user_id: 'u-3', name: 'Daniel Kim', email: 'daniel@example.com' },
]

export const mockEdgePackages: EdgePackageView[] = [
  {
    id: 'pkg-1',
    device_name: 'Line A — Edge 01',
    status: 'completed',
    progress: 100,
    created_at: '2026-05-10T09:23:00Z',
  },
  {
    id: 'pkg-2',
    device_name: 'Line A — Edge 02',
    status: 'running',
    progress: 64,
    created_at: '2026-05-15T14:05:00Z',
  },
  {
    id: 'pkg-3',
    device_name: 'Line B — QC station',
    status: 'failed',
    progress: 30,
    created_at: '2026-05-12T11:18:00Z',
  },
]

export const mockEdgeImportJobUploading: EdgeImportJobView = {
  id: 'job-1',
  status: 'uploading',
  progress: 42,
  error: null,
  report: null,
}

export const mockEdgeImportJobCompleted: EdgeImportJobView = {
  id: 'job-2',
  status: 'completed',
  progress: 100,
  error: null,
  report: {
    total: 1284,
    imported_new: 312,
    overwritten: 970,
    failed: 2,
    failed_details: [
      { file: 'IMG_0042.jpg', reason: 'Image dimensions mismatch (expected 1024×768)' },
      { file: 'IMG_0987.jpg', reason: 'Checksum mismatch — file may be corrupt' },
    ],
  },
}

/**
 * Storybook 용 mock pattern label 목록. defl.capture_directions 와 includes 따라 dynamic 하게 결정.
 */
export function buildMockPatternLabels(config: DeflectometryConfig): DeflectometryPatternLabel[] {
  const labels: string[] = []
  const dirs = config.capture_directions
  if (dirs === 'x_only' || dirs === 'both') {
    labels.push('x_orig')
    for (let i = 0; i < config.phase_shift_count; i++) labels.push(`phase_x_${i}`)
  }
  if (dirs === 'y_only' || dirs === 'both') {
    labels.push('y_orig')
    for (let i = 0; i < config.phase_shift_count; i++) labels.push(`phase_y_${i}`)
  }
  if (config.include_solid) labels.push('solid')
  if (config.include_black) labels.push('black')
  return labels
}

/**
 * Storybook 용 mock canvas pattern renderer. 라벨 종류에 따라 다른 시각화.
 * Platform 의 `drawPattern` 과 시각은 다르지만 storybook 에서 "뭔가 그려진다" 정도면 OK.
 */
export function mockRenderPattern(
  canvas: HTMLCanvasElement,
  label: DeflectometryPatternLabel,
  config: DeflectometryConfig,
) {
  const ctx = canvas.getContext('2d')
  if (!ctx) return
  const { width, height } = canvas
  ctx.clearRect(0, 0, width, height)
  if (label === 'solid') {
    ctx.fillStyle = '#f0f0f0'
    ctx.fillRect(0, 0, width, height)
  } else if (label === 'black') {
    ctx.fillStyle = '#0a0a0a'
    ctx.fillRect(0, 0, width, height)
  } else {
    const isX = label.startsWith('phase_x') || label === 'x_orig'
    const phaseMatch = label.match(/phase_[xy]_(\d+)/)
    const phaseShift = phaseMatch ? parseInt(phaseMatch[1], 10) / Math.max(1, config.phase_shift_count) : 0
    const period = config.fringe_period_default
    for (let y = 0; y < height; y++) {
      for (let x = 0; x < width; x++) {
        const coord = isX ? x : y
        const v = 0.5 + 0.5 * Math.sin((2 * Math.PI * (coord / period)) + phaseShift * 2 * Math.PI)
        const intensity = Math.round(v * 255)
        const idx = (y * width + x) * 4
        ctx.fillStyle = `rgb(${intensity}, ${intensity}, ${intensity})`
        ctx.fillRect(x, y, 1, 1)
        void idx
      }
    }
  }
}

export function mockFormatBadgeLabel(label: DeflectometryPatternLabel): string {
  if (label === 'solid') return 'Solid'
  if (label === 'black') return 'Black'
  if (label === 'x_orig') return 'X orig'
  if (label === 'y_orig') return 'Y orig'
  const m = label.match(/phase_([xy])_(\d+)/)
  if (m) return `Phase ${m[1].toUpperCase()} #${m[2]}`
  return label
}

export function mockComputeTotalPatterns(config: DeflectometryConfig): number {
  return buildMockPatternLabels(config).length
}
