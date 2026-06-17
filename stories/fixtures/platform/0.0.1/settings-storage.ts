import type { StorageOverviewItem, StorageRecommendation, StorageStatsTableColumn } from '@ingradient/platform-pages'

export const storageOverviewItems: StorageOverviewItem[] = [
  { label: 'Total Images', value: '128,402' },
  { label: 'Total Storage', value: '482.3 GB' },
  { label: 'Preview Generated', value: '120,108', sub: '(93.5%)' },
  { label: 'Skipped (≤1024px)', value: '8,294' },
]

export const storageTierChartData = [
  { name: 'Original', gb: 320.4 },
  { name: 'Preview', gb: 110.2 },
  { name: 'Thumbnail', gb: 51.7 },
]

export const storageProjectChartData = [
  { name: 'Wafer line A', gb: 203.4 },
  { name: 'Surface defects', gb: 92.1 },
  { name: 'Pixel seg.', gb: 65.4 },
  { name: 'Keypoint', gb: 41.0 },
  { name: 'Mixed', gb: 28.5 },
]

export const storageResolutionChartData = [
  { name: '≤1024px', count: 8294 },
  { name: '1080p', count: 41200 },
  { name: '2K', count: 56000 },
  { name: '4K', count: 22908 },
]

export const storageFormatChartData = [
  { name: 'JPEG', value: 88420, color: 'var(--ig-color-accent)' },
  { name: 'PNG', value: 28310, color: '#7cc576' },
  { name: 'WEBP', value: 9000, color: '#f0ad4e' },
  { name: 'BMP', value: 2672, color: '#e06060' },
]

export interface TierRow {
  tier: string
  images: string
  avg: string
  total: string
}

export const storageTierTableRows: TierRow[] = [
  { tier: 'Original', images: '128,402', avg: '2.5 MB', total: '320.4 GB' },
  { tier: 'Preview', images: '120,108', avg: '0.92 MB', total: '110.2 GB' },
  { tier: 'Thumbnail', images: '128,402', avg: '32 KB', total: '51.7 GB' },
]

export const storageTierTableColumns: StorageStatsTableColumn<TierRow>[] = [
  { key: 'tier', header: 'Tier', render: (r) => r.tier },
  { key: 'images', header: 'Images', numeric: true, render: (r) => r.images },
  { key: 'avg', header: 'Avg Size', numeric: true, render: (r) => r.avg },
  { key: 'total', header: 'Total', numeric: true, render: (r) => r.total },
]

export interface CostRow {
  item: string
  amount: string
  unit: string
  cost: string
}

export const storageCostTableRows: CostRow[] = [
  { item: 'Storage (total)', amount: '482.3 GB', unit: '$0.02/GB', cost: '$9.65' },
  { item: 'Gallery egress (est.)', amount: '12.0 GB', unit: '$0.12/GB', cost: '$1.44' },
  { item: 'Detail egress (est.)', amount: '28.0 GB', unit: '$0.12/GB', cost: '$3.36' },
  { item: 'Export egress (est.)', amount: '4.2 GB', unit: '$0.12/GB', cost: '$0.50' },
]

export const storageCostTableColumns: StorageStatsTableColumn<CostRow>[] = [
  { key: 'item', header: 'Item', render: (r) => r.item },
  { key: 'amount', header: 'Amount', numeric: true, render: (r) => r.amount },
  { key: 'unit', header: 'Unit Cost', numeric: true, render: (r) => r.unit },
  { key: 'cost', header: 'Monthly', numeric: true, render: (r) => r.cost },
]

export const storageCostTableFooter = ['Total', '', '', '$14.95']

export const storageRecommendations: StorageRecommendation[] = [
  { tone: 'info', text: 'Preview tier saves 88% of Detail view egress vs serving lossless originals.' },
  { tone: 'info', text: '8,294 images (≤1024px) skip preview generation — appropriate, files are small.' },
  { tone: 'warn', text: '"Wafer line A" accounts for 42% of total storage (203.4 GB) — consider archiving old data.' },
  { tone: 'warn', text: 'BMP uploads at 2% — consider client-side WebP conversion to reduce upload time.' },
]
