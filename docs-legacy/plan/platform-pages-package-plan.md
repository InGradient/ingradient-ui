---
title: Platform Pages Package Plan
purpose: Storybook mock page를 runtime 재사용 가능한 package로 승격하고 ingradient-platform이 이를 소비하는 구조를 정의
audience: ingradient-ui contributor / ingradient-platform frontend developer / storybook author
date: 2026-05-15
status: draft
related:
  - ./storybook-restructure-phase-9-platform-core-pages.md
  - ../storybook_architecture_restructure.md
  - ../../../ingradient-platform/docs/plans/frontend_layer_refactor.md
---

> **Archive only.** 이 문서는 package 분리 당시의 draft와 실행 기록을 보존한다. 현재 ownership/public API는 [`packages/platform-pages/README.md`](../../packages/platform-pages/README.md), 실행 가능한 story 계약은 [Platform 0.0.1 README](../../stories/pages/platform/0.0.1/README.md)를 따른다.

# Platform Pages Package Plan

## 1. 배경

현재 `ingradient-ui` 의 platform page story 는 Storybook 안에서 제품 화면을 시각적으로 재현하는 역할을 한다.

예:

- `stories/pages/platform/0.0.1/Catalog.stories.tsx`
- `stories/pages/platform/0.0.1/ClassManage.stories.tsx`
- `stories/pages/platform/0.0.1/CreateProject.stories.tsx`

그러나 이 파일들은 다음 성격을 가진다.

- Storybook metadata 포함
- fixture / scenario 기반 mock state 사용
- 실제 API / router / store / permission / query 연결 없음
- Storybook controls 와 variant 전환을 위한 보조 로직 포함

즉, 이 파일들은 **실행 가능한 제품 페이지**가 아니라 **UI snapshot + 문서화 자산**이다.

이 상태에서 `ingradient-platform` 이 `.stories.tsx` 를 직접 가져다 쓰면 책임 경계가 무너진다.

---

## 2. 문제 정의

현재 구조는 다음 두 요구를 동시에 만족시키기 어렵다.

1. Storybook 에서 page-level mockup 을 빠르게 진화시키고 싶다.
2. 같은 화면 구조를 `ingradient-platform` 에서 실제 데이터와 함께 재사용하고 싶다.

`stories/` 안에서 두 요구를 동시에 해결하려 하면 다음 문제가 생긴다.

- Storybook 전용 코드가 runtime 번들에 섞인다.
- mock scene hook 과 실제 data hook 이 섞인다.
- Story file 이 UI source of truth 처럼 변질된다.
- `@ingradient/ui` 와 제품 화면 코드의 경계가 다시 흐려진다.

---

## 3. 결정

### 3.1 핵심 결정

`stories/` 는 계속 **문서화/시나리오 레이어**로 유지한다.

실제 재사용 가능한 page view 는 `ingradient-ui` 내부의 별도 runtime package 로 승격한다.

제안 package:

```txt
packages/platform-pages
```

권장 package name:

```txt
@ingradient/platform-pages
```

### 3.2 책임 분리

| 레이어 | 역할 | 금지 |
|---|---|---|
| `@ingradient/ui` | primitives / components / patterns / tokens | 제품별 page 구현 |
| `@ingradient/platform-pages` | platform 전용 presentational page/view | API 호출, react-query, router, store 직접 사용 |
| `stories/` | fixture, scenario, docs, controls | 실제 app runtime source |
| `ingradient-platform` | query/mutation, routing, auth, permission, store, page container | large page JSX 재구현 |

### 3.3 한 줄 요약

**Story 는 view 를 보여주고, platform 은 같은 view 에 실제 데이터를 주입한다.**

---

## 4. 목표 구조

```txt
ingradient-ui/
├─ packages/
│  ├─ ui/                      # 기존 @ingradient/ui 역할
│  └─ platform-pages/         # 신규 @ingradient/platform-pages
├─ stories/
│  └─ pages/platform/...
└─ apps/
   └─ storybook-smoke-consumer/
```

`platform-pages` 내부 예시:

