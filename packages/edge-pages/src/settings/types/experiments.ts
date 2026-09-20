// Settings > Experiments 탭 라벨 + view props.
//
// 촬영 한 번에 어떤 프린지 주기를 찍을지 정하는 화면이다. 주기 하나가 (composite + 2n)장이라
// 한 줄을 더하면 촬영 시간이 몇 분 늘어난다 — 그래서 총 장수를 항상 띄운다.
//
// 총 장수와 기준 주기 계산은 프로젝트 설정·Setup 오버라이드를 알아야 하므로 consumer 가 한다.
// 이 View 는 계산 결과를 labels.total 문장과 primaryIndex 로 받아서 보여주기만 한다.

export interface ExperimentsTabLabels {
  title: string
  enabledLabel: string
  enabledDesc: string
  disabledHint: string
  periodsSection: string
  /** 목록에서 같은 값이 앞에 또 있을 때 그 행에 붙는다. */
  duplicate: string
  /** 기준 주기(촬영이 실제로 기준 삼는 값)인 행에 붙는다. */
  primaryBadge: string
  addPeriod: string
  removePeriod: string
  /** 몇 번째 주기인지 읽어 주는 스크린리더 문구. 인덱스는 View 안에서만 알 수 있어 함수로 받는다. */
  periodAria: (position: number) => string
  /** 허용 범위 안내. 완성된 문장으로 받는다 — consumer 가 limits 를 알고 있다. */
  periodsHint: string
  compositeLabel: string
  compositeDesc: string
  compositeSteps: string
  /** 이번 설정으로 찍히는 총 장수 문장. 완성된 문장으로 받는다. */
  total: string
}

export interface ExperimentsTabLimits {
  minPeriod: number
  maxPeriods: number
  maxCompositeSteps: number
}

export interface ExperimentsTabViewProps {
  enabled: boolean
  fringePeriods: number[]
  /** 기준 주기의 인덱스. 해당 행에 primaryBadge 를 붙인다. 없으면 -1. */
  primaryIndex: number
  compositeEnabled: boolean
  compositeSteps: number
  limits: ExperimentsTabLimits
  labels: ExperimentsTabLabels
  onToggleEnabled: (enabled: boolean) => void
  onChangePeriod: (index: number, period: number) => void
  onAddPeriod: () => void
  onRemovePeriod: (index: number) => void
  onToggleComposite: (enabled: boolean) => void
  onChangeCompositeSteps: (steps: number) => void
}
