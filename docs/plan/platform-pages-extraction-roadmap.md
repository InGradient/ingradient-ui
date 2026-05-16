---
title: Platform Pages Extraction Roadmap
purpose: storybook story orchestrator JSX 를 ingradient-platform 이 import 가능한 view 레이어로 점진적·안전하게 추출하기 위한 실행 계획
audience: ingradient-ui contributor / ingradient-platform frontend developer
date: 2026-05-15
status: draft
related:
  - ./platform-pages-package-plan.md
  - ./platform-catalog-storybook-roadmap.md
  - ./platform-class-storybook-roadmap.md
  - ./platform-settings-storybook-roadmap.md
  - ./platform-dashboard-storybook-roadmap.md
---

# Platform Pages Extraction Roadmap

> 본 문서는 [platform-pages-package-plan.md](./platform-pages-package-plan.md) 의 실행 가이드. plan 문서는 "왜 / 무엇을 / 어디에" 를 정의하고, 본 문서는 "어떤 순서로 / 어디까지 한 번에" 를 정의한다.

---

## 1. 목표 한 줄 요약

storybook 안에서만 살아 있는 page-level JSX (Catalog/Class/Settings/Dashboard/CreateProject) 를 **import 가능한 view 레이어**로 끌어올려, storybook 과 ingradient-platform 이 **동일 JSX 에 서로 다른 props 만 주입**하는 구조로 만든다.

---

## 2. 현재 상태 (2026-05-15)

| 페이지 | storybook story | 줄 수 | 상태 |
|---|---|---|---|
| CreateProject | `stories/pages/platform/0.0.1/CreateProject.stories.tsx` | 170 | small form, props 추출 쉬움 |
| ClassManage | `stories/pages/platform/0.0.1/ClassManage.stories.tsx` (+ `class/`) | 255 + scene hook | 좌/중/우 3-pane |
| Catalog | `stories/pages/platform/0.0.1/Catalog.stories.tsx` (+ `catalog/`) | 662 + scene hook | 가장 큼. desktop / dialog 분리 가능 |
| Settings | `stories/pages/platform/0.0.1/SettingsModal.stories.tsx` (+ `settings/`) | 462 + scene hook | modal + 5 tab + 4 sub-tab |
| Dashboard | `stories/pages/platform/0.0.1/Dashboard.stories.tsx` (+ `dashboard/`) | 289 + scene hook | header + overview + widget grid |

`ingradient-ui` 자체는 **단일 npm package** (`@ingradient/ui`) + `apps/storybook-smoke-consumer` workspace 구조. tsup 으로 7개 sub-export 빌드 중.

---

## 3. 접근 방식 — Plan 보강

[platform-pages-package-plan.md](./platform-pages-package-plan.md) 는 `packages/ui` + `packages/platform-pages` monorepo 분리를 제안한다.

본 roadmap 은 이 목표를 **두 단계로 분리**한다.

### 3.1 Stage A — sub-export 방식 (현재 roadmap 의 본격 범위)

기존 단일 package 안에 `src/platform-pages/` 디렉터리를 추가해 새 sub-export `@ingradient/ui/platform-pages/*` 를 노출한다.

장점:
- tsup entry 1개 / tsconfig path 1개 / package.json exports 1개만 추가
- storybook / playwright / eslint / smoke-consumer 설정 그대로
- 실패 시 rollback 비용 작음

단점:
- 물리적 package 경계는 없음 (folder 경계 + 코드 리뷰로 강제)
- 이름이 `@ingradient/platform-pages` 가 아니라 `@ingradient/ui/platform-pages/*`

### 3.2 Stage B — true package split (별도 roadmap, 본 문서 범위 밖)

Stage A 가 안정화된 뒤 필요 시 `packages/ui` / `packages/platform-pages` workspace 분리. 이 시점에는 import path 만 일괄 치환 (`@ingradient/ui/platform-pages` → `@ingradient/platform-pages`) 하면 되므로 분리 비용이 작아진다.

본 roadmap 은 Stage A 만 다룬다.

---

## 4. 책임 경계 (Stage A 시점)

