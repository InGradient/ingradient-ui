---
title: PR-E18 — Settings Tab framework audit
date: 2026-05-11
parent: docs/plan/phase-5-components-audit.md
scope: audit-only (ingradient-platform + ingradient-edge + ingradient-ui)
status: audit complete — 사용자 결정 대기
---

# PR-E18 — Settings Tab framework audit

## 1. 목적

phase-5-components-audit.md PR-E18 항목. 양 repo settings tabs (~약 5,000줄) 가 *공통 layout pattern* 을 가졌는지 점검하고, ui Pattern 추출이 가치 있는지 판단.

## 2. 현재 framework 상태

### 2.1 SettingsModal 본체 — *이미 마이그 완료*

[platform SettingsModal.tsx](frontend/components/settings/SettingsModal.tsx) 가 사용 중:

| 사용 컴포넌트 | 출처 |
|---|---|
| `SettingsShell` (grid layout: 140px sidebar + content) | ui/patterns |
| `ModalBackdrop` / `ModalCard` / `ModalHeader` / `ModalTitle` | ui/components |
| `DialogCloseButton` | ui/components |
| `VerticalTabs` | ui/components |
| State hooks (useSettingsAccountState / useSettingsProjectState) | platform features/ |

→ **본체 layout / state 분리는 완료**. 추가 거리 없음.

### 2.2 Tab content (각 tab 내부) — 잔여 duplication

거의 모든 tab 이 자체적으로 같은 4 개 styled (`Section`, `SectionTitle`, `Row`, `Hint`) 를 재정의.

**Platform 패턴** (compact, no border):
```ts
const Section = styled.section`display:flex; flex-direction:column; gap:12px;`
const SectionTitle = styled.h3`
  margin:0; font-size:13px; font-weight:600;
  color:var(--ig-color-text-muted);
  text-transform:uppercase; letter-spacing:0.04em;
`
const Row = styled.div`...`  // 각 tab 마다 미세 차이
const Hint = styled.p`margin:0; color:var(--ig-color-text-muted); font-size:13px; line-height:1.5;`
```

| Tab | Section/SectionTitle/Hint/Row 줄수 |
|---|---|
| GeneralTab | 약 30줄 |
| AccountTab | 약 35줄 |
| OrgTab | 약 6줄 |
| OrgMembersTab | 약 6줄 |
| InvitationsTab | 약 6줄 |
| ProjectTab | 약 10줄 |
| ProjectSettingsForm | 약 8줄 |
| ProjectMemberInvite | 약 6줄 |

→ platform 약 **100~120줄 중복**.

**Edge 패턴** (with bottom border):
```ts
const Section = styled.div`margin-bottom: var(--ig-space-9);`;
const SectionTitle = styled.h3`
  font-size: var(--ig-font-size-sm); font-weight: 600;
  text-transform: uppercase; letter-spacing: 0.05em;
  color: var(--ig-color-text-muted);
  margin: 0 0 12px; padding-bottom: 8px;
  border-bottom: 1px solid var(--ig-color-border-subtle);
`;
```

| Tab | 중복 |
|---|---|
| ServerTab | 약 8줄 |
| DataTab | 약 8줄 |
| AboutTab | 약 8줄 |
| FieldTestTab | 약 8줄 |
| UpdateSection | 약 8줄 |

→ edge 약 **40~50줄 중복**.

### 2.3 ui 의 기존 비슷한 pattern

[ui/patterns/page/page-shell.tsx](src/patterns/page/page-shell.tsx) 가 *페이지 레벨* SectionTitle 제공:

```ts
export const SectionTitle = styled.h3`
  margin: 0 0 var(--ig-space-5);
  font-size: var(--ig-font-size-lg);  // 16px — 큼
  font-weight: 600;
  color: var(--ig-color-text-primary);
`
```

→ **visual mismatch**. 페이지 레벨 (큰, primary color) ≠ 탭 내부 (작은, muted color, uppercase, letter-spacing). 직접 사용 불가.

## 3. 평가

### 3.1 가치

- platform + edge 합 ~150~170줄 중복.
- 새 ui pattern 추출 시 (`TabSection / TabSectionTitle / TabHint`) → ~50줄 신규 ui + 150 절약 = 순 -100줄.
- 그러나 양 repo 디자인이 미세 다름 (border 유무) — 통일하려면 design 결정 필요.

### 3.2 비용

- ui 신규 export 3~4 개 추가.
- 양 repo 각 tab 마다 import 변경 + styled 삭제 = 약 10 파일 수정.
- 시각 회귀 위험: edge border-bottom 가 platform 에도 적용되면 design change.

### 3.3 결정 옵션

**옵션 A — 추출 진행 (양 repo 디자인 통일)**:
- ui 에 `TabSection / TabSectionTitle / TabHint / TabRow` 추가 (compact style, no border 또는 with border 어느 쪽이든 통일)
- 양 repo 마이그
- 순 절약 약 -100줄
- 위험: design decision 필요

**옵션 B — 추출 진행 (양 repo 디자인 보존)**:
- ui 에 prop `withBorder` 또는 두 variant 추가
- 양 repo 가 자기 variant 선택
- 순 절약 약 -80줄
- 위험: ui API 확장 (variant API 복잡)

**옵션 C — 추출 보류**:
- 중복은 작은 규모 (각 tab 5~10줄), 시각적 자유도 높음 (Row 의 디자인이 tab 마다 다름)
- 향후 *진짜 의미 있는 pattern* 이 나타날 때 재평가
- 추가 작업 0

### 3.4 추천

**옵션 C (보류)** 추천. 이유:
1. **중복 규모가 크지 않음** — 각 tab 5~10줄. abstraction cost 가 더 클 수 있음.
2. **양 repo 디자인 차이** — 통일 시 design decision 필요, prop 으로 분기 시 API 비용.
3. **Row 는 마다 다름** — 각 tab 의 Row 가 input/label/button 조합 다양 (label flex, justify between, padding 차이). 통일이 어려움.
4. **본체는 이미 마이그** — SettingsShell + VerticalTabs + state hooks 가 핵심 framework. tab content 의 SectionTitle styled 는 surface-level cosmetic.
5. **거리 우선순위 낮음** — PR-E17 (Member/Invite row Pattern, ~1471줄) 처럼 더 큰 가치의 거리가 대기 중.

## 4. 결정 후 action

- **옵션 A/B 선택 시**: 후속 PR-E18a (ui Pattern 추가) + PR-E18b (양 repo 마이그) 분리 진행
- **옵션 C 선택 시**: PR-E18 closed. 다음 거리는 PR-E17 추천

## 5. 추가 발견 (별건)

audit 중 발견한 `useSettingsAccountState` / `useSettingsProjectState` 가 SettingsModal 의 거대한 state 를 잘 분리해두었음. 이건 image-detail-modal 의 `useImageDetail*` 패턴 (PR-E3) 과 유사한 좋은 사례 — *이미 잘 마이그된 부분* 으로 기록.
