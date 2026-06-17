# ingradient-ui Storybook 전환 및 운영 계획

작성일: 2026-04-21

---

## 한 줄 결론

이 계획은 `apps/design-showcase`의 live example 역할을 Storybook으로 옮기기 위해 작성되었고, 현재 그 전환은 완료되어 Storybook이 기본 운영면이 되었다.

목표는 단순한 개발자용 스토리 모음이 아니다.

- 디자이너가 상태, 조합, 테마, 밀도, 역할, mock data를 직접 바꿔 보며 판단할 수 있는 디자인 시스템 허브
- 다른 프로젝트 개발자가 `@ingradient/ui`를 가져다 쓸 때 기준으로 삼는 공식 사용 포털
- 팀이 회귀 테스트, 접근성, 시각 검증까지 한곳에서 돌릴 수 있는 실행 허브

즉, Storybook은 `보조 문서`가 아니라 `ingradient-ui의 주 운영면`이 되어야 한다.

---

## 목표 운영 모델

### 디자이너

디자이너는 Storybook에서 아래를 직접 다룰 수 있어야 한다.

- 컴포넌트 variant 비교
- theme / dark mode / density / viewport 전환
- loading / empty / error / permission 상태 확인
- 실제에 가까운 page/pattern 조합 검토
- Figma와 구현 결과 비교
- 변경 전후 visual regression 확인

단, 디자이너가 직접 수정하는 표면은 **안전한 편집 계층**으로 제한한다.

- story args
- preset scenario
- fixture/mock data
- MDX 사용 가이드
- design token source 또는 token editor 성격의 입력

### ingradient-ui 관리자

디자인 시스템 관리자 역할은 Storybook을 통해 아래를 관리한다.

- public component catalog
- canonical usage example
- component contract와 visual intent
- release별 UI snapshot
- cross-project 공유 URL

### 다른 프로젝트 개발자

소비 프로젝트 개발자는 Storybook을 보고 아래를 바로 판단할 수 있어야 한다.

- 어떤 컴포넌트를 써야 하는가
- 어떤 props와 variants가 있는가
- 어떤 상태를 기본으로 지원하는가
- 실제 페이지에서 어떻게 조합하는가
- dark/mobile/role 별로 어떻게 보이는가

---

## 북극성

장기적으로 `ingradient-ui`는 아래 구조를 목표로 한다.

1. `@ingradient/ui`는 배포되는 디자인 시스템 패키지다.
2. Storybook은 이 패키지의 공식 브라우저 포털이다.
3. `apps/design-showcase`는 신규 투자 대상이 아니며 Storybook으로 단계적으로 이관한다.
4. `docs/reference/**`는 보조 markdown 문서와 유지보수 문서로 축소한다.

즉, 앞으로는 `Storybook first`, `package first`, `consumer first`가 기준이다.

---

## 핵심 원칙

### 1. Storybook first

새 public export, 새 variant, 새 interaction은 Storybook entry 없이 추가하지 않는다.

최소 요구:

- canonical story
- states story
- 필요한 mock/provider 설정
- docs/autodocs 반영

### 2. Props-only가 아니라 scenario-first

디자이너 친화적인 Storybook은 단순히 Controls만 많은 상태가 아니다.
raw prop을 전부 노출하는 것만으로는 판단이 어렵다.

그래서 Storybook은 두 층으로 만든다.

- low-level playground: 개발자용 raw props/args
- scenario layer: 디자이너용 의미 있는 상태 전환

예:

- `size = sm | md | lg` 같은 prop control
- `density = compact | default | spacious` 같은 semantic control
- `role = viewer | editor | admin`
- `dataPreset = empty | short | long | error`

### 3. Live example를 story로 흡수

기존 showcase의 live example는 page story, pattern story, docs MDX로 이관한다.

즉:

- 컴포넌트 데모 -> component story
- 여러 컴포넌트 조합 -> pattern story
- 실제 화면 흐름 -> page story
- 설명형 안내 -> MDX docs

### 4. 소비 프로젝트 기준으로 검증

Storybook은 라이브러리 내부 구현이 아니라 `소비자가 보는 API와 결과`를 보여줘야 한다.

따라서 반드시 확인해야 한다.

- export path
- theme provider 적용 방식
- tokens 적용 결과
- empty/error/loading behavior
- responsive behavior
- permission/context 차이

### 5. 디자이너가 건드릴 수 있는 안전한 표면을 만든다

디자이너가 바로 component source를 수정하게 하면 유지보수가 깨진다.
대신 Storybook 안에서 아래를 쉽게 바꿀 수 있게 만들어야 한다.

- 전역 toolbar
- scenario preset
- fixture data
- MDX guide
- token 값 미리보기

---

## 운영 거버넌스

Storybook을 주 운영면으로 쓰려면 누가 무엇을 바꾸는지부터 고정해야 한다.

### 역할 분리

- 디자이너:
  - scenario 검토
  - review story 기준 정의
  - token 변경 제안
  - do / don't, usage guideline 검토
- 디자인 시스템 관리자:
  - story 구조 유지
  - token/source 반영
  - release cut
  - visual baseline 승인
- 라이브러리 개발자:
  - component 구현
  - props/JSDoc 유지
  - play/a11y/test 보강
- 소비 프로젝트 개발자:
  - 사용성 피드백
  - consumer 관점 regression 제보

### 수정 가능 범위

