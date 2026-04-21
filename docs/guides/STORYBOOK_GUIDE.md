# Storybook Guide

이 문서는 `ingradient-ui`에서 Storybook을 `무엇으로 쓰는지`, `누가 어떻게 쓰는지`, `무엇을 유지해야 하는지`를 정리한 운영 안내다.

자세한 전환 계획은 [storybook-adoption-plan.md](../plan/storybook-adoption-plan.md)를 본다.
현재 migration 진행 현황은 [storybook-migration-tracker.md](../plan/storybook-migration-tracker.md)를 본다.

## Why Storybook

`ingradient-ui`의 Storybook은 단순한 개발자 데모 모음이 아니다.

Storybook은 아래 역할을 맡는다.

- 공식 컴포넌트 카탈로그
- 디자인 시스템 허브
- live example 대체제
- 디자이너 검토용 interactive sandbox
- page/pattern 조합 검증 지점
- story 기반 테스트 실행 지점
- 팀 공유용 UI 포털

즉, Storybook이 기존 `design-showcase`의 live example 역할까지 대체한다.

## Who Uses It

### 디자이너

Storybook에서 아래를 본다.

- variant 비교
- light/dark/theme 차이
- density, viewport, role 차이
- loading/empty/error 상태
- pattern/page 단위 조합
- visual regression 결과

디자이너는 component source를 직접 수정하는 대신 아래 표면을 중심으로 다룬다.

- story args
- preset scenario
- fixture/mock data
- MDX guide
- token preview

### 라이브러리 개발자

Storybook에서 아래를 유지한다.

- canonical story
- review story
- scenario/page story
- mock/provider wiring
- play/a11y/visual test 대상

새 public export 또는 public prop contract 변경은 Storybook 반영 없이 끝내지 않는다.

### 소비 프로젝트 개발자

Storybook에서 아래를 판단한다.

- 어떤 컴포넌트를 써야 하는지
- 어떤 상태를 기본 지원하는지
- 어떤 props와 variants가 있는지
- 실제 화면 조합은 어떤 형태인지
- 모바일/다크모드/권한별로 어떤 차이가 나는지

## What Exists In Storybook

Storybook에는 보통 아래 그룹이 존재해야 한다.

- `Foundations`
- `Components`
- `Patterns`
- `Pages`
- `Sandboxes`
- `Guides`

각 그룹의 의미는 아래와 같다.

### Foundations

- color
- typography
- spacing
- motion
- themes
- token preview

토큰 값을 표처럼 나열하는 데서 끝내지 않고, 실제 component/pattern에 어떤 차이를 만드는지 보여준다.

### Components

개별 public component를 다룬다.

기본적으로 아래 정보를 제공해야 한다.

- 대표 사용 예시
- 상태 전시
- props table
- variants
- related usage

### Patterns

여러 component를 묶은 공용 조립 단위를 다룬다.

예:

- form layout
- list/detail
- toolbar
- app shell

### Pages

실제 화면 수준 preview다.

이 그룹은 기존 live example를 대체하는 핵심 영역이다.
component를 단독으로 볼 때는 안 보이는 문제를 여기서 본다.

예:

- AuthPage
- TablePage
- SettingsPage
- ViewerWorkspace

### Sandboxes

디자이너와 개발자가 빠르게 비교/검토하기 위한 곳이다.

예:

- Theme Lab
- Density Lab
- State Matrix
- Token Playground

### Guides

설명형 문서를 둔다.

예:

- Getting Started
- How To Consume
- How To Contribute
- Writing Stories
- Designer Workflow

## Story Types

각 public surface는 목적이 다른 story를 가진다.

### Playground

- raw args 중심
- 개발자 실험용
- props/controls 확인용

### Review

- 디자이너 검토용
- 대표 상태 비교용
- matrix 또는 preset 중심

### Scenario

- 실제 사용 맥락 반영
- fixture/provider/mock 포함
- 연결된 상태를 보여줌

### Spec

- contract 확인용
- edge case
- disabled
- long content
- accessibility 관련 상태

### Page

- live example 대체용
- 여러 component와 pattern을 함께 검토

## Global Controls

