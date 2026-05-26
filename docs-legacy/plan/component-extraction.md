# 공통 컴포넌트 추출 계획

## 판단 기준

BOUNDARIES.md 원칙: **"새 프로젝트에서 제품 의미 없이 바로 쓸 수 있는가?"**

- YES → `@ingradient/ui`
- NO → 앱 저장소에 유지

## 현재 중복 분석

| 패턴 | Platform | Edge | ingradient-ui |
|------|----------|------|---------------|
| 리사이즈 패널 | catalog ResizeHandle | — | 없음 |
| 클립보드 복사 | devices-tab handleCopy | FieldTestTab handleCopy | 없음 |
| 상태 칩/필 | StatusBadge, SyncStateChip | SyncChip, StatusDot | Badge (기본만) |
| 오버플로우 칩 그룹 | — | ClassChips + MoreChip (+N more) | 없음 |
| 모드 스위처 | toolbar mode toggle | SubmodeRow/SubmodeButton | 없음 |
| 폼 섹션 레이아웃 | FormSection/FieldRow | SetupField/SetupSection | 없음 |
| 필터 바 | FilterBar (search+select) | FilterPopover (date+type) | 없음 |
| 단축키 힌트 | ImageMenu shortcut text | ClassPanel Shortcut | 없음 |
| 빈 상태 | EmptyState (여러 곳) | EmptyState/EmptyHint | 없음 (커스텀) |
| Zoom/Pan 이미지 뷰어 | image-detail-modal (직접 구현) | useZoomPan + BBoxCanvas | 없음 |
| 이미지 그리드 | virtualized-image-grid | ImagesView (virtual grid) | ImageGrid (shell만) |
| 멀티 셀렉션 | useSelection hook | selectedIds useState | 없음 |
| 코멘트 스레드 | CommentThread/CommentCard | CommentThread/CommentItem | 없음 |
| 컨텍스트 메뉴 | image-menu (커스텀) | — | ContextMenu (기본만) |
| 업로드 드롭존 | upload-dropzone | — | FileInput (기본만) |
| 셀렉션 액션 바 | SelectionBar | SelectionToolbar | 없음 |
| 확인 다이얼로그 | ConfirmOverlay/ConfirmCard | DialogShell + ConfirmButton | DialogShell만 |
| 패턴 탭 바 | PatternTabBar/PatternTabBtn | ModalPatternBar/ModalPatternBtn | 없음 |
| 넘버 인풋 | — | DraftNumberInput | TextField (number) |
| 필터 드롭다운 | FilterDropdown + ClassChip | — | 없음 |
| 서치 인풋 | SearchInput (styled TextField) | ClassSearchInput | TextField만 |
| 멘션 자동완성 | MentionMenu/MentionOption | — | 없음 |
| 클래스 리스트 + 색상 | ClassRow/ClassColorSwatch | ClassItem/ColorSwatch | 없음 |
| Bbox/Point 드로잉 | image-detail-modal (DOM) | BBoxCanvas (Canvas 2D) | 없음 |
| 태그 검색+추가 패널 | ClassSearch + ClassPool | ClassSearchInput + ClassList | 없음 |

---

## 추출 대상 (범용성 순)

### Phase 1 — Hooks & Utilities ✅ 완료

범용 로직. 프로젝트 의미 없이 바로 쓸 수 있는 것들.

> **완료 (2026-03-27)**: 3개 hook 구현 + 18 tests passed + build 확인
> - `src/hooks/useZoomPan.ts` — 옵션(min/max/step) 지원 추가
> - `src/hooks/useSelection.ts` — 제네릭 `<T extends { id: string }>` 지원
> - `src/hooks/useClipboard.ts` — resetDelay 옵션, 에러 처리 포함
> - `src/hooks/index.ts` — barrel export
> - `src/components/index.ts`, `src/index.ts`에서 re-export

#### 1-1. `useZoomPan` hook

**현재**: Edge `src/ui/hooks/useZoomPan.ts`
**범용성**: 이미지, 캔버스, 지도 등 어디서든 사용 가능

```
src/hooks/useZoomPan.ts

interface UseZoomPanOptions {
  minZoom?: number    // default 1
  maxZoom?: number    // default 8
  zoomStep?: number   // default 0.25
}

Returns: { zoom, pan, reset, handleWheel, startPan, movePan, endPan, isZoomPanning }
```

#### 1-2. `useSelection` hook

**현재**: Platform `shared/hooks/useSelection.ts`
**범용성**: 갤러리, 테이블, 파일 목록 등 멀티 셀렉트가 필요한 곳

```
src/hooks/useSelection.ts

interface UseSelectionOptions<T extends { id: string }> {
  items: T[]
}

Returns: { selectedIds, toggle, range, single, selectAll, clearSelection }
```

