export type MockDevice = {
  id: string
  name: string
  status: 'online' | 'offline' | 'capturing'
  lastSeenAt: string
}

export const mockDevices: MockDevice[] = [
  { id: 'dev-001', name: 'Line A — Camera 1', status: 'online', lastSeenAt: '2 min ago' },
  { id: 'dev-002', name: 'Line A — Camera 2', status: 'capturing', lastSeenAt: 'now' },
  { id: 'dev-003', name: 'Line B — Camera 1', status: 'offline', lastSeenAt: '14 min ago' },
  { id: 'dev-004', name: 'QC Bench', status: 'online', lastSeenAt: '1 min ago' },
]

export type MockDataset = {
  id: string
  name: string
  imageCount: number
  lastCapturedAt: string
}

export const mockDatasets: MockDataset[] = [
  { id: 'ds-001', name: 'Wafer batch 2026-05', imageCount: 1240, lastCapturedAt: '10 min ago' },
  { id: 'ds-002', name: 'Wafer batch 2026-04', imageCount: 3018, lastCapturedAt: '3 days ago' },
  { id: 'ds-003', name: 'Defect samples', imageCount: 412, lastCapturedAt: '1 day ago' },
]

export type MockLicense = {
  key: string
  status: 'valid' | 'expired' | 'unbound'
  boundDeviceFingerprint?: string
  expiresAt?: string
}

export const mockLicense: MockLicense = {
  key: 'INGR-EDGE-9F4C-A283-7E11',
  status: 'valid',
  boundDeviceFingerprint: 'a3:f1:9c:22:de:48',
  expiresAt: '2027-04-30',
}
