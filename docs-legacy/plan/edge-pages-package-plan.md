---
title: Edge Pages Package Plan
purpose: ingradient-edge 의 frontend 화면을 runtime 재사용 가능한 package (`@ingradient/edge-pages`) 로 승격하고 ingradient-edge 가 이를 소비하는 구조를 정의
audience: ingradient-ui contributor / ingradient-edge frontend developer / storybook author
date: 2026-05-18
status: draft
related:
  - ./edge-pages-extraction-roadmap.md
  - ./platform-pages-package-plan.md
  - ./platform-pages-extraction-roadmap.md
  - ./platform-pages-usage.md
  - ../storybook_architecture_restructure.md
---

# Edge Pages Package Plan

## 1. 배경

현재 `ingradient-edge` 의 frontend 는 `src/frontend/pages/` (4 파일) + `src/frontend/components/` (70+ 파일) 에 화면 JSX 가 산재한다. 동시에 `ingradient-ui/stories/pages/edge/0.0.1/` 에 inline mockup story (Login / License / DatasetSelect 3개) 가 있다.

이 둘은 **같은 화면** 이지만 다른 코드베이스에 다른 상태로 존재한다.

- `stories/` 의 mockup 은 디자인 검증용 inline scene
- `ingradient-edge/` 의 실제 page 는 zustand store + electron IPC + i18next + sql.js 와 강결합

즉:

- storybook 의 mock page 는 **UI snapshot + 문서화 자산**
- ingradient-edge 의 실제 page 는 **runtime 화면**

이 상태에서 storybook 이 ingradient-edge 의 JSX 를 직접 가져다 쓰면 electron 의존 때문에 빌드가 깨지고, ingradient-edge 가 storybook 의 JSX 를 가져다 쓰면 storybook-only 코드가 production 번들에 섞인다.

`@ingradient/platform-pages` 가 이미 같은 문제를 platform 측에서 해결했으므로 ([platform-pages-package-plan.md](./platform-pages-package-plan.md)), 본 문서는 동일 구조를 edge 에 적용한다.

---

## 2. 문제 정의

현재 구조는 다음 두 요구를 동시에 만족시키기 어렵다.

1. Storybook 에서 edge page mockup 을 빠르게 진화시키고 싶다.
2. 같은 화면 구조를 `ingradient-edge` 에서 실제 IPC / store 와 함께 재사용하고 싶다.

`stories/` 안에서 두 요구를 동시에 해결하려 하면 다음 문제가 생긴다.

- storybook 전용 코드 (handoff, scene hook) 가 runtime 번들에 섞인다
- mock scene hook 과 실제 IPC hook 이 섞인다
- story file 이 UI source of truth 처럼 변질된다
- `@ingradient/ui` 와 edge 화면 코드의 경계가 다시 흐려진다

`ingradient-edge` 안에서만 진화시키면 다음 문제가 생긴다.

- storybook 에서 mock state 로 화면을 띄울 수 없다 (electron / store 의존)
- 디자인 검증 / 핸드오프가 어렵다
- 같은 JSX 를 두 곳에서 재구현 → drift

---

## 3. 결정

### 3.1 핵심 결정

`stories/` 는 계속 **문서화/시나리오 레이어**로 유지한다.

실제 재사용 가능한 page view 는 `ingradient-ui` 내부의 별도 runtime package 로 승격한다.

신규 package:

```txt
packages/edge-pages
```

package name:

```txt
@ingradient/edge-pages
```

### 3.2 책임 분리

| 레이어 | 역할 | 금지 |
|---|---|---|
| `@ingradient/ui` | primitives / components / patterns / tokens | edge 도메인 page 구현 |
| `@ingradient/edge-pages` | edge 전용 presentational page/view | electron IPC, zustand, fetch, i18next hook, sql.js, file system |
| `stories/pages/edge/*` | fixture, scenario, docs, controls | 실제 app runtime source |
| `ingradient-edge` | IPC, store, i18n, route, page container | large page JSX 재구현 |

### 3.3 한 줄 요약

**Story 는 view 를 보여주고, edge 는 같은 view 에 실제 데이터를 주입한다.**

---

## 4. 목표 구조

```txt
ingradient-ui/
├─ packages/
│  ├─ platform-pages/         # 기존 @ingradient/platform-pages
│  └─ edge-pages/             # 신규 @ingradient/edge-pages
├─ src/                       # 기존 @ingradient/ui (root entry)
├─ stories/
│  └─ pages/edge/...
└─ apps/
   └─ storybook-smoke-consumer/
```