---

### Phase 2 — Input 컴포넌트 확장 ✅ 완료

기존 TextField 계열을 보강.

> **완료 (2026-03-27)**: 3개 컴포넌트 구현 + 17 tests passed + build 확인
> - `src/components/inputs/search-field.tsx` — 돋보기 아이콘 + clear 버튼 + sm/md 사이즈
> - `src/components/inputs/number-field.tsx` — draft string 유지, blur/Enter commit, ArrowUp/Down, min/max clamp, format 지원
> - `src/components/inputs/mention-textarea.tsx` — @트리거 감지, 후보 필터링, 키보드 탐색(↑↓), Enter/Tab 삽입, Ctrl+Enter 제출
> - 기존 `text-fields.tsx`의 간단한 SearchField/NumberField 래퍼 제거, 새 파일로 교체

#### 2-1. `SearchField`

**현재**: Platform `SearchInput`, Edge `ClassSearchInput` — 둘 다 TextField에 돋보기 아이콘 + clear 버튼
**추출 이유**: 검색 입력은 거의 모든 프로젝트에 있음

```
src/components/inputs/search-field.tsx

Props:
  value, onChange, placeholder
  onClear?: () => void
  size?: 'sm' | 'md'
```

#### 2-2. `NumberField`

**현재**: Edge `DraftNumberInput` — 중간 상태를 draft string으로 유지, blur/Enter 시 clamp
**추출 이유**: 카메라 파라미터, 설정값 입력 등 숫자 입력 공통

```
src/components/inputs/number-field.tsx

Props:
  value: number, onChange: (v: number) => void
  min?, max?, step?
  format?: (v: number) => string
```

#### 2-3. `MentionTextarea`

**현재**: Platform `image-detail-modal.tsx` — @멘션 자동완성 + 드롭다운
**추출 이유**: 코멘트 기능이 있는 모든 곳에서 재사용

```
src/components/inputs/mention-textarea.tsx

Props:
  value, onChange, placeholder, maxLength
  candidates: { id: string; name: string; email?: string }[]
  onSubmit?: (text: string, mentions: string[]) => void
```

---

### Phase 3 — Feedback & Overlay 확장 ✅ 완료

> **완료 (2026-03-27)**: 2개 신규 컴포넌트 + ConfirmDialog danger 옵션 + 11 tests passed + build 확인
> - `ConfirmDialog` — 기존에 이미 존재. `danger` prop 추가 (tone='danger' 연결)
> - `src/components/feedback/selection-action-bar.tsx` — 선택 카운트 + Clear/SelectAll + 커스텀 액션 슬롯
> - `src/components/feedback/empty-state.tsx` — icon + title + description + action 버튼
> - 기존 `status.tsx`의 `EmptyState` styled div → `EmptyStateText`로 rename (deprecated)

#### 3-1. `ConfirmDialog`

**현재**: 양쪽 프로젝트가 각자 ConfirmOverlay + ConfirmCard 구현
**추출 이유**: DialogShell 위에 제목/설명/위험 버튼을 조합하는 패턴이 반복됨

```
src/components/overlays/confirm-dialog.tsx

Props:
  open: boolean
  title: string
  description?: string
  confirmLabel?: string    // default "확인"
  cancelLabel?: string     // default "취소"
  danger?: boolean         // 빨간 확인 버튼
  onConfirm: () => void
  onCancel: () => void
```

#### 3-2. `SelectionActionBar`

**현재**: Platform `SelectionBar`, Edge `SelectionToolbar`
**추출 이유**: 아이템 선택 후 상단에 뜨는 액션 바. 갤러리, 테이블 등에서 공통

```
src/components/feedback/selection-action-bar.tsx

Props:
  selectedCount: number
  totalCount?: number
  onClearSelection: () => void
  actions: ReactNode         // 오른쪽에 들어갈 버튼들
  selectAllLabel?: string
  onSelectAll?: () => void
```

---

### Phase 4 — Data Display 확장 ✅ 완료

> **완료 (2026-03-27)**: 4개 컴포넌트 구현 + 13 tests passed + build 확인
> - `src/components/data-display/color-swatch.tsx` — xs/sm/md 사이즈, circle/square 형태
> - `src/components/data-display/comment-thread.tsx` — CommentThread + CommentItem + CommentInput (Ctrl+Enter submit)
> - `src/components/data-display/tag-list.tsx` — TagList + TagItemData (색상 스와치, 카운트, 선택 상태)
> - `src/components/data-display/tag-list-panel.tsx` — TagListSearch (검색 + 드롭다운 + click-outside 닫기)

#### 4-1. `CommentThread`

