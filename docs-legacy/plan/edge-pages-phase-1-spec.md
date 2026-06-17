---
title: Phase 1 — LoginView 추출
purpose: ingradient-edge 의 LoginScreen JSX 를 @ingradient/edge-pages/login 으로 승격하고 storybook story 를 새 view 기반으로 rewrite
audience: ingradient-ui contributor
date: 2026-05-19
status: draft
related:
  - ./edge-pages-extraction-roadmap.md
  - ./edge-pages-package-plan.md
  - ./edge-pages-phase-0-spec.md
  - ./platform-pages-phase-1-spec.md
---

# Phase 1 — LoginView 추출

> Roadmap: [edge-pages-extraction-roadmap.md](./edge-pages-extraction-roadmap.md) § Phase 1
> Plan: [edge-pages-package-plan.md](./edge-pages-package-plan.md) §7.2 (컨테이너 예시)

---

## 1. 목적

storybook 의 `LoginScene` (`stories/pages/edge/0.0.1/Login.stories.tsx` 의 inline mockup) 과 ingradient-edge 의 `LoginScreen` (`src/frontend/pages/LoginScreen.tsx`) 이 같은 JSX 를 공유하도록, **`LoginView`** 를 `packages/edge-pages/src/login/` 로 추출한다.

성공 후 양쪽 사용 모양:

```tsx
// storybook story
<LoginView {...scenarioToProps(scenario)} />

// ingradient-edge (Phase 13 에서 마이그레이션)
<LoginView {...hookToProps(useLogin({ mode, config }), t)} />
```

본 phase 는 edge-pages 최초 view 추출이므로 i18n `labels` 패턴, slot prop 패턴, `LoginView.styles.ts` 이전 모두 검증한다.

---

## 2. JSX 출처 — Edge 기준

storybook story 와 edge page 의 JSX 가 크게 다름. **view 는 edge 의 JSX 를 따른다** (실제 운용 코드라 더 정확). storybook 의 `BrandLogo` / `ModeSwitcher` / `Alert` 기반 단순 mockup 은 폐기.

| 항목 | Story 현행 (Login.stories.tsx) | Edge (LoginScreen.tsx) | View 채택 |
|---|---|---|---|
| Page shell | inline style 3개 | styled `Wrap` / `Card` (edge styles) | styled (edge) |
| 헤더 | `BrandLogo` width=220 | `LangCorner` 우상단 (LangSelector + Settings icon) | edge |
| Title | `<h1>Edge Sign in</h1>` | `INGRADIENT Edge` + `ModeTag` (online/offline) | edge |
| Mode toggle | `ModeSwitcher` 컴포넌트로 토글 가능 | 토글 불가, props 로만 변경 (online/offline 은 connectivity 결정) | edge (read-only) |
| Offline UI | `Alert info` 한 줄 | `PackageSection` (Load package 버튼 + `PackageInfo`) | edge |
| Session UI | 없음 | `SessionBox` (greeting + meta + Continue 버튼 + 다른 계정 list + Change account ghost 버튼) | edge |
| Form | email + password + submit (readOnly) | controlled email + PasswordField + `CheckOptions` (savePassword + keepSignedIn) + submit + register link | edge |
| 에러 | `Alert danger` | `ErrorMsg` (text only, hover X) | edge |
| Settings dialog | 없음 | 우상단 톱니바퀴 → `CameraSettingsDialog` (mode=server) | edge (slot prop) |

`Wrap` / `Card` / `Title` / `PackageSection` / `LoginForm` / `Field` / `CheckOptions` / `Btn` / `ErrorMsg` / `SessionBox` / `ModeTag` / `AccountList` / `AccountItem` / `FooterRow` 등 17 styled-components 는 `pages/LoginScreen.styles.ts` 를 그대로 `packages/edge-pages/src/login/LoginView.styles.ts` 로 이전 (token 은 이미 `var(--ig-color-*)` 사용 — 변경 불필요).

---

## 3. Props Interface

