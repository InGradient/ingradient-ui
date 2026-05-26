---
plan: PR-B4 — ui FilterPopover + FilterPopoverSection 신설
date: 2026-05-09
phase: 2
pr id: PR-B4
parent plan: ../components-audit-findings.md (§ 12)
master plan: ../../MASTER-PLAN.md (§ 9.1)
governance: ../../governance.md
estimated: 1.5-2h
---

# PR-B4 — FilterPopover ui 신설 (옵션 B)

## 목표

popover-with-sections 패턴 (button trigger + popover with section list) 을 ui 컴포넌트로 추출. 양 repo (edge ImagesView, platform gallery toolbar) 의 popover filter 마이그.

## 결정 (확정)

✅ **옵션 B 채택** — ui `FilterPopover` + `FilterPopoverSection` 신설. caller 가 sections 안 도메인 input 만 children 으로.

근거 (장기 방향):
- D-013 (시각 통일) 일관 — 양 repo 같은 use case 의 시각 차이 통일
- D-007 (components 최소화) — 양 repo styled ~130줄 제거, ui +60줄 (순감소 ~70줄)
- PR-A5/A6/B2 의 ui 추출 패턴과 일관

## ui API

```tsx
// FilterPopover — popover wrapper (anchor prop, surfaceRaised, sections gap)
export interface FilterPopoverProps extends React.HTMLAttributes<HTMLDivElement> {
  anchor?: { top: number; left: number }
  width?: number  // default 280
}

// FilterPopoverSection — section title + content
export interface FilterPopoverSectionProps {
  title: string
  children: React.ReactNode
}
```

caller 사용 예시:
```tsx
<FilterPopover anchor={{ top: 100, left: 50 }}>
  <FilterPopoverSection title="Source">
    <Switch ... />
  </FilterPopoverSection>
  <FilterPopoverSection title="Date">
    <DropdownSelect ... />
  </FilterPopoverSection>
</FilterPopover>
```

→ props 2 (anchor + width). children 자유. governance 만족.

## 시각 (D-013 표준)

- padding: `var(--ig-space-5)`
- background: `surfaceRaised`
- border: `1px solid var(--ig-color-border-subtle)`
- border-radius: `var(--ig-radius-sm)`
- shadow: `var(--ig-shadow-popover)`
- z-index: 100
- max-height: caller 가 anchor 시 viewport 안 자동 계산 (`maxHeight: calc(100vh - anchor.top - 16px)`)
- font-size: `var(--ig-font-size-xs)`
- color: `var(--ig-color-text-secondary)`

Section title:
- font-size: `var(--ig-font-size-2xs)`
- font-weight: 600
- color: `var(--ig-color-text-muted)`
- text-transform: uppercase
- letter-spacing: 0.05em
- margin-bottom: `var(--ig-space-3)`

→ 양 repo 의 미세 차이 (edge: 0.06em letter-spacing / platform: 0.04em, edge: text-muted / platform: text-soft, edge: 11px / platform: 11px) 모두 ui 표준으로 통일.

## 변경 파일

### ui 신규
1. `ui/src/components/overlays/filter-popover.tsx` (~80줄)
2. `ui/src/components/overlays/index.ts` re-export

### edge 마이그
3. `edge/src/frontend/components/capture/ImagesView.styles.ts` — `ImagesFilterPopover`, `ImagesFilterSection`, `ImagesFilterTitle`, `ImagesFilterRow` 제거 (~30줄). `ImagesFilterWrap`, `ImagesFilterButton`, `ImagesFilterDateRow`, `ImagesFilterDateLabel` 는 유지 (button + 도메인 layout).
4. `edge/src/frontend/components/capture/ImagesView.tsx` — caller 갱신

### platform 마이그
5. `platform/components/gallery/toolbar/toolbar-styles.tsx` — `FilterDropdown`, `FilterSection`, `FilterSectionTitle` 제거 (~30줄). `FilterRow` 등 유지.
6. `platform/components/gallery/toolbar/toolbar-dropdowns.tsx` — caller 갱신

## 시각 변화

- section title: edge `2xs uppercase 0.06em muted` ↔ platform `11px uppercase 0.04em soft` → ui 표준 통일
- popover 너비: edge 260px ↔ platform 300-380px → ui default 280, caller width prop 으로 조정
- padding: 둘 다 비슷하게 ui 표준 적용

## 효과

- ui +80줄
- edge -30줄
- platform -30줄
- **순감소 ~20줄** + 양 repo 시각 통일 + 향후 새 popover filter 즉시 사용

## 검증

- ui typecheck + build
- platform typecheck (symlink)
- edge typecheck (sync 후)
- 시각: 마지막 일괄

## 후속

- PR-C1: SelectableListItem 패턴 검토 (audit only)