디자이너가 직접 바꿔도 되는 영역:

- story args
- scenario preset 정의
- fixture/mock data 제안 또는 수정
- MDX guide 초안
- token 값 제안

디자이너가 직접 바꾸지 않는 영역:

- public component source
- export 구조
- provider wiring
- test infra
- release config

### 승인 규칙

- token 변경: 디자인 승인 + 코드 리뷰
- public API 변경: 라이브러리 코드 리뷰 필수
- visual baseline 갱신: 디자인 시스템 관리자 승인
- `stable` 컴포넌트의 breaking change: migration note 필수

### surface ownership

역할 분리만으로는 운영이 안 된다.
각 public surface에는 실제 owner가 있어야 한다.

최소 단위:

- component family owner
- pattern/page owner
- guide/reference owner
- visual baseline 승인 owner

권장 규칙:

- `stable` surface는 owner 없이 두지 않는다
- Storybook story와 `docs/reference/**`는 같은 owner 그룹이 본다
- consumer smoke에서 깨지는 surface는 해당 owner가 우선 대응한다
- owner 정보는 CODEOWNERS, PR template, component index 중 한 곳에서 찾을 수 있어야 한다

### freshness audit

Storybook은 한 번 만드는 것보다 오래 최신 상태를 유지하는 것이 더 어렵다.

최소 규칙:

- public export 전체를 정기적으로 coverage audit 한다
- `stable` surface는 분기마다 한 번 이상 freshness를 점검한다
- 오래된 story, stale fixture, dead guide 링크는 audit 대상에 포함한다
- audit 결과는 migration tracker 또는 coverage matrix에 남긴다

---

## Source Of Truth

문서가 많아질수록 우선순위를 고정해야 충돌이 줄어든다.

### 우선순위

1. 실제 API 계약: TypeScript source
2. prop 설명과 사용 의도: JSDoc
3. 실행 가능한 canonical example: Storybook story
4. 서술형 가이드와 조합 설명: Storybook MDX
5. 운영/보조/긴 설명: `docs/reference/**`

### 규칙

- props 이름, 타입, 기본 계약은 source가 정본이다
- props 설명과 대체재 안내는 JSDoc가 정본이다
- 대표 사용 예시와 상태 전시는 story가 정본이다
- onboarding, workflow, pattern cookbook은 MDX가 정본이다
- 릴리즈 노트와 maintainer rule은 `docs/`가 정본이다

### 동기화 규칙

아래가 바뀌면 함께 수정한다.

- 새 public export
- prop contract 변경
- variant 추가/삭제
- interaction 변경
- token/theme 영향 변경

동기화 대상:

- source
- JSDoc
- 관련 story
- 필요한 MDX 또는 reference 문서

### story metadata / tags

Storybook이 커지면 사이드바만으로는 찾기 어렵다.
따라서 surface 상태와 검증 수준을 tag로 노출하는 규칙이 필요하다.

권장 tag:

- `stable`
- `beta`
- `deprecated`
- `internal`
- `consumer-verified`
- `mobile-reviewed`
- `a11y-critical`
- `visual-baseline`

규칙:

- `stable` surface는 최소 `consumer-verified` 또는 동등한 검증 근거를 가진다
- `deprecated` surface는 replacement guide 또는 migration note와 같이 노출한다
- `internal` surface는 public-facing promotion에서 제외한다

---

## Storybook이 맡아야 할 역할

### 1. 공식 컴포넌트 카탈로그

- components
- patterns
- pages
- foundations
- tokens

### 2. 공식 디자인 시스템 허브

- 디자인 토큰 설명
- theme 비교
- dark mode
- responsive preview
- role/permission 상태

### 3. 공식 live example 대체제

- 기존 `design-showcase`의 예시를 Storybook story로 이전
- page 단위, pattern 단위, interaction 단위 preview 제공

### 4. 공식 테스트 entrypoint

- play function
- browser-based component tests
- accessibility tests
- visual regression

### 5. 공식 공유 포털

- 배포된 정적 Storybook
- 릴리즈 버전별 접근
- 팀/디자이너/소비 프로젝트 개발자 공통 URL

---

## 정보 구조 제안

### 설치 위치

Storybook은 repo root에 둔다.

이유:

- `@ingradient/ui` 전체 public surface를 다뤄야 한다
- source 옆 colocated story 전략을 쓸 수 있다
- package와 docs 배포를 함께 관리하기 쉽다

권장 프레임워크:

- `@storybook/react-vite`

### 권장 디렉터리

```text
.storybook/
  main.ts
  preview.tsx
  manager.ts
  vitest.setup.ts
  decorators/
  globals/
  mocks/
  presets/

src/
  components/**/Component.stories.tsx
  patterns/**/Pattern.stories.tsx
  tokens/**/Token.stories.tsx

stories/
  docs/
  pages/
  sandboxes/
  fixtures/
  builders/
```

### 사이드바 구조

```text
Foundations
  Colors
  Typography
  Spacing
  Motion
  Themes

Components
  Inputs
  Navigation
  Feedback
  Data Display
  Overlays
  Charts

Patterns
  Form Layouts
  List Detail
  Toolbar
  App Shell

Pages
  Auth
  Dashboard
  Table Page
  Viewer
  Settings

Sandboxes
  Theme Lab
  Density Lab
  State Matrix
  Token Playground

Guides
  Getting Started
  How To Consume
  How To Contribute
  Writing Stories
  Designer Workflow
```