`edge-pages` 내부 예시:

```txt
packages/edge-pages/
├─ src/
│  ├─ login/
│  │  ├─ LoginView.tsx
│  │  ├─ LoginView.styles.ts
│  │  ├─ types.ts
│  │  └─ index.ts
│  ├─ license/
│  │  ├─ LicenseView.tsx
│  │  ├─ types.ts
│  │  └─ index.ts
│  ├─ dataset-select/
│  │  ├─ DatasetSelectView.tsx
│  │  ├─ DatasetGrid.tsx
│  │  ├─ DatasetCard.tsx
│  │  ├─ DotMenu.tsx
│  │  ├─ DatasetSelectView.styles.ts
│  │  ├─ types.ts
│  │  └─ index.ts
│  ├─ dataset-modals/
│  │  ├─ AddDatasetModalView.tsx
│  │  ├─ ExportModalView.tsx
│  │  ├─ CreateProjectFormView.tsx
│  │  ├─ types.ts
│  │  └─ index.ts
│  ├─ chrome/
│  │  ├─ TitleBarView.tsx
│  │  ├─ TopBarView.tsx
│  │  ├─ BottomBarView.tsx
│  │  ├─ AccountMenuView.tsx
│  │  └─ index.ts
│  ├─ workspace/
│  │  ├─ WorkspaceView.tsx
│  │  ├─ types.ts
│  │  └─ index.ts
│  ├─ capture/
│  │  ├─ CaptureView.tsx
│  │  ├─ SetupPanelView.tsx
│  │  ├─ SequencePatternPanelView.tsx
│  │  ├─ DeflectometryTuningControlsView.tsx
│  │  └─ index.ts
│  ├─ images/
│  │  ├─ ImagesGridView.tsx
│  │  ├─ ImageDetailModalView.tsx
│  │  ├─ EdgeImagesGridView.tsx
│  │  └─ index.ts
│  ├─ labeling/
│  │  ├─ BBoxCanvasView.tsx
│  │  ├─ bbox-canvas-overlay.ts
│  │  ├─ bbox-canvas-sam.ts
│  │  ├─ RightPanelView.tsx
│  │  └─ index.ts
│  ├─ statics/
│  │  ├─ StaticsView.tsx
│  │  ├─ CameraChartsView.tsx
│  │  ├─ ImageChartsView.tsx
│  │  ├─ LabelingChartsView.tsx
│  │  ├─ SessionChartsView.tsx
│  │  └─ index.ts
│  ├─ settings/
│  │  ├─ CameraSettingsDialogView.tsx
│  │  ├─ AboutTabView.tsx
│  │  ├─ ServerTabView.tsx
│  │  ├─ DataTabView.tsx
│  │  ├─ CameraParamsTabView.tsx
│  │  ├─ FieldTestTabView.tsx
│  │  ├─ UnifiedLogsTabView.tsx
│  │  ├─ UpdateSectionView.tsx
│  │  ├─ connection/
│  │  │  ├─ ConnectionTabView.tsx
│  │  │  ├─ ScanSectionView.tsx
│  │  │  ├─ ConnectSectionView.tsx
│  │  │  ├─ DiagnosticsSectionView.tsx
│  │  │  ├─ NicStatusCardView.tsx
│  │  │  ├─ NicControlSectionView.tsx
│  │  │  ├─ ProfileStatusSectionView.tsx
│  │  │  ├─ AdvancedSectionView.tsx
│  │  │  ├─ AutoSetupSectionView.tsx
│  │  │  ├─ ForceIpDialogView.tsx
│  │  │  ├─ ConnectionGuidePanelView.tsx
│  │  │  ├─ DiagnoseClassificationCardView.tsx
│  │  │  └─ index.ts
│  │  └─ index.ts
│  ├─ log/
│  │  ├─ LogPanelView.tsx
│  │  ├─ LogDetailTableView.tsx
│  │  └─ index.ts
│  ├─ system/
│  │  ├─ SystemMonitorModalView.tsx
│  │  ├─ SystemMonitorCleanupTabView.tsx
│  │  ├─ SystemMonitorMonitorTabView.tsx
│  │  └─ index.ts
│  └─ index.ts
├─ package.json
├─ tsconfig.json
└─ tsup.config.ts
```

상위 디렉토리 grouping (login / license / dataset-select / ... / system) 는 Phase 단위와 1:1 매핑.

---

## 5. Workspace 변경

