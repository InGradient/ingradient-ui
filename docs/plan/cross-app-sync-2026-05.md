# Cross-App UI Sync Audit (2026-05)

> 작성일: 2026-05-07
> 범위: `ingradient-platform/frontend` + `ingradient-edge/src/ui` → `@ingradient/ui` 동기화

최근 platform/edge를 급하게 수정하면서 `@ingradient/ui`로 끌어올리지 못한 패턴이 누적됐다. 이 문서는 **현재 시점에서 ingradient-ui로 승격해야 하는 것**과 **이미 ui에 있는데 양쪽이 따로 들고 있는 것(divergence)** 을 정리한 실행 계획서다.

기존 [component-extraction.md](./component-extraction.md) 가 일부 다루고 있지만 그 이후로 새로 생긴 것/놓친 것 위주로 작성했다.

---

## 0. TL;DR — 우선순위 요약

| 우선순위 | 항목 | 현재 위치 | 액션 |
|---------|------|----------|------|
| **P0** | `useSelection` 3중 분기 | ui ✓ + platform×2 | platform 사본 2개 삭제 → ui import |
| **P0** | `useZoomPan` 분기 | ui ✓ + edge | edge 사본 삭제 → ui import (옵션 인자로 전환) |
| **P0** | `createStore` (Zustand devtools 팩토리) | platform + edge (거의 동일) | ui로 승격 |
| **P0** | `logger` (dev no-op) | platform | ui로 승격 |
| **P1** | `ErrorBoundary` (edge) + `ErrorFallback` (platform) | 분기 | ui에 통합본 추가 |
| **P1** | Toast 이중 패턴 | ui = Context, edge = Zustand store | 한 패턴으로 통합 |
| **P1** | `DraftNumberInput` (edge) | edge | NumberField에 draft 모드 추가 OR 별도 승격 |
| **P1** | LoginScreen 네이티브 `<input type="checkbox">` | edge | ui Checkbox로 교체 |
| **P2** | 하드코딩 hex 색상 (~30+ 인스턴스) | platform + edge | `var(--ig-color-*)` 토큰으로 교체 |
| **P2** | `MOBILE_BP = 768` 하드코딩 | platform | ui `media` helper 사용 |
| **P2** | `LangSelector` (edge) | edge | i18n 호환성 확인 후 ui로 |
| **P2** | `ConfirmModal*` styled (platform catalog) | platform | ui `ConfirmDialog` 사용 |
| **P2** | `--portal-*` 레거시 CSS 변수 (695회 사용) | platform + edge | `--ig-*`로 직접 마이그레이션 → 레거시 매핑 제거 |
| **P2** | `frontend/styles/portalTheme.ts` (70줄 별칭 re-export) | platform | 직접 ui import로 교체 → 파일 삭제 |
| **P3** | `mobileNavIcons.tsx` ↔ `Sidebar.icons.tsx` 인라인 SVG 중복 | platform | 한 파일로 통합 또는 lucide-react 사용 |
| **P3** | platform `ToastProvider` 마운트만 하고 `useToast` 사용 0건 | platform | Phase B-2와 함께 정리 |
| **참고** | i18n 라이브러리 발산 (platform 자체 / edge react-i18next) | architectural | 별도 결정 필요 |
| **참고** | `fetchWithAuth` (edge) vs `authFetch` (platform) | 도메인 결합 | 승격 안 함 (요구사항 다름) |

---

## 1. 검증된 중복/발산 (Already in ui, but consumers diverged)

### 1.1 `useSelection` — 3곳에 존재, 구현 차이 있음

- [ingradient-ui/src/hooks/useSelection.ts](../../../ingradient-ui/src/hooks/useSelection.ts) — **정본**. `lastIndexRef`를 클릭마다 업데이트해서 임의 시점에서 Shift+click range 가능.
- [ingradient-platform/frontend/shared/hooks/useSelection.ts](../../../ingradient-platform/frontend/shared/hooks/useSelection.ts) — 더 단순한 옛 버전. `lastIndexRef`를 외부에서만 갱신해야 함.
- [ingradient-platform/frontend/hooks/useSelection.ts](../../../ingradient-platform/frontend/hooks/useSelection.ts) — `shared/hooks`로의 단순 re-export.

