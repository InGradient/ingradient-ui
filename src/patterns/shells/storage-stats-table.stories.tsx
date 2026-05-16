import type { Meta, StoryObj } from '@storybook/react-vite'
import { StorageStatsTable, type StorageStatsTableColumn } from './storage-stats-table'

interface CostRow {
  item: string
  amount: string
  unit: string
  cost: string
}

const rows: CostRow[] = [
  { item: 'Storage (total)', amount: '482.3 GB', unit: '$0.02/GB', cost: '$9.65' },
  { item: 'Gallery egress (est.)', amount: '12.0 GB', unit: '$0.12/GB', cost: '$1.44' },
  { item: 'Detail egress (est.)', amount: '28.0 GB', unit: '$0.12/GB', cost: '$3.36' },
  { item: 'Export egress (est.)', amount: '4.2 GB', unit: '$0.12/GB', cost: '$0.50' },
]

const columns: StorageStatsTableColumn<CostRow>[] = [
  { key: 'item', header: 'Item', render: (r) => r.item },
  { key: 'amount', header: 'Amount', numeric: true, render: (r) => r.amount },
  { key: 'unit', header: 'Unit Cost', numeric: true, render: (r) => r.unit },
  { key: 'cost', header: 'Monthly', numeric: true, render: (r) => r.cost },
]

const meta: Meta = {
  title: 'Patterns/Shells/StorageStatsTable',
  parameters: { layout: 'fullscreen' },
  decorators: [(Story) => <div style={{ width: 720, padding: 20, background: 'var(--ig-color-surface-panel)' }}><Story /></div>],
}
export default meta

type Story = StoryObj

export const CostTable: Story = {
  render: () => <StorageStatsTable<CostRow> columns={columns} rows={rows} footer={['Total', '', '', '$14.95']} />,
}

export const NoFooter: Story = {
  render: () => <StorageStatsTable<CostRow> columns={columns} rows={rows} />,
}

export const Loading: Story = {
  render: () => <StorageStatsTable<CostRow> columns={columns} rows={[]} loading />,
}
