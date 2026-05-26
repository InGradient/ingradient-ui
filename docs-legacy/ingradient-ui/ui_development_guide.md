# UI Development Guide

- 문서명: UI Development Guide
- 목적: @ingradient/ui를 사용하는 모든 프로젝트에서 지켜야 하는 UI 개발 규칙을 정의한다.
- 적용 범위: @ingradient/ui 및 이를 소비하는 모든 프로젝트
- 상태: Draft
- Owner: Dev
- 마지막 수정일: 2026-03-30

---

## 1. 토큰 우선 원칙

### 규칙

스타일을 작성할 때 raw 값(hex, px, rgba)을 직접 쓰지 않는다. `@ingradient/ui`의 토큰을 사용한다.

### 이유

토큰을 사용해야 테마 변경, 다크/라이트 모드, 일관된 시각 리듬이 가능하다. raw 값을 흩뿌리면 디자인 변경 시 전체 코드를 찾아 바꿔야 한다.

### 적용 패턴

| 용도 | 사용 | 사용하지 않음 |
|------|------|---------------|
| 색상 | `var(--ig-color-text-primary)` | `#fff`, `rgba(255,255,255,0.8)` |
| 간격 | `var(--ig-space-7)` | `16px`, `1rem` |
| 폰트 크기 | `var(--ig-font-size-md)` | `14px` |
| 반지름 | `var(--ig-radius-md)` | `8px` |
| 그림자 | `var(--ig-shadow-md)` | `box-shadow: 0 2px 8px ...` |
| z-index | `var(--ig-z-modal)` | `z-index: 1200` |

### 예외

`border-width`, `outline-offset` 같은 장식 요소는 `1px`, `2px` 등 px 값을 직접 사용해도 된다.

---

## 2. 컨트롤 높이 통일

### 규칙

같은 행에 나란히 놓이는 인터랙티브 요소(Button, TextField, Select 등)는 동일한 높이를 사용한다. `--ig-control-height-*` 토큰으로 통일한다.

### 토큰

| 이름 | 값 | 용도 |
|------|-----|------|
| `--ig-control-height-sm` | 32px | 밀집 UI, 테이블 인라인 |
| `--ig-control-height-md` | 36px | 기본 폼, 대부분의 UI |
| `--ig-control-height-lg` | 44px | 강조 액션, 터치 친화적 |

### 적용 대상

- `Button` (sm/md/lg) — height를 토큰으로 지정
- `TextField`, `Select` — `controlField` recipe에서 `height: var(--ig-control-height-md)` 적용
- 커스텀 Select, 드롭다운 트리거 — 같은 토큰 사용

### 이유

Button이 34px인데 TextField가 48px이면 같은 행에서 높이가 어긋나서 시각적 통일감이 깨진다. 하나의 토큰으로 높이를 맞추면 어떤 조합이든 정렬이 보장된다.

---

## 3. 컴포넌트 사용 순서

### 규칙

UI를 구성할 때 아래 순서로 찾는다. 상위에서 해결되면 하위로 내려가지 않는다.

1. **patterns** — AppShell, SplitLayout, SettingsShell 등 화면 골격
2. **components** — Button, TextField, Badge, DialogShell, Table 등 범용 컴포넌트
3. **primitives** — Stack, Inline, surface mixin 등 저수준 빌딩 블록
4. **커스텀 styled-components** — 위에서 해결할 수 없는 경우에만

### 금지

- `@ingradient/ui`에 있는 컴포넌트를 커스텀으로 재구현하지 않는다 (모달, 확인 다이얼로그, 알림 등)
- internal path (`@ingradient/ui/src/...`)를 import하지 않는다. public export만 사용한다

---

## 4. 모달 / 오버레이

### 규칙

- 모달은 `DialogShell` 또는 `ConfirmDialog`를 사용한다
- 위험 확인은 `ConfirmDialog`에 `danger` prop을 사용한다
- 커스텀 backdrop을 만들지 않는다 — `ModalBackdrop`이 올바른 배경색(`--ig-color-modal-backdrop`)과 z-index를 보장한다
- 탭이 있는 모달에서 탭 전환 시 모달 높이가 요동치지 않아야 한다 — `DialogShell`은 ModalCard(flex column) + DialogContent(flex:1, overflow-y:auto) 구조로 헤더는 고정되고 콘텐츠만 내부 스크롤된다

### DialogShell로 부족한 경우

`ModalBackdrop` + `ModalCard` primitive를 직접 조합하되, 반드시:

