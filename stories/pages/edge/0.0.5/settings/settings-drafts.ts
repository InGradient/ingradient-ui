import { useEffect, useState } from 'react'
import type { AnyCamera, NicCandidate, ServerRuntimeMode, UpdateStatus } from '@ingradient/edge-pages'
import { SAMPLE_BACKEND_LOGS, SAMPLE_FRONTEND_LOGS, SAMPLE_CAMERAS, SAMPLE_NIC_CANDIDATES } from '../../../../fixtures/edge/0.0.5'

export const DEFAULT_DLL = 'C:\\Program Files\\CREVIS\\cvsCam\\cvsCam.dll'

export function useConnectionDraft() {
  return {
    cameras: useState<AnyCamera[]>(SAMPLE_CAMERAS),
    camera: useState<AnyCamera | null>(SAMPLE_CAMERAS[0] ?? null),
    nic: useState<NicCandidate | null>(SAMPLE_NIC_CANDIDATES[0] ?? null),
    connected: useState(true), nicEnabled: useState(true), result: useState(''),
    forceId: useState<string | null>(null), ip: useState('192.168.1.10'), subnet: useState('255.255.255.0'),
  }
}

export function useDeviceDraft() {
  return {
    baseUrl: useState('https://app.ingradient.ai'),
    runtimeMode: useState<ServerRuntimeMode>('auto'),
    serverResult: useState<'connected' | 'no-connect' | 'error' | null>(null),
    dllPath: useState(DEFAULT_DLL),
    cameraResult: useState<'success' | 'error' | null>(null),
    result: useState(''),
  }
}

/** Timers belong to the session, so switching tabs/closing settings does not cancel work.
 * Unmounting the Workspace cancels the timers. No device, disk or network work occurs. */
export function useMaintenanceDraft() {
  const cache = useState<'idle' | 'running' | 'done'>('idle')
  const field = useState<'idle' | 'running' | 'cancelled' | 'done'>('idle')
  const progress = useState(0)
  const update = useState<UpdateStatus>('idle')
  useEffect(() => {
    if (cache[0] !== 'running') return
    const timer = setTimeout(() => cache[1]('done'), 700)
    return () => clearTimeout(timer)
  }, [cache[0]])
  useEffect(() => {
    if (field[0] !== 'running') return
    const timer = setTimeout(() => {
      if (progress[0] >= 75) { progress[1](100); field[1]('done') }
      else progress[1](progress[0] + 25)
    }, 300)
    return () => clearTimeout(timer)
  }, [field[0], progress[0]])
  useEffect(() => {
    if (update[0] !== 'checking' && update[0] !== 'downloading') return
    const timer = setTimeout(() => update[1](update[0] === 'checking' ? 'available' : 'downloaded'), 700)
    return () => clearTimeout(timer)
  }, [update[0]])
  return { cache, field, progress, update, deactivated: useState(false), cacheResult: useState(''), fieldResult: useState(''), aboutResult: useState('') }
}

export function useLogsDraft() {
  return {
    source: useState<'backend' | 'frontend'>('backend'),
    query: useState(''), level: useState('all'),
    backend: useState(SAMPLE_BACKEND_LOGS), frontend: useState(SAMPLE_FRONTEND_LOGS),
    result: useState(''),
  }
}

export function isMockServerUrl(value: string): boolean {
  try { return ['http:', 'https:'].includes(new URL(value).protocol) } catch { return false }
}

export function isIpv4(value: string): boolean {
  const parts = value.split('.')
  return parts.length === 4 && parts.every((part) => /^\d{1,3}$/.test(part) && Number(part) <= 255)
}
export function isSubnet(value: string): boolean {
  if (!isIpv4(value)) return false
  const bits = value.split('.').map((part) => Number(part).toString(2).padStart(8, '0')).join('')
  return /^1+0+$/.test(bits)
}
