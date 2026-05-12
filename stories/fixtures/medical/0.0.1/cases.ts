export type MockCase = {
  id: string
  patientLabel: string  // anonymized
  modality: 'CT' | 'MRI' | 'X-ray' | 'Ultrasound'
  studyDate: string
  status: 'pending' | 'in-review' | 'completed'
  imageCount: number
}

export const mockCases: MockCase[] = [
  { id: 'c-001', patientLabel: 'PAT-2026-0412', modality: 'CT', studyDate: '2026-05-08', status: 'pending', imageCount: 248 },
  { id: 'c-002', patientLabel: 'PAT-2026-0413', modality: 'MRI', studyDate: '2026-05-08', status: 'in-review', imageCount: 160 },
  { id: 'c-003', patientLabel: 'PAT-2026-0414', modality: 'CT', studyDate: '2026-05-07', status: 'completed', imageCount: 312 },
  { id: 'c-004', patientLabel: 'PAT-2026-0415', modality: 'X-ray', studyDate: '2026-05-07', status: 'pending', imageCount: 4 },
  { id: 'c-005', patientLabel: 'PAT-2026-0416', modality: 'Ultrasound', studyDate: '2026-05-06', status: 'in-review', imageCount: 28 },
]

export type MockClass = {
  id: string
  label: string
  color: string
  count: number
}

export const mockClasses: MockClass[] = [
  { id: 'cls-001', label: 'Lesion', color: '#ef4444', count: 312 },
  { id: 'cls-002', label: 'Calcification', color: '#f59e0b', count: 187 },
  { id: 'cls-003', label: 'Cyst', color: '#3b82f6', count: 94 },
  { id: 'cls-004', label: 'Other', color: '#6b7280', count: 41 },
]
