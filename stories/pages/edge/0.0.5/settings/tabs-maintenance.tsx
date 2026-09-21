import { useState } from 'react'
import { Button, DialogShell } from '@ingradient/ui'
import { AboutTabView, DataTabView, FieldTestTabView, UpdateSectionView } from '@ingradient/edge-pages'
import { ABOUT_TAB_LABELS, DATA_TAB_LABELS, FIELD_TEST_TAB_LABELS, UPDATE_SECTION_LABELS } from '../../../../fixtures/edge/0.0.5'
import type { SettingsContentProps } from './tabs-device'

export function MockConfirm({ title, onCancel, onConfirm }: { title: string; onCancel: () => void; onConfirm: () => void }) {
  return <DialogShell title={title} onClose={onCancel} actions={<><Button onClick={onCancel}>Cancel</Button><Button variant="accent" onClick={onConfirm}>Confirm mock action</Button></>}>
    This changes synthetic session state only. No files, license, or devices will be changed.
  </DialogShell>
}

export function DataTabContent({ draft: { maintenance }, onMockAction }: SettingsContentProps) {
  const [confirm, setConfirm] = useState(false)
  const [cache, setCache] = maintenance.cache
  const [result, setResult] = maintenance.cacheResult
  return <><DataTabView dataDirPath={'C:\\ProgramData\\Ingradient\\Edge\\data'}
    totalBytes={1024 ** 4} freeBytes={(cache === 'done' ? 222 : 215) * 1024 ** 3}
    cacheSize={cache === 'done' ? 0 : 7 * 1024 ** 3} isCleaningCache={cache === 'running'} cleanupCompleted={cache === 'done'}
    labels={DATA_TAB_LABELS} onCleanCache={() => setConfirm(true)}
    onOpenDataDir={() => { setResult('Mock data directory preview requested; no folder was opened.'); onMockAction('data-open-directory') }} />
    <p role="status">{cache === 'running' ? 'Mock cache cleanup in progress.' : cache === 'done' ? 'Mock cache cleanup complete: 7 GB freed.' : result}</p>
    {confirm && <MockConfirm title="Clean mock cache?" onCancel={() => setConfirm(false)} onConfirm={() => { setConfirm(false); setCache('running'); onMockAction('data-clean-cache') }} />}</>
}

export function FieldTestTabContent({ draft: { maintenance }, onMockAction }: SettingsContentProps) {
  const [field, setField] = maintenance.field
  const [progress, setProgress] = maintenance.progress
  const [result, setResult] = maintenance.fieldResult
  const log = field === 'idle' ? [] : [`Synthetic field test: ${field}`, `Mock progress: ${progress}%`, ...(field === 'done' ? ['Mock scan, connection and capture checks passed. No hardware tested.'] : [])]
  return <><FieldTestTabView running={field === 'running'} progress={progress / 100} hasResults={field === 'done' || field === 'cancelled'} log={log} labels={FIELD_TEST_TAB_LABELS}
    onRun={() => { setField('running'); setProgress(0); setResult(''); onMockAction('field-test-run') }}
    onCancel={() => { setField('cancelled'); onMockAction('field-test-cancel') }}
    onReset={() => { setField('idle'); setProgress(0); setResult('Mock field test reset.'); onMockAction('field-test-reset') }}
    onExport={() => { setResult(`Mock field test export prepared: ${log.length} lines. No file written.`); onMockAction('field-test-export', log) }} />
    <p role="status">{field === 'running' ? `Mock field test running: ${progress}%` : result || (field === 'done' ? 'Mock field test complete.' : field === 'cancelled' ? 'Mock field test cancelled.' : '')}</p></>
}

export function AboutTabContent({ draft: { maintenance }, onMockAction }: SettingsContentProps) {
  const [confirm, setConfirm] = useState(false)
  const [codeOpen, setCodeOpen] = useState(false)
  const [deactivated, setDeactivated] = maintenance.deactivated
  const [update, setUpdate] = maintenance.update
  const [result, setResult] = maintenance.aboutResult
  return <><AboutTabView appVersion="0.0.5" licenseStatus={deactivated ? 'missing' : 'valid'} licenseExpiresAt="2027-01-01" fingerprint="A1B2-C3D4-E5F6-7890"
    deactivationCode={codeOpen ? 'MOCK-DEACTIVATION-0005' : null} deactivateError={null} isDeactivating={false} labels={ABOUT_TAB_LABELS}
    onOpenDeactivateConfirm={() => setConfirm(true)} onCloseDeactivationCode={() => setCodeOpen(false)}
    updateSection={<UpdateSectionView currentVersion="0.0.5" status={update} availableVersion={update === 'idle' || update === 'checking' ? null : '0.0.6-mock'} progress={update === 'downloaded' ? 1 : 0.5} error={null} labels={UPDATE_SECTION_LABELS}
      onCheckForUpdates={() => { setUpdate('checking'); setResult('Mock update check; no network request.'); onMockAction('update-check') }}
      onDownloadUpdate={() => { setUpdate('downloading'); setResult('Mock download; no file transfer.'); onMockAction('update-download') }}
      onInstallUpdate={() => { setUpdate('idle'); setResult('Mock update install requested; application was not restarted.'); onMockAction('update-install') }} />} />
    <p role="status">{result}</p>
    {confirm && <MockConfirm title="Deactivate mock license?" onCancel={() => setConfirm(false)} onConfirm={() => { setConfirm(false); setDeactivated(true); setCodeOpen(true); onMockAction('license-deactivate') }} />}</>
}