---

## 디자이너 친화형 인터랙션 설계

여기가 핵심이다.

`interactive`를 제대로 만들려면 Controls를 켜는 것만으로는 부족하다.
디자이너는 prop 이름보다 결과를 기준으로 판단한다.

그래서 Storybook에 아래 계층을 만든다.

### 1. 전역 toolbar

모든 story에서 공통으로 바꿀 수 있는 전역 상태:

- `theme`
- `colorMode`
- `density`
- `viewport`
- `locale`
- `role`
- `motion`
- `dataScale`

예:

- `theme = default | brandA | brandB`
- `colorMode = light | dark`
- `density = compact | default | comfortable`
- `role = viewer | editor | admin`
- `dataScale = sparse | realistic | overloaded`

### 2. semantic controls

raw prop을 그대로 노출하지 말고, story에서 의미 있는 상위 control을 제공한다.

예:

- `showHelperText`
- `validationState`
- `contentLength`
- `permissionState`
- `layoutMode`
- `selectionState`

이 값들은 story의 `render` 함수에서 실제 props와 fixture로 매핑한다.

### 3. preset scenario

각 핵심 컴포넌트/패턴마다 빠른 preset을 둔다.

예:

- `Empty`
- `Typical`
- `LongContent`
- `Error`
- `Disabled`
- `AdminEditable`
- `Mobile`

디자이너는 preset만 바꿔도 대부분의 검토가 가능해야 한다.

### 4. state matrix

중요 컴포넌트는 단일 story보다 매트릭스형 review가 유리하다.

예:

- variant x size
- theme x mode
- status x interaction
- role x permission

이 매트릭스는 디자이너 검토용으로 매우 강력하다.

### 5. pattern/page sandbox

컴포넌트만 보면 판단이 안 되는 경우가 많다.
따라서 pattern/page story를 별도로 둬야 한다.

예:

- `TablePage`
- `SettingsPage`
- `ImageViewerWorkspace`
- `AuthPage`

이 story들은 mock provider, mock API, role, viewport를 바꿔가며 검토할 수 있어야 한다.

### 6. token playground

장기적으로 디자이너가 가장 자주 보게 될 곳 중 하나다.

최소 기능:

- color token preview
- spacing/radius/shadow/typography 비교
- theme별 차이 비교
- token이 실제 component/pattern에 미치는 영향 확인

중요:

token playground는 "토큰 값 표"가 아니라 "토큰 변경 결과를 보는 곳"이어야 한다.

### 7. fixture and mock hygiene

interactive Storybook이 강해질수록 fixture 품질이 중요해진다.

최소 규칙:

- 실서비스 데이터, 개인 정보, 민감 정보는 fixture에 넣지 않는다
- fixture는 익명화 또는 synthetic data를 사용한다
- 랜덤 생성 fixture는 deterministic seed를 사용한다
- story 결과가 매 실행마다 달라지는 mock은 기본 검증 story에서 금지한다
- date/time 의존 fixture는 timezone과 기준 시점을 고정한다

권장:

- fixture 이름에서 scale과 목적이 드러나게 한다
- `sparse`, `typical`, `overloaded`, `error` 같은 preset을 공통 vocabulary로 쓴다
- MSW handler와 fixture builder는 재사용 가능하게 분리한다

---

## story 유형 체계

각 public surface는 아래 story 유형을 의식적으로 가진다.

### 1. Playground

- raw args 중심
- 개발자용
- prop 실험용

### 2. Review

- 디자이너용 대표 상태 묶음
- matrix 또는 preset 중심

### 3. Scenario

- 실제 사용 맥락에서 보는 상태
- fixture/provider/mock 포함

### 4. Spec

- contract 성격
- edge case, disabled, accessibility, long content 같은 보장 상태

### 5. Page

- live example 대체
- 여러 component와 pattern을 묶은 실제 화면 수준 preview

---

## 기존 design-showcase 대체 전략

### 원칙

당시 기준으로 `apps/design-showcase`에는 새 투자를 멈추고, Storybook으로 흡수하는 것을 원칙으로 삼았다.

### 이관 순서

1. 기존 showcase 항목을 inventory로 만든다.
2. 각 항목을 아래 중 하나로 매핑한다.
   - component story
   - pattern story
   - page story
   - MDX guide
3. Storybook에서 parity를 확보한다.
4. Storybook URL을 팀 기본 진입점으로 바꾼다.
5. 전환 완료 후 `design-showcase`는 제거하거나 redirect 대상으로 전환한다.

### 매핑 기준

- 개별 UI 예시 -> component story
- 조립 예시 -> pattern story
- 앱 화면 데모 -> page story
- 설명 위주 문서 -> MDX guide

### 전환 규칙

- 새 live example은 `design-showcase`에 추가하지 않는다
- 새 예시는 전부 Storybook first
- 제거 전까지의 `design-showcase` 수정은 이관 작업에만 한정한다

### Migration Tracker

실제 전환은 감이 아니라 inventory로 관리한다.

현재 inventory는 [storybook-migration-tracker.md](./storybook-migration-tracker.md)에서 관리한다.

권장 추적 필드:

| 항목 | 현재 위치 | 목표 위치 | 유형 | parity 상태 | showcase 종료 여부 |
| --- | --- | --- | --- | --- | --- |
| example id | `apps/design-showcase/...` | story/mdx 경로 | component/pattern/page/guide | none/partial/done | yes/no |

