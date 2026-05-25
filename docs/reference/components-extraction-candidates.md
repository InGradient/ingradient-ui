# patterns → components 추출 후보 (인라인 최소 단위)

작성일: 2026-05-25
재검증일: 2026-05-25 (Explore 에이전트 3 개 병렬 검증)
결정 확정일: 2026-05-25
방향 전환일: 2026-05-25 — **인라인 zero 목표** 채택
전수 재검증일: 2026-05-25 — patterns 499 개 styled 정의 카테고리별 스캔 (gap-check)

## 목적
`src/patterns/*` 내부의 **인라인 styled-component / sub-component 를 가능한 모두 제거**한다. 패턴 파일 통째 이동이 아니라, 패턴 안에 흩어진 인라인 부품들을:
1. primitives 로 흡수 (레이아웃)
2. 기존 components 로 흡수 (시각 근접)
3. 신규 컴포넌트로 추출 (매칭 자산 없음)
4. 도메인 wrapper 는 내부 refactor

시각 변경이 발생하는 항목은 **마이그레이션 후 일괄 디자인 정리**한다 (지금 단계에서 시각 일치 신경 안 씀).

---

## 전수 검증 결과 (499 styled 정의)

카테고리별 분포:
- `styled.div` 236 / `styled.span` 78 / `styled.button` 27 / `styled.p` 26
- `styled.h*` 21 / `styled.section` 8 / `styled.label` 10 / `styled.aside` 12
- `styled.ul/li` 12 / `styled.table/td/th` 16 / `styled.img` 7
- `styled.textarea` 3 / `styled.input` 2 / `styled.svg` 2 / `styled.a` 2
- 나머지 (header/nav/main/hr/strong) 8

**핵심 발견 — Text primitive 확장 필수**: 현재 `Text` 는 `tone/size/weight` 만 지원. 마이그레이션 위해 다음 props 추가 필요:
- `align?: 'left' | 'center' | 'right'` — 35+ 곳에서 textAlign 사용
- `uppercase?: boolean` + `letterSpacing?: string` — 8+ 곳 (StatLabel, FilterLabel, SectionHeader 등)
- `fontFamily?: 'mono'` — 2-3 곳 (join code, hex 값)
- `tabularNums?: boolean` — 5+ 곳 (counter, count, numeric 정렬)

이 확장 없으면 zero-inline 목표 달성 불가. **Phase 0 으로 우선 처리**.

## 매칭 우선순위

### 1순위: 레이아웃 글루 → primitives 사용
이미 `src/primitives/layout/` 에 다음이 존재:
- `Stack` — flex column + gap
- `Inline` — flex row + gap (wrap)
- `Grid` — grid + auto-fit
- `Box` — 기본 styled div
- `Container` — max-width wrapper

| 인라인 패턴 | 교체 |
|---|---|
| `styled.div` flex column | `<Stack gap={...}>` |
| `styled.div` flex row | `<Inline gap={...}>` |
| `styled.div` grid | `<Grid>` |
| 단순 padding/bg/border 박스 | `<Box ...>` |

→ 패턴 파일들의 `Wrap`/`Body`/`Header`/`Row`/`Toolbar`/`Panel`/`Section`/`RowGrid` 등 대부분 흡수.

### 2순위: 기존 components 흡수 (시각 근접 허용)
시각이 정확히 일치하지 않아도 가까운 기존 컴포넌트로 흡수. 마이그레이션 완료 후 디자인 정리 단계에서 한꺼번에 시각 일치 작업.

### 3순위: 신규 컴포넌트 추출
2 순위로 흡수 불가능한 것만 신규 추출. **목표: 가능한 적게**.

### 4순위: 도메인 wrapper 는 내부 refactor
도메인 결합 wrapper (device-status-badge, project-type-tag) 는 wrapper 자체는 유지하되, 내부 styled span 을 generic Badge/Tag 사용으로 교체.

---

## A. 기존 components/primitives 로 직접 교체