**액션**:
1. platform에서 `useSelection` 임포트하는 모든 곳을 `@ingradient/ui`로 변경
2. `frontend/hooks/useSelection.ts`, `frontend/shared/hooks/useSelection.ts` 삭제
3. range 동작이 ui 버전이 더 우월하므로 기능 회귀 없음 (오히려 버그 수정)

### 1.2 `useZoomPan` — edge에 옵션 미지원 사본

- [ingradient-ui/src/hooks/useZoomPan.ts](../../../ingradient-ui/src/hooks/useZoomPan.ts) — `UseZoomPanOptions { minZoom, maxZoom, zoomStep }` 지원
- [ingradient-edge/src/ui/hooks/useZoomPan.ts](../../../ingradient-edge/src/ui/hooks/useZoomPan.ts) — 옵션 없음, `ZOOM_MIN/MAX/STEP` 상수 export

**액션**:
1. edge에서 `useZoomPan` 사용처를 `@ingradient/ui` import로 교체
2. `ZOOM_MIN/MAX/STEP` 상수가 다른 곳(예: 줌 슬라이더 라벨)에서 import되고 있으면 호출 측에서 그대로 정의해두거나 ui에서도 동일 default를 export 중이므로 `ZOOM_MIN_DEFAULT` 등으로 변경
3. edge `useZoomPan.ts` 삭제

### 1.3 Toast — ui Context vs edge Zustand 두 패턴 공존

- [ingradient-ui/src/components/feedback/toast.tsx](../../../ingradient-ui/src/components/feedback/toast.tsx) — `ToastProvider` + `useToast()` (Context 기반, 최대 4초 자동 닫힘, tone 인자)
- [ingradient-edge/src/ui/stores/useToastStore.ts](../../../ingradient-edge/src/ui/stores/useToastStore.ts) — Zustand store, `Toast` 타입에 `action`, `durationMs`, `kind`(info/warn/error/success) 지원
- [ingradient-edge/src/ui/shared/ToastContainer.tsx](../../../ingradient-edge/src/ui/shared/ToastContainer.tsx) — store 구독 + 하드코딩 색상으로 렌더링
- platform: 토스트 사용처 없음 (`useToast`/`ToastContainer` grep 0건)

**판단**: 두 API가 의미가 다르다. ui의 `useToast(message, opts)`는 즉시 호출형이고 edge의 store는 외부 상태에서 push/dismiss 가능. edge 버전이 더 강력 (action 버튼, 영구 토스트 지원).

**액션** (택1, 권장: B):
- A) edge의 `useToastStore` + `ToastContainer`를 ui로 옮기고 ui의 Context 버전을 deprecated. 색상은 `var(--ig-color-*)` 토큰으로 교체.
- B) ui `useToast`에 `action`, `durationMs`(0=영구) 인자를 추가하고 edge가 ui 버전으로 마이그레이션. 단점: edge의 외부 push("백엔드 알림 도착했을 때 store에서 dispatch") 패턴이 깨짐 → 그것도 hook으로 감싸야 함.

→ **B가 ui의 디자인 시스템 일관성에 맞지만 외부 dispatch 요구사항을 검토 필요. A로 가도 무방.** 이 결정은 별도 짧은 RFC 필요.

### 1.4 `createStore` — platform/edge 양쪽에 거의 동일

- [ingradient-platform/frontend/shared/utils/createStore.ts](../../../ingradient-platform/frontend/shared/utils/createStore.ts)
- [ingradient-edge/src/ui/stores/createStore.ts](../../../ingradient-edge/src/ui/stores/createStore.ts)

차이점:
- platform: `process.env.NODE_ENV === 'development'` 검사
- edge: `import.meta.env.DEV` 검사

**액션**: ui로 승격하면서 양쪽 환경 변수를 모두 처리. 또는 `isDev: boolean` 인자를 받게 변경 (호출 측에서 결정).

---

## 2. 새로 ui로 승격할 후보

### 2.1 `ErrorBoundary` / `ErrorFallback`

