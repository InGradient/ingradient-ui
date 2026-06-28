import { iconSizeNumbers } from '@ingradient/ui'
import { Button, Spinner, HardDriveIcon, CpuIcon, ActivityIcon, WifiIcon, WifiOffIcon, CheckIcon, AlertCircleIcon } from '@ingradient/ui/components'
import {
  Row, LeftSection, SyncChip, StatChip, NetIcon,
} from './BottomBarView.styles'
import { fmtPct } from './bottom-bar-helpers'
import type { BottomBarViewProps } from './types'

export function BottomBarView(props: BottomBarViewProps): JSX.Element {
  const {
    isConnected, syncStatus, syncPending, syncFailed, stats, deleteProgress,
    labels, onOpenMonitor,
  } = props

  return (
    <Row>
      <LeftSection>
        {deleteProgress && (
          <SyncChip $status="syncing">
            <Spinner size={iconSizeNumbers.xs} />
            {labels.deletingSimple}
          </SyncChip>
        )}
        {syncStatus === 'syncing' && (
          <SyncChip $status="syncing">
            <Spinner size={iconSizeNumbers.xs} />
            {syncPending > 0 && labels.syncing(syncPending)}
          </SyncChip>
        )}
        {syncStatus === 'done' && (
          <SyncChip $status="done">
            <CheckIcon size={iconSizeNumbers.xs} />
            {labels.syncDone}
          </SyncChip>
        )}
        {syncStatus === 'error' && (
          <SyncChip $status="error">
            <AlertCircleIcon size={iconSizeNumbers.xs} />
            {labels.syncFailed(syncFailed)}
          </SyncChip>
        )}
      </LeftSection>

      <Button
        variant="ghost"
        size="sm"
        onClick={onOpenMonitor}
        title={labels.openMonitor}
        type="button"
      >
        <NetIcon $connected={isConnected} title={isConnected ? labels.connected : labels.disconnected}>
          {isConnected ? <WifiIcon size={iconSizeNumbers.xsPlus} /> : <WifiOffIcon size={iconSizeNumbers.xsPlus} />}
        </NetIcon>
        <StatChip $pct={stats?.disk} title={labels.diskUsage(fmtPct(stats?.disk))}>
          <HardDriveIcon size={iconSizeNumbers.xsPlus} />
          {fmtPct(stats?.disk)}
        </StatChip>
        <StatChip $pct={stats?.cpu} title={labels.cpuUsage(fmtPct(stats?.cpu))}>
          <CpuIcon size={iconSizeNumbers.xsPlus} />
          {fmtPct(stats?.cpu)}
        </StatChip>
        <StatChip $pct={stats?.memory} title={labels.memoryUsage(fmtPct(stats?.memory))}>
          <ActivityIcon size={iconSizeNumbers.xsPlus} />
          {fmtPct(stats?.memory)}
        </StatChip>
      </Button>
    </Row>
  )
}
