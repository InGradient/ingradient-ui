# INGRADIENT Storybook 디자이너 사용 가이드

## 1. Storybook의 역할

INGRADIENT에서 Storybook은 단순히 버튼, 카드, 테이블을 확인하는 도구가 아닙니다.

Storybook은 다음을 위한 작업 공간입니다.

```txt
실제 제품 화면 확인
서비스별 UI 버전 확인
상태별 화면 검증
컴포넌트 조합 실험
신규 UX 실험
개발자에게 기준 화면 전달
```

즉, 디자이너는 Storybook에서 실제 React 컴포넌트로 구성된 화면을 보면서 UI를 검토하고, 필요한 조합과 상태를 확인합니다.

---

# 2. 기본 화면 구조

Storybook은 크게 다음 영역으로 나뉩니다.

```txt
왼쪽 Sidebar
= Story 목록 선택

중앙 Canvas
= 실제 화면 미리보기

오른쪽 또는 하단 Controls Panel
= props / variant / layout / state 조정

상단 Toolbar
= viewport, theme mode, background 등 전역 보기 옵션 조정

Docs Tab
= 사용 규칙, 설명, handoff 정보 확인
```

디자이너가 가장 많이 사용하는 영역은 다음 네 곳입니다.

```txt
왼쪽 Sidebar
중앙 Canvas
Controls Panel
상단 Toolbar
```

---

# 3. 서비스, 버전, 페이지 선택 방법

서비스와 버전은 상단 Toolbar에서 선택하지 않습니다.
서비스마다 버전 체계와 페이지 구성이 다르기 때문에, 왼쪽 Sidebar의 폴더 구조로 선택합니다.

현재 구조는 다음과 같습니다.

```txt
Pages
├─ Platform
│  └─ 0.0.1
│     ├─ Auth / Login
│     ├─ Auth / Signup
│     ├─ Catalog
│     ├─ ClassManage
│     └─ CreateProject
│
├─ Edge
│  └─ 0.0.1
│     ├─ Login
│     ├─ License
│     └─ DatasetSelect
│
└─ Medical
   └─ 0.0.1
      ├─ Auth
      ├─ ProjectPicker
      └─ ClassWorkspace
```

예를 들어:

```txt
Pages / Platform / 0.0.1 / Catalog / Default
```

를 선택하면:

```txt
INGRADIENT Platform 0.0.1 버전의 Catalog 기본 화면
```

을 보는 것입니다.

새 버전을 만들면 동일한 구조로 `Pages / Platform / 0.1.0 / Catalog` 같이 추가됩니다.

---

# 4. 디자이너의 기본 작업 순서

## Step 1. 왼쪽 Sidebar에서 기존 버전 확인

새 버전을 작업하기 전에 먼저 기존 버전을 봅니다.

예:

```txt
Pages / Platform / 0.0.1 / Catalog
```

여기서 확인할 것:

```txt
현재 화면 구조
유지할 UX
바꿔야 할 UX
정보 밀도
버튼 위치
테이블/카드 구조
우측 패널 구조
```

---

## Step 2. 새 버전으로 이동

기존 화면을 확인한 뒤 새 버전으로 이동합니다.

예:

```txt
Pages / Platform / 0.1.0 / Catalog
```

이제 이 화면이 새 디자인 작업 기준이 됩니다.

---

## Step 3. 중앙 Canvas에서 전체 화면 확인

중앙 Canvas에는 실제 제품 화면처럼 구성된 UI가 표시됩니다.

디자이너는 여기서 전체 레이아웃을 확인합니다.

확인할 것:

```txt
전체 정보 구조가 자연스러운가?
주요 버튼이 잘 보이는가?
테이블/카드 밀도가 적절한가?
우측 패널이 너무 무겁지 않은가?
상단 toolbar가 명확한가?
사용자가 다음 행동을 알 수 있는가?
```

---

# 5. 상태별 화면 확인 방법

