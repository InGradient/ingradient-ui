---
plan: components/ audit — 추가 추출 거리 (2026-05-09)
date: 2026-05-09
governance: ../governance.md (D-007: 1 프로젝트라도 재사용 가능 + 도메인 무관 시 ui)
parent plan: ../MASTER-PLAN.md (Phase 2 의 세부)
---

# Components/ Audit Findings

## 배경

D-007 결정 (1 프로젝트라도 도메인 무관 + 재사용 가능성 시 ui) 적용해 platform + edge 의 `components/` 폴더 audit. 추가 추출 거리 발견.

이 plan 은 Phase 2 (작은 audit 거리) 의 구체 항목 list. PR 단위 작게 진행.

## 발견 항목 (우선순위 순)

각 항목 우측에 매핑된 **PR ID** 표시. 작업 우선순위 + PR 단위 (§ 마지막) 와 동기화.

### 🔴 1. Edge form 패턴 import 정렬 → **PR-0.1 ✅ 완료 (2026-05-09)**

**원래 가정**: edge local 4개 (`Section/SectionTitle/FormGroup/FieldLabel`) 가 ui 와 동일 → 단순 import 정렬.

**실제 audit (PR 진행 중 발견)**: 시각/의미 다름 — edge 는 uppercase 라벨 + 하단 border 헤더 + Panel 아닌 spacing wrapper. ui 는 lg 헤더 + Panel 기반 FormSection.

**채택 옵션**: A (시각 통일, D-013) — ui 표준에 맞춤.

**결과** (8 파일):
- `ConnectionTab.styles.ts`: 4 local styled 제거
- 7 sub-section + dead-code 1 (SelectionSection): ui import 로 교체
- typecheck 통과

**시각 변화**: 각 sub-section 이 Panel 카드 (background + border + padding-8) 로 둘러싸이고 헤더/라벨의 uppercase 사라짐. 사용자 마지막 일괄 검증.

### 🔴 2. InfoRow 추출 → **PR-0.2 ✅ 완료 (2026-05-09)**

**원래 가정**: 양쪽 InfoRow 패턴 동일 또는 유사.

**실제 audit (PR 진행 중 발견)**: 시각 다름 — platform 은 inline row (12px, no border), edge 는 table-row (uppercase + 110px label + 행간 border).

**채택 옵션**: A (시각 통일, D-013) — ui 표준 1개 (no uppercase, weight 600 label, no border).

**채택 ui API** (props 0, ~28줄):
```tsx
<InfoRow>
  <InfoRowLabel>Field</InfoRowLabel>
  <InfoRowValue>123</InfoRowValue>
</InfoRow>
```

**결과**:
- ui: `info-row.tsx` 신설 (`@ingradient/ui` re-export)
- platform: `ImageDetailInfoPanel.tsx` ~30 행 + `image-detail-modal.styles.info.ts` 의 3 local styled 제거
- edge: `NicStatusCard.tsx` ~25 행 + `ConnectionTab.styles.ts` 의 3 local styled 제거
- typecheck 통과 (양 repo)

**시각 변화**: platform 글자 약간 ↑, edge uppercase + 110px 고정폭 + 행간 border 사라짐. 사용자 마지막 일괄 검증.

### 🟡 3. ui `<DiagnosticCard>` / `<StatusCard>` 패턴 → **default skip** (PR-0.2 의 InfoRow 사용으로 충분)

**현황**: edge `NicStatusCard.tsx` (~117줄) — 진단 데이터를 row 단위로 표시 + 상태 badge.

**제안**:
- 간단 버전: ui 의 `<SectionPanel>` + 위 신규 `<InfoRow>` 조합으로 충분 → ui 추가 안 함
- 복잡 버전: 진단 패턴 자체를 컴포넌트화 → `<StatusCard title rows={[{label, value, badge?}]} />`

**판단**: 일단 InfoRow 추출 후 NicStatusCard 가 그것 사용. 추가 추출 가치는 낮음.

