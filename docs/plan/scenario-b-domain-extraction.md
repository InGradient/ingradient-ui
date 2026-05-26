# 시나리오 B — 도메인 컴포넌트 추출 + Generic 화 Plan

작성일: 2026-05-26
선행 작업: `refactor/components-vs-patterns-audit` 브랜치 — Plan 실행 완료 (94% 인라인 제거, 신규 19 generic 컴포넌트 추출, 22 도메인 wrapper 외부 이동)
후속 결정: 사용자 검토 후 진행

---

## Context

`@ingradient/ui` 는 다른 프로젝트에서도 재활용 가능한 design system 이어야 한다는 목표. 현재 `patterns/` 에 `~80` 컴포넌트가 남아있고, 그 중 다수가 도메인 결합 (annotation / class / dataset / gallery / project / settings / organization / catalog 등) 이라 generic design system 으로는 부적합.

시나리오 B 채택: design system + cross-app 재사용 가능한 generic-leaning 도메인 컴포넌트 일부만 유지. 강한 도메인 결합은 외부 (`packages/platform-pages` 또는 신규 `features/` 폴더) 로 이동.

---

## 핵심 사전 결정 사항 — 사용자 확인 필요

### 결정 1: `@ingradient/ui` 의 정체성

3 agent 분석에서 가장 큰 이견이 발생한 부분: **annotation 도메인 컴포넌트 (AnnotationOverlay / DrawingLayer / LabelingCanvas / ImageInspectorCanvas 등)** 의 위치.

선택지:
- **(a) annotation 앱들의 design system** — annotation 도메인 컴포넌트가 이 라이브러리의 핵심 자산. → 모두 patterns/ 유지 (cross-app: 다른 annotation 앱에서 재사용)
- **(b) 일반 design system** — annotation 도메인은 외부 책임. → features/annotation/ 또는 platform-pages 로 모두 이동

이 결정에 따라 ~12 컴포넌트의 분류가 달라짐.

### 결정 2: `features/` 폴더 신설 위치

도메인 wrapper 들 (project / settings / organization 등) 의 이동 위치:
- **(a) `packages/platform-pages/src/{domain}/`** — Phase B3 와 동일 패턴 (devices, storage, project 폴더 이미 있음). platform 만의 컴포넌트.
- **(b) 신규 `packages/features/{domain}/`** 또는 `packages/platform-features/` 패키지 — cross-platform-pages 재사용 가능 (edge-pages 도 사용 가능)
- **(c) `@ingradient/ui` 안에 `features/` 폴더** — 라이브러리 내부에 도메인 폴더

권고: **(a)** — Phase B3 와 일관. 일부 도메인 (settings, project) 이 edge-pages 와 공유되면 (b) 검토.

### 결정 3: 작업 범위

- **(a) 전체 한 번에** — ~30 컴포넌트 모두 이동 + ~20 컴포넌트 rename. 같은 브랜치 또는 새 브랜치.
- **(b) 도메인별 단계** — 도메인 영역마다 PR 분리. annotation → class → dataset → gallery → project → settings 순.
- **(c) 위험 낮은 것부터** — B 카테고리 (rename) 먼저 진행, A 카테고리 (외부 이동) 는 도메인별 별도 PR

권고: **(c)** — B (rename 만) 가 외부 영향 가장 작음. A 는 platform-pages 마이그레이션 동반.

---

## 컴포넌트별 분류 (3 agent 종합)

### 🔴 카테고리 A — 외부 이동 권고 (~30 컴포넌트)

도메인 결합 강함. `packages/platform-pages/src/{domain}/` 으로 이동.

| 도메인 | 컴포넌트 | 위치 |
|---|---|---|
| **gallery** (8) | gallery-delete-dialog, gallery-detail-modal, gallery-export-config-dialog, gallery-export-progress-dialog, gallery-filter-panel, gallery-image-menu, gallery-images-table, gallery-toolbar, gallery-dataset-transfer-dialog | platform-pages/catalog/ |
| **image-detail** (2) | image-detail-class-list, image-detail-info-panel | platform-pages/image-detail/ (신규) |
| **project** (6) | delete-project-section, project-member-invite, project-member-row, project-members-list, project-resolution-card, project-settings-form | platform-pages/settings-modal/project/ |
| **settings (account/general)** (4) | settings-account-tab, settings-general-tab, delete-account-dialog, password-change-dialog | platform-pages/settings-modal/{account,general}/ |
| **organization** (6) | org-members-tab, org-settings-tab, invitations-section, invitations-tab, join-codes-section | platform-pages/settings-modal/organization/ |
| **dashboard 도메인** (1) | dashboard-overview-panel | platform-pages/dashboard/ |
| **comments/labeling** (2) | comments-panel, model-mapping-select | platform-pages/image-detail/ + class/ |
| **dataset** (1) | dataset-task-tag | platform-pages/catalog/ (or dataset/) |

