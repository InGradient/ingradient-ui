---
plan: ingradient-ui storybook coverage 보강 (Phase 3 — 마지막 일괄)
date: 2026-05-09
audience: ingradient-ui 기여자
master plan: ../MASTER-PLAN.md
governance: ../governance.md (§ 4.4 storybook 필수, Phase 3 일괄)
phase: 3 (D-008 — Phase 0~2 의 ui 변경 완료 후 진행)
---

# Storybook Coverage Plan (Phase 3)

## 목적

ingradient-ui 의 모든 export 컴포넌트가 storybook 스토리를 가지도록 보강. 디자이너 / 소비자 개발자가 한 곳에서 시각 + 동작 확인.

## 진행 시점

D-008 결정에 따라 **Phase 3 (마지막) 에서 일괄 작성**. Phase 0~2 동안 ui 컴포넌트가 변경 (확장/추가) 가능성 큼 — 안정된 시점에 작성으로 재작성 비용 회피.

본 plan 의 PR ID 는 storybook plan 의 자체 namespace (Group A, B, C, D, E). master plan 의 Phase ID (0~4) 와 별개.

## 현황 audit (2026-05-09)

총 export 컴포넌트 ≈ 60+, 그 중 stories 있는 것 ≈ 30. **~30개 누락**.

### 최근 변경된 컴포넌트 (스토리 갱신/신설 필요)

| 컴포넌트 | 상태 | 필요 작업 |
|---|---|---|
| **Toast** (`feedback/toast.tsx`) | ✅ stories 존재 + 최근 추가된 `action` / `duration:0` 시나리오 이미 포함 | 변경 불필요 |
| **useConfirm + ConfirmDialog** | ❌ ConfirmDialog 스토리 없음, useConfirm imperative 시나리오 없음 | **신설 필요** |
| **useClickOutside** | ❌ 신규 hook, 스토리 없음 | **신설 (간단 demo)** |
| **foundation color CSS vars** | ❌ token gallery 스토리 없음 | **신설 (token list 페이지)** |
| **InfoRow** (`data-display/info-row.tsx`, PR-0.2 신설 2026-05-09) | ❌ 신규, 스토리 없음 | **신설 (기본 + 다양한 value 형태 — 단순 텍스트, badge 포함, 긴 텍스트 wrap)** |
| **ImageGrid** (PR-1.1 대체 + render slots + selection + 무한스크롤 2026-05-09) | ⚠️ 기존 stories 갱신 됨 (3 시나리오) | **시나리오 보강** (drag/contextMenu, hover preview, highlightedId, render slots 다양 형태) |
| **VirtualizedImageGrid** (PR-1.1 신설 2026-05-09) | ❌ 신규, 스토리 없음 | **신설 (대량 데이터 + columns + estimatedItemHeight + 가상화 시각 demo)** |
| **GridSelectionAction util** (PR-1.1 신설) | (util — stories 안 만듦, README/docs 만) | docs page 또는 ImageGrid stories 안 inline demo |
| **CheckboxGroup** (PR-A5 신설) | ❌ 신규 | **신설** (default + with color swatch + showSelectAll false) |
| **RadioCardGroup** (PR-A6 신설) | ❌ 신규 | **신설** (default + with disabled option) |
| **StepIndicator** (PR-B2 신설) | ❌ 신규 | **신설** (default + 다양 status 조합 — pending/running/done/error) |
| **FilterPopover + FilterPopoverSection** (PR-B4 신설) | ❌ 신규 | **신설** (popover with sections + actions slot demo) |
| **SelectableListItem** (PR-C1 신설) | ❌ 신규 | **신설** (variant flat — list 안 row + dragOver / variant card — card group) |
| **MenuPopover anchor prop** (PR-A3 갱신) | ⚠️ 기존 stories 갱신 가능 | 시나리오 추가 (anchor 사용 — fixed positioning demo) |
| **TextField size variant** (PR-A4 갱신) | ⚠️ 기존 stories 갱신 가능 | size sm/md/lg 비교 시각 demo |

### 큰 누락 (사용 빈도 높은데 스토리 없음)