현재 `ingradient-ui/package.json` 의 `workspaces` 는 이미 `packages/*` + `apps/storybook-smoke-consumer` 를 포함한다. **추가 workspace 변경 없음** — `packages/edge-pages/` 디렉토리 신설만으로 npm workspace 가 자동 인식.

package 역할:

- `packages/platform-pages` → `@ingradient/platform-pages` (기존)
- `packages/edge-pages` → `@ingradient/edge-pages` (신규)
- root `src/` → `@ingradient/ui` (기존, 유지)

중요:

- `edge-pages` 는 `@ingradient/ui` 를 peerDependency 로 소비한다
- `@ingradient/ui` 는 `edge-pages` 를 절대 import 하지 않는다
- `platform-pages` 와 `edge-pages` 는 서로 import 하지 않는다 (각각 독립)

의존 방향:

```txt
@ingradient/ui
  ↑           ↑
  │           │
@ingradient/   @ingradient/
platform-pages edge-pages
  ↑           ↑
  │           │
ingradient-    ingradient-
platform       edge
```

### 5.1 tsup / tsconfig 설정

`packages/platform-pages/tsup.config.ts` 와 동일 패턴:

```ts
import { defineConfig } from 'tsup'

export default defineConfig({
  entry: { index: 'src/index.ts' },
  format: ['esm'],
  dts: true,
  sourcemap: true,
  clean: false,
  splitting: false,
  outDir: 'lib',
  external: [
    'react',
    'react-dom',
    'styled-components',
    'lucide-react',
    '@ingradient/ui',
    '@ingradient/ui/brand',
    '@ingradient/ui/components',
    '@ingradient/ui/patterns',
    '@ingradient/ui/primitives',
    '@ingradient/ui/tokens',
    '@ingradient/ui/utils',
  ],
})
```

`packages/platform-pages/tsconfig.json` 과 동일 패턴 — `extends: "../../tsconfig.json"`, `paths` 로 `@ingradient/ui/*` 가 root `lib/*.d.ts` 를 가리키게.

### 5.2 package.json (`packages/edge-pages/package.json`)

```json
{
  "name": "@ingradient/edge-pages",
  "version": "0.0.1",
  "type": "module",
  "main": "./lib/index.js",
  "types": "./lib/index.d.ts",
  "exports": {
    ".": "./lib/index.js"
  },
  "files": ["lib"],
  "scripts": {
    "build": "rimraf lib && tsup --config tsup.config.ts"
  },
  "peerDependencies": {
    "react": "^18.0.0",
    "react-dom": "^18.0.0",
    "styled-components": "^6.0.0",
    "@ingradient/ui": "*"
  }
}
```

platform-pages 의 `@dnd-kit/core` peerDependency 는 edge 가 안 쓰므로 제외. recharts 는 statics phase 에서 view 가 직접 import 하지 않고 chart sub-view 의 children 으로 받으면 peer 추가 불필요 — 자세한 건 Phase 8 spec 에서 결정.

---

## 6. Import 규칙

### 6.1 `@ingradient/ui`

기존 유지. edge-pages 신설로 변경 없음.

### 6.2 `@ingradient/edge-pages`

허용:

- `@ingradient/ui/*` sub-export 전부
- React
- styled-components
- lucide-react (icon — 정적 import 만)
- page-specific types
- 순수 util (`canvas` 좌표 변환, 색상 계산 등)

금지:

- `@tanstack/react-query` (edge 는 react-query 안 쓰지만 명시)
- `zustand` 직접 import
- `i18next` / `react-i18next` 직접 hook 호출
- `electron` / `window.electron.*` IPC
- `sql.js` 또는 sqlite 관련
- `fetch` / `XMLHttpRequest` / `WebSocket`
- `localStorage` / `sessionStorage` / `IndexedDB` 직접 접근
- `path` / `fs` (electron renderer 도 못 쓰지만 명시)
- ingradient-edge 의 `src/frontend/*` 어떤 파일도 import 금지

즉 `edge-pages` 는 **pure view layer** 여야 한다.

예외:

- `react-i18next` 의 `useTranslation()` 은 view 안에서 직접 호출하지 **않는다**. container 가 `t(...)` 결과를 `labels` prop 으로 묶어 넘긴다.
- 단, view 내부에서 정적 키 (예: 디버그 라벨, 비-localized) 는 평문 string literal 허용.

### 6.3 `stories/pages/edge/*`

허용:

- `@ingradient/edge-pages`
- fixtures / scenario registry
- Storybook meta / args / controls
- scene hook (mock state)

즉 story 는 page view 를 직접 조립하지 않고, `edge-pages` export 를 렌더한다. handoff 메타도 유지.

