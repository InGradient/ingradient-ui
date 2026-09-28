# Storybook 화면·부품·실험 분류

Storybook의 위치는 **사용 여부**가 아니라 검토하는 계약의 범위를 뜻한다. `Pages/Platform`과 `Pages/Edge`는 fixture와 controlled state를 결합한 화면·workflow이며, `Components/Platform`과 `Components/Edge`는 그 화면을 이루는 패키지 부품의 단독 상태·키보드·접근성 계약이다. 부품이 화면에 그려진다는 이유만으로 단독 스토리를 중복으로 간주하지 않는다. 이 사이드바 분류는 제품 패키지의 production import 계층을 변경하지 않는다.

2026-09-27 정리 결과: 최상위 분류는 11개 → 6개, 스토리는 891개 → 887개. 제품 부품 310개를 기존 `Components` 아래에 모아 총 555개, Builder·Sandbox·Hook의 예시 18개를 기존 `Guides` 아래에 모아 총 20개다. Builder의 작성·export 도구와 Sandbox의 통합 비교는 Pages에서 import되지 않는 것이 정상이다.

| 분류 | 소스 | 유지 기준 |
| --- | --- | --- |
| `Pages/Platform`, `Pages/Edge` | `stories/pages/{platform,edge}/` | 버전별 화면 상태, 시나리오, 화면 사이의 workflow |
| `Components/Platform`, `Components/Edge` | `packages/{platform,edge}-pages/src/` | 화면에서 분리해서 확인해야 하는 제품 부품 상태·조작·접근성 |
| `Components/Data Display` | `src/components/data-display/` | 제품 패키지가 아니라 공용 UI에서 정의한 부품 |
| `Guides/Builders`, `Guides/Examples`, `Guides/Hooks` | `stories/builders/`, `stories/sandboxes/`, `src/hooks/` | 제품 화면에는 없는 프리셋 편집·복합 상태 비교·hook 사용 예시 |

## 중복 판정과 ID 호환

- 시각적으로 유사해도 **상태, 상호작용, 접근성 또는 비교 도구**가 다르면 보존한다. `ThemeBuilder`의 토큰 프리셋 export는 `Theme Lab`의 전역 모드 검사로 대체되지 않는다. `useClickOutside`는 `Hooks Lab`의 네 가지 다른 hook과 중복되지 않는다.
- 동일한 상태가 페이지 workflow에 이미 있다면 단독 스토리에서 다시 나열하지 않는다. `DashboardOverviewPanel`의 `NoProject`, `Loading`, `ErrorState`, `NoData` 정적 상태는 `Pages/Platform/0.0.1/Dashboard/System States`의 `NoProjectSelected`, `Loading`, `LoadError`, `NoAnalysisData`를 사용한다. 이 부품의 `WithBody`와 `WithDatePopoverOpen`은 고유한 부분 화면 검토이므로 남긴다.
- 분류를 옮긴 기존 스토리 메타에는 **이전 컴포넌트 ID를 `id`로 명시**한다. 따라서 기존 story URL, 시각 기준선, 프로브, 리뷰 링크는 계속 유효하다. 위 네 가지 제거된 상태 ID만 더 이상 제공되지 않는다. 새 분류명으로 별도 ID를 만들지 않는다.
- 공용 `Card`의 예전 `Components/DataDisplay` 표기도 같은 `Components/Data Display`로 합쳤다. 이 스토리 ID 또한 유지한다.
- 소스 부품, public export, `stories/builders/review-builders.ts`와 필수 Sandbox seed는 삭제하지 않는다. 부품 사용처와 story 소비자는 별개다.

정리 검증: 이전/이후 Storybook index의 ID 집합을 대조하고, 제거된 네 상태만 차이가 나는지 확인한다. `tsc`, Storybook interaction/a11y, 문서 커버리지, 정적 빌드, 화면 probe 및 기준선 검사를 재실행한다.

이번 정리 검증 결과: 기존 891개 story ID 중 위 네 개만 제거, 새 ID 없음; Docs ID 173개 전부 유지. Storybook browser 298파일·887테스트, unit 99파일·462테스트, Edge 정적 route 19건, Dashboard 정적 시나리오 16건, Catalog 정적 시나리오 22건 통과. TypeScript, lint, 문서 커버리지, 정적 Storybook 빌드 통과. 시각 snapshot 비교는 Linux 기준선이므로 이 macOS 실행에서 갱신하거나 통과로 간주하지 않는다.