### 🟡 카테고리 B — rename 으로 generic 화 (~20 컴포넌트)

코드는 generic, 이름만 도메인. rename + (옵셔널) props 정리 후 patterns/ 또는 components/ 로.

| 기존 이름 | 권고 새 이름 | 권고 위치 | 비고 |
|---|---|---|---|
| **annotation-toolbar** | ToolbarShell / ActionToolbar | components/inputs | generic toolbar API (actions array) |
| **bbox-navigation** | IndexedNavigation / ItemNavigation | components/navigation | index/total/onChange generic |
| **labeling-progress-bar** | SegmentedProgressBar | components/feedback | segments array generic |
| **add-class-dialog** | TextInputDialog / NameInputDialog | components/overlays | text input + dialog |
| **class-images-panel** | SelectableGridPanel | patterns/ | grid + header pattern |
| **class-info-section** | InfoSection | primitives/layout | title + children stack |
| **class-list-row** | LabeledSwatchRow / SelectableColorRow | components/data-display | color + name + count |
| **class-pool-list** | SwatchItemList / ItemPoolList | components/data-display | inline list with swatch + remove |
| **dataset-filter-chip-row** | FilterChipRow | components/inputs | chip row with count |
| **dataset-menu** | (기존 MenuItem + 합성) — 또는 ContextMenuWithSubmenus | components/overlays | submenu 지원 |
| **duplicate-dataset-modal** | DuplicateItemModal / FormDialog | components/overlays | name + checkbox dialog |
| **filter-class-chip** | ColorChip / SelectableChip | components/inputs | checkbox chip with color |
| **gallery-mobile-toolbar** | MobileBottomToolbar / MediaToolbar | components/navigation | viewMode + actions |
| **image-detail-labelers-list** | UserPoolList | patterns/ or components/data-display | user list with avatar |
| **image-detail-sidebar** | DetailPanelSidebar / SlottedSidebar | components/data-display | slot-based sidebar |
| **image-context-menu** | (이미 generic 이름) | components/overlays | position + items[] |
| **catalog-mobile-shell** | MobileShell | components/data-display or layouts | top/body/bottom |
| **catalog-right-panel** | SidePanelLayout / SectionList | components/data-display | sections array |
| **analysis-dashboard** | LayoutDashboard / SlottedDashboard | patterns/ | stats + charts + table slots |
| **analysis-widget-grid** | WidgetGrid / ResponsiveWidgetGrid | patterns/ | 2D layout + visibility |

### 🟢 카테고리 C — cross-app 재사용 leaning, patterns/ 유지 (~25 컴포넌트, **결정 1 에 따라 변동**)

#### C1. 모든 시나리오에서 유지
- **settings-row, settings-section, settings-hint, settings-dialog** — form pattern, 다양한 도메인 재사용
- **member-pool-list** — avatar+role 리스트 pattern
- **dashboard-customize-popover, dashboard-header, dashboard-stats-header, dashboard-widget, analysis-widget-shell** — generic widget shell
- **comment-thread** — Stack wrapper (generic)
- **sync-status-chip** — generic state chip (synced/uploading/failed/local_only)
- **igp-export-modal** — generic export progress pattern (rename 가능: ExportProgressModal)
- **license-info-display** — 단순 표시 컴포넌트
- **image-grid, image-grid-cell, virtualized-image-grid** — generic image grid (Gallery 도메인 무관)

#### C2. 결정 1 에 따라 위치 결정
**(a) annotation 앱 design system 이면 → patterns/ 유지**:
- annotation-overlay (SVG bbox/point 렌더러)
- drawing-layer (canvas drawing engine)
- drawing-layer.renderers (RectObject / PointObject / BboxHandles)
- labeling-canvas (composite image + zoom + DrawingLayer)
- image-inspector-canvas (read-only viewer)
- reference-image-drop-zone (image-id drop)
- reference-image-section (reference + bbox candidates section)
- canvas-overlays (CanvasZoomCloseControls / ImageLoadingOverlay / HiResLoadingPill / ArchivedImageOverlay)
- class-hover-card (image + description hover card)
- class-info-sidebar (entity edit sidebar)
- class-lightbox (lightbox + AnnotationOverlay)
- class-list-sidebar (class list with color swatch)
- add-dataset-modal (dataset creation flow)
- dataset-list-item, dataset-list-panel (dataset list sidebar)

**(b) 일반 design system 이면 → 모두 외부 이동** (features/annotation/, features/class/, features/dataset/)

---

## 결정 사항 (사용자 확정)