---

## 7. ingradient-edge 소비 방식

`ingradient-edge` 는 `@ingradient/edge-pages` 를 일반 dependency 처럼 연결한다.

### 7.1 package.json

```json
{
  "dependencies": {
    "@ingradient/ui": "file:ingradient-ui-0.0.1.tgz",
    "@ingradient/edge-pages": "file:ingradient-edge-pages-0.0.1.tgz"
  }
}
```

또는 yarn workspace / npm link 방식. `ingradient-edge` 는 별도 repo 라 현재 `@ingradient/ui` 를 tgz 로 받고 있음 — `update-ui.mjs` / `sync-ui.mjs` 스크립트 확장이 Phase 13 의 일부.

### 7.2 page container 패턴

기존:

```tsx
// ingradient-edge/src/frontend/pages/LoginScreen.tsx (전)
export function LoginScreen({ mode, config }: LoginScreenProps): JSX.Element {
  const { t } = useTranslation()
  const login = useLogin({ mode, config })
  const [showSettings, setShowSettings] = useState(false)
  return (
    <Wrap>
      {/* ... 143줄의 JSX 직접 조립 ... */}
    </Wrap>
  )
}
```

이후:

```tsx
// ingradient-edge/src/frontend/pages/LoginScreen.tsx (후)
import { LoginView } from '@ingradient/edge-pages'

export function LoginScreen({ mode, config }: LoginScreenProps): JSX.Element {
  const { t } = useTranslation()
  const login = useLogin({ mode, config })
  const [showSettings, setShowSettings] = useState(false)

  const labels = useMemo(() => ({
    title: 'INGRADIENT Edge',
    online: t('login.online'),
    offline: t('login.offline'),
    loadPackage: t('login.loadPackage'),
    submit: t('login.submit'),
    submitting: t('login.submitting'),
    emailLabel: t('login.emailLabel'),
    emailPlaceholder: t('login.emailPlaceholder'),
    passwordLabel: t('login.passwordLabel'),
    passwordPlaceholder: t('login.passwordPlaceholder'),
    savePassword: t('login.savePassword'),
    keepSignedIn: t('login.keepSignedIn'),
    greeting: (name: string) => t('login.greeting', { name }),
    continueSession: t('login.continue'),
    changeAccount: t('login.changeAccount'),
    register: t('login.register'),
    onlineSupport: t('login.onlineSupport'),
    settingsTitle: t('topbar.settings'),
  }), [t])

  return (
    <LoginView
      mode={mode}
      email={login.email}
      password={login.password}
      savePassword={login.savePassword}
      keepSignedIn={login.keepSignedIn}
      error={login.error}
      loggingIn={login.loggingIn}
      packageInfo={login.packageInfo}
      savedSession={login.savedSession}
      otherAccounts={login.otherAccounts}
      showLoginForm={login.showLoginForm}
      hasAccountList={login.hasAccountList}
      externalUrl={login.externalUrl}
      labels={labels}
      onEmailChange={login.setEmail}
      onPasswordChange={login.setPassword}
      onSavePasswordChange={login.setSavePassword}
      onKeepSignedInChange={login.setKeepSignedIn}
      onSubmit={login.handleLogin}
      onContinueSession={login.handleContinueSession}
      onSelectAccount={login.handleSelectAccount}
      onChangeAccount={login.handleChangeAccount}
      onLoadPackage={login.handleLoadPackage}
      onOpenSignup={() => login.win.electron?.openExternal?.('https://app.ingradient.ai/signup')}
      langSelector={<LangSelector />}
      settingsDialog={showSettings ? <CameraSettingsDialog initialTab="server" onClose={() => setShowSettings(false)} /> : null}
      onOpenSettings={() => setShowSettings(true)}
    />
  )
}
```

즉 `ingradient-edge` 의 책임은 다음으로 축소된다.

- electron IPC 호출 (`window.electron.*`)
- zustand store 동기화
- session / keychain 접근
- `useTranslation()` → `labels` 변환
- electron-specific dialog mount (drag, fullscreen, native menu)
- view props 변환

---

## 8. Storybook 소비 방식

Storybook 은 같은 view 컴포넌트에 mock props 를 넣는다.

