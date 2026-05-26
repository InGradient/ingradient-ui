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

## 작업 절차 (Workflow)

작업 도중 잊지 않도록 매 commit 의 표준 단계 + 검증 명령어 명시.

### ⚙️ Phase X1 — B 카테고리 rename: 매 commit 10 단계 체크리스트

각 컴포넌트마다 다음 단계를 순서대로:

1. **[사전 분석]** 의존성 + 외부 사용처 grep
   ```bash
   grep -rn "{OldName}\|{old-name}" src/ packages/ stories/ --include="*.ts" --include="*.tsx" | grep -v "lib/"
   ```
2. **[새 파일 생성]** `src/{components|patterns}/{folder}/{new-name}.tsx`
   - 코드 복사 + export 이름 변경 (function + type 모두)
   - import 경로 새 위치 기준 갱신 (`../../primitives` → `../../primitives` 또는 `../primitives` 등)
   - props 의 도메인 어휘 제거 (예: `GalleryToolbarProps` → `MediaToolbarProps`, prop 이름 `gallery*` → generic)
3. **[새 stories 파일]** `{new-name}.stories.tsx`
   - title: `Components/{Category}/{NewName}` (또는 `Patterns/{NewName}`)
   - 알리어스 없음 (Q-S1)
4. **[기존 파일 삭제]** `rm src/patterns/shells/{old-name}.{tsx,stories.tsx}`
5. **[index 갱신]**
   - `src/patterns/index.ts` 에서 옛 export 라인 제거
   - `src/{components|patterns}/{folder}/index.ts` 에 새 export 추가
6. **[patterns 내부 의존 갱신]** patterns 안에 옛 컴포넌트 import 한 파일들의 import + 사용 코드 갱신
7. **[외부 사용처 갱신]** 다음 위치 모두:
   - `packages/platform-pages/src/**`
   - `packages/edge-pages/src/**`
   - `stories/**` (fixtures, builders, pages)
8. **[TS 검증]** `npx tsc --noEmit` 통과
9. **[잔존 확인]** `grep -rn "{OldName}" src/ packages/ stories/ --include="*.ts" --include="*.tsx" | grep -v "lib/"` → 결과 0 (변경 누락 없음)
10. **[commit]** `git commit -m "refactor(components): X1.N {OldName} → {NewName}"` 형식

### ⚙️ Phase X2 — A 카테고리 외부 이동: 매 batch 11 단계 체크리스트

각 도메인 batch 마다 다음 단계를 순서대로:

1. **[사전 분석]** batch 의 모든 컴포넌트의 외부 사용처 grep
   ```bash
   for c in <component list>; do grep -rn "$c\|/$c" packages/ stories/ --include="*.ts" --include="*.tsx" | grep -v "lib/"; done
   ```
2. **[폴더 생성]** `mkdir -p packages/platform-pages/src/{path}`
3. **[git mv]** `git mv src/patterns/shells/{file}.{tsx,stories.tsx} packages/platform-pages/src/{path}/`
4. **[이동된 파일 import 경로 갱신]**
   - `../../primitives` → `@ingradient/ui/primitives`
   - `../../components/*` → `@ingradient/ui/components`
   - `../charts/*` → `@ingradient/ui/patterns`
   - `./sibling` → 검토 (같이 옮긴 sibling 인지 외부 patterns 인지)
   - sed 일괄: `cd packages/platform-pages/src/{path} && sed -i "s|...|...|g" *.tsx`
5. **[stories title 갱신]** `Patterns/Shells/{Old}` → `Platform Pages/{Domain}/{Old}`
   ```bash
   sed -i "s|title: 'Patterns/Shells/|title: 'Platform Pages/{Domain}/|g" *.stories.tsx
   ```
6. **[patterns/index.ts 갱신]** 옮긴 컴포넌트 export 모두 제거
7. **[platform-pages index.ts 생성/갱신]**
   - `packages/platform-pages/src/{path}/index.ts` 신규 (각 파일 export)
   - 상위 index.ts (예: `settings-modal/index.ts`) 에서 `export * from './{path}'` 추가
