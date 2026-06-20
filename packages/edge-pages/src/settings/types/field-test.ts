// Settings > Field Test 탭 라벨 + view props.

export interface FieldTestTabLabels {
  title: string
  description: string
  run: string
  running: string
  cancel: string
  reset: string
  export: string
  noResults: string
}

export interface FieldTestTabViewProps {
  running: boolean
  progress: number
  hasResults: boolean
  log: string[]
  labels: FieldTestTabLabels
  onRun: () => void
  onCancel: () => void
  onReset: () => void
  onExport: () => void
}
