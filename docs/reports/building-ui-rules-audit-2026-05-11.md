# ingradient-ui BUILDING_UI Rules Audit (2026-05-11)

`docs/rules/BUILDING_UI.md` 규칙별로 현재 ui 본체가 얼마나 잘 지키는지 자동 + 수동 audit. 각 항목에 **PASS / PARTIAL / FAIL** 판정 + 위반 사례 + 권장 조치.

**audit 대상**: `src/` 전체 (160+ source files = 77 components + 7 patterns + 8 hooks + tokens/primitives/icons)
**총 stories**: 90 개 / **tests**: 35 개

> **갱신 (2026-05-11 audit 후속)**: high/medium 우선순위 액션 + low 일부 적용 완료. 갱신 내역은 § 액션 아이템 표 참조.

---

## 요약 (갱신 후)

| 카테고리 | PASS | PARTIAL | FAIL |
|---|---|---|---|
| § 1 핵심 원칙 | 2 | 1 | 0 |
| § 2 Component API 컨벤션 | **5** | **0** | 0 |
| § 3 디자인 토큰 사용 | 0 | 1 | 0 |
| § 4 시각·행동 표준 | **4** | 1 | **0** |
| § 5 Accessibility | **3** | 0 | 0 |
| § 7 파일 구조 | 2 | 1 | 0 |
| § 8 Storybook 커버리지 | 2 | 0 | 0 |
| § 9 Test 커버리지 | 0 | 1 | 0 |
| **합** | **18** (+4) | **4** (-4) | **0** (-1) |

**전후 비교**:
- FAIL 1 → **0** (Button recipe disabled 해결)
- PARTIAL 8 → 4 (Button focus-visible / Button-Switch-Radio forwardRef / DialogShell Escape / Token rgba 일부 해결)
- PASS 14 → 18

raw hex/rgba 잔존 — 일부 SVG/animation specific 사용은 legitimate.

---

## § 1. 핵심 원칙

### § 1.1 단일 진실 (color/space/radius/font/motion) — ⚠️ PARTIAL

- ✅ space/radius/font/motion 은 토큰화 양호
- ⚠️ **raw rgba/hex 잔존** — § 3.2 참조

### § 1.2 도메인 무관 — ✅ PASS

- `Dataset` / `Project` / `EdgeDevice` / `ImageItem` / `ClassItem` 등 도메인 model 명 **0 건**.
- 도메인 데이터는 모두 generic shape (`{ id, name, color? }`) 또는 `unknown`.

### § 1.3 컴포저블 (slot / render prop) — ✅ PASS

샘플 검증:
- `DialogShell` — title / actions / children slot
- `Table` — `columns[].render`
- `LineChartCard` — `headerExtra`, `tooltipContent` slots
- `CommentItem` — `author`, `timestamp`, `body`, `actions` slots

옵션 폭증 사례 없음.

---

## § 2. Component API 컨벤션

### § 2.1 네이밍 — ✅ PASS

| 패턴 | 일치 |
|---|---|
| `XxxField` (input) | TextField, NumberField, SearchField, SelectField, DatePickerField, PasswordField, TextareaField |
| `XxxButton` (trigger) | Button, IconButton, CopyButton, DialogCloseButton |
| `XxxRow` (display row) | InfoRow, SearchResultRow, AssignmentRow |
| `XxxCard` (card-style) | StatCard, PreviewCard, LineChartCard, BarChartCard, PieChartCard |
| `XxxShell` / `XxxLayout` | AppShell, SidebarShell, SettingsShell, SplitLayout, InspectorLayout, ListDetailLayout |
| `XxxDialog` / `XxxPopover` | DialogShell, ConfirmDialog, FilterPopover, MenuPopover, SettingsDialog |

### § 2.2 표준 props (variant/size/tone/disabled/loading) — ✅ PASS

- `Button` / `IconButton`: `variant` + `size` + `tone` 일관
- `TextField`: `size` 일관
- `Badge` / `StatusPill` / `Chip`: `$tone` 일관
- `Spinner`: `size` + `tone` 일관

### § 2.3 prop 명명 (onXxx, $ for transient) — ✅ PASS

- 이벤트는 모두 `onXxx`
- transient props 는 `$` prefix (DOM 누수 0건 — grep으로 확인)

### § 2.4 controlled vs uncontrolled — ✅ PASS

- TextField, Checkbox, SelectField, DropdownSelect, DatePickerField — controlled 1st
- defaultValue 도 지원 (secondary)

### § 2.5 forwardRef — ⚠️ PARTIAL