상태는 상단 Toolbar에서 선택하지 않고, Story variant로 나눕니다.

예:

```txt
Pages / Platform / 0.0.1 / Catalog
├─ Default
├─ Empty
├─ Loading
├─ Permission Denied
├─ Huge Dataset
├─ Long Names
├─ Many Items
├─ Syncing
├─ Multi Selection
├─ Export Ready
├─ Grid View
├─ Compact Sidebar
└─ No Right Panel
```

디자이너는 왼쪽 Sidebar에서 각 상태를 직접 클릭해 확인합니다.

반드시 확인해야 하는 공통 상태:

```txt
Default
Empty
Loading
Error / Permission Denied
Long Text
Many Items
Dark Mode (상단 Toolbar)
Compact Mode (상단 Toolbar)
Small Screen (상단 Toolbar Viewport)
```

페이지에 따라 추가 상태가 있습니다. 예 (Catalog):

```txt
Syncing
Multi Selection
Export Ready
Huge Dataset
```

---

# 6. Storybook UI에서 조정하는 방법

디자이너가 화면을 조정할 때는 주로 **Controls Panel**을 사용합니다.

Controls Panel은 Storybook 화면의 오른쪽 또는 하단에 표시됩니다.

여기서 화면의 옵션을 바꿀 수 있습니다.

예를 들어 Catalog Page에서는 다음 옵션을 조정할 수 있습니다.

```txt
viewMode: table / grid
sidebar: expanded / compact / hidden
rightPanel: open / closed
filterStyle: chips / dropdown / side-panel
tableDensity: comfortable / compact / dense
selectionMode: single / multi
scenario: default / empty / loading / huge-dataset / syncing …
```

디자이너는 Controls Panel에서 값을 바꿔보면서 중앙 Canvas의 화면이 어떻게 변하는지 확인합니다.

예:

```txt
viewMode = table → grid
rightPanel = closed → open
tableDensity = comfortable → compact
filterStyle = dropdown → chips
```

이렇게 조정하면 실제 화면이 즉시 바뀌어야 합니다.

---

# 7. 조정값을 다루는 기준

Controls Panel에서 바꾼 값은 기본적으로 “실험값”입니다.

즉, 바로 코드에 저장되는 것은 아닙니다.

작업 방식은 단계적으로 운영합니다.

## 초기 운영 방식

```txt
1. 디자이너가 Controls Panel에서 조합을 실험
2. 마음에 드는 조합을 확인
3. 해당 Story 이름과 조정값을 개발자에게 전달
4. 개발자가 story/page config에 반영
```

예:

```txt
기준 Story:
Pages / Platform / 0.1.0 / Catalog / Default

확정 조정값:
viewMode = table
sidebar = compact
rightPanel = open
filterStyle = chips
tableDensity = compact
selectionMode = multi
```

## 추후 고도화 방식

나중에는 Storybook에 저장 기능을 추가할 수 있습니다.

```txt
Save as Draft
Export Config
Save as Sandbox
Save as New Version
```

하지만 초기에는 Controls에서 실험하고, 확정값을 개발자가 반영하는 방식으로 시작합니다.

---

# 8. 전체 디자인 톤을 조정하는 방법

전체 색상, 간격, radius, density 같은 디자인 톤은 개별 Page가 아니라 `Foundations` 또는 `ThemeBuilder`에서 확인합니다.

왼쪽 Sidebar에서 다음을 엽니다.

```txt
Foundations / Token Overview
  - Colors
  - Spacing
  - Radius
  - Typography
  - Shadows
  - Motion
```

Density는 Foundations이 아니라 상단 Toolbar의 전역 control 로 분리되어 있습니다 (§ 11).

전체 톤을 실험하려면:

```txt
Builders / ThemeBuilder
```

여기서 확인하거나 조정할 수 있는 항목:

```txt
Primary Color
Surface Color
Text Color
Border Contrast
Radius Scale
Shadow Strength
Typography Scale
Density
```