운영 규칙:

- `parity = done` 전에는 showcase 제거 금지
- 새 Storybook 항목이 기존 showcase 기능을 모두 대체했는지 체크
- 종료된 showcase 항목은 redirect 또는 archive 처리

---

## 소비 프로젝트 검증

Storybook만 멀쩡하고 실제 소비 프로젝트에서 깨지면 실패다.

### 원칙

`@ingradient/ui`는 Storybook 안에서만 검증하지 않는다.
최소 1개의 consumer smoke app 또는 smoke workspace에서 패키지 소비 관점 검증을 해야 한다.

### 최소 검증 항목

- package build 성공
- export path import 성공
- `ThemeProvider`/global style 적용 성공
- 주요 component render 성공
- `tokens.css` 또는 React theme 진입점 정상 동작
- dark/light 전환 시 기본 surface 이상 없음

### 권장 방식

- repo 내 `apps/storybook-smoke-consumer` 또는 동등한 smoke app 추가
- CI에서 아래 순서 실행
  - `npm run build:package`
  - smoke app install/link
  - smoke app build 또는 test

### Storybook과 consumer 검증의 차이

- Storybook:
  - 상태 전시
  - interaction 검토
  - visual/a11y regression
- smoke consumer:
  - 실제 소비 import 검증
  - 배포 산출물 검증
  - provider/bootstrap 검증

---

## 컴포넌트 상태 모델

공식 포털이 되려면 각 surface의 maturity를 보여줘야 한다.

### 상태

- `stable`: 권장 사용 대상. semver 보호를 강하게 받음
- `beta`: 사용 가능하지만 contract가 변할 수 있음
- `deprecated`: 대체재가 있으며 신규 사용 금지
- `internal`: 외부 소비 기준으로는 비공개 성격

### 적용 위치

- Storybook badge 또는 docs note
- MDX guide
- 필요 시 package export 설명

### 규칙

- `deprecated`는 대체 컴포넌트와 migration note를 같이 제공
- `beta`는 review story와 known limitation을 명시
- `internal`은 public promotion 금지

---

## 기능 분류

| 항목 | 분류 | 단계 | 메모 |
| --- | --- | --- | --- |
| 컴포넌트 카탈로그 | 도입 | Phase 1 | Storybook의 기본 역할 |
| 디자인 시스템 허브 | 도입 | Phase 1 | 장기 주 운영면 |
| 고립된 컴포넌트 개발 | 도입 | Phase 1 | 기본 |
| Props Controls | 도입 | Phase 1 | 단, raw controls만으로 끝내지 않음 |
| Args 기반 상태 프리뷰 | 도입 | Phase 1 | 필수 |
| Actions 이벤트 로깅 | 도입 | Phase 1 | 기본 |
| Autodocs 자동 문서 생성 | 도입 | Phase 1 | 기본 |
| MDX 문서 작성 | 도입 | Phase 1 | guides와 onboarding |
| 사용 가이드 문서화 | 도입 | Phase 1 | Storybook docs를 1차 허브로 |
| Props 테이블 자동화 | 도입 | Phase 1 | JSDoc 보강 필요 |
| 컴포넌트 사용 예시 관리 | 도입 | Phase 1 | canonical story로 관리 |
| 페이지 단위 스토리 | 도입 | Phase 1.5 | live example 대체의 핵심 |
| 복합 컴포넌트 조합 검증 | 도입 | Phase 1.5 | pattern/page story |
| Connected Component Mocking | 도입 | Phase 2 | module mock + MSW |
| Context/Provider Mocking | 도입 | Phase 1 | 전역 decorator |
| API 응답 Mocking | 도입 | Phase 2 | MSW |
| REST/GraphQL Mocking | 도입 | Phase 2 | MSW로 통합 |
| Loading / Empty / Error 상태 전시 | 도입 | Phase 1 | 필수 |
| Role / Permission 상태 전시 | 도입 | Phase 1.5 | 디자이너 검토 핵심 |
| Theme 전환 프리뷰 | 도입 | Phase 1 | 전역 toolbar |
| Dark Mode 검증 | 도입 | Phase 1 | 전역 toolbar |
| Responsive 상태 프리뷰 | 도입 | Phase 1 | viewport presets |
| Play Function 상호작용 테스트 | 도입 | Phase 2 | 핵심 흐름부터 |
| 브라우저 기반 컴포넌트 테스트 | 도입 | Phase 2 | Storybook Vitest |
| Story 기반 테스트 실행 | 도입 | Phase 2 | CI 연계 |
| 테스트 커버리지 측정 | 도입 | Phase 2 | story coverage 분리 추적 |
| 접근성 테스트 | 도입 | Phase 2 | a11y addon |
| Visual Regression Testing | 도입 | Phase 3 | 장기 운영 필수 |
| UI 스냅샷 비교 | 도입 | Phase 3 | Chromatic 권장 |
| 회귀 테스트 | 도입 | Phase 3 | visual + play + a11y |
| 정적 문서 사이트 배포 | 도입 | Phase 1 | 공식 공유 포털 |
| 팀 공유용 UI 샌드박스 | 도입 | Phase 1 | designer/dev 공용 |
| Storybook Composition | 조건부 | Phase 4 | 다중 Storybook 생기면 |
| Figma 연동 | 도입 | Phase 3 | 비교 허브 |
| AI Agent 연계 | 실험 | Phase 4 | story 품질 확보 후 |
| MCP Server 연동 | 실험 | Phase 4 | React 기준 가능 |