### 🟡 4. ClassCheckboxGroup / TaskTypeButtons 추출 → **PR-A5 (CheckboxGroup) + PR-A6 (TaskTypeButtons audit)**

**현황**: 두 프로젝트의 `AddDatasetModal` 거의 동일:
- platform: `frontend/components/catalog/modals/AddDatasetModal.tsx` (~117줄)
- edge: `src/frontend/components/dataset/AddDatasetModal.tsx` (~187줄)

공통 UI:
- **TaskTypeButtons** — vertical button group + active state (`{ value, label, disabled }[]`)
- **ClassCheckboxGroup** — checkbox list with select all / deselect all + color swatch + label

**제안 추출**:
```tsx
// @ingradient/ui/inputs/checkbox-group.tsx
<CheckboxGroup
  items={[{ id, label, color? }]}
  selectedIds={Set<string>}
  onChange={(nextSet) => ...}
  renderItemLabel?={(item) => ...}
  showSelectAll?={true}
/>
```

`TaskTypeButtons` 는 이미 `<RadioGroup>` 또는 `<ModeSwitcher>` 와 의미 겹침 (택1) → **ui 의 ModeSwitcher 가 cover** 가능 여부 검증.

**도메인 무관**: ✅. class 는 generic shape `{ id, label, color }`.
**효과**: 두 modal 의 50+줄 (forEach map + checkbox + label) → 공통 컴포넌트.

**의사결정**: TaskTypeButtons 는 ModeSwitcher 로 충분한지 검토 후 결정.

### 🟡 5. `<MenuPopover>` anchor positioning prop 추가 → **PR-A3**

**현황**: platform 5-7 곳에서 `styled(MenuPopover).attrs<{$top, $left}>` 로 wrap + fixed 포지셔닝 직접 계산.

예시:
- `UserMenu.tsx:14-18`
- `CatalogRightPanel.styles.search.ts` (이미 split)
- `DashboardOverviewPanel.tsx`

**제안**: ui MenuPopover 에 `anchor?: { top, left } | DOMRect` prop 추가 → 자동 fixed 포지셔닝.

**도메인 무관**: ✅.
**props 영향**: MenuPopover 의 prop 1개 추가 (대부분 caller 가 미명시 시 기존 동작).

**효과**: 5-7 곳의 wrap styled 제거 (각 ~5-15줄).

### 🟡 6. `<TextField>` size variant 추가 → **PR-A4**

**현황**: platform 5+ 곳에서 `styled(TextField)` 로 padding/width 압축 (search field, compact form).

예시:
- `ProjectTab.tsx`
- `toolbar-styles.tsx`
- `CatalogRightPanel.styles.search.ts` 의 `ClassSearchInput`

**제안**: `<TextField size="sm" | "md" | "lg" />` 또는 `compact?: boolean`.

**도메인 무관**: ✅.
**효과**: 5+ wrap 제거.

**참고**: ui 의 `Button` 은 이미 `size` 있음. `TextField` 도 같은 패턴이 자연.

### 🟡 7. Setup/Form section 패턴 (Single-project, D-007 적용) → **PR-B1**

**현황**: edge `SetupPanel.tsx` + styles — `SetupSection`, `SetupField`, `SetupFieldLabelRow`, `SetupInlineRow` 등 form section 레이아웃 (~50줄 styled).

**도메인 무관**: ✅. 단순 layout.
**재사용 가능성**: ✅ (D-007 기준 — settings 페이지 / 다른 project 폼 등).

**제안**:
- 옵션 A: ui `FormSection` + `FieldRow` + `FieldGroup` 이미 있는 것 cover 가능 → edge SetupSection 폐기 후 ui 사용
- 옵션 B: 미세하게 다르면 ui 에 작은 prop 1-2개 추가

→ Phase 2 진행 시 ui 와 edge 의 패턴 비교 audit 후 결정.

### 🟡 8. Step indicator / progress 패턴 (Single-project but 재사용 가능) → **PR-B2**

**현황**: edge `ConnectionTab.styles.ts:141-148` — `DiagStepList`, `DiagStepRow`, `DiagStepIcon`, `DiagStepLabel` (다단계 진단 progress).

