import type { LogPanelEntry } from './types'

export type DatePreset = 'all' | 'today' | 'last7' | 'last30' | 'custom'

export function isDebugLog(log: LogPanelEntry): boolean {
  const m = log.msg ?? ''
  return m.includes('[DEBUG]')
}

export function isCaptureResultLog(log: LogPanelEntry): boolean {
  const m = log.msg ?? ''
  return m.includes('Capture saved.') || m.includes('Capture failed') || m.includes('Capture skipped') ||
    m.includes('라벨 저장 완료') || m.includes('[SEQ success') || m.includes('[SEQ failure') ||
    m.includes('Test Shot captured') || m.includes('Test Shot failed') ||
    m.includes('Sequence start failed') || m.includes('Edge capture error')
}

export function isProgressLog(log: LogPanelEntry): boolean {
  const m = log.msg ?? ''
  return m.includes('Broadcasting') || /Found \d+ camera/i.test(m) || m.includes('Testing GVCP') ||
    m.includes('Initializing video stream') || m.includes('Ping OK') ||
    (m.includes('Camera:') && m.includes('S/N:')) || m.includes('Selected camera:') ||
    m.includes('Disconnecting...') || m.includes('Auto-selected the only camera') ||
    /^\s*✓/.test(m.replace(/^\[\d{1,2}:\d{2}:\d{2}\]\s*/, '')) || m.includes('Discovery failed') ||
    m.startsWith('→') || m.includes('백엔드 재시작') || m.includes('3초 후 자동으로') || m.includes('백엔드가 준비되었습니다')
}

export function isConnectionsLog(log: LogPanelEntry): boolean {
  const m = log.msg ?? ''
  return m.includes('Connection established') || m.includes('Disconnected.') ||
    m.includes('Failed to start video stream') || m.includes('Connection failed') ||
    m.includes('No GigE Vision cameras found') || m.includes('Disconnect failed') ||
    m.includes('Live stream failed to load') || m.includes('Check cable') || m.includes('Verify IP') ||
    m.includes('capture-agent service is running') || m.includes('백엔드(18080)에 연결') ||
    m.includes('백엔드 재시작에 실패') || m.includes('재시작 실패')
}

export function logPassesDateFilter(log: LogPanelEntry, preset: DatePreset, fromDate: string, toDate: string): boolean {
  const createdAt = log.createdAt
  if (!createdAt) return preset === 'all'
  const logDate = new Date(createdAt)
  const now = new Date()
  const todayStart = new Date(now.getFullYear(), now.getMonth(), now.getDate()).getTime()
  const logTime = logDate.getTime()
  switch (preset) {
    case 'all': return true
    case 'today': return new Date(logDate.getFullYear(), logDate.getMonth(), logDate.getDate()).getTime() === todayStart
    case 'last7': return logTime >= now.getTime() - 7 * 86400000
    case 'last30': return logTime >= now.getTime() - 30 * 86400000
    case 'custom': {
      if (!fromDate && !toDate) return true
      const from = fromDate ? new Date(fromDate).getTime() : 0
      const to = toDate ? new Date(toDate).setHours(23, 59, 59, 999) : Infinity
      return logTime >= from && logTime <= to
    }
    default: return true
  }
}

export function getTimeFromMsg(msg: string): string {
  const m = msg.match(/^\[(\d{1,2}:\d{2}:\d{2})\]/)
  return m ? m[1] : ''
}
