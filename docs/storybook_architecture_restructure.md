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

# 12. 단계별 실행 계획

본 문서의 비전을 단계별로 분할한 plan 문서. 각 plan 은 작업 체크리스트 + 검증 기준 + 산출물 + 다음 phase 진입 조건을 포함한다.

| Phase | 범위 | 위험도 | 문서 |
|---|---|---|---|
| 1 | Storybook 폴더 scaffold (primitives, components, service/version 서브폴더) | 낮음 | [plan/storybook-restructure-phase-1-scaffold.md](./plan/storybook-restructure-phase-1-scaffold.md) |
| 2 | Platform 0.0.1 첫 페이지 4개 (Login, Signup, Dashboard, CreateProject) + fixtures | 낮음 | [plan/storybook-restructure-phase-2-platform-pages.md](./plan/storybook-restructure-phase-2-platform-pages.md) |
| 3 | Token 재구조 — core/themes/brands/density/modes 카테고리 도입 | **높음** | [plan/storybook-restructure-phase-3-token-restructure.md](./plan/storybook-restructure-phase-3-token-restructure.md) |
| 4 | Preset 시스템 + platform/0.0.1 preset + PresetProvider | 중 | [plan/storybook-restructure-phase-4-presets.md](./plan/storybook-restructure-phase-4-presets.md) |
| 5 | Builders — ThemeBuilder / PageComposer / LayoutComposer | 중 | [plan/storybook-restructure-phase-5-builders.md](./plan/storybook-restructure-phase-5-builders.md) |
| 6 | Multi-service 확장 — Edge / Medical 0.0.1 | 낮음 | [plan/storybook-restructure-phase-6-multi-service.md](./plan/storybook-restructure-phase-6-multi-service.md) |

**의존성**: 1 → 2 (병렬 가능) → 3 → 4 → 5 / 6 (병렬 가능)
**즉시 가치 지점**: Phase 2 완료 시 storybook 으로 platform 페이지 mockup 시작 가능. Phase 4 완료 시 brand/density 전환 실험 가능.
