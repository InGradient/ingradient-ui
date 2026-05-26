# Phase C — P2 토큰화 & 잔여 정리 (점진적)

> 목표: 하드코딩된 색상/breakpoint를 ui 토큰으로 일괄 교체하고 deprecated 사본을 마무리한다.
> Phase A/B와 독립적으로 진행 가능. 기능 회귀 위험 낮으나 시각 회귀 위험 있음 → 작은 PR 단위 권장.
> 자세한 배경은 [cross-app-sync-2026-05.md](./cross-app-sync-2026-05.md), 기존 토큰 audit는 [hardcoded-values-audit.md](../reports/hardcoded-values-audit.md) 참고.

---

## C-1. 하드코딩 hex 색상 → 토큰 (platform)

### 대상 파일 및 색상

| 파일 | 색상 | 의미 → 토큰 |
|------|------|-------------|
| [components/CommentModal.tsx](../../../ingradient-platform/frontend/components/CommentModal.tsx) | `#7f8b9d`, `#a8b3c2`, `#c8d3e0`, `#666` | text-muted 계열 → `var(--ig-color-text-muted)`, `var(--ig-color-text-secondary)` |
| [components/NoticeModal.tsx](../../../ingradient-platform/frontend/components/NoticeModal.tsx) | 회색 다수 | 동일 |
| [components/ProjectModal.tsx](../../../ingradient-platform/frontend/components/ProjectModal.tsx) | `#4a9eff`, `#666`, `#888` | accent → `var(--ig-color-accent)`, 나머지 text-muted |
| [components/UserMenu.tsx](../../../ingradient-platform/frontend/components/UserMenu.tsx) | `#e0e0e0`, `#252525`, `#e53935` | border, surface, danger 토큰 |
| [components/AiChatFab.tsx](../../../ingradient-platform/frontend/components/AiChatFab.tsx) | `#2563eb`, `#1d4ed8`, `#1a1a1a`, `#333` | accent / surface 토큰 |
| [features/settings/project-settings-form.tsx](../../../ingradient-platform/frontend/features/settings/project-settings-form.tsx) | `#e53935`, `#252525`, `#4a9eff` | danger / surface / accent |
| [features/gallery/virtualized-image-cell.tsx](../../../ingradient-platform/frontend/features/gallery/virtualized-image-cell.tsx) | `#333` (placeholder bg) | `var(--ig-color-surface-muted)` |

> 주의: `image-detail-modal.tsx`의 bbox/crosshair 색상은 의도적 semantic이므로 유지. ui [hardcoded-values-audit.md](../reports/hardcoded-values-audit.md)의 "Remaining (intentionally kept)" 목록과 동일 원칙.

### 작업 절차
파일 단위로 분리 PR 권장. 각 파일에서:

1. 색상 grep으로 모두 식별 (`grep -n '#[0-9a-fA-F]\{3,6\}' <file>`)
2. ingradient-ui [tokens/foundations](../../../ingradient-ui/src/tokens/foundations) 또는 [tokens/semantic](../../../ingradient-ui/src/tokens/semantic) 에서 의미 맞는 토큰 찾기
3. 시각 회귀 확인 (스크린샷 비교 또는 storybook)

### 토큰 매핑 가이드 (참고)
ingradient-ui의 토큰 카테고리 (실제 변수명은 [tokens/](../../../ingradient-ui/src/tokens) 확인):
- `--ig-color-accent`, `--ig-color-accent-hover` — primary blue 계열
- `--ig-color-text-primary`, `--ig-color-text-secondary`, `--ig-color-text-muted`
- `--ig-color-surface`, `--ig-color-surface-elevated`, `--ig-color-surface-muted`
- `--ig-color-border`, `--ig-color-border-strong`
- `--ig-color-danger`, `--ig-color-warning`, `--ig-color-success`, `--ig-color-info`

### 검증
- 시각 비교: 변경 전/후 스크린샷 (특히 dark/light 테마가 있다면 양쪽)
- platform 메인 화면 (gallery, sidebar, modals) 수동 확인