1. `ModalBackdrop` 사용 (배경색, z-index 일관성)
2. `ModalCard`의 `max-height: calc(100dvh - 48px)` + `display: flex; flex-direction: column`
3. 콘텐츠 영역에 `flex: 1; min-height: 0; overflow-y: auto`
4. 배경 클릭 시 닫기

---

## 5. 드롭다운 / 폼 컨트롤

### 규칙

- 네이티브 `<select>`를 사용하지 않는다. `DropdownSelect` 컴포넌트를 사용한다
- 네이티브 `<input type="checkbox">`를 사용하지 않는다. `Checkbox` 컴포넌트를 사용한다. 전체 선택 등 부분 선택이 필요하면 `indeterminate` prop을 사용한다
- 숫자 입력은 `NumberField` 컴포넌트를 사용한다 (커스텀 스피너 포함)
- 네이티브 `<input type="date">`를 사용하지 않는다. `DatePickerField` 컴포넌트를 사용한다

### 이유

네이티브 폼 컨트롤은 OS/브라우저마다 렌더링이 다르고, 다크 테마에서 스타일 제어가 불가능하다. `@ingradient/ui` 컴포넌트는 테마 토큰을 따르고 모든 브라우저에서 동일하게 보인다.

### 드롭다운 주의사항

- 메뉴 최소 너비(160px)가 보장된다 — 트리거가 좁아도 옵션이 잘리지 않는다
- 옵션 텍스트는 `white-space: nowrap`으로 한 줄을 유지한다
- 메뉴가 뷰포트를 넘으면 위로 열린다 (자동 감지)

---

## 6. 레이아웃

### 규칙

- 전체 높이 레이아웃은 `100dvh`를 사용한다 (`100vh` 금지)
- Grid/Flex 자식에서 `overflow` 를 사용할 때 `min-height: 0`을 함께 지정한다
- 고정 너비 대신 `min(고정값, 100%)`를 사용한다

### dvh fallback 패턴

```css
height: 100vh;
@supports (height: 100dvh) { height: 100dvh; }
```

### Grid overflow 패턴

```css
.shell {
  display: grid;
  grid-template-columns: 220px 1fr;
  height: 100dvh;
  overflow: hidden;
}
.sidebar, .main {
  min-height: 0;
  overflow-y: auto;
}
```

### 이유

- `100vh`는 모바일 브라우저에서 주소표시줄을 포함한 높이라 실제 화면보다 크다
- CSS Grid/Flex의 기본 `min-height: auto`가 overflow를 무시하고 부모를 확장시킨다

---

## 7. Breakpoint

### 규칙

매직 넘버 대신 `@ingradient/ui`의 breakpoint 토큰을 사용한다.

### 토큰

| 이름 | 값 | 의미 |
|------|-----|------|
| sm | 640px | 모바일 → 태블릿 |
| md | 768px | 태블릿 → 소형 데스크탑 |
| lg | 1024px | 소형 → 일반 데스크탑 |
| xl | 1280px | 일반 → 와이드 |

### 사용 패턴

```typescript
import { breakpoints } from '@ingradient/ui/tokens'

const media = {
  sm: `@media (max-width: ${breakpoints.sm}px)`,
  md: `@media (max-width: ${breakpoints.md}px)`,
  lg: `@media (max-width: ${breakpoints.lg}px)`,
  xl: `@media (max-width: ${breakpoints.xl}px)`,
}
```

### 레이아웃 전환 가이드

| breakpoint | 사이드바 | 테이블 | 모달 |
|------------|----------|--------|------|
| xl (1280+) | 펼침 | 기본 | 중앙 카드 |
| lg (1024+) | 접힘 가능 | 기본 | 중앙 카드 |
| md (768+)  | drawer/overlay | 수평 스크롤 | 거의 full-width |
| sm (640-)  | drawer/overlay | 카드 형태 | full-screen |

---

## 8. 터치 타겟

### 규칙

인터랙티브 요소의 터치 영역은 **최소 44x44px**을 확보한다.

### 이유

- Apple HIG: 최소 44pt
- Material Design: 최소 48dp
- WCAG 2.5.8: 44x44 권장

### 적용 패턴

시각적 크기가 작더라도 `padding`, `min-height`, 또는 `::after` pseudo-element로 터치 영역을 확보한다.

```css
.small-button {
  font-size: 12px;
  padding: 4px 8px;
  min-height: 44px;
  display: inline-flex;
  align-items: center;
}
```

---

## 9. 단위

| 용도 | 단위 | 이유 |
|------|------|------|
| 폰트 크기 | `rem` 또는 `--ig-font-size-*` | 시스템 폰트 크기 존중 |
| 간격/패딩 | `--ig-space-*` | 일관된 리듬 |
| border, shadow | `px` | 장식은 스케일링 불필요 |
| 뷰포트 높이 | `dvh` | §4 참조 |
| 컨테이너 너비 | `min(고정, 100%)` | 작은 화면 대응 |