### A1. ✅ IconButton 교체 (8 곳)
| 위치 | 인라인 이름 |
|---|---|
| `shells/mobile-nav-shell.tsx:25` | `HamburgerBtn` |
| `shells/mobile-nav-shell.tsx:110` | `CloseBtn` |
| `shells/class-lightbox.tsx:52` | `CloseBtn` |
| `shells/bbox-navigation.tsx:11` | `ArrowBtn` |
| `shells/expand-sidebar-btn.tsx:4` | `Btn` |
| `shells/dataset-list-panel.tsx:57` | `CollapseBtn` |
| `shells/class-pool-list.tsx:50` | `RemoveBtn` (`tone="danger"` 사용) |
| `shells/member-pool-list.tsx:47` | `RemoveBtn` |
| `shells/gallery-image-card.tsx:49` | `OptionButton` (18x18 icon-only) |

`IconButton` 의 `tone: 'default' | 'danger'` 이미 존재 — 추가 작업 없음.

### A2. ✅ ColorSwatch 교체 (3 곳)
| 위치 | 인라인 이름 | 교체 |
|---|---|---|
| `shells/class-pool-list.tsx:27` | `ColorDot` (10px) | `<ColorSwatch size="xs" $shape="circle">` |
| `shells/add-dataset-modal.tsx:33` | `ColorDot` (10px) | 동일 |
| `shells/labeling-progress-bar.tsx:39` | `Dot` (8px) | 동일 |

### A3. ✅ Badge / Tag / Chip 교체 (4 곳, 시각 근접 허용)
| 위치 | 인라인 이름 | 교체 | 시각 영향 |
|---|---|---|---|
| `shells/mobile-nav-shell.tsx:169` | `Badge` | `<Badge $tone="danger">` | 거의 동일 |
| `shells/source-breakdown-widget.tsx:38` | `Chip` | `<Tag $bg="surface-raised" $color="text-muted">` | 시각 통일 (radius/font 변경) |
| `shells/chip-group.tsx:11` | `MoreChip` ("+N more") | `<Badge $tone="neutral">+{n} more</Badge>` | bg 톤 변경 |
| `shells/canvas-overlays.tsx:112` | `HiResPill` | `<Badge>` + `<Spinner>` 합성 또는 Badge `$tone="overlay"` 추가 | canvas-overlay bg → badge bg |

### A4. ✅ Checkbox 교체 (1 곳)
`shells/dashboard-customize-popover.tsx:38` 인라인 native checkbox → 기존 `components/inputs/toggles.tsx` Checkbox.

### A5. ✅ Empty / Placeholder → Text (8 곳)
모두 `<Text tone="muted" align="center">` 로 교체:
- `shells/invitations-tab.tsx:17` `Empty`
- `shells/org-members-tab.tsx:20` `Empty`
- `shells/join-codes-section.tsx:34` `Empty`
- `shells/invitations-section.tsx:57` `Empty`
- `shells/comments-panel.tsx:51` `Empty`
- `shells/class-list-sidebar.tsx:33` `Placeholder`
- `shells/project-member-invite.tsx:35` `Placeholder`
- `shells/devices-license-section.tsx:72` `Placeholder`

### A6. ✅ Muted span → Text (3 곳)
- `shells/join-codes-section.tsx:41` `Muted`
- `shells/org-members-tab.tsx:27` `Muted`
- `shells/invitations-section.tsx:64` `Muted`

→ 모두 `<Text tone="muted">`.

### A7. ✅ Status text → Text (3 곳)
| 위치 | 인라인 이름 | 교체 |
|---|---|---|
| `shells/reference-image-section.tsx:44` | `Status` | `<Text size="12px" tone="accent">` |
| `shells/invitations-section.tsx:68` | `StatusText` | 조건 톤 helper + `<Text tone={...}>` |
| `shells/igp-export-modal.tsx:28` | `StatusLine` | `<Inline gap>` + `<Text>` |

### A8. ✅ Link → `<a>` + Text 또는 TextButton with `as="a"` (1 곳)
- `shells/igp-export-modal.tsx:36` `Link` → TextButton 추출 후 `as="a"` 사용 또는 즉시 `<Text as="a" tone="accent">`

### A9. ✅ 레이아웃 글루 → primitives (광범위, ~50+ 곳)
모든 패턴 파일에서 다음 패턴 발견 시 primitives 로 교체:
- `Wrap`, `Body`, `Container` styled div → `<Stack>` / `<Box>`
- `Row`, `Inline` styled div → `<Inline>`
- `Header`, `Footer`, `Toolbar`, `Panel`, `Section` styled div → `<Stack>` / `<Inline>` / `<Box>`
- `Grid`, `RowGrid` styled div → `<Grid>`