---

## 단계별 계획

## Phase 1. Storybook 기반 구축

목표:

- Storybook을 팀 기본 허브로 세운다
- 디자이너가 만질 수 있는 전역 인터랙션을 만든다
- 핵심 컴포넌트 카탈로그를 올린다

포함:

- `@storybook/react-vite`
- autodocs
- controls/args/actions
- MDX guides
- global toolbar
- theme/dark/responsive preview
- loading/empty/error states
- static deploy

반드시 포함할 전역 globals:

- theme
- colorMode
- density
- viewport
- locale
- role
- dataScale

반드시 만들 문서:

- Getting Started
- How To Consume `@ingradient/ui`
- How To Contribute Stories
- Designer Workflow
- Story Writing Rules

반드시 만들 초기 story seed:

- Button
- SearchField
- NumberField
- Alert
- EmptyState
- Select
- DialogShell
- Table
- Tabs
- TagList 또는 ImageViewer

## Phase 1.5. live example 이관

목표:

- 기존 `design-showcase`를 Storybook으로 실질 대체하기 시작한다

포함:

- pattern story
- page story
- role/permission preview
- review matrix
- sandbox 그룹

반드시 만들 것:

- `ThemeLab`
- `StateMatrix`
- `TablePage`
- `SettingsPage`
- `AuthPage`
- `ViewerWorkspace` 또는 이에 준하는 대표 page

완료 기준:

- 팀이 live example 확인을 위해 `design-showcase`보다 Storybook을 먼저 연다
- 새 데모 요구가 `Storybook story`로 처리된다

## Phase 2. mock과 테스트 강화

목표:

- Storybook을 QA 허브로 만든다

포함:

- MSW 기반 mock
- connected/page story
- play function
- `@storybook/addon-vitest`
- `@storybook/addon-a11y`
- coverage

완료 기준:

- async UI는 loading/empty/error story를 가진다
- 주요 interaction flow에 play test가 있다
- 접근성 검사가 story 단위로 돈다

### 테스트 안정성 운영 규칙

Story 기반 테스트는 많아질수록 flaky 관리 규칙이 필요하다.

최소 규칙:

- visual test와 play test는 deterministic fixture를 기본으로 쓴다
- clock, locale, timezone이 결과에 영향을 주면 테스트에서 고정한다
- 애니메이션 영향이 큰 story는 reduced motion 기준도 함께 검증한다
- flaky story는 조용히 방치하지 말고 quarantine 상태를 표시한다
- baseline 갱신은 “실제 의도된 UI 변경”이 확인된 경우에만 한다

권장:

- chart, canvas, async polling story는 별도 안정화 메모를 남긴다
- visual test 대상과 interaction test 대상을 의도적으로 분리한다
- 장기 flaky는 component bug인지 story 구성 문제인지 원인을 기록한다

## Phase 3. 회귀 방지와 디자인 검토

목표:

- Storybook을 디자인/QA 승인 허브로 만든다

포함:

- Chromatic
- visual regression
- Figma 링크 또는 비교 패널
- 릴리즈별 static Storybook 운영

완료 기준:

- 디자이너가 PR 변경 전후를 Storybook/Chromatic으로 확인한다
- UI regression을 자동으로 추적한다

## Phase 4. AI 및 고급 연계

포함:

- Storybook manifests
- `@storybook/addon-mcp`
- AI agent 연계
- 필요 시 composition

조건:

- stories와 MDX가 충분히 정리되어 있어야 한다
- JSDoc이 정리되어 있어야 한다
- internal/public story tagging이 분리되어야 한다

---

## 구현 진행 원칙

이 섹션은 `implementation_reading_guide.md`의 구현 원칙을 Storybook 전환 작업에 맞게 적용한 것이다.

### 0. 착수 전 확인

Storybook 관련 작업을 시작할 때 아래가 빠져 있으면 먼저 정리한다.

| 확인 항목 | Storybook 전환 작업에서 확인할 내용 |
| --- | --- |
| 대상 phase | 지금 작업이 Phase 1 / 1.5 / 2 / 3 중 어디에 속하는가 |
| 구현 범위 | 이번에 config만 하는지, story seed까지 하는지, showcase 이관까지 하는지 |
| 대상 surface | 어떤 component / pattern / page / guide를 다루는가 |
| 기존 자산 | `apps/design-showcase`에서 옮길 예시가 있는가 |
| 릴리즈 목표 | 이번 변경이 어떤 릴리즈 또는 내부 milestone에 포함되는가 |
| consumer 영향 | export path, theme, token, docs 링크에 영향이 있는가 |

원칙:

- 범위가 애매하면 먼저 정한다
- 더 나은 구조가 보여도 범위 밖이면 따로 제안하고 분리한다
- 기존 문서/패턴과 충돌하면 그냥 진행하지 않고 기준을 먼저 맞춘다

### 1. 먼저 읽고 시작할 문서

Storybook 작업 전에 아래 문서를 먼저 본다.

- `docs/plan/storybook-adoption-plan.md`
- `docs/guides/STORYBOOK_GUIDE.md`
- `docs/guides/WORKFLOW.md`
- `docs/guides/DOCUMENTATION_STRATEGY.md`
- `docs/guides/DOC_WRITING_RULES.md`
- `docs/guides/CHANGE_GUIDE.md`
- `docs/concepts/ARCHITECTURE.md`
- `docs/concepts/BOUNDARIES.md`