```ts
// packages/edge-pages/src/login/types.ts

export type LoginMode = 'online' | 'offline'

export interface LoginPackageInfo {
  project_name: string
  package_version: number
  platform_url?: string
}

export interface LoginSavedSession {
  user_id: string
  name: string
  email: string
}

export interface LoginAccountEntry {
  email: string
  name: string
}

export interface LoginLabels {
  title: string                                   // "INGRADIENT Edge"
  online: string                                  // mode tag — "Online"
  offline: string                                 // mode tag — "Offline"
  onlineSupport: string                           // PackageInfo 의 sub-tag — "Online support"
  loadPackage: string                             // 버튼 — "Load package"
  loading: string                                 // 버튼 (loading) — "Loading…"
  emailLabel: string                              // 필드 라벨 — "Email"
  emailPlaceholder: string
  passwordLabel: string                           // 필드 라벨 — "Password"
  passwordPlaceholder: string
  savePassword: string                            // checkbox — "Save password"
  keepSignedIn: string                            // checkbox — "Keep signed in"
  submit: string                                  // 버튼 — "Sign in"
  submitting: string                              // 버튼 (loading) — "Signing in…"
  register: string                                // ghost 버튼 — "Register"
  greeting: (name: string) => string              // 세션 인사 — "Hi, {name}"
  continueSession: string                         // 세션 버튼 — "Continue"
  changeAccount: string                           // ghost 버튼 — "Switch account"
  settingsTitle: string                           // icon title — "Settings"
}

export interface LoginViewProps {
  // mode + connectivity
  mode: LoginMode

  // controlled form values
  email: string
  password: string
  savePassword: boolean
  keepSignedIn: boolean

  // status
  loggingIn: boolean
  error: string | null

  // session / account picker
  packageInfo: LoginPackageInfo | null
  savedSession: LoginSavedSession | null
  otherAccounts: LoginAccountEntry[]
  hasAccountList: boolean
  showLoginForm: boolean
  externalUrl: string | null

  // i18n labels
  labels: LoginLabels

  // slots
  langSelector?: React.ReactNode
  settingsDialog?: React.ReactNode

  // callbacks
  onEmailChange: (value: string) => void
  onPasswordChange: (value: string) => void
  onSavePasswordChange: (value: boolean) => void
  onKeepSignedInChange: (value: boolean) => void
  onSubmit: (e: React.FormEvent) => void          // view 가 직접 호출 — caller 가 e.preventDefault
  onContinueSession: () => void
  onSelectAccount: (entry: LoginAccountEntry) => void
  onChangeAccount: () => void
  onLoadPackage: () => void
  onOpenSignup: () => void
  onOpenSettings: () => void                      // 우상단 톱니바퀴 클릭
}
```

설계 노트:

- View 의 **local state** 는 없음 — 모두 controlled. `showLoginForm` / `hasAccountList` 같은 분기도 props.
- `loadingPackage` 는 `loggingIn` 처럼 별도 prop 으로 두지 않고 caller 가 `labels.loading` / `labels.loadPackage` 를 swap 해서 보여줌 — 단순화. (대안: `loadingPackage: boolean` 추가) → **결정**: caller 가 swap 방식보다 일관성 위해 `loadingPackage: boolean` prop 추가:

  ```ts
  loadingPackage: boolean
  ```

  이걸 추가하고 view 가 `disabled` 와 라벨 swap.
- `externalUrl` 은 register footer 의 표시 여부 결정자 — null 이면 footer 숨김.
- `settingsDialog` 는 **slot prop** — caller 가 mount 여부 결정 (open 시 `<CameraSettingsDialog ... />`, close 시 `null`). view 는 톱니바퀴만 그림.
- `langSelector` 도 slot — `LangSelector` 컴포넌트는 i18n 의존이라 edge-pages 에 못 옮김. 항상 caller 가 mount.
- `onSubmit` 은 `React.FormEvent` 받음 — view 는 `<LoginForm onSubmit={onSubmit}>` 그대로 전달. caller 가 `e.preventDefault()`.
- `loggingIn` 시 input + submit 버튼 `disabled`. session/account 버튼은 disable 안 함 (별도 액션).

---

## 4. 변경 파일

### 4.1 신규 (4 file)

```
packages/edge-pages/src/login/
├─ LoginView.tsx              — view 본체 (≤ 180 줄 목표)
├─ LoginView.styles.ts        — styled-components 17개 (edge LoginScreen.styles.ts 그대로 이전)
├─ types.ts                   — LoginMode / LoginPackageInfo / LoginSavedSession / LoginAccountEntry / LoginLabels / LoginViewProps
└─ index.ts                   — barrel
```