각 패턴 파일별로 1:1 교체. 패턴 파일 자체 크기 감소.

---

## B. 신규 컴포넌트 추출

### B1. ★ TextButton (5 곳)
경로: `components/inputs/text-button.tsx`
props: `tone: 'accent' | 'muted'`, `size`, leading/trailing icon slot, `as` (link 호환)

| 위치 | 인라인 이름 |
|---|---|
| `shells/checkbox-group.tsx:22` | `HeaderBtn` |
| `shells/gallery-toolbar.tsx:60` | `SelectAllLink` |
| `shells/gallery-filter-panel.tsx:31` | `ResetBtn` |
| `shells/image-detail-info-panel.tsx:21` | `DetailsToggle` |
| (A8 igp-export-modal `Link` 도 흡수 가능) | |

### B2. ★ MenuItem (4 곳)
경로: `components/overlays/menu-item.tsx`
props: `tone: 'default' | 'danger'`, `size: 'sm' | 'md'`, `active?: boolean`, `disabled?: boolean`, leading icon slot

| 위치 | 인라인 이름 |
|---|---|
| `shells/image-context-menu.tsx:19` | `Item` |
| `shells/dataset-menu.tsx:24` | `Item` |
| `shells/sort-popover-trigger.tsx:14` | `Option` |
| `shells/dataset-selector-mobile.tsx:53` | `Option` |

기존 `ContextMenuButton` 은 그대로 유지 (block 형식 단순 메뉴 호환용).

### B3. ★ DragHandle (1 곳, rename 승격)
`patterns/shells/widget-drag-handle.tsx` → `components/inputs/drag-handle.tsx`
위젯 결합 코드 0. 이름에서 `widget-` 제거.

### B4. ★ Textarea (3 곳)
경로: `components/inputs/textarea.tsx`
props: `variant: 'default' | 'monospace'`, size/minHeight, 표준 textarea props

| 위치 | 인라인 이름 |
|---|---|
| `shells/devices-forms.tsx:52` | `TokenText` (monospace, 72px) |
| `shells/comments-panel.tsx:63` | `Textarea` (default, 60px) |
| `shells/project-settings-form.tsx:44` | `Textarea` (default, 80px) |

### B5. ★ ColorInput (1 곳)
경로: `components/inputs/color-input.tsx`
`<input type="color">` + webkit overrides wrapping.
- `shells/color-input-row.tsx:10` `NativeColor`

(1 곳만이지만 native input 은 generic 으로 추출하는 게 깨끗 — primitives 로 흡수 불가)

### B6. ⚠️ CollapsibleSectionHeader (2 곳, 후순위)
경로: `components/data-display/collapsible-section-header.tsx`
uppercase title + chevron + onClick toggle.

| 위치 | 인라인 이름 |
|---|---|
| `shells/image-detail-labelers-list.tsx:12` | `Header` (button) |
| `shells/comments-panel.tsx:16` | `Header` (button) |

코드 100% 중복 (24줄 CSS 일치).

### B7. ⚠️ Badge `$tone="overlay"` variant 확장
HiResPill (canvas-overlays) 흡수용. 시각 변경 받아들이면 생략 가능 — 그 경우 기존 Badge `$tone="neutral"` 사용.

### B11. ★ ResizeHandle (1 곳, fundamental 추출)
경로: `components/inputs/resize-handle.tsx`
- 8px 그랩 핸들 + `::after` pseudo 로 좁은 시각 strip (넓은 hit area 와 분리)
- props: `orientation: 'vertical' | 'horizontal'` (col-resize / row-resize)
- 흡수: `patterns/shells/catalog-shell.tsx:20` `Handle`

### B12. ★ AspectRatioImage (1 곳, fundamental 추출)
경로: `components/data-display/aspect-ratio-image.tsx`
- 고정 aspect-ratio 박스 + gradient fallback bg + 자식 `<img>` object-fit
- props: `ratio?: '1/1' | '16/9' | '4/3'`, `src`, `fallback?: gradient | color`
- 흡수: `patterns/gallery/image-grid-cell.tsx:6` `Media`
- 미래 catalog/dashboard/preview 어디서나 썸네일

