---
plan: PR-0.1 — Edge ConnectionTab form 패턴 import 정렬 (audit + 적용)
date: 2026-05-09
phase: 0 (warm-up)
pr id: PR-0.1
parent plan: ../components-audit-findings.md (§ 1)
master plan: ../../MASTER-PLAN.md (§ 9.1 — D-012 plan-first)
governance: ../../governance.md (§ 1.1 소비자 components 최소화)
estimated: 30분 (audit 결과에 따라 1-2h 로 확장 가능)
---

# PR-0.1 — Edge ConnectionTab form 패턴 import 정렬

## 목표

`ingradient-edge/src/frontend/components/settings/connection/ConnectionTab.styles.ts` 의 local form 패턴 (`Section`, `SectionTitle`, `FormGroup`, `FieldLabel`) 을 ui 의 export 와 정렬. 가능하면 ui import 로 교체, 시각 차이 있으면 결정 옵션을 plan 으로 기록.

## 왜

- governance § 1.1 — 소비자 `components/` 폴더 최소화. 양쪽 (platform/edge) 이 같은 ui 패턴 import 하면 자연스럽게 시각 일관 + 디자이너 한 곳 수정 가능.
- D-007 — 1 프로젝트라도 도메인 무관 + 재사용 가능 시 ui 사용. form layout 은 정확히 그 케이스.
- Phase 1 (ImageGrid) 본격 작업 전 quick win — 패턴 확립용 (PR 작게, plan-first 절차 검증).

## audit 결과 (2026-05-09 — 본 plan 작성 시점)

### edge local 정의 (현황)

`ConnectionTab.styles.ts:6-9` 에 4개 styled-component:

```ts
export const Section = styled.div`margin-bottom: var(--ig-space-9);`;

export const SectionTitle = styled.h3`
  font-size: var(--ig-font-size-sm);
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  color: var(--ig-color-text-muted);
  margin: 0 0 12px;
  padding-bottom: 8px;
  border-bottom: 1px solid var(--ig-color-border-subtle);
`;

export const FormGroup = styled.div`
  margin-bottom: var(--ig-space-6);
  &:last-child { margin-bottom: 0; }
`;

export const FieldLabel = styled.label`
  display: block;
  font-size: var(--ig-font-size-xs);
  color: var(--ig-color-text-muted);
  margin-bottom: var(--ig-space-2);
  text-transform: uppercase;
  letter-spacing: 0.04em;
`;
```

### edge 사용처 (총 7 파일)

`grep` 결과 — `connection/` 폴더 안에서:

| 파일 | 사용 |
|---|---|
| `ProfileStatusSection.tsx` | `Section`, `SectionTitle` |
| `AutoSetupSection.tsx` | `Section`, `SectionTitle` |
| `DiagnosticsSection.tsx` | `Section`, `SectionTitle` |
| `AdvancedSection.tsx` | `Section`, `SectionTitle`, `FormGroup`, `FieldLabel` |
| `NicControlSection.tsx` | (확인 필요) |
| `ConnectSection.tsx` | (확인 필요) |
| `ScanSection.tsx` | (확인 필요) |

### ui 의 동일/유사 export

| ui export | 위치 | 형태 | edge local 과 비교 |
|---|---|---|---|
| `FormGroup` | `inputs/form-section.tsx` | **React 컴포넌트** (`{ title, description, children }`) | ❌ **의미 다름**. edge `FormGroup` 은 단순 spacing wrapper (styled.div). |
| `FieldGroup` | `patterns/page/page-shell.tsx` | styled.div (`flex column gap-2`) | ⚠️ **시각 다름**. edge 는 단순 margin-bottom; ui 는 flex layout. |
| `FieldLabel` | `patterns/page/page-shell.tsx` | styled.label (`sm, weight 600, no uppercase`) | ❌ **시각 다름**. edge 는 `xs uppercase muted`; ui 는 `sm weight 600 muted`. |
| `SectionTitle` | `patterns/page/page-shell.tsx` | styled.h3 (`lg, weight 600, no border`) | ❌ **시각 다름**. edge 는 `sm uppercase + bottom border`; ui 는 `lg, no border`. |
| `Section` | (없음) | — | ❌ ui 에 export 안 됨. |

### 결론

**원래 PR 가정 (단순 import 정렬) 은 불가능.** 4개 모두 시각/의미 차이가 있어 그대로 import 교체 시 시각 회귀 발생.

## 결정 옵션 (plan 합의 필요)

### 옵션 A — ui 시각으로 통일 (디자이너 합의 필요)

edge 의 uppercase 라벨 / bottom-border 헤더 스타일을 버리고 ui 표준 (no uppercase, sm/lg) 로 정렬. 시각 변화 발생 → 디자이너 검토 필수.

- 장점: 양 repo 시각 완전 일관, ui 단일 출처
- 단점: edge connection settings 의 의도된 시각 (모니터링/시스템 설정 분위기) 손실 가능
- 작업: ui import 로 교체 + edge local 4개 제거. ~30분.

