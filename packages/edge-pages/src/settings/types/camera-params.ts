// Settings > Camera Params 탭 라벨 + view props.

export interface CameraParamsTabLabels {
  title: string
  dllPath: string
  applyDllPath: string
  reload: string
  saved: string
  save: string
  exposure: string
  gain: string
  blackLevel: string
  sharpness: string
  gamma: string
  // many more — simplified for Phase 9
  [key: string]: string
}

export interface CameraParamsTabViewProps {
  isConnected: boolean
  cvsCamDllPath: string
  fetching: boolean
  saving: boolean
  saveResult: 'success' | 'error' | null
  labels: CameraParamsTabLabels
  onDllPathChange: (path: string) => void
  onApplyDllPath: () => void
  onSave: () => void
  onReset: () => void
}