### B13. ★ OverlayLayer (1 곳, fundamental 추출)
경로: `components/data-display/overlay-layer.tsx`
- `position: absolute; inset: 0; pointer-events: none` + 자식 `> * { pointer-events: auto }`
- 단순 wrapper. props: `anchor?: 'fill' | 'top-right' | 'top-left' | 'bottom-right' | 'bottom-left'`
- 흡수: `patterns/gallery/image-grid-cell.tsx:24` `OverlayLayer`
- 미래 어디서나 이미지/카드 위 배지 슬롯

### B10. ★ DropZone (1 → 다중 사용 예정)
경로: `components/inputs/drop-zone.tsx`
시각 (active 상태 border/bg) + drop 이벤트 패스스루 + `hasContent` 모드 (콘텐츠 있을 때 슬림 변형).
- `shells/reference-image-drop-zone.tsx:4` `Zone` 흡수
- 기존 `upload-dropzone.tsx` 도 이걸 사용하도록 refactor

### B8. ★ FloatingOverlay (4+ 곳) — 전수 검증에서 발견
경로: `components/overlays/floating-overlay.tsx`
fixed position + 동적 top/left + 공통 surface 스타일 (border/shadow/radius/z-index/bg). positioning 계산은 caller 가 prop 으로 전달.

| 위치 | 인라인 이름 |
|---|---|
| `shells/class-hover-card.tsx:9` | `Card` |
| `shells/hover-preview.tsx:14` | `Floating` |
| `shells/dataset-menu.tsx:11` | `Menu` |
| `shells/image-context-menu.tsx:7` | (inline) |

각각 positioning 로직은 다르지만 표면 스타일은 동일. 공통 스타일만 흡수.

### B9. ⚠️ Text primitive 확장 (B 가 아니라 primitive 작업이지만 명시)
신규 컴포넌트는 아니지만 **마이그레이션 prereq**. 위 "전수 검증 결과" 섹션의 4 가지 props 추가.

---

## C. 도메인 wrapper 내부 refactor

이 두 파일은 wrapper 자체는 유지 (도메인 결합), 단 내부 styled span 을 generic Badge/Tag 사용으로 교체:

### C1. `shells/device-status-badge.tsx` 내부 refactor
- 현재: 6 device 톤 → 자체 styled span + `status-running/failed/warning` 색
- 변경: 6 device 톤 → Badge 톤 매핑 함수 + `<Badge $tone={mapped}>`
- 시각 변경: status-* 토큰 → badge-* 토큰 (마이그레이션 후 정리)

### C2. `shells/project-type-tag.tsx` 내부 refactor
- 현재: 2 project type 톤 → 자체 styled span
- 변경: `<Tag $bg={mapped} $color={mapped}>` 사용

(추후 features/ 폴더 재구조 시점에 두 파일 모두 `features/devices/`, `features/project/` 로 이동.)

---

## D. 인라인 유지 (불가피한 경우만)

전수 검증 결과 zero-inline 거의 달성 가능. 다음만 예외:

### D1. ~~❌ Canvas/annotation 전용 SVG~~ → 흡수 (정정)
`styled.svg` 2 곳 (`annotation-overlay.tsx:45` `Layer`, `class-lightbox.tsx:44` `Overlay`) 모두 단순 absolute + inset:0 + pointer-events:none. **인라인 `<svg style={{}}>` 로 교체** — Phase 1 A9 와 함께 처리.

### D2. ~~❌ dnd-kit 가상화 row~~ → 흡수 가능 (정정)
`patterns/gallery/virtualized-image-grid.tsx` — TanStack Virtual (`@tanstack/react-virtual`) 사용. (이전 doc 에서 dnd-kit 으로 잘못 표기.) `RowWrap` 의 동적 `top` 값은 `<Grid style={{ position: 'absolute', top: virtualRow.start }} ref={virtualizer.measureElement}>` 로 흡수 가능. **primitives Grid 가 ref forwardRef 만 지원하면 전환 가능**. 같은 파일의 `Scroll`/`Inner`/`LoadMoreHint` 도 Box/Text 로 흡수.

