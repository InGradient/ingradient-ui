# INGRADIENT UI / Storybook 구조 개편안

## 1. 목적

현재 INGRADIENT UI는 공통 컴포넌트 중심으로 구성되어 있으나,
향후에는 다음 목표를 만족하는 방향으로 구조를 재설계한다.

* 서비스별 UI 진화(history) 관리
* 버전별 제품 UX snapshot 관리
* Storybook 기반 UI 실험 환경 구축
* 디자이너 중심 조합형 UI 설계 구조 구축
* 토큰 기반 테마 및 브랜드 시스템 구축
* 실제 플랫폼 코드와 UI 시스템의 역할 분리
* 제품 로직 없는 UI/UX 레이어 독립화

최종적으로는 다음과 같은 구조를 목표로 한다.

```txt
UI = ingradient-ui
서비스 로직 = ingradient-platform
```

즉, 실제 제품 동작은 platform이 담당하고,
ingradient-ui는 디자인 시스템 + UI 엔진 + Storybook 실험 환경 역할을 담당한다.

---

# 2. 핵심 설계 방향

## 2.1 계층 구조

```txt
Primitive
  ↓
Component
  ↓
Pattern
  ↓
Page
```

### Primitive

기본 UI 요소.

예:

* Button
* Input
* Select
* Modal
* Table

---

### Component

제품 도메인 UI.

예:

* DatasetCard
* TrainingJobCard
* StatusBadge
* LabelToolbar

---

### Pattern

반복 UX 구조.

예:

* Search + Table
* Master Detail
* Right Detail Panel
* Split Viewer

---

### Page

실제 서비스 화면.

예:

* Catalog Page
* Training Page
* Analytics Dashboard
* Edge Capture Page

---

# 3. 디자인 토큰 구조

디자인 토큰은 단순 색상값이 아니라,
서비스/버전별 디자인 preset 시스템으로 관리한다.

## 3.1 토큰 구조

```txt
tokens/
├─ core/
├─ semantic/
├─ themes/
├─ brands/
├─ density/
├─ modes/
└─ presets/
```

---

## 3.2 역할

### core

절대값.

예:

* spacing
* radius
* typography scale
* raw colors

---

### semantic

의미 기반 토큰.

예:

* surface-primary
* text-primary
* border-default
* status-success

컴포넌트는 반드시 semantic token만 참조한다.

---

### themes

전체 분위기.

예:

* light
* dark
* industrial
* medical

---

### brands

고객사 또는 브랜드별 조정.

예:

* finemtech
* samsung
* default

---

### density

정보 밀도.

예:

* comfortable
* compact
* ultra-dense

---

### modes

상태 기반 모드.

예:

* light
* dark
* high-contrast

---

# 4. Preset 시스템

Preset은 하나의 완성된 제품 디자인 snapshot이다.

즉:

```txt
Theme
+ Brand
+ Density
+ Token Override
```

조합을 하나의 제품 preset으로 관리한다.

---

## 4.1 Preset 구조

```txt
src/tokens/presets/
├─ platform/
│  ├─ 0.0.1/
│  └─ 0.1.0/
├─ edge/
└─ medical/
```

---

## 4.2 Preset 역할

예:

```txt
platform/0.0.1
```

은:

* 초기 MVP UI
* compact density
* industrial-dark 기반
* 기본 sidebar 구조

를 의미하는 하나의 제품 snapshot이다.

---

# 5. Storybook 구조

Storybook은 단순 컴포넌트 미리보기가 아니라,
제품 UX 실험실 역할을 수행한다.

## 5.1 최종 구조

```txt
stories/
├─ foundations/
├─ primitives/
├─ components/
├─ patterns/
├─ pages/
├─ fixtures/
├─ builders/
├─ sandboxes/
├─ guides/
├─ assets/
└─ support/
```

---

# 6. Pages 구조

Pages는 실제 제품 화면 snapshot을 관리한다.

## 6.1 구조

```txt
stories/pages/
├─ platform/
│  ├─ 0.0.1/
│  │  ├─ catalog.stories.tsx
│  │  ├─ training.stories.tsx
│  │  ├─ analytics.stories.tsx
│  │  └─ settings.stories.tsx
│  │
│  └─ 0.1.0/
│     ├─ catalog.stories.tsx
│     └─ training.stories.tsx
│
├─ edge/
└─ medical/
```

---

## 6.2 의미

```txt
service/version/page
```

구조는:

```txt
하나의 제품 버전 UI snapshot
```

을 의미한다.

예:

```txt
platform/0.0.1
```

은:

* 초기 catalog UX
* 초기 training UX
* 초기 analytics layout

전체를 포함한다.

---

# 7. Fixtures 구조

Fixtures는 Storybook용 mock data 및 UX scenario를 관리한다.

## 7.1 구조

```txt
stories/fixtures/
├─ platform/
│  ├─ 0.0.1/
│  │  ├─ preset.ts
│  │  ├─ datasets/
│  │  ├─ projects/
│  │  ├─ training/
│  │  ├─ models/
│  │  └─ permissions/
│  │
│  └─ 0.1.0/
│
├─ edge/
└─ medical/
```

---

## 7.2 역할

Fixtures는 단순 mock data가 아니라,
UX 상태 시뮬레이션 역할까지 포함한다.

예:

* empty state
* loading state
* failed training jobs
* huge enterprise dataset
* offline edge state
* permission mismatch state

---

# 8. Builders

Builders는 디자이너 중심 조합 도구이다.

## 8.1 목적

디자이너가:

* Theme 변경
* Density 변경
* Layout 조합
* Pattern 조합
* Component Variant 실험

을 Storybook 안에서 직접 수행 가능하게 한다.

---

## 8.2 구조

```txt
builders/
├─ ThemeBuilder/
├─ PageComposer/
└─ LayoutComposer/
```

---

# 9. Sandboxes

Sandboxes는 실험 공간이다.

정식 버전 이전 UX 실험을 수행한다.

## 9.1 구조

```txt
sandboxes/
├─ platform/
├─ edge/
└─ medical/
```

---

## 9.2 예시

* dense-dashboard
* ai-chat-layout
* glass-sidebar
* mobile-edge-ui

실험 결과가 안정화되면:

```txt
pages/{service}/{version}
```

으로 승격한다.

---

# 10. 역할 분리

## ingradient-ui

담당:

* 디자인 시스템
* 디자인 토큰
* 테마 시스템
* 공통 컴포넌트
* 제품 UI 컴포넌트
* UX 패턴
* 페이지 템플릿
* Storybook UX 실험 환경
* Mock 기반 workflow

절대 포함하지 않는 것:

* API 호출
* auth/session 처리
* 권한 판단 로직
* 데이터 저장/수정/삭제
* routing
* backend 연동
* AI 실행 로직

---

## ingradient-platform

담당:

* 실제 데이터 연결
* API 호출
* session/auth
* routing
* 권한 처리
* 상태 관리
* 비즈니스 로직
* AI 실행

즉:

```txt
UI = ingradient-ui
동작 = ingradient-platform
```

구조를 유지한다.

---

# 11. 최종 목표

최종적으로는:

```txt
디자이너
→ Storybook 기반 조합형 UI 설계

프론트엔드 개발자
→ 재사용 가능한 UI/UX 시스템 구축

플랫폼 개발자
→ 서비스 로직 연결
```

구조를 구축한다.

또한 Storybook을:

```txt
단순 컴포넌트 문서
```

가 아니라,

```txt
제품 UX 시뮬레이터
```

역할로 운영한다.

---

# 12. Storybook 기능 기획

## 12.1 목적

Storybook은 INGRADIENT UI의 단순 문서화 도구가 아니라,
디자이너와 개발자가 함께 사용하는 제품 UI 설계 환경으로 운영한다.

이를 위해 Storybook에는 다음 기능이 필요하다.

* 서비스/버전별 UI snapshot 탐색
* 디자인 preset 전환
* fixture/mock scenario 전환
* 화면 상태별 검증
* density/mode/viewport 전환
* page/pattern/component 조합 실험
* sandbox 기반 신규 UX 실험
* 확정된 story를 platform 구현 기준으로 전달
* 장기적으로 preset 및 page 조합 저장/생성

---

# 13. Storybook 사용자 역할

## 13.1 디자이너

주요 작업:

* 전체 디자인 preset 확인 및 조정
* page-level UI 조합 검토
* fixture를 바꿔가며 상태별 UI 검증
* sandbox에서 신규 UX 실험
* 확정된 story를 개발 기준으로 전달

---

## 13.2 UI 개발자

주요 작업:

* primitives/components/patterns 구현
* story controls 연결
* fixture system 구성
* theme/preset provider 구성
* builder 기능 구현
* Storybook과 실제 UI package 동기화