#### `packages/edge-pages/src/login/index.ts`

```ts
export * from './LoginView'
export * from './types'
```

#### `packages/edge-pages/src/login/LoginView.styles.ts`

`ingradient-edge/src/frontend/pages/LoginScreen.styles.ts` 의 17 export 전부 복사. token 변경 없음 (이미 `var(--ig-color-*)`).

```
Wrap, LangCorner, SettingsIconBtn, Card, Title, PackageSection, PackageInfo,
Divider, LoginForm, Field, FieldLabel, CheckOptions, Btn, ErrorMsg,
SessionBox, SessionGreeting, SessionMeta, ModeTag, FooterRow,
AccountList, AccountItem, AccountItemName, AccountItemEmail
```

총 24 export (위 카운트 23 + index 누락 1) — `LoginScreen.styles.ts` 의 모든 export.

#### `packages/edge-pages/src/login/LoginView.tsx`

기본 골격 (≤ 180 줄):

```tsx
import React from 'react'
import { Settings } from 'lucide-react'
import { Checkbox, TextField, PasswordField } from '@ingradient/ui/components'
import {
  Wrap, LangCorner, SettingsIconBtn, Card, Title, PackageSection, PackageInfo,
  Divider, LoginForm, Field, FieldLabel, CheckOptions, Btn, ErrorMsg,
  SessionBox, SessionGreeting, SessionMeta, ModeTag, FooterRow,
  AccountList, AccountItem, AccountItemName, AccountItemEmail,
} from './LoginView.styles'
import type { LoginViewProps } from './types'

export function LoginView(props: LoginViewProps): JSX.Element {
  const {
    mode, email, password, savePassword, keepSignedIn,
    loggingIn, error, loadingPackage,
    packageInfo, savedSession, otherAccounts,
    hasAccountList, showLoginForm, externalUrl,
    labels, langSelector, settingsDialog,
    onEmailChange, onPasswordChange, onSavePasswordChange, onKeepSignedInChange,
    onSubmit, onContinueSession, onSelectAccount, onChangeAccount,
    onLoadPackage, onOpenSignup, onOpenSettings,
  } = props
  return (
    <Wrap>
      <LangCorner>
        {langSelector}
        <SettingsIconBtn type="button" onClick={onOpenSettings} title={labels.settingsTitle}>
          <Settings size={16} />
        </SettingsIconBtn>
      </LangCorner>
      {settingsDialog}
      <Card>
        <Title>
          {labels.title}
          <ModeTag $online={mode === 'online'}>
            {mode === 'online' ? labels.online : labels.offline}
          </ModeTag>
        </Title>
        {mode === 'offline' && (
          <PackageSection>
            <Btn $variant="secondary" onClick={onLoadPackage} disabled={loadingPackage}>
              {loadingPackage ? labels.loading : labels.loadPackage}
            </Btn>
            {packageInfo && (
              <PackageInfo>
                {packageInfo.project_name} · v{packageInfo.package_version}
                {packageInfo.platform_url && (
                  <ModeTag $online>{labels.onlineSupport}</ModeTag>
                )}
              </PackageInfo>
            )}
          </PackageSection>
        )}
        {showLoginForm && (
          <>
            {mode === 'offline' && <Divider />}
            {hasAccountList ? (
              <SessionBox>
                {savedSession && (
                  <>
                    <SessionGreeting>
                      {labels.greeting(savedSession.name || savedSession.email)}
                    </SessionGreeting>
                    <SessionMeta>{savedSession.email}</SessionMeta>
                    <Btn $variant="primary" onClick={onContinueSession}>
                      {labels.continueSession}
                    </Btn>
                  </>
                )}
                {otherAccounts.length > 0 && (
                  <AccountList>
                    {otherAccounts.map((entry) => (
                      <AccountItem key={entry.email} type="button" onClick={() => onSelectAccount(entry)}>
                        <AccountItemName>{entry.name || entry.email}</AccountItemName>
                        <AccountItemEmail>{entry.email}</AccountItemEmail>
                      </AccountItem>
                    ))}
                  </AccountList>
                )}
                <Btn $variant="ghost" type="button" onClick={onChangeAccount}>
                  {labels.changeAccount}
                </Btn>
              </SessionBox>
            ) : (
              <LoginForm onSubmit={onSubmit}>
                <Field>
                  <FieldLabel htmlFor="login-email">{labels.emailLabel}</FieldLabel>
                  <TextField id="login-email" type="email"
                    placeholder={labels.emailPlaceholder}
                    value={email} onChange={(e) => onEmailChange(e.target.value)}
                    autoComplete="username" disabled={loggingIn}
                  />
                </Field>
                <Field>
                  <FieldLabel htmlFor="login-password">{labels.passwordLabel}</FieldLabel>
                  <PasswordField id="login-password"
                    placeholder={labels.passwordPlaceholder}
                    value={password} onChange={(e) => onPasswordChange(e.target.value)}
                    autoComplete="current-password" disabled={loggingIn}
                  />
                </Field>
                <CheckOptions>
                  <Checkbox checked={savePassword}
                    onChange={(e) => onSavePasswordChange(e.target.checked)}
                    label={labels.savePassword}
                  />
                  <Checkbox checked={keepSignedIn}
                    onChange={(e) => onKeepSignedInChange(e.target.checked)}
                    label={labels.keepSignedIn}
                  />
                </CheckOptions>
                <Btn $variant="primary" type="submit" disabled={loggingIn || !email || !password}>
                  {loggingIn ? labels.submitting : labels.submit}
                </Btn>
                {externalUrl && (
                  <FooterRow>
                    <Btn $variant="ghost" type="button" onClick={onOpenSignup}>
                      {labels.register}
                    </Btn>
                  </FooterRow>
                )}
              </LoginForm>
            )}
          </>
        )}
        {error && <ErrorMsg>{error}</ErrorMsg>}
      </Card>
    </Wrap>
  )
}
```