- [ingradient-edge/src/ui/shared/ErrorBoundary.tsx](../../../ingradient-edge/src/ui/shared/ErrorBoundary.tsx) — 클래스 컴포넌트, `fallback`/`onError` props
- [ingradient-platform/frontend/app/ErrorFallback.tsx](../../../ingradient-platform/frontend/app/ErrorFallback.tsx) — `react-error-boundary` 라이브러리용 fallback (boundary 자체는 별도)

**판단**: 두 패턴이 다르다. edge는 자체 클래스 boundary, platform은 외부 라이브러리. 그래도 fallback UI는 통합 가능.

**액션**:
1. ui에 `ErrorBoundary` (edge 버전) + `DefaultErrorFallback` 컴포넌트 추가
2. fallback의 색상을 `var(--ig-color-danger)` 등 토큰으로
3. edge는 ui import로 교체. platform은 react-error-boundary 유지하되 fallback만 ui의 `DefaultErrorFallback` 사용 가능

### 2.2 `DraftNumberInput`

- [ingradient-edge/src/ui/shared/DraftNumberInput.tsx](../../../ingradient-edge/src/ui/shared/DraftNumberInput.tsx) — `0` 입력 중 `0.1`이 되기 전 clamp되지 않도록 draft 문자열 유지

**검증 결과**: 내부에서 `SetupNumberInput` (edge styled-component) 을 사용 중. ui로 승격하려면 styled 의존을 제거하고 `NumberField`나 `TextField`로 교체 필요.

**액션**:
1. ui `NumberField`에 `mode: 'draft'` prop 추가 OR `DraftNumberInput`을 새 컴포넌트로 추가
2. `format`/`parse` 함수형 prop은 generic numeric input 패턴으로 유용 → 살려둘 것
3. edge는 ui import로 교체, `SetupNumberInput` styled 의존 제거

### 2.3 `logger`

- [ingradient-platform/frontend/shared/utils/logger.ts](../../../ingradient-platform/frontend/shared/utils/logger.ts) — dev에서만 debug/log 활성화, info/warn/error는 항상 출력
- edge 쪽 ui 코드에는 `logger` 유틸 없음 (electron 영역에는 [src/electron/shared/logger.ts](../../../ingradient-edge/src/electron/shared/logger.ts) 가 별도로 있음 — main process용이라 별개 유지)

**액션**: ui로 승격. edge ui 코드도 점진적으로 ui logger 사용. electron main process 쪽 logger는 그대로 둠.

### 2.4 `LangSelector`

- [ingradient-edge/src/ui/shared/LangSelector.tsx](../../../ingradient-edge/src/ui/shared/LangSelector.tsx) — `react-i18next` 기반 글로브 아이콘 드롭다운

**액션**:
1. platform이 i18next 같은 라이브러리를 사용하는지 먼저 확인 (현재 grep 결과 없음 → platform은 i18n 미적용 상태)
2. platform이 i18n을 도입할 때 같이 ui로 승격. **현 시점은 보류.**

### 2.5 (참고) AiChatFab, MobileNavigation, Sidebar

리서치 단계에서 후보로 떠올랐으나 모두 도메인 결합이 강해 **즉시 승격은 비권장**. 토큰/breakpoint helper 정리 후 재검토.

---

## 3. 토큰 & 네이티브 HTML 위반

### 3.1 하드코딩 hex 색상 (P2, ~30+ 인스턴스)

`var(--ig-color-*)` 대신 raw hex 사용 중인 파일:

**Platform**:
- [components/CommentModal.tsx](../../../ingradient-platform/frontend/components/CommentModal.tsx) — `#7f8b9d`, `#666`, `#a8b3c2`, `#c8d3e0`
- [components/NoticeModal.tsx](../../../ingradient-platform/frontend/components/NoticeModal.tsx) — 회색 계열 다수
- [components/ProjectModal.tsx](../../../ingradient-platform/frontend/components/ProjectModal.tsx) — `#4a9eff`, `#666`, `#888`
- [components/UserMenu.tsx](../../../ingradient-platform/frontend/components/UserMenu.tsx) — `#e0e0e0`, `#252525`, `#e53935`
- [components/AiChatFab.tsx](../../../ingradient-platform/frontend/components/AiChatFab.tsx) — `#2563eb`, `#1d4ed8`, `#1a1a1a`, `#333`
- [features/settings/project-settings-form.tsx](../../../ingradient-platform/frontend/features/settings/project-settings-form.tsx) — `#e53935`, `#252525`, `#4a9eff`
- [features/gallery/virtualized-image-cell.tsx](../../../ingradient-platform/frontend/features/gallery/virtualized-image-cell.tsx) — `#333` (placeholder bg)