---

## 13.3 플랫폼 개발자

주요 작업:

* 확정된 story/page template을 실제 platform에 연결
* mock data를 real data로 교체
* mock action을 API action으로 교체
* routing/auth/permission/business logic 연결

---

# 14. Global Toolbar 기능

Storybook 상단 Toolbar에는 전체 작업 환경을 바꾸는 global selector를 제공한다.

## 14.1 필수 selector

```txt
Service Selector
Version Selector
Preset Selector
Mode Selector
Density Selector
Viewport Selector
Locale Selector
```

---

## 14.2 Service Selector

대상 서비스 선택.

예:

```txt
Platform
Edge
Medical
```

선택값은 다음 경로와 연결된다.

```txt
stories/pages/{service}
stories/fixtures/{service}
src/tokens/presets/{service}
```

---

## 14.3 Version Selector

서비스별 UI version 선택.

예:

```txt
0.0.1
0.1.0
0.2.0
sandbox
```

선택값은 다음 경로와 연결된다.

```txt
stories/pages/{service}/{version}
stories/fixtures/{service}/{version}
src/tokens/presets/{service}/{version}
```

---

## 14.4 Preset Selector

디자인 preset 선택.

예:

```txt
Platform Default
Industrial Dark
Factory Compact
FineMTech Factory
Medical Clean
```

Preset은 다음 조합을 포함한다.

```txt
Theme
Brand
Mode
Density
Token Override
```

---

## 14.5 Mode Selector

화면 모드 선택.

예:

```txt
Light
Dark
High Contrast
```

---

## 14.6 Density Selector

정보 밀도 선택.

예:

```txt
Comfortable
Compact
Dense
Ultra Dense
```

---

## 14.7 Viewport Selector

반응형 검증을 위한 화면 크기 선택.

예:

```txt
Desktop
Laptop
Tablet
Mobile
Factory Monitor
```

Factory Monitor는 Edge/현장 UI 검증을 위한 별도 viewport로 둔다.

---

# 15. Story Controls 기능

각 story에는 해당 컴포넌트 또는 페이지의 세부 상태를 바꾸는 controls를 제공한다.

## 15.1 Component Controls

예:

```txt
variant
size
density
status
selected
disabled
loading
error
longText
```

대상:

* Button
* Input
* DatasetCard
* TrainingJobCard
* StatusBadge
* DatasetTable

---

## 15.2 Pattern Controls

예:

```txt
toolbarPosition
filterStyle
tableDensity
selectionMode
rightPanelState
viewMode
```

대상:

* SearchAndTable
* MasterDetail
* RightPanel
* SplitViewer
* FilterToolbar

---

## 15.3 Page Controls

예:

```txt
viewMode: table / grid
sidebar: expanded / compact / hidden
rightPanel: open / closed
filterStyle: chips / dropdown / side-panel
tableDensity: comfortable / compact / dense
selectionMode: single / multi
```

대상:

* Platform Catalog
* Platform Training
* Analytics Dashboard
* Edge Capture
* Medical Viewer

---

# 16. Fixture / Scenario Selector

Page story에는 반드시 fixture 또는 scenario selector를 제공한다.

## 16.1 목적

기본 화면뿐 아니라 실제 서비스에서 발생 가능한 상태를 검증하기 위함이다.

---

## 16.2 공통 scenario

```txt
Default
Empty
Loading
Error
Permission Denied
Long Text
Many Items
Small Screen
Dark Mode
Compact Mode
```

---

## 16.3 Platform Catalog scenario

```txt
Default Datasets
Empty Dataset
Huge Dataset
Long Dataset Names
Syncing Dataset
Permission Denied
Server Error
Multi Selection
Export Ready
```

---

## 16.4 Platform Training scenario

```txt
No Model
Queued
Running
Completed
Failed
Paused
No GPU Available
Resume Available
Evaluation Complete
```

---

## 16.5 Edge scenario

```txt
Camera Connected
Camera Disconnected
Offline Mode
Capture Ready
Capturing Sequence
Sync Pending
Sync Failed
License Expired
```

---

## 16.6 Medical scenario

```txt
Study List
No Study
DICOM Loading
Segmentation Available
Segmentation Missing
Viewer Error
Report Ready
```

---

# 17. ThemeBuilder 기능

ThemeBuilder는 디자이너가 전체 디자인 preset을 조정하는 공간이다.

## 17.1 위치

```txt
stories/builders/ThemeBuilder
```

