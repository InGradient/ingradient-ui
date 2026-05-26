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
            <Spinner size={12} />
            {labels.deletingSimple}
          </SyncChip>
        )}
        {syncStatus === 'syncing' && (
          <SyncChip $status="syncing">
            <Spinner size={12} />
            {syncPending > 0 && labels.syncing(syncPending)}
          </SyncChip>
        )}
        {syncStatus === 'done' && (
          <SyncChip $status="done">
            <Check size={12} />
            {labels.syncDone}
          </SyncChip>
        )}
        {syncStatus === 'error' && (
          <SyncChip $status="error">
            <AlertCircle size={12} />
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
          {isConnected ? <Wifi size={13} /> : <WifiOff size={13} />}
        </NetIcon>
        <StatChip $pct={stats?.disk} title={labels.diskUsage(fmtPct(stats?.disk))}>
          <HardDrive size={13} />
          {fmtPct(stats?.disk)}
        </StatChip>
        <StatChip $pct={stats?.cpu} title={labels.cpuUsage(fmtPct(stats?.cpu))}>
          <Cpu size={13} />
          {fmtPct(stats?.cpu)}
        </StatChip>
        <StatChip $pct={stats?.memory} title={labels.memoryUsage(fmtPct(stats?.memory))}>
          <Activity size={13} />
          {fmtPct(stats?.memory)}
        </StatChip>
      </RightSection>
    </Row>
  )
}