**현재**: 양쪽에서 각각 코멘트 스레드 UI 구현
**추출 이유**: 코멘트 표시는 제품 의미 없는 범용 UI

```
src/components/data-display/comment-thread.tsx

CommentThread: container
CommentItem: { author, timestamp, body, actions?: ReactNode }
CommentInput: { value, onChange, onSubmit, placeholder }
```

**주의**: 코멘트의 CRUD 로직은 앱 쪽에 유지. UI 렌더링만 추출.

#### 4-2. `ColorSwatch`

**현재**: 양쪽에서 클래스 색상 표시용 작은 원/사각형 구현
**추출 이유**: 라벨/카테고리 색상 표시 범용 패턴

```
src/components/data-display/color-swatch.tsx

Props:
  color: string
  size?: 'xs' | 'sm' | 'md'   // 8px, 12px, 16px
  shape?: 'circle' | 'square'  // default circle
```

#### 4-3. `TagList`

**현재**: 양쪽에서 클래스 목록 + 색상 스와치 + 검색 + 선택 구현
**범용성**: "class"라는 제품 이름 대신 **색상 태그 선택 리스트**로 추상화

```
src/components/data-display/tag-list.tsx

TagList: scrollable container
TagItem: { color, label, active, onClick }
```

#### 4-4. `TagListPanel`

**현재**: Platform Catalog에서 class 검색 + 드롭다운 + 추가 + 연결된 목록 관리
**범용성**: 검색 → 드롭다운 결과 → 선택/추가 → 연결 목록 표시는 범용 패턴

Platform 3곳에서 동일 패턴 반복:
- Catalog 우측 패널 (ClassSearchWrap + ClassPoolList)
- ImageDetailModal 사이드바 (ClassList + ClassRow)
- Classes 페이지 사이드바 (ClassList + AddBtn)

```
src/components/data-display/tag-list-panel.tsx

TagListPanel: 전체 패널 컨테이너
  Props:
    items: { id: string; color: string; label: string; count?: number }[]
    selectedId?: string | null
    activeIds?: Set<string>
    onItemClick?: (id: string) => void
    onItemRemove?: (id: string) => void

TagListSearch: 검색 + 드롭다운
  Props:
    placeholder?: string
    candidates: { id: string; color: string; label: string }[]
    onSelect: (id: string) => void
    emptyAction?: { label: string; onClick: () => void }
```

**주의**: CRUD API 호출은 앱 책임. UI 렌더링과 인터랙션만 추출.

---

### Phase 5 — Image Viewer 컴포넌트 ✅ 완료

> **완료 (2026-03-27)**: 2개 컴포넌트 + 8 tests passed + build 확인
> - `src/components/data-display/image-viewer.tsx` — useZoomPan 내장, wheel zoom, drag pan, double-click reset, children overlay 슬롯
> - `src/components/data-display/image-viewer-toolbar.tsx` — zoom in/out/reset 버튼 + 퍼센트 표시 + children 슬롯

이미지 확대/축소/패닝은 양쪽에서 가장 크게 중복되는 영역.

#### 5-1. `ImageViewer`

**현재**: Platform은 ZoomWrap + ModalImg 직접 구현, Edge는 useZoomPan + ModalImg
**추출 이유**: 이미지 확대/축소/드래그는 제품 의미 없는 순수 뷰어

```
src/components/data-display/image-viewer.tsx

Props:
  src: string
  alt?: string
  minZoom?: number        // default 1
  maxZoom?: number        // default 8
  onZoomChange?: (zoom: number) => void
  children?: ReactNode    // overlay layer (bbox, point 등 앱에서 주입)
```

내부적으로 `useZoomPan` 사용. 줌/팬 컨트롤 + 휠/더블클릭 리셋 포함.
**annotation layer는 children으로 주입** — 앱 책임.

#### 5-2. `ImageViewerToolbar`

```
src/components/data-display/image-viewer-toolbar.tsx

Props:
  zoom: number
  onZoomIn: () => void
  onZoomOut: () => void
  onReset: () => void
  children?: ReactNode   // 추가 도구 버튼 슬롯
```

---

### Phase 6 — Drawing Layer (캔버스 드로잉) ✅ 완료

> **완료 (2026-03-27)**: 3개 hook/컴포넌트 + 12 tests passed + build 확인
> - `src/hooks/useDrawingCanvas.ts` — 좌표 변환, 히트 테스트, 드래그(draw/move/resize), rect/point 생성
> - `src/hooks/useUndoRedo.ts` — 제네릭 상태 히스토리 (maxHistory, truncate forward)
> - `src/components/data-display/drawing-layer.tsx` — SVG 오버레이 (rect/point/handles/labels/crosshair/preview)