target line count ≤ 180 (현재 추정 ~135). 200 룰 만족.

### 4.2 수정 (2 file)

#### `packages/edge-pages/src/index.ts`

```diff
- export {}
+ export * from './login'
```

#### `stories/pages/edge/0.0.1/Login.stories.tsx`

- inline `LoginScene` 컴포넌트 삭제
- `LoginView` import + scenario → props 변환
- `handoff` 메타 (defineHandoff) 유지
- 4 scenario 유지 (Online / Offline / InvalidCredentials / Submitting), 단 추가 scenario:
  - **SessionContinue** — `savedSession` 채워서 SessionBox 분기 검증
  - **OfflinePackageLoaded** — `mode='offline'` + `packageInfo` 채워서 PackageInfo 분기 검증
  → 총 6 scenario. requiredScenarios 도 업데이트.

target line count ≤ 180. 현재 120 → 약 150 예상.

기본 labels fixture 작성:

```ts
const DEFAULT_LABELS: LoginLabels = {
  title: 'INGRADIENT Edge',
  online: 'Online',
  offline: 'Offline',
  onlineSupport: 'Online support',
  loadPackage: 'Load package',
  loading: 'Loading…',
  emailLabel: 'Email',
  emailPlaceholder: 'operator@line-a.local',
  passwordLabel: 'Password',
  passwordPlaceholder: 'Enter password',
  savePassword: 'Save password',
  keepSignedIn: 'Keep signed in',
  submit: 'Sign in',
  submitting: 'Signing in…',
  register: 'Register',
  greeting: (name) => `Hi, ${name}`,
  continueSession: 'Continue',
  changeAccount: 'Switch account',
  settingsTitle: 'Settings',
}
```

storybook 의 `LangSelector` slot 은 단순 `<div>EN</div>` placeholder. `settingsDialog` 는 항상 `null` (story 에서 dialog 열림 검증 안 함).

### 4.3 건드리지 않음

- `ingradient-edge/src/frontend/pages/LoginScreen.tsx` — Phase 13 에서 변경. 본 phase 는 edge repo 영향 없음.
- `ingradient-edge/src/frontend/pages/LoginScreen.styles.ts` — Phase 13 에서 삭제. 본 phase 는 그대로.
- `stories/fixtures/edge/0.0.1/devices.ts` — login 무관.
- `apps/storybook-smoke-consumer/` — login view 를 import 하지 않음 (smoke 는 ui primitive 만).

