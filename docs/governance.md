---
plan: ingradient-ui governance — 무엇을 ui 로 보내고, 무엇을 프로젝트에 두는가
date: 2026-05-09
audience: ingradient-ui 기여자 + ingradient-platform / ingradient-edge / 새 프로젝트 개발자
---

# ingradient-ui Governance

> "Simple is the best." ingradient-ui 는 ingradient-platform, ingradient-edge, 향후 다른 프로젝트들이 모두 가져다 쓸 수 있는 **얇고 단순한 design system** 으로 유지한다. 유연성을 위해 props 를 늘리지 않는다. 1 컴포넌트 1 책임.

**관련 문서**:
- [MASTER-PLAN.md](./MASTER-PLAN.md) — 전체 작업의 entry point + 의사결정 record (D-001~)
- 작업 방식: plan-first + iteration (master plan § 9.1 / § 9.5)

## 1. 핵심 원칙

### 1.1 ui 의 역할
- 시각적 일관성 (color, spacing, typography, motion) 의 단일 truth source
- 자주 쓰이는 패턴 (button, modal, dropdown, toast, dialog, table, image grid 등) 의 공통 컴포넌트
- 디자이너가 ui 한 곳만 수정하면 모든 소비자에 자동 적용
- **소비자 `components/` 폴더 최소화** — 재사용 가능성이 있으면 적극적으로 ui 로 추출

### 1.2 ui 의 비-역할
- 비즈니스 로직 (api 호출, store, 도메인 state 관리) — **금지**
- 페이지/feature 별 layout (Dashboard 의 widget 배치, Catalog 의 left/center/right 패널 분배 등) — **금지**
- 도메인 데이터 / model 에 직접 의존 (e.g. `Dataset` shape 받음) — **금지**
- 기능 풀 (rich text editor, calendar with timezone, advanced data grid 등) — **금지**

## 2. ui 에 추가할지 / 프로젝트 components 에 둘지 결정 트리

```
새 컴포넌트가 필요한가?
├─ 비슷한 컴포넌트가 ui 에 이미 있는가?
│  ├─ Yes → 그것 사용 + props 부족 시 작은 prop 1-2개 추가 검토
│  └─ No → 다음 단계
│
└─ governance 의 ui 추가 기준 (§ 2.1) 만족하는가?
   ├─ Yes → ui 추가 — 현재 1 프로젝트만 써도 OK
   └─ No → 프로젝트 components/
```

### 2.1 ui 에 추가하는 기준 (모두 만족)

| 조건 | 설명 |
|---|---|
| **재사용 가능성 있음** | 현재 1 프로젝트라도 다른 프로젝트에서 비슷한 needs 가 생길 수 있으면 ui 후보 — **소비자 components 최소화 목표 우선** |
| **도메인 무관** | `Dataset` 이 아닌 `{ id, name }` 같은 generic shape. 도메인 model 받지 않음 |
| **외부 store 무관** | zustand, react-query 등 의존 X. 모든 state 는 props 또는 caller 가 관리 |
| **props ≤ 5 (권장)** | 단순 인터페이스. 더 필요하면 render slot 또는 다른 컴포넌트 거리 |
| **파일 ≤ 200줄 (필수)** | 200줄 넘으면 split |

판단 우선순위: **도메인 무관 + 재사용 가능성** > props 개수 / 줄수 (둘은 split 으로 해결 가능).

### 2.2 프로젝트 components/ 에 두는 기준

| 조건 | 설명 |
|---|---|
| 도메인 데이터 직접 받음 | 예: `<DatasetCard dataset={EdgeDataset} />` — generic shape 으로 추출 안 되면 |
| 비즈니스 로직 포함 | api 호출, mutation, store dispatch 등 |
| 페이지/feature 의 큰 조각 | 예: `<CatalogLeftPanel>`, `<ImageDetailModal>` — layout-specific |
| ui 컴포넌트 조립 + 도메인 wrapping | ui 의 `<Button>`, `<DialogShell>` 등을 도메인 logic 으로 묶어쓰는 경우 |

→ 단순 1 프로젝트 사용은 components/ 두는 사유로 충분하지 않음. **재사용 가능성 + 도메인 무관 ↔ 둘 다 만족하면 ui**.

## 3. ui 컴포넌트 사용 시 규칙 (consumer 측)

### 3.1 customize 는 최소화

**원칙**: ui 컴포넌트를 가져온 직후 `styled()` 으로 wrap 해서 색/spacing 바꾸는 것은 **다음 경우에만 허용**:
1. **token level 수정** (e.g. background → 도메인 token) — OK
2. **layout 적응** (width/height/margin) — OK
3. **inner 스타일 override** (e.g. button 의 padding 전체 변경) — **거의 금지**

`styled()` wrap 이 5줄 이상 되면 그건 ui 의 컴포넌트가 부족한 신호 → ui 의 props 추가 또는 새 컴포넌트 거리.

```tsx
// ❌ 안 됨 — ui Button 을 거의 새로 디자인
const FancyButton = styled(Button)`
  height: 50px;
  padding: 0 24px;
  background: linear-gradient(...);
  border: 2px dashed accent;
  &:hover { transform: scale(1.1); }