### 추정 시간
파일당 **20~40분** × 7파일 ≈ **3~5시간**. PR을 분리하면 리뷰가 가벼워짐.

---

## C-2. 하드코딩 hex 색상 → 토큰 (edge)

### 대상 파일

| 파일 | 색상 | 처리 시점 |
|------|------|-----------|
| [src/ui/shared/ToastContainer.tsx](../../../ingradient-edge/src/ui/shared/ToastContainer.tsx) | `#3b82f6`, `#f59e0b`, `#ef4444`, `#22c55e` | **Phase B-2에서 ui로 옮길 때 이미 처리** |
| [src/ui/shared/ErrorBoundary.tsx](../../../ingradient-edge/src/ui/shared/ErrorBoundary.tsx) | `#ef4444` | **Phase B-1에서 ui로 옮길 때 이미 처리** |
| `src/ui/features/capture/Workspace.styles.ts` | (감사 미실시) | **별도 grep으로 추가 식별 필요** |
| `src/ui/features/settings/FieldTestTab.*` | (감사 미실시) | 동일 |

### 작업 절차
1. edge 전체에서 `grep -rn '#[0-9a-fA-F]\{3,6\}' src/ui/ --include='*.ts' --include='*.tsx'` 로 raw hex 모두 나열
2. portal 토큰(`--portal-*`) 사용 중인 부분과 ig 토큰 사용 부분, raw hex 부분을 분류
3. raw hex 중 의미 있는 것을 토큰으로 교체
4. 의도적으로 유지하는 것 (예: 카메라 오버레이 contrast 색) 은 인라인 주석으로 사유 기록

### 추정 시간
**2~4시간** (실태 파악 후 변동).

---

## C-3. `MOBILE_BP = 768` → ui `media` helper