이미지 위에 사각형/점을 그리는 범�� 인터랙션 레이어.
"annotation"이라는 제품 의미는 빼고, **그리�� 도구**로 추상화.

#### 6-1. `useDrawingCanvas` hook

양쪽 프로젝트의 공통 로직을 hook으로 추출:
- 좌표 변환 (화면 px ↔ 정규화 0~1)
- 히트 테스트 (점 클릭, 사각형 내부, 리사이즈 핸들)
- 드래그 상태 관리 (그리��/이동/리사이즈)

```
src/hooks/useDrawingCanvas.ts

interface DrawingObject {
  id: string
  type: 'rect' | 'point'
  x: number; y: number          // 정규화 0~1
  w?: number; h?: number        // rect만 (정규화)
  color?: string
  label?: string
}

interface UseDrawingCanvasOptions {
  objects: DrawingObject[]
  mode: 'cursor' | 'rect' | 'point'
  minSize?: number              // 최소 사각형 크기 (default 0.01)
  handleRadius?: number         // 리사이즈 핸들 반경 (default 0.03)
  onObjectsChange: (objects: DrawingObject[]) => void
  onSelectionChange?: (id: string | null) => void
}

Returns: {
  selectedId, bindings (onMouseDown/Move/Up/Leave),
  cursor, drawingPreview
}
```

#### 6-2. `DrawingLayer` 컴포넌트

`ImageViewer`의 children으로 주입하는 SVG 오버레이.

```
src/components/data-display/drawing-layer.tsx

Props:
  objects: DrawingObject[]
  selectedId?: string | null
  drawingPreview?: { x, y, w, h } | null   // 드래그 중 미리보기
  showHandles?: boolean                      // 리사이즈 핸들
  showLabels?: boolean                       // 라벨 텍스트
  showCrosshair?: boolean                    // 십자선
```

**렌더링 방식**: SVG (DOM 기반)
- Platform은 이미 DOM 기반, Edge는 Canvas 2D이지만 SVG가 더 범용적
- rect → `<rect>`, point → `<circle>`, handles → 코너 `<circle>`
- 색상/라벨은 외부에서 주입 (DrawingObject.color/label)

#### 6-3. `useUndoRedo` hook

**현재**: Platform만 undo/redo 지원 (MAX_ANNOTATION_HISTORY=50)
**범용성**: 어떤 상태든 되돌리기가 필요한 곳에 사용 가능

```
src/hooks/useUndoRedo.ts

interface UseUndoRedoOptions<T> {
  initialState: T
  maxHistory?: number   // default 50
}

Returns: {
  state: T
  setState: (next: T) => void   // 히스토리에 push
  undo: () => void
  redo: () => void
  canUndo: boolean
  canRedo: boolean
  reset: (state: T) => void     // 히스토리 초기화
}
```

#### 조합 예시 (앱에서 사용)

```tsx
// 앱 코드 (ingradient-platform 또는 ingradient-edge)
<ImageViewer src={imageUrl}>
  <DrawingLayer
    objects={objects}
    selectedId={selectedId}
    drawingPreview={preview}
    showHandles
  />
</ImageViewer>
```

앱에서 담당하는 것:
- class 할당 (어떤 색상/라벨을 줄지)
- 저장 API 호출
- 모드 전환 UI (bbox/point/cursor 버튼)
- 키보드 단축키 (앱마다 다를 수 있음)

---

### Phase 7 — Gallery 패턴 강화 ✅ 완료

> **완료 (2026-03-27)**: UploadDropzone 구현 + 4 tests passed + build 확인
> - `src/components/inputs/upload-dropzone.tsx` — drag&drop + click browse, accept/multiple/disabled, dragCounter로 정확한 active 상태
> - 기존 ImageGrid는 이미 잘 구조화되어 유지 (가상 스크롤은 앱에서 @tanstack/react-virtual 사용)

기존 `ImageGrid` shell을 실질적 기능으로 강화.

#### 7-1. `ImageGrid` (강화)

**현재**: ingradient-ui에 shell만 있고, 양쪽에서 가상 스크롤 그리드를 각자 구현
**추출**: 셀 렌더링, 선택, 그룹 배지를 범용 패턴으로

```
src/components/data-display/image-grid.tsx

Props:
  items: { id: string; src: string; label?: string }[]
  selectedIds?: Set<string>
  onSelect?: (id: string, action: 'toggle' | 'range') => void
  onItemClick?: (id: string) => void
  renderBadge?: (item) => ReactNode   // 그룹 배지, 상태 아이콘 등
  cellMinWidth?: number               // default 140
  cellHeight?: number                 // default 192
```

가상 스크롤은 `@tanstack/react-virtual` (이미 양쪽에서 사용).

#### 7-2. `UploadDropzone`

