---
plan: PR-A4 — ui TextField size variant + platform wrap padding/font-size 제거
date: 2026-05-09
phase: 2
pr id: PR-A4
parent plan: ../components-audit-findings.md (§ 6)
master plan: ../../MASTER-PLAN.md (§ 9.1)
governance: ../../governance.md
estimated: 1h
---

# PR-A4 — ui TextField size variant

## 목표

ui `<TextField size="sm" | "md" | "lg" />` prop 추가. platform wrap 4개 (계획 5+ 였으나 audit 결과 4) 의 padding/font-size 부분 제거. layout 적응 (max-width, flex, margin) 만 caller wrap 유지 (governance § 3.1).

## audit (2026-05-09)

### platform 사용처 (4개)

| wrap | 파일 | 도메인 layout | size 거리 |
|---|---|---|---|
| `InfoNameInput` | classes/ClassInfoSidebarPanel | `max-width: 280px; &:disabled {...}` | padding 8/12 + font 14 (sm 근처) |
| `ClassSearchInput` | catalog/CatalogRightPanel | `width: 100%; placeholder color` | height 38 + padding 0/12 + font 13 (sm) |
| `FilterInput` | gallery/toolbar-styles | `flex: 1` | padding 6/8 + font 13 (sm) |
| `ModalInput` | classes/ClassPageOverlays | `margin-bottom: 16px` | padding 8/12 + font 13 (sm) |

→ 모두 **sm (compact)** size. caller 의 layout (max-width, flex, margin, placeholder color) 은 5줄 이하 — caller 유지 OK.

### edge 사용처

inline `<TextField>` 만 (wrap 없음). size prop 추가는 영향 X.

## 결정

### D1. size prop 형태

- **A (권장)** `size?: 'sm' | 'md' | 'lg'` (Button 패턴 일관)
- B. `compact?: boolean` (lg 변형 cover 못 함)

→ **권장 A**.

### D2. size 별 token 매핑

| size | height | padding | font-size |
|---|---|---|---|
| sm | `--ig-control-height-sm` | `0 var(--ig-space-4)` | `var(--ig-font-size-sm)` |
| md (default) | `--ig-control-height-md` (현재) | `0 var(--ig-space-5)` | `var(--ig-font-size-md)` |
| lg | `--ig-control-height-lg` | `0 var(--ig-space-6)` | `var(--ig-font-size-md)` |

token 이미 존재 (`--ig-control-height-sm/md/lg`).

### D3. textarea 의 size

textarea 는 height 가 자유 (rows 따라). size prop 적용 안 함. 또는 padding/font-size 만 적용. 일단 단순화: TextField 만 size 받음, TextareaField 는 그대로.

### D4. controlField recipe 변경 vs styled

- (a) `controlField` recipe 안에서 size prop 분기 — recipe 가 prop 받게 변경 (큰 거리)
- **(b) 권장** TextField 자체에서 size prop 받아 css override

```tsx
const sizeStyles = {
  sm: css`height: var(--ig-control-height-sm); padding: 0 var(--ig-space-4); font-size: var(--ig-font-size-sm);`,
  md: css``,  // default — controlField 사용
  lg: css`height: var(--ig-control-height-lg); padding: 0 var(--ig-space-6);`,
}

export const TextField = styled.input<{ $size?: 'sm' | 'md' | 'lg' }>`
  ${controlField}
  ${(p) => sizeStyles[p.$size ?? 'md']}
`
```

또는 React component 로 wrap (forwardRef + size prop → $size):

```tsx
export interface TextFieldProps extends React.InputHTMLAttributes<HTMLInputElement> {
  size?: 'sm' | 'md' | 'lg'
}
export const TextField = forwardRef<HTMLInputElement, TextFieldProps>(
  ({ size = 'md', ...rest }, ref) => <TextFieldRoot ref={ref} $size={size} {...rest} />
)
```

→ 권장: forwardRef component (input 의 native `size` attr 와 충돌 회피 — React component prop `size` 가 number 일 수 있음).

→ 실제: HTML input 의 `size` attr 은 width 표현. ui 의 `size` prop 과 의미 충돌. **`size` prop 명 충돌 방지 위해 component wrap 필수**.

PasswordField 도 동일 size prop 받게 갱신.

## 변경 파일

1. **`ui/src/components/inputs/text-fields.tsx`** — TextField 컴포넌트화 (forwardRef + size prop). PasswordField 도 size 받음.
2. **`platform/components/classes/ClassInfoSidebarPanel.styles.ts`** — `InfoNameInput` 의 padding/font-size 제거. caller 가 `<InfoNameInput size="sm">` 사용.
3. **`platform/components/catalog/CatalogRightPanel.styles.search.ts`** — 동일 (`ClassSearchInput`)
4. **`platform/components/gallery/toolbar/toolbar-styles.tsx`** — 동일 (`FilterInput`)
5. **`platform/components/classes/ClassPageOverlays.styles.ts`** — 동일 (`ModalInput`)

→ caller 에서 `<XInput size="sm" ...>` 로 사용. wrap 의 layout 조정만 유지.

## 변경 안 함

- TextareaField (size prop 없음)
- edge inline TextField (size 없으면 md default)
- 다른 controlField 사용 컴포넌트 (NumberField, SelectField 등) — 별도 거리

## 위험

- HTML `size` prop 과 충돌 — component wrap 으로 해결
- styled extend (`styled(TextField)`) 가 props 받음 — TextField 가 forwardRef 면 호환

## 검증

- ui typecheck + build
- platform typecheck
- 시각: 마지막 일괄

## 후속

- PR-A5: CheckboxGroup ui 추가
