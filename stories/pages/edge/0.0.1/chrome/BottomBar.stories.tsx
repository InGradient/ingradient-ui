import type { Meta, StoryObj } from '@storybook/react-vite'
import { BottomBarView, type BottomBarLabels, type SyncStatus, type SystemStats } from '@ingradient/edge-pages'
import { NORMAL_STATS, HIGH_STATS } from '../../../../fixtures/edge/0.0.1/system-stats'

const LABELS: BottomBarLabels = {
  deletingSimple: 'Deleting…',
  syncing: (count) => `Syncing ${count}…`,
  syncDone: 'Synced',
  syncFailed: (count) => `${count} failed`,
  openMonitor: 'Open system monitor',
  connected: 'Connected',
  disconnected: 'Disconnected',
  diskUsage: (pct) => `Disk: ${pct}`,
  cpuUsage: (pct) => `CPU: ${pct}`,
  memoryUsage: (pct) => `Memory: ${pct}`,
}

function BottomBarScene(args: {
  isConnected?: boolean
  syncStatus?: SyncStatus
  syncPending?: number
  syncFailed?: number
  stats?: SystemStats | null
  deleteProgress?: boolean
}) {
  return (
    <div style={{ height: 28, padding: '0 12px', background: 'var(--ig-color-surface-header)' }}>
      <BottomBarView
        isConnected={args.isConnected ?? true}
        syncStatus={args.syncStatus ?? 'idle'}
        syncPending={args.syncPending ?? 0}
        syncFailed={args.syncFailed ?? 0}
        stats={args.stats ?? NORMAL_STATS}
        deleteProgress={args.deleteProgress ?? false}
        labels={LABELS}
        onOpenMonitor={() => undefined}
      />
    </div>
  )
}

const meta = {
  title: 'Pages/Edge/0.0.1/Chrome/BottomBar',
  component: BottomBarScene,
  tags: ['autodocs'],
  parameters: { layout: 'fullscreen' },
} satisfies Meta<typeof BottomBarScene>

export default meta

type Story = StoryObj<typeof meta>

export const Idle: Story = { args: {} }
export const Syncing: Story = { args: { syncStatus: 'syncing', syncPending: 24 } }
export const SyncDone: Story = { args: { syncStatus: 'done' } }
export const SyncError: Story = { args: { syncStatus: 'error', syncFailed: 3 } }
export const Deleting: Story = { args: { deleteProgress: true } }
export const HighLoad: Story = { args: { stats: HIGH_STATS } }