Storybook은 raw props만 노출하는 곳이 아니다.
전역 toolbar와 semantic control을 통해 의미 있는 상태를 바꿔볼 수 있어야 한다.

대표 전역 상태:

- `theme`
- `colorMode`
- `density`
- `viewport`
- `locale`
- `role`
- `motion`
- `dataScale`

이 값들은 component 내부 prop과 1:1로 대응하지 않아도 된다.
중요한 것은 디자이너와 개발자가 결과를 기준으로 비교할 수 있어야 한다는 점이다.

좋은 control 예:

- `validationState`
- `permission`
- `contentLength`
- `layoutMode`
- `selectionState`

현재 구현에서는 핵심 `Review` story에 status/tag pill을 같이 둬서 아래 정보를 바로 보게 한다.

- `stable`, `beta`, `deprecated`, `internal`
- `consumer-verified`
- `mobile-reviewed`
- `a11y-critical`
- `visual-baseline`

좋지 않은 control 예:

- 의미를 모르면 판단할 수 없는 low-level boolean 수십 개

## Common Workflows

### 디자이너가 검토할 때

1. 관련 `Review` 또는 `Page` story를 연다.
2. `theme`, `colorMode`, `density`, `viewport`, `role`을 바꿔본다.
3. `Empty`, `Typical`, `LongContent`, `Error` 같은 preset을 비교한다.
4. 필요한 경우 Figma 링크나 visual diff를 같이 본다.
5. 수정 제안은 story, fixture, token, guide 수준에서 먼저 정리한다.

### 개발자가 컴포넌트를 추가할 때

1. `Playground` story를 만든다.
2. `Review` story에서 핵심 상태를 묶는다.
3. async 또는 connected 성격이면 `Scenario` story를 만든다.
4. 관련 MDX guide 또는 docs note를 추가한다.
5. 필요한 play/a11y/visual 테스트를 붙인다.

### 소비 프로젝트 개발자가 사용법을 찾을 때

1. `Components` 또는 `Patterns`에서 대상 surface를 찾는다.
2. Autodocs와 props table을 본다.
3. `Review`와 `Scenario` story로 실제 동작을 본다.
4. `Pages`에서 실제 조합을 확인한다.

### PR 리뷰에서 미리 볼 때

1. GitHub Actions의 `CI` workflow run을 연다.
2. job summary의 `Storybook Preview` 섹션을 본다.
3. `Artifacts`에서 `storybook-static-pr-<PR 번호>`를 내려받는다.
4. 압축을 푼 뒤 `index.html` 또는 정적 서버로 preview를 연다.

원칙:

- 외부 preview URL이 없더라도 PR마다 정적 Storybook 산출물은 남긴다.
- 리뷰어는 코드 diff만이 아니라 Storybook artifact도 같이 본다.

## How To Check Progress Mid-Work

작업 중간에는 아래 순서로 확인하면 된다.

1. `npm run storybook`
2. 브라우저에서 `http://localhost:6006`
3. 변경 중인 `Foundations`, `Components`, `Patterns`, `Pages` story를 직접 확인

빠른 검증 명령:

- `npx tsc --noEmit`
- `npm run check:doc-coverage`
- `npm run test-storybook`
- `npm run build:storybook`
- `npm run test:visual`
- `npm run build:smoke-consumer`
- `npm run validate:storybook`
- `npm run validate:consumer-smoke`

중간 산출물 위치:

- 정적 Storybook: `storybook-static/`
- visual snapshot baseline: `tests/visual/storybook-visual.spec.ts-snapshots/`
- PR preview artifact: GitHub Actions `CI` run의 `storybook-static-pr-<PR 번호>`

## Mocking And States

Storybook에서는 hard-to-reach state를 쉽게 열 수 있어야 한다.

주요 대상:

- loading
- empty
- error
- permission denied
- long content
- mobile
- dark mode
- connected component data state

이를 위해 아래를 사용한다.

- provider decorator
- scenario preset
- fixture builder
- MSW 기반 API mock

원칙:

- raw mock 데이터를 story 안에 반복해서 쓰지 않는다
- `stories/fixtures/**`, `stories/builders/**`로 재사용한다
- 디자이너 검토용 상태 이름은 의미 있게 붙인다
- 실서비스 데이터, 개인정보, 민감정보는 fixture에 넣지 않는다
- 랜덤 fixture는 deterministic seed 또는 고정 데이터로 유지한다
- 날짜/시간 의존 상태는 timezone과 기준 시점을 고정한다

