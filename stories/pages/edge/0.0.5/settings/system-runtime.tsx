import { useEffect, useRef, useState } from 'react'
import { BottomBarView, SystemMonitorCleanupTabView, SystemMonitorModalView, SystemMonitorMonitorTabView, type SystemMonitorTab } from '@ingradient/edge-pages'
import { BOTTOM_BAR_LABELS, SAMPLE_STATS } from '../../../../fixtures/edge/0.0.5'
import { MockConfirm } from './tabs-maintenance'
import type { MockAction } from './tabs-moved'

const initialCounts = { datasets: 2, sessions: 8, logs: 20, thumbs: 40 }
const bytesPerItem = 1024 ** 2

export function SystemMonitorRuntime({ isConnected = true, onMockAction }: { isConnected?: boolean; onMockAction?: MockAction } = {}) {
  const [open, setOpen] = useState(false)
  const [tab, setTab] = useState<SystemMonitorTab>('monitor')
  const [confirm, setConfirm] = useState(false)
  const [selected, setSelected] = useState(new Set(['logs', 'thumbs']))
  const [counts, setCounts] = useState(initialCounts)
  const [running, setRunning] = useState(false)
  const [freed, setFreed] = useState<number | null>(null)
  const [message, setMessage] = useState('')
  // Observer identity changes must not restart an already-running cleanup deadline.
  const actionRef = useRef(onMockAction)
  useEffect(() => { actionRef.current = onMockAction }, [onMockAction])
  useEffect(() => {
    if (!running) return
    const timer = setTimeout(() => {
      let bytes = 0
      const next = { ...counts }
      for (const category of Object.keys(next) as (keyof typeof next)[]) {
        if (selected.has(category)) { bytes += next[category] * bytesPerItem; next[category] = 0 }
      }
      setCounts(next); setFreed(bytes); setRunning(false); setMessage(`Mock cleanup complete: ${bytes} bytes freed. No files deleted.`)
      actionRef.current?.('system-cleanup-complete', { freedBytes: bytes })
    }, 700)
    return () => clearTimeout(timer)
  }, [running, counts, selected])
  return <><BottomBarView isConnected={isConnected} syncStatus="idle" syncPending={0} syncFailed={0} stats={SAMPLE_STATS} deleteProgress={running} labels={BOTTOM_BAR_LABELS} onOpenMonitor={() => setOpen(true)} />
    {open && <SystemMonitorModalView activeTab={tab} onSetActiveTab={setTab} onClose={() => setOpen(false)}
      labels={{ title: 'Mock System Monitor', tabMonitor: 'Monitor', tabCleanup: 'Cleanup', close: 'Close' }}
      monitorContent={<SystemMonitorMonitorTabView latest={{ ts: '2026-09-20T00:00:00Z', cpu: 24, memory: 48, disk: 70 }} history={[]} labels={{ cpu: 'CPU', memory: 'Memory', disk: 'Disk', empty: 'No mock history' }} />}
      cleanupContent={<><SystemMonitorCleanupTabView stats={{ totalSize: Object.values(counts).reduce((sum, count) => sum + count * bytesPerItem, 0), itemCounts: counts, oldestEntry: '2026-09-01' }} loading={false} running={running}
        result={freed === null ? null : { ok: true, freedBytes: freed }} selectedCategories={selected}
        labels={{ totalSize: 'Mock disk usage', oldestEntry: 'Oldest entry', categories: 'Categories', datasets: 'Datasets', sessions: 'Sessions', logs: 'Logs', thumbs: 'Thumbnails', run: 'Clean selected mock data', running: 'Mock cleanup running', refresh: 'Refresh', empty: 'No mock data', loading: 'Loading', freed: (value) => `Mock freed ${value}` }}
        onToggleCategory={(category) => { if (!running) setSelected((previous) => { const next = new Set(previous); if (next.has(category)) next.delete(category); else next.add(category); return next }) }}
        onRun={() => setConfirm(true)} onRefresh={() => { setMessage('Mock disk usage refreshed from session.'); onMockAction?.('system-refresh') }} />
        <p role="status">{running ? 'Mock cleanup in progress; safe to close this monitor.' : message}</p></>} />}
    {open && confirm && <MockConfirm title="Clean selected mock data?" onCancel={() => setConfirm(false)} onConfirm={() => { setConfirm(false); setRunning(true); setFreed(null); onMockAction?.('system-cleanup-start', [...selected]) }} />}
  </>
}
