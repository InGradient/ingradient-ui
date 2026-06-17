import type { Meta, StoryObj } from '@storybook/react-vite'
import { TopBarView, type TopBarLabels, type ConnectionStatus } from '@ingradient/edge-pages'

const LABELS: TopBarLabels = {
  refresh: 'Refresh',
  settingsTitle: 'Settings',
  settingsDisabledTitle: 'Camera setup — permission required',
}

const LANG_SLOT = <span style={{ color: 'var(--ig-color-text-muted)', fontSize: 12 }}>EN</span>
const ACCOUNT_SLOT = <span style={{ color: 'var(--ig-color-text-muted)', fontSize: 12 }}>Account ▾</span>

function TopBarScene(args: {
  selectedProjectName?: string | null
  selectedDatasetName?: string | null
  connectionStatus?: ConnectionStatus
  connectionTitle?: string
  isRefreshing?: boolean
  canSetupCamera?: boolean
}) {
  return (
    <div style={{ height: 48, padding: '0 16px', borderBottom: '1px solid var(--ig-color-border-subtle)' }}>
      <TopBarView
        selectedProjectName={args.selectedProjectName ?? null}
        selectedDatasetName={args.selectedDatasetName ?? null}
        connectionStatus={args.connectionStatus ?? 'connected'}
        connectionTitle={args.connectionTitle ?? 'Connected'}
        isRefreshing={args.isRefreshing ?? false}
        canSetupCamera={args.canSetupCamera ?? true}
        labels={LABELS}
        langSelector={LANG_SLOT}
        accountMenu={ACCOUNT_SLOT}
        settingsDialog={null}
        onBackToDatasets={() => undefined}
        onRefresh={() => undefined}
        onOpenSettings={() => undefined}
      />
    </div>
  )
}

const meta = {
  title: 'Pages/Edge/0.0.1/Chrome/TopBar',
  component: TopBarScene,
  tags: ['autodocs'],
  parameters: { layout: 'fullscreen' },
} satisfies Meta<typeof TopBarScene>

export default meta

type Story = StoryObj<typeof meta>

export const NoDataset: Story = { args: {} }

export const WithDataset: Story = {
  args: {
    selectedProjectName: 'Line A Surface Inspection',
    selectedDatasetName: '2026-05-19 morning shift',
  },
}

export const Connecting: Story = {
  args: { connectionStatus: 'connecting', connectionTitle: 'Connecting...' },
}

export const Refreshing: Story = {
  args: {
    selectedProjectName: 'Line A Surface Inspection',
    selectedDatasetName: '2026-05-19 morning shift',
    isRefreshing: true,
  },
}