forwardRef 적용:
- TextField, PasswordField ✓
- Checkbox ✓
- IconButton ✓
- SelectableListItem ✓
- SearchResultRow ✓
- FilterPopover, MenuPopover ✓

⚠️ **누락 가능성** (DOM 핸들 필요할 수 있는 것):
- `Button` — forwardRef 없음 (caller 가 focus / scroll 어려움)
- `Switch` / `Radio` — forwardRef 없음
- `Spinner` — forwardRef 없음 (단순 표시라 OK 가능)

→ Button/Switch/Radio 에 forwardRef 추가 권장.

### § 2.6 indeterminate / partial state — ✅ PASS

`Checkbox` 가 indeterminate prop 지원 (`useImperativeHandle` 으로 internal ref 관리, caller 가 useRef + useEffect 안 함). PR-E5/E6/E7/E9 마이그 때 검증됨.

---

## § 3. 디자인 토큰 사용

### § 3.1 토큰 카테고리 우선순위 — ✅ PASS

semantic → recipe → variant → foundation 순서 일관.

### § 3.2 raw literal 금지 — ⚠️ PARTIAL

**raw hex 발견** (`src/components/`, `src/patterns/` 안):

| 파일:line | 값 | 정당? |
|---|---|---|
| `drawing-layer.tsx:58` | `previewColor = '#4a9eff'` | ⚠️ caller default fallback — `var(--ig-color-accent)` 로 변경 가능 |
| `drawing-layer.tsx:143` | `obj.color ?? '#4a9eff'` | ⚠️ 동일 |
| `drawing-layer.tsx:174,211,222` | `fill="#fff"` (handle inner dot) | OK — SVG handle 시각 표시, 토큰화 가치 낮음 |
| `drawing-layer.tsx:245,257` | `stroke={isSelected ? '#fff' : 'none'}` | OK — 동일 |
| `annotation-overlay.tsx:82` | `defaultColor = '#4d88ff'` | ⚠️ accent 토큰으로 변경 가능 |
| `annotation-overlay-interactive.helpers.tsx:8-10` | sample class colors | ✅ 데모 helper, OK |

**raw rgba 발견**:

| 파일 | 사례 |
|---|---|
| `table.tsx` | `rgba(255,255,255,0.08)` 등 — hover/dragging visual. tokenize 가치 있으나 SoT 명확 |
| `sidebar-shell.styles.ts:13` | `rgba(12,15,20,0.96)` linear-gradient bg — 토큰 후보 |
| `drawing-layer.tsx:104` | crosshair color `rgba(255,255,255,0.3)` — caller override 가능 |
| `annotation-overlay.tsx:129,131,155` | bbox stroke / point dim — fixed visual contrast |
| `progress.tsx:30-32` | shimmer stripe `rgba(255,255,255,0.06~0.24)` — animation specifc, accept |
| `annotation-toolbar.styles.ts` | toolbar bg, danger button bg | 토큰 후보 |

**조치 권장**:
- `previewColor` default, `defaultColor` (annotation-overlay) → `var(--ig-color-accent)` 매핑
- `sidebar-shell.styles.ts` gradient bg → semantic token
- `annotation-toolbar.styles.ts` 의 `rgba(0,0,0,0.45/0.55)` → `--ig-color-overlay-*` 토큰 신설

나머지 (SVG fill, animation overlay) 는 *legitimate* 사용.

---

## § 4. 시각·행동 표준

### § 4.1 애니메이션 (seamless loop) — ✅ PASS

ProgressBar 의 diagonal stripe shimmer 가 사용자 피드백 거쳐 seamless loop 보장 (`shift = period / sin(angle)`, period 20px / wave pattern). 다른 keyframe 애니메이션 (toast / 모달) 도 단일 cycle 또는 fade only.

### § 4.2 Disabled 상태 (명확 구분) — ❌ FAIL (1)

**controlField recipe** (`tokens/recipes/controls.ts`) — ✅ 규칙 준수:
```css
&:disabled {
  opacity: 0.5;
  cursor: not-allowed;
  border-style: dashed;
  background: var(--ig-color-surface-muted);
  color: var(--ig-color-text-soft);
}
```

**Button recipe** (`tokens/recipes/buttons.ts`) — ❌ 위반:
```css
&:disabled {
  opacity: 0.55;
  cursor: not-allowed;
}
```
→ dashed border + surface-muted + text-soft 누락. BUILDING_UI.md § 4.2 "약한 변화 안 됨" 위반.

**UploadDropzone** — ✅ 준수 (stripes + opacity 0.6 + dashed border).
**SelectableListItem** — opacity 처리만, dashed/bg 없음 ⚠️

**조치 권장**: Button recipe 에 BUILDING_UI § 4.2 규칙 적용 (border-style dashed + surface-muted bg).