### 사전 상황
- [platform: app/MobileNavigation.styles.tsx](../../../ingradient-platform/frontend/app/MobileNavigation.styles.tsx) L4 — `const MOBILE_BP = 768`, L8/L51/L65에서 `@media (max-width: ${MOBILE_BP}px)` 사용
- [platform: app/ProtectedAppShell.tsx:108](../../../ingradient-platform/frontend/app/ProtectedAppShell.tsx#L108) — `window.matchMedia('(max-width: 768px)')` 직접 사용
- ui: [tokens/foundations/breakpoints.ts](../../../ingradient-ui/src/tokens/foundations/breakpoints.ts) 에 `media.md = '@media (max-width: 768px)'` 이미 export 중

### 작업
1. `MobileNavigation.styles.tsx`:
   - `const MOBILE_BP = 768` 제거
   - `import { media } from '@ingradient/ui'`
   - 3곳의 `@media (max-width: ${MOBILE_BP}px)` → `${media.md}` (styled-components 템플릿 안에서 `${media.md} { ... }` 형태로 사용 가능)
2. `ProtectedAppShell.tsx:108`:
   - `breakpoints` 도 ui에서 export하므로 `import { breakpoints } from '@ingradient/ui'`
   - `window.matchMedia(\`(max-width: ${breakpoints.md}px)\`)`로 교체

### 검증
- 768px 전후로 viewport 크기 바꿔서 mobile nav drawer 동작 확인
- ProtectedAppShell이 모바일 모드 전환 정상

### 추정 시간
**30분**.

---

## C-4. edge `SetupSelect` deprecated → `DropdownSelect`

### 사전 상황
- [edge: src/ui/features/capture/Workspace.styles.ts:180](../../../ingradient-edge/src/ui/features/capture/Workspace.styles.ts#L180) — 이미 deprecated 마킹된 `SetupSelect` styled `<select>`
- ui: `DropdownSelect`, `SelectField` 둘 다 export 중

### 작업
1. `SetupSelect` 사용처를 grep으로 식별
2. 각 사용처를 `DropdownSelect` 로 교체 (옵션 모양에 따라 `SelectField`도 가능)
3. 모든 사용처가 정리되면 `Workspace.styles.ts`에서 `SetupSelect` 정의 자체를 제거

### 검증
- capture 설정 화면에서 select 동작
- 키보드 네비게이션, 포커스 트랩 정상

### 추정 시간
**1~1.5시간**.

---

## C-5. (보류) `LangSelector` 승격

### 결정
**현 시점 보류.** 사유:
- platform이 i18n 라이브러리를 도입하지 않은 상태 (`grep useTranslation|i18next` 0건)
- platform이 i18n을 도입할 때 같이 검토하는 게 효율적

### 트리거
다음 중 하나가 발생하면 이 항목 재오픈:
- platform이 다국어 지원 요건을 받음
- ingradient-ui 외 신규 앱이 i18n 적용된 채 추가됨
- edge가 LangSelector를 더 큰 형태(예: 지역/타임존 같이 묶음) 로 확장 필요

---

## C-6. ui Toast Context API deprecation 마무리

### 배경
Phase B-2에서 ui에 Zustand 기반 toast를 추가하면서 기존 `ToastProvider` / `useToast` (Context 버전) 을 deprecated로 두고 즉시 제거하지 않음. C 단계에서 마무리.

### 작업
1. ingradient-ui 코드베이스 + storybook + 외부 사용처 (platform, edge) grep으로 `ToastProvider`, `useToast` (구버전) 호출 0건 확인
2. [ingradient-ui/src/components/feedback/toast.tsx](../../../ingradient-ui/src/components/feedback/toast.tsx) 의 ToastProvider/useToast 정의 제거 (또는 파일 자체 삭제)
3. `feedback/index.ts` export 정리
4. CHANGELOG 항목: BREAKING — `ToastProvider`/`useToast` (Context) 제거, `useToastStore`/`ToastContainer` 사용

### 추정 시간
**30분**.

---

## Phase C 통합 체크리스트

- [ ] platform 7개 파일 raw hex → 토큰 교체
- [ ] edge raw hex 잔여 식별 및 교체 (toast/error 외)
- [ ] platform `MOBILE_BP` 제거, ui `media`/`breakpoints` 사용
- [ ] platform `ProtectedAppShell` 768px hardcode 제거
- [ ] edge `SetupSelect` 사용처 정리 및 정의 제거
- [ ] ui 구 toast Context API 제거
- [ ] 시각 회귀 수동 확인 (주요 화면 스크린샷 비교)
- [ ] storybook 토큰 변경 반영 확인

### 커밋 단위 권장
```
refactor(platform): 하드코딩 색상을 ig 토큰으로 교체 - CommentModal/NoticeModal
refactor(platform): 하드코딩 색상을 ig 토큰으로 교체 - ProjectModal/UserMenu/UserModal
refactor(platform): 하드코딩 색상을 ig 토큰으로 교체 - AiChatFab/settings
refactor(edge): 잔여 하드코딩 색상을 ig 토큰으로 교체
refactor(platform): MOBILE_BP 상수 제거, ui media helper 사용
refactor(edge): SetupSelect deprecated → DropdownSelect 교체
chore(ui): deprecated ToastProvider/useToast Context 제거
```

### 총 추정 시간
**6~10시간** (점진적 진행 권장 — 한 번에 다 X).

---

## Phase A/B/C 전체 종료 후 기대 상태

- platform/edge 어느 쪽도 `useSelection`, `useZoomPan`, `createStore`, `logger`, `ErrorBoundary`, toast store, draft number input, native HTML form input 사본/위반 없음
- 양쪽이 ingradient-ui에서 import만 하는 깔끔한 의존 그래프
- raw hex 색상은 의도적 예외만 남고 모두 토큰
- breakpoint, media query, 디자인 시스템 모두 ui 출처
- 다음 라운드의 `cross-app-sync-2026-XX.md` 작성 시 큰 항목 거의 없음