확인 목적:

- Storybook이 문서인지 테스트 허브인지 역할을 다시 확인
- source of truth와 docs 동기화 규칙 확인
- 새 surface가 core인지 app/domain인지 확인

### 2. 기존 코드와 자산을 먼저 파악

새 story를 만들기 전에 아래를 본다.

- 관련 public component source
- 관련 JSDoc
- 기존 `docs/reference/**`
- 기존 `apps/design-showcase` 예시
- coverage matrix와 관련 recipe 문서

원칙:

- 기존 예시가 있으면 재해석해서 옮긴다
- 같은 목적의 story를 새로 중복 생성하지 않는다
- 기존 네이밍과 구조를 먼저 따른다

### 3. 범위를 정확히 자른다

Storybook 도입 작업은 쉽게 과도하게 커진다.
그래서 한 작업은 아래 단위 중 하나로 자른다.

- Storybook infra 설정
- 전역 decorator / globals 설정
- 특정 component story 세트
- 특정 pattern/page story 세트
- 특정 showcase 항목 이관
- 특정 guide/MDX 추가
- 특정 test/a11y/visual 설정

원칙:

- 한 PR에 infra + 대규모 이관 + 테스트 체계까지 한 번에 넣지 않는다
- 요청 범위와 직접 관련 없는 UI 개선은 하지 않는다
- 주변 리팩토링은 내 변경으로 생긴 고아 코드 정리 수준으로 제한한다

### 4. 구현 순서

Storybook 작업의 권장 순서는 아래와 같다.

1. config/framework/addon 설정
2. global decorator / globals / toolbar
3. seed component stories
4. review/scenario/page story
5. mock/provider/MSW
6. play/a11y/browser tests
7. visual regression
8. showcase 이관 완료 및 종료 처리

한 surface 안에서는 아래 순서를 권장한다.

1. source와 public API 확인
2. JSDoc 보강
3. `Playground`
4. `Review`
5. 필요한 `Scenario` / `Page`
6. mock/test 추가
7. docs/guide 동기화

### 5. 정밀한 변경 원칙

기존 코드와 문서를 수정할 때는 이번 Storybook 작업과 직접 관련된 범위만 바꾼다.

- 관련 없는 component를 같이 손보지 않는다
- showcase 이관 작업이라고 해서 source 구현까지 임의로 바꾸지 않는다
- design token 구조를 손대는 경우는 별도 목적이 명확할 때만 한다
- 문장 표현이나 formatting만을 이유로 대규모 수정하지 않는다
- 내 변경으로 생긴 미사용 import, dead story, orphaned docs만 정리한다

### 6. 테스트는 기본 포함

Storybook 전환 작업에서도 테스트는 선택 사항이 아니다.

최소 기준:

- story 렌더링이 깨지지 않아야 한다
- 필요한 경우 play function을 추가한다
- 접근성 영향이 있으면 a11y 검사를 붙인다
- consumer smoke 영향이 있으면 smoke 검증을 같이 본다

원칙:

- “이번 턴은 UI만 바꿨으니 테스트는 다음에”로 미루지 않는다
- interactive story는 가능하면 interaction 검증을 같이 둔다
- page/pattern story는 loading/empty/error를 같이 본다

### 7. Storybook용 검증 체크리스트

구현 후 최소한 아래를 확인한다.

#### 구조와 카탈로그

- story가 올바른 그룹에 노출되는가
- naming이 목적을 드러내는가
- `Playground`, `Review`, `Scenario`, `Page` 역할이 섞이지 않았는가

#### 상태와 인터랙션

- loading / empty / error / disabled가 실제로 구분되는가
- role, theme, viewport, density 변경이 story에 반영되는가
- preset이 단순 이름만 있고 실제 상태는 안 바뀌는 문제가 없는가
- 이벤트 핸들러가 실제로 동작하는가

#### 문서와 계약

- Autodocs props table이 실제 contract와 맞는가
- JSDoc 설명이 story와 충돌하지 않는가
- stable/beta/deprecated/internal 상태가 맞게 표시되는가

#### 소비 프로젝트 관점

- export path 예시가 실제 import와 일치하는가
- theme/global style bootstrap 방식이 맞는가
- token preview가 실제 렌더 결과와 어긋나지 않는가

### 8. design-showcase 이관 검증

showcase 항목을 옮길 때는 아래를 1:1로 본다.

- 기존 example의 목적이 Storybook에서 유지되는가
- 단순 component demo인지 pattern/page demo인지 올바르게 재분류했는가
- 기존에 보이던 상태가 새 story에서도 모두 열리는가
- 기존 사용 가이드가 필요하면 MDX 또는 guide로 옮겼는가
- `Migration Tracker`의 parity 상태를 갱신했는가

원칙:

- parity가 끝나기 전에는 showcase 항목을 제거하지 않는다
- Storybook으로 옮기며 기능 의미가 달라지면 open issue로 남긴다

### 9. 구현하면서 문서를 같이 갱신

문서는 마지막에 몰아서 고치지 않는다.

아래는 구현과 함께 바로 갱신한다.