### § 4.3 Focus 상태 — ⚠️ PARTIAL

**controlField recipe** — ✅ 준수:
```css
&:focus-visible {
  outline: 2px solid var(--ig-color-accent-ring);
  outline-offset: -2px;
  box-shadow: var(--ig-shadow-focus-ring);
  background: var(--ig-color-surface-focus);
}
```

**Button recipe** — ❌ **focus-visible 없음**. Button/IconButton 사용 시 키보드 focus indicator 누락 — a11y 영향 큼.

styled.button 총 28 파일 중 `:focus-visible` 적용 5 파일. 나머지 23 파일은 button recipe 가 적용되더라도 recipe 자체에 focus-visible 없으므로 적용 안 됨.

**조치 권장**: button recipe (buttonPrimary/Secondary/Accent/Danger) 에 `:focus-visible` 추가 — 1 곳 수정으로 28 컴포넌트 일괄 적용.

### § 4.4 Hover 상태 — ✅ PASS

`transition: ... var(--ig-motion-fast)` 사용 표준화. `transform: scale(1.5)` 같은 큰 변화 없음.

### § 4.5 Loading 상태 — ✅ PASS

Spinner / Skeleton / ProgressBar / LoadingState 모두 export됨. governance § 11.2 의 indeterminate escape hatch 도 명문화됨.

---

## § 5. Accessibility

### § 5.1 aria-label / role — ✅ PASS

샘플 검증:
- IconButton: `aria-label` 강제 (default `'Action'`, prop required)
- ImageViewerToolbar: `role="toolbar"`, 각 버튼 aria-label
- SelectionActionBar: `role="toolbar"`
- Spinner: aria-label 옵션
- Toast CloseButton: aria-label="Dismiss"

### § 5.2 Portal 사용 — ✅ PASS

`createPortal` 사용:
- DatePickerField
- DropdownSelect
- SelectField

dropdown menus 모두 portal → ancestor `overflow: hidden` 영향 차단.

### § 5.3 키보드 nav / Escape — ⚠️ PARTIAL

DialogShell / ConfirmDialog 에서 Escape 처리 확인 필요 (별도 검증 미완). useConfirm 등 imperative API 는 portal 안 자체 처리.

→ 추가 audit 거리: DialogShell 의 Escape 키 handler 명시 검증.

---

## § 6. 컴포지션 패턴 — ✅ PASS

§ 1.3 와 중복. slot / render prop / compound 모두 적용 사례 확인됨.

---

## § 7. 파일 구조

### § 7.1 파일 < 200 줄 — ⚠️ PARTIAL

> 200 줄 파일:

| 파일 | 줄수 | 사유 |
|---|---|---|
| `hooks/useDrawingCanvas.ts` | 336 | 복잡 hook — split 검토 |
| `components/data-display/table.tsx` | 283 | draggable rows 포함 — split 가능 |
| `components/data-display/drawing-layer.tsx` | 267 | SVG bbox/point/handle 렌더 — split 가능 |
| `components/inputs/date-picker.tsx` | 227 | calendar grid + portal — split 가능 |
| `tokens/globals/token-css-variables.ts` | 213 | 데이터 파일 — FILE_RULES § Allowed Exceptions ✅ |
| `components/inputs/mention-textarea.tsx` | 212 | @ 멘션 핸들링 — 검토 |

→ tokens/globals 제외 5 파일 split 검토.

### § 7.2 Named export only — ✅ PASS

src 본체 `export default` **0건**. stories 안 `export default meta` 만 존재 (Storybook 요구사항, 정당).

### § 7.3 *.styles.ts 분리 — ✅ PASS

복잡 컴포넌트는 styles 분리: sidebar-shell.styles.ts, annotation-toolbar.styles.ts, vertical-tabs.styles.ts, labeling-canvas.styles.ts, media-dialog-shell.styles.ts.

---

## § 8. Storybook 커버리지

### § 8.1 모든 export 는 story — ✅ PASS

90 stories 존재. patterns 의 경우 `src/patterns/*` 가 아닌 `stories/patterns/` 에 위치 (별도 위치):
- LabelingCanvas, Dashboard Grid, SidebarShell, Overlay Blocks, MediaDialogShell, Form Sections, AnnotationToolbar, Shell And Layouts, Workspace Blocks ✓

components 의 stories 는 adjacent (`*.stories.tsx`). missing 없음.

### § 8.2 a11y.test: 'error' — ✅ PASS

**모든 stories 파일에 a11y 설정** (검증). 빌드 시 a11y 위반은 실패.

