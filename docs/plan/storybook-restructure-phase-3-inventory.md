# Phase 3 — Token 인벤토리 + 매핑 권장안

**상위 plan**: [storybook-restructure-phase-3-token-restructure.md](./storybook-restructure-phase-3-token-restructure.md)
**작성일**: 2026-05-12

이 문서는 Phase 3 의 **Step 3.1 (인벤토리)** + **Step 3.2 (매핑 결정 초안)** 산출물. 사용자 검토 후 Step 4 (마이그레이션) 진입.

---

## 1. 현재 폴더 구조 (총 1,184줄)

| 폴더 | 라인 | 역할 | 주요 파일 |
|---|---|---|---|
| `foundations/` | 233 | raw 절대값 (colors, spacing, typography, radius, breakpoints, shadows, z-index, motion, control-sizes) | colors.ts (135) + 8개 scale 파일 |
| `globals/` | 425 | CSS 변수 생성 + ThemeProvider + GlobalStyle (런타임 메커니즘) | token-css-variables.ts (221), global-style.tsx (98), theme-provider.tsx (37) |
| `semantic/` | 131 | dark/light 테마 객체 + `IngradientTheme` interface | theme.ts (77), types.ts (52) |
| `variants/` | 67 | 컴포넌트 상태별 색 토큰 (status, alerts, charts) | status.ts, alerts.ts, charts.ts |
| `recipes/` | 328 | styled-components CSS mixin (button/control/surface/pattern) | buttons.ts (162), controls.ts (107), surfaces.ts (25), patterns.ts (30) |

## 2. CSS 변수 흐름

```
foundations (raw)  →  semantic (theme obj)  →  globals/buildTokenCssVariables()  →  globals/global-style.tsx  →  :root[data-theme='dark'|'light']
                                                                                      └─ 약 70개 `--ig-*` 변수
```

`scripts/generate-tokens-css.mjs` 가 빌드 시 위 흐름 → `lib/tokens.css` 정적 파일 생성. 외부 consumer 는 `@ingradient/ui/tokens.css` 도 import 가능.

## 3. 외부 consumer 영향 분석

platform 의 사용 패턴 (가장 활발한 consumer):
- `media`, `breakpoints` (반응형) — `@ingradient/ui/tokens`
- `ThemeProvider` — `@ingradient/ui/tokens`

`@ingradient/ui/tokens` public entry 만 깨지지 않게 유지하면 외부 영향 없음. **내부 폴더 rename 은 안전**.

---

## 4. 매핑 권장안 (Step 3.2 초안)

상위 문서 § 3.1 의 7-카테고리 (`core/semantic/themes/brands/density/modes/presets`) 에 맞추는 매핑.

| 현재 | 목표 | 방식 | 비고 |
|---|---|---|---|
| `foundations/` | **`core/`** | `git mv` rename | 절대값 — 1:1 일치 |
| `semantic/types.ts` | `semantic/types.ts` | 유지 | `IngradientTheme` interface |
| `semantic/theme.ts` (dark/light 분리) | **`modes/{light,dark}.ts`** | 분리 + 이동 | 두 ColorSet 을 각자 파일로 |
| `variants/{status,alerts,charts}` | `semantic/states/` | 이동 (semantic 의 하위 카테고리화) | 상위 문서 § 3.2 의 "status-success" 가 semantic 예시로 명시됨 |
| `recipes/` | **`../primitives/recipes/`** | tokens 폴더 밖으로 이동 | CSS mixin 은 토큰이 아니라 primitive |
| `globals/` | `globals/` | 유지 | 런타임 메커니즘. Phase 4 에서 `PresetProvider` 와 통합 검토 |
| (없음) | **`themes/`** | 신규 폴더 + placeholder | `industrial.ts`, `medical.ts` 빈 export — Phase 4+ 에서 채움 |
| (없음) | **`brands/`** | 신규 폴더 + placeholder | `default.ts` 빈 override — Phase 4+ 에서 채움 |
| (없음) | **`density/`** | 신규 폴더 + placeholder | `comfortable.ts`, `compact.ts` placeholder — 실제 적용은 Phase 4+ |
| (없음) | `presets/` | **이번 phase 제외** | Phase 4 산출물 |

