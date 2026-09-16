// Settings > General 탭 라벨 + view props.
//
// 지금은 촬영 완료 알림 하나다. 소리와 메시지는 **서로 독립적인 토글**이다 —
// "소리만" 이 가장 흔한 사용 방식이라 한쪽을 다른 쪽의 하위 옵션으로 두지 않는다.

export interface GeneralTabSoundOption {
  id: string
  label: string
}

export interface GeneralTabLabels {
  title: string
  captureDoneSection: string
  captureDoneDesc: string
  soundLabel: string
  soundDesc: string
  soundPreview: string
  volumeLabel: string
  volumeDesc: string
  /** OS 가 소리를 내는 경우(Windows 기본 알림음) 음량 조절이 닿지 않는다는 안내. */
  volumeSystemHint: string
  messageLabel: string
  messageDesc: string
  messageTest: string
  messageTestFailed: string
  messageHint: string
}

export interface GeneralTabViewProps {
  soundEnabled: boolean
  soundOptions: GeneralTabSoundOption[]
  selectedSoundId: string
  /** 0~100. 앱은 0~1 로 들고 있지만 슬라이더 단위를 그대로 받는다. */
  volumePercent: number
  /** OS 가 내는 알림음이면 배율이 닿지 않으므로 슬라이더를 잠근다. */
  volumeLocked: boolean
  messageEnabled: boolean
  /** 토스트는 집중 지원·앱별 차단으로 오류 없이 안 뜰 수 있어 결과를 그대로 보여준다. */
  testResult: 'ok' | 'failed' | null
  labels: GeneralTabLabels
  onToggleSound: (enabled: boolean) => void
  onSelectSound: (id: string) => void
  /** 행 선택과 별개로 그 소리만 들어 본다. */
  onPreviewSound: (id: string) => void
  onChangeVolume: (percent: number) => void
  /** 드래그를 놓는 순간에만 들려준다 — 매 프레임 재생하면 소리가 겹쳐 뭉갠다. */
  onPreviewVolume: () => void
  onToggleMessage: (enabled: boolean) => void
  onTestMessage: () => void
}