### 옵션 B — edge 시각 의도 보존, redundant 만 정리

edge 의 uppercase 라벨은 의도적 (시스템 설정 분위기). 시각 보존하면서 ui 와 충돌 없는 정리만:
- `Section` (단순 margin-bottom): ui 에 동등 export 없음 → 그대로 유지 또는 inline `<div style={{marginBottom: 'var(--ig-space-9)'}}>` (가치 낮음, 유지가 나음)
- `FormGroup` (단순 margin-bottom + last-child): 동일. ui FieldGroup 과 다름. 유지.
- `FieldLabel`, `SectionTitle`: 시각 의도 보존 → 유지.

→ 결과: **변경 거리 0**. PR-0.1 은 audit 결과만 기록 후 close.

### 옵션 C — 부분 교체 (절충)

`Section` / `FormGroup` 같은 단순 spacing wrapper 만 ui 에 새 export 추가 (`<Stack gap>`, `<MarginedBox>`) 후 edge 마이그. uppercase `FieldLabel` / `SectionTitle` 은 시각 의도 보존 → edge local 유지하되 이름 충돌 회피 위해 rename (`SettingsLabel`, `SettingsSectionTitle`).

- 장점: 의미 충돌 (ui FormGroup = React 컴포넌트, edge = spacing) 해소. 시각 의도 보존.
- 단점: ui 에 새 export 1-2개 추가 (Stack/MarginedBox) — governance 추가 기준 만족 검토 필요.
- 작업: ui 추가 1 PR + edge rename 1 PR = 1-2h.

### 권장 (assistant 의견)

**옵션 B 권장 (default)**. 이유:
1. edge connection settings 의 uppercase 라벨 / bottom-border 헤더는 의도된 시각 (시스템/진단 분위기). ui 일반 form 과 다른 맥락.
2. `Section` / `FormGroup` 단순 wrapper 는 줄 수 자체가 작음 (4줄 × 4 = 16줄) — 추출 ROI 낮음.
3. PR-0.1 의 본질적 목표는 **검증된 패턴 확립** + **plan-first 흐름 검증**. 이 audit 결과 자체가 거리. 다음 PR (PR-0.2 InfoRow) 의 진행 신호.

옵션 A 는 디자이너 합의 후 별도 PR (Phase 4 expansion 거리). 옵션 C 는 ui 새 export (`Stack`/`MarginedBox`) 가 governance 기준 (재사용 가능성 + 도메인 무관) 만족하는지 별도 검토 후.

## 어떻게 (옵션별 step)

### 옵션 B (권장) — audit 결과 기록 후 close

1. ✅ 본 plan 의 audit 섹션을 `components-audit-findings.md § 1` 에 백포트 (가능하면 inline 노트)
2. ✅ master plan § 8 progress log 에 "PR-0.1: audit only — local 유지 결정" 기록
3. (no code 변경)

**검증**: 별도 검증 불필요 (코드 변경 없음).

### 옵션 A — ui 로 통일 (디자이너 합의 후)

1. ConnectionTab.styles.ts 의 4개 export 제거
2. 사용 7 파일의 import 를 `@ingradient/ui` 로 변경
3. `Section` 은 ui 에 없으므로 → ui `FieldGroup` (`display: flex; gap`) 또는 inline div 로 교체
4. `FormGroup` (styled wrapper) → ui 의 React `FormGroup` 으로 교체 (이름 같지만 형태 다름 — caller 코드 변경)
5. `FieldLabel`, `SectionTitle` → ui import (시각 변경 수용)

**검증**:
- `npx tsc --noEmit` (edge)
- `npm run dev` 로 settings/connection 탭 전 7 sub-section 시각 확인
- before/after 스크린샷 비교 (디자이너 합의 자료)

### 옵션 C — 부분 교체

1. ui 에 `<Stack gap>` 또는 `<MarginedBox bottom>` 추가 (governance 검토 필요)
2. edge `Section` / `FormGroup` → ui 신규 import
3. edge `FieldLabel` → `SettingsLabel` rename (local 유지)
4. edge `SectionTitle` → `SettingsSectionTitle` rename (local 유지)

**검증**:
- ui 추가 컴포넌트 props ≤ 5, 파일 ≤ 200줄, storybook (Phase 3 일괄)
- edge typecheck + 시각 확인

## 위험 / trade-off

- **옵션 B 채택 시**: ui-소비자 import 정렬 의지 약화 신호. governance § 1.1 의 "소비자 최소화" 정신과 약간 충돌. 단, audit 자체가 결정 record → 향후 재검토 시 근거.
- **옵션 A 채택 시**: 디자이너 합의 + 시각 회귀 검증 부담. PR-0.1 의 30분 추정이 1-2일 (디자이너 일정 포함) 로 확장.
- **옵션 C 채택 시**: ui 표면적 증가 (Stack/MarginedBox 추가). governance "props ≤ 5 + 도메인 무관 + 재사용 가능" 기준 만족하나, **ROI 가 낮음** (4줄 styled 4개 절약 위해 ui 1개 추가).