→ **인라인 잔존에서 제거**. Phase 1 A9 레이아웃 흡수 작업 시 같이 처리. 단, primitives Grid/Box 의 forwardRef 지원 여부 확인 필요.

### D3. ~~⚠️ Panel resize handle~~ → 신규 컴포넌트 추출 (정정)
`patterns/shells/catalog-shell.tsx:20` `Handle` — fundamental 한 atomic 빌딩블록이라 `components/inputs/resize-handle.tsx` 로 추출. → **B11. ResizeHandle**.

### D4. ⚠️ 특수 Table (2-3 곳)
기존 `components/data-display/table.tsx` 가 columns-render API 고정이라 다음은 불가:
- `shells/dataset-distribution-heatmap.tsx` — heatmap 셀 (`$intensity` prop)
- `shells/storage-stats-table.tsx` — footer row + 인라인 th/td 스타일
- (devices-table 은 호환 가능)

**선택지:**
- **A. Table 확장** — cell-level className/style callbacks 지원 추가
- **B. 도메인 wrapper 로 분리** — `HeatmapTable`, `StatsTable` 같은 features/ 컴포넌트로

→ **B 권장** — heatmap / footer 는 도메인 특이성. 일반 Table 더 복잡하게 만들지 말고 features 영역에서 처리.

### D5. ~~⚠️ 이미지 셀 inset 오버레이~~ → 신규 컴포넌트 2 개 추출 (정정)
`patterns/gallery/image-grid-cell.tsx` 의 `Media` (자식 img selector), `OverlayLayer` (pointer-events 트릭) 둘 다 fundamental 빌딩블록.
- `Media` → **B12. AspectRatioImage**
- `OverlayLayer` → **B13. OverlayLayer**
- `TopRightLayer`/`Footer` 는 일반 layout 흡수 (Inline/Stack)

### D6. ~~⚠️ DropZone 상태 머신~~ → 신규 컴포넌트 추출 (정정)
`shells/reference-image-drop-zone.tsx:4` `Zone` — 기존 `components/inputs/upload-dropzone.tsx` 와 미묘하게 다름 (file 드롭 vs imageId 드롭). **Universal `DropZone` 추출 추천**:

```
components/inputs/
├── drop-zone.tsx           ← 신규: 시각 + active 상태 + drop 이벤트만
└── upload-dropzone.tsx     ← DropZone + file input 합성 (refactor)
```

- `DropZone` (universal): 시각/active/drop 이벤트 패스스루. `onDragEnter/Over/Leave/Drop` 만 노출. 데이터 해석은 caller.
- `UploadDropzone` (refactor): DropZone + HiddenInput file 합성
- `reference-image-drop-zone`: DropZone 사용 + dataTransfer 에서 imageId 파싱

→ **B10. DropZone (신규 추가)**. 미래 다른 도메인 drag-drop (annotation, asset 등) 도 동일 컴포넌트 사용 가능.

---

## 신규 컴포넌트 최종 리스트

| 항목 | 사용처 | 우선순위 |
|---|---|---|
| ⚙️ **Text primitive 확장** (align/uppercase/letterSpacing/fontFamily/tabular) | 80+ 곳 prereq | 🟢 Phase 0 |
| **DragHandle** | 1 (rename 승격) | 🟢 |
| **FloatingOverlay** | 4 곳 | 🟢 신규 추가 |
| **TextButton** | 5 곳 (+ Link 1 곳 흡수 가능) | 🟡 |
| **MenuItem** | 4 곳 | 🟡 |
| **Textarea** | 3 곳 | 🟡 |
| **ColorInput** | 1 곳 | 🟡 |
| **CollapsibleSectionHeader** | 2 곳 | 🟡 후순위 |
| **DropZone** | 1 (+ upload-dropzone refactor) | 🟡 |
| **ResizeHandle** | 1 (fundamental) | 🟡 |
| **AspectRatioImage** | 1 (fundamental) | 🟡 |
| **OverlayLayer** | 1 (fundamental) | 🟡 |
| (선택) **Badge `$tone="overlay"`** | 1 곳 | 🟡 작은 확장 |

**신규 컴포넌트 11 개 + Text primitive 확장 + Badge variant 확장 1.**

---

## 실행 순서 권장