8. **[외부 사용처 갱신]** 옛 import 경로 → 새 경로
   - `@ingradient/ui/patterns` → `@ingradient/platform-pages` (외부 패키지에서)
   - 또는 `../../{path}` (platform-pages 내부 다른 폴더에서)
   - 갱신 대상: 사전 분석 결과의 모든 파일
9. **[TS 검증]** `npx tsc --noEmit | grep -v "tsup.config\|rootDir\|The file is in the program"` → 결과 0
10. **[Workspace build]** `npm run build:package` 통과
11. **[commit]** `git commit -m "refactor(patterns): X2.N {Domain} N개 → platform-pages/{path}"` 형식

### 🔍 자주 쓰는 검증 명령어

```bash
# 1. TypeScript 통과 (every commit)
npx tsc --noEmit

# 2. Workspace build (Phase X2 끝마다)
npm run build:package

# 3. 옛 이름 잔존 확인 (rename 후)
grep -rn "{OldName}" src/ packages/ stories/ --include="*.ts" --include="*.tsx" | grep -v "lib/"

# 4. 옛 import 경로 잔존 (외부 이동 후)
grep -rn "@ingradient/ui/patterns" packages/ stories/ --include="*.ts" --include="*.tsx" | grep "{OldExport}"

# 5. patterns/shells 잔여 파일 수
ls src/patterns/shells/ 2>/dev/null | grep -vE "\.stories|\.test" | grep "\.tsx$" | wc -l

# 6. 인라인 styled 카운트 (Phase 5 모니터링)
grep -rEh "^const [A-Z][a-zA-Z0-9_]+ ?= ?styled" src/patterns --include="*.tsx" | grep -v "stories\|test" | wc -l
```

### 🚨 자주 빠뜨리는 것들 (체크포인트)

