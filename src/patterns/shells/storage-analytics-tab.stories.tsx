import type { Meta, StoryObj } from '@storybook/react-vite'
import { StorageAnalyticsTab } from './storage-analytics-tab'
import { StorageOverview } from './storage-overview'
import { StorageStatsTable, type StorageStatsTableColumn } from './storage-stats-table'
import { StorageRecommendationsList } from './storage-recommendations-list'
import { BarChartCard } from '../charts/bar-chart-card'
import { PieChartCard } from '../charts/pie-chart-card'

const overviewItems = [
  { label: 'Total Images', value: '128,402' },
  { label: 'Total Storage', value: '482.3 GB' },
  { label: 'Preview Generated', value: '120,108', sub: '(93.5%)' },
  { label: 'Skipped (≤1024px)', value: '8,294' },
]

const tierData = [
  { name: 'Original', gb: 320.4 },
  { name: 'Preview', gb: 110.2 },
  { name: 'Thumbnail', gb: 51.7 },
]

const projectData = [
  { name: 'Wafer line A', gb: 203.4 },
  { name: 'Surface defects', gb: 92.1 },
  { name: 'Pixel seg.', gb: 65.4 },
  { name: 'Keypoint', gb: 41.0 },
  { name: 'Mixed', gb: 28.5 },
]

const formatData = [
  { name: 'JPEG', value: 88420, color: 'var(--ig-color-accent)' },
  { name: 'PNG', value: 28310, color: '#7cc576' },
  { name: 'WEBP', value: 9000, color: '#f0ad4e' },
  { name: 'BMP', value: 2672, color: '#e06060' },
]

const resolutionData = [
  { name: '≤1024px', count: 8294 },
  { name: '1080p', count: 41200 },
  { name: '2K', count: 56000 },
  { name: '4K', count: 22908 },
]

const tierRows = [
  { tier: 'Original', images: '128,402', avg: '2.5 MB', total: '320.4 GB' },
  { tier: 'Preview', images: '120,108', avg: '0.92 MB', total: '110.2 GB' },
  { tier: 'Thumbnail', images: '128,402', avg: '32 KB', total: '51.7 GB' },
]
const tierCols: StorageStatsTableColumn<typeof tierRows[number]>[] = [
  { key: 'tier', header: 'Tier', render: (r) => r.tier },
  { key: 'images', header: 'Images', numeric: true, render: (r) => r.images },
  { key: 'avg', header: 'Avg Size', numeric: true, render: (r) => r.avg },
  { key: 'total', header: 'Total', numeric: true, render: (r) => r.total },
]

const costRows = [
  { item: 'Storage (total)', amount: '482.3 GB', unit: '$0.02/GB', cost: '$9.65' },
  { item: 'Gallery egress (est.)', amount: '12.0 GB', unit: '$0.12/GB', cost: '$1.44' },
  { item: 'Detail egress (est.)', amount: '28.0 GB', unit: '$0.12/GB', cost: '$3.36' },
  { item: 'Export egress (est.)', amount: '4.2 GB', unit: '$0.12/GB', cost: '$0.50' },
]
const costCols: StorageStatsTableColumn<typeof costRows[number]>[] = [
  { key: 'item', header: 'Item', render: (r) => r.item },
  { key: 'amount', header: 'Amount', numeric: true, render: (r) => r.amount },
  { key: 'unit', header: 'Unit Cost', numeric: true, render: (r) => r.unit },
  { key: 'cost', header: 'Monthly', numeric: true, render: (r) => r.cost },
]

const recommendations = [
  { tone: 'info' as const, text: 'Preview tier saves 88% of Detail view egress vs serving lossless originals.' },
  { tone: 'warn' as const, text: '"Wafer line A" accounts for 42% of total storage (203.4 GB) — consider archiving old data.' },
]

const noop = () => undefined

const meta: Meta<typeof StorageAnalyticsTab> = {
  title: 'Patterns/Shells/StorageAnalyticsTab',
  component: StorageAnalyticsTab,
  parameters: { layout: 'fullscreen' },
  decorators: [(Story) => <div style={{ width: 1100, padding: 20, background: 'var(--ig-color-surface-panel)' }}><Story /></div>],
}
export default meta

type Story = StoryObj<typeof meta>

const baseArgs = {
  onCopyReport: noop,
  overview: <StorageOverview items={overviewItems} />,
  tierChart: <BarChartCard data={tierData} xKey="name" series={[{ key: 'gb', label: 'GB', color: 'var(--ig-color-accent)' }]} layout="vertical" height={180} />,
  projectChart: <BarChartCard data={projectData} xKey="name" series={[{ key: 'gb', label: 'GB', color: 'var(--ig-color-accent)' }]} layout="vertical" height={200} />,
  resolutionChart: <BarChartCard data={resolutionData} xKey="name" series={[{ key: 'count', label: 'Images', color: 'var(--ig-color-accent)' }]} height={200} />,
  formatChart: <PieChartCard data={formatData} innerRadius={0} outerRadius={70} paddingAngle={1} height={200} />,
  tierTable: <StorageStatsTable columns={tierCols} rows={tierRows} />,
  costTable: <StorageStatsTable columns={costCols} rows={costRows} footer={['Total', '', '', '$14.95']} />,
  recommendations: <StorageRecommendationsList recommendations={recommendations} />,
}

export const FullExample: Story = { args: baseArgs }
export const NoRecommendations: Story = { args: { ...baseArgs, recommendations: undefined } }
export const ErrorState: Story = { args: { ...baseArgs, error: 'Failed to load storage analytics.', onRetry: noop } }
export const LoadingCharts: Story = {
  args: {
    ...baseArgs,
    overview: <StorageOverview items={[]} loading />,
    recommendations: <StorageRecommendationsList recommendations={[]} loading />,
  },
}