**제안**: ui `<StepIndicator status="pending|running|done|error" />` (기존 `<Stepper>` 와 의미 다름 — Stepper 는 navigation, 이건 progress).

**재사용 가능성**: setup wizard, deployment flow, long-running task — 향후 다른 project 에서도.

### 🟢 9. List item / selectable list pattern (Low-medium) → **PR-C1 (audit only)**

**현황**: 양 프로젝트의 selectable list 패턴 — clickable row + active state + drag-over.
- platform: `CatalogDatasetList` 의 `DatasetRow`
- edge: `RightPanel.tsx` 의 `ClassList`/`ClassItem`

**제안**: ui `<SelectableListItem $active onClick onDragOver />`. 또는 ui Button 의 새 variant `list-item`.

**판단**: ui Button 이 무겁다면 별도 `<ListItem>` 거리. 조사 필요.

### 🟢 10. Guide/Alert card (낮은 우선순위, 단일 사용) → **skip (default)**

**현황**: edge `ConnectionTab.styles.ts:12-30` — `GuideCard`, `GuideHeader`, `GuideTitle`, `GuideSummary`, `GuideWarningList`.

**판단**: 단일 사용 + 다른 project 에서 needs 명확 안 함 → 일단 skip. 향후 발견 시 재검토.

### 🟡 11. images-table → ui Table 적합 여부 → **PR-B3**

**현황**: platform `frontend/components/gallery/grid/images-table.tsx` — raw `<table>` styled.

**판단**: Phase 2 진행 중 ui `Table` props (column, onRowClick, sort 등) 가 images-table needs cover 가능 여부 audit. 적합 시 마이그, 안 맞으면 ui Table 확장 또는 page-specific 유지.

### 🟡 12. Filter UI → ui FilterBar/FilterBarLayout 적합 여부 → **PR-B4**

**현황**:
- platform: gallery toolbar 의 filter + sort dropdowns
- edge: ImagesView 의 filter popover

**판단**: ui `FilterBar` / `FilterBarLayout` 이미 export. 사용처 audit 후 적합한 곳만 마이그.

## 작업 우선순위 + PR 단위 (확정)

D-011 결정 — A1 + A2 는 **Phase 0 (warm-up)** 로 선행. 나머지 9 PR 은 Phase 2 (Phase 1 ImageGrid 완료 후).

### Phase 0 — Warm-up ✅ 완료

#### PR-0.1 ✅ — Edge form 마이그 (8 파일, sub-plan: pr/0-1-edge-form-import-align.md)

원래 "import 정렬" 으로 30분 가정이었으나 audit 결과 시각 차이 발견 → 옵션 A (시각 통일, D-013) 채택. 8 파일 변경 (4 sub-section + 3 추가 dead-code 포함 사용처 + styles).

#### PR-0.2 ✅ — InfoRow 신설 + 양 repo 마이그 (sub-plan: pr/0-2-info-row-extraction.md)

1. ✅ ui `<InfoRow>` 신설 (`src/components/data-display/info-row.tsx`, props 0)
2. ✅ platform `ImageDetailInfoPanel` 의 `ImageInfoRow` → `InfoRow`
3. ✅ edge `NicStatusCard.tsx` 의 `DiagRow` → `InfoRow`

### Phase 2 — 잔여 9 PR (Phase 1 완료 후)

#### PR-A3: ui MenuPopover anchor prop (1h)

1. ui `<MenuPopover anchor>` prop 추가
2. platform 5-7 wrapper styled 제거

#### PR-A4: ui TextField size variant (1h)

1. ui `<TextField size>` prop 추가
2. platform 5+ wrapper 제거

#### PR-A5: CheckboxGroup ui 추가 (1-2h)

1. ui `<CheckboxGroup>` 신설
2. 양 repo `AddDatasetModal` 의 class selection → 신규 컴포넌트
3. inline style hard-coded 값 컴포넌트 안으로 정리

#### PR-A6: TaskTypeButtons / ModeSwitcher 검토 (~30분)

