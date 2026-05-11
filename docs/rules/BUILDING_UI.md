# Building ingradient-ui

ingradient-ui 를 *UI framework library* 로 유지하기 위한 작업 규칙. 새 컴포넌트를 추가하거나 기존 것을 확장할 때 이 문서를 기준으로 한다.

**관련 문서**:
- [governance.md](../governance.md) — *무엇이* ui 에 들어가고 *무엇이* 프로젝트 components 에 남는가
- [FILE_RULES.md](./FILE_RULES.md) — 파일 단위 (줄수 / 네이밍 / export) 규칙
- [reference/cheat-sheet.md](../reference/cheat-sheet.md) — 현재 사용 가능한 모든 export 색인

이 문서는 **컴포넌트 API + 시각/행동 표준** 에 초점.

---

## 1. 핵심 원칙

### 1.1 단일 진실 (Single Source of Truth)
- **색**: CSS 변수 `--ig-color-*` 만 사용. raw hex / rgba 금지 (`tokens/foundations` 또는 `tokens/semantic`).
- **공간**: `var(--ig-space-N)` 만 사용. 8px / 12px 같은 magic number 금지.
- **라디우스**: `var(--ig-radius-{xs,sm,md,lg,xl,2xl,pill})`.
- **폰트**: `var(--ig-font-size-{xs,sm,md,lg,xl,2xl})`.
- **모션**: `var(--ig-motion-fast)` 등 토큰. `0.15s ease` 직접 X.

### 1.2 도메인 무관 (Domain-agnostic)
- prop 타입에 `Dataset`, `Project`, `User` 같은 도메인 model 명 직접 등장 금지.
- generic shape (`{ id, name, color? }`) 또는 `unknown` callback 사용.
- 비즈니스 로직 (api / store / mutation) 금지.

### 1.3 컴포저블 (Composable over configurable)
- 옵션 폭증 대신 **slot / render prop** 으로 확장.
- ❌ `actions={['copy', 'edit', 'delete']}` (정해진 set)
- ✅ `actions?: ReactNode` (caller 가 구성)

### 1.4 합리적 기본값 (Sensible defaults)
- prop 미지정 시 가장 단순한 동작.
- 예: `size = 'md'`, `variant = 'solid'`, `tone = 'default'`.

---

## 2. Component API 컨벤션

### 2.1 네이밍

| 카테고리 | 패턴 | 예 |
|---|---|---|
| Input | `XxxField` | TextField, NumberField, SearchField, SelectField |
| Trigger | `XxxButton` | Button, IconButton, CopyButton |
| Display row | `XxxRow` | InfoRow, SearchResultRow, SelectableListItem |
| Card-style | `XxxCard` | StatCard, PreviewCard, LineChartCard |
| Layout | `XxxShell` / `XxxLayout` | AppShell, SidebarShell, SplitLayout |
| Overlay | `XxxDialog` / `XxxPopover` | DialogShell, ConfirmDialog, FilterPopover |
| Pattern | 도메인-중립 합성 | AnnotationToolbar, LabelingCanvas |

### 2.2 표준 props

**모든 컴포넌트** — props < 5 권장. 더 필요하면 split 검토.

| Prop | 타입 | 의미 |
|---|---|---|
| `variant` | string union | 디자인 분기 (`'solid' \| 'secondary' \| 'accent'`) |
| `size` | `'sm' \| 'md' \| 'lg'` | 크기. 항상 3-tier 권장 |
| `tone` | `'default' \| 'danger' \| ...` | semantic 색조. variant 와 직교 |
| `disabled` | boolean | 비활성 상태 (시각적으로 명확히 구분 — § 4.2 참조) |
| `loading` | boolean | 로딩 중. Skeleton 또는 Spinner 표시 |
| `className` / `style` | standard | caller 의 layout 적응 |

### 2.3 prop 명명 규칙

- **이벤트**: `onXxx` (`onClick`, `onChange`, `onClose`).
- **boolean state**: `is/has` 없이 평서 (`open`, `disabled`, `selected`, `loading`).
- **render slot**: `renderXxx?: (item) => ReactNode` 또는 `xxxNode?: ReactNode`.
- **styled-components transient props**: `$xxx` prefix (DOM 으로 안 흘러가게).

### 2.4 controlled vs uncontrolled