디자이너는 여기서 전체 제품 분위기를 확인합니다.

예:

```txt
Platform 0.1.0은 기존보다 더 compact한가?
Dark mode에서 contrast가 충분한가?
공장/검사 화면에 맞게 border가 명확한가?
카드 radius가 너무 부드럽지는 않은가?
```

---

# 9. 화면 구조를 조정하는 방법

전체 페이지 구조가 마음에 들지 않으면 `Patterns`를 확인합니다.

예:

```txt
Patterns / SidebarShell
Patterns / Shell And Layouts
Patterns / Workspace Blocks
Patterns / Dashboard Grid
Patterns / Form Sections
Patterns / AnnotationToolbar
Patterns / LabelingCanvas
Patterns / MediaDialogShell
Patterns / Overlay Blocks
```

Patterns에서도 Controls Panel을 사용해 구조를 조정합니다.

예 (pattern마다 노출되는 control 은 다름):

```txt
sidebar state: expanded / compact / hidden
shell layout: single / split / triple
panel mode: overlay / fixed / collapsible
density: comfortable / compact / dense
```

사용 방식:

```txt
1. Pages에서 문제 발견
2. 관련 Pattern으로 이동
3. Controls Panel에서 구조 조정
4. 다시 Pages로 돌아와 전체 화면 확인
```

---

# 10. 개별 컴포넌트를 조정하는 방법

특정 UI 부품 자체가 문제라면 `Components`를 봅니다.

Components는 도메인이 아닌 역할별로 그룹화되어 있습니다.

```txt
Components / Data Display    (Table, ImageGrid, PreviewCard, StatCard, ChipGroup …)
Components / Feedback        (Alert, Badge, StatusPill, EmptyState, Spinner, Toast …)
Components / Inputs          (Button, IconButton, SearchField, DropdownSelect, FilterBarLayout …)
Components / Navigation      (Tabs, Pagination, Breadcrumbs, VerticalTabs …)
Components / Overlays        (DialogShell, Drawer, Popovers, Tooltip, ContextMenu …)
Components / Surfaces        (Card, Panel 등)
Components / Charts          (ChartContainer, ChartLegend, Bar/Line/Pie Chart Cards)
Components / Icons           (Icon Gallery)
```

예시:

```txt
Components / Feedback / StatusPill
Components / Data Display / Table
Components / Data Display / PreviewCard
Components / Inputs / FilterBarLayout
```

Components에서도 Controls Panel을 사용합니다.

예:

```txt
variant: default / outlined / elevated / minimal
size: sm / md / lg
tone: accent / warning / danger / neutral
selected: true / false
loading: true / false
longText: true / false
```

디자이너는 여기서 컴포넌트 단위의 상태를 확인합니다.

예:

```txt
StatusPill이 running 상태에서 명확한가?
PreviewCard가 selected 상태에서 충분히 강조되는가?
Alert가 danger 상태에서 너무 과하게 보이지 않는가?
긴 이름이 들어갔을 때 깨지지 않는가?
```

---

# 11. 상단 Toolbar에서 확인하는 것

서비스, 버전, 상태는 상단 Toolbar에서 선택하지 않습니다.

상단 Toolbar는 전역 보기 옵션 위주로 사용합니다.

예 (현재 구성):

```txt
Viewport: Mobile / Tablet / Laptop / Desktop / Factory Monitor
Mode:     Inherit / Light / Dark / High Contrast
Density:  Inherit / Comfortable / Compact / Ultra Dense
Locale:   한국어 / English
```

디자이너가 주로 확인할 것:

```txt
Desktop / Factory Monitor 에서 정상인가?
Tablet 크기에서도 깨지지 않는가?
작은 화면 (Mobile) 에서 panel이 너무 좁지 않은가?
Dark mode 에서도 contrast가 맞는가?
Compact / Ultra Dense 에서 정보 밀도가 적절한가?
```

---

# 12. 새로운 아이디어는 Sandboxes에서 실험