| # | 결정 항목 | 결정 |
|---|---|---|
| 1 | `@ingradient/ui` 정체성 | **둘 다 — 일반 design system + annotation 앱들의 design system** (annotation 핵심 컴포넌트는 cross-app 재사용으로 patterns/ 유지, 일반 generic 은 components/, 도메인 결합 강한 것 (project/settings 등) 만 외부) |
| 2 | features/ 위치 | **packages/platform-pages 안** (Phase B3 일관성) |
| 3 | 작업 범위 | **B rename 먼저 → A 도메인별** (위험 낮은 것부터) |
| 4 | 본 작업의 브랜치 | **새 브랜치** (`refactor/domain-extraction` 권고). 현재 `refactor/components-vs-patterns-audit` 는 PR 리뷰 대기. |

---

## 권고 작업 순서 (결정 1 = (a) annotation design system 가정 + 결정 3 = (c) 시)

### Phase X1: B 카테고리 rename 만 (안전, 외부 영향 작음)
~20 컴포넌트 rename. 각각 1 commit. 외부 사용처 (`@ingradient/platform-pages`, edge-pages, stories) import 갱신.
- 동시에 작은 도메인 어휘 제거 (class → swatch, dataset → item, gallery → media 등 generic 단어로)

### Phase X2: A 카테고리 외부 이동 — 도메인별 (PR 분리 권장)

**X2.1 organization** (6) — 가장 격리됨, 다른 도메인 의존 없음
**X2.2 project** (6) — settings-modal 안에 이미 project/ 있음
**X2.3 settings (account/general)** (4) — settings-modal 안 account/, general/ 신설
**X2.4 image-detail + comments + model-mapping** (4)
**X2.5 gallery** (8) — catalog 안에 이미 일부 이동됨
**X2.6 dashboard-overview-panel, dataset-task-tag** (2)

각 단계마다:
- patterns/shells/{file} → packages/platform-pages/src/{domain}/{file}
- import 경로 갱신 (`../../primitives` → `@ingradient/ui/primitives` 등)
- stories title 갱신 (`Patterns/Shells/*` → `Platform Pages/{Domain}/*`)
- src/patterns/index.ts 에서 export 제거
- packages/platform-pages/src/{domain}/index.ts + settings-modal/index.ts (해당 시) 갱신
- 외부 import 갱신 (stories/fixtures, edge-pages 등)
- `npx tsc --noEmit` + `npm run build:package` 통과

### 예상 최종 상태 (결정 1 = (a))

| 항목 | 현재 | Phase X 후 |
|---|---|---|
| patterns/ 파일 수 | ~80 | ~40 (C 카테고리 만 + B rename 후 일부) |
| 외부 platform-pages 파일 수 | ~25 (B3 이동) | ~55 (+30 신규) |
| patterns/ 의 도메인 결합 강한 것 | ~30 | 0 (모두 C2(b) 또는 외부) |
| 도메인 어휘 가진 컴포넌트 이름 | 많음 | 거의 없음 (rename 완료) |

### 예상 최종 상태 (결정 1 = (b))

- patterns/ 파일 수 ~22 (C1 만)
- features/annotation/, features/class/, features/dataset/ 신설 — ~12 파일 추가 이동
- annotation 핵심 자산 (AnnotationOverlay 등) 도 features/ 로 이동 → ui 라이브러리는 generic 만

---

## 위험 + 대응

| 위험 | 대응 |
|---|---|
| 외부 사용처 (platform-pages, edge-pages, stories) import 경로 변경 누락 | 매 commit 후 `grep -rn "@ingradient/ui/patterns.*{oldName}"` + `npx tsc --noEmit` |
| rename 후 옛 이름 잔존 (예: GalleryToolbar → MediaToolbar 누락 import) | grep 검증 후 자동 sed 일괄 변경 |
| stories title 변경 후 storybook 트리 구조 변화 | 사용자 검토. 또는 alias 유지 검토 |
| Phase X2 의 도메인 경계가 애매한 컴포넌트 (예: comments-panel = image-detail or features/comment?) | 결정 1 + 2 의 명확화로 해결 |
| platform-pages 패키지 의 export 비대화 | 도메인 폴더별 분리 — Phase B3 의 settings-modal/{devices,storage,project} 패턴 |

---

## 다음 단계

1. **사용자 결정**: 결정 1 (annotation 도메인 위치), 결정 2 (features/ 위치), 결정 3 (작업 범위), 결정 4 (브랜치)
2. 결정 후 본 plan 업데이트 + Phase X1 (B 카테고리 rename) 부터 시작
3. 매 Phase 끝나면 인라인 카운트 / patterns 파일 수 갱신
4. 본 작업 완료 후 도메인 wrapper 추가 정리 (Phase 5 시각 등) 필요 시 추가 plan