기본 **controlled** (value + onChange 명시). uncontrolled (defaultValue) 는 secondary.

```tsx
// ✅ 권장 — controlled
<TextField value={query} onChange={(e) => setQuery(e.target.value)} />

// ⚠️ 허용 — uncontrolled 도 지원하지만 controlled 가 1st
<TextField defaultValue="hello" />
```

### 2.5 forwardRef

DOM 핸들이 의미 있는 컴포넌트는 `forwardRef`:
- TextField, Checkbox, SelectableListItem, IconButton 등
- caller 가 focus / scroll / measure 가능

### 2.6 indeterminate / partial state

체크박스, 진행률 등 *bool 이 부족* 한 경우 별도 prop:
```tsx
<Checkbox indeterminate={isPartial} checked={isAllSelected} />
```

caller 가 useRef + useEffect 로 native indeterminate 설정하지 않도록 컴포넌트 안에서 처리.

---

## 3. 디자인 토큰 사용

### 3.1 토큰 카테고리

| 카테고리 | 위치 | 사용 |
|---|---|---|
| **Foundation** | `tokens/foundations` | raw 단위 (`--ig-color-blue-500`, `--ig-space-1`) |
| **Semantic** | `tokens/semantic` | 의미 (`--ig-color-accent`, `--ig-color-text-primary`) |
| **Recipe** | `tokens/recipes` | CSS mixin (`controlField`, `surfaceCard`, `appShell`) |
| **Variant** | `tokens/variants` | 토큰 map (`buttonPrimary`, `chartPalette`) |

**컴포넌트 안에서 우선 순위**: semantic → recipe → variant → foundation.

### 3.2 raw literal 금지

```tsx
// ❌
background: #181818;
padding: 12px 14px;
border-radius: 6px;

// ✅
background: var(--ig-color-surface-raised);
padding: var(--ig-space-5) var(--ig-space-6);
border-radius: var(--ig-radius-sm);
```

예외: viewport ratio (`vh`, `dvh`), animation timing (`1.2s linear infinite`) 같은 본질적으로 단위 의존 값.

---

## 4. 시각/행동 표준

### 4.1 애니메이션

- **연속 흐름이 필요한 패턴 (스피너 / shimmer / 진행률 bar)**: 한 cycle 의 시작과 끝이 **픽셀-perfect 일치** 해야 함. seamless loop.
  - 예: ProgressBar 의 diagonal stripe shimmer 는 `shift = period / sin(angle)` 로 정확히 한 주기 시프트.
- **focus / hover transition**: `var(--ig-motion-fast)` (~150ms).
- **width / height 변화**: `transition: width 0.25s ease` 등 단순 ease.

### 4.2 Disabled 상태

비활성 상태는 **명확히** 구분되어야 — opacity 만으로 부족.

```css
&:disabled {
  opacity: 0.5;
  cursor: not-allowed;
  border-style: dashed;        /* dashed border = "interactive 가 막혀있음" 시각 신호 */
  background: var(--ig-color-surface-muted);
  color: var(--ig-color-text-soft);
}
```

dropzone / panel 같은 large surface 는 `repeating-linear-gradient` 줄무늬 배경 추가 가능 (`UploadDropzone` 참조).

**금지**: opacity 0.8 같은 약한 변화. "거의 활성과 같아 보임" 안 됨.

### 4.3 Focus 상태

```css
&:focus-visible {
  outline: 2px solid var(--ig-color-accent-ring);
  outline-offset: -2px;
  box-shadow: var(--ig-shadow-focus-ring);
}
```

키보드 nav 가능 컴포넌트는 모두 focus indicator 필수. `outline: none` 절대 금지.

### 4.4 Hover 상태

- background tint 변화 (`var(--ig-color-surface-interactive-hover)`).
- 변형은 `transition: background var(--ig-motion-fast)`.
- `transform: scale(1.1)` 같은 큰 변화 지양.

### 4.5 Loading 상태

| 상황 | 컴포넌트 |
|---|---|
| 짧은 비동기 (버튼 클릭 등) | `<Spinner />` |
| 데이터 페치 placeholder | `<Skeleton $height="..." />` |
| 결정적 진행률 (0~100%) | `<ProgressBar value={pct} />` |
| 불확정 진행 (시간 모름) | local custom (ui ProgressBar 는 determinate 만) |
| 전체 페이지 / 큰 영역 | `<LoadingState>...</LoadingState>` |