## Testing In Storybook

Storybook은 문서만이 아니라 검증 지점이다.

주요 테스트 역할:

- play function 기반 interaction 확인
- accessibility 검사
- 브라우저 기반 component test
- visual regression
- `npm run test-storybook` 기준 CLI 검증
- `npm run build:storybook` 기준 정적 배포 검증
- `npm run test:visual` 기준 screenshot baseline 검증

중요한 점:

- story가 문서이면서 테스트 케이스이기도 해야 한다
- 검증 가치가 없는 decorative story만 잔뜩 쌓지 않는다
- flaky story는 조용히 방치하지 않고 원인을 남기거나 quarantine한다
- visual baseline은 의도된 UI 변경이 확인된 경우에만 갱신한다

## Source Of Truth

Storybook을 쓰더라도 정본 우선순위는 따로 있다.

1. 실제 API 계약: TypeScript source
2. prop 설명과 사용 의도: JSDoc
3. 실행 가능한 canonical example: Storybook story
4. 서술형 가이드: Storybook MDX
5. 운영/보조 문서: `docs/reference/**`, `docs/guides/**`

즉:

- 타입은 source를 본다
- 사용 의도는 JSDoc를 본다
- 상태와 예시는 story를 본다
- 워크플로우와 운영 기준은 `docs/`를 본다

## What Must Be Updated Together

아래 변경은 Storybook 반영이 기본이다.

- 새 public export
- prop contract 변경
- variant 추가/삭제
- interaction 변경
- token/theme 영향 변경

최소 동기화 대상:

- source
- JSDoc
- 관련 story
- 필요한 guide 또는 reference 문서

## Component Status

공식 포털에서는 각 surface의 maturity를 보여줘야 한다.

권장 상태:

- `stable`
- `beta`
- `deprecated`
- `internal`

규칙:

- `deprecated`는 대체재와 migration note를 같이 둔다
- `beta`는 제한 사항을 명시한다
- `internal`은 외부 소비 기준으로 홍보하지 않는다

실제 Storybook UI에서는 이 상태를 `Review` story의 meta badge로 바로 보여주는 것을 권장한다.

## Ownership And Freshness

Storybook은 한 번 만드는 것보다 최신 상태를 유지하는 것이 더 중요하다.

최소 원칙:

- `stable` surface는 owner 없이 두지 않는다
- story와 `docs/reference/**`는 같은 owner 그룹이 함께 본다
- public export 전체는 정기적으로 coverage audit 한다
- stale story, dead fixture, 끊어진 docs 링크는 audit 대상에 포함한다

## Consumer Validation

Storybook이 잘 떠도 실제 소비 프로젝트에서 깨지면 실패다.

따라서 아래 검증을 분리해 생각한다.

### Storybook 검증

- 상태 전시
- interaction 검토
- visual/a11y regression

### Consumer smoke 검증

- package build
- export path import
- theme/global style bootstrap
- 주요 render 확인
- 배포 산출물 사용 확인

## Do And Don’t

Do:

- Storybook을 공식 사용 포털로 유지한다
- 디자이너 검토용 `Review` story를 따로 둔다
- live example를 `Page` story로 옮긴다
- fixture와 mock을 재사용 가능하게 관리한다
- hard state를 적극적으로 전시한다

Don’t:

- Storybook을 단순 props playground로만 만든다
- 같은 예시를 showcase와 Storybook에 이중 관리한다
- component story만 있고 page story는 없는 상태로 방치한다
- visual baseline을 기준 없이 계속 갱신한다
- 디자이너에게 source code 수정까지 기대한다

## Related Docs

- [storybook-adoption-plan.md](../plan/storybook-adoption-plan.md)
- [WORKFLOW.md](./WORKFLOW.md)
- [DOCUMENTATION_STRATEGY.md](./DOCUMENTATION_STRATEGY.md)
- [DOC_WRITING_RULES.md](./DOC_WRITING_RULES.md)
- [CHANGE_GUIDE.md](./CHANGE_GUIDE.md)