**현재**: Platform `upload-dropzone.tsx`
**추출 이유**: 파일 업로드 드래그앤드롭은 범용

```
src/components/inputs/upload-dropzone.tsx

Props:
  accept?: string          // file types
  multiple?: boolean
  onFiles: (files: File[]) => void
  children?: ReactNode     // 커스텀 내부 콘텐츠
  disabled?: boolean
```

---

### Phase 8 — 인터랙션 유틸리티 ✅ 완료

> **완료 (2026-03-27)**: 3개 컴포넌트 + 5 tests passed + build 확인
> - `src/components/inputs/copy-button.tsx` — useClipboard 내장, Copy/Check 아이콘 토글, copiedLabel 커스텀
> - `src/components/inputs/mode-switcher.tsx` — pill 버튼 그룹, aria-checked, icon 슬롯
> - `src/components/data-display/resizable-panel.tsx` — horizontal/vertical, min/max, localStorage 자동 저장

#### 8-1. `CopyButton`

**현재**: Platform `devices-tab` handleCopy, Edge `FieldTestTab` handleCopy
— 양쪽 모두 navigator.clipboard + 2초 "Copied!" 피드백

```
src/components/inputs/copy-button.tsx

Props:
  value: string                    // 복사할 텍스트
  children?: ReactNode             // 기본 상태 콘텐츠
  copiedLabel?: string             // default "Copied!"
  copiedDuration?: number          // default 2000ms
  size?: 'sm' | 'md'
```

#### 8-2. `ModeSwitcher`

**현재**: Platform gallery toolbar (cursor/bbox/point), Edge SubmodeRow (버튼 그룹)
— 양쪽 모두 N개 옵션 중 1개 선택하는 pill 버튼 그룹

```
src/components/inputs/mode-switcher.tsx

Props:
  options: { value: string; label: string; icon?: ReactNode }[]
  value: string
  onChange: (value: string) => void
  size?: 'sm' | 'md'
```

#### 8-3. `useClipboard` hook

```
src/hooks/useClipboard.ts

Returns: {
  copy: (text: string) => Promise<void>
  copied: boolean              // 2초간 true
}
```

#### 8-4. `ResizablePanel`

**현재**: Platform catalog ResizeHandle (마우스 드래그로 패널 너비 조절, localStorage 저장)
**범용성**: 분할 뷰가 필요한 모든 곳

```
src/components/data-display/resizable-panel.tsx

Props:
  direction: 'horizontal' | 'vertical'
  defaultSize?: number           // 초기 크기 (px)
  minSize?: number
  maxSize?: number
  storageKey?: string            // localStorage 키 (자동 저장)
  children: [ReactNode, ReactNode]   // 좌/우 또는 상/하 패널
```

---

### Phase 9 — Layout & Feedback 확장 ✅ 완료

> **완료 (2026-03-27)**: 4개 컴포넌트 + 10 tests passed + build 확인
> - `src/components/data-display/chip-group.tsx` — maxVisible + "+N more" 오버플로우, color swatch 내장
> - `src/components/inputs/form-section.tsx` — FormGroup (제목+설명+children) + FieldRow (label+input grid)
> - `src/components/inputs/filter-bar.tsx` — FilterBarLayout (children slot + clear 버튼)
> - `src/components/data-display/keyboard-shortcut-hint.tsx` — kbd 요소, sm/md 사이즈
> - 참고: FilterBar→FilterBarLayout, FormSection→FormGroup으로 rename (patterns/page-shell 기존 export 충돌 회피)

#### 9-1. `ChipGroup`

**현재**: Edge ClassChips + MoreChip (+N more 오버플로우)
**범용성**: 태그, 필터, 카테고리 등 여러 칩을 보여줄 때 공통

```
src/components/data-display/chip-group.tsx

Props:
  items: { id: string; label: string; color?: string }[]
  maxVisible?: number            // 초과하면 "+N more" 표시
  onItemClick?: (id: string) => void
  renderItem?: (item) => ReactNode
```

#### 9-2. `EmptyState` (강화)

**현재**: 양쪽에서 각자 EmptyState/EmptyHint 구현. ingradient-ui에 없음
**범용성**: 데이터 없음, 검색 결과 없음, 에러 상태 등

```
src/components/feedback/empty-state.tsx

Props:
  icon?: ReactNode
  title?: string
  description?: string
  action?: { label: string; onClick: () => void }
```

#### 9-3. `FormSection`

**현재**: Platform FormSection/FieldRow (label+input grid), Edge SetupField/SetupSection
— 양쪽에서 설정 폼의 라벨-입력 쌍 레이아웃을 각자 구현

```
src/components/inputs/form-section.tsx

FormSection: 제목 + 그룹 컨테이너
  Props: title?: string, description?: string

FieldRow: 라벨 + 입력 한 줄
  Props: label: string, htmlFor?: string, hint?: string, children: ReactNode
```

