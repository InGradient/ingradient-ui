---
plan: ingradient-ui ↔ ingradient-platform ↔ ingradient-edge cross-app cleanup roadmap
date: 2026-05-09
master plan: ../MASTER-PLAN.md
governance: ../governance.md
related plans:
  - ./image-grid-unification.md (Phase 1)
  - ./components-audit-findings.md (Phase 0 + Phase 2)
  - ./storybook-coverage.md (Phase 3 — 마지막)
  - ./toast-enhancement.md (이미 완료)
  - ./click-outside-hook.md (이미 완료)
  - ./color-token-migration.md (이미 완료)
  - ./component-extraction.md (참고)
---

# Cross-app Cleanup Roadmap

## 큰 그림

> ingradient-platform 과 ingradient-edge 의 `components/` 폴더를 최소화. 둘이 공통으로 쓰는 패턴은 ingradient-ui 로 추출. 단, ui 는 simple 유지 — 유연성 위해 props 늘리지 않음. 도메인 별 차이는 render slot 또는 caller 책임으로 해결.

핵심 목표:
1. **소비자 components 최소화** — page-specific 한 것만 프로젝트에 남기고 generic 은 ui 로
2. **시각적 일관** — 디자이너 ui 한 곳 수정 → 양쪽 자동 적용
3. **ui simple 유지** — 200줄 미만, props 5개 이하 (각 컴포넌트), governance 준수

## 현재 상태 (2026-05-09 기준 누적)

이미 완료된 cross-app 작업:
- ✅ Toast 통합 (edge → ui useToast, ui Toast 에 action+persistent+close 추가)
- ✅ useConfirm hook + ConfirmProvider (platform 8 confirm() 마이그레이션)
- ✅ useClickOutside hook (edge 3 + platform 6 사용처 마이그레이션)
- ✅ 색상 토큰화 (rgba 218개, hex 236개 → CSS var)
- ✅ Brand blue 통일 (74,158,255 → 77,136,255)
- ✅ DialogShell 마이그레이션 (platform 9 + edge 3 modal)
- ✅ Edge AccountMenu 통합 (228줄 → 130줄)
- ✅ Spinner / TextField / PasswordField / Radio / Checkbox 마이그레이션
- ✅ LoadingState / EmptyState / ErrorState 마이그레이션 (5 파일)
- ✅ Phase 4 styles split (5 파일 200줄 미만으로)
- ✅ Governance 문서 작성

## 진행 거리 (Phase 별)

### Phase 0 — Warm-up ✅ **완료 (2026-05-09)**

Phase 1 의 본격 작업 전 quick wins. 독립 거리, 즉시 패턴 확립.

- ✅ **PR-0.1**: edge ConnectionTab 8 sub-section 의 local `Section/SectionTitle/FormGroup/FieldLabel` → ui `FormSection / SectionTitle / FieldGroup / FieldLabel` 마이그. 시각 차이 발견 (uppercase 라벨, bottom-border 헤더 vs ui 표준) → 옵션 A 채택 (시각 통일, D-013). sub-plan: [pr/0-1-edge-form-import-align.md](pr/0-1-edge-form-import-align.md)
- ✅ **PR-0.2**: ui `<InfoRow>` 신설 (props 0, ~28줄) + platform ImageDetailInfoPanel + edge NicStatusCard 마이그. sub-plan: [pr/0-2-info-row-extraction.md](pr/0-2-info-row-extraction.md)

→ 2 PR 완료. typecheck 모두 통과. 시각 검증은 마지막에 일괄 (사용자 결정).

### Phase 1 — ImageGrid 통합 ✅ **완료 (2026-05-09)**

[image-grid-unification.md](./image-grid-unification.md) 참조.

D-015 정신 따라 PR 순서 변경: 1.1 → 1.3 → 1.4 → 1.5 → 1.2 (test 마지막).

- ✅ **PR-1.1**: ui ImageGrid 신규 (대체) + VirtualizedImageGrid + helpers (image-grid-cell, use-grid-selection)
- ✅ **PR-1.3**: platform classes ClassImagesPanel 마이그 — 200 → 147줄
- ✅ **PR-1.4**: platform catalog virtualized-image-grid 4 파일 (553줄) → CatalogImageGrid + HoverPreview (-365줄)
- ✅ **PR-1.5**: edge ImagesView grid 부분 — 1442 → 1270줄 (-172, 11.9%)
- ✅ **PR-1.2**: 단위 test 16 시나리오, 전체 124/124 통과