```txt
packages/platform-pages/
├─ src/
│  ├─ create-project/
│  │  ├─ CreateProjectView.tsx
│  │  ├─ CreateProjectView.types.ts
│  │  └─ index.ts
│  ├─ catalog/
│  │  ├─ CatalogView.tsx
│  │  ├─ CatalogView.types.ts
│  │  └─ index.ts
│  ├─ class-manage/
│  │  ├─ ClassManageView.tsx
│  │  ├─ ClassManageView.types.ts
│  │  └─ index.ts
│  └─ index.ts
├─ package.json
├─ tsconfig.json
└─ tsup.config.ts
```

---

## 5. Workspace 변경

현재 `ingradient-ui/package.json` 은 사실상 단일 package + `apps/storybook-smoke-consumer` workspace 구조다.

이를 다음처럼 확장한다.

```json
{
  "workspaces": [
    "packages/*",
    "apps/*"
  ]
}
```

패키지 역할은 다음과 같이 나눈다.

- `packages/ui` → `@ingradient/ui`
- `packages/platform-pages` → `@ingradient/platform-pages`

중요:

- `platform-pages` 는 `@ingradient/ui` 를 dependency/peerDependency 로 소비한다.
- `@ingradient/ui` 는 `platform-pages` 를 절대 import 하지 않는다.

의존 방향:

```txt
@ingradient/ui
  ↑
@ingradient/platform-pages
  ↑
ingradient-platform
```

---

## 6. Import 규칙

### 6.1 `@ingradient/ui`

유지 범위:

- primitives
- generic components
- generic patterns
- generic hooks
- tokens / brand / utils

금지:

- platform route knowledge
- dataset/class/project 도메인 page
- react-router-dom 의존
- react-query 의존

### 6.2 `@ingradient/platform-pages`

허용:

- `@ingradient/ui/*`
- React
- styled-components
- page-specific types

금지:

- `react-router-dom`
- `@tanstack/react-query`
- `zustand`
- `frontend/api/*`
- `frontend/store/*`
- Storybook API import

즉 `platform-pages` 는 **pure view layer** 여야 한다.

### 6.3 `stories/`

허용:

- `@ingradient/platform-pages`
- fixtures / scenario registry
- Storybook meta / args / controls

즉 story 는 page view 를 직접 조립하지 않고, 가능하면 `platform-pages` export 를 렌더한다.

---

## 7. ingradient-platform 소비 방식

`ingradient-platform` 은 `@ingradient/platform-pages` 를 일반 dependency 처럼 연결한다.

예시:

```json
{
  "dependencies": {
    "@ingradient/ui": "file:../../ingradient-ui/packages/ui",
    "@ingradient/platform-pages": "file:../../ingradient-ui/packages/platform-pages"
  }
}
```

실제 페이지는 container 역할만 맡는다.

예:

```tsx
import { CreateProjectView } from '@ingradient/platform-pages/create-project'

export function CreateProjectPage() {
  const state = useCreateProjectPageState()

  return (
    <CreateProjectView
      name={state.name}
      description={state.description}
      firstDatasetName={state.firstDatasetName}
      projectType={state.projectType}
      files={state.files}
      submitting={state.submitting}
      error={state.error}
      onNameChange={state.setName}
      onDescriptionChange={state.setDescription}
      onFirstDatasetNameChange={state.setFirstDatasetName}
      onProjectTypeChange={state.setProjectType}
      onFilesChange={state.setFiles}
      onSubmit={state.handleSubmit}
      onCancel={state.handleCancel}
    />
  )
}
```

즉 `ingradient-platform` 의 책임은 다음으로 축소된다.

- API 호출
- query/mutation
- store 동기화
- auth / permission 판단
- route param 해석
- view props 변환

---

## 8. Storybook 소비 방식

Storybook 은 같은 view 컴포넌트에 mock props 를 넣는다.

예:

```tsx
import { CreateProjectView } from '@ingradient/platform-pages/create-project'

export const Default = () => (
  <CreateProjectView
    name=""
    description=""
    firstDatasetName=""
    projectType="general"
    files={[]}
    submitting={false}
    error={null}
    onNameChange={() => undefined}
    onDescriptionChange={() => undefined}
    onFirstDatasetNameChange={() => undefined}
    onProjectTypeChange={() => undefined}
    onFilesChange={() => undefined}
    onSubmit={() => undefined}
    onCancel={() => undefined}
  />
)
```