**Edge**:
- [src/ui/shared/ToastContainer.tsx](../../../ingradient-edge/src/ui/shared/ToastContainer.tsx) — `#3b82f6`, `#f59e0b`, `#ef4444`, `#22c55e` (info/warn/error/success)
- [src/ui/shared/ErrorBoundary.tsx](../../../ingradient-edge/src/ui/shared/ErrorBoundary.tsx) — `#ef4444`
- 그 외 features에 산재 (전체적으로는 `var(--ig-*)` 사용 비율이 높음)

**액션**: 토큰 매핑 표를 만들어 일괄 교체. ToastContainer/ErrorBoundary는 ui로 옮길 때 같이 처리.

### 3.2 네이티브 HTML

| 위치 | 위반 | 교체 |
|------|------|------|
| [edge: features/auth/LoginScreen.tsx](../../../ingradient-edge/src/ui/features/auth/LoginScreen.tsx) L98, L102 | `<input type="checkbox">` | ui `Checkbox` |
| [edge: capture/Workspace.styles.ts:180](../../../ingradient-edge/src/ui/features/capture/Workspace.styles.ts) | `SetupSelect` (deprecated) | ui `DropdownSelect` |
| platform | (확인됨) 네이티브 `<select>`, `<input type="date">` 위반 없음 | — |

### 3.3 100vh / 100dvh

