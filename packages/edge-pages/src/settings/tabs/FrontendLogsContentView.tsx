import { LogsContentShell, LogRow } from './logs-content-shell'
import type { FrontendLogsContentViewProps } from '../types'

export function FrontendLogsContentView(props: FrontendLogsContentViewProps): JSX.Element {
  return (
    <LogsContentShell
      {...props}
      renderEntry={(log, i) => (
        <LogRow key={i} $level={log.level}>
          [{log.timestamp}] {log.message}
        </LogRow>
      )}
    />
  )
}