**Top priority** (cross-project 핵심 컴포넌트):
1. `IconButton` (inputs/icon-button.tsx)
2. `ConfirmDialog + useConfirm` (overlays/use-confirm.tsx + dialog-shell.tsx)
3. `PopoverCard / MenuPopover / HoverCard` (overlays/popovers.tsx)
4. `DropdownSelect` (inputs/dropdown-select.tsx)
5. `Pagination` (navigation/pagination.tsx)
6. `Breadcrumbs` (navigation/breadcrumbs.tsx)

**Secondary priority**:
7. `Skeleton` (feedback/skeleton.tsx)
8. `Badge` (feedback/badge.tsx)
9. `Status / StatusPill` (feedback/status.tsx)
10. `ChipGroup` (data-display/chip-group.tsx)

**Tertiary** (chart 컴포넌트):
11. `BarChartCard / LineChartCard / PieChartCard / ChartContainer / ChartLegend` (charts/)

**Inputs 추가 누락**:
- `CopyButton`, `FilterBar`, `FormSection`, `ModeSwitcher`

**Data display 추가 누락**:
- `AssignmentRow`, `ColorSwatch`, `KeyboardShortcutHint`, `PreviewCard`, `ProgressBlock`, `ResizablePanel`, `StatCard`, `TagListPanel`

## 작업 우선순위 (Group 별)

### Group A — 최근 변경분 (선행, 작은 거리)

PR 단위 ≈ 1 PR per 컴포넌트.

#### A.1 ConfirmDialog + useConfirm 스토리

`src/components/overlays/use-confirm.stories.tsx` 신규.

시나리오:
- **Default**: `<ConfirmProvider>` + 버튼 클릭 → `await confirm({ title: '...', description: '...' })` → console.log 결과
- **Danger variant**: `confirm({ ..., danger: true })`
- **Custom labels**: `confirmLabel: 'Delete' / cancelLabel: 'Keep'`
- **No description**: title 만

참고 패턴: 기존 `dialog-shell.stories.tsx` 의 `ConfirmDialog` 데모.

#### A.2 useClickOutside hook 스토리

`src/hooks/useClickOutside.stories.tsx` 신규.

시나리오:
- **Default**: dropdown 같은 패턴 — 버튼 + popover. ref → useClickOutside → 외부 클릭 시 닫힘
- **Mousedown variant**: `event: 'mousedown'` 비교
- **Multiple refs**: button + popover 둘 다 ref. button 클릭은 outside 로 안 잡힘
- **Disabled**: `enabled: false` 시 listener 등록 안 됨 (state 토글로 demo)

#### A.3 InfoRow (PR-0.2 신설)

`src/components/data-display/info-row.stories.tsx` 신규.

시나리오:
- **Default**: 단순 label + value 텍스트
- **With Badge**: value 안에 `<Badge>` 포함 (NIC 진단 use case)
- **Long text wrap**: 긴 value 가 wrap 되는 경우
- **Multiple rows**: 여러 InfoRow 가 같이 (Container 안에서 list 분위기)

#### A.4 Foundation tokens gallery

`src/tokens/tokens.stories.tsx` 신규 (또는 기존 storybook docs 페이지 갱신).

내용:
- color: `--ig-color-white-04/06/07/08/12/18/96` 시각 swatch
- color: `--ig-color-blue-tint-12/14/16/18/28/38/42`
- color: 기존 semantic (text, surface, border, accent, danger, success, warning)
- spacing: `--ig-space-1` ~ `--ig-space-13`
- radius / shadow / typography

→ ui 사용자가 token 빨리 찾기 위함.

### Group B — 핵심 누락 (Top 6, ROI 높음)

#### B.1 IconButton

`src/components/inputs/icon-button.stories.tsx` 신규.

시나리오:
- variant: primary / secondary / ghost
- size: sm / md / lg
- tone: default / danger
- disabled
- with tooltip

#### B.2 PopoverCard / MenuPopover / HoverCard (한 파일)

`src/components/overlays/popovers.stories.tsx` 신규.

시나리오:
- `PopoverCard`: 기본 popover (title + body + footer)
- `MenuPopover`: dropdown 메뉴 (item list)
- `HoverCard`: 호버 시 표시 (preview)
- 각각 trigger 변형 (button click / hover / programmatic)

#### B.3 DropdownSelect

