import styled from 'styled-components'
import { TwoColumnDialog, Tabs } from '@ingradient/ui'
import type { SystemMonitorModalViewProps, SystemMonitorTab } from './types'

const Body = styled.div`
  flex: 1;
  min-height: 0;
  display: flex;
  flex-direction: column;
  padding: var(--ig-space-5);
  overflow: auto;
`

export function SystemMonitorModalView(props: SystemMonitorModalViewProps): JSX.Element {
  const { activeTab, labels, monitorContent, cleanupContent, onClose, onSetActiveTab } = props
  return (
    <TwoColumnDialog title={labels.title} onClose={onClose} width="min(var(--ig-popup-3xl-mid), 92vw)">
      <Body>
        <Tabs
          items={[
            { value: 'monitor', label: labels.tabMonitor },
            { value: 'cleanup', label: labels.tabCleanup },
          ]}
          value={activeTab}
          onChange={(v) => onSetActiveTab(v as SystemMonitorTab)}
        />
        <div style={{ marginTop: 'var(--ig-space-4)', flex: 1, minHeight: 0 }}>
          {activeTab === 'monitor' ? monitorContent : cleanupContent}
        </div>
      </Body>
    </TwoColumnDialog>
  )
}