ui `ModeSwitcher` cover 가능 여부 audit. 가능하면 양 repo 마이그.

#### PR-B1: Setup/Form section 패턴 정렬 (1-2h)

edge `SetupSection` 등 → ui `FormSection/FieldRow/FieldGroup` 매핑 audit + 마이그.

#### PR-B2: StepIndicator ui 신설 (1-2h)

edge `DiagStep*` → ui `<StepIndicator>` 추출.

#### PR-B3: images-table → ui Table 검토 (1h)

platform `images-table.tsx` → ui `Table` 적합 여부 + 마이그.

#### PR-B4: Filter UI ui FilterBar 검토 (1h)

gallery toolbar / edge ImagesView filter → ui `FilterBar`/`FilterBarLayout` cover 검토.

#### PR-C1: SelectableListItem 검토 (audit only)

ui `Button` 의 `list-item` variant vs 별도 `<ListItem>` 거리 결정.

## 의사결정 (확정)

- ✅ **D-011** PR 진행 순서 — Phase 0 (PR-0.1, PR-0.2) → Phase 1 → Phase 2 (A3-C1)
- ✅ **D-013** 시각 통일 우선 — PR-0.1/0.2 진행 중 합의. Phase 2 audit 도 동일 원칙 일관 적용 (master plan § 6 참조)
- ✅ **NicStatusCard** — InfoRow 사용으로 충분. 별도 StatusCard 추출 안 함 (PR-0.2)
- ✅ **TaskTypeButtons** — ModeSwitcher cover 안 됨 (use case 다름 — toolbar segment vs form question). 옵션 C 채택 — RadioCardGroup 신규 (PR-A6)
- ✅ **PR-B1 SetupPanel 옵션 A** — Group X + Y 모두 정리 (시각 통일 일관)
- ✅ **PR-B4 옵션 B** — FilterPopover 신규 (양 repo popover filter 통일)
- ✅ **PR-C1 옵션 A** — SelectableListItem 신규 (variant flat/card 로 두 use case cover)

## Phase 2 완료 결과 (2026-05-09)

9 PR 모두 완료. 결과는 master plan § 4.1 + cross-app-roadmap § Phase 2 참조.

## Concerning patterns (extraction 전 정리)

### Inline style hard-coded values (양 AddDatasetModal)

```tsx
// 현재 (양 repo)
<div style={{ maxHeight: 160, overflowY: 'auto', border: '1.5px solid ...', ... }}>
```

ClassCheckboxGroup 추출 시 이 inline style 들을 styled-components 안으로 이동. 추출 컴포넌트의 API 가 hard-coded 수치에 종속되지 않도록.

### NicStatusCard 의 DiagRow 의존

DiagRow → InfoRow 추출 시 NicStatusCard 도 같이 마이그레이션 (그렇지 않으면 styled 의존성 끊김).

## 효과 추정

| 항목 | 감소 (estimated) |
|---|---|
| edge form 정렬 | ~3 styled 제거 |
| InfoRow 추출 | ~6 styled 제거 (양 repo 합계) |
| MenuPopover wrap 제거 | ~50줄 (5-7 곳) |
| TextField wrap 제거 | ~30줄 (5+ 곳) |
| ClassCheckboxGroup | ~50줄 × 2 = 100줄 |
| Setup/Form section 정렬 | ~50줄 |
| StepIndicator | ~25줄 + 재사용 가능성 |
| **합계** | **~250+ 줄** components/ 감소, ui 추가 ~150줄 |

## Open Questions

- [ ] platform `ImageDetailInfoPanel` 의 ImageInfoRow 가 정확히 어디서 쓰이는지 (ImageDetailModal 안인지) — 마이그 시 의미 보존 필요
- [ ] edge SetupPanel 의 layout 이 ui FormSection 과 정확히 일치하는지 비교
- [ ] ui `<CheckboxGroup>` vs 그냥 `<Checkbox>` map — caller 가 직접 map 하는 게 더 간단하지 않은지 (props 추가 vs caller 자유도)