### Phase 0: 의존성 (prereq)
0. **Text primitive 확장** — `align`, `uppercase`, `letterSpacing`, `fontFamily`, `tabularNums` props 추가. Phase 1 이후 작업의 80+ 곳이 이걸 사용.

### Phase 1: 안전한 정리 (시각 변경 없음 또는 최소)
1. **B3 DragHandle 승격** — `widget-drag-handle.tsx` → `components/inputs/drag-handle.tsx`
2. **A1 IconButton 교체** — 9 곳
3. **A2 ColorSwatch 교체** — 3 곳
4. **A4 Checkbox 교체** — 1 곳
5. **A5/A6 Empty/Placeholder/Muted → Text** — 11 곳
6. **A7 Heading 교체** — 21 곳 `styled.h*` → `<Heading level={...}>`
7. **A9 레이아웃 글루 → primitives** — 광범위 (~150+ 곳, 패턴 파일별로). `styled.div` 236 의 대부분 + `styled.section/aside/header/nav/main/ul/li/label` 등 흡수

### Phase 2: 시각 근접 흡수 (마이그레이션, 정리는 나중)
7. **A3 Badge/Tag/Chip 교체** — 4 곳
8. **A7 Status text → Text** — 3 곳
9. **A8 Link → Text(as="a")** — 1 곳 (또는 TextButton 추출 후)

### Phase 3: 신규 컴포넌트 추출
10. **B8 FloatingOverlay** + 4 곳 교체
11. **B1 TextButton** + 5-6 곳 교체
12. **B2 MenuItem** + 4 곳 교체
13. **B4 Textarea** + 3 곳 교체
14. **B5 ColorInput** + 1 곳 교체
15. **B10 DropZone** + reference-image-drop-zone 교체 + UploadDropzone refactor
16. **B11 ResizeHandle** + catalog-shell 교체
17. **B12 AspectRatioImage** + image-grid-cell Media 교체
18. **B13 OverlayLayer** + image-grid-cell OverlayLayer 교체
19. **B6 CollapsibleSectionHeader** + 2 곳 교체 (후순위)

### Phase 4: 도메인 wrapper refactor
16. **C1 device-status-badge** 내부 → Badge 사용
17. **C2 project-type-tag** 내부 → Tag 사용
18. **D4 특수 Table** → `HeatmapTable`, `StatsTable` features 컴포넌트로 분리

### Phase 5: 시각 일치 정리 (마이그레이션 완료 후)
19. 시각 변경 발생한 곳들 일괄 디자인 정리 (HiResPill, MoreChip, source-breakdown Chip, device-status-badge 색, project-type-tag 색 등)

---

## 수치 요약 (전수 검증 후)

| 작업 | 작업량 |
|---|---|
| ⚙️ Text primitive 확장 (prereq) | 5 props 추가 |
| 🟢 기존 components 교체 (시각 변경 거의 없음) | ~25 곳 |
| 🟢 primitives 로 교체 (레이아웃) | ~150+ 곳 (`styled.div/section/aside/ul/li/label/header/nav/main` 등) |
| 🟢 Text/Heading primitive 교체 | ~70+ 곳 (`styled.span/p/h*/strong`) |
| 🟡 기존 components 교체 (시각 근접) | ~10 곳 |
| 🟡 신규 컴포넌트 추출 | 7 개 + ~20 곳 교체 |
| 🟡 도메인 wrapper 내부 refactor | 2 곳 + 특수 Table 2-3 곳 |
| 🔴 인라인 유지 | **0 곳** ✨ |

**총 인라인 정의 499 개 중 499 제거 / 신규 컴포넌트 11 개 + primitives 확장.**

## 인라인 잔존 — **없음**

이전 "유지" 분류였던 모든 케이스를 fundamental 컴포넌트로 추출:
- TanStack Virtual `RowWrap` — primitives Box/Grid 흡수
- SVG roots 2 곳 — 인라인 `<svg style={{}}>` 흡수
- `reference-image-drop-zone Zone` — Universal **DropZone** 추출 (B10)
- `catalog-shell Handle` — **ResizeHandle** 추출 (B11)
- `image-grid-cell Media` — **AspectRatioImage** 추출 (B12)
- `image-grid-cell OverlayLayer` — **OverlayLayer** 추출 (B13)
- `image-grid-cell TopRightLayer/Footer` — primitives 흡수
