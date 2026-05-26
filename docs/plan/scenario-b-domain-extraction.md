# 시나리오 B — 도메인 컴포넌트 추출 + Generic 화 Plan

작성일: 2026-05-26
선행 작업: `refactor/components-vs-patterns-audit` 브랜치 — Plan 실행 완료 (94% 인라인 제거, 신규 19 generic 컴포넌트 추출, 22 도메인 wrapper 외부 이동)
본 작업 브랜치: `refactor/domain-extraction` (현재 브랜치에서 fork 완료)

---

## Context

`@ingradient/ui` 는 **둘 다** 의 정체성:
1. **일반 design system** — 다른 모든 프로젝트에서 재사용 가능한 generic 컴포넌트
2. **annotation 앱들의 design system** — annotation / labeling 류 앱들이 공통으로 쓸 수 있는 자산

현재 `patterns/` 에 80+ 컴포넌트 중 다수가 도메인 결합. 이를 다음 기준으로 재분류:

- **A 카테고리 (외부 이동)**: ingradient platform 만의 도메인 (project / settings / organization / gallery / image-detail 등) → `packages/platform-pages/src/{domain}/`
- **B 카테고리 (rename)**: 코드는 generic 인데 이름만 도메인 → rename + `components/` 또는 `patterns/`
- **C 카테고리 (patterns/ 유지)**: cross-app 재사용 가능 (annotation 앱끼리 공유 + 일반 generic) → `patterns/`

---

## 결정 사항 (모두 사용자 확정)

### 큰 결정 (4)

| # | 항목 | 결정 |
|---|---|---|
| 1 | `@ingradient/ui` 정체성 | **둘 다** — 일반 design system + annotation 앱 design system |
| 2 | features/ 위치 | `packages/platform-pages/src/{domain}/` (Phase B3 일관성) |
| 3 | 작업 범위 + 순서 | B rename 먼저 → A 도메인별 (PR 분리) |
| 4 | 브랜치 | `refactor/domain-extraction` (현재에서 fork) |

### 세부 결정 (17, 모두 권고 채택)

**Q-B1~B12** (B 카테고리 rename): 모두 권고 이름 채택
**Q-A1~A3** (A 카테고리 위치): 모두 적절한 도메인 안 폴더
**Q-C1**: igp-export-modal → `ExportProgressModal` 로 rename
**Q-C2**: reference-image-section → C 카테고리 (patterns/ 유지)
**Q-S1**: stories title 새 title 만 (알리어스 없음, storybook 트리 변화 OK)

---

## 카테고리 A — 외부 이동 (30 컴포넌트)

도메인 결합 강함. `packages/platform-pages/src/{domain}/` 으로 이동.

| 도메인 | 컴포넌트 (개수) | 이동 위치 |
|---|---|---|
| gallery (9) | gallery-delete-dialog, gallery-detail-modal, gallery-export-config-dialog, gallery-export-progress-dialog, gallery-filter-panel, gallery-image-menu, gallery-images-table, gallery-toolbar, gallery-dataset-transfer-dialog | `platform-pages/src/catalog/gallery/` |
| image-detail (2) | image-detail-class-list, image-detail-info-panel | `platform-pages/src/image-detail/` (**신규**) |
| project (6) | delete-project-section, project-member-invite, project-member-row, project-members-list, project-resolution-card, project-settings-form | `platform-pages/src/settings-modal/project/` (이미 존재) |
| settings account (3) | settings-account-tab, delete-account-dialog, password-change-dialog | `platform-pages/src/settings-modal/account/` (**신규**) |
| settings general (1) | settings-general-tab | `platform-pages/src/settings-modal/general/` (**신규**) |
| organization (5) | org-members-tab, org-settings-tab, invitations-section, invitations-tab, join-codes-section | `platform-pages/src/settings-modal/organization/` (**신규**) |
| dashboard (1) | dashboard-overview-panel | `platform-pages/src/dashboard/` (이미 존재) |
| **comments (1)** | comments-panel | `platform-pages/src/image-detail/` (Q-A1: image-detail 폴더 안) |
| **labeling-config (1)** | model-mapping-select | `platform-pages/src/settings-modal/project/class/` (Q-A2: project/class 하위) |
| **dataset (1)** | dataset-task-tag | `platform-pages/src/catalog/` (Q-A3: catalog 안) |