---

## 10. 색상과 테마

### 규칙

- 색상은 반드시 CSS 변수(`--ig-color-*`)를 사용한다
- `rgba()`, hex 값을 컴포넌트에 직접 쓰지 않는다
- 새로운 색상이 필요하면 토큰 레이어에 먼저 추가한다

### 이유

다크/라이트 모드, 향후 테마 변경 시 CSS 변수 값만 바꾸면 전체 UI가 전환된다. 하드코딩된 색상은 전환되지 않는다.

### 대표 시맨틱 변수

| 변수 | 용도 |
|------|------|
| `--ig-color-text-primary` | 주요 텍스트 |
| `--ig-color-text-secondary` | 보조 텍스트 |
| `--ig-color-text-muted` | 비활성/힌트 텍스트 |
| `--ig-color-bg-canvas` | 페이지 배경 |
| `--ig-color-surface-panel` | 패널/카드 배경 |
| `--ig-color-surface-raised` | 떠 있는 표면 (모달 등) |
| `--ig-color-border-subtle` | 기본 구분선 |
| `--ig-color-accent` | 브랜드/강조 색상 |
| `--ig-color-success` / `warning` / `danger` | 상태 피드백 |
| `--ig-color-modal-backdrop` | 모달 배경 오버레이 |

---

## 11. 접근성

### 규칙

- 인터랙티브 요소에 `:focus-visible` 스타일을 유지한다. `outline: none`으로 제거하지 않는다
- 이미지에 `alt` 텍스트를 제공한다. 장식용이면 `alt=""`
- 색상만으로 정보를 전달하지 않는다 (색맹 사용자). 아이콘이나 텍스트를 병행한다
- 폼 요소에 연결된 `<label>`을 제공한다
- 모달이 열릴 때 포커스가 모달 안으로 이동하고, 닫히면 트리거로 돌아간다

---

## 12. 성능

### 규칙

- `@ingradient/ui`에서 필요한 것만 import한다. barrel import(`import * from`) 사용 금지
- 이미지에 `loading="lazy"` 기본 적용
- 큰 리스트(100+ 행)는 virtualization 고려
- CSS-in-JS에서 런타임 동적 스타일을 과도하게 생성하지 않는다. CSS 변수나 `$prop` 패턴 사용

---

## 13. 네이밍과 구조

### 규칙

- styled-components 네이밍: PascalCase (`PageHeader`, `SidebarLink`)
- CSS 변수 참조 시 fallback 값을 넣지 않는다 — `IngradientGlobalStyle`이 정의를 보장한다
- 한 파일에 5개 이상의 styled-component를 정의하면 `styles.ts`로 분리한다
- 컴포넌트 파일은 200줄 미만을 유지한다

```css
/* 좋음 */
color: var(--ig-color-text-primary);

/* 나쁨 — 불필요한 fallback이 토큰 변경을 가릴 수 있음 */
color: var(--ig-color-text-primary, #ffffff);
```

---

## 14. 이미지와 미디어

- `max-width: 100%`를 기본 적용한다
- 고정 너비/높이 대신 `aspect-ratio`를 사용한다
- 모바일 네트워크를 고려하여 `loading="lazy"` 기본 적용한다

---

## 15. @ingradient/ui 자체 개선 과제

| 항목 | 현재 상태 | 개선 방향 |
|------|-----------|-----------|
| ~~breakpoint helper~~ | ~~JS 토큰만 존재~~ | 완료: `media` helper export (`@ingradient/ui/tokens`) |
| ~~ModalCard max-height~~ | ~~`100vh` 사용~~ | 완료: `100dvh` + fallback 적용 |
| 터치 타겟 | 일부 컴포넌트만 적용 | 전 컴포넌트 min-height 44px 보장 |
| 반응형 테이블 | 미제공 | `ResponsiveTable` 컴포넌트 |
| AppShell | 소비자가 직접 구현 | 사이드바 자동 접힘/drawer 전환 패턴 |
| 뷰포트 높이 변수 | 미제공 | `--ig-viewport-height` JS 주입 |
| 라이트 모드 | 다크 모드만 지원 | 시맨틱 토큰 기반 라이트 테마 추가 |

## 관련 문서

- `features/design_tokens.md` — 토큰 레이어 구조
- `features/generic_components.md` — 범용 컴포넌트 목록과 추출 기준
- `features/reusable_patterns.md` — 재사용 패턴 범위
- `architecture.md` — 내부 레이어 구성
