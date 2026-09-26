// Settings > Capture 탭 라벨 + view props.
//
// 위상을 어떻게 얻을지 고르는 화면이다. 끄면 지금까지의 방식(프린지 여러 장 → 위상천이
// 계산), 켜면 모델이 한 장으로 예측한다. 촬영 패턴도 장수도 달라져서 켜고 끄면 시퀀스
// 전체가 바뀐다.
//
// 프로젝트 설정이 아니라 장비 공통이다 — 모델이 앱과 함께 배포되므로 어느 프로젝트를 열든
// 같은 방식으로 찍는다. 그래서 Lighting 탭과 달리 project_type 을 보지 않는다.

export interface CaptureTabOption {
  value: string
  label: string
  /** 이 값을 고르면 아래에 붙는 설명. 없으면 안 붙는다. */
  hint?: string
}

export interface CaptureTabLabels {
  title: string
  aiModeLabel: string
  aiModeDesc: string
  /** AI 모드를 껐을 때 붙는 설명. */
  classicHint: string
  aiSection: string
  aiPattern: string
  aiPatternHint: string
  /** 모델을 못 쓸 때 어떻게 할지. */
  aiFallback: string
  /** 촬영 중이라 바꿀 수 없을 때. */
  capturingHint: string
}

export interface CaptureTabViewProps {
  /** 켜면 모델 한 장 예측, 끄면 위상천이. */
  aiEnabled: boolean
  aiPattern: string
  patternOptions: CaptureTabOption[]
  aiFallback: string
  fallbackOptions: CaptureTabOption[]
  /** 촬영 중에는 전부 잠근다 — 시퀀스 도중에 바뀌면 장수가 어긋난다. */
  isCapturing: boolean
  labels: CaptureTabLabels
  onToggleAi: (enabled: boolean) => void
  onChangePattern: (value: string) => void
  onChangeFallback: (value: string) => void
}
