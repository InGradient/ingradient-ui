import styled from 'styled-components'
import { Tabs } from '@ingradient/ui'
import type { UnifiedLogsTabViewProps, LogsSource } from '../types'

const Wrap = styled.div`display: flex; flex-direction: column; gap: var(--ig-space-4); height: 100%;`

export function UnifiedLogsTabView(props: UnifiedLogsTabViewProps): JSX.Element {
  const { source, backendLogsContent, frontendLogsContent, labels, onSetSource } = props
  return (
    <Wrap>
      <Tabs
        items={[
          { value: 'backend',  label: labels.backend },
          { value: 'frontend', label: labels.frontend },
        ]}
        value={source}
        onChange={(v) => onSetSource(v as LogsSource)}
      />
      <div style={{ flex: 1, minHeight: 0 }}>
        {source === 'backend' ? backendLogsContent : frontendLogsContent}
      </div>
    </Wrap>
  )
}