---

## 카테고리 B — rename 으로 generic 화 (20 컴포넌트)

코드는 generic, 이름만 도메인. rename + (옵셔널) props 정리.

| 기존 | 새 이름 | 새 위치 |
|---|---|---|
| annotation-toolbar | **ToolbarShell** | components/inputs |
| bbox-navigation | **IndexedNavigation** | components/navigation |
| labeling-progress-bar | **SegmentedProgressBar** | components/feedback |
| add-class-dialog | **TextInputDialog** | components/overlays |
| class-images-panel | **SelectableGridPanel** | patterns/ (root) |
| class-info-section | **InfoSection** | components/data-display |
| class-list-row | **LabeledSwatchRow** | components/data-display |
| class-pool-list | **SwatchItemList** | components/data-display |
| dataset-filter-chip-row | **FilterChipRow** | components/inputs |
| dataset-menu | **ContextMenuWithSubmenus** | components/overlays |
| duplicate-dataset-modal | **DuplicateItemModal** | components/overlays |
| filter-class-chip | **ColorChip** | components/inputs |
| gallery-mobile-toolbar | **MobileBottomToolbar** | components/navigation |
| image-detail-labelers-list | **UserPoolList** | components/data-display |
| image-detail-sidebar | **DetailPanelSidebar** | components/data-display |
| image-context-menu | (이름 OK — 변경 없음) | components/overlays |
| catalog-mobile-shell | **MobileShell** | components/data-display |
| catalog-right-panel | **SidePanelLayout** | components/data-display |
| analysis-dashboard | **LayoutDashboard** | patterns/ (root) |
| analysis-widget-grid | **WidgetGrid** | patterns/ (root) |
| **igp-export-modal** (C → B 이동) | **ExportProgressModal** | patterns/ (root, Q-C1) |

총 21 컴포넌트 rename (igp-export-modal 추가).

---

## 카테고리 C — patterns/ 유지 (24 컴포넌트)

cross-app 재사용 leaning. `@ingradient/ui/patterns/` 유지.

### C1. 일반 generic — 다양한 도메인 재사용
- **form pattern**: settings-row, settings-section, settings-hint, settings-dialog
- **list pattern**: member-pool-list (avatar+role)
- **widget shell pattern**: dashboard-customize-popover, dashboard-header, dashboard-stats-header, dashboard-widget, analysis-widget-shell
- **comment pattern**: comment-thread (`patterns/comment/`)
- **state chip**: sync-status-chip
- **misc**: license-info-display
- **image grid**: image-grid, image-grid-cell, virtualized-image-grid (`patterns/gallery/`)

### C2. annotation 앱 cross-app 재사용
- **annotation 렌더링**: annotation-overlay, drawing-layer, drawing-layer.renderers (`patterns/annotation/`)
- **annotation canvas**: labeling-canvas, image-inspector-canvas, canvas-overlays
- **annotation 입력**: reference-image-drop-zone, **reference-image-section** (Q-C2: cross-app 분류 — patterns/ 유지)
- **class 도메인 cross-app**: class-hover-card, class-info-sidebar, class-lightbox, class-list-sidebar
- **dataset 도메인 cross-app**: add-dataset-modal, dataset-list-item, dataset-list-panel

---

## 작업 순서

### Phase X1 — B 카테고리 rename + igp-export-modal rename (21 컴포넌트, 안전)

각 1 commit. 의존성 leaf-first 순서. 외부 (`platform-pages`, `edge-pages`, `stories`) import 갱신 포함.

