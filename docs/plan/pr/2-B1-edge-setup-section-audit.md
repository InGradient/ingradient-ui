---
plan: PR-B1 — edge SetupPanel.styles 의 form 패턴 ui 정렬 audit
date: 2026-05-09
phase: 2
pr id: PR-B1
parent plan: ../components-audit-findings.md (§ 7)
master plan: ../../MASTER-PLAN.md (§ 9.1)
governance: ../../governance.md
estimated: 30min audit + 1-2h 마이그 (옵션 따라)
---

# PR-B1 — edge SetupPanel form 패턴 audit

## 목표

`edge/src/frontend/components/capture/SetupPanel.styles.ts` 의 form-section 류 styled 와 ui 의 form patterns 비교. 정렬 가능 여부 + 거리 식별.

## audit (2026-05-09)

### edge SetupPanel.styles.ts (총 16 styled)

| edge | 종류 | ui 매핑 후보 | 시각 차이 |
|---|---|---|---|
| `SetupPanel` | layout shell (flex column flex-1) | (없음) | page-specific |
| `SetupPanelHeader` | header (padding + border-bottom + flex space-between) | (없음) | page-specific |
| `SetupPanelTitle` | h-title (md weight 700) | ui `PanelTitle` (md 700) | 거의 동일 — 가능 |
| `SetupResetButton`, `SetupSaveButton` | local buttons | ui `Button variant="secondary"` / `accent` | wrap 5줄 이상 — ui Button 으로 변경 가능 |
| `SetupHeaderActions` | flex row gap-2 | (없음) | 1-2줄 layout |
| `SetupPanelBody` | scrollable body | (없음) | page-specific |
| **`SetupSection`** | flex column gap-4 | ui `FieldGroup` (gap-2) | gap 다름 — wrap or inline |
| **`SetupSectionTitle`** | 2xs uppercase weight 700 letter-spacing | ui `SectionTitle` (lg weight 600 no uppercase) | **시각 매우 다름** (D-013 일관 시 통일) |
| **`SetupField`** | `<label>` flex column gap-2 (label + input wrap) | ui `FieldGroup` (`<div>` flex column gap-2) | **element 다름** (`<label>` vs `<div>`) |
| **`SetupInput`** | input padding 8/10 | ui `<TextField size="sm">` | **PR-A4 의 size sm 으로 통일 가능** |
| `SetupFieldLabelRow` | flex row gap-5 (label + tooltip) | (없음) | layout 도움 |
| `SetupInlineRow` | flex row gap-4 | (없음) | layout 도움 |
| `SetupInlineHint` | xs muted | ui `FieldHint` (xs muted) | 동일 — 가능 |
| `SetupMetaText` | xs muted line-height 1.5 | (없음) | 미세 차이 (line-height 1.5) |
| `SetupAccordionSummaryRow` | flex space-between + svg rotate | (없음) | 도메인 (accordion) |
| `PatternGrid`, `PatternButton` | pattern selector (도메인) | (없음 — 도메인) | — |

### 사용처

- `capture/SetupPanel.tsx` (메인 사용처)
- `settings/CameraParamsTab.tsx` (`SetupField`, `SetupFieldLabelRow`, `SetupInlineRow`, `SetupInlineHint`)

## 정리 거리 분류

### Group X — 작은 거리 (시각 거의 동일, 안전)

1. **`SetupInput` → ui `<TextField size="sm">`** (PR-A4 일관)
   - 영향: SetupPanel.tsx 의 사용처 + CameraParamsTab.tsx
   - 시각: padding 변화 (PR-A4 와 동일 거리)
2. **`SetupResetButton` / `SetupSaveButton` → ui `<Button variant="secondary"|"accent" size="sm">`**
   - 시각: 약간 변화 (ui Button 의 시각 표준)

### Group Y — 큰 거리 (시각 변화 + 의미 변경)

3. **`SetupField` (`<label>`) → ui `FieldGroup` (`<div>`) + `<FieldLabel>`** — element 패턴 변경 (implicit label → explicit label htmlFor). caller 코드 큰 변경 (label 텍스트 별도, input id 명시).
4. **`SetupSectionTitle` (uppercase 2xs) → ui `SectionTitle` (lg)** — 시각 매우 다름 (PR-0.1 의 D-013 일관 — uppercase 사라짐, 글자 크기 ↑). 영향 범위 큼 (모든 sub-section 헤더).
5. `SetupInlineHint` → ui `FieldHint` — 거의 동일하나 의존성 + import 변경

### Group Z — 도메인/page-specific (skip)

- `SetupPanel`, `SetupPanelHeader`, `SetupPanelBody`, `PatternGrid`, `PatternButton`, `SetupAccordionSummaryRow` — 그대로 유지

## 결정 옵션

### 옵션 A — 모든 정리 거리 (Group X + Y)