---

## 17.2 기능

```txt
Theme 선택
Brand 선택
Mode 선택
Density 선택
Primary Color 조정
Surface Contrast 조정
Border Contrast 조정
Radius Scale 선택
Shadow Strength 선택
Typography Scale 선택
```

---

## 17.3 초기 단계

초기에는 Storybook 안에서 실시간 preview만 제공한다.

```txt
조정값 preview
→ 디자이너/개발자 합의
→ 개발자가 preset 파일에 반영
```

---

## 17.4 고도화 단계

추후에는 저장 기능을 제공한다.

```txt
Save as Draft Preset
Export Token JSON
Generate CSS Variables
Create Pull Request
```

---

# 18. PageComposer 기능

PageComposer는 디자이너가 page-level 조합을 실험하는 공간이다.

## 18.1 위치

```txt
stories/builders/PageComposer
```

---

## 18.2 기능

```txt
Service 선택
Version 선택
Page 선택
Layout 선택
Sidebar 선택
Header 선택
Toolbar 선택
Content View 선택
Right Panel 선택
Footer 선택
Fixture 선택
```

---

## 18.3 예시

Catalog Page 조합:

```txt
Layout = AppShell
Sidebar = Compact Project Sidebar
Header = Dense Page Header
Toolbar = Filter Toolbar with Chips
Content = Dataset Table
Right Panel = Dataset Detail Panel
Fixture = Huge Dataset
```

---

# 19. LayoutComposer 기능

LayoutComposer는 레이아웃 구조를 실험하는 공간이다.

## 19.1 위치

```txt
stories/builders/LayoutComposer
```

---

## 19.2 기능

```txt
Layout Type 선택
Sidebar Width 조정
Right Panel Width 조정
Content Max Width 조정
Grid Column 조정
Header Height 조정
Panel Gap 조정
Responsive Breakpoint 확인
```

---

## 19.3 대상 layout

```txt
AppShell
Two Column
Three Column
Split View
Master Detail
Viewer Workspace
Dashboard Grid
```

---

# 20. Sandbox 기능

Sandbox는 정식 version으로 승격하기 전의 실험 공간이다.

## 20.1 위치

```txt
stories/sandboxes/{service}/{experiment}
```

---

## 20.2 예시

```txt
stories/sandboxes/platform/new-sidebar
stories/sandboxes/platform/dense-catalog
stories/sandboxes/platform/training-v2
stories/sandboxes/edge/mobile-capture-ui
stories/sandboxes/medical/viewer-v2
```

---

## 20.3 운영 규칙

Sandbox는 자유도가 높은 실험 공간이지만,
정식 적용 전에는 반드시 다음 기준을 통과해야 한다.

```txt
사용 preset 정리
사용 fixture 정리
상태별 story 정리
반응형 확인
접근성 기본 확인
기존 component/pattern 재사용 가능성 확인
```

통과 후:

```txt
sandboxes/{service}/{experiment}
→ pages/{service}/{version}
```

으로 승격한다.

---

# 21. Version Snapshot 기능

서비스별 version은 하나의 제품 UI snapshot으로 관리한다.

## 21.1 구성 요소

```txt
src/tokens/presets/{service}/{version}
stories/fixtures/{service}/{version}
stories/pages/{service}/{version}
```

---

## 21.2 예시

```txt
platform/0.1.0
├─ token preset
├─ fixtures
└─ pages
```

---

## 21.3 Storybook 표시 방식

왼쪽 navigation은 다음처럼 보이게 한다.

```txt
Pages
└─ Platform
   ├─ 0.0.1
   │  ├─ Catalog
   │  ├─ Training
   │  └─ Analytics
   └─ 0.1.0
      ├─ Catalog
      ├─ Training
      └─ Analytics
```

---

# 22. Design Handoff 기능

디자인 확정 후 개발자에게 전달할 기준 정보를 Storybook에서 명확히 남긴다.

## 22.1 Handoff 정보

각 page story에는 다음 정보를 문서화한다.

```txt
적용 대상 서비스
적용 대상 버전
기준 Story 이름
사용 Preset
사용 Fixtures
필수 검증 Scenario
주요 Interaction
개발 연결 포인트
```

---

## 22.2 예시