```tsx
import { LoginView } from '@ingradient/edge-pages'

export const Online: Story = {
  args: {
    mode: 'online',
    email: '',
    password: '',
    savePassword: true,
    keepSignedIn: true,
    error: null,
    loggingIn: false,
    showLoginForm: true,
    hasAccountList: false,
    otherAccounts: [],
    savedSession: null,
    packageInfo: null,
    externalUrl: 'https://app.ingradient.ai',
    labels: {
      title: 'INGRADIENT Edge',
      online: 'Online',
      offline: 'Offline',
      submit: 'Sign in',
      submitting: 'Signing in…',
      emailLabel: 'Email',
      emailPlaceholder: 'operator@line-a.local',
      passwordLabel: 'Password',
      passwordPlaceholder: 'Enter password',
      savePassword: 'Save password',
      keepSignedIn: 'Keep signed in',
      greeting: (name) => `Hi, ${name}`,
      continueSession: 'Continue',
      changeAccount: 'Switch account',
      register: 'Register',
      onlineSupport: 'Online support',
      settingsTitle: 'Settings',
      loadPackage: 'Load package',
    },
    onEmailChange: () => undefined,
    onPasswordChange: () => undefined,
    onSavePasswordChange: () => undefined,
    onKeepSignedInChange: () => undefined,
    onSubmit: (e: React.FormEvent) => e.preventDefault(),
    onContinueSession: () => undefined,
    onSelectAccount: () => undefined,
    onChangeAccount: () => undefined,
    onLoadPackage: () => undefined,
    onOpenSettings: () => undefined,
    onOpenSignup: () => undefined,
    langSelector: <div>EN</div>,
    settingsDialog: null,
  },
}
```

이 구조로 바꾸면:

- story 와 runtime UI 가 같은 JSX source 를 공유한다
- scenario 는 props 수준에서만 달라진다
- story 파일은 다시 얇아진다
- electron IPC / i18n provider 없이 storybook 빌드가 통과한다

---

## 9. View 설계 원칙

### 9.1 Page container / view 분리

`ingradient-edge`:

- page container
- hook orchestration (`useLogin`, `useDeflectometry`, `useCaptureFlow`, ...)
- side effect (IPC, store sync)
- i18n `t(...)` → `labels` 변환

`@ingradient/edge-pages`:

- JSX composition
- layout
- UI-only local state
- props-driven interaction surface
- canvas mutation (visual only, BBoxCanvas 예외 허용)

### 9.2 허용되는 local state

`edge-pages` 에 허용:

- accordion open/close
- hovered item / focused field
- purely visual tab switch (단, "현재 어느 탭" 이 외부에서 결정되면 props)
- canvas pan/zoom (BBoxCanvas)
- chart hover tooltip
- modal animation timing

금지:

- IPC fetch
- mutation
- auth / license check
- store read/write
- route transition
- file system

### 9.3 prop 설계 원칙

- domain type 는 명시적이어야 한다 (`EdgePackage`, `DatasetClass`, `CaptureSnapshot` 등)
- mutation 결과는 callback 으로만 받는다 (`onSubmit`, `onSelectDataset`)
- query/IPC 상태는 `loading/error/empty` 를 props 로 노출한다
- i18n 은 `labels: { ... }` prop group 으로 묶는다
- page 내부에서 shape 변환이 과도하면 view model type 을 별도로 둔다
- electron-specific UI (drag region, fullscreen toggle) 가 필요하면 **slot prop** 으로 받는다 (`titleBarContent?: ReactNode`)
- 큰 sub-feature 는 props group object 로 묶는다:

  ```ts
  interface BBoxCanvasViewProps {
    samRoi: {
      active: boolean
      viewerActive: boolean
      maskPng: string | null
      prompts: SamPrompt[]
      cursor: number
      embedStatus: SamEmbedStatus
      inflight: boolean
      onPromptBox: (box: SamBox, op: 'add' | 'sub') => void
      onPromptPoint: (x: number, y: number, label: 0 | 1) => void
      onUndo: () => void
      onRedo: () => void
      onReset: () => void
      onDone: () => void
      onCancel: () => void
    }
    // ...
  }
  ```

---

## 10. 페이지별 적용 전략

### 10.1 우선순위

[edge-pages-extraction-roadmap.md](./edge-pages-extraction-roadmap.md) §5 의 Phase 1~11 순서:

1. **LoginView** — 가장 단순한 form, prop surface 작음. 패턴 검증.
2. **LicenseView** — form + status display. 매우 단순.
3. **DatasetSelectView** — grid + 모달 3개. 중간 복잡도.
4. **App chrome** — TitleBar / TopBar / BottomBar / AccountMenu. 4 개 동시.
5. **WorkspaceView shell** — slot 기반 shell 만. sub-view 는 phase 분리.
6. **CaptureView + SetupPanel** — capture 탭 + setup 탭.
7. **ImagesView + BBoxCanvas** — 가장 큰 두 파일. multi-file 분해 필수.
8. **StaticsView + charts** — stats 탭.
9. **Settings tabs** — 10 파일.
10. **Connection sub-tab** — 14 파일.
11. **RightPanel + LogPanel + SystemMonitor** — 남은 큰 컴포넌트.