이 구조로 바꾸면:

- story 와 runtime UI 가 같은 JSX source 를 공유한다
- scenario 는 props 수준에서만 달라진다
- story 파일은 다시 얇아진다

---

## 9. View 설계 원칙

### 9.1 Page container / view 분리

`ingradient-platform`:

- page container
- hook orchestration
- side effect

`@ingradient/platform-pages`:

- JSX composition
- layout
- UI-only local state
- props-driven interaction surface

### 9.2 허용되는 local state

`platform-pages` 에 허용:

- accordion open/close
- hovered item
- purely visual tab switch
- uncontrolled input focus state

금지:

- fetch
- mutation
- auth
- route transition
- shared app store read/write

### 9.3 prop 설계 원칙

- domain type 는 명시적이어야 한다
- mutation 결과는 callback 으로만 받는다
- query 상태는 `loading/error/empty` 를 props 로 노출한다
- page 내부에서 shape 변환이 과도하면 view model type 을 별도로 둔다

---

## 10. 페이지별 적용 전략

### 10.1 1차 대상

1. `CreateProject`
2. `ClassManage`
3. `Catalog`

### 10.2 우선순위 이유

#### CreateProject

- 현재 platform 구현이 단순하다
- form page 라 prop surface 가 작다
- 첫 extraction 패턴 검증에 적합하다

#### ClassManage

- 좌/중/우 패널 구조가 명확하다
- 현재 story 와 runtime 의 레이아웃 유사도가 높다
- image grid / sidebar 재사용 패턴을 검증하기 좋다

#### Catalog

- 가장 복잡하다
- toolbar, selection, modal, split panel, mobile variant 가 크다
- 앞선 두 페이지에서 패턴을 안정화한 뒤 진행하는 것이 안전하다

---

## 11. 마이그레이션 단계 — 구현 현황 (2026-05-15)

본 plan 의 실행은 [platform-pages-extraction-roadmap.md](./platform-pages-extraction-roadmap.md) 의 phase 분할을 따랐음. 본 plan 의 §4 가 제안한 `packages/ui` + `packages/platform-pages` 양쪽 분리 중 **`packages/platform-pages` 만 우선 분리** (Stage A → Stage B partial). `src/` (`@ingradient/ui`) 는 root 에 유지.

### Phase 0 — Sub-export scaffold ✅ (완료)

`packages/platform-pages/` 빈 골격 + tsup/exports/tsconfig/storybook alias 배선. 최종 workspace 계약은 현재 [`packages/platform-pages/README.md`](../../packages/platform-pages/README.md)에 기록한다.

### Phase 1 — CreateProject 추출 ✅ (완료)

`CreateProjectView` 가 `packages/platform-pages/src/create-project/` 에 위치. 신규 5 파일 (view + sections + styles + types + index). story 줄 수 170 → 91. probe 5/5. spec: [platform-pages-phase-1-spec.md](./platform-pages-phase-1-spec.md).

### Phase 2 — ClassManage 추출 ✅ (완료)

`ClassManageView` + `ClassManageBody` + `ClassManageOverlays` 등 6 파일. props 4 group (list / images / info / overlays). story 줄 수 255 → 171. probe 7/7. spec: [platform-pages-phase-2-spec.md](./platform-pages-phase-2-spec.md).

### Phase 2.5 — `packages/platform-pages/` workspace 분리 ✅ (완료)

`src/platform-pages/` 를 `packages/platform-pages/src/` 로 이동. 자체 `package.json` / `tsup.config.ts` / `tsconfig.json`. import 이름 `@ingradient/ui/platform-pages` → `@ingradient/platform-pages`. spec: [platform-pages-phase-2-5-spec.md](./platform-pages-phase-2-5-spec.md).

### Phase 3 — Catalog 추출 ✅ (완료)

`CatalogView` + Desktop/Mobile subview + 11 파일. props 9 group + stats/detail slot 패턴. story 줄 수 662 → 113. probe 12/12. spec: [platform-pages-phase-3-spec.md](./platform-pages-phase-3-spec.md).

### Phase 4 — SettingsModal 추출 ✅ (완료, plan 의 Non-goals 였으나 사용자 요청으로 포함)