`src/components/inputs/dropdown-select.stories.tsx` 신규.

시나리오:
- options 5개 / disabled / custom render / multi-select (있으면)

#### B.4 Pagination

`src/components/navigation/pagination.stories.tsx` 신규.

#### B.5 Breadcrumbs

`src/components/navigation/breadcrumbs.stories.tsx` 신규.

#### B.6 ImageGrid (Phase 1 결과 반영) — 갱신 + 추가

`src/components/data-display/image-grid.stories.tsx` (현재 PR-1.1 기준 3 시나리오) 시나리오 보강.

추가 시나리오 (Phase 1 마이그 패턴 demo):
- **Catalog-style overlay** (kebab + archive + processing — caller 패턴 demo)
- **Drag & context menu** (onDragStart + onContextMenu)
- **Hover preview** (onCellMouseEnter / Leave + caller 의 floating preview)
- **Highlighted ID** (highlightedId 자동 scrollIntoView)
- **Selection action 분류** (single / toggle / range — modifier 키 demo)

신규 stories: `virtualized-image-grid.stories.tsx`
- **Default virtualized** (대량 데이터 + fixed columns)
- **Dynamic columns** (resize 따라 columns 변경 — caller 가 ResizeObserver)
- **Infinite scroll** (hasMore + onLoadMore)
- **With render slots** (재사용)

### Group C — Secondary (작은 거리들)

`Skeleton, Badge, Status, ChipGroup` — 각각 30분 정도.

### Group D — Chart 컴포넌트

`BarChartCard, LineChartCard, PieChartCard, ChartContainer, ChartLegend` — sample data 로 시각 데모.

### Group E — 잔여 누락 일괄

`CopyButton, FilterBar, FormSection, ModeSwitcher, AssignmentRow, ColorSwatch, KeyboardShortcutHint, PreviewCard, ProgressBlock, ResizablePanel, StatCard, TagListPanel`.

각 컴포넌트 default + 기본 variant 만. 짧고 단순.

## 스토리 작성 표준 (모든 PR 동일)

### 파일 구조

```tsx
import type { Meta, StoryObj } from '@storybook/react-vite'
import { expect } from 'storybook/test'
import { ComponentName } from './component-name'
import { StorybookCard, StorybookGrid, StorybookPage, StorybookSection } from '@storybook-support/storybook-layout'

const meta = {
  title: 'Components/<Category>/<ComponentName>',
  component: ComponentName,
  tags: ['autodocs'],
  parameters: {
    layout: 'fullscreen',
    a11y: { test: 'todo' },
  },
} satisfies Meta<typeof ComponentName>

export default meta

type Story = StoryObj<typeof meta>

export const Review: Story = {
  args: { ... },
  render: () => (
    <StorybookPage title="..." description="...">
      <StorybookSection title="..." description="...">
        <StorybookGrid columns="repeat(auto-fit, minmax(320px, 1fr))">
          <StorybookCard title="Default" subtitle="...">
            <ComponentName ... />
          </StorybookCard>
          <StorybookCard title="Variant A" subtitle="...">
            <ComponentName variant="a" ... />
          </StorybookCard>
        </StorybookGrid>
      </StorybookSection>
    </StorybookPage>
  ),
  play: async ({ canvas, userEvent }) => {
    // a11y interaction test
  },
}
```

### 시나리오 최소 set

각 컴포넌트:
- **Default** — 기본 사용
- **Variants** — 명시적 prop 변형 (variant / size / tone)
- **Edge case** — empty / loading / long text / disabled

### a11y test

Storybook 의 `parameters.a11y.test` 를 'todo' → 'error' (구현 검증)

## 효과

- 디자이너가 ui 컴포넌트 한 곳 보고 모든 변형 검토
- 새 프로젝트 개발자가 storybook 만 보고 사용 패턴 파악
- 컴포넌트 변경 시 storybook 으로 회귀 검증 (시각 + interaction)

## Open Questions

- [ ] **chart 스토리 sample data** — 정형 mock data set 합의
- [ ] **token gallery** 의 형식 — 기존 storybook docs 페이지 vs 별도 stories
- [ ] **a11y enforcement** — 'todo' → 'error' 시점 (전체 동시 vs 단계적)