| 위치 | 역할 | 금지 |
|---|---|---|
| `src/components/*`, `src/patterns/*`, `src/primitives/*` | generic UI 자산 | 도메인 page, react-router, react-query |
| `src/platform-pages/*` | platform 화면 JSX, props-driven, pure view | API 호출, react-router, react-query, zustand, msw, storybook API |
| `stories/pages/platform/*` | scenario + fixture + mock state hook + storybook meta | 도메인 JSX 직접 조립 (가능하면 view import) |
| `ingradient-platform/frontend/pages/*` | container — hook, query, route, view 에 props 주입 | page JSX 재구현 |

---

## 5. Phase 구성

각 Phase 는 다음 4 step 으로 구성된다.

1. **Spec 작성** — `docs/plan/<phase>-spec.md` 신규 문서. props 인터페이스, view 분해, 변경 파일 목록, 검증 기준.
2. **사용자 ok 대기** — spec 검토 후 진행 신호.
3. **실행** — code 변경.
4. **검증** — typecheck (`npx tsc --noEmit`) + build (`npm run build:package` 또는 `build:storybook`) + storybook smoke probe + 영향받는 visual test.

Phase 진입 사이에 사용자 ok 를 받는다. 한 번에 여러 Phase 진행 금지.

### Phase 0 — Sub-export Scaffold

목적: `src/platform-pages/` 빈 패키지 골격 + tsup/exports/tsconfig 배선만 완성. 실제 view 이동은 없음.

작업 단위:
- `src/platform-pages/index.ts` 생성 (export 없음)
- `tsup.config.ts` 에 `platform-pages: 'src/platform-pages/index.ts'` entry 추가
- `package.json` `exports` 에 `"./platform-pages": "./lib/platform-pages.js"` 추가
- `tsconfig.json` `paths` 에 `"@ingradient/ui/platform-pages": ["./src/platform-pages/index.ts"]` 추가
- 검증: `npm run build:package` 성공 + 새 lib 산출물 `lib/platform-pages.{js,d.ts}` 존재 + `npm run build:storybook` 통과

성공 기준: 비어 있는 entry 가 빌드되고 import 가 가능 (`import {} from '@ingradient/ui/platform-pages'` 가 에러 없음).

### Phase 1 — CreateProject 추출

가장 단순한 form page 로 패턴 검증.

작업 단위:
- spec: `CreateProjectView` props 정의 (name/desc/firstDatasetName/projectType/files/submitting/error + handler 7개). 현 story JSX 와 비교.
- `src/platform-pages/create-project/CreateProjectView.tsx`, `CreateProjectView.types.ts`, `index.ts`
- `src/platform-pages/index.ts` 에 `export * from './create-project'`
- `stories/pages/platform/0.0.1/CreateProject.stories.tsx` 를 `CreateProjectView` import 기반으로 rewrite. fixture / scene 은 story 에 유지.
- 검증: typecheck + build + 기존 scenario 모두 동일 렌더링.

성공 기준: story file 의 도메인 JSX 가 view 로 이동. story file ≤ 150 줄.

### Phase 2 — ClassManage 추출

작업 단위:
- spec: 좌(`ClassListSidebar`) / 중(`ClassImagesPanel`) / 우(`ClassInfoSidebar`) 3 subview + overlay (`ClassLightbox`, `AddClassDialog`, `ImageContextMenu`) 분리. 25 scenario 의 props 표 작성.
- `src/platform-pages/class-manage/` — `ClassManageView.tsx` + 3 subview file + `types.ts` + `index.ts`
- story rewrite
- 검증: 25 scenario probe + typecheck + build

성공 기준: 좌/중/우 subview 가 각각 독립 import 가능 (platform 이 부분만 가져갈 수 있도록).

### Phase 3 — Catalog 추출

가장 큰 페이지. desktop view + dialog 분리.

작업 단위:
- spec: `CatalogDesktopView`, `CatalogDialogsView` 분리 결정. toolbar / selection / dataset list panel / image grid props surface 정의.
- `src/platform-pages/catalog/` — multi-file view
- story rewrite (orchestrator ≤ 200 줄 목표)
- 검증: 모든 scenario probe + typecheck + build

성공 기준: story 의 JSX assembly 가 view 로 이동. mobile variant 는 후속 phase 로 (본 phase 는 desktop only).

### Phase 4 — Settings 평탄화

plan 의 Non-goals 였으나 사용자 요청으로 포함.

작업 단위:
- spec: modal shell + 5 tab + tab 내부 sub-tab 의 props 계층. account/project/org/devices/storage 5 view 분리.
- `src/platform-pages/settings/` — `SettingsModalView.tsx` + 5 tab view + dialog view
- story rewrite
- 검증: 31 scenario probe + typecheck + build