`

// ✅ OK — layout 만 적응
const ToolbarButton = styled(Button)`
  flex-shrink: 0;
`

// ✅ OK — token 변형
const DangerButton = styled(Button).attrs({ variant: 'secondary', tone: 'danger' })``
```

### 3.2 import 경로

```tsx
// 권장
import { Button, DialogShell, useToast } from '@ingradient/ui/components'
import { useClickOutside } from '@ingradient/ui'

// 비권장 (구체 경로)
import { Button } from '@ingradient/ui/components/inputs/button'
```

### 3.3 ui 가 부족할 때

ui 의 컴포넌트가 use case 를 100% cover 안 할 때 의사결정:

```
1. ui 에 작은 prop 1-2개 추가로 해결 가능?
   → ui PR (작은 거리, 디자이너 합의)
2. ui 에 새 컴포넌트 추가가 적절?
   → 본 governance 의 "ui 추가 기준" 점검 후 ui PR
3. 한 프로젝트만의 도메인 needs?
   → 프로젝트 components/ 에 작성 (ui 컴포넌트 조립 + 도메인 코드)
4. ui 의 컴포넌트를 5줄 이하로 wrap 하면 됨?
   → 프로젝트의 *.styles.ts 에 styled() wrap (단, 위 3.1 규칙)
```

## 4. ui 컴포넌트 설계 가이드 (기여자)

### 4.1 props 설계

- **render prop > prop drilling**: 도메인 별 customize 는 `renderXXX?: (item) => ReactNode` 로
- **flag → variant**: bool 3개보다 `variant: 'a'|'b'|'c'` 1개
- **default 는 보수적**: 사용자가 명시 안 했을 때 가장 단순한 동작

### 4.2 컴포넌트 크기

| 줄수 | 의미 |
|---|---|
| < 50 | ✅ 이상적 |
| 50-150 | ✅ 보통 |
| 150-200 | ⚠️ split 검토 |
| > 200 | 🚫 split 필수 |

### 4.3 styled-components 패턴

- foundation token (`--ig-color-*`, `var(--ig-space-*)`) 만 사용
- raw rgba/hex 금지 — 토큰화
- `slate925`, `surfaceRaised` 같은 semantic 도 권장
- 사용자 prop (`$active`, `$tone`) 으로 variant 분기

### 4.4 storybook

- 모든 export 컴포넌트 `*.stories.tsx` 필수
- 시나리오: default + variant 각각 + edge case (empty, loading, long text 등)
- a11y test 활성화

**작성 시점**: D-008 결정에 따라 **Phase 3 에서 일괄 작성** (master plan § 4.4 / cross-app-roadmap Phase 3 참조). Phase 0~2 동안 ui 컴포넌트 변경 가능성 있어, 안정된 시점에 일괄 작성으로 재작성 비용 회피. 단, 신규 컴포넌트 추가 시 Phase 3 에 반영하기 위해 plan 문서 (`storybook-coverage.md`) 갱신 필요.

### 4.5 test

- `*.test.tsx` (vitest + @testing-library/react)
- 단순 컴포넌트는 a11y + render 만, 복잡한 (selection, drag) 컴포넌트는 interaction test

## 5. 의사결정 권한

- **소비자 needs 가 발견되었을 때**: 소비자 개발자가 ui PR 거리 작성
- **새 컴포넌트 추가**: 디자이너 + ui 메인테이너 합의
- **기존 컴포넌트 props 추가**: 디자이너 합의 (UX 영향 시) + ui 메인테이너 review
- **token 추가/변경**: 디자이너 권한 (단, 실제 사용처 audit 후)

## 6. 거부 명단 (ui 에 안 들어갈 것)

명시적으로 ui 에 안 두기로 합의된 것 (master plan § 6 의사결정 record 와 동기):

- **AccountMenu** (cross-app) — domain 차이 큼 (TopBar 의 prefillCredentials, DatasetSelect 의 단순 logout) [D-003]
- **image-detail-modal** — 95vw + sidebar+tabs+bbox layout, page-specific [D-004]
- **edge LogPanel image lightbox** — 단순 `ModalBackdrop + img`, ui 추가 가치 없음 [D-004]
- **edge ImagesView bbox modal** — `position: absolute` + custom 3-section header, page-specific [D-004]
- **catalog/gallery 의 toolbar dropdowns** — `data-*-dropdown` selector cross-component 패턴, ref refactor 비용 큼 [D-005]
- **LogDetailTable** — key-value display, ui Table (data table) 부적합 [D-006]
- **edge custom Button 25+ 변형** — page-specific (IconBtn / list-item / window control / form picker) [D-009]

향후 거부 명단 추가 시 master plan § 6 에 decision record + 본 list 동기 갱신.

## 7. 정기 검토

- 분기 1회: ui 의 컴포넌트 list 검토 — 안 쓰는 것 제거, 새 거리 발견
- 분기 1회: 소비자 components/ 의 200줄 이상 파일 — split 또는 ui 거리 검토
