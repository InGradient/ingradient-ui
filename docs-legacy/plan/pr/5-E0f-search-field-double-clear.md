---
title: PR-E0f — SearchField double clear button 버그 fix
date: 2026-05-10
parent: docs/plan/phase-5-components-audit.md
scope: ingradient-ui
status: planning — 사용자 review 대기
---

# PR-E0f — SearchField double clear button fix

## 1. 증상

ui Storybook `Components / Inputs / SearchField` 에서 input 에 텍스트 입력 + 클릭 시 우측에 × 가 *두 개* 표시:
- 좌측 큰 ×: 컴포넌트 custom `<ClearBtn>` (의도)
- 우측 작은 ×: 브라우저 native `<input type="search">` clear button (의도 외)

## 2. 근본 원인

[search-field.tsx:64](src/components/inputs/search-field.tsx#L64):

```tsx
<Input ref={ref} type="search" $size={size} value={value} {...rest} />
```

- `type="search"` 가 브라우저 native clear button (`::-webkit-search-cancel-button`) 자동 표시
- 컴포넌트는 이미 [search-field.tsx:65-71](src/components/inputs/search-field.tsx#L65-L71) 에서 custom `<ClearBtn>` 제공 → 중복

## 3. Fix

[search-field.tsx:64](src/components/inputs/search-field.tsx#L64):

```tsx
<Input ref={ref} type="text" $size={size} value={value} {...rest} />
```

`type="search"` → `type="text"` 단순 변경.

## 4. type="search" → "text" 영향 분석

**사라지는 native 동작**:
- native clear button (`::-webkit-search-cancel-button`) — 이미 custom `ClearBtn` 으로 cover
- `Escape` 키 자동 clear — 거의 사용 안 됨. 필요 시 `onKeyDown` 으로 추가 가능 (현재 PR scope 밖)
- 일부 브라우저의 검색 history dropdown — UX 일관성 측면에서 오히려 안 보이는 게 나음 (의도된 placeholder 와 충돌)

**변경 없음**:
- 입력 / 포커스 / a11y / styled-components style 모두 동일
- screen reader 동작: input 의 `aria-label` / placeholder 가 의미 전달 — type="search" semantic 의 가치 적음
- 검색 의도 전달은 IconLeft (돋보기 SVG) + placeholder + onClear callback 으로 충분

## 5. 영향 분석

**type 차단**: SearchFieldProps 가 `type` 을 Omit 하므로 [search-field.tsx:43](src/components/inputs/search-field.tsx#L43) caller 가 type 변경 못 함 → 기존 사용자에 영향 0

**consumer**:
- platform / edge: SearchField 미사용 (grep 결과 0건). 회귀 0
- 향후 사용자: 의도된 custom UI 만 표시되어 일관됨

## 6. scope 밖 — 별도 처리

- [tag-list-panel.tsx:118](src/components/data-display/tag-list-panel.tsx#L118) 에도 `type="search"` 가 있으나 custom clear 가 없음 → 네이티브 × 단독 동작 → 본 PR scope 밖. 별도 sweep PR 거리

## 7. 검증 절차

1. typecheck `npx tsc --noEmit`
2. ui storybook 시각:
   - SearchField input 에 텍스트 입력 후 우측 × 가 1개만 표시
   - clear 클릭 시 onClear callback 정상 동작
3. ui storybook tests `npm run test-storybook` — 102 tests pass

## 8. 위험

- 없음. 1줄 변경 + Omit 으로 caller 영향 차단 + consumer 미사용