정식 버전에 바로 넣기 애매한 디자인은 `Sandboxes`에서 먼저 실험합니다.

현재 등록된 Sandbox (공용 실험실):

```txt
Sandboxes / Theme Lab
Sandboxes / Hooks Lab
Sandboxes / Interaction Utils Lab
Sandboxes / State Matrix
```

새로운 페이지 실험은 `Sandboxes / <Service> / <실험이름>` 형태로 추가합니다.

```txt
Sandboxes / Platform / <실험이름>
Sandboxes / Edge / <실험이름>
Sandboxes / Medical / <실험이름>
```

Sandbox에서는 자유롭게 조합을 실험합니다.

실험 예:

```txt
새로운 sidebar 구조
새로운 catalog card view
AI assistant panel
dense dashboard
```

괜찮다고 판단되면 정식 버전으로 승격합니다.

```txt
Sandboxes / Platform / <실험이름>
→ Pages / Platform / 0.1.0 / Catalog
```

또는 다음 버전으로 넘깁니다.

```txt
Sandboxes / Platform / <실험이름>
→ Pages / Platform / 0.2.0 / Catalog
```

---

# 13. 개발자에게 전달하는 방법

디자인이 확정되면 다음 정보를 개발자에게 전달합니다.

```txt
적용 대상:
Platform Catalog Page

기준 Story:
Pages / Platform / 0.1.0 / Catalog / Default

확정 조정값:
viewMode = table
sidebar = compact
rightPanel = open
filterStyle = chips
tableDensity = compact
selectionMode = multi

확인해야 할 상태:
- Empty
- Loading
- Error
- Permission Denied
- Huge Dataset
- Long Names

사용 Preset:
src/tokens/presets/platform/0.1.0

사용 Fixture:
stories/fixtures/platform/0.1.0/datasets

개발 연결:
mock datasets → 실제 useDatasets()
mock export action → 실제 exportDataset()
mock selected state → 실제 selected state
```

개발자는 이 Storybook 화면을 기준으로 실제 Platform에 연결합니다.

목표는 다음입니다.

```txt
Storybook = mock data / mock action
Platform = real data / real action
```

---

# 14. Platform 0.1.0 작업 예시

`platform 0.1.0`을 만든다면 디자이너는 이렇게 진행합니다.

```txt
1. 왼쪽 Sidebar에서 Pages / Platform / 0.0.1 / Catalog 확인
2. 기존 화면의 문제점과 유지할 구조 확인
3. Pages / Platform / 0.1.0 / Catalog로 이동
4. 중앙 Canvas에서 전체 화면 확인
5. Controls Panel에서 viewMode, rightPanel, tableDensity, filterStyle 조정
6. Default / Empty / Loading / Permission Denied / Huge Dataset 상태를 각각 클릭해서 확인
7. 구조 문제가 있으면 Patterns / SidebarShell 또는 Shell And Layouts 확인
8. 부품 문제가 있으면 Components / Data Display / Table 또는 Components / Feedback / StatusPill 확인
9. 큰 변경은 Sandboxes / Platform 아래에 실험용 sandbox 를 만들어 실험
10. 확정된 Story와 Controls 조정값을 개발자에게 전달
```

---

# 15. 핵심 원칙

디자이너는 Storybook을 다음 기준으로 사용합니다.

```txt
Pages = 실제 제품 화면 확인
Story Variants = 상태별 화면 확인
Controls Panel = 조합과 옵션 조정
Patterns = 반복 UX 구조 조정
Components = 개별 UI 부품 검수
Foundations = 디자인 언어 확인
ThemeBuilder = 전체 디자인 톤 실험
Sandboxes = 신규 UX 실험
```

가장 중요한 목표는 이것입니다.

```txt
Storybook에서 본 화면이 실제 제품 화면과 최대한 같아야 한다.
```

최종적으로는:

```txt
Storybook Pages ≈ Actual Platform Pages
```

상태를 목표로 합니다.