### § 8.3 시나리오 cover — ⚠️ 부분 검증 (수동 sampling)

DropdownSelect / UploadDropzone story 의 Disabled 시나리오 확인됨 (사용자 피드백 후 강화). 다른 컴포넌트 story 도 default + variant + disabled 시나리오 보유 추정 — 전수 검증 미완.

---

## § 9. Test 커버리지 — ⚠️ PARTIAL

35 test 파일 / 92 components+patterns+hooks ≈ **38%** 커버리지.

**Test 있음**:
- Hooks: useClipboard, useSelection, useUndoRedo, useZoomPan (4/8 = 50%)
- inputs: Checkbox*, NumberField, MentionTextarea, ModeSwitcher, RadioCardGroup, SearchField, UploadDropzone, FormSection, FilterPopover (≈11)
- feedback: Alert, Badge, EmptyState, SelectionActionBar, Spinner, StepIndicator, a11y (≈7)
- data-display: ChipGroup, ColorSwatch, CommentThread, DrawingLayer, ImageGrid, ImageViewer, ImageViewerToolbar, InfoRow, KeyboardShortcutHint, ResizablePanel, SelectableListItem, TagList, VirtualizedImageGrid, use-grid-selection (≈14)

**Test 없음** (notable):
- TextField, PasswordField, TextareaField, DatePickerField, SelectField, DropdownSelect, FileInput, MentionTextarea — 일부 only
- Tabs, VerticalTabs, Breadcrumbs, Pagination, Stepper — navigation 전체
- DialogShell, ConfirmDialog, useConfirm, SettingsDialog, MenuPopover, Tooltip — overlays 대부분
- ToastProvider / useToast
- ALL patterns (AppShell, SidebarShell, MediaDialogShell, AnnotationToolbar, LabelingCanvas)
- ALL charts

**조치 권장**: critical interactive (DialogShell / Tabs / SelectField / DropdownSelect / Toast) interaction test 추가.

---

## § 10. Backward Compatibility — N/A (process)

릴리즈 노트 / deprecation 추적은 별도 — 자동 audit 불가.

---

## § 11. Domain Escape Hatch — ✅ PASS (documented)

BUILDING_UI § 11 에 명시. governance.md § 6 거부 명단도 동기. *문서화는 완료*, 실제 case-by-case 적용은 코드 review 단위.

---

## 액션 아이템 (우선순위 + 진행 상태)

| 우선 | 항목 | 위치 | 효과 | 상태 |
|---|---|---|---|---|
| **🔴 high** | Button recipe 에 `:focus-visible` 추가 | `tokens/recipes/buttons.ts` | 28 button 컴포넌트 키보드 a11y 한번에 해결 | ✅ `2319cf4` |
| **🔴 high** | Button recipe 에 BUILDING_UI § 4.2 disabled 패턴 (dashed + surface-muted) | `tokens/recipes/buttons.ts` | Button disabled 시각 명확화 | ✅ `2319cf4` |
| **🟡 med** | `previewColor` / `defaultColor` raw hex → `var(--ig-color-accent)` | drawing-layer.tsx, annotation-overlay.tsx | semantic 토큰 통합 | ✅ `2319cf4` |
| **🟡 med** | Button / Switch / Radio 에 forwardRef 추가 | inputs/button.tsx, toggles.tsx | DOM 핸들 caller 지원 | ✅ `2319cf4` |
| **🟡 med** | Overlay rgba → `--ig-color-overlay-*` / `sidebar-bg-*` / `danger-soft-surface` 토큰 신설 | annotation-toolbar.styles.ts, sidebar-shell.styles.ts, tokens/globals | 토큰 일관성 | ✅ 본 commit |
| **🟢 low** | DialogShell Escape 키 + `role="dialog"` + `aria-modal` | overlays/dialog-shell.tsx | a11y 강화 | ✅ 본 commit |
| **🟢 low** | drawing-layer split (267 → 153+167+24) | drawing-layer.tsx/.renderers/.constants | governance § 7.1 | ✅ 본 commit |
| **🟢 low** | date-picker / mention-textarea / table / useDrawingCanvas split | 각 파일 | governance § 7.1 | ⏳ **별건 PR defer** (complex refactor) |
| **🟢 low** | navigation / overlays / patterns / charts interaction test 추가 | 각 파일 | test 커버리지 38% → 60%+ | ⏳ **별건 PR defer** |

---

## 정기 audit

- 분기 1회: 본 보고서 갱신 + 신규 컴포넌트 BUILDING_UI 준수 검증
- 매 minor 릴리즈 전: § 4.2 / § 4.3 / § 8 자동 grep 통과 확인

마지막 업데이트: 2026-05-11.