### 최종 트리 (Phase 3 완료 후)

```
src/tokens/
├─ core/                  ← from foundations/ (233줄)
├─ semantic/
│  ├─ types.ts            ← 유지
│  └─ states/             ← from variants/ (67줄)
│     ├─ status.ts
│     ├─ alerts.ts
│     └─ charts.ts
├─ modes/                 ← from semantic/theme.ts (split)
│  ├─ light.ts
│  └─ dark.ts
├─ themes/                ← 신규 (placeholders)
├─ brands/                ← 신규 (placeholders)
├─ density/               ← 신규 (placeholders)
├─ globals/               ← 유지 (425줄)
└─ index.ts               ← public API 유지

src/primitives/
└─ recipes/               ← from src/tokens/recipes/ (328줄)
   ├─ buttons.ts
   ├─ controls.ts
   ├─ surfaces.ts
   └─ patterns.ts
```

---

## 5. 핵심 의사결정 (사용자 검토 필요)

### Q1. `recipes/` 를 `src/primitives/` 로 옮길 것인가?

- **찬성 근거**: 토큰이 아니라 CSS mixin. 상위 문서 § 3.1 의 7-카테고리에 recipes 가 없음. cheat-sheet 도 `surfaceCard`, `controlField` 등을 "Primitives" 영역으로 노출.
- **반대 근거**: 외부에서 `@ingradient/ui/tokens` 로 import 하던 컴포넌트가 있으면 깨짐. 다만 `@ingradient/ui/primitives` 도 이미 public entry 라 alias 추가로 호환 가능.

**권장**: 옮기되, `@ingradient/ui/tokens` 에서 re-export 호환 alias 유지 (1~2 minor 후 제거).

### Q2. `semantic/theme.ts` 의 dark/light 를 `modes/` 로 분리?

- **찬성 근거**: 상위 문서 § 3.2 의 modes 카테고리 정확히 일치 (`light` / `dark` / `high-contrast`).
- **고려**: `IngradientTheme` 타입은 `semantic/` 에 남고, *값* 만 `modes/` 로. 외부 export 는 그대로.

**권장**: 분리.

### Q3. `variants/` 를 `semantic/states/` 흡수?

- **찬성 근거**: status/alert tone 토큰은 의미 토큰 (semantic) 이지 컴포넌트 variant 가 아님. 상위 문서가 "status-success" 를 semantic 예시로 명시.
- **반대 근거**: 현재 `variants` 라는 명명이 이미 코드 내 정착됨.

**권장**: 흡수. 단 `variants` 명명으로 export 하던 항목은 re-export alias 유지.

### Q4. `globals/` 어떻게 다룰 것인가?

- 현재: CSS 변수 생성 + ThemeProvider + GlobalStyle. 토큰 *런타임* 메커니즘.
- 상위 문서에 직접 매칭 없음.

**권장**: Phase 3 에서는 그대로 유지. Phase 4 에서 `PresetProvider` 도입 시 `globals/` 와 통합 또는 `runtime/` 으로 rename 검토.

---

## 6. Phase 3 실행 순서 (사용자 승인 후)

각 step 별 commit 분리:

1. **commit 1**: `core/` 신설 + foundations 이동 (`git mv`)
2. **commit 2**: `modes/` 신설 + semantic/theme.ts 분리
3. **commit 3**: `semantic/states/` 흡수 — variants/ 이동
4. **commit 4**: `primitives/recipes/` 신설 + recipes/ 이동 + tokens 재export alias
5. **commit 5**: `themes/`, `brands/`, `density/` 신규 placeholder 폴더 + README + index.ts
6. **commit 6**: `index.ts`, `cheat-sheet.md` 업데이트

각 commit 후:
- `npx tsc --noEmit` 통과
- `npx eslint src/` 통과
- Phase 2 의 4개 story 가 Storybook 에서 동일하게 렌더

---

## 7. 위험 + 롤백

- consumer 영향: `@ingradient/ui/tokens` public API 유지 → platform 빌드 깨짐 없음 확인
- 실패 시: 각 commit 별 revert
- platform side 빌드 검증: 단계별 검증 어려우면 마지막에 한 번 `cd ../ingradient-platform && npm run build`
