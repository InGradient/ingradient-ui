---
title: PR-E0e — DropdownSelect / SelectField menu portal 렌더
date: 2026-05-10
parent: docs/plan/phase-5-components-audit.md
scope: ingradient-ui
status: planning — 사용자 review 대기
---

# PR-E0e — DropdownSelect / SelectField menu portal 렌더

## 1. 증상

ui Storybook DropdownSelect 의 "Variants" 등에서 trigger 클릭 시 menu 가 trigger 바로 아래가 아니라 *섹션 한참 아래* 에 표시. SelectField 도 동일 위치 calc 사용.

## 2. 근본 원인

[dropdown-shared.tsx:75-85](src/components/inputs/dropdown-shared.tsx#L75-L85):

```tsx
export const DropdownMenu = styled.div.attrs<...>(({ $layout }) => ({
  style: {
    left: `${$layout.left}px`,
    width: `${$layout.width}px`,
    ...
  },
}))<...>`
  position: fixed;
  z-index: var(--ig-z-popover);
  ...
`
```

[dropdown-layout.ts:15](src/components/inputs/dropdown-layout.ts#L15) 의 layout calc:
```ts
const rect = root.getBoundingClientRect()
...
top: rect.bottom + gap,
```

`getBoundingClientRect()` 는 viewport 기준 좌표 반환. `position: fixed` 도 *원칙적* 으로 viewport 기준. 두 값을 매칭해 사용하면 정상 동작해야 함.

**그런데 `position: fixed` 의 reference frame 은 ancestor 에 *containing block creator* 가 있으면 viewport 가 아닌 그 ancestor 가 됨**. 다음 CSS 속성이 ancestor 에 있으면 fixed 가 영향 받음:
- `transform` (any 값)
- `filter` (any 값)
- `backdrop-filter` (any 값)
- `contain: layout / paint / strict / content`
- `will-change: transform / filter`
- `perspective`

→ getBoundingClientRect 좌표 (실제 viewport) vs fixed reference (ancestor 원점) 사이 mismatch → menu 가 의도한 위치에서 한참 떨어진 곳에 표시.

Storybook iframe / 특정 caller 컨텍스트에서 위 속성 중 하나가 ancestor 에 있을 가능성. 정확한 원인 ancestor 추적보다 *ancestor 영향을 원천 차단* 하는 게 robust.

## 3. 해결 — `createPortal`

menu 를 document.body 에 직접 렌더 → ancestor CSS 영향 0 → fixed 가 viewport 기준 보장.

기존 [date-picker.tsx:214](src/components/inputs/date-picker.tsx#L214) 가 동일 패턴 사용 중. UI 일관성 측면에서도 적용 자연스러움.

## 4. dual ref pattern (close-on-click-outside)

현재 [dropdown-layout.ts:50](src/components/inputs/dropdown-layout.ts#L50):
```ts
if (!rootRef.current?.contains(event.target as Node)) onClose()
```

menu 가 DropdownRoot 의 자식 (DOM tree 안) 이라 menu 클릭이 contains 통과 → close 안 함.

**portal 후**: menu 가 document.body 자식. 위 check 만으로는 menu 클릭 시 *outside* 로 인식 → 즉시 close → option 선택 불가.

**fix**: date-picker 패턴 따라 `menuRef` 도 check.
[date-picker.tsx:175-178](src/components/inputs/date-picker.tsx#L175-L178):
```ts
if (!wrapRef.current?.contains(...) && !popoverRef.current?.contains(...))
```

## 5. 변경 파일

### A. `dropdown-layout.ts`
- `useDropdownLayout(rootRef, open, onClose)` → `useDropdownLayout(rootRef, menuRef, open, onClose)`
- handlePointerDown 내부 check: rootRef 또는 menuRef 둘 중 하나에 contains 면 outside 아님
- 기타 동일

### B. `dropdown-select.tsx`
- `import { createPortal } from 'react-dom'`
- `const menuRef = React.useRef<HTMLDivElement | null>(null)`
- `useDropdownLayout(rootRef, menuRef, open, ...)` 로 호출 변경
- menu 를 `createPortal(<DropdownMenu ref={menuRef} ...>...</DropdownMenu>, document.body)` 로 wrap

### C. `select-field.tsx`
- 동일 패턴 적용 (B 와 동일)

## 6. 영향 분석

**ui 단**:
- menu 위치 robust — 어떤 ancestor CSS 컨텍스트에서도 trigger 바로 아래 표시
- z-index 충돌 회피 효과 부수적 (body 직속이면 다른 portal-된 요소와만 stacking 비교)

**consumer**:
- platform / edge 의 DropdownSelect / SelectField 동작 정상화 (간헐적 위치 mismatch 가 있었다면 해소)
- click outside 동작 동일 (menuRef 추가 check)
- Escape 닫기 동작 동일

**잠재 회귀**:
- portal 후 menu 가 DOM tree 다른 위치 → CSS selector (`.parent .menu`) 안 깨짐 (현재 그런 selector 없음 — DropdownMenu 자체로 styled-components 내 scope)
- styled-components ThemeProvider context 는 React tree 따라 전파 → portal 해도 유지

## 7. 검증 절차

1. typecheck `npx tsc --noEmit`
2. ui storybook 시각:
   - DropdownSelect Variants story — Date preset trigger 클릭, menu 가 trigger 바로 아래 표시
   - SelectField stories — 동일
3. 기능 테스트:
   - menu option 클릭 → 선택 동작 정상
   - menu 외부 클릭 → 닫힘
   - Escape → 닫힘
   - resize / scroll → 위치 갱신
4. ui storybook tests `npm run test-storybook` — 102 tests pass
5. platform / edge 의 dropdown 사용처 spot-check

## 8. 위험

- 낮음. date-picker 가 이미 동일 패턴으로 운영 중 (선례 있음)
- dual ref 추가가 hook signature 변경 — useDropdownLayout 다른 caller 가 있는지 확인 필요 (grep 결과: dropdown-select / select-field 둘만 사용 — 안전)

## 9. 후속 거리 (scope 밖)

- FilterPopover 등 다른 popover 에 동일 portal 적용 거리 — 별도 sweep PR