→ Phase 1 진행 중 ui API 자연 보완 (D-015): `index` callback 시그니처, `onDragStart` / `onContextMenu` / `onCellMouseEnter/Leave` / `highlightedId` props.

### Phase 2 — 작은 audit 거리 ✅ **완료 (2026-05-09)**

9 PR 모두 완료 (sub-plan: `pr/2-*.md` 7개 — B2/B3/C1 은 단순 마이그). D-013 (시각 통일) 일관 적용으로 옵션 변경된 PR 다수 (A6 옵션 C, B1 옵션 A, B4 옵션 B, C1 옵션 A).

ui 신규 컴포넌트 (Phase 2 결과):
- CheckboxGroup, RadioCardGroup, StepIndicator, FilterPopover + FilterPopoverSection, SelectableListItem
- TextField + PasswordField forwardRef + size variant
- MenuPopover forwardRef + anchor prop

(이하 상세 audit 거리 — 참고로 보존)

상세 plan: [components-audit-findings.md](./components-audit-findings.md)

(A1 + A2 는 Phase 0 으로 선행). 잔여 9 PR:

#### Group A — ui props 추가 + 추출 (먼저)

- **A3**: ui `MenuPopover` 에 `anchor` prop 추가 + platform 5-7 wrap 제거 (1h)
- **A4**: ui `TextField` 에 `size` prop 추가 + platform 5+ wrap 제거 (1h)
- **A5**: ui `<CheckboxGroup>` 추가 + 양 `AddDatasetModal` class selection 마이그 (1-2h)
- **A6**: TaskTypeButtons → ui `ModeSwitcher` cover 가능 여부 audit + 마이그 (30m)

#### Group B — Single-project but 재사용 가능 (D-007 적용)

- **B1**: edge `SetupSection` 등 → ui `FormSection`/`FieldRow` 정렬 audit + 마이그 (1-2h)
- **B2**: edge `DiagStep*` → ui `<StepIndicator>` 신설 + 마이그 (1-2h)

#### Group C — 기존 거리 (audit 결과 추가 정리)

- **B3**: platform `images-table.tsx` → ui `Table` 적합 여부 audit + 마이그 (1h)
- **B4**: gallery toolbar / edge ImagesView filter → ui `FilterBar`/`FilterBarLayout` cover 검토 (1h)
- **C1**: SelectableListItem 패턴 검토 (ui Button list variant vs 신규 `<ListItem>`) (audit only)

소요 추정: 1.5-2일 (PR 9개).
효과 추정 (Phase 0 + Phase 2 합계): components/ ~250+ 줄 감소, ui 추가 ~150줄.

### Phase 3 — Storybook 보강 (마지막)

상세 plan: [storybook-coverage.md](./storybook-coverage.md). PR ID 는 storybook plan 의 Group ID (Phase 2 의 A3-C1 와 별도 namespace).

**왜 마지막?** Phase 1+2 진행 중 ui 컴포넌트 변경 가능성 큼. storybook 먼저 작성 시 재작성 비용. 안정된 시점에 일괄 작성.

- **STB Group A** (최근 변경분 신설): ConfirmDialog+useConfirm, useClickOutside, Foundation tokens — 3 PR
- **STB Group B** (핵심 누락 Top 6): IconButton, Popovers, DropdownSelect, Pagination, Breadcrumbs — 5 PR + ImageGrid (Phase 1 결과 반영) — 6 PR
- **STB Group C/D/E** (잔여 일괄): Skeleton/Badge/Status/ChipGroup, Chart 류, 그 외 누락 컴포넌트 — ~5 PR

소요 추정: 2-3일.

### Phase 4 — 디자인 시스템 expansion (장기)

낮은 우선순위, 단계적:
- 디자이너가 light mode 도입 결정 시 token swap (이미 token 화 되어 있어 가능)
- 새 spacing/radius/shadow 단계 (사용처 발견 시)
- semantic color 추가 (`--ig-color-warning-soft` 등 변형)
- ui 컴포넌트 새 추가 거리 (소비자 needs 발견 시 → ui PR)

## 큰 거리 vs 작은 거리