#### 9-4. `FilterBar`

**현재**: Platform FilterBar (search + select dropdown), Edge FilterPopover (date + type toggles)
**범용성**: 검색 + 필터 드롭다운 조합은 거의 모든 목록 페이지에 있음

```
src/components/inputs/filter-bar.tsx

Props:
  children: ReactNode              // SearchField, SelectField 등을 슬롯으로
  onClear?: () => void             // 전체 필터 초기화
```

컨테이너 역할만 하고, 내부에 SearchField/SelectField/Button 등을 자유롭게 배치.

#### 9-5. `KeyboardShortcutHint`

**현재**: Platform ImageMenu에서 ⌘C/⌘V 힌트, Edge ClassPanel에서 숫자 힌트
**범용성**: 메뉴, 툴바, 리스트에서 키보드 단축키 표시

```
src/components/data-display/keyboard-shortcut-hint.tsx

Props:
  keys: string[]                   // ['⌘', 'C'] 또는 ['1']
  size?: 'sm' | 'md'
```

---

## 추출하지 않는 것

BOUNDARIES.md 기준에 따라 앱에 유지:

| 패턴 | 이유 |
|------|------|
| Class 할당 로직 | 어떤 태그를 어떤 객체에 연결할지는 제품 의미 |
| Annotation 저장/동기화 | API 호출, 동기화는 앱 책임 |
| AI Detection | 모델 추론 = 제품 의미 |
| CaptureFlow | 카메라 촬영 흐름 |
| ExportModal | dataset export = 제품 의미 |
| 로그인/라이선스 폼 | auth flow = 제품 의미 (shell은 이미 있음) |
| 카메라 설정 패널 | device settings = 제품 의미 |

---

## 실행 순서 권장

```
Phase 1 (hooks)        → useZoomPan, useSelection, useClipboard
Phase 2 (inputs)       → SearchField, NumberField, MentionTextarea
Phase 3 (feedback)     → ConfirmDialog, SelectionActionBar, EmptyState
Phase 4 (display)      → CommentThread, ColorSwatch, TagList, TagListPanel
Phase 5 (viewer)       → ImageViewer + Toolbar (Phase 1 의존)
Phase 6 (drawing)      → useDrawingCanvas + DrawingLayer + useUndoRedo (Phase 5 의존)
Phase 7 (gallery)      → ImageGrid 강화, UploadDropzone (Phase 1+5 의존)
Phase 8 (interaction)  → CopyButton, ModeSwitcher, ResizablePanel
Phase 9 (layout)       → ChipGroup, FormSection, FilterBar, KeyboardShortcutHint
```

## Phase별 문서화 산출물

**매 Phase 완료 시** 코드와 함께 아래 문서를 반드시 같이 작성한다.

### reference/ 문서

`docs/reference/`에 컴포넌트/hook별 API 요약 Markdown 추가:

| Phase | 추가할 reference 문서 |
|-------|----------------------|
| 1 | `hooks.md` — useZoomPan, useSelection, useClipboard API |
| 2 | `search-field.md`, `number-field.md`, `mention-textarea.md` |
| 3 | `confirm-dialog.md`, `selection-action-bar.md`, `empty-state.md` |
| 4 | `comment-thread.md`, `color-swatch.md`, `tag-list.md`, `tag-list-panel.md` |
| 5 | `image-viewer.md` |
| 6 | `drawing-layer.md`, `hooks.md`(useDrawingCanvas, useUndoRedo 추가) |
| 7 | `image-grid.md`(갱신), `upload-dropzone.md` |
| 8 | `copy-button.md`, `mode-switcher.md`, `resizable-panel.md` |
| 9 | `chip-group.md`, `form-section.md`, `filter-bar.md`, `keyboard-shortcut-hint.md` |

자주 쓰이는 조합은 `docs/reference/recipes/`에도 추가:
- `recipes/image-viewer-with-drawing.md` — ImageViewer + DrawingLayer 조합
- `recipes/tag-management-panel.md` — TagListPanel + TagListSearch + ColorSwatch 조합
- `recipes/gallery-with-selection.md` — ImageGrid + useSelection + SelectionActionBar 조합
- `recipes/form-layout.md` — FormSection + FieldRow + SearchField + NumberField 조합

### Storybook 문서

새 public surface는 Storybook에 먼저 추가한다.
최소 기준은 아래와 같다:

```typescript
{
  id: 'image-viewer',
  stories: ['Playground', 'Review'],
  optionalStories: ['Scenario', 'Page'],
  docs: ['autodocs', 'reference markdown', 'recipe when needed'],
}
```

권장 기준:

- 최소 `Playground` 1개
- 디자이너 검토용 `Review` 1개
- 조합이 중요한 surface면 `Scenario` 또는 `Page`
- 필요한 경우 `play` 또는 a11y/visual 검증 포함

### coverage 검증

Phase 완료 후 반드시 실행:
```bash
npm run check:doc-coverage    # 문서 누락 검사
npm run check:exports         # export 누락 검사
```

coverage-matrix.md에 새 컴포넌트 추가 상태도 갱신한다.

---

## 개발 시 유의사항

아래는 ingradient-ui 내부 문서(docs/)와 공통 엔지니어링 기준(ingradient-docs/dev/)에서
추출한 규칙을 Phase 작업 흐름 순서로 정리한 것이다.

### 1. 작업 시작 전 — 경계 확인

**Must** (BOUNDARIES.md, PHILOSOPHY.md)

- 새 컴포넌트/hook마다 자문: **"제품 의미 없이 다른 프로젝트에서 바로 쓸 수 있는가?"**
- `dataset`, `annotation`, `camera`, `device`, `project permission` 키워드가
  props/타입 이름에 들어가면 경계 위반 신호
- 제품 이름이 붙은 패키지/파일을 만들지 않는다
- 판단이 애매하면 앱 저장소에 먼저 두고, 2개 이상 프로젝트에서 쓰이면 올린다

### 2. 파일 구조 & 네이밍

**Must** (FILE_RULES.md, core/structure.md)

| 규칙 | 내용 |
|------|------|
| 파일 길이 | 구현 파일 200줄 미만. 예외여도 250줄 이내 |
| 한 파일 = 한 책임 | unrelated component를 한 파일에 섞지 않는다 |
| named export only | default export 금지 |
| 파일명 | kebab-case (`search-field.tsx`) |
| 타입/인터페이스 | PascalCase (`DrawingObject`, `UseZoomPanOptions`) |
| 함수/변수 | camelCase (`useZoomPan`, `handleWheel`) |
| 상수 | SCREAMING_SNAKE (`ZOOM_MIN`, `MIN_BBOX_SIZE`) |
| JSX 포함 | `.tsx`, JSX 없으면 `.ts` |

### 3. 토큰 & 스타일

**Must** (FILE_RULES.md Raw Literal Rule, ARCHITECTURE.md Token Architecture)

- `components/`와 `patterns/`에서 raw hex/rgba, 임의 spacing/radius 직접 하드코딩 금지
- 새 스타일 값이 필요하면 아래 순서로 판단:
  1. `foundations/` — raw palette, spacing scale, radius scale
  2. `semantic/` — UI 의미 재매핑 (`surface.panel`, `text.primary`)
  3. `recipes/` — styled-components 재사용 CSS 조합 (`surfacePanel`, `controlField`)
  4. `variants/` — props 선택지와 직접 연결 (`StatusTone`, alert tone map)
- 새 CSS 변수가 필요하면 `src/tokens/` → build → `lib/tokens.css` 흐름을 따른다
- `lib/tokens.css` 직접 수정 금지

### 4. 레이어 배치

**Must** (ARCHITECTURE.md Layer Responsibilities)

| 레이어 | 이번 계획에서 해당하는 것 |
|--------|-------------------------|
| `hooks/` (신규) | `useZoomPan`, `useSelection`, `useDrawingCanvas`, `useUndoRedo` |
| `components/inputs/` | `SearchField`, `NumberField`, `MentionTextarea`, `UploadDropzone` |
| `components/feedback/` | `ConfirmDialog`, `SelectionActionBar` |
| `components/data-display/` | `CommentThread`, `ColorSwatch`, `TagList`, `TagListPanel`, `ImageViewer`, `DrawingLayer`, `ImageGrid` |
| `components/overlays/` | 기존 `DialogShell` 확장으로 처리 |

- 새 export를 추가하면 해당 layer index(`src/components/index.ts` 등)에서 연다
- 내부 구현 경로 직접 import를 앱에서 하게 만들지 않는다
- `@ingradient/ui/components`에서 import 가능해야 함

### 5. 의존 방향

**Must** (core/structure.md)

```
tokens → primitives → components → patterns
                  ↑
               hooks (신규)
```

- hooks는 React만 의존. tokens/primitives/components를 import하지 않는다
- components는 tokens + primitives를 사용 가능
- 순환 의존 금지

### 6. 테스트

**Must** (operational/testing.md Level 1, code-quality-plan.md)

| 항목 | 기준 |
|------|------|
| ESLint | 0 errors (eslint-plugin-security 포함) |
| TypeScript | `tsc --noEmit` 통과 |
| 단위 테스트 | 새 컴포넌트/hook마다 Vitest 테스트 필수 |
| a11y | axe-core 접근성 검증 (Alert, Spinner 등 기존 패턴 참조) |
| 커버리지 | lines 60%, branches 50% 이상 유지 |

