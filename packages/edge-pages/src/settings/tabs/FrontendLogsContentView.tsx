import styled from 'styled-components'
import { Button } from '@ingradient/ui'
import type { FrontendLogsContentViewProps } from '../types'

const Wrap = styled.div`display: flex; flex-direction: column; gap: var(--ig-space-4); height: 100%;`
const ToolbarRow = styled.div`display: flex; gap: var(--ig-space-3); align-items: center; justify-content: flex-end;`
const LogList = styled.div`
  flex: 1;
  min-height: 0;
  overflow-y: auto;
  font-family: 'Courier New', monospace;
  font-size: var(--ig-font-size-xs);
  background: var(--ig-color-surface-raised);
  border: var(--ig-border-1px) solid var(--ig-color-border-subtle);
  border-radius: var(--ig-radius-xs);
  padding: var(--ig-space-3);
`
const LogRow = styled.div<{ $level: string }>`
  padding: var(--ig-space-2px) 0;
  color: ${({ $level }) =>
    $level === 'error' ? 'var(--ig-color-danger)' :
    $level === 'warn'  ? 'var(--ig-color-warning)' :
    'var(--ig-color-text-secondary)'};
`
const EmptyText = styled.div`text-align: center; padding: var(--ig-space-9) 0; color: var(--ig-color-text-muted);`

export function FrontendLogsContentView(props: FrontendLogsContentViewProps): JSX.Element {
  const { logs, labels, onClear, onExport } = props
  return (
    <Wrap>
      <ToolbarRow>
        <Button size="sm" variant="secondary" onClick={onClear}>{labels.clear}</Button>
        <Button size="sm" variant="secondary" onClick={onExport}>{labels.export}</Button>
      </ToolbarRow>
      <LogList>
        {logs.length === 0
          ? <EmptyText>{labels.empty}</EmptyText>
          : logs.map((log, i) => (
            <LogRow key={i} $level={log.level}>
              [{log.timestamp}] {log.message}
            </LogRow>
          ))}
      </LogList>
    </Wrap>
  )
}