| 거리 | 크기 | ROI | 우선순위 |
|---|---|---|---|
| Phase 1 ImageGrid 통합 | 큼 | 매우 높음 (components 큰 감소) | 🔴 1 |
| Phase 2 작은 audit 거리 (Form/Filter/Table + components 폴더 audit) | 중 | 중-높음 | 🔴 2 |
| Phase 3 Storybook 보강 일괄 | 작음-중 | 중 (안정 후 효과 큼) | 🟡 3 |
| Phase 4 디자인 system expansion | 큼 | 낮음 (장기) | 🟢 후순 |

## 진행 원칙

1. **plan-first** — 모든 PR (작은 PR 포함) 은 구현 전 plan 문서 작성 → 사용자 합의 → 구현 (D-012, master § 9.1)
2. **PR 작게** — 1 PR 1 컴포넌트 또는 1 사용처. 200줄 diff 권장
3. **PR scope 고정** — 진행 중 발견한 부족 / 추가 거리는 다음 PR plan 에 반영 (현재 PR scope 확장 X)
4. **시각 회귀 매 PR** — `npm run dev` (platform) / `npm run dev` (edge) 으로 매 변경 확인
5. **typecheck 필수** — 매 PR 마지막 검증 (`npx tsc --noEmit`)
6. **storybook 은 Phase 3 일괄** — Phase 0~2 동안 ui 변경 잦으므로 안정 후 작성 (D-008)

## 측정 지표

| 지표 | 시작 (2026-05-09 이전) | 현재 | 목표 |
|---|---|---|---|
| platform 소비자 components 줄수 (image grid 관련) | 953 (553+200+200) | **288** ✅ (catalog 141 + classes 147) | ~280 (목표 거의 달성) |
| edge ImagesView 줄수 | 1442 | **1270** ✅ | ~1300 (초과 달성) |
| ui 컴포넌트 storybook coverage | ~50% | ~50% | 100% — **Phase 3 완료 시** |
| ui ImageGrid 줄수 (단일) | 110 | 111 (split 후 단일 200 미만 유지) | 200 미만 |
| 200줄 위반 styles | 12+ (양쪽) | 0 (platform 완료) | 0 |
| edge local form re-export (Section/FormGroup 등) | 4 | **0** ✅ (PR-0.1 완료) | 0 |
| InfoRow / DiagRow 중복 styled | 6 | **0** ✅ (PR-0.2 완료) | 0 |
| ui test count | ~108 | **124** ✅ (PR-1.2 신규 16) | — |
| Phase 2 ui 신규 컴포넌트 | 0 | **7** ✅ (CheckboxGroup, RadioCardGroup, StepIndicator, FilterPopover+Section, SelectableListItem) | 7 |
| Phase 2 styled 정리 (양 repo 합) | ~250+ | **약 -300줄** ✅ | -300+ |

## 확인 후 진행 절차

1. 본 roadmap 문서 + 하위 plan 4건 (governance, image-grid, components-audit-findings, storybook) 사용자 review (master plan § 8 참조 list)
2. 합의 후 Phase 0 (warm-up) → Phase 1 (ImageGrid) → Phase 2 (잔여) → Phase 3 (storybook) 순서로 진행
3. 각 PR 마다 (master plan § 9.1 절차):
   - plan 의 step 따라 구현 (각 PR plan 미리 작성, D-012)
   - typecheck (`npx tsc --noEmit`)
   - 사용자 시각 검증 후 다음 PR
   - storybook 작성은 Phase 3 일괄 (D-008)

## 의사결정 record (확정)

- ✅ **D-007** ui 추가 기준 — 도메인 무관 + 외부 store 무관 + 재사용 가능성. 1 프로젝트라도 OK (사용자 명시)
- ✅ **D-008** Phase 순서 — ImageGrid → 작은 audit → Storybook (마지막) → expansion (사용자 명시)
- ✅ **D-009** edge custom Button 25+ — 거부 명단 추가 (page-specific)
- ✅ **D-013** 시각 통일 우선 — 도메인별 시각 의도 (uppercase, bottom-border 등) 보다 ui 표준. 사용자 명시 — "시각 통일이 중요한 것 같아. 세밀한 건 다 수정하고 조절 해보자" (PR-0.1 진행 중)
- ✅ **D-014** edge ui 의존 — github tarball install. 개발 시 lib sync 필요 (master plan § 6 D-014 참조)
- ⏳ **`VirtualizedImageGrid` split 시점** — Phase 1 진행 중 결정 (단일 ImageGrid 200줄 넘으면 split, 아니면 단일 유지)
- ⏳ **각 audit 결과** — Phase 2 진행 중 결정 (audit 후 ui 이전 vs 유지)
