// Settings > Judge model 탭 라벨 + view props.
//
// 판독 모델의 상태와, 지금 프로젝트에서 모델 클래스를 어느 라벨링 클래스로 볼지(1:1).
// 모델이 준비되기 전에는 클래스를 모른다(모델을 열어야 안다) — 상태만 보인다.

export type JudgeModelState =
  | 'checking' | 'unreachable' | 'not_installed' | 'starting' | 'loading' | 'ready' | 'failed'

export interface JudgeClassLinkRow {
  modelKey: string
  modelName: string
  /** 고른 라벨링 클래스. '' 이면 연결 안 됨. */
  classId: string
  /** 이름이 같아서 앱이 골라 둔 값 — 저장해야 확정이다. */
  suggested: boolean
}

export interface JudgeTabLabels {
  title: string
  model: string
  state: Record<JudgeModelState, string>
  noProject: string
  classes: string
  classesHint: string
  noProjectClasses: string
  unlinked: string
  suggested: string
  unlinkedWarn: (names: string) => string
  save: string
}

export interface JudgeTabViewProps {
  state: JudgeModelState
  /** 모델 판 번호. 있으면 상태 뒤에 붙는다. */
  version?: string | null
  /** 실패 이유. 실패일 때만 붙는다. */
  detail?: string | null
  /** 열린 프로젝트가 있는지 — 클래스 연결은 프로젝트마다 따로다. */
  hasProject: boolean
  projectClasses: Array<{ id: string; name: string }>
  classesLoading: boolean
  rows: JudgeClassLinkRow[]
  /** 연결 안 된 모델 클래스 이름. */
  unlinkedNames: string[]
  /** 저장하지 않은 바뀐 값이 있다. */
  dirty: boolean
  /** 저장 결과 한 줄. */
  message: string | null
  labels: JudgeTabLabels
  onChangeLink: (modelKey: string, classId: string) => void
  onSave: () => void
}