- 이 plan 문서의 phase 상태 또는 운영 규칙
- `docs/guides/STORYBOOK_GUIDE.md`
- 관련 `docs/reference/**`
- coverage matrix
- 필요한 maintainer docs

아래 변화는 반드시 문서와 같이 간다.

- Storybook이 문서 체계에서 맡는 역할 변경
- Story 유형 규칙 변경
- source of truth 우선순위 변경
- showcase 종료 기준 변경
- consumer validation 방식 변경

### 10. 구현 중 오픈 이슈 처리

작업 중 아래를 발견하면 그냥 덮지 않는다.

- 기존 showcase 예시와 실제 component contract가 안 맞는 경우
- JSDoc, story, reference 문서가 서로 충돌하는 경우
- 디자이너가 필요한 상태가 현재 component API로는 열리지 않는 경우
- consumer smoke에서만 깨지는 경우

처리 원칙:

- 작은 누락은 문서의 open issue나 TODO로 남긴다
- 범위가 커지면 현재 작업과 분리한다
- 아키텍처 수준 충돌이면 구현을 확장하지 말고 먼저 기준을 정한다

---

## 디자이너가 쉽게 관리하려면 필요한 것

이 부분이 중요하다.

디자이너가 쉽게 관리한다는 말은 "코드를 안 본다"가 아니라,
"코드를 몰라도 조정 가능한 레이어가 있다"는 뜻이어야 한다.

### 1. raw props 대신 named scenario를 준다

좋음:

- `validationState = none | warning | error | success`
- `permission = viewer | editor | admin`
- `content = short | realistic | overloaded`

나쁨:

- 의미를 알기 어려운 boolean과 low-level prop 수십 개를 그대로 노출

### 2. fixture data를 story 바깥에서 재사용 가능하게 만든다

권장:

- `stories/fixtures/**`
- `stories/builders/**`

예:

- `makeUsers(count, role)`
- `makeTableRows(scale, statusMix)`
- `makeViewerAnnotations(mode)`

그러면 디자이너 검토용 scenario를 빠르게 늘릴 수 있다.

### 3. review story와 playground story를 분리한다

한 story에 모든 목적을 몰아넣지 않는다.

- playground: 개발자 실험
- review: 디자이너 검토
- scenario: 실제 사용 예시

### 4. custom docs page를 만든다

Autodocs만으로는 디자이너 관점이 부족하다.

MDX로 아래 페이지를 만든다.

- 디자인 원칙
- component 선택 기준
- do / don't
- migration guide
- pattern cookbook

### 5. 비교 모드를 자주 쓴다

디자이너는 단일 예시보다 비교를 통해 판단한다.

따라서 우선순위가 높다.

- side-by-side theme compare
- light/dark compare
- compact/default compare
- empty/typical/error compare

### 6. 접근성과 국제화 변형도 기본 시나리오로 본다

디자이너 검토는 보기 좋은 상태만 보는 것으로 끝나면 안 된다.

우선순위가 높은 변형:

- reduced motion
- long text / overflow
- locale 길이 차이
- empty label / missing thumbnail 같은 sparse data
- keyboard focus visible 상태

장기 후보:

- RTL
- high contrast

### 7. 무거운 page story는 성능도 본다

특히 table, viewer, chart, image grid 계열은 예쁘게 렌더되는 것만으로 부족하다.

최소 기준:

- 과도한 fixture 규모로 Storybook 전체를 느리게 만들지 않기
- `sparse | realistic | overloaded`를 분리
- overloaded story는 review 목적일 때만 유지

권장:

- heavy story에는 `performance note`를 남긴다
- 필요 시 visual test 대상과 상호작용 test 대상을 분리한다

### 8. deprecation 운영 규칙

공식 포털이 되면 deprecated surface를 어떻게 닫을지도 명확해야 한다.

최소 규칙:

- `deprecated`는 replacement surface를 명시한다
- Storybook story, MDX guide, reference 문서에서 같은 메시지를 준다
- breaking removal 전에는 migration note를 유지한다
- 소비 프로젝트 영향이 큰 경우 release note에 upgrade path를 남긴다

권장:

- 반복 변경이 예상되면 codemod 또는 migration helper를 검토한다
- deprecated 기간은 최소 한 release cycle 이상 유지한다
- replacement 예시는 old/new 비교 story로 보여준다

---

## 팀 운영 규칙

### Story 최소 세트

모든 public component는 최소 아래를 가진다.

- `Playground`
- `Review`
- `States`

해당되면 추가:

- `Loading`
- `Empty`
- `Error`
- `Dark`
- `Mobile`
- `Permission`
- `LongContent`

### Pattern/Page 최소 세트

모든 중요 pattern/page는 최소 아래를 가진다.

- `Default`
- `Loading`
- `Empty`
- `Error`
- `Mobile`
- `RoleVariants`

### Story naming

금지:

- `Example`
- `Test`
- `Demo2`

권장:

- `LongContent`
- `ErrorWithRetry`
- `AdminEditable`
- `CompactDark`

### PR 규칙

아래 변경은 story와 docs 반영이 기본이다.

- 새 public export
- prop/variant contract 변경
- theme/token 영향 변경
- interaction 변경
- visual hierarchy 변경

PR 체크리스트:

- story 추가/수정
- review story 반영
- page/pattern 영향 확인
- play/a11y/visual 영향 확인

---

## docs 체계 재정의

### Storybook이 1차 허브가 되는 문서

