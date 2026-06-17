import { iconSizeNumbers } from '@ingradient/ui'
import { HardDrive, Cpu, Activity, Wifi, WifiOff, Check, AlertCircle } from 'lucide-react'
import { Spinner } from '@ingradient/ui/components'
import {
  Row, LeftSection, RightSection, SyncChip, StatChip, NetIcon,
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
            <Check size={iconSizeNumbers.xs} />
            {labels.syncDone}
          </SyncChip>
        )}
        {syncStatus === 'error' && (
          <SyncChip $status="error">
            <AlertCircle size={iconSizeNumbers.xs} />
            {labels.syncFailed(syncFailed)}
          </SyncChip>
        )}
      </LeftSection>

      <RightSection
        onClick={onOpenMonitor}
        title={labels.openMonitor}
        type="button"
      >
        <NetIcon $connected={isConnected} title={isConnected ? labels.connected : labels.disconnected}>
          {isConnected ? <Wifi size={iconSizeNumbers.xsPlus} /> : <WifiOff size={iconSizeNumbers.xsPlus} />}
        </NetIcon>
        <StatChip $pct={stats?.disk} title={labels.diskUsage(fmtPct(stats?.disk))}>
          <HardDrive size={iconSizeNumbers.xsPlus} />
          {fmtPct(stats?.disk)}
        </StatChip>
        <StatChip $pct={stats?.cpu} title={labels.cpuUsage(fmtPct(stats?.cpu))}>
          <Cpu size={iconSizeNumbers.xsPlus} />
          {fmtPct(stats?.cpu)}
        </StatChip>
        <StatChip $pct={stats?.memory} title={labels.memoryUsage(fmtPct(stats?.memory))}>
          <Activity size={iconSizeNumbers.xsPlus} />
          {fmtPct(stats?.memory)}
        </StatChip>
      </RightSection>
    </Row>
  )
}