---

## 5. Accessibility

- **aria-label 필수**: 시각 텍스트 없는 IconButton, Spinner, ProgressBar 등.
- **키보드 nav**: tab order 자연스러움, Enter/Space 로 activate, Escape 로 close.
- **role**: 의미 있는 role 부여 (`role="dialog"`, `role="status"`, `role="listbox"`).
- **portal**: dropdown / popover 는 `document.body` 에 portal — ancestor `overflow: hidden` 영향 차단.

---

## 6. 컴포지션 패턴

### 6.1 Slot 패턴

복잡한 컴포넌트는 *slot* 으로 caller 가 채움:
```tsx
<DialogShell
  title="..."
  actions={<><Button>Cancel</Button><Button variant="accent">OK</Button></>}
>
  {body}
</DialogShell>
```

### 6.2 Render prop

도메인 별 렌더링은 callback 으로:
```tsx
<Table<Row>
  columns={[
    { key: 'name', header: 'Name', render: (r) => r.name },
    { key: 'tone', header: 'Status', render: (r) => <Badge $tone={r.tone}>{r.status}</Badge> },
  ]}
  rows={rows}
/>
```

### 6.3 Compound 컴포넌트

연관 group 은 `Parent + Parent.Child` 패턴 또는 export 묶음:
```tsx
<CommentThread>
  <CommentItem author="..." timestamp="..." body="..." />
  <CommentItem ... />
</CommentThread>
```

---

## 7. 파일 구조

[FILE_RULES.md](./FILE_RULES.md) 참조. 핵심:
- 파일 < 200줄
- named export only (default 금지)
- `*.styles.ts` 분리 권장
- `index.ts` 는 layer barrel만

### 7.1 layer 구조

```
src/
├── tokens/        — 디자인 토큰 (foundations / semantic / recipes / variants)
├── primitives/    — CSS recipe (surfaceCard, surfacePanel, appShell, controlField, button*)
├── hooks/         — generic hooks (useClickOutside, useZoomPan, useUndoRedo 등)
├── components/    — 단일 컴포넌트 (inputs / feedback / navigation / overlays / data-display / charts / icons)
└── patterns/      — 컴포넌트 합성 패턴 (shells / page / layouts)
```

상위 layer 는 하위 layer 만 import. `components/` 가 `patterns/` import 금지.

---

## 8. Storybook 커버리지

### 8.1 모든 export 는 story 필수

`*.stories.tsx` 없는 public 컴포넌트는 **불완전한 API** 로 본다.

### 8.2 story 구성

```tsx
const meta = {
  title: 'Components/Inputs/MyComponent',
  component: MyComponent,
  tags: ['autodocs'],
  parameters: { layout: 'fullscreen', a11y: { test: 'error' } },
} satisfies Meta<typeof MyComponent>
```

`a11y.test: 'error'` 로 a11y 위반은 빌드 실패.

### 8.3 시나리오 필수 cover

| 시나리오 | 의무 |
|---|---|
| Default | ✅ |
| Each `variant` | ✅ |
| Disabled | ✅ |
| Loading (해당 시) | ✅ |
| Empty state (해당 시) | ✅ |
| Long content (overflow 대응) | ⚠️ 권장 |
| Interactive demo (제어형) | ⚠️ 권장 |

### 8.4 StorybookCard / Grid / Section / Page

레이아웃은 `@storybook-support/storybook-layout` 패키지의 `StorybookPage` / `StorybookSection` / `StorybookGrid` / `StorybookCard` 사용 — story 간 일관성.

---

## 9. Test

- **단순 컴포넌트** (Badge, Spinner 등): a11y + render snapshot only.
- **상호작용 컴포넌트** (Checkbox, useDrawingCanvas 등): vitest + `@testing-library/react` interaction test.
- **복잡 layout / virtualization** (VirtualizedImageGrid): unit test + visual regression (Storybook + chromatic).

---

## 10. Backward Compatibility

### 10.1 API 변경

| 변경 종류 | 정책 |
|---|---|
| 새 optional prop 추가 | ✅ Always OK |
| 기존 prop 의 type 더 wide | ✅ OK |
| 기존 prop 의 type 더 narrow | 🚫 breaking — major version |
| 기존 prop rename | ⚠️ deprecation 경고 + 1 minor 유지 |
| 컴포넌트 export 제거 | 🚫 breaking — major version |