**각 commit 패턴**:
1. 새 파일 생성: `src/components/{folder}/{new-name}.tsx` (또는 patterns/)
2. 코드 옮김 + 이름 변경 (export function/type 모두 새 이름으로)
3. props 의 도메인 어휘 제거 (예: GalleryToolbarProps 의 prop 이름 generic 화)
4. stories 파일 같이 옮기 + title 변경 (옛 title 알리어스 없음)
5. 기존 위치 삭제 + `src/patterns/index.ts` 에서 export 제거
6. `src/components/{folder}/index.ts` 에 새 export 추가
7. patterns 안 의존 (예: class-info-sidebar 가 reference-image-section 사용) 갱신
8. 외부 사용처 import + 사용 코드 갱신 (옛 이름 → 새 이름)
9. `npx tsc --noEmit` + 필요 시 `npm run build:package`

### Phase X2 — A 카테고리 외부 이동 (도메인별 PR 분리, 6 batch)

| Phase | 도메인 | 컴포넌트 수 | 비고 |
|---|---|---|---|
| X2.1 | organization | 5 | 가장 격리됨 |
| X2.2 | project | 6 | settings-modal/project/ 이미 존재 |
| X2.3 | settings account+general | 4 | settings-modal/{account,general}/ 신설 |
| X2.4 | image-detail (+ comments + model-mapping) | 4 | platform-pages/image-detail/ 신설 |
| X2.5 | gallery | 9 | platform-pages/catalog/gallery/ 신설 |
| X2.6 | dashboard-overview + dataset-task-tag | 2 | 각각 dashboard/ + catalog/ |

**각 Phase X2.* 마다**:
1. patterns/shells/{file} → `packages/platform-pages/src/{path}/{file}` (git mv)
2. import 경로 갱신:
   - `../../primitives` → `@ingradient/ui/primitives`
   - `../../components/*` → `@ingradient/ui/components`
   - `../charts/*` → `@ingradient/ui/patterns`
3. stories title: `Patterns/Shells/*` → `Platform Pages/{Domain}/*`
4. `src/patterns/index.ts` 에서 export 제거
5. `packages/platform-pages/src/{path}/index.ts` 신규 + 상위 index.ts re-export
6. 외부 import 갱신 (stories/fixtures, edge-pages, platform-pages 내부 다른 파일 등):
   - `@ingradient/ui/patterns` → `@ingradient/platform-pages`
7. `npx tsc --noEmit` + `npm run build:package`

---

## 예상 최종 상태

| 항목 | 현재 | Phase X 후 |
|---|---|---|
| `patterns/` 파일 수 | ~80 | ~45 (C 카테고리만 + B rename 후 patterns/ 위치 일부) |
| `platform-pages` 파일 수 | ~25 (Phase B3) | ~55 (+30 신규) |
| `patterns/` 의 도메인 결합 강한 것 | ~30 | 0 (모두 외부) |
| 도메인 어휘 가진 컴포넌트 이름 | 많음 | 거의 없음 (rename 완료) |

---

## 위험 + 대응

| 위험 | 대응 |
|---|---|
| 외부 사용처 import 경로 누락 | 매 commit 후 `grep -rn "@ingradient/ui/patterns.*{oldName}"` + `npx tsc --noEmit` |
| rename 후 옛 이름 잔존 | grep 검증 + 자동 sed 일괄 변경 |
| stories title 변경으로 storybook 트리 구조 변화 | Q-S1 결정 — 새 title 만, 알리어스 없음. storybook 트리 변화는 OK (도메인 카테고리 명확화 효과) |
| platform-pages 패키지 export 비대화 | 도메인 폴더별 index.ts + settings-modal 패턴 |
| 의존 순서 잘못으로 commit 중간 빌드 깨짐 | Phase X1 시작 전 의존성 그래프 sanity check + leaf-first 순서 |

---

## 다음 단계

1. Phase X1 의존성 그래프 분석 (leaf-first 순서 확정)
2. Phase X1 첫 commit 시작 — 가장 leaf 인 컴포넌트 부터
3. 매 commit 후 인라인 카운트 / patterns 파일 수 갱신 (이 문서)
4. Phase X1 끝나면 Phase X2.1 (organization) 시작
