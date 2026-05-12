# Phase 9 — Platform 0.0.1 핵심 페이지 (catalog/training/analytics/settings)

**상위 문서**: [storybook_architecture_restructure.md § 6.1, § 15.3, § 16.3-16.4](../storybook_architecture_restructure.md)
**위험도**: 낮음 (storybook 만 추가)
**선행 조건**: Phase 7 (Global toolbar), Phase 8 (scenario helper)
**후속 단계**: Phase 10 (Handoff + Scenario Matrix)

---

## 1. 목적

§ 6.1 예시의 platform 0.0.1 4개 핵심 페이지를 storybook stories 로 구현. 각 페이지는 Phase 8 의 scenario + page controls 패턴 적용.

## 2. 대상 페이지 (3)

**범위 조정 (2026-05-12)**: § 6.1 예시의 catalog/training/analytics/settings 는 추상 예시. 실제 platform 에 없는 training / analytics 는 제외. 실재 페이지 중심으로 변경:

| Story | 원본 platform 페이지 | § 16 scenarios | 주요 ui |
|---|---|---|---|
| `Catalog.stories.tsx` | `pages/CatalogPage.tsx` | Default/Empty/Huge/Long Names/Syncing/Permission Denied/Server Error/Multi Selection/Export Ready | SidebarShell + FilterBar + Table/Grid + Drawer |
| `ClassManage.stories.tsx` | `pages/ClassManagePage.tsx` | Default/Empty/Loading/Permission Denied/Long Names | SidebarShell + 클래스 리스트 + Drawer |
| `CreateProject.stories.tsx` | `pages/CreateProjectPage.tsx` | Default/Filled/Validation Error/Submitting/Server Error | Card + FormSection + RadioCardGroup + UploadDropzone |

**별도 검토 필요**: `Dashboard.stories.tsx` (= 분석 대시보드, `pages/DashboardPage.tsx`) — Phase 4 의 widget grid 의존성 + 차트 시각 복잡도. Phase 10 이후 별도 phase 에서 다룸.

**SettingsModal** 은 별도 page 가 아니라 modal — Phase 9 에서 제외.

## 3. 작업 항목

각 페이지마다:

### 3.1 fixtures
- `stories/fixtures/platform/0.0.1/<page>-scenarios.ts` — scenario별 데이터 set

### 3.2 story
- `stories/pages/platform/0.0.1/<page>.stories.tsx`
- scenario arg + 필요시 page controls (viewMode, sidebar, rightPanel 등)
- 최소 4~5 variant export

### 3.3 의존성 정책
- `@ingradient/ui/{components,patterns,primitives,brand}` 만 import
- 비즈니스 hook / API 호출 없음
- 라우팅 없음 (link 는 `<a href="#">`)

## 4. Page controls 사용

| Page | 사용할 controls |
|---|---|
| Catalog | viewMode (table/grid), sidebar, rightPanel, filterStyle, selectionMode |
| ClassManage | sidebar, rightPanel |
| CreateProject | (해당 없음 — 단일 form 페이지) |

## 5. 검증

- [ ] typecheck 통과
- [ ] eslint 통과
- [ ] 각 story 가 Service=Platform + Version=0.0.1 자동 매칭 시 platform preset 으로 렌더
- [ ] scenario 전환 시 데이터 변화 확인
- [ ] page controls 변경 시 레이아웃 변화 확인 (viewMode, sidebar 등)

## 6. 산출물
- 4 페이지 stories + 4 scenarios fixture
- 본 plan 문서

## 7. 제외 (다음 phase)
- Handoff 메타 (Service/Version/Required Scenarios/Platform Integration) — Phase 10
- Scenario Matrix 자동 검증 — V1+
- Sandbox 승격 워크플로우 — V1+
- Edge / Medical 의 추가 페이지 — Phase 11+