---

## 5. i18n 키 매핑

ingradient-edge container 에서 `t(...)` → `labels` 변환 시 참조:

| labels.* | i18next key | 비고 |
|---|---|---|
| title | (literal) `'INGRADIENT Edge'` | brand string, 비-localized |
| online | `login.online` | |
| offline | `login.offline` | |
| onlineSupport | `login.onlineSupport` | |
| loadPackage | `login.loadPackage` | |
| loading | `login.loading` | |
| emailLabel | `login.emailLabel` | |
| emailPlaceholder | `login.emailPlaceholder` | |
| passwordLabel | `login.passwordLabel` | |
| passwordPlaceholder | `login.passwordPlaceholder` | |
| savePassword | `login.savePassword` | |
| keepSignedIn | `login.keepSignedIn` | |
| submit | `login.submit` | |
| submitting | `login.submitting` | |
| register | `login.register` | |
| greeting | `login.greeting` with `{ name }` | 함수 형태로 — `(name) => t('login.greeting', { name })` |
| continueSession | `login.continue` | |
| changeAccount | `login.changeAccount` | |
| settingsTitle | `topbar.settings` | login namespace 아님 |

총 18 key + 1 literal. 모두 ingradient-edge 의 기존 locale json (`src/frontend/locales/{en,ko,…}.json`) 에 이미 존재 (Phase 13 에서 변경 없음).

---

## 6. 실행 순서

1. `packages/edge-pages/src/login/LoginView.styles.ts` 작성 — edge `LoginScreen.styles.ts` 복사
2. `packages/edge-pages/src/login/types.ts` 작성 — §3 의 types
3. `packages/edge-pages/src/login/LoginView.tsx` 작성 — §4.1 의 골격
4. `packages/edge-pages/src/login/index.ts` 작성
5. `packages/edge-pages/src/index.ts` 수정 — `export * from './login'`
6. `stories/pages/edge/0.0.1/Login.stories.tsx` rewrite — §4.2
7. typecheck + build + storybook build

---

## 7. 검증

| # | 명령 | 기대 결과 |
|---|---|---|
| 1 | `ls packages/edge-pages/src/login/` | 4 파일 |
| 2 | `cd packages/edge-pages && npx tsc --noEmit` | 0 error |
| 3 | `cd packages/edge-pages && npm run build` | `lib/index.{js,d.ts}` 갱신, `LoginView` export 포함 |
| 4 | `wc -l packages/edge-pages/src/login/LoginView.tsx` | ≤ 180 |
| 5 | `wc -l stories/pages/edge/0.0.1/Login.stories.tsx` | ≤ 180 |
| 6 | `npx tsc --noEmit -p tsconfig.json` (root) | 0 error |
| 7 | `npm run build:storybook` | exit 0 |
| 8 | Storybook 수동 확인 — 6 scenario 모두 정상 렌더 | Online / Offline / InvalidCredentials / Submitting / SessionContinue / OfflinePackageLoaded |
| 9 | grep — view 안에 금지 import 없음 | `grep -rE 'useTranslation\|window\.electron\|zustand\|i18next' packages/edge-pages/src/login/` → 0 match |

선택: ingradient-edge 측 `npx tsc --noEmit` — 본 phase 는 edge 를 건드리지 않으므로 영향 없어야 함 (실제로 edge 가 새 package 를 import 하지 않으므로 trivially 통과).

---

## 8. 성공 기준

- 검증 1~9 통과
- `LoginView` 가 zustand store / electron IPC / `useTranslation()` 의존 0
- 6 storybook scenario 가 모두 props 만으로 렌더
- diff 가 6 file (신규 4 + 수정 2) 범위
- `packages/edge-pages/lib/index.js` 가 LoginView 를 노출

---

## 9. 리스크

### 9.1 `@ingradient/ui/components` 의 `Checkbox` / `TextField` / `PasswordField` prop 차이

위험: edge 의 `LoginScreen.tsx` 가 사용하는 컴포넌트 prop 모양과 `@ingradient/ui` 가 export 하는 모양이 다를 수 있음.