**Should**

- hook 테스트: `@testing-library/react` renderHook 사용
- 컴포넌트 테스트: render + 기본 인터랙션 + aria 속성 확인
- DrawingLayer: 마우스 이벤트 시뮬레이션으로 rect/point 생성 확인

### 7. 보안

**Must** (operational/security.md)

- 사용자 입력을 HTML로 렌더링할 때 `dangerouslySetInnerHTML` 사용 금지 (React 기본 방어 유지)
- MentionTextarea 등에서 외부 입력을 받는 컴포넌트는 XSS 방어 확인
- `eslint-plugin-security` 경고 확인 후 의도된 사용만 disable

### 8. 문서 동기화

**Must** (CHANGE_GUIDE.md, DOC_WRITING_RULES.md)

새 public export 추가 시 반드시 함께 작업:

1. **Storybook stories** — 최소 `Playground`, `Review`, 필요 시 `Scenario`/`Page`
2. **reference 문서** — `docs/reference/`에 API 사용 요약
3. **recipes** — 자주 쓰이는 조합이면 `docs/reference/recipes/`에 조립 예제
4. **doc-coverage** — `npm run check:doc-coverage` 통과 확인
5. **check-exports** — `scripts/check-exports.mjs`에 critical export 등록

### 9. 빌드 검증

**Must** (CHANGE_GUIDE.md Minimum Verification)

매 Phase 완료 후 아래를 반드시 실행:

```bash
npm run build                    # lib/ 산출물 생성
npm run check:style-literals     # raw literal 하드코딩 검사
npm run check:doc-coverage       # 문서 누락 검사
npm test                         # 전체 테스트
```

### 10. 앱 반영 흐름

**Must** (WORKFLOW.md)

1. `ingradient-ui`에서 먼저 개발 + 빌드 + 테스트 완료
2. 개발 중에는 local file link (`"@ingradient/ui": "file:../ingradient-ui"`)
3. 운영 반영은 semver publish 후 버전 지정
4. 앱에서 기존 자체 구현을 새 `@ingradient/ui` 컴포넌트로 교체
5. 앱의 기존 styled-components는 제거하고 import로 대체

각 앱의 구체적인 교체 대상(파일, styled-component, hook)은 아래 마이그레이션 문서에 정리되어 있다:

- **ingradient-edge**: `ingradient-edge/docs/plan/ui-migration.md`
- **ingradient-platform**: `ingradient-platform/docs/plan/ui-migration.md`

Phase가 완료될 때마다 해당 마이그레이션 문서의 체크리스트를 따라 앱 교체를 진행한다.

**마이그레이션 진행 현황 (2026-03-27):**

| 앱 | 완료 | 대기 |
|----|------|------|
| **Edge** | useZoomPan (2), ColorSwatch (2), NumberField (3), EmptyState (7), CopyButton (1), SearchField (1), CommentThread (1), ImageViewer (1), **DrawingLayer (1, BBoxCanvas 661→200줄)** — **총 19파일** | ✅ 완료 |
| **Platform** | useSelection (1), ColorSwatch (3), CopyButton (1), useZoomPan (1), SearchField (1), CommentThread (1), MentionTextarea (1), TagListSearch (1), useUndoRedo (1), DrawingLayer (1), useDrawingCanvas (1) + dead code 14함수 제거 — **총 13파일, image-detail-modal 2100→1722줄** | ✅ 완료 |

> Phase 2~9 교체는 단순 import 교체가 아니라 styled-component 제거 + JSX 구조 변경 + 스타일 적응이 포함된다.
> 기존 styled-component가 앱 자체 사이즈/border를 갖고 있어 `@ingradient/ui` 컴포넌트와 시각적 차이가 생길 수 있다.
> 앱을 실행하면서 화면 확인과 함께 순차적으로 진행해야 안전하다.

### 체크리스트 (매 컴포넌트/hook 추가 시)

```
[ ] 제품 의미 없이 다른 프로젝트에서 바로 쓸 수 있는가?
[ ] 파일 200줄 이하인가?
[ ] raw color/spacing/radius를 하드코딩하지 않았는가?
[ ] named export만 사용했는가?
[ ] 해당 layer index에서 export를 열었는가?
[ ] Vitest 테스트를 작성했는가?
[ ] axe-core 접근성 검증을 포함했는가?
[ ] Storybook story를 추가했는가?
[ ] reference/ 문서를 갱신했는가?
[ ] npm run build + check:style-literals + check:doc-coverage 통과하는가?
[ ] check-exports.mjs에 등록했는가?
```