매 commit 전 다음 항상 확인:
- [ ] **stories 파일** 도 같이 옮겼나? (rename 시 .stories.tsx 누락 잦음)
- [ ] **stories title** 갱신했나?
- [ ] **type export** 도 옮겼나? (예: `MobileDropdownOption` 같은 도메인 type)
- [ ] **patterns 내부 의존** 갱신했나? (예: sort-popover-trigger 가 filter-popover-trigger 사용)
- [ ] **fixtures** 도 import 갱신했나? (`stories/fixtures/platform/0.0.1/*`)
- [ ] **builders** 도? (`stories/pages/platform/0.0.1/{dashboard,settings,catalog}/build-*.tsx`)
- [ ] **lib/** 빌드 결과물은 무시 (rebuild 시 갱신)

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

## 진척 상황 (라이브 update — 매 commit 후 갱신)

### Phase X1 — B rename (0/21)
- [ ] X1.1 `annotation-toolbar` → **ToolbarShell** (`components/inputs/`)
- [ ] X1.2 `bbox-navigation` → **IndexedNavigation** (`components/navigation/`)
- [ ] X1.3 `labeling-progress-bar` → **SegmentedProgressBar** (`components/feedback/`)
- [ ] X1.4 `add-class-dialog` → **TextInputDialog** (`components/overlays/`)
- [ ] X1.5 `class-images-panel` → **SelectableGridPanel** (`patterns/`)
- [ ] X1.6 `class-info-section` → **InfoSection** (`components/data-display/`)
- [ ] X1.7 `class-list-row` → **LabeledSwatchRow** (`components/data-display/`)
- [ ] X1.8 `class-pool-list` → **SwatchItemList** (`components/data-display/`)
- [ ] X1.9 `dataset-filter-chip-row` → **FilterChipRow** (`components/inputs/`)
- [ ] X1.10 `dataset-menu` → **ContextMenuWithSubmenus** (`components/overlays/`)
- [ ] X1.11 `duplicate-dataset-modal` → **DuplicateItemModal** (`components/overlays/`)
- [ ] X1.12 `filter-class-chip` → **ColorChip** (`components/inputs/`)
- [ ] X1.13 `gallery-mobile-toolbar` → **MobileBottomToolbar** (`components/navigation/`)
- [ ] X1.14 `image-detail-labelers-list` → **UserPoolList** (`components/data-display/`)
- [ ] X1.15 `image-detail-sidebar` → **DetailPanelSidebar** (`components/data-display/`)
- [ ] X1.16 `image-context-menu` (이름 OK) → `components/overlays/` (위치만 이동)
- [ ] X1.17 `catalog-mobile-shell` → **MobileShell** (`components/data-display/`)
- [ ] X1.18 `catalog-right-panel` → **SidePanelLayout** (`components/data-display/`)
- [ ] X1.19 `analysis-dashboard` → **LayoutDashboard** (`patterns/`)
- [ ] X1.20 `analysis-widget-grid` → **WidgetGrid** (`patterns/`)
- [ ] X1.21 `igp-export-modal` → **ExportProgressModal** (`patterns/`)

### Phase X2.1 — organization (0/5)
- [ ] org-members-tab → `platform-pages/settings-modal/organization/`
- [ ] org-settings-tab → `platform-pages/settings-modal/organization/`
- [ ] invitations-section → `platform-pages/settings-modal/organization/`
- [ ] invitations-tab → `platform-pages/settings-modal/organization/`
- [ ] join-codes-section → `platform-pages/settings-modal/organization/`

### Phase X2.2 — project (0/6)
- [ ] delete-project-section → `platform-pages/settings-modal/project/`
- [ ] project-member-invite → `platform-pages/settings-modal/project/`
- [ ] project-member-row → `platform-pages/settings-modal/project/`
- [ ] project-members-list → `platform-pages/settings-modal/project/`
- [ ] project-resolution-card → `platform-pages/settings-modal/project/` (account 관련이지만 ProjectResolution 이름)
- [ ] project-settings-form → `platform-pages/settings-modal/project/`

### Phase X2.3 — settings account + general (0/4)
- [ ] settings-account-tab → `platform-pages/settings-modal/account/`
- [ ] delete-account-dialog → `platform-pages/settings-modal/account/`
- [ ] password-change-dialog → `platform-pages/settings-modal/account/`
- [ ] settings-general-tab → `platform-pages/settings-modal/general/`

### Phase X2.4 — image-detail + comments + model-mapping (0/4)
- [ ] image-detail-class-list → `platform-pages/image-detail/`
- [ ] image-detail-info-panel → `platform-pages/image-detail/`
- [ ] comments-panel → `platform-pages/image-detail/`
- [ ] model-mapping-select → `platform-pages/settings-modal/project/class/`

### Phase X2.5 — gallery (0/9)
- [ ] gallery-delete-dialog → `platform-pages/catalog/gallery/`
- [ ] gallery-detail-modal → `platform-pages/catalog/gallery/`
- [ ] gallery-export-config-dialog → `platform-pages/catalog/gallery/`
- [ ] gallery-export-progress-dialog → `platform-pages/catalog/gallery/`
- [ ] gallery-filter-panel → `platform-pages/catalog/gallery/`
- [ ] gallery-image-menu → `platform-pages/catalog/gallery/`
- [ ] gallery-images-table → `platform-pages/catalog/gallery/`
- [ ] gallery-toolbar → `platform-pages/catalog/gallery/`
- [ ] gallery-dataset-transfer-dialog → `platform-pages/catalog/gallery/`

### Phase X2.6 — dashboard-overview + dataset-task-tag (0/2)
- [ ] dashboard-overview-panel → `platform-pages/dashboard/`
- [ ] dataset-task-tag → `platform-pages/catalog/`

### 최종 검증
- [ ] `npm run build:package` 통과 (ui + platform-pages + edge-pages)
- [ ] `grep -rn "@ingradient/ui/patterns" packages/ stories/` 결과에 옛 이동 컴포넌트 0
- [ ] `ls src/patterns/shells/` 잔여 ~24 파일 (C 카테고리 만)
- [ ] plan 문서 진척 상황 모두 ✅
- [ ] 인라인 styled 카운트 갱신 (Phase 5 후 이미 ~27)

---

## 다음 단계

1. Phase X1 의존성 그래프 분석 (leaf-first 순서 확정) — Task #65
2. Phase X1.1 첫 commit 시작
3. 매 commit 후 위 진척 상황 체크박스 update
4. Phase X1 끝나면 Phase X2.1 (organization) 시작
5. Phase X2 끝나면 최종 검증

**중요**: 매 commit 끝나면 이 문서의 **진척 상황** 체크박스를 `[ ]` → `[x]` 로 update + commit hash 옆에 기록.