대응: edge 는 이미 `@ingradient/ui` 를 import 중 (`LoginScreen.tsx:4` `import { Checkbox, TextField, PasswordField } from '@ingradient/ui'`). 동일 prop. view 안에서도 동일. typecheck 로 즉시 검증.

### 9.2 styled-components hashing 충돌

위험: `LoginView.styles.ts` 가 edge 의 `LoginScreen.styles.ts` 와 같은 className 을 생성하면 storybook 안에서 충돌.

대응: storybook 은 edge 코드를 import 하지 않으므로 충돌 불가. ingradient-edge 측은 Phase 13 까지 styles 가 양쪽에 공존 (edge 자체 + edge-pages 의 동일 styles). 둘이 동시에 동일 페이지에서 마운트되지 않으므로 무영향. Phase 13 에서 edge 의 `LoginScreen.styles.ts` 삭제.

### 9.3 i18n labels prop drilling

위험: 18 key labels object 를 매번 만들어 전달하기 번거로움.

대응:
- 본 phase 는 storybook 만 영향. labels fixture 한 곳 (`stories/fixtures/edge/0.0.1/login-labels.ts` 신규 또는 stories 파일 내 const) 에 둠.
- Phase 13 에서 ingradient-edge 가 `useLoginLabels()` 같은 hook 으로 `useMemo` + `useTranslation` 묶음. spec 작성 시 패턴 명시.

### 9.4 LangSelector slot 의 i18n 의존

위험: `LangSelector` 가 i18next 의존이라 storybook 의 i18n provider 없이 렌더되면 빈 문자열.

대응:
- storybook story 에선 `<div>EN</div>` placeholder slot.
- ingradient-edge container 가 실제 `<LangSelector />` slot 으로 mount.
- view 는 slot 의 내용 불문 — 그냥 렌더.

### 9.5 `loadingPackage` prop 신설로 6 -> 7 prop change

위험: roadmap §5 Phase 1 props 정의에서 `loadingPackage` 누락.

대응: 본 spec §3 에 명시. roadmap 의 phase 정의는 큰 그림이라 세부 prop 은 spec 에서 보강. 별도 roadmap 갱신 불필요.

### 9.6 storybook scenario 증가 (4 → 6)

위험: 기존 handoff `requiredScenarios: ['online', 'offline', 'invalid-credentials', 'submitting']` 4개에 2개 추가 시 handoff doc 의 다른 항목 갱신 필요.

대응: handoff `requiredScenarios` 배열에 `session-continue`, `offline-package-loaded` 추가. `interactions` 항목도 갱신 (SessionBox / PackageSection 확인 추가).

### 9.7 `BrandLogo` 폐기로 디자인 의도 변경

위험: 기존 storybook mockup 의 `BrandLogo` 가 design intent 일 수 있음 (현 edge UI 는 BrandLogo 사용 안 함).

대응: roadmap §9 Non-goals 의 "새 디자인 (1:1 이전만)" 원칙. edge 실제 화면이 BrandLogo 없으므로 view 도 없음. 향후 design refresh 시 BrandLogo 재도입은 별도 phase.

---

## 10. Rollback

git revert. 산출물:
- `packages/edge-pages/src/login/` 디렉토리 통째로 삭제
- `packages/edge-pages/src/index.ts` 를 `export {}` 로 복구
- `stories/pages/edge/0.0.1/Login.stories.tsx` 를 원본으로 복구
- `npm run build --workspace packages/edge-pages` 다시 실행 (lib 갱신)

ingradient-edge / 다른 phase 영향 없음.

---

## 11. 종료 후 상태

- `@ingradient/edge-pages` 가 `LoginView` 와 관련 types 를 export
- storybook `Pages/Edge/0.0.1/Login` story 가 `LoginView` import 기반으로 동작 (6 scenario)
- ingradient-edge 의 `LoginScreen.tsx` 는 미변경 (Phase 13 에서 LoginView 컨테이너로 축소)
- Phase 2 (LicenseView) 진입 준비 완료

---

## 12. 다음 액션

1. 본 spec ok
2. 실행 (§6 의 7 step)
3. 검증 (§7 의 9 step)
4. Phase 2 spec 작성 (`edge-pages-phase-2-spec.md`)