D-013 일관. 큰 시각 변화 + label 패턴 변경.
- 장점: 양 repo 시각 완전 일관
- 단점: SetupPanel + CameraParamsTab 의 form 시각 + label 패턴 변경 (caller 코드 큰 변경)
- 추정: 1.5-2h

### 옵션 B (권장) — Group X 만

작은 거리만 (SetupInput, Buttons). 시각 변화 작음.
- SetupField/SectionTitle/InlineHint 의 시각 의도 (uppercase 라벨, label 안 input wrap) 는 edge capture/settings 페이지의 의도. PR-0.1 의 ConnectionTab 처럼 시각 통일 명분 강하지 않음 — capture 는 자체 분위기.
- audit 결과만 record. SetupField/SectionTitle 정리는 별도 거리.
- 추정: 30-45min

### 옵션 C — audit only (no migration)

audit 결과 기록 후 본 PR 종료. 모든 정리는 별도.
- 장점: 본 PR 빠르게 종료, 사용자 결정 시간
- 단점: 작은 거리도 미루기

## 의사결정 (확정)

✅ **옵션 A 채택** (사용자 결정, 2026-05-09).

근거:
- D-007 components 최소화 + D-013 시각 통일 일관 (PR-0.1 ConnectionTab 정신과 동일)
- 사용자 명시 "시각 통일이 중요. 세밀한 건 다 수정하고 조절"
- capture 화면의 uppercase 라벨 / implicit label 패턴은 edge 자체 분위기지만, ui 표준으로 통일이 장기 방향

## 변경 파일 (옵션 A)

### Group X (작은 거리)
1. **`SetupPanel.styles.ts`** — `SetupInput` / `SetupResetButton` / `SetupSaveButton` 제거 (ui 사용)
2. **`SetupPanel.tsx`** — `<TextField size="sm">` / `<Button variant="secondary"|"accent" size="sm">` 호출

### Group Y (큰 거리)
3. **`SetupPanel.styles.ts`** — `SetupSection`, `SetupSectionTitle`, `SetupField`, `SetupInlineHint` 제거. `SetupFieldLabelRow`, `SetupInlineRow`, `SetupMetaText`, `SetupAccordionSummaryRow` 는 layout 도움 — 유지.
4. **`SetupPanel.tsx`** — 모든 사용처 갱신:
   - `<SetupSection>` → `<FieldGroup>` (gap-2 vs gap-4 차이 — caller 가 inline gap override 또는 ui FieldGroup 그대로 수용)
   - `<SetupSectionTitle>UPPERCASE</SetupSectionTitle>` → `<SectionTitle>Title Case</SectionTitle>`
   - `<SetupField>{label}<input/></SetupField>` → `<FieldGroup><FieldLabel htmlFor={id}>{label}</FieldLabel><input id={id} /></FieldGroup>`
   - `<SetupInlineHint>` → `<FieldHint>`

### 사용처 영향 (다른 파일)
5. **`settings/CameraParamsTab.tsx`** — `SetupField`, `SetupFieldLabelRow`, `SetupInlineRow`, `SetupInlineHint` 사용. 동일 패턴 마이그.

## 시각 변화 양상 (정확)

### Section 헤더
- 이전: `SECTION TITLE` (2xs 글자, UPPERCASE, weight 700, letter-spacing 0.06em, color rgba 0.72)
- 이후: `Section Title` (lg 글자, weight 600, no uppercase, color text-primary)
- → 글자 크기 작 → 큼, 모양 UPPERCASE → Title Case

### Field label
- 이전: `<label>Field name<input/></label>` — implicit, label 안 input
- 이후: `<FieldGroup><FieldLabel htmlFor="x">Field name</FieldLabel><input id="x"/></FieldGroup>` — explicit
- 시각: 거의 동일 (label 자체는 sm weight 600 muted — 현재 xs 0.82 와 비슷)
- caller 코드: input id 명시 + label 의 htmlFor 매칭 필요

### Input
- 이전: `SetupInput` styled (padding 8/10)
- 이후: `<TextField size="sm">` (PR-A4 token, padding 0/var(--ig-space-4))
- 시각: 미세 차이 (token 표준)

### Buttons
- 이전: `SetupResetButton / SetupSaveButton` styled
- 이후: ui `<Button variant="secondary"|"accent" size="sm">` — 시각 약간 변화 (ui 표준 색상/hover)

### Section gap
- 이전: SetupSection gap-4 (16px)
- 이후: FieldGroup gap-2 (8px)
- → 섹션 안 간격 좁아짐. 사용자 시각 검증 후 의도 다르면 caller styled extend `gap` override.

## 후속

- PR-B2: edge DiagStep* → ui StepIndicator
- (장기) Group Y 거리 — 별도 PR 또는 Phase 4