### 10.2 우선순위 이유

#### LoginView (Phase 1)

- 현재 edge 구현이 단순
- form page 라 prop surface 가 작음
- i18n `labels` 패턴 첫 검증
- slot prop (LangSelector, CameraSettingsDialog) 패턴 첫 검증

#### LicenseView (Phase 2)

- LoginView 와 유사한 form 구조
- LoginView 패턴 그대로 적용

#### DatasetSelectView (Phase 3)

- grid + dot menu + 모달 3개
- 멀티 sub-view 첫 검증
- 모달을 view 안 visual state 로 둘지 / slot 으로 받을지 결정

#### App chrome (Phase 4)

- 4 개 모두 stateless 에 가까움
- Workspace 진입 전 chrome 의 prop shape 먼저 결정

#### WorkspaceView shell (Phase 5)

- 가장 복잡한 page
- shell 만 분리 → sub-view 는 후속 phase 에서 주입
- slot 패턴 (capture / images / statics / setup / labeling) 검증

#### CaptureView / SetupPanel / Deflectometry (Phase 6)

- 200줄 룰 위반 다수 (SetupPanel 438, CaptureView 349)
- multi-file 분해 첫 적용

#### ImagesView + BBoxCanvas (Phase 7)

- 가장 큰 두 파일 (1223, 701)
- canvas mutation pattern 의 view 화 결정 (visual-only ref mutation 허용)
- prop surface 매우 큼 — view model + props group 적극 활용

#### StaticsView (Phase 8)

- recharts 기반 stateless
- 가장 단순한 후반 phase

#### Settings (Phase 9~10)

- tab 별로 독립적이라 phase 안에서 sub-phase 분리 가능
- Connection 은 14 파일 → 별도 phase

#### RightPanel + LogPanel + SystemMonitor (Phase 11)

- 남은 잡다한 큰 컴포넌트
- 마지막 phase 에서 일괄 정리

---

## 11. 마이그레이션 단계 — 진행 현황 (2026-05-19)

본 plan 의 실행은 [edge-pages-extraction-roadmap.md](./edge-pages-extraction-roadmap.md) 의 phase 분할을 따른다.

### Phase 0 — 스캐폴드 ✅ (완료)

`packages/edge-pages/` workspace 신설 + tsup/exports/tsconfig/storybook alias 배선. 4 신규 + 3 수정. spec: [edge-pages-phase-0-spec.md](./edge-pages-phase-0-spec.md).

### Phase 1 — LoginView ✅ (완료)

`LoginView` + 17 styled + i18n labels (18 key) + 2 slot (langSelector / settingsDialog) + 6 story scenario. spec: [edge-pages-phase-1-spec.md](./edge-pages-phase-1-spec.md).

### Phase 2 — LicenseView ✅ (완료)

`LicenseView` (bind/key mode 분기) + 16 styled + 12 i18n labels + 6 scenario. spec: [edge-pages-phase-2-spec.md](./edge-pages-phase-2-spec.md).

### Phase 3 — DatasetSelectView ✅ (완료)

22 신규 파일 — DatasetSelectView + Header + Content + 2 card + class-chips + 3 modal view + 4 styles (2 split) + types + index. 8 scenario. spec: [edge-pages-phase-3-spec.md](./edge-pages-phase-3-spec.md).

### Phase 4 — App chrome ✅ (완료)

4 view (TitleBar/TopBar/BottomBar/AccountMenu) + helper + 16 scenario. ConnectionStatus type 충돌 해결. spec: [edge-pages-phase-4-spec.md](./edge-pages-phase-4-spec.md).

### Phase 5 — WorkspaceView shell ✅ (완료)

933 줄 Workspace 의 shell + tab routing + labeling 분기만. 5 slot (capture/images/statics/setup/labeling). 6 scenario. spec: [edge-pages-phase-5-spec.md](./edge-pages-phase-5-spec.md).

### Phase 6 — CaptureView + SetupPanel + Deflectometry ✅ (완료)