검증 결과 **양쪽 모두 `@supports (height: 100dvh)` fallback 패턴을 정확히 사용 중**. 이 항목은 [feedback_mobile_dvh.md](file:///home/june/.claude/projects/-home-june-workspace-projects-ingradient-platform/memory/feedback_mobile_dvh.md) 메모리에 따라 이미 정리됨.

### 3.4 하드코딩 미디어 쿼리

- [ingradient-platform/frontend/app/MobileNavigation.styles.tsx](../../../ingradient-platform/frontend/app/MobileNavigation.styles.tsx) L4 — `const MOBILE_BP = 768`. ui `media` helper로 교체.

---

## 3.5 추가 발견 항목 (2차 검토)

다음은 1차 audit에서 누락됐다가 phase 작성 중 재검토에서 발견한 것들. 모두 [phase-d-legacy-cleanup.md](./phase-d-legacy-cleanup.md)로 정리.

### 3.5.1 `--portal-*` 레거시 CSS 변수 (P2, 대규모)

- ui [tokens/globals/legacy-css-variables.ts](../../../ingradient-ui/src/tokens/globals/legacy-css-variables.ts) 가 `--portal-*` → `--ig-*` 매핑을 정의 중 (legacy 호환 레이어)
- 사용 횟수: platform 180건, edge 515건, **총 695건**
- 모두 `--ig-*` 직접 사용으로 마이그레이션 가능 (alias 매핑이 자동 변환을 제공하므로 동작은 동일)
- 마이그레이션 후 `legacy-css-variables.ts` 자체를 deprecate

### 3.5.2 `frontend/styles/portalTheme.ts` (P2, 즉시)

- 70줄짜리 [styles/portalTheme.ts](../../../ingradient-platform/frontend/styles/portalTheme.ts) — `@ingradient/ui`에서 import한 것을 `Portal*` 별칭으로 re-export하는 레거시 어댑터
- **실제 소비자는 `app/providers.tsx` 1곳뿐**, 사용하는 export는 `IngradientGlobalStyle`, `IngradientThemeProvider` 2개뿐
- 나머지 ~30개 별칭 (PortalGlobalStyle, PortalPageShell, PortalCompactModalCard 등) 은 모두 dead code
- providers.tsx에서 직접 ui import → 파일 삭제

### 3.5.3 platform 자체 `ConfirmModal*` styled → ui `ConfirmDialog` (P2)

- ui는 이미 `ConfirmDialog`를 export하고 edge가 [DatasetSelectScreen.tsx](../../../ingradient-edge/src/ui/features/dataset/DatasetSelectScreen.tsx) 에서 사용 중
- platform은 [features/catalog/catalog.styles.ts:761-791](../../../ingradient-platform/frontend/features/catalog/catalog.styles.ts) 에서 `ConfirmModalOverlay/Box/Title/Description/Actions` 5개를 자체 styled로 보유
- 사용처: [features/catalog/components/CatalogModals.tsx:227-236](../../../ingradient-platform/frontend/features/catalog/components/CatalogModals.tsx)
- ui `ConfirmDialog` props에 맞춰 한 군데 교체 후 styled 5개 정의 제거

### 3.5.4 platform 인라인 SVG 아이콘 중복 (P3, 작음)

- [app/mobileNavIcons.tsx](../../../ingradient-platform/frontend/app/mobileNavIcons.tsx) (16줄, 13개 SVG)
- [components/Sidebar.icons.tsx](../../../ingradient-platform/frontend/components/Sidebar.icons.tsx) (89줄, 13개 SVG)
- **거의 동일한 아이콘들이 두 파일에 따로 그려져 있음** (hamburger=iconMenu, close=iconCloseSidebar, folder=iconFolder, dashboard, catalog, classes, models, training, settings, user, notice, comment 등)
- ui 아이콘 레지스트리는 `lucide-react` 기반이라 호환되지 않음 → ui로 승격하기보다 **platform 내부에서 한 파일로 합치기**가 더 작은 작업
- 또는 lucide-react로 일괄 교체 (ui와 일관 — Layout, Home, FolderClosed, BarChart3 등)

### 3.5.5 platform `<ToastProvider>` 마운트만 + `useToast` 사용 0건 (P3)

- [app/providers.tsx:14](../../../ingradient-platform/frontend/app/providers.tsx#L14) 에서 `<ToastProvider>` (ui Context 버전) 로 앱 감쌈
- 그러나 platform 전체에서 `useToast()` 호출 0건 (grep 검증 완료)
- Phase B-2에서 toast를 Zustand 패턴으로 통합 후, providers.tsx의 `<ToastProvider>` 제거 + `<ToastContainer>` 마운트로 교체 (platform이 미래에 토스트를 쓸 수 있도록)

### 3.5.6 (참고) i18n 아키텍처 발산 — UI sync 범위 밖

- platform: 자체 구현. [store/useSettingsStore.ts:71-75](../../../ingradient-platform/frontend/store/useSettingsStore.ts) `t(key, vars)` 가 `messages[locale][key]` 룩업
- edge: `react-i18next`. [src/ui/i18n.ts](../../../ingradient-edge/src/ui/i18n.ts) 에서 init, `useTranslation()` 으로 호출
- 두 앱 모두 ko/en/vi locale 파일 보유 (platform `.ts`, edge `.json`)
- **이는 UI 동기화가 아니라 아키텍처 결정**. platform이 react-i18next로 통합할지 별도 RFC 필요. 통합 전에는 `LangSelector` 승격 보류

### 3.5.7 (참고) `fetchWithAuth` vs `authFetch` — 의도적 분리

- edge [utils/fetchWithAuth.ts](../../../ingradient-edge/src/ui/utils/fetchWithAuth.ts): 401 시 `electron.ensureFreshToken` 으로 refresh 후 1회 재시도, 실패 시 `useAuthStore.logout()`
- platform [api/request.ts](../../../ingradient-platform/frontend/api/request.ts): localStorage `getToken()` + Bearer만 추가, refresh 로직 없음
- **인증 흐름 자체가 다름** (Electron secret store vs browser localStorage). 통합 비대상으로 결정.

---

## 4. 도메인 특화로 승격 비대상 (참고)

조사 과정에서 후보였으나 **승격 안 함** 결정한 항목들 — 누가 다시 보더라도 같은 결정을 내릴 수 있도록 기록.

| 항목 | 위치 | 비승격 이유 |
|------|------|------------|
| `useNotices` | platform | platform notice 도메인 (training/comment 알림) 결합 |
| `useOrgRole` | platform | 세션/조직 모델이 platform-only |
| `useCommentActions` | edge | IPC + 플랫폼 동기화 dual-write 로직 |
| `useImageActions` | edge | IPC + 플랫폼 PATCH dual-write 로직 |
| `useIsOnline` | edge | edge `useUIStore` 결합 (platform에는 online 모드 없음) |
| `useDataSource` | edge | edge dataset 추상화 |
| `fetchWithAuth` (edge) | edge | edge auth flow 전용 |
| `cameraStartWithRecovery` | edge | 카메라/Electron 전용 |
| `AddDatasetModal`, `ExportModal`, `SystemMonitorModal`, `CameraSettingsDialog` | edge | edge 도메인. shell은 이미 ui 사용 중 |
| `CommentModal`, `NoticeModal`, `ProjectModal`, `UserModal` | platform | platform 도메인. shell은 이미 `DialogShell` 사용 중 |
| `Sidebar`, `AiChatFab` | platform | platform 도메인. 토큰 정리 후 재검토 |

---

## 5. 작업 순서 제안

각 항목은 독립적으로 작업 가능. P0를 먼저 끝내면 platform/edge 둘 다 ui에서 import만 하는 깔끔한 상태가 됨.

### Phase A — P0 정리 (반나절)
1. `useSelection` 정리: platform 사본 2개 삭제 + import 변경
2. `useZoomPan` 정리: edge 사본 삭제 + import 변경 (옵션 인자 전환)
3. `createStore` ui 승격 + platform/edge 양쪽 import 변경
4. `logger` ui 승격 + platform import 변경

### Phase B — P1 (1~2일)
5. `ErrorBoundary` + `DefaultErrorFallback` ui 승격
6. Toast 통합 RFC → 결정 → 마이그레이션
7. `DraftNumberInput` (또는 `NumberField` draft 모드) ui 승격
8. edge LoginScreen 네이티브 checkbox → ui `Checkbox`

### Phase C — P2 (점진적)
9. 하드코딩 hex → 토큰 일괄 교체 (PR 단위로 파일 그룹화)
10. `MOBILE_BP` → ui `media` helper
11. edge `SetupSelect` deprecated → `DropdownSelect`
12. (보류) `LangSelector` — platform i18n 도입 시점에 함께

### Phase D — 레거시/중복 정리 ([phase-d-legacy-cleanup.md](./phase-d-legacy-cleanup.md) 참고)
13. platform `portalTheme.ts` 별칭 어댑터 제거 (즉시, 30분)
14. platform catalog `ConfirmModal*` styled → ui `ConfirmDialog`
15. platform 인라인 nav SVG 중복 통합
16. platform `ToastProvider` 마운트 정리 (Phase B-2 후속)
17. `--portal-*` 레거시 CSS 변수 → `--ig-*` 마이그레이션 (대규모, 점진적)

---

## 6. 검증 메모

이 문서를 작성하면서 직접 확인한 사실:

- ingradient-ui export 목록은 [src/index.ts](../../../ingradient-ui/src/index.ts) 기준이며, hooks/inputs/feedback/overlays/data-display/navigation/patterns 카테고리 모두 확인.
- `useSelection` 3개 파일 내용 비교 — 정본은 ui 버전.
- `useZoomPan` 양쪽 파일 비교 — 옵션 미지원만 차이.
- `createStore` 양쪽 파일 비교 — 환경변수 검사만 차이, 본질 동일.
- `useToast`(ui) vs `useToastStore`(edge) — API 디자인이 다른 두 패턴.
- platform에는 toast 사용처 0건 (grep `useToast`, `ToastContainer`).
- platform에는 i18n/i18next 사용처 0건.
- `ErrorBoundary`(edge) vs `ErrorFallback`(platform) — 다른 라이브러리/패턴 사용 중.

위 사실은 2026-05-07 시점 상태이며, 코드는 빠르게 변하므로 작업 시작 전 다시 grep으로 확인 권장.