### 10.2 시각 변경

| 변경 | 정책 |
|---|---|
| Token 값 조정 (color / spacing) | ⚠️ design 합의 + 소비자 spot-check |
| 컴포넌트 default 크기 / padding 변경 | ⚠️ 소비자 영향 큼 — minor version + release note |
| 신규 variant 추가 | ✅ OK (기존 default 유지 시) |

### 10.3 Deprecated 표시

```tsx
/** @deprecated Use `EmptyState` from `empty-state` instead */
export const EmptyStateText = styled.div`...`
```

deprecated 도 즉시 삭제 X — 최소 1 minor 유지, release note 안내.

---

## 11. Domain Escape Hatch

ui 컴포넌트의 한계가 도메인 needs 와 충돌 시:

### 11.1 Threshold 색 / 조건부 색 분기

ui ProgressBar 는 brand accent gradient 만. 도메인 (CPU 사용량 90% = red) 색 분기는 **caller 가 직접**:
```tsx
// caller (consumer)
<ProgressBar value={cpu} />  // 기본 색
// 또는 직접 조건부 색이 필요하면 ui 대신 자체 styled 사용 (예: edge SystemMonitor GaugeFill)
```

ui 에 `color` prop 추가는 *시각 일관성* 깨짐 → 거부.

### 11.2 Indeterminate state

ui ProgressBar 는 determinate 만. 불확정 진행 (시간 모름) 은 caller 가 자체 keyframe — 예: edge ExportModal 의 indeterminate ProgressBar.

### 11.3 Custom layout

ui 컴포넌트 안에 caller-specific layout 이 필요하면:
1. ui 가 *slot* 제공 (`headerExtra`, `actions`, `footer` 등)
2. 또는 ui 컴포넌트들을 caller 가 조립 (Card + Table + Chart 등)
3. 또는 새 ui pattern 추가 (재사용 가능성 만족 시)

---

## 12. ui 가 부족할 때 의사결정

```
1. 작은 prop 1-2 개 추가로 해결 가능?
   → ui PR (작은 거리, 디자이너 합의)
2. 새 컴포넌트가 적절?
   → governance § 2.1 점검 후 ui PR
3. 한 프로젝트만의 도메인 needs?
   → 프로젝트 components/ 에 작성 (ui 조립 + 도메인 코드)
4. ui 컴포넌트를 5 줄 이하로 wrap 으로 충분?
   → 프로젝트의 *.styles.ts 에 styled() wrap
```

판단 기준은 [governance.md § 2.1 / § 3.1](../governance.md) 따른다.

---

## 13. Release & Versioning

- **patch (0.0.x)**: bug fix, deprecated 삭제 (사전 안내된 경우)
- **minor (0.x.0)**: 새 컴포넌트 / 새 prop / 시각 미세 조정
- **major (x.0.0)**: breaking API / 큰 디자인 변경

`docs/releases/` 에 release note 작성. 소비자 마이그 가이드 포함 권장.

---

## 14. Checklist — 새 컴포넌트 추가 전

작업 시작 전:
- [ ] [governance.md § 2.1](../governance.md) 추가 기준 충족?
- [ ] [reference/cheat-sheet.md](../reference/cheat-sheet.md) 에 비슷한 컴포넌트 없음?
- [ ] props ≤ 5, 도메인 무관 데이터 shape 확정?
- [ ] storybook 시나리오 미리 정해짐?

코드 작성:
- [ ] `tokens` / `primitives` / `recipes` 만 사용 (raw hex 0개)
- [ ] forwardRef (해당 시)
- [ ] aria-label / role / keyboard nav 처리
- [ ] disabled / loading / empty 상태 처리
- [ ] `*.styles.ts` 분리 (필요 시)

Storybook:
- [ ] Default + variants + disabled + loading + empty 모두 cover
- [ ] `a11y.test: 'error'` 활성화
- [ ] StorybookPage/Section/Grid/Card 사용

Test:
- [ ] `*.test.tsx` (단순 컴포넌트는 render + a11y)
- [ ] interaction test (state 있는 컴포넌트)

Docs:
- [ ] [reference/cheat-sheet.md](../reference/cheat-sheet.md) 갱신
- [ ] release note (해당 시)

---

마지막 업데이트: 2026-05-11.
