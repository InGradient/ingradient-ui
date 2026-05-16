# Platform Edge UI 이전 로드맵

> 목적 — platform 의 `frontend/components/edge/` (8 파일 ~805줄) + `frontend/components/analysis/{DeflectometryDashboard,EdgeAnalytics}Section.tsx` (2 파일 ~143줄) 의 UI 를 ingradient-ui / `@ingradient/platform-pages` 로 이전. 도메인 특화 (industrial 결함 검사용 edge device 운영) 이지만 platform 이 import 만 바꾸면 그대로 작동하도록.

## Context

Platform Edge UI 는 다음 2 군데에 들어감:

1. **Settings Modal 의 Edge 탭** ([SettingsModal.tsx:148-156](../../../ingradient-platform/frontend/components/settings/SettingsModal.tsx#L148-L156)) — 프로젝트당 edge device 관리. 3-tab (Import / Export / Work options) 인터페이스 + Deflectometry config 폼.
2. **Dashboard 페이지 하단 섹션** ([AnalysisDashboard.tsx:66-69](../../../ingradient-platform/frontend/components/analysis/AnalysisDashboard.tsx#L66-L69)) — `deflectometry_enabled` 프로젝트 또는 `edge_analytics` 데이터가 있을 때 widget grid **아래에** 추가 렌더.

## 원칙

1. **Pure UI + Container split**: 비즈니스 로직 (API call / polling / mutation / store) 은 platform 에 잔류. UI 만 prop-기반 pure component 로 platform-pages 로 이동.
2. 각 파일 200줄 미만 (CLAUDE.md). 200줄 초과 시 `*.styles.ts` 또는 hook 으로 분리.
3. 기존 패키지에 통합: edge 관리 → `packages/platform-pages/src/settings-modal/`, analysis sections → `packages/platform-pages/src/dashboard/`. 별도 sub-package 안 만듦.
4. 매 phase 끝 typecheck + build + 관련 probe 통과.
5. platform 의 hook (`useEdgeManagementState`, `useImportTab`, `useExportTab`, `useWorkOptionsSave`) 은 그대로 유지 — pure UI 가 hook 의 return shape 을 그대로 props 로 받도록 설계.

## Phase 의존 관계

```
Phase A (Dashboard sections — pure UI)
   └→ Phase B (Settings Edge tab — container/pure split, 4 sub-phases)
        ├─ B1: edge.styles + DeflectometryPreview + DeflectometryOptions (pure)
        ├─ B2: ImportTabUI + ExportHistory (medium refactor)
        ├─ B3: ExportTabUI + WorkOptionsTabUI (container split)
        └─ B4: EdgeManagementPanel 통합 + SettingsModal Edge tab wire
```

각 phase 시작 시 별도 phase 문서 작성. 결과물 = platform-pages 의 신규 컴포넌트 + (storybook scenario 가능 시) + (probe).

---

## Phase A — Dashboard Edge analysis sections [S]

**대상**: 2 파일 ~143줄. 모두 pure UI (`edgeAnalytics` prop 만 받음).

- `DeflectometryDashboardSection.tsx` (61줄) — Deflectometry summary 카드 + step timing BarChart
- `EdgeAnalyticsSection.tsx` (82줄) — Edge session summary 카드 + outcome PieChart + worker table + step timing BarChart + class distribution BarChart

이전 후 platform 의 `AnalysisDashboard.tsx` 가 새 import 로 swap. Storybook Dashboard story 에 `edge-analytics` scenario 추가 가능.

문서 — [platform-edge-phase-a.md](./platform-edge-phase-a.md)

---

## Phase B — Settings Modal Edge tab [L]

**대상**: 8 파일 ~805줄. Container/pure split + 기존 settings-modal 패키지에 통합.

### B1 — Pure UI 부품 (3 파일, ~336줄)

- `edge.styles.tsx` (143줄) → `platform-pages/settings-modal/edge-tab/edge.styles.ts` 그대로 이전
- `DeflectometryPreview.tsx` (49줄) → canvas 기반 stateless renderer. 그대로 이전 (단 `drawPattern` / `formatBadgeLabel` util 도 함께)
- `DeflectometryOptions.tsx` (144줄) → stateless config form. 그대로 이전 (`computeTotalPatterns` util 함께)

### B2 — ImportTab + ExportHistory (2 파일, ~210줄)

- `ImportTab.tsx` (101줄) → `useImportTab()` hook 결과를 props 로 받는 `ImportTabUI` 추출. platform 은 hook + UI 결합.
- `ExportHistory.tsx` (109줄) → 거의 dumb table (local edit state 만). pure UI 로 이전 (`EdgePackage` type 은 generic 으로).

### B3 — ExportTab + WorkOptionsTab (2 파일, ~217줄)

- `ExportTab.tsx` (122줄) → `useExportTab()` 의 4 mutation 결과 + state 를 props 로 받는 `ExportTabUI` 추출
- `WorkOptionsTab.tsx` (95줄) → `useWorkOptionsSave()` mutation + deflectometry config state lift. `WorkOptionsTabUI` 추출

### B4 — EdgeManagementPanel + SettingsModal wire (1 파일 + integration)

- `EdgeManagementPanel.tsx` (42줄) → 3-tab shell. tab state 만 들고 ImportTabUI / ExportTabUI / WorkOptionsTabUI 를 swap. `currentProject` 도 prop 으로 받음.
- platform 의 `SettingsModal.tsx` 가 새 `EdgeManagementPanel` import — hook 호출 후 prop 전달

문서 — [platform-edge-phase-b.md](./platform-edge-phase-b.md)

---

## Phase 시작 / 종료 워크플로우

각 phase 마다:

1. **시작 전**: phase 문서 검토 (또는 작성). 사용자 확인.
2. **구현**: phase 문서의 step 순서대로. 각 step 끝나면 typecheck.
3. **종료 전**:
   - 전체 typecheck + build:package + build:storybook
   - 관련 probe 실행 (Phase A → dashboard, Phase B → settings-modal)
   - phase 문서 끝에 "완료 기록" 섹션 추가 (변경 파일 목록, 결과)
4. **다음 phase**: 위 사이클 반복.

## Verification

각 phase 끝:
- `npx tsc --noEmit` EXIT=0
- `npm run build:package` 성공
- `npm run build:storybook` 성공
- Phase 별 probe 통과 (Phase A → dashboard.mjs, Phase B → settings-modal.mjs)
- 사용자 visual review (선택)