5 view (CaptureView 177 / SetupPanelView 154 / SequencePatternPanelView 69 / DeflectometryTuningControlsView 124 / CaptureReviewFullscreen 32) + 3 helper + 5 styles. SetupPanel 의 advanced section 등 simplified. spec: [edge-pages-phase-6-spec.md](./edge-pages-phase-6-spec.md).

### Phase 7 — ImagesView + BBoxCanvas + EdgeImagesGrid ✅ (완료 — scope 조정)

4 view (ImagesView 129 / EdgeImagesGridView 122 / BBoxCanvasView 132 + canvas-helpers). **SAM ROI / modulation overlay / debug overlay / pixel hover / ROI 편집 / colormap 후속 작업으로 보류**. spec: [edge-pages-phase-7-spec.md](./edge-pages-phase-7-spec.md).

### Phase 8 — StaticsView + charts ✅ (완료)

5 view (StaticsView 134 / 4 charts) + recharts peer dependency + tsup external + chart/trend helpers. 모든 파일 < 200. spec: [edge-pages-phase-8-spec.md](./edge-pages-phase-8-spec.md).

### Phase 9 — Settings tabs + CameraSettingsDialog shell ✅ (완료 — scope 조정)

9 view + CameraSettingsDialogView shell. **FieldTestTab (541) / CameraParamsTab (322) 매우 간소화**. Connection tab 은 Phase 10. spec: [edge-pages-phase-9-spec.md](./edge-pages-phase-9-spec.md).

### Phase 10 — Connection sub-tab ✅ (완료)

12 view (ConnectionTab shell + 9 sections + ForceIpDialog + DiagnoseClassificationCard) + 9 props group 패턴 본격 적용. 모든 view < 130. spec: [edge-pages-phase-10-spec.md](./edge-pages-phase-10-spec.md).

### Phase 11 — RightPanel + LogPanel + SystemMonitor ✅ (완료)

7 view (`labeling-panel/` 2 + `log/` 2 + `system/` 3). PanelClassInfo / LogPanelEntry 로 type 충돌 해결. spec: [edge-pages-phase-11-spec.md](./edge-pages-phase-11-spec.md).

### Phase 12 — Story 정리 + 문서 동기화 ✅ (완료)

검증 + usage 가이드 ([edge-pages-usage.md](./edge-pages-usage.md)) + 본 §11 갱신. spec: [edge-pages-phase-12-spec.md](./edge-pages-phase-12-spec.md).

### Phase 13 — ingradient-edge 컨테이너 마이그레이션 ⏳ (대기, 별도 repo)

13 sub-phase. ingradient-edge 측 작업이라 ingradient-ui 외부. spec: [edge-pages-phase-13-spec.md](./edge-pages-phase-13-spec.md).

---

### 누적 결과 (Phase 0~12)

- **lib 산출물**: 250 KB / d.ts 60 KB
- **view export 약 60 개** + 도메인 type / helper 30 개 이상
- **15 영역**: login / license / dataset-select / dataset-modals / chrome / workspace / capture / images / labeling / statics / settings / connection / labeling-panel / log / system
- **storybook scenario** 약 60+ (Phase 별로 부분 추가)
- **금지 import 0 강제**: `useTranslation` / `window.electron` / `zustand` / `i18next` / `fetch(` / `localStorage` / `sessionStorage` / 13 store hook 모두 grep 0

### scope 조정 사항 (spec 대비)

- BBoxCanvas 의 SAM/modulation/debug/ROI/colormap → follow-up
- ImagesView 의 modal labeling 통합 → `modalLabelingContent` slot 으로 위임
- SetupPanel 의 advanced (frame rate / gamma / black level / sharpness / pixel format / ROI / trigger 등) → 미추출
- FieldTestTab / CameraParamsTab → simplified placeholder
- 일부 styles 200 줄 룰 위반 (6 파일, edge 원본 copy):
  - `capture/CaptureView.styles.ts` 357
  - `images/ImagesView.styles.ts` 288
  - `capture/DeflectometryTuningControlsView.styles.ts` 269
  - `capture/types.ts` 296 (consolidated types)
  - `settings/types.ts` 279 (consolidated types)
  - `connection/types.ts` 217 (consolidated types)

자세한 제약은 [edge-pages-usage.md §6](./edge-pages-usage.md) 참고.

---

## 12. 예상 리스크

### 12.1 view 가 너무 비대해지는 문제

위험:

- Workspace (933) / ImagesView (1223) / BBoxCanvas (701) 같은 거대 파일은 단순 이동만으로는 200줄 룰을 못 맞춤

대응:

- multi-file 분해 (phase spec 에서 분해 단위 결정)
- canvas 모듈은 hook + helper 함수로 분리
- view model type 도입 허용