```txt
Service: Platform
Version: 0.1.0
Page: Catalog
Reference Story: Pages / Platform / 0.1.0 / Catalog / Default
Preset: src/tokens/presets/platform/0.1.0
Fixtures: stories/fixtures/platform/0.1.0/datasets
Required Scenarios: Default, Empty, Loading, Error, Permission Denied, Huge Dataset
Platform Integration: replace mock datasets with useDatasets(), replace mock export action with exportDataset()
```

---

# 23. 상태 검증 Matrix 기능

각 page별로 반드시 확인해야 할 상태 matrix를 제공한다.

## 23.1 목적

디자인이 기본 화면에서만 정상적으로 보이는 문제를 방지한다.

---

## 23.2 Matrix 예시

```txt
Page: Platform Catalog

Required:
- Default
- Empty
- Loading
- Error
- Permission Denied
- Huge Dataset
- Long Names
- Compact Density
- Dark Mode
- Tablet Viewport
```

---

## 23.3 운영 방식

초기에는 문서형 checklist로 시작한다.

추후에는 Storybook addon 또는 panel로 구현한다.

```txt
Scenario Pass / Fail 표시
Comment 기록
Screenshot 비교
Visual regression 연동
```

---

# 24. 저장 및 생성 기능

Storybook 기본 기능만으로는 디자이너가 변경한 값을 파일로 저장하지 못한다.
따라서 저장/생성 기능은 단계적으로 구현한다.

## 24.1 Phase 1: 수동 반영

```txt
디자이너가 Storybook에서 조합 확인
→ 기준 story와 설정값 전달
→ UI 개발자가 story/preset 파일에 반영
```

---

## 24.2 Phase 2: Export 기능

```txt
ThemeBuilder Export JSON
PageComposer Export Config
LayoutComposer Export Config
```

---

## 24.3 Phase 3: Save 기능

```txt
Save as Draft Preset
Save as Sandbox Page
Save as New Version
```

---

## 24.4 Phase 4: PR 생성

```txt
Storybook에서 저장
→ token/story config 생성
→ Git branch 생성
→ Pull Request 생성
```

이 단계는 추후 고도화 기능으로 둔다.

---

# 25. 필수 구현 우선순위

## 25.1 MVP

먼저 구현해야 할 기능:

```txt
Global Toolbar
Preset Provider
Fixture Selector
Page Stories
Component Controls
Pattern Controls
Basic ThemeBuilder
Basic PageComposer
Handoff 문서 영역
```

---

## 25.2 V1

```txt
Scenario Matrix
Sandbox 운영 구조
LayoutComposer
Version Snapshot Navigation
Fixture 자동 연결
ThemeBuilder Export JSON
```

---

## 25.3 V2

```txt
Save as Preset
Save as Page Config
Visual Regression
Story Review Status
PR 생성 연동
Designer Comment Panel
```

---

# 26. Platform 0.1.0 작업 시나리오

디자이너가 platform 0.1.0을 만드는 실제 순서는 다음과 같다.

```txt
1. Pages / Platform / 0.0.1에서 기존 화면 확인
2. Toolbar에서 Service=Platform, Version=0.1.0 선택
3. ThemeBuilder에서 platform 0.1.0 preset 조정
4. Pages / Platform / 0.1.0 / Catalog 열기
5. Catalog layout, density, filter, right panel 조합 확인
6. Fixture selector로 Empty/Error/Huge/Permission 상태 검증
7. 문제가 있으면 Patterns에서 구조 조정
8. 세부 부품 문제가 있으면 Components에서 variant/state 확인
9. 같은 방식으로 Training, Analytics, Settings 확인
10. 큰 실험은 Sandboxes / Platform에서 진행
11. 확정된 UI는 Pages / Platform / 0.1.0으로 정리
12. Handoff 정보와 기준 Story를 platform 개발자에게 전달
```

---

# 27. 성공 기준

이 기획이 성공적으로 구현되면 다음 상태가 된다.

```txt
Storybook에서 실제 제품 화면에 가까운 UI를 확인할 수 있다.
디자이너가 preset, density, fixture, viewport를 직접 바꿔볼 수 있다.
서비스/버전별 UI snapshot을 추적할 수 있다.
새 UI는 sandbox에서 실험 후 정식 version으로 승격할 수 있다.
platform 개발자는 Storybook page를 실제 데이터와 action에 연결하면 된다.
```

최종 목표는 다음과 같다.

```txt
Storybook pages
≈
Actual platform pages
```

차이는 다음 하나만 남기는 것이 이상적이다.

```txt
Storybook = mock data / mock action
Platform = real data / real action
```