성공 기준: 각 tab view 가 독립 import 가능.

### Phase 5 — Dashboard 평탄화

작업 단위:
- spec: header + overview panel + widget grid 의 props. 8 widget 의 visibility / layout / handler 분리.
- `src/platform-pages/dashboard/` — `DashboardView.tsx` + widget composition
- story rewrite
- 검증: 15 scenario probe + typecheck + build

성공 기준: story 의 `DashboardScene` 컴포넌트 삭제, `DashboardView` import 로 대체.

### Phase 6 — Story 정리 + 문서 동기화

작업 단위:
- 모든 platform page story 가 view import 만 하는지 점검 (grep)
- `src/platform-pages/index.ts` re-export 정합성 점검
- `docs/plan/platform-pages-package-plan.md` 의 "현 상태" 절 업데이트
- 새 사용 가이드 1 page (`docs/plan/platform-pages-usage.md`) 작성

성공 기준: 모든 story file 줄 수 < 200 + lint 통과 + doc coverage 통과.

### Phase 7 — ingradient-platform 마이그레이션 (별도 repo)

본 roadmap 의 마지막 단계지만 작업 위치는 ingradient-platform repo. 각 page 별 sub-phase 로 진행 (CreateProjectPage → ClassPage → CatalogPage → SettingsModal → DashboardPage).

각 sub-phase:
- `package.json` 이미 `@ingradient/ui` file: dependency 사용 중이면 추가 작업 없음
- `frontend/pages/<Page>.tsx` 를 container only 로 축소 — 기존 hook 출력을 `<XxxView ... />` props 로 주입
- 기존 components/* 의 page JSX 삭제 또는 view 가 가져간 부분만 제거
- 검증: page 가 실제 동작 (수동 또는 e2e)

본 roadmap 의 Phase 6 까지 끝나야 시작 가능.

---

## 6. 일정 / 의존 관계

```
Phase 0
  └─ Phase 1 (CreateProject)
       └─ Phase 2 (ClassManage)
            └─ Phase 3 (Catalog)
                 ├─ Phase 4 (Settings)   ← Phase 3 와 병행 가능하나 직렬 권장
                 └─ Phase 5 (Dashboard)
                      └─ Phase 6 (Story 정리)
                           └─ Phase 7 (platform 마이그레이션, 별도 repo)
```

Phase 1 이후 Phase 2~5 의 패턴은 동일하므로 Phase 1 의 spec 이 template 역할.

---

## 7. Verification 기준 (공통)

각 Phase 종료 시:

1. `npx tsc --noEmit -p tsconfig.json` — 0 error
2. `npm run build:package` — lib 산출물 정상
3. `npm run build:storybook` — 빌드 통과
4. Playwright probe — 해당 페이지 scenario 모두 정상 렌더링
5. `npm run check:style-literals` / `check:doc-coverage` (해당 시) 통과
6. 변경 파일 200 줄 미만

---

## 8. 리스크 / 대응

### 8.1 view 가 너무 비대해지는 문제

대응: subview 적극 분리. ClassManage / Catalog / Settings 는 처음부터 multi-file 으로 설계.

### 8.2 props surface 가 너무 큼

대응: page 별 "view model" type 도입 허용. 단, view 안에서 query/mutation 변환은 금지.

### 8.3 storybook scene hook 과 view 분리 시 mock state 가 view 에 누락

대응: scene hook 은 story-side 에서 유지하고 view 의 props 로 전달. view 자체에는 useState (visual only) 만 허용.

### 8.4 ingradient-platform 의 기존 page 와 view 의 JSX 차이

대응: Phase 1 spec 작성 시 양쪽 JSX 를 표로 대조. 차이가 크면 view 를 platform 기준으로 작성하고 story 는 props 를 맞춰서 채움.

---

## 9. Non-goals (본 roadmap)

- `packages/*` workspace 분리 (Stage B — 별도 roadmap)
- `ingradient-platform` 의 hook / API / store 변경
- 추가 storybook scenario 작성
- 모바일 variant view 추출 (Catalog mobile 등)
- view 의 visual regression baseline 재촬영

---

## 10. 다음 액션

1. 본 문서 사용자 ok
2. Phase 0 spec 작성 → 사용자 ok → 실행 → 검증
3. Phase 1 spec 작성 → ... (반복)
