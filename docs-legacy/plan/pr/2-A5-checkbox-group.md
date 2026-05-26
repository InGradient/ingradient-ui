---
plan: PR-A5 — ui CheckboxGroup 신설 + 양 AddDatasetModal class selection 마이그
date: 2026-05-09
phase: 2
pr id: PR-A5
parent plan: ../components-audit-findings.md (§ 4)
master plan: ../../MASTER-PLAN.md (§ 9.1)
governance: ../../governance.md
estimated: 1-2h
---

# PR-A5 — CheckboxGroup ui 신설

## 목표

ui `<CheckboxGroup>` 신설 — color swatch + checkbox + label list + select all/deselect all 헤더. 양 `AddDatasetModal` (platform + edge) 의 class selection (~50줄 inline style + map) → 단일 ui 컴포넌트 호출.

## audit (2026-05-09)

### platform AddDatasetModal.tsx (line 89-114, ~26 줄 inline)

```tsx
<div style={{ maxHeight: 160, overflowY: 'auto', border: '1.5px solid var(--ig-color-border-subtle)', borderRadius: 10, padding: '4px 0' }}>
  <div style={{ display: 'flex', gap: 8, padding: '4px 10px', borderBottom: '1px solid var(--ig-color-border-subtle)' }}>
    <button onClick={...all}>Select All</button>
    <button onClick={...none}>Deselect All</button>
  </div>
  {classes.map((item) => (
    <label key={item.id} style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '5px 10px', fontSize: 13 }}>
      <input type="checkbox" checked={selectedClasses.has(item.id)} onChange={...} />
      <span style={{ width: 10, height: 10, borderRadius: 2, background: item.color }} />
      {item.display_name?.[0] ?? item.name}
    </label>
  ))}
</div>
```

### edge AddDatasetModal.tsx (line 158-181, ~24 줄 inline)

거의 동일. 차이:
- `class_id` / `class_name` (platform 은 `id` / `display_name?.[0] ?? name`)
- `color: 'rgba(91,144,255,0.9)'` (platform 은 `var(--ig-color-accent)`)
- maxHeight 140 (platform 160), font-size 12 (platform 13), border-radius 8 (platform 10)

→ caller 가 mapping 후 ui 에 generic shape `{ id, label, color }` 전달.

## 결정

### D1. ui API

```tsx
export interface CheckboxGroupItem {
  id: string
  label: string
  color?: string
}

export interface CheckboxGroupProps {
  items: CheckboxGroupItem[]
  selectedIds: Set<string>
  onChange: (next: Set<string>) => void
  maxHeight?: number       // default 160
  showSelectAll?: boolean  // default true
}
```

→ props 5개. governance 권장 안 어김.

i18n: `selectAllLabel` / `deselectAllLabel` 은 default 'Select All' / 'Deselect All' (영어). caller 가 i18n 필요 시 후속 PR (한국어 미지원 시각 검증 후).

### D2. 시각 통일 (D-013)

- maxHeight: 160 (default), prop 으로 override 가능
- border: `1px solid var(--ig-color-border-subtle)`
- border-radius: `var(--ig-radius-sm)` (8px 근처, ui 표준)
- font-size: `var(--ig-font-size-sm)` (13px 표준)
- header background: 없음, border-bottom 만
- color swatch: 10x10, border-radius 2

caller 의 시각 차이 (140 vs 160, 8 vs 10, 12 vs 13) → ui 표준으로 통일.

### D3. checkbox 컴포넌트

ui 의 기존 `Checkbox` (이미 있음) 사용. 또는 native `<input type="checkbox">`. ui Checkbox 사용 권장 (시각 일관).

### D4. caller 의 외부 label/count

`<label>Classes ({selected.size}/{items.length})</label>` 같은 외부 라벨은 caller 책임. CheckboxGroup 자체는 내부 헤더 (Select All) + list 만.

## 변경 파일

### ui 신규

1. **`ui/src/components/inputs/checkbox-group.tsx`** — 신규 (~80줄)
2. **`ui/src/components/inputs/index.ts`** — re-export

### 마이그

3. **`platform/components/catalog/modals/AddDatasetModal.tsx`** — class selection inline 26줄 → `<CheckboxGroup ...>` 호출 (~12 줄)
4. **`edge/src/frontend/components/dataset/AddDatasetModal.tsx`** — 동일

### 변경 안 함

- TaskTypeBtn (별도 거리, PR-A6 ModeSwitcher 검토)
- AddDatasetModal 의 다른 부분 (이름 input, submit/cancel)

## 시각 변화

- maxHeight 통일 160
- font-size 통일 13 (sm)
- border-radius 8 통일
- edge 의 hard-coded 색상 `rgba(91,144,255,0.9)` → ui token `var(--ig-color-accent)` (D-013)

## 줄수 효과

| 항목 | 변경 |
|---|---|
| platform inline class selection | -26 → ~12 (-14) |
| edge inline class selection | -24 → ~12 (-12) |
| ui CheckboxGroup 신규 | +80 |
| **순변화** | **+54** (ui 추가). 그러나 inline 패턴 흡수 + 향후 재사용 |

## 검증

- ui typecheck + build
- platform typecheck (symlink)
- edge typecheck (lib sync 후)
- 시각: 마지막 일괄

## 후속

- PR-A6: TaskTypeButtons → ui ModeSwitcher 검토