## 검증 방법 (옵션별)

| 옵션 | typecheck | 시각 회귀 | 디자이너 |
|---|---|---|---|
| A | edge `npx tsc --noEmit` | 7 sub-section 모두 | **합의 필수** |
| B | (no change) | (no change) | 불필요 |
| C | edge + ui 양쪽 typecheck | 7 sub-section + ui storybook | 권장 (Stack 추가 시) |

## 의사결정 (확정)

✅ **옵션 A 채택** (사용자 결정, 2026-05-09)

> "시각 통일이 중요한 것 같아. 세밀한 건 다 수정하고 조절 해보자"

→ ui 표준에 맞춰 4개 모두 마이그. 시각 변화 수용. edge 의 uppercase 라벨 / bottom-border 헤더 시각 의도는 버림.

## 구체 매핑 (옵션 A 적용)

| edge local (제거) | ui import (대체) | 시각 변화 |
|---|---|---|
| `Section` (`margin-bottom: var(--ig-space-9)`) | `<FormSection>` (`styled(Panel)` + `padding: var(--ig-space-8)` + `gap: var(--ig-space-6)`) | **Panel 화** — background + border-subtle + padding 추가. settings 섹션이 카드 모양으로 변함 |
| `SectionTitle` (`sm uppercase + bottom border + 8 padding-bottom`) | `<SectionTitle>` (h3, `lg`, `weight 600`, no uppercase, no border) | uppercase + 하단 border 제거, 글자 크기 ↑ |
| `FormGroup` (`margin-bottom: var(--ig-space-6)`) | `<FieldGroup>` (`flex column gap: var(--ig-space-2)`) | margin-stacking → flex/gap. 자식 간격 좁아짐 |
| `FieldLabel` (`xs uppercase muted`) | `<FieldLabel>` (`sm weight 600 muted`) | uppercase 제거, 크기 ↑, 굵기 ↑ |

### inline override 보존

다음 inline `style` 은 그대로 유지 (caller 의 의도된 미세 조정):
- `<SectionTitle style={{cursor:'pointer'}} onClick>` — collapsible (`AdvancedSection.tsx:40`)
- `<FieldLabel style={{margin:0}}>` — row 안 라벨 정렬
- `<FieldLabel style={{marginTop:N}}>` — 다른 spacing 필요 (NicControl, AdvancedSection, ConnectSection)

## 변경 파일 (실제: 8 — 진행 중 ScanSection / SelectionSection 도 import 가짐 발견)

1. **`ConnectionTab.styles.ts`** — line 6-9 의 4개 export 제거
2. **`ProfileStatusSection.tsx`** — Section/SectionTitle
3. **`AutoSetupSection.tsx`** — Section/SectionTitle
4. **`DiagnosticsSection.tsx`** — Section/SectionTitle
5. **`AdvancedSection.tsx`** — 4개 모두
6. **`ConnectSection.tsx`** — 4개 모두
7. **`NicControlSection.tsx`** — 4개 모두
8. **`ScanSection.tsx`** — Section/SectionTitle (typecheck 시 발견 — 사용 중)
9. **`SelectionSection.tsx`** — 4개 모두 (dead code, 마이그만 진행)

각 파일에서:
- import 두 줄로 분리: ui → `@ingradient/ui`, 나머지 local styled (NetworkSummaryGrid, ActionRow 등) → `./ConnectionTab.styles`
- JSX 태그 명: `<Section>` → `<FormSection>`, `<FormGroup>` → `<FieldGroup>`, `<SectionTitle>` 과 `<FieldLabel>` 은 이름 동일

## 검증

- `npx tsc --noEmit` (edge 폴더)
- `npm run dev` (edge) → settings/connection 탭의 7 sub-section 시각 확인
- 사용자 시각 회귀 검증 (Panel 화 + 헤더 변경 + 라벨 변경 의도 부합 확인)

## 위험 / 후속

- 만약 시각 결과가 의도와 달라 (예: Panel 중첩) 이상하면 → `<FormSection>` 대신 단순 `styled.div { margin-bottom: var(--ig-space-9) }` 으로 후속 조정 (별도 PR 또는 본 PR 내 조정).
- inline style 의 `marginTop` 들이 ui FieldLabel 의 새 크기와 어울리지 않으면 미세 조정 필요.

## 후속

- ✅ PR-0.2 InfoRow 추출 진행 (sub-plan: `0-2-info-row-extraction.md`)

## 완료 record (2026-05-09)

- 옵션 A (시각 통일) 채택 — D-013 으로 등록 (master plan § 6)
- 변경 파일 9개 (plan 의 7 + audit 진행 중 발견 2 — ScanSection / SelectionSection)
- typecheck 통과 (PR-0.1 관련 에러 0)
- 시각 검증: 마지막 일괄 (사용자 결정)
- 학습 (PR-0.2 plan 에 반영): 양 repo 패턴이 시각 동일 가정하지 말 것 — audit 첫 단계에서 시각 비교 필수