### 12.2 props drilling 과 surface 폭증

위험:

- BBoxCanvas 는 30+ props 예상 (SAM, ROI, modulation, classes, bboxes, callbacks)
- ImagesView 는 grid + modal + context menu 가 한 화면

대응:

- props group object 패턴 (§9.3 예시)
- ImagesView 는 grid / modal / menu 를 별도 view 로 분리, container 가 조립

### 12.3 i18n provider 누락으로 view 가 빈 문자열 렌더

위험:

- 누군가 무심코 view 안에서 `useTranslation()` 직접 호출 → storybook 에서 provider 없으면 빈 문자열
- container 가 `labels` 일부를 누락하면 undefined 렌더

대응:

- view 의 props type 에 `labels` 를 required 로
- view 안에서 `react-i18next` import 금지 — lint rule 권장
- container 측 label builder 함수 한 곳에 모음 (`useLoginLabels()` 같은 hook)

### 12.4 electron IPC 의존성 누출

위험:

- `window.electron.*` 호출이 view 안에 남으면 storybook 에서 빌드 실패 또는 runtime 에러

대응:

- view 의 props type 에 `electron` 같은 raw 핸들 금지
- IPC 결과를 callback / state 로 추상화
- lint rule 또는 grep check (`grep -r 'window\.electron' packages/edge-pages/src`) Phase 검증 단계에 추가

### 12.5 BBoxCanvas 의 canvas mutation 패턴

위험:

- 700줄 canvas 컴포넌트는 imperative ref mutation 이 많음
- pure view 원칙과 충돌할 수 있음

대응:

- canvas 내부 mutation 은 visual-only 로 허용 (§9.1)
- 외부 state 는 props (selected bbox, classes, edit mode)
- IPC 는 container (mask 저장, sequence bbox 업데이트)

### 12.6 ingradient-edge sync 스크립트 확장

위험:

- 현재 `update-ui.mjs` 는 `@ingradient/ui` tgz 만 동기화
- edge-pages 추가 후 sync 누락 시 edge 빌드 실패

대응:

- Phase 13 spec 에 sync 스크립트 변경 포함
- 또는 npm workspace 로 `file:` symlink

### 12.7 platform-pages 와 edge-pages 간 중복

위험:

- 양쪽에 dataset / settings 비슷한 view 가 생길 수 있음 (예: Dataset 모달)

대응:

- 공통화는 `@ingradient/ui` 의 patterns 로 승격 (별도 후속 작업)
- 본 plan 의 범위: 각 package 안에서만 분해

---

## 13. Non-goals

이번 계획의 범위 밖:

- `ingradient-edge` 의 모든 component 를 즉시 package 화 (page-level + 큰 component 만)
- runtime data hook 을 `ingradient-ui` 로 이동
- Storybook fixture registry 구조 전면 개편
- `@ingradient/ui` 를 제품 page library 로 확장
- electron main process 변경
- platform-pages 와 edge-pages 의 공통 view 통합
- edge 의 web mode (`vite.config.web.ts`) 와 electron mode 통합
- 새 디자인 (1:1 이전만)
- visual regression baseline 재촬영

---

## 14. 최종 원칙

1. `stories/` 는 runtime source 가 아니다.
2. edge 화면 재사용은 `packages/edge-pages` 라는 별도 package 에서 한다.
3. `@ingradient/ui` 는 generic UI 레이어로 유지한다.
4. `ingradient-edge` 는 container, `edge-pages` 는 presentational page 로 분리한다.
5. 첫 extraction 은 `LoginView` 로 시작한다 (가장 단순한 form).
6. i18n 은 `labels` prop 으로 평문 전달 — view 안에서 i18n hook 금지.
7. electron IPC / store 는 view 에 절대 누출 금지.

---

## 15. 다음 액션

Phase 0~12 가 ingradient-ui 측에서 완료. 다음은 **Phase 13 — ingradient-edge 컨테이너 마이그레이션** (별도 repo):

1. ingradient-ui 측 release CI 확장 — `@ingradient/edge-pages` tgz 별도 생성
2. ingradient-edge 의 `scripts/update-ui.mjs` / `sync-ui.mjs` 2-package 동기화 지원
3. Phase 13.2 (LoginScreen) 부터 sub-phase 별 마이그레이션 시작

자세한 가이드: [edge-pages-usage.md](./edge-pages-usage.md), [edge-pages-phase-13-spec.md](./edge-pages-phase-13-spec.md).