- 사용 예시
- 상태 전시
- 조합 예시
- props table
- interactive guide
- designer review page

### `docs/reference/**`가 계속 맡는 문서

- 릴리즈 노트
- 운영 문서
- maintainer rules
- 긴 서술형 설명
- 외부 공유용 markdown snapshot

즉, 문서를 없애는 게 아니라 Storybook이 `보는 곳`, `docs/`가 `읽는 곳`이 된다.

---

## 배포 및 버전 운영

공식 포털이 되려면 어떤 Storybook이 기준인지 명확해야 한다.

### 권장 채널

- `latest`: 현재 main 기준 Storybook
- `release`: 배포 버전별 snapshot Storybook
- `pr-preview`: PR 단위 미리보기

### 용도

- 디자이너 일상 검토: `latest`
- 배포 전후 비교: `release`
- 변경 리뷰: `pr-preview`

### 규칙

- visual regression baseline은 `latest` 또는 `pr-preview` 기준으로 운영
- 소비 프로젝트 문서 링크는 기본적으로 `latest`를 가리키되, 필요하면 versioned release 링크도 제공
- breaking change가 포함된 release는 해당 버전 Storybook snapshot 보존 권장

---

## 구현 제안

### 초기 설치

권장 시작 명령:

```bash
npm create storybook@latest --features docs test a11y
```

기본 방향:

- framework: `@storybook/react-vite`
- docs: autodocs on
- tests: Storybook Vitest addon
- a11y addon on

### 초기 addon 후보

필수:

- `@storybook/addon-a11y`
- `@storybook/addon-vitest`

권장:

- `msw`
- `msw-storybook-addon`

장기 권장:

- `@chromatic-com/storybook`
- figma integration addon

실험:

- `@storybook/addon-mcp`

### 전역 decorator

반드시 공통화할 것:

- `ThemeProvider`
- `IngradientGlobalStyle`
- role/provider mock
- router/provider wrapper
- optional feature flag provider

### JSDoc 강화

Autodocs와 AI manifest 품질을 위해 public component와 핵심 props에 JSDoc을 붙인다.

반드시 설명할 것:

- 언제 쓰는가
- 언제 쓰면 안 되는가
- 어떤 대체재가 있는가
- 자주 깨지는 조합이 무엇인가

---

## 성공 기준

### Phase 1 완료 기준

- Storybook이 팀 기본 URL이 된다
- 디자이너가 theme/dark/viewport/role을 직접 바꿔볼 수 있다
- 핵심 컴포넌트 10개 이상이 review story를 가진다
- Storybook docs만으로 기본 사용 판단이 가능하다

### Phase 1.5 완료 기준

- 새 live example이 `design-showcase`가 아니라 Storybook에 추가된다
- 대표 page/pattern이 Storybook으로 이관된다
- 팀이 showcase보다 Storybook을 먼저 본다

### Phase 2 완료 기준

- async/story-driven QA가 돈다
- play/a11y/browser tests가 붙는다
- mock data 기반 시나리오 검증이 가능하다

### Phase 3 완료 기준

- visual regression이 운영된다
- 디자이너 검토와 PR 검토가 Storybook/Chromatic 중심으로 돌아간다

---

## 하지 말아야 할 것

- Storybook을 단순한 props playground로만 만들기
- design-showcase와 Storybook에 동일 예시를 이중 관리하기
- 디자이너에게 source code 수정까지 기대하기
- page story 없이 component story만 잔뜩 쌓기
- visual regression 규칙 없이 baseline만 계속 갱신하기
- 실험 기능을 초기 필수 항목으로 잡기

---

## 추천 실행 순서

1. Storybook 설치와 root 설정
2. global toolbar와 decorator 설계
3. story taxonomy와 작성 규칙 확정
4. 핵심 component review story 작성
5. MDX guide와 designer workflow 문서 작성
6. page/pattern story로 live example 이관 시작
7. `design-showcase` 신규 투자 중단
8. MSW/mock/play/a11y/test 체계 도입
9. Chromatic/visual regression 도입
10. Figma 연동
11. AI/MCP 파일럿

---

## 공식 참고

- Storybook 설치: https://storybook.js.org/docs/get-started/install
- React + Vite: https://storybook.js.org/docs/get-started/frameworks/react-vite
- Autodocs: https://storybook.js.org/docs/writing-docs/autodocs
- Args: https://storybook.js.org/docs/writing-stories/args
- Controls: https://storybook.js.org/docs/essentials/controls
- Actions: https://storybook.js.org/docs/essentials/actions
- Provider mocking: https://storybook.js.org/docs/writing-stories/mocking-data-and-modules/mocking-providers
- Network mocking: https://storybook.js.org/docs/writing-stories/mocking-data-and-modules/mocking-network-requests
- Pages/connected components: https://storybook.js.org/docs/writing-stories/build-pages-with-storybook
- Vitest addon: https://storybook.js.org/docs/writing-tests/integrations/vitest-addon/index
- Accessibility testing: https://storybook.js.org/docs/writing-tests/accessibility-testing
- Test coverage: https://storybook.js.org/docs/writing-tests/test-coverage
- Visual tests: https://storybook.js.org/docs/writing-tests/visual-testing
- Design integrations: https://storybook.js.org/docs/sharing/design-integrations/
- AI manifests: https://storybook.js.org/docs/ai/manifests
- MCP server: https://storybook.js.org/docs/ai/mcp/overview
