---
plan: PR-A6 — TaskTypeButtons → ui ModeSwitcher cover 가능 여부 audit
date: 2026-05-09
phase: 2
pr id: PR-A6
parent plan: ../components-audit-findings.md (§ 4)
master plan: ../../MASTER-PLAN.md (§ 9.1)
governance: ../../governance.md
estimated: 30min (audit) ~ 1h (마이그 시)
---

# PR-A6 — TaskTypeButtons / ModeSwitcher 검토

## 목표

양 `AddDatasetModal` 의 `TaskTypeButtons` (vertical button stack) 를 ui `<ModeSwitcher>` 로 cover 가능 여부 audit. 가능하면 마이그.

## audit (2026-05-09)

### 양 repo TaskTypeButtons

**시각**:
- `display: flex; flex-direction: column; gap: 6-8px` — vertical stack
- 각 Button: `width: 100%; padding: 8-9px 14px; text-align: left; border-radius: var(--ig-radius-xs/md)`
- active: border + background + color 변경 + weight 600
- disabled: opacity 0.35-0.4 + cursor not-allowed (segmentation 옵션 'coming soon')

**UX**: form question 분위기. 큰 버튼 + 왼쪽 정렬 텍스트로 옵션 명확 표시.

### ui ModeSwitcher 현재

**시각**:
- `inline-flex` segmented row (horizontal)
- 각 Option: `padding: 1/3 ~ 2/4; font-size: 2xs/xs` — segment 안 작은 옵션
- active: background-soft + weight 600
- disabled prop 없음 (option-level)

**UX**: toolbar segment 분위기. 작은 horizontal 옵션.

### 시각/UX 비교

| | TaskType | ModeSwitcher |
|---|---|---|
| 방향 | vertical | horizontal |
| 옵션 크기 | large button (full-width, padding 9/14) | small segment (padding 1-2/3-4) |
| text 정렬 | left | center |
| font-size | sm (13px) | 2xs/xs |
| border | per-option (radius xs/md) | shared row (no per-option border) |
| active 시각 | border + bg | bg-soft only |
| disabled | per-option | (없음) |
| use case | form question | toolbar selector |

→ **시각/UX 패턴 매우 다름**. 같은 컴포넌트로 cover 시 form 의 task type 선택이 작은 horizontal segment 으로 변경 — 가독성 ↓.

## 결정 옵션

### 옵션 A — ModeSwitcher 로 통일 (D-013 일관)

ui ModeSwitcher 에 `option.disabled?: boolean` 추가 + 양 AddDatasetModal 의 TaskType → ModeSwitcher.

- 시각 변화 큼 (vertical 큰 button → horizontal 작은 segment)
- form UX 손실 가능 (4 옵션이 작은 row 안에 채워져 가독성 ↓)
- D-013 일관 — 시각 통일 우선

### 옵션 B — skip (use case 다름 인정)

ModeSwitcher 와 TaskType 은 다른 use case (form question vs toolbar selector). cover 안 함. TaskType styled 양 repo 그대로 유지.

- audit 결과 record (D-007 의 적용 한계 — 시각/UX 의도 다름은 별개 컴포넌트 명분)
- 양 repo styled 중복 (~25줄 × 2) 잔존. 재사용 가치 낮음 (1 use case 만).

### 옵션 C — ui 에 ModeSwitcher 와 별개 `<OptionList>` 또는 `<RadioCardGroup>` 신설

vertical stacked option 용 컴포넌트 신규. RadioCardGroup or OptionStack (form 폼 큰 옵션 용).

- 시각 의도 보존
- ui 추가 거리 (governance 기준 만족 — 도메인 무관 + 재사용 가능)
- ModeSwitcher 와 의미 분리 명확

### assistant 권장

**권장 C** (장기) 또는 **B** (단기).

이유:
- TaskType 의 form UX 손실 (옵션 A) 은 사용자 경험 직접 영향. ui 통일이 중요해도 form question 시각 의도는 보존 권장.
- 옵션 C (RadioCardGroup 신설) 은 별도 거리 — Phase 2 의 audit 명분 (governance D-007).
- 옵션 B (단기 skip) — 본 PR 은 audit only 기록 후 종료. 향후 RadioCardGroup 추가 거리 발견 시 별도 PR.

D-013 (시각 통일) 가 ui 의 "한 패턴 = 한 컴포넌트" 정신이지, "다른 use case 도 한 컴포넌트로 통일" 의미는 아님. ModeSwitcher 는 toolbar selector, TaskType 은 form question — **별개 컴포넌트**가 자연.

## 의사결정 (확정)

✅ **옵션 C 채택** (사용자 결정, 2026-05-09) — ui `RadioCardGroup` 신설 + 양 AddDatasetModal 마이그.

근거: TaskType 의 form question 시각 의도 (vertical 큰 button) 보존 + ui simple + governance D-007 (도메인 무관 + 재사용 가능).

## ui API (RadioCardGroup)

```tsx
export interface RadioCardGroupOption {
  value: string
  label: string
  disabled?: boolean
}

export interface RadioCardGroupProps {
  options: RadioCardGroupOption[]
  value: string
  onChange: (value: string) => void
}
```

→ props 3개. governance 5권장 만족.

시각:
- vertical stack (`flex column gap-2`)
- 각 옵션: full-width, padding `var(--ig-space-3) var(--ig-space-5)`, text-align left, `var(--ig-radius-md)`, border `1px var(--ig-color-border-subtle)`, font-size sm
- active: border `var(--ig-color-accent)` + bg `var(--ig-color-accent-soft-surface)` + color `var(--ig-color-accent)` + weight 600
- hover (not disabled): border accent
- disabled: opacity 0.4 + cursor not-allowed

## 변경 파일

1. **`ui/src/components/inputs/radio-card-group.tsx`** — 신규 (~60줄)
2. **`ui/src/components/inputs/index.ts`** — re-export
3. **`platform/components/catalog/modals/AddDatasetModal.tsx`** — TaskType 부분 마이그
4. **`platform/components/catalog/modals/AddDatasetModal.styles.ts`** — `TaskTypeRow`, `TaskTypeBtn` 제거
5. **`edge/src/frontend/components/dataset/AddDatasetModal.tsx`** — 동일
6. **`edge/src/frontend/components/dataset/AddDatasetModal.styles.ts`** — `TaskTypeRow`, `TaskTypeBtn` 제거

## 시각 변화

거의 없음 — ui token 으로 정리만 (양 repo 의 미세한 차이 통일):
- platform `border-radius: var(--ig-radius-md)` ↔ edge `var(--ig-radius-xs)` → ui 표준 `var(--ig-radius-md)`
- platform `padding 9/14` ↔ edge `padding 8/14` → ui 표준 `var(--ig-space-3) var(--ig-space-5)`
- 양 repo 의 active background hex/rgba → ui token

## 효과

- ui +60줄 (RadioCardGroup)
- platform -25줄 (TaskTypeRow + TaskTypeBtn 제거)
- edge -25줄 (동일)
- **순감소 -약 10줄** + 양 repo styled 통일 + 향후 다른 vertical option group 즉시 사용

## 후속

- PR-B1: edge SetupSection / FormSection 정렬 audit