`SettingsModalView` + 5 tab × 4 admin sub-tab = 13 파일. props 7 group + storage chart slot. story 줄 수 462 → 78. probe 8/8. spec: [platform-pages-phase-4-spec.md](./platform-pages-phase-4-spec.md).

### Phase 5 — Dashboard 추출 ✅ (완료, plan 의 Non-goals 였으나 사용자 요청으로 포함)

`DashboardView` 4 파일 (가장 단순). props 5 group + widgets slot. story 줄 수 289 → 149. probe 6/6. spec: [platform-pages-phase-5-spec.md](./platform-pages-phase-5-spec.md).

### Phase 6 — Story 정리 + 문서 동기화 ✅ (완료)

5 story 모두 `@ingradient/platform-pages` import only. 직접 pattern 조립 0. lint pass. plan 문서 §11/§15 갱신. 사용 가이드 [platform-pages-usage.md](./platform-pages-usage.md) 작성. 현재 Storybook 결과와 검증 근거는 [Platform 0.0.1 migration](../../stories/pages/platform/0.0.1/MIGRATION.md)에 기록한다.

### Phase 7 — ingradient-platform 마이그레이션 ⏳ (대기)

별도 repo. 5 페이지 컨테이너 (CreateProjectPage / ClassManagePage / CatalogPage / SettingsModal / DashboardPage) 를 `@ingradient/platform-pages` import + hook orchestration 형태로 축소. 본 phase 는 ingradient-platform 측에서 진행.

### 보류 — `src/` → `packages/ui/` 이동

plan 문서 §4 의 완전체 구조. 본 작업에서는 변경 파일 수 (30+) 와 위험 대비 효용이 적어 보류. 향후 필요 시 별도 roadmap.

---

## 12. 예상 리스크

### 12.1 package 경계가 너무 얇아지는 문제

위험:

- 단순히 파일만 옮기고 props drilling 이 과도해질 수 있다

대응:

- page-level view model type 도입 허용
- 큰 page 는 subview 로 분해

### 12.2 `@ingradient/ui` 와 `platform-pages` 경계 혼탁

위험:

- platform-specific widget 이 다시 `@ingradient/ui` 로 들어갈 수 있다

대응:

- generic reuse 가능성이 낮은 page block 은 `platform-pages` 에 둔다
- `@ingradient/ui` 승격 기준을 별도로 유지한다

### 12.3 workspace 개편 비용

위험:

- 기존 단일 package build/script 경로 수정 필요

대응:

- `CreateProject` 추출 전 Phase 0 에 workspace/build 를 먼저 안정화한다

---

## 13. Non-goals

이번 계획의 범위 밖:

- `ingradient-platform` 의 모든 page 를 즉시 package 화
- runtime data hook 을 `ingradient-ui` 로 이동
- Storybook fixture registry 구조 전면 개편
- `@ingradient/ui` 를 제품 page library 로 확장

---

## 14. 최종 원칙

1. `stories/` 는 runtime source 가 아니다.
2. 제품 화면 재사용은 `packages/platform-pages` 같은 별도 package 에서 한다.
3. `@ingradient/ui` 는 generic UI 레이어로 유지한다.
4. `ingradient-platform` 은 container, `platform-pages` 는 presentational page 로 분리한다.
5. 첫 extraction 은 `CreateProject` 로 시작한다.

---

## 15. 다음 액션

본 plan 의 §4 ~ §14 정의를 따라 Phase 0 ~ 6 (ingradient-ui 측) 모두 완료. 다음 단계는 **ingradient-platform 측 마이그레이션** (Phase 7) — 별도 repo:

1. ingradient-platform 의 `package.json` 에 `@ingradient/platform-pages` file: dependency 추가
2. `CreateProjectPage.tsx` 부터 컨테이너만 남기고 `<CreateProjectView ... />` import. spec / usage guide 참고: [platform-pages-usage.md](./platform-pages-usage.md)
3. ClassManage → Catalog → SettingsModal → Dashboard 순으로 동일 패턴 적용
4. 각 페이지 별 평탄화 후 `frontend/components/{catalog,classes,projects,gallery,dashboard}/` 의 JSX 일부 제거 (view 가 가져간 부분)
5. e2e / 수동 검증 후 commit
