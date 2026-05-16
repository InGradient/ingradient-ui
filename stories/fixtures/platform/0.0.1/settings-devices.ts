import type { DeviceLicense, DeviceRow, DeviceOption, DevicesLicenseSectionExpiry } from '@ingradient/ui/patterns'

export const mockDeviceLicense: DeviceLicense = {
  planCode: 'PRO_OFFLINE',
  offlineEnabled: true,
  offlineMaxDays: 14,
  maxUsers: 50,
  maxDevices: 10,
  expiresAt: '2026-12-31',
}

export const mockDeviceLicenseExpiry: DevicesLicenseSectionExpiry = {
  label: '2026-12-31 (231 days)',
  tone: 'ok',
}

export const mockDevices: DeviceRow[] = [
  { id: 'd-1', deviceUid: 'ABC-123-XYZ', name: 'Edge-A1', status: 'ACTIVE', registeredAt: '2026-01-15', lastSeenAt: '2026-05-14T08:30:00Z' },
  { id: 'd-2', deviceUid: 'DEF-456-UVW', name: null, status: 'ACTIVE', registeredAt: '2026-02-20', lastSeenAt: '2026-05-13T14:22:00Z' },
  { id: 'd-3', deviceUid: 'GHI-789-RST', name: 'Edge-B2', status: 'REVOKED', registeredAt: '2025-11-30', lastSeenAt: '2026-03-01T11:00:00Z' },
  { id: 'd-4', deviceUid: 'JKL-012-MNO', name: 'Edge-C3', status: 'ACTIVE', registeredAt: '2026-04-01', lastSeenAt: null },
  { id: 'd-5', deviceUid: 'PQR-345-STU', name: 'Edge-D4', status: 'ACTIVE', registeredAt: '2026-04-15', lastSeenAt: '2026-05-12T16:45:00Z' },
]

export const mockActiveDeviceOptions: DeviceOption[] = mockDevices
  .filter((d) => d.status === 'ACTIVE')
  .map((d) => ({ id: d.id, deviceUid: d.deviceUid, name: d.name }))

export const mockIssuedToken = {
  token: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJlZGdlLWExIiwidmFsaWRVbnRpbCI6IjIwMjctMDEtMDFUMDA6MDA6MDBaIn0.signature',
  validUntil: '2027-01-01T00:00:00Z',
  deviceUid: 'ABC-123-XYZ',
}
