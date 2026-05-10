---
title: ingradient cross-app design system master plan
date: 2026-05-09
scope: ingradient-ui ↔ ingradient-platform ↔ ingradient-edge (+ 향후 다른 프로젝트)
status: living document — 모든 결정/진행 상황을 여기에 누적
---

# Ingradient Cross-App Design System — Master Plan

> 이 문서는 ingradient 의 3 repo (ui, platform, edge) 간 design system 통합 작업의 단일 truth source. 모든 상위 plan / governance / 진행 상황은 여기서 시작.

## 목차

1. [Vision & 목표](#1-vision--목표)
2. [핵심 원칙](#2-핵심-원칙)
3. [3 repo 의 책임 분담](#3-3-repo-의-책임-분담)
4. [작업 인벤토리](#4-작업-인벤토리)
   - [완료된 거리](#41-완료된-거리-누적)
   - [진행 중 / 합의 필요](#42-진행-중--합의-필요)
   - [계획됨 (plan 문서 있음)](#43-계획됨-plan-문서-있음)
   - [장기 / 미정](#44-장기--미정)
5. [Phase 별 roadmap](#5-phase-별-roadmap)
6. [의사결정 record](#6-의사결정-record)
7. [측정 지표](#7-측정-지표)
8. [참조 문서](#8-참조-문서)
9. [작업 진행 절차](#9-작업-진행-절차)

---

## 1. Vision & 목표

### Vision

> **`ingradient-platform`, `ingradient-edge`, 그리고 향후 다른 프로젝트가 모두 `@ingradient/ui` 의 design system 위에서 시각적/패턴적으로 일관된 사용자 경험을 제공한다.**

### 핵심 목표

1. **일관성**: 디자이너가 ui 한 곳을 수정하면 모든 소비자에 자동 적용
2. **소비자 components/ 최소화**: page-specific 한 것만 프로젝트에 두고, 나머지는 ui 로
3. **ui simple 유지**: 유연성을 위한 props 폭증 금지. 1 컴포넌트 1 책임. 200줄 미만
4. **재사용성**: 새 프로젝트가 ui 만 import 하면 즉시 일관 UX 확보

### 비-목표 (의도적으로 안 함)

- ui 에 비즈니스 로직 / store / api 호출 포함
- 모든 페이지를 동일하게 만드는 것 (도메인 차이는 자연 — 색/크기/배치 약간 차이 OK)
- light mode 즉시 도입 (token 기반이라 가능하지만 현재 우선순위 아님)

### 작업 방식 (plan-first + iteration)

**모든 PR 은 구현 전 plan 문서 작성 필수**. 작은 PR (15분짜리 import 정렬) 도 예외 없음.

- **plan 문서 작성** → 사용자 review → 합의 후 구현
- 구현 중 발견한 부족 / 누락 / 변경 거리는 **다음 PR 의 plan 에 반영** (소급 X, 진행 중 PR 의 scope 확장 X)
- plan ≠ TODO. plan 은 "왜 이렇게 하는가, 어떤 trade-off, 어떤 위험" 까지 담음
- 자세한 절차는 § 9.1 / § 9.5 참조

→ 이 방식으로 plan 누적이 자연스럽게 design system 의 design rationale 문서가 됨.

---

## 2. 핵심 원칙

상세는 [governance.md](./governance.md) 참조. 요약:

### 2.1 ui 의 역할 / 비-역할

| 역할 (✅) | 비-역할 (🚫) |
|---|---|
| design token (color, spacing, typography, motion) | 비즈니스 로직 / store / api |
| 공통 패턴 컴포넌트 (Button, Modal, Toast, ImageGrid 등) | 도메인 데이터 / model 직접 의존 (`Dataset` 등) |
| 도메인 무관 hook (useClickOutside, useConfirm) | 페이지/feature 별 layout (CatalogLeftPanel 등) |
| 시각 일관 보장 | rich function pool (rich text editor 등) |

→ "1 프로젝트만 사용" 은 비-역할 사유 아님. **재사용 가능성** + **도메인 무관** 둘 다 만족 시 ui 추가 (D-007).

### 2.2 컴포넌트 추가 기준 (모두 만족)

| 조건 | |
|---|---|
| **재사용 가능성** | 현재 1 프로젝트라도 향후 다른 프로젝트에서 needs 가 생길 수 있으면 ui — **소비자 components 최소화 우선** |
| **도메인 무관** | generic shape (`{ id, src }`), 도메인 model 의존 X |
| **외부 store 무관** | zustand/react-query 의존 X. state 는 props 또는 caller |
| props ≤ 5 (권장) | 단순 인터페이스. 더 필요하면 render slot |
| 파일 ≤ 200줄 (필수) | 200 넘으면 split |

→ 판단 우선순위: **도메인 무관 + 재사용 가능성** > props/줄수 (split 으로 해결 가능).

### 2.3 consumer 측 customize 규칙

`styled()` wrap 5줄 이상 = ui props 부족 신호 → ui PR 거리.

```
✅ OK: layout 적응 (`flex-shrink: 0`)
✅ OK: token variant (`variant="secondary" tone="danger"`)
🚫 거의 금지: inner 스타일 재정의 (background, padding 등 전체 변경)
```

### 2.4 ui 가 부족할 때 의사결정

```
1. ui 에 props 1-2개 추가 → ui PR
2. ui 에 새 컴포넌트 추가 → governance 점검 후 ui PR
3. 도메인 needs → 프로젝트 components/ (ui 컴포넌트 조립 + 도메인 코드)
4. 5줄 이하 wrap 으로 충분 → 프로젝트 *.styles.ts (governance 2.3 규칙 준수)
```

### 2.5 거부 명단 (ui 에 안 둠)

명시적으로 ui 에 안 두기로 합의된 패턴:

- **AccountMenu** (cross-app) — domain 차이 큼 (TopBar prefillCredentials vs DatasetSelect 단순 logout)
- **image-detail-modal** — 95vw + sidebar+tabs+bbox layout, page-specific
- **edge LogPanel image lightbox** — 단순 `ModalBackdrop + img`, ui 가치 X
- **gallery toolbar dropdowns** — `data-*-dropdown` selector 패턴, cross-component ref drilling 비용
- **edge custom Button 25+ 변형** — 대다수 page-specific (IconBtn / list-item / window control / form picker)
- **LogDetailTable** — key-value display, ui Table (data table) 부적합

---

## 3. 3 repo 의 책임 분담

### `@ingradient/ui` (foundation)

```
src/
├── tokens/           # color, spacing, typography, motion, shadow, z-index
├── components/       # Button, Modal, Toast, Dialog, ImageGrid, ...
├── hooks/            # useClickOutside, useConfirm, useToast, ...
└── patterns/         # Panel, layout 보조
```

**책임**:
- token 의 단일 truth source
- 공통 컴포넌트 (governance 기준 만족 시)
- storybook + test 의무

**비-책임**: 도메인 / 비즈니스 / 페이지 layout

### `ingradient-platform` (web app)

```
frontend/
├── components/       # 페이지/feature 별 도메인 컴포넌트
├── features/         # hook + utility (도메인 logic)
├── pages/            # 라우트 entry
├── api/              # backend 호출
└── store/            # zustand (UI / auth / ...)
```

**ui 의존 방식**: `import { ... } from '@ingradient/ui/components'` — wrap 최소화

### `ingradient-edge` (electron app)

```
src/frontend/
├── components/       # 페이지/feature 별 도메인 컴포넌트
├── features/         # hook + utility
├── pages/            # 화면 entry
├── store/            # zustand
└── shared/           # 공통 utility
src/electron/         # main process (backend, db, IPC)
```

**ui 의존 방식**: 동일. tarball 배포 (`@ingradient/ui` file:X.tgz).

### 새 프로젝트 (향후)

ui 만 import 하면 시작 가능. governance 따르며 ui 가 부족할 때만 PR 거리.

---

## 4. 작업 인벤토리

### 4.1 완료된 거리 (누적)

#### ui 측 추가
| 항목 | 효과 |
|---|---|
| **Toast 확장** (`action`, `duration:0=persistent`, close button) | edge custom Toast 통합 가능 |
| **`useConfirm()` hook + `<ConfirmProvider>`** | imperative confirm API. platform 8 곳 native confirm() 마이그레이션 |
| **`useClickOutside()` hook** | refs (단일/배열), event (click/mousedown), capture, enabled prop. edge 3 + platform 6 사용처 통합 |
| **Foundation color CSS var alias** | `--ig-color-white-04/06/07/08/12/18/96`, `--ig-color-blue-tint-12/14/16/18/28/38/42` 직접 노출 |
| **`InfoRow + InfoRowLabel + InfoRowValue`** (PR-0.2, 2026-05-09) | 2-column key-value readout. platform `ImageInfoRow` (image metadata) + edge `DiagRow` (NIC 진단) 통합 |
| **`ImageGrid` 신규 (대체) + `VirtualizedImageGrid` 신규** (PR-1.1~1.5, 2026-05-09) | render slot (overlay/footer/topRight) + selection (modifier 키 자동 분류) + 가상화 (TanStack row-based) + 무한스크롤 (sentinel 또는 virtualized). props 14개 (governance 5권장 어김 — 도메인 흡수 위해 render slot 우선) |
| **`@tanstack/react-virtual`** ui dep 추가 (PR-1.1) | edge 만 가지던 dep 을 ui bundled. virtualized-image-grid.tsx 격리 import — 가상화 안 쓰는 caller tree-shake |
| **`classifySelectionAction(event)`** util (PR-1.1) | shift/ctrl/meta 키 → `'toggle'/'range'/'single'` 분류 표준화 |
| **`MenuPopover` 의 `anchor` prop** (PR-A3, 2026-05-09) | styled → forwardRef 변환. `anchor: { top, left }` 받으면 fixed positioning 자동. platform 2개 wrap (DatasetContextMenu, UserMenu) 의 positioning 부분 제거 |
| **`TextField` 의 `size?: 'sm'|'md'|'lg'` prop** (PR-A4) | forwardRef 변환 + size prop. PasswordField 도 동일. platform 4 wrap (InfoNameInput, ClassSearchInput, FilterInput, ModalInput) 의 padding/font-size/height 제거 |
| **`CheckboxGroup`** 신규 (PR-A5) | items + selectedIds + onChange. 양 AddDatasetModal 의 inline class selection (~50줄) 흡수 |
| **`RadioCardGroup`** 신규 (PR-A6) | vertical option group. options + value + onChange + per-option disabled. 양 AddDatasetModal 의 TaskTypeBtn (~44줄) 흡수 |
| **`StepIndicator`** 신규 (PR-B2) | items prop + status 별 자동 icon (Spinner/Check/X/Circle). edge DiagStep* 4 styled + 13줄 boilerplate 흡수. setup wizard / deployment flow 등 향후 재사용 |
| **`FilterPopover` + `FilterPopoverSection`** 신규 (PR-B4) | popover-with-sections 패턴. anchor + width props + actions slot. edge ImagesView + platform gallery toolbar 합 ~80줄 styled 흡수 + 시각 통일 |
| **`SelectableListItem`** 신규 (PR-C1) | list-item / card-button 통합 컴포넌트. variant `flat` / `card` + selected + dragOver + as `button`/`li`. platform DatasetRow (drag-drop list) + edge ClassItem (clickable card) 통합 |

#### platform 마이그레이션
| 항목 | 결과 |
|---|---|
| 9 modal → DialogShell | catalog 4 + gallery 4 + classes 1 |
| 8 native `confirm()` → `useConfirm` | settings/devices/invitations/members/project/classes/catalog |
| 5 LoadingState/EmptyState 마이그레이션 | OrgMembersTab, InvitationsTab, LicenseTab, DevicesLicenseSection, OrgTab |
| 6 사용처 useClickOutside | catalog (3) + gallery (1) + dashboard (2) + classes (1) — `use-gallery-toolbar-ui` 는 skip |
| raw rgba 218 + hex 236 → CSS var | 약 454 raw 색상 토큰화 |
| brand blue 통일 | `74,158,255` → `77,136,255` |
| 5 styles 파일 split | analysis / Sidebar / CatalogRightPanel / virtualized-grid / DevicesTab — 모두 200줄 미만 |
| **PR-0.2 ImageInfoRow → InfoRow 마이그** (2026-05-09) | `ImageDetailInfoPanel.tsx` 의 ~30 행 + `image-detail-modal.styles.info.ts` 의 3 local styled 제거 |
| **PR-1.3 classes ClassImagesPanel 마이그** (2026-05-09) | 200줄 → 147줄. `AnnotationOverlay.tsx` (87줄) 추출. `Thumb / ThumbCard / ThumbOverlay / ThumbBbox / ThumbPoint / ImageGrid` 6 styled 제거. `loadedImageSizes` prop drill 제거 |
| **PR-1.4 catalog virtualized-image-grid 마이그** (2026-05-09) | 4 파일 (553줄, cell-parts 포함 시 682) 제거. `CatalogImageGrid.tsx` (141줄) + `HoverPreview.tsx` (47줄) 추출. 순감소 -365줄 (cell-parts 포함 시 -494) |
| **PR-A3 MenuPopover anchor** (2026-05-09) | DatasetContextMenu MenuDropdown + UserMenu Menu 의 positioning props 제거 |
| **PR-A4 TextField size** (2026-05-09) | InfoNameInput / ClassSearchInput / FilterInput / ModalInput 의 padding/font-size/height 제거. caller 가 `attrs({ size: 'sm' })` |
| **PR-A5 CheckboxGroup 마이그** (2026-05-09) | catalog AddDatasetModal class selection inline 26줄 → `<CheckboxGroup>` 9줄 |
| **PR-A6 RadioCardGroup 마이그** (2026-05-09) | TaskTypeRow + TaskTypeBtn 22줄 styled 제거 → `<RadioCardGroup>` 호출 |
| **PR-B3 images-table → ui Table** (2026-05-09) | raw `<table>` + 2 styled 제거 → ui `<Table columns rows>`. ThumbCellImg 도메인 styled 만 유지 |
| **PR-B4 gallery toolbar dropdowns 마이그** (2026-05-09) | FilterDropdown (32줄, gradient + blur 장식) + FilterSection + FilterSectionTitle 3 styled 제거. caller 8 sections + sort dropdown 변환 |
| **PR-C1 DatasetRow → SelectableListItem** (2026-05-09) | catalog sidebar dataset list (drag-drop target) → `<SelectableListItem as="li" variant="flat" dragOver>` |

#### edge 마이그레이션
| 항목 | 결과 |
|---|---|
| 자체 Toast 시스템 → ui Toast | 140줄 삭제 (`shared/ToastContainer.tsx` + `store/useToastStore.ts`) |
| AccountMenu 통합 | 228줄 (TopBar + DatasetSelect 분리) → 130줄 (`components/AccountMenu.tsx`) + props 분기 |
| 3 modal → DialogShell | SystemMonitor + AddDataset + Export |
| ShutdownSpinner → ui Spinner | App.tsx |
| LoginScreen → TextField/PasswordField | 2 fields |
| ForceIpDialog → Radio/Checkbox | 4 inputs |
| 3 사용처 useClickOutside | AccountMenu + LogPanel + ImagesView |
| raw rgba 107 + hex 28 → CSS var | 약 135 색상 토큰화 |
| **PR-0.1 ConnectionTab form 마이그** (2026-05-09) | 8 sub-section 의 4 local styled (Section/SectionTitle/FormGroup/FieldLabel) → ui `FormSection / SectionTitle / FieldGroup / FieldLabel`. uppercase 라벨 + 하단 border 헤더 시각 의도는 ui 표준 (no uppercase, no border) 으로 통일 [D-013] |
| **PR-0.2 DiagRow → InfoRow 마이그** (2026-05-09) | NicStatusCard.tsx 의 ~25 행 + ConnectionTab.styles 의 3 local styled 제거 |
| **PR-1.5 ImagesView grid 부분 마이그** (2026-05-09) | 1442 → **1270줄 (-172, 11.9%)** — 목표 ~1300 초과 달성. `EdgeImagesGrid.tsx` (153줄) + `BboxOverlay.tsx` (33줄) 추출. 가상화 boilerplate + 6 styled 제거 (VirtualScrollTrack / VirtualGridRow / ImageCell 등) |
| **PR-B1 SetupPanel 정렬** (2026-05-09, D-013 옵션 A) | SetupSection / SectionTitle / SetupField / SetupInput / SetupInlineHint / Reset/Save 버튼 → ui FieldGroup / SectionTitle / FieldLabel / TextField / FieldHint / Button. SetupPanel.tsx + CameraParamsTab.tsx 30+ 곳 마이그. uppercase 라벨 + implicit label 시각 의도 ui 표준 통일 |
| **PR-B2 DiagStep* → StepIndicator** (2026-05-09) | NicDiagnostics 의 4 styled + 13줄 progress block → `<StepIndicator items />` 1줄 |
| **PR-B4 ImagesView filter popover 마이그** (2026-05-09) | ImagesFilterPopover/Section/Title 3 styled → ui FilterPopover/FilterPopoverSection |
| **PR-C1 ClassItem → SelectableListItem** (2026-05-09) | edge labeling RightPanel 의 ClassItem (bordered card) → `<SelectableListItem variant="card">` |

#### 작성된 governance / plan
- ✅ `MASTER-PLAN.md` (본 문서, 모든 작업의 entry point)
- ✅ `governance.md` (상세 원칙 + 결정 트리 + 거부 명단)
- ✅ `plan/cross-app-roadmap.md` (Phase 별 단계 roadmap)
- ✅ `plan/image-grid-unification.md` (Phase 1)
- ✅ `plan/components-audit-findings.md` (Phase 0 + Phase 2 — 11 PR)
- ✅ `plan/storybook-coverage.md` (Phase 3 — 마지막)
- ✅ `plan/toast-enhancement.md` (이미 완료된 거리)
- ✅ `plan/click-outside-hook.md` (이미 완료된 거리)
- ✅ `plan/color-token-migration.md` (이미 완료된 거리)

### 4.2 진행 중 / 합의 필요

#### ✅ 합의 완료 (§ 6 record 참조)

- D-007 ui 추가 기준 (도메인 무관 + 재사용 가능성, 1 프로젝트라도 OK)
- D-008 Phase 순서 (ImageGrid → 작은 거리 → Storybook 마지막)
- D-009 edge custom Button 거부 명단 추가
- D-010 components/ audit 결과 (11 PR 거리)
- D-011 Phase 0 (warm-up) 신설
- D-012 plan-first + iteration 워크플로우

#### ⏳ 잔여 (진행 중 결정)

| 항목 | 결정 시점 |
|---|---|
| `VirtualizedImageGrid` split 시점 | Phase 1 진행 중 (200줄 limit 도달 시 split) |
| TaskTypeButtons → ModeSwitcher cover 가능성 | Phase 2 PR-A6 audit 시 |
| NicStatusCard 별도 추출 vs InfoRow 사용 | Phase 0 PR-0.2 진행 중 (default: InfoRow 만 사용) |
| 각 audit 결과 (Phase 2 의 B1/B3/B4/C1) | 해당 PR 진행 중 |

### 4.3 계획됨 (plan 문서 있음)

#### Phase 0 — Warm-up ✅ **완료 (2026-05-09)**

Phase 2 의 quick wins 2개를 먼저 진행 — 독립 거리, 즉시 효과 + 패턴 확립.

- ✅ **PR-0.1**: edge `ConnectionTab.styles.ts` 의 local `Section/SectionTitle/FormGroup/FieldLabel` → ui `FormSection/SectionTitle/FieldGroup/FieldLabel` 마이그 (8 파일 — sub-plan: `plan/pr/0-1-edge-form-import-align.md`)
- ✅ **PR-0.2**: ui `<InfoRow>` 신설 + edge `DiagRow` + platform `ImageInfoRow` 마이그 (sub-plan: `plan/pr/0-2-info-row-extraction.md`)

→ 시각 일괄 검증은 마지막에 (사용자 결정).

#### Phase 1 — ImageGrid 통합 ✅ **완료 (2026-05-09)**

D-015 정신 따라 PR 순서: 1.1 → 1.3 → 1.4 → 1.5 → 1.2 (test 마지막).

- ✅ **PR-1.1** ui ImageGrid 신규 + VirtualizedImageGrid + helpers (sub-plan: `pr/1-1-image-grid-rewrite.md`)
- ✅ **PR-1.3** classes ClassImagesPanel 마이그 + AnnotationOverlay (sub-plan: `pr/1-3-platform-classes-migration.md`)
- ✅ **PR-1.4** catalog virtualized-image-grid 마이그 + CatalogImageGrid + HoverPreview (sub-plan: `pr/1-4-platform-catalog-migration.md`)
- ✅ **PR-1.5** edge ImagesView grid 마이그 + EdgeImagesGrid + BboxOverlay (sub-plan: `pr/1-5-edge-images-view-migration.md`)
- ✅ **PR-1.2** 단위 test 16 시나리오 (sub-plan: `pr/1-2-image-grid-tests.md`)

→ Phase 1 진행 중 ui API 자연 보완: `index` 시그니처, `onDragStart`, `onContextMenu`, `onCellMouseEnter/Leave`, `highlightedId` (D-015 — Phase 1 안 PR-1.1 보완).

#### Phase 2 — 작은 audit 거리 ✅ **완료 (2026-05-09)**

상세: [plan/components-audit-findings.md](./plan/components-audit-findings.md)

9 PR 모두 완료. 진행 중 audit 결과로 옵션 변경된 PR 다수 (D-013 일관 적용).

| PR | 결과 |
|---|---|
| ✅ **A3** | MenuPopover styled → forwardRef + anchor prop. platform 2 wrap 정리 |
| ✅ **A4** | TextField + PasswordField size variant ('sm'/'md'/'lg'). 4 wrap 의 padding/font 제거 |
| ✅ **A5** | CheckboxGroup 신규 (87줄) + 양 AddDatasetModal class selection 흡수 (-50줄) |
| ✅ **A6** | RadioCardGroup 신규 (옵션 C 채택 — vertical option group). 양 TaskTypeButtons (-44줄) |
| ✅ **B1** | SetupPanel/CameraParamsTab 마이그 (옵션 A 채택, D-013 일관). 7 styled 제거 + 30+ 곳 |
| ✅ **B2** | StepIndicator 신규 + edge DiagStep* 4 styled 흡수 |
| ✅ **B3** | images-table → ui Table (단순 마이그). 줄수 112 → 89 |
| ✅ **B4** | FilterPopover + FilterPopoverSection 신규 (옵션 B 채택). edge + platform 합 ~80줄 흡수 |
| ✅ **C1** | SelectableListItem 신규 (옵션 A 채택). DatasetRow + ClassItem 통합 (-46줄) |

**효과** (Phase 0 + Phase 2 합계): components/ 약 -300줄, ui 추가 ~370줄 (재사용 가능).

#### Phase 3.5 — 후속 작업 묶음 ⏳ **planning (2026-05-10)**

상세: [plan/post-phase3-followups.md](./plan/post-phase3-followups.md)

Phase 0~3 완료 후 발견된 단기/중기 거리 8 PR. Phase 4 (장기 expansion) 진입 전 정리.

| PR | 거리 |
|---|---|
| **PR-D1** ⭐ | bbox/annotation overlay zoom 처리 기본화 (ImageViewer ↔ DrawingLayer Context 자동 연결). 사용자 명시 요청 |
| PR-D2 | 시각 검증 (dev server) 후 발견 issue fix |
| PR-D3 | Phase 2 신규 컴포넌트 단위 test 보강 (7 컴포넌트) |
| PR-D4 | Storybook a11y `'todo'` → `'error'` 전환 |
| PR-D5 | edge `tests/upload-error.test.ts` ENOTEMPTY fix |
| PR-D6 | edge `@tanstack/react-virtual` dep 제거 (ui bundled) |
| PR-D7 | edge ui sync 자동화 (watch + cp 또는 workspace) |
| PR-D8 | platform + edge `wip:` commit 정리 (사용자 명시 합의 후) |

→ PR-D1 최우선. 각 PR 은 D-012 따라 시작 전 별도 sub-plan + 사용자 합의.

### 4.4 장기 / 미정

#### Phase 3 — Storybook 보강 ✅ **완료 (2026-05-10)**

[storybook-coverage.md](./plan/storybook-coverage.md). 모든 ui 변경이 안정된 후 일괄 작성.

5 group, 총 33 stories:

**Group A — Phase 0~2 신규 컴포넌트** (7 stories)
- InfoRow, CheckboxGroup, RadioCardGroup, StepIndicator, SelectableListItem, FilterPopover, VirtualizedImageGrid

**Group B — 기존 누락 핵심** (8 stories)
- useConfirm + ConfirmProvider, useClickOutside, Foundation tokens gallery, IconButton, Popovers (PopoverCard/Menu/MenuPopover/HoverCard), DropdownSelect, Pagination, Breadcrumbs

**Group C — Secondary** (4 stories)
- Skeleton, Badge + Chip, StatusPill, ChipGroup

**Group D — Chart** (Card 류는 기존 charts.stories 에 있음, ChartContainer + ChartLegend 2 stories 추가)

**Group E — 잔여** (12 stories)
- CopyButton, FilterBarLayout, FormGroup + FieldRow, ModeSwitcher, AssignmentRow, ColorSwatch, KeyboardShortcutHint, PreviewCard, ProgressBlock, ResizablePanel, StatCard, TagListSearch

**왜 마지막에 했나?** Phase 1+2 진행 중 ui 컴포넌트 변경 큼. 안정된 후 일괄로 재작성 비용 회피 (D-008).

#### Phase 4 — 디자인 system expansion (장기)

- light mode 도입 (token swap)
- 새 spacing/radius/shadow 단계 (실 사용처 발견 시)
- semantic color 추가 (`--ig-color-warning-soft` 등)
- ui 컴포넌트 신규 추가 (소비자 needs 발견 시)

---

## 5. Phase 별 roadmap

```
[완료]
├─ rgba/hex 토큰화
├─ DialogShell 마이그레이션 (platform 9 + edge 3)
├─ Toast 통합
├─ useConfirm + useClickOutside hook
├─ AccountMenu 통합 (edge)
├─ LoadingState/EmptyState 마이그레이션
├─ Phase 4 styles split (platform 5 파일)
└─ governance + plan 5 문서 (master/governance/image-grid/storybook/roadmap)

Phase 0 — Warm-up ✅ 완료 (2026-05-09)
   ├ PR-0.1: edge form 마이그 (8 파일) ✅
   └ PR-0.2: InfoRow ui 신설 + 양 repo 마이그 ✅

Phase 1 — ImageGrid 통합 ✅ 완료 (2026-05-09)
   ├ PR-1.1: ui ImageGrid 신규 + VirtualizedImageGrid ✅
   ├ PR-1.3: classes ClassImagesPanel 마이그 ✅
   ├ PR-1.4: catalog virtualized-image-grid 마이그 ✅
   ├ PR-1.5: edge ImagesView grid 마이그 ✅
   └ PR-1.2: 단위 test 16 시나리오 ✅

Phase 2 — 작은 audit 거리 ✅ 완료 (2026-05-09)
   ├ PR-A3: MenuPopover anchor ✅
   ├ PR-A4: TextField size ✅
   ├ PR-A5: CheckboxGroup ✅
   ├ PR-A6: RadioCardGroup ✅
   ├ PR-B1: SetupPanel 정렬 ✅
   ├ PR-B2: StepIndicator ✅
   ├ PR-B3: images-table → ui Table ✅
   ├ PR-B4: FilterPopover ✅
   └ PR-C1: SelectableListItem ✅

Phase 3 — Storybook 보강 ✅ 완료 (2026-05-10)
   ├ Group A (Phase 0~2 신규 컴포넌트) ─ 7 stories
   ├ Group B (기존 누락 핵심) ─ 8 stories
   ├ Group C (Secondary) ─ 4 stories
   ├ Group D (Chart) ─ 2 추가 (ChartContainer/Legend)
   └ Group E (잔여) ─ 12 stories
                                                  ─ 합계 33 stories

[다음]
Phase 3.5 — 후속 작업 묶음 ⏳ planning (2026-05-10)
   ├ PR-D1 ⭐ bbox zoom 처리 기본화 (ImageViewer ↔ DrawingLayer Context)
   ├ PR-D2  시각 검증 후 fix
   ├ PR-D3  Phase 2 신규 컴포넌트 단위 test
   ├ PR-D4  Storybook a11y enforce
   ├ PR-D5  edge test ENOTEMPTY fix
   ├ PR-D6  edge react-virtual dep 제거
   ├ PR-D7  edge ui sync 자동화
   └ PR-D8  wip commit 정리

Phase 4 — 디자인 시스템 expansion (장기)
```

**Phase 순서 근거**:
- **Phase 0 (warm-up) 시작** — 독립 quick win. 즉시 components 감소 + 추출 패턴 확립으로 이후 작업 신뢰 형성
- **Phase 1 (ImageGrid)** — 가장 큰 거리, components/ 최소화 효과 가장 큼. 사용자 stated #1 목표
- **Phase 2 (잔여)** — Phase 1 의 render slot 패턴 + Phase 0 의 추출 패턴 재사용
- **Phase 3 (Storybook) 마지막** — Phase 0~2 에서 ui 컴포넌트 변경 가능성, 안정된 후 일괄

각 Phase 완료 후 다음 Phase 진행 의사결정. PR 단위 작게 (1 PR ≤ 200줄 diff 권장).

---

## 6. 의사결정 record

ID 순 (D-001 부터). 새 결정은 마지막에 append. 모든 record 는 결정 + 근거 + 영향 포함.

### 2026-05-09

**[D-001]** rgba/hex token 추가 안 함 — 기존 ui token 으로 매핑, 약간의 색/크기 차이 허용
- 근거: token 늘리면 관리 부담. simple 원칙 (사용자 명시)
- 영향: codemod 으로 ~454 raw 색상 → CSS var 일괄 마이그레이션

**[D-002]** brand blue 통일 — `74,158,255` → `77,136,255`
- 근거: 두 가지 brand blue 혼재 → ui 표준으로 통일
- 영향: codemod 일괄 적용, 시각 차이 미미

**[D-003]** AccountMenu cross-app 추출 안 함
- 근거: TopBar 의 prefillCredentials vs DatasetSelect 의 단순 logout — 도메인 차이
- 결과: edge 안 통합만 (228줄 → 130줄)

**[D-004]** image-detail-modal / ImagesView bbox modal / LogPanel image lightbox — page-specific 유지
- 근거: 95vw/absolute layout, custom 3-section header, single-img lightbox 등 도메인 특수
- 결과: DialogShell 마이그레이션 안 함

**[D-005]** `useClickOutside` 의 `use-gallery-toolbar-ui` 마이그레이션 skip
- 근거: `data-*-dropdown` selector 가 cross-component (portal 렌더), ref refactor 비용 큼
- 결과: 해당 hook 만 기존 useEffect 유지

**[D-006]** LogDetailTable → ui Table 마이그레이션 안 함
- 근거: ui Table 은 columns + rows + drag/drop (data table), LogDetailTable 은 key-value (definition list) — 의미 다름
- 결과: page-specific styled `<table>` 유지

**[D-007]** ui 추가 기준 (확정) — **components 최소화 우선**
- 핵심: 도메인 무관 + 외부 store 무관 + 재사용 가능성 (현재 1 프로젝트라도 OK)
- 보조: props ≤ 5 (권장), 파일 ≤ 200줄 (필수, 넘으면 split)
- 근거: 사용자 명시 — "1 project 이여도 앞으로 다른 프로젝트에서 재활용 될 가능성이 있는 거면 ui 에 넣고 싶어. components 내용 최소화가 목표"
- 영향: 향후 audit 시 단일 사용 컴포넌트도 적극적으로 ui 추출 검토

**[D-008]** Phase 진행 순서 (확정) — **ImageGrid → 작은 거리 → Storybook (마지막) → expansion**
- Storybook 을 마지막에 두는 이유: Phase 1+2 진행 중 ui 컴포넌트 변경 가능성 큼. 먼저 작성 시 재작성 비용. 안정된 시점에 일괄.
- 근거: 사용자 명시 — "storybook 은 가장 마지막에 하는게 좋지 않을까?"

**[D-009]** edge custom Button 25+ 변형 — 거부 명단 추가 확정
- § 2.5 거부 명단에 추가됨 — page-specific (IconBtn / list-item / window control / form picker)
- 향후 디자인 시스템 expansion (Phase 4) 시 재검토 거리

**[D-010]** components/ audit 결과 — Phase 2 의 11 PR 거리 발견
- 상세: [plan/components-audit-findings.md](./plan/components-audit-findings.md)
- 핵심 발견:
  - InfoRow / DiagRow 패턴 (양 repo 공통, 추출 명확)
  - ui MenuPopover `anchor` prop / TextField `size` prop 추가 거리 (consumer 측 wrap 제거)
  - CheckboxGroup ui 추가 (양 AddDatasetModal class selection)
  - edge SetupSection / DiagStep — D-007 적용 (1 프로젝트라도 재사용 가능 시 ui)
  - edge ConnectionTab.styles 의 local FormGroup/FieldLabel/Section → ui/patterns import 정렬 (quick win)
- 효과 추정: components/ ~250+ 줄 감소

**[D-011]** Phase 진행 순서 세분화 — Phase 0 (warm-up) 신설
- 결정: 11 PR 중 A1 (edge form import 정렬) + A2 (InfoRow 추출) 을 Phase 0 으로 선행
- 근거:
  - 둘 다 독립 거리 (ImageGrid 와 의존성 X)
  - 합산 2-3시간으로 짧음 — 즉시 momentum + 추출 패턴 확립
  - Phase 1 (ImageGrid) 의 render slot 패턴 도입 전, 작은 컴포넌트 추출로 흐름 연습
- Phase 2 의 잔여 9 PR 은 Phase 1 완료 후 (Phase 1 의 render slot 패턴 재사용)
- 진행 흐름: Phase 0 → Phase 1 → Phase 2 → Phase 3 → Phase 4

**[D-012]** plan-first + iteration 워크플로우 (확정)
- 결정: 모든 PR (작은 PR 포함) 은 구현 전 plan 문서 작성 → 사용자 합의 → 구현
- 근거: 사용자 명시 — "하나 진행하기 전에 문서를 작성해줘. 기획을 하고 어떻게 할지 꼼꼼히 하는데. 구현 하면서 부족했던 내용은 다음 진행에 반영"
- 핵심 규칙:
  - PR 진행 중 발견한 부족 / 변경 거리는 **다음 PR plan 에 반영** (현재 PR scope 확장 X)
  - plan = 무엇 + 왜 + 어떻게 + 위험 + 검증
  - 누적된 plan 문서가 design system 의 design rationale 역할
- 절차 상세: § 9.1 + § 9.5

**[D-013]** 시각 통일 우선 — 도메인별 시각 의도보다 ui 표준 (PR-0.1 진행 중 합의)
- 결정: 양 repo 의 form/readout 패턴이 시각 차이 (uppercase 라벨, bottom border 헤더 등 도메인 분위기) 가 있어도 ui 표준 (no uppercase, weight 600, panel 분위기) 으로 통일
- 근거: 사용자 명시 — "시각 통일이 중요한 것 같아. 세밀한 건 다 수정하고 조절 해보자"
- 영향:
  - PR-0.1: edge ConnectionTab settings 의 uppercase 라벨 + 하단 border 헤더 시각 의도 버림 → ui FormSection (Panel) 으로 통일
  - PR-0.2: edge NicStatusCard 의 table-row 분위기 (uppercase 110px label + 행간 border) 버림 → ui InfoRow (단순 inline row) 로 통일
  - 향후 audit 시 시각 차이 발견되어도 동일 원칙 적용 — 별도 결정 없으면 ui 표준
- 시각 검증 시점: 모든 마이그 완료 후 사용자가 일괄 검증 (각 PR 마다 검증 X)

**[D-014]** edge 의 ui 의존 방식 — github tarball install (개발 시 lib sync 필요)
- 현황: edge `package.json` 의 `@ingradient/ui: file:ingradient-ui-X.X.X.tgz` (github release tarball). platform 은 symlink (`file:../ingradient-ui`).
- 영향: ui 신규 변경이 edge 에 자동 반영 X. typecheck / dev 위해 `cp -r ingradient-ui/lib/* edge/node_modules/@ingradient/ui/lib/` 임시 sync 또는 `npm pack` 후 install.
- 근거: edge 는 production tarball 배포 (GitHub Release). 개발 흐름과 다름.
- 후속: 향후 monorepo 또는 workspace 전환 검토 거리 (Phase 4 expansion)

**[D-016]** bbox/annotation overlay zoom 처리 — ingradient-ui 의 기본 동작으로 (2026-05-10)
- 결정: ImageViewer 가 React Context (`ImageViewerContext`) 로 `{ zoom, containerWidth, containerHeight }` 공급. DrawingLayer 는 Context 있으면 자동 read, 없으면 prop 사용 — caller 가 zoom + container size 보일러 없이도 stroke/label 일정 크기 자동 유지
- 근거:
  - 사용자 명시 — "bbox 그리고서 확대할 때 bbox선의 두꺼워 지지 않게 하고, class도 커지지 않도록 ingradient edge랑 platform에서도 어떻게 처리 했었거든. 이 처리가 기본이 되게 해줘"
  - 현재: ui DrawingLayer 는 처리 *지원* (vector-effect non-scaling-stroke + strokeWidth/zoom + label transform scale) 하지만 caller 가 prop 명시 전달해야 동작. ImageViewer 와 결합 시 자동 X
  - edge BBoxCanvas 는 prop drilling 으로 잘 동작 — ingradient-ui 만 누락
- 옵션 비교: A (Context 자동) / B (cloneElement) / C (새 통합 컴포넌트). 옵션 A 채택 — components 최소화 + props ≤ 5 + backward compat
- 영향: ui image-viewer +30 줄, drawing-layer +5 줄. edge/platform 변경 없음. 향후 ImageViewer 사용처 (platform / 새 프로젝트) 가 zoom + bbox overlay 결합 시 보일러 0
- 상세: [post-phase3-followups.md § 1](./plan/post-phase3-followups.md#1-pr-d1--bboxannotation-overlay-zoom-처리-기본화-최우선)

**[D-015]** Phase 1 PR 순서 변경 — test 를 마지막으로 (D-008 정신 일관)
- 결정: PR-1.1 → **PR-1.3 (classes) → PR-1.4 (catalog) → PR-1.5 (edge) → PR-1.2 (test)**
- 근거:
  - 실제 사용처 마이그가 ImageGrid API 의 적합성 검증 — test 가 cover 못 하는 실 사용 신호
  - PR-1.3 (가장 단순) 진행 시 부족 발견하면 PR-1.4/1.5 전에 fix 가능
  - test 마지막 = 실 사용 패턴 본 후 시나리오 더 정확 (D-008 의 "안정 후 일괄" storybook 정신과 일관)
- 영향: PR-1.3 진행 중 PR-1.1 의 API 누락 발견 시 본 PR 안에서 작은 보완 OK (같은 Phase + 같은 컴포넌트)

---

## 7. 측정 지표

| 지표 | 시작 (작업 전) | 현재 | 목표 (Phase 2 완료 시) |
|---|---|---|---|
| platform raw rgba | 268 | 157 | < 100 |
| platform hex 색상 | 499 | 291 | < 200 |
| edge raw rgba | 281 | 174 | < 120 |
| edge hex 색상 | 40 | 12 | < 10 |
| platform 200줄 위반 styles | 5 | **0** ✅ | 0 |
| platform image grid 줄수 (catalog + classes) | 753 | **288** ✅ (catalog 141 + classes 147) | ~180 (목표 거의 달성) |
| edge ImagesView 줄수 | 1442 | **1270** ✅ (-172) | ~1300 (초과 달성) |
| ui ImageGrid 줄수 | 110 | 111 (대체) + 124 virtualized + 124 cell + 13 selection = 372 | ~180 (단일 파일 기준 — split 으로 각 파일 200 미만) |
| ui storybook coverage | ~50% | **~95%** ✅ (33 stories 신규 추가, Phase 3 완료) | 100% |
| edge custom Toast 코드 | 140 | **0** ✅ | 0 |
| edge AccountMenu 중복 | 228 | **130** ✅ | 130 |
| platform `styled(MenuPopover)` wrap | 5-7 | **2** ✅ (positioning props 만 제거, 시각 wrap 유지 — PR-A3) | 0-2 |
| platform `styled(TextField)` wrap | 5+ | **0** ✅ padding/font 제거 (PR-A4) | 0 |
| edge local form re-export (Section/FormGroup 등) | 4 | **0** ✅ | 0 (PR-0.1 완료) |
| InfoRow / DiagRow 중복 styled | 6 | **0** ✅ | 0 (PR-0.2 완료) |
| 양 AddDatasetModal class selection inline | 50줄 | **0** ✅ (PR-A5 → CheckboxGroup) | 0 |
| 양 TaskTypeBtn styled | 44줄 | **0** ✅ (PR-A6 → RadioCardGroup) | 0 |
| edge SetupPanel styled (Section/SectionTitle/Field/Input/InlineHint/Buttons) | 7 | **0** ✅ (PR-B1) | 0 |
| edge DiagStep* styled | 4 | **0** ✅ (PR-B2 → StepIndicator) | 0 |
| platform images-table raw `<table>` | 1 | **0** ✅ (PR-B3 → ui Table) | 0 |
| edge + platform popover filter styled | 6 | **0** ✅ (PR-B4 → FilterPopover) | 0 |
| platform DatasetRow + edge ClassItem styled | 2 | **0** ✅ (PR-C1 → SelectableListItem) | 0 |

✅ = 이미 목표 달성

---

## 8. 참조 문서

### 메타

- **본 master plan** (`docs/MASTER-PLAN.md`) — 모든 작업의 entry point
- **governance** (`docs/governance.md`) — 원칙 + 결정 트리

### Phase 별 plan

- **Phase 1**: `docs/plan/image-grid-unification.md`
- **Phase 2**: `docs/plan/components-audit-findings.md` (작은 거리 11 PR)
- **Phase 3**: `docs/plan/storybook-coverage.md` (마지막)
- **Phase 3.5**: `docs/plan/post-phase3-followups.md` (후속 8 PR — bbox zoom 기본화 외) ⏳
- **전체 roadmap**: `docs/plan/cross-app-roadmap.md`

### PR sub-plan (Phase 0 + Phase 1 완료)

- `docs/plan/pr/0-1-edge-form-import-align.md` — PR-0.1 (옵션 A 채택)
- `docs/plan/pr/0-2-info-row-extraction.md` — PR-0.2 (옵션 A 채택)
- `docs/plan/pr/1-1-image-grid-rewrite.md` — PR-1.1 (대체 + split + bundled dep)
- `docs/plan/pr/1-3-platform-classes-migration.md` — PR-1.3 (D1 API 자연 확장)
- `docs/plan/pr/1-4-platform-catalog-migration.md` — PR-1.4 (stack 시각 버림 + hover preview slot)
- `docs/plan/pr/1-5-edge-images-view-migration.md` — PR-1.5 (server meta + EdgeImagesGrid)
- `docs/plan/pr/1-2-image-grid-tests.md` — PR-1.2 (test 16 시나리오)

### PR sub-plan (Phase 2 완료)

- `docs/plan/pr/2-A3-menu-popover-anchor.md` — PR-A3
- `docs/plan/pr/2-A4-text-field-size.md` — PR-A4
- `docs/plan/pr/2-A5-checkbox-group.md` — PR-A5
- `docs/plan/pr/2-A6-task-type-mode-switcher.md` — PR-A6 (옵션 C 채택)
- `docs/plan/pr/2-B1-edge-setup-section-audit.md` — PR-B1 (옵션 A 채택)
- `docs/plan/pr/2-B4-filter-popover.md` — PR-B4 (옵션 B 채택)
- (PR-B2, B3, C1 은 단순 마이그 — 별도 sub-plan 없음)

### 완료된 작업의 plan (참고)

- `docs/plan/toast-enhancement.md` — Toast 확장 (완료)
- `docs/plan/click-outside-hook.md` — useClickOutside hook (완료)
- `docs/plan/color-token-migration.md` — color codemod (완료)
- `docs/plan/component-extraction.md` — 초기 추출 plan (참고)

### 소비자 측 plan

- `ingradient-platform/docs/plans/frontend_styles_phase3.md` — DialogShell 마이그레이션 (완료)
- `ingradient-edge/docs/plan/frontend_styles_phase3.md` — 동일
- `ingradient-edge/docs/plan/toast-migration.md` — edge Toast 통합 (완료)

### 그 외 ui plan (이전)

- `docs/plan/storybook-adoption-plan.md`
- `docs/plan/storybook-migration-tracker.md`
- `docs/plan/code-quality-plan.md`
- `docs/plan/cross-app-sync-2026-05.md`
- `docs/plan/phase-a-cleanup.md` ~ `phase-d-legacy-cleanup.md`

---

## 9. 작업 진행 절차

### 9.1 새 PR 시작 시 (plan-first 원칙)

**원칙**: 모든 PR 은 구현 전 plan 문서 작성. 작은 PR (15분짜리 import 정렬) 도 예외 없음.

**절차**:

1. **plan 문서 작성** — `docs/plan/pr/<phase>-<id>-<name>.md` 또는 기존 phase plan 의 sub-section
   - 무엇을 (목표 + 범위)
   - 왜 (governance 어느 기준 만족, 어느 사용자 needs)
   - 어떻게 (구체 구현 step, before/after)
   - 위험 / trade-off (실패 케이스, 의도적 skip 거리)
   - 검증 방법 (typecheck + 시각 회귀 + 측정 지표)
2. **사용자 review + 합의** — plan 부족하면 보강. 합의 전 구현 시작 X
3. **TodoWrite** — plan 의 step 을 todo 로 분해
4. **구현** — plan 따라 진행. 각 step typecheck
5. **PR 중 발견한 부족 / 추가 거리는 plan 에 반영하지 말고 다음 PR 으로 미룸** — 진행 중 PR scope 확장 금지
6. **검증** — typecheck + (해당 시) `npm run dev` 시각 확인
7. **decision record 갱신** — 본 문서 § 6 에 신규 결정 추가
8. **측정 지표 갱신** — 본 문서 § 7 의 "현재" 컬럼 갱신
9. **다음 PR plan 작성** — 이번 PR 에서 발견한 부족 / 변경 거리 반영

### 9.2 새 컴포넌트 추가 합의 절차

1. 사용처 audit (governance § 2.1 의 ui 추가 기준 5가지)
2. 도메인 무관 shape 검증
3. props 5개 이하 설계
4. plan 문서 작성 (`docs/plan/<name>.md`)
5. 사용자/디자이너 합의
6. 구현 (storybook 은 Phase 3 에서 일괄 — D-008)
7. 소비자 마이그레이션 (PR 단위)

### 9.3 소비자에서 발견된 distinct 패턴 처리

```
같은 패턴이 platform + edge 둘 다 있음을 발견
또는 1 프로젝트라도 재사용 가능성 있음을 발견
   ↓
governance 점검 (도메인 무관 + 외부 store 무관)
   ↓
plan 작성 → 사용자 합의 → ui PR → 소비자 마이그레이션
```

### 9.4 master plan 의 lifecycle

본 문서는 living document. 다음 시점에 갱신:
- 새 작업 완료 → § 4.1 + § 7 갱신
- 새 결정 → § 6 record 추가
- 새 plan 작성 → § 8 link 추가
- Phase 변경 → § 5 roadmap 갱신
- 거부 명단 추가 → § 2.5 갱신

문서 갱신은 매 주요 PR 마지막 step.

### 9.5 plan iteration loop

각 PR plan 은 그 자체로 design rationale 의 한 조각. PR 진행 → 다음 PR plan 작성 시 학습 반영:

```
PR plan 작성 (구현 전)
   ↓
사용자 review + 합의
   ↓
구현 (scope 고정, 변경 X)
   ↓
검증 + 회귀
   ↓
회고: 무엇이 부족했는지 / 예상과 다른 trade-off / 다음에 미리 고려할 것
   ↓
다음 PR plan 작성 시 반영 — 이전 PR 의 학습이 다음 plan 의 quality 향상
   ↓
(반복)
```

이 loop 가 누적되며 plan 문서 series 가 design system 의 design rationale 가 됨. 향후 새 기여자/프로젝트 가 plan 만 읽고 "왜 이렇게 결정했나" 를 이해 가능.

#### plan 문서 위치 권장

- 작은 PR (1 PR 단위): 기존 phase plan 의 sub-section 추가 (e.g. `components-audit-findings.md` 의 § PR-0.1)
- 큰 PR (여러 sub-PR 묶음): 별도 파일 `docs/plan/<topic>.md`
- 매우 작은 PR (cleanup, import 정렬): 1-2 단락이면 충분, 기존 plan 안에서

---

## 부록 A — repo 위치

- `@ingradient/ui`: `/home/june/workspace/projects/ingradient-ui/`
- `ingradient-platform`: `/home/june/workspace/projects/ingradient-platform/`
- `ingradient-edge`: `/home/june/workspace/projects/ingradient-edge/`

## 부록 B — 일반 명령어

```bash
# ui 빌드 + tarball pack
cd /home/june/workspace/projects/ingradient-ui
npm run build:package && npm pack

# tarball edge 에 install
cp ingradient-ui-0.0.1.tgz /home/june/workspace/projects/ingradient-edge/
cd /home/june/workspace/projects/ingradient-edge
npm install ingradient-ui-0.0.1.tgz --prefer-offline --no-audit

# platform 은 file:dir symlink — install 자동
cd /home/june/workspace/projects/ingradient-platform/frontend
npm install file:../../ingradient-ui

# typecheck (각 repo)
npx tsc --noEmit

# dev
cd ingradient-platform/frontend && npm run dev   # vite (web)
cd ingradient-edge && npm run dev                # electron + backend
```
