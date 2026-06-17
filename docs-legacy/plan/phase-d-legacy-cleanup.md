# Phase D — 레거시/중복 정리 (점진적)

> 목표: 1차 audit에서 누락됐다가 2차 검토에서 발견된 레거시 별칭 어댑터, 중복 styled, 인라인 SVG 중복, 토큰 alias 등을 정리한다.
> Phase A/B/C와 독립적으로 진행 가능하나, **D-4(ToastProvider 정리)는 Phase B-2 완료 후에만 가능**.
> 자세한 배경은 [cross-app-sync-2026-05.md](./cross-app-sync-2026-05.md) §3.5 참고.

---

## D-1. platform `portalTheme.ts` 별칭 어댑터 제거 (P2, 30분)

### 사전 상황
- [ingradient-platform/frontend/styles/portalTheme.ts](../../../ingradient-platform/frontend/styles/portalTheme.ts) — 70줄. `@ingradient/ui`의 export를 `Portal*` 별칭으로 re-export하는 레거시 어댑터.
- **검증**: `grep "from.*styles/portalTheme"` 결과 소비자는 [app/providers.tsx:4](../../../ingradient-platform/frontend/app/providers.tsx#L4) **단 1곳뿐**. 가져가는 export는 `IngradientGlobalStyle`, `IngradientThemeProvider` 2개뿐.
- 나머지 ~30개 별칭 (PortalGlobalStyle, PortalPageShell, PortalCompactModalCard, portalAccentButton 등) 은 모두 dead.

### 작업
1. `app/providers.tsx:4` 수정:
   ```diff
   - import { IngradientGlobalStyle, IngradientThemeProvider } from '../styles/portalTheme'
   + import { IngradientGlobalStyle, IngradientThemeProvider } from '@ingradient/ui'
   ```
2. `frontend/styles/portalTheme.ts` 삭제
3. `frontend/styles/` 디렉토리에 다른 파일 없으면 디렉토리도 정리

### 검증
- `npm run typecheck` 통과
- `npm run dev`로 앱 마운트 확인 (테마/global style 정상)
- 만약 `Portal*` 별칭을 import하던 누락된 사용처가 있다면 typecheck에서 즉시 잡힘

### 추정 시간
**30분**.

### 커밋
```
refactor(platform): portalTheme.ts 레거시 별칭 어댑터 제거
```

---

## D-2. platform catalog `ConfirmModal*` styled → ui `ConfirmDialog` (P2, 1시간)

### 사전 상황
- ui는 이미 `ConfirmDialog`를 export. edge가 [DatasetSelectScreen.tsx](../../../ingradient-edge/src/ui/features/dataset/DatasetSelectScreen.tsx) 에서 사용 중 → 동작 검증된 컴포넌트.
- platform은 자체 구현:
  - [features/catalog/catalog.styles.ts:761-791](../../../ingradient-platform/frontend/features/catalog/catalog.styles.ts) — `ConfirmModalOverlay/Box/Title/Description/Actions` 5개 styled
  - [features/catalog/components/CatalogModals.tsx:227-236](../../../ingradient-platform/frontend/features/catalog/components/CatalogModals.tsx) — 사용처
- catalog.styles.ts L791-792에 이미 "ConfirmModalCancelButton/DangerButton removed – use Button directly" 주석이 있음 → 부분 마이그레이션이 시작됐다가 멈춘 상태.

### 작업
1. `CatalogModals.tsx` 의 confirm 모달 부분을 ui `ConfirmDialog` 호출로 교체:
   ```tsx
   import { ConfirmDialog } from '@ingradient/ui'
   // ...
   <ConfirmDialog
     open={open}
     title={title}
     description={description}
     confirmLabel={confirmLabel}
     onCancel={onCancel}
     onConfirm={onConfirm}
     tone="danger" // (필요 시)
   />
   ```
   ConfirmDialog의 실제 props 시그니처는 ui 소스 [overlays/dialog-shell.tsx](../../../ingradient-ui/src/components/overlays/dialog-shell.tsx) 또는 storybook에서 확인하고 맞출 것.
2. `catalog.styles.ts:761-791`의 `ConfirmModalOverlay/Box/Title/Description/Actions` 5개 styled 정의 제거
3. import 정리

### 검증
- catalog 화면에서 confirm 동작 (열기/취소/확인 버튼)
- 시각 비교: 기존 confirm 모달과 ui ConfirmDialog 외관이 너무 다르지 않은지 (디자인 회귀)
- typecheck/build 통과

### 추정 시간
**1시간**.

### 커밋
```
refactor(platform): catalog ConfirmModal styled을 ui ConfirmDialog로 교체
```

---

## D-3. platform 인라인 nav SVG 중복 통합 (P3, 30~60분)

### 사전 상황
- [app/mobileNavIcons.tsx](../../../ingradient-platform/frontend/app/mobileNavIcons.tsx) — 16줄, `Record<string, ReactNode>` 형태로 13개 인라인 SVG
- [components/Sidebar.icons.tsx](../../../ingradient-platform/frontend/components/Sidebar.icons.tsx) — 89줄, 명명 export로 13개 인라인 SVG
- **두 파일이 같은 아이콘들을 따로 그리고 있음**:
  - hamburger ↔ iconMenu
  - close ↔ iconCloseSidebar
  - folder ↔ iconFolder
  - dashboard, catalog, classes, models, training, settings, user, notice, comment (이름 동일)
- ui 아이콘 레지스트리 [components/icons/registry.ts](../../../ingradient-ui/src/components/icons/registry.ts) 는 `lucide-react` 기반이라 다른 스타일

### 결정
**옵션 A 권장**: platform 내부에서 한 파일로 통합 (작은 작업, ui 변경 없음)
- 옵션 B: lucide-react로 교체 (디자인 일관성 ↑, 하지만 시각 회귀 가능성 ↑)

→ A가 안전. 추후 디자인 리뉴얼 시점에 B로 갈 것을 권장.

### 작업 (옵션 A)
1. `frontend/components/Sidebar.icons.tsx` 를 단일 source of truth로 사용
2. `mobileNavIcons.tsx` 의 record 형태가 필요하면 Sidebar.icons.tsx에서 명명 export 그대로 사용:
   ```tsx
   import * as SidebarIcons from '../components/Sidebar.icons'
   export const mobileNavIcons = {
     hamburger: SidebarIcons.iconMenu,
     close: SidebarIcons.iconCloseSidebar,
     folder: SidebarIcons.iconFolder,
     dashboard: SidebarIcons.iconDashboard,
     // ...
   }
   ```
   또는 `MobileNavigation.tsx` 호출 측에서 직접 `iconMenu` 등을 import하도록 변경하고 `mobileNavIcons.tsx` 자체를 삭제
3. 중복된 SVG 정의 제거

### 검증
- 모바일 nav drawer, 데스크탑 sidebar 모두 아이콘 정상 렌더
- 시각 비교: 기존 모바일 햄버거 아이콘과 sidebar 메뉴 아이콘이 동일하게 보이는지

### 추정 시간
**30~60분**.

### 커밋
```
refactor(platform): mobileNavIcons과 Sidebar.icons 인라인 SVG 통합
```

---

## D-4. platform `ToastProvider` 마운트 정리 (P3, 15분, **Phase B-2 후속**)

### 사전 상황
- [app/providers.tsx:14](../../../ingradient-platform/frontend/app/providers.tsx#L14) — `<ToastProvider>` (ui Context 버전) 로 앱을 감쌈
- platform 전체에서 `useToast()` 호출 0건 (grep 검증). 즉 mount만 되어 있고 아무도 사용 안 함.

### 의존성
**Phase B-2 (Toast 통합) 완료 후에만 진행**. Phase B-2에서 ui의 Context 토스트가 deprecated되고 Zustand store + ToastContainer로 대체되기 때문.

### 작업
1. providers.tsx에서 `<ToastProvider>` import/mount 제거
2. (선택) platform이 미래에 토스트를 쓸 수 있도록 `<ToastContainer />` 를 App 트리 어딘가에 마운트:
   ```tsx
   import { ToastContainer } from '@ingradient/ui'
   // ...
   <IngradientThemeProvider>
     <IngradientGlobalStyle />
     <StoreInitializer />
     {children}
     <ToastContainer />
   </IngradientThemeProvider>
   ```

### 검증
- typecheck/build 통과
- (선택) 임시로 `useToastStore.getState().addToast({ kind: 'info', message: 'test' })` 호출해서 토스트 노출 확인

### 추정 시간
**15분**.

### 커밋
```
refactor(platform): 사용하지 않는 ToastProvider 제거, ToastContainer로 교체
```

---

## D-5. `--portal-*` 레거시 CSS 변수 → `--ig-*` 마이그레이션 (P2, 대규모, 점진적)

### 사전 상황
- ui [tokens/globals/legacy-css-variables.ts](../../../ingradient-ui/src/tokens/globals/legacy-css-variables.ts) 에 `--portal-*` → `--ig-*` 매핑 정의 (legacy 호환 레이어)
- 사용 횟수 (grep `var(--portal-`):
  - **platform: 180건**
  - **edge: 515건**
  - **합계: 695건**
- 매핑이 자동 변환을 제공하므로 동작은 동일. 하지만 두 토큰 namespace 공존이 혼란스러움.

### 결정
점진적으로 `--ig-*` 직접 사용으로 마이그레이션 → 모든 사용처 정리되면 ui의 legacy 매핑 파일 deprecate.

**한 번에 전체 마이그레이션 비권장.** 파일 단위 또는 feature 단위로 분할 PR.

### 작업 절차 (반복 실행)
1. 한 파일 또는 feature 디렉토리 선택
2. `grep -n 'var(--portal-' <target>` 로 모든 사용처 식별
3. ui legacy 매핑 파일에서 각 portal 토큰의 `--ig-*` 대응 확인
4. sed/Edit으로 일괄 교체:
   ```
   var(--portal-surface-header)  → var(--ig-color-surface-header)
   var(--portal-border)          → var(--ig-color-border-subtle)
   var(--portal-text-muted)      → var(--ig-color-text-muted)
   ...
   ```
5. 빌드 + 시각 회귀 확인 (해당 화면)

### 진행 추적
별도 markdown 체크리스트(예: `docs/reports/portal-token-migration.md`) 만들어서 파일별 진행 상황 표기 권장. 695건이라 한 번에 끝낼 수 없음.

### 마무리 단계
모든 platform/edge 사용처가 `--ig-*` 직접 사용으로 변환되면:
1. ui [tokens/globals/legacy-css-variables.ts](../../../ingradient-ui/src/tokens/globals/legacy-css-variables.ts) 에 deprecation 주석 + console.warn (개발 환경)
2. 다음 메이저 버전에서 파일 자체 삭제 + global style 적용 코드도 정리

### 추정 시간
- 파일 단위 마이그레이션: **30분~2시간/파일**
- 전체: **수 일 분량 누적** (한 번에 X)

### 커밋 단위
```
refactor(platform): catalog 영역 --portal-* 토큰을 --ig-*로 교체
refactor(platform): gallery 영역 --portal-* 토큰을 --ig-*로 교체
refactor(edge): capture 영역 --portal-* 토큰을 --ig-*로 교체
...
chore(ui): legacy --portal-* 매핑 deprecate (마이그레이션 완료 시점)
```

---

## D-6. (참고) 추가 리서치/결정 필요 항목

진행하지 않지만 audit에서 발견되어 별도 트래킹이 필요한 것들. 이 phase 안에 작업으로 묶지 않음.

### D-6.1 i18n 라이브러리 발산 — 별도 RFC 필요
- platform: 자체 `t(key, vars)` (zustand store) + `messages[locale][key]` lookup
- edge: `react-i18next` + `useTranslation()`
- ko/en/vi locale은 양쪽 다 보유하지만 형식 다름 (platform `.ts`, edge `.json`)
- platform이 react-i18next로 흡수할 가치는 있지만 마이그레이션 비용 높음
- **결정 트리거**: platform이 보간/복수형/날짜 포맷 등 고급 i18n 요구사항을 받을 때
- 이 결정 후에야 [phase-b-promote.md §B-?](./phase-b-promote.md) 의 `LangSelector` 승격 가능

### D-6.2 `fetchWithAuth` vs `authFetch` — 통합 안 함
- 결론: 인증 흐름 자체가 다르므로 (Electron secret store vs browser localStorage) 통합 비대상
- 단, 만약 platform에 nestjs 같은 서버에서 refresh token 흐름을 도입하면 그때 재검토

### D-6.3 Edge App.tsx 자체 `AppRoot/AppContent` styled
- [edge: src/ui/App.tsx:28-40](../../../ingradient-edge/src/ui/App.tsx#L28-L40) 에 `100vh + @supports 100dvh + overflow:hidden` 패턴
- ui patterns의 `AppShell` 등으로 대체 가능한지 검토 필요 — 단순 작업이면 [Phase C](./phase-c-tokenize.md)에 추가

### D-6.4 Edge `GlobalStyle` 중복 마운트
- [edge: App.tsx:286-287](../../../ingradient-edge/src/ui/App.tsx#L286-L287) 에서 `<PortalGlobalStyle />` (ui) + `<GlobalStyle />` (edge 자체) 둘 다 마운트
- edge 자체 GlobalStyle은 body에 `100vh+100dvh+overflow:hidden` 만 추가
- ui의 `IngradientGlobalStyle`이 같은 역할을 하면 중복. 다르면 edge styles는 그대로 유지
- ui global style 확인 후 결정 — 5분 작업

---

## Phase D 통합 체크리스트

- [ ] D-1: platform `portalTheme.ts` 삭제, providers.tsx 직접 import
- [ ] D-2: platform catalog `ConfirmModal*` 5개 styled 제거, ui `ConfirmDialog` 사용
- [ ] D-3: platform `mobileNavIcons.tsx` ↔ `Sidebar.icons.tsx` 중복 SVG 통합
- [ ] D-4: platform `ToastProvider` 제거 + (선택) `ToastContainer` 마운트 — **Phase B-2 후**
- [ ] D-5: `--portal-*` → `--ig-*` 점진 마이그레이션 진행 (별도 트래킹 문서 작성)
- [ ] D-6: i18n RFC, AppShell 정리, GlobalStyle 중복 — 각 항목 GitHub issue로 별도 트래킹

### 총 추정 시간
- D-1~D-4: **2~3시간**
- D-5: **수 일 누적** (점진적)

---

## Phase A/B/C/D 전체 종료 후 기대 상태

- platform/edge 어느 쪽도 `useSelection`, `useZoomPan`, `createStore`, `logger`, `ErrorBoundary`, toast store, draft number input, native HTML form input, `ConfirmModal`, 인라인 nav SVG 중복 등의 사본/위반 없음
- platform `portalTheme.ts` (별칭 어댑터) 부재
- raw hex 색상은 의도적 예외만 남고 모두 토큰
- breakpoint, media query, 디자인 시스템 모두 ui 출처
- `--portal-*` 사용 0건 → ui legacy 매핑 deprecated
- 미해결 아키텍처 결정 (i18n 통합, auth flow 통합) 만 issue로 남음
