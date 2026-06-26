import { LogsContentShell, LogRow, Timestamp, LevelBadge } from './logs-content-shell'
import type { BackendLogsContentViewProps } from '../types'

export function BackendLogsContentView(props: BackendLogsContentViewProps): JSX.Element {
  return (
    <LogsContentShell
      {...props}
      renderEntry={(log, i) => (
        <LogRow key={i} $level={log.level}>
          <Timestamp>{log.timestamp}</Timestamp>
          <LevelBadge>{log.level}</LevelBadge>
          {log.message}
        </LogRow>
      )}
    />
  )
}
