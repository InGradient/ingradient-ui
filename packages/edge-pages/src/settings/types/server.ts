// Settings > Server 탭 라벨 + view props.

export type ServerRuntimeMode = 'auto' | 'online' | 'offline'

export interface ServerTabLabels {
  baseUrl: string
  runtimeMode: string
  modeAuto: string
  modeOnline: string
  modeOffline: string
  save: string
  saving: string
  saved: string
  saveError: string
  connectivityCheck: string
  connected: string
  noConnect: string
  hint: string
}

export interface ServerTabViewProps {
  baseUrl: string
  runtimeMode: ServerRuntimeMode
  saving: boolean
  saveResult: 'connected' | 'no-connect' | 'error' | null
  saveMessage: string | null
  connectivityResult: 'online' | 'offline' | 'checking' | null
  labels: ServerTabLabels
  onBaseUrlChange: (value: string) => void
  onRuntimeModeChange: (value: ServerRuntimeMode) => void
  onSave: () => void
}
