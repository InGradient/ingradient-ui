---
title: Phase 2 — LicenseView 추출
purpose: ingradient-edge 의 LicenseScreen JSX 를 @ingradient/edge-pages/license 로 승격하고 storybook story 를 새 view 기반으로 rewrite
audience: ingradient-ui contributor
date: 2026-05-19
status: draft
related:
  - ./edge-pages-extraction-roadmap.md
  - ./edge-pages-package-plan.md
  - ./edge-pages-phase-1-spec.md
---

# Phase 2 — LicenseView 추출

> Roadmap: [edge-pages-extraction-roadmap.md](./edge-pages-extraction-roadmap.md) § Phase 2
> Phase 1 패턴 답습 — slot prop / labels prop / pure controlled view.

---

## 1. 목적

storybook 의 `LicenseScene` (`stories/pages/edge/0.0.1/License.stories.tsx` 의 inline mockup) 과 ingradient-edge 의 `LicenseScreen` (`src/frontend/pages/LicenseScreen.tsx`) 이 같은 JSX 를 공유하도록, **`LicenseView`** 를 `packages/edge-pages/src/license/` 로 추출한다.

본 phase 는 Phase 1 의 i18n labels / slot prop 패턴을 그대로 적용 (form + status display 라 LoginView 와 구조가 유사).

---

## 2. JSX 출처 — Edge 기준

storybook story 와 edge page 의 JSX 가 크게 다름. **view 는 edge 의 JSX 를 따른다** (LoginView 와 동일 원칙). storybook 의 `BrandLogo` / `StatusPill` / `Alert` 기반 mockup 은 폐기.

| 항목 | Story 현행 | Edge | View 채택 |
|---|---|---|---|
| Page shell | inline style 3개 | styled `Wrap` / `Card` | styled (edge) |
| 헤더 | `BrandLogo` width=220 | `LangCorner` (LangSelector + Settings icon) | edge |
| Title | `<h1>License</h1>` | `INGRADIENT Edge` + `Subtitle` (bindMode/non-bindMode) | edge |
| Fingerprint | row + monospace span | `FingerprintBox` (text + Copy button + copied state) | edge |
| Status display | `StatusPill` + Status / Expires / Device 3 row | 없음 (bindMode 표시 + HintBox 만) | edge |
| Form / Action | 단일 `TextField` (readOnly) + 단일 `Button` | bindMode: `SubmitBtn` only / non-bindMode: `LicenseForm` (key Input + activate `SubmitBtn`) | edge (분기) |
| 에러 | `Alert danger` | `ErrorMsg` (text) | edge |
| Settings dialog | 없음 | 우상단 톱니바퀴 → `CameraSettingsDialog` (slot) | edge (slot prop) |

`Wrap` / `Card` / `Title` / `Subtitle` / `Field` / `FieldLabel` / `FingerprintBox` / `FingerprintText` / `CopyBtn` / `Input` / `LicenseForm` / `SubmitBtn` / `ErrorMsg` / `HintBox` / `LangCorner` / `SettingsIconBtn` — 16 styled-components 를 `pages/LicenseScreen.styles.ts` 에서 그대로 `packages/edge-pages/src/license/LicenseView.styles.ts` 로 이전 (token 은 이미 정규화 상태).

---

## 3. Props Interface

```ts
// packages/edge-pages/src/license/types.ts

export type LicenseMode = 'bind' | 'key'
// bind  — 이미 .ige 가 device_id + platform_url 을 가지고 있어 서버 바인딩만 남은 상태
// key   — license key 직접 입력 (기존 flow)

export interface LicenseLabels {
  title: string                                   // "INGRADIENT Edge"
  subtitle: string                                // bind 가 아닐 때 — "Activate this device"
  bindHint: string                                // bindMode 의 hint + subtitle 양쪽 — "This .ige is bound to ..."
  hint: string                                    // non-bind hint — "Enter the activation key"
  fingerprintLabel: string                        // 라벨 — "Device fingerprint"
  copy: string                                    // 버튼 — "Copy"
  copied: string                                  // 버튼 (copied state) — "Copied!"
  keyLabel: string                                // 라벨 — "License key"
  activate: string                                // 버튼 — "Activate"
  activating: string                              // 버튼 (loading) — "Activating…"
  bindButton: string                              // 버튼 — "Bind device"
  binding: string                                 // 버튼 (loading) — "Binding…"
  settingsTitle: string                           // icon title — "Settings"
}

export interface LicenseViewProps {
  // mode 결정
  mode: LicenseMode

  // 표시 데이터
  fingerprint: string                             // 'Loading…' / 'ERROR' / 실제 fingerprint
  licenseKey: string                              // controlled key 입력 (key mode 만 사용, bind 에선 무시)

  // status
  submitting: boolean
  copied: boolean
  error: string | null

  // i18n
  labels: LicenseLabels

  // slots
  langSelector?: React.ReactNode
  settingsDialog?: React.ReactNode

  // callbacks
  onLicenseKeyChange: (value: string) => void
  onSubmit: (e: React.FormEvent) => void          // key mode 의 form submit
  onBind: () => void                              // bind mode 의 버튼 click
  onCopyFingerprint: () => void
  onOpenSettings: () => void
}
```

설계 노트:

- View 의 **local state** 는 없음 — `copied` 도 props (container 의 `useState` + `setTimeout` 으로 관리).
- 상수 `KEY_PLACEHOLDER = 'XXXXXXXX-XXXXXXXX-XXXXXXXX-XXXXXXXX'` 는 view 내부 상수 (locale 무관, 비-localized format hint).
- `bindMode` 분기는 `mode === 'bind'` 한 props 로. `deviceId` / `serverUrl` 표시 안 함 (edge 도 화면에 안 보임 — bind 동작만 트리거).
- `mode === 'bind'` 일 때:
  - Subtitle = `labels.bindHint` (edge 코드와 동일)
  - HintBox = `labels.bindHint` (edge 와 동일하게 같은 string)
  - Button label = `labels.bindButton` / `labels.binding`
- `mode === 'key'` 일 때:
  - Subtitle = `labels.subtitle`
  - HintBox = `labels.hint`
  - Form: key Input + activate button
- `submitting` 시 모든 버튼 + input disabled.
- `error` 는 모드 무관하게 하단 표시.

---

## 4. 변경 파일

### 4.1 신규 (4 file)

```
packages/edge-pages/src/license/
├─ LicenseView.tsx              — view 본체 (≤ 140 줄 목표)
├─ LicenseView.styles.ts        — styled-components 16개 (edge LicenseScreen.styles.ts 그대로)
├─ types.ts                     — LicenseMode / LicenseLabels / LicenseViewProps
└─ index.ts                     — barrel
```

#### `packages/edge-pages/src/license/index.ts`

```ts
export * from './LicenseView'
export * from './types'
```

#### `packages/edge-pages/src/license/LicenseView.styles.ts`

`ingradient-edge/src/frontend/pages/LicenseScreen.styles.ts` 의 16 export 전부 복사. token 변경 없음.

```
Wrap, LangCorner, SettingsIconBtn, Card, Title, Subtitle, Field, FieldLabel,
FingerprintBox, FingerprintText, CopyBtn, Input, LicenseForm, SubmitBtn,
ErrorMsg, HintBox
```

#### `packages/edge-pages/src/license/LicenseView.tsx`

기본 골격 (≤ 140 줄):

```tsx
import React from 'react'
import { Settings } from 'lucide-react'
import {
  Wrap, LangCorner, SettingsIconBtn, Card, Title, Subtitle, Field, FieldLabel,
  FingerprintBox, FingerprintText, CopyBtn, Input, LicenseForm, SubmitBtn,
  ErrorMsg, HintBox,
} from './LicenseView.styles'
import type { LicenseViewProps } from './types'

const KEY_PLACEHOLDER = 'XXXXXXXX-XXXXXXXX-XXXXXXXX-XXXXXXXX'

export function LicenseView(props: LicenseViewProps): JSX.Element {
  const {
    mode, fingerprint, licenseKey, submitting, copied, error,
    labels, langSelector, settingsDialog,
    onLicenseKeyChange, onSubmit, onBind, onCopyFingerprint, onOpenSettings,
  } = props
  const isBind = mode === 'bind'
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
        <Title>{labels.title}</Title>
        <Subtitle>{isBind ? labels.bindHint : labels.subtitle}</Subtitle>
        <Field>
          <FieldLabel>{labels.fingerprintLabel}</FieldLabel>
          <FingerprintBox>
            <FingerprintText>{fingerprint}</FingerprintText>
            <CopyBtn type="button" onClick={onCopyFingerprint} title={labels.copy}>
              {copied ? labels.copied : labels.copy}
            </CopyBtn>
          </FingerprintBox>
        </Field>
        {isBind ? (
          <>
            <HintBox>{labels.bindHint}</HintBox>
            <SubmitBtn type="button" onClick={onBind} disabled={submitting}>
              {submitting ? labels.binding : labels.bindButton}
            </SubmitBtn>
          </>
        ) : (
          <>
            <HintBox>{labels.hint}</HintBox>
            <LicenseForm onSubmit={onSubmit}>
              <Field>
                <FieldLabel htmlFor="license-key">{labels.keyLabel}</FieldLabel>
                <Input
                  id="license-key" type="text"
                  placeholder={KEY_PLACEHOLDER}
                  value={licenseKey}
                  onChange={(e) => onLicenseKeyChange(e.target.value)}
                  autoComplete="off"
                  spellCheck={false}
                  disabled={submitting}
                />
              </Field>
              <SubmitBtn type="submit" disabled={submitting || !licenseKey.trim()}>
                {submitting ? labels.activating : labels.activate}
              </SubmitBtn>
            </LicenseForm>
          </>
        )}
        {error && <ErrorMsg>{error}</ErrorMsg>}
      </Card>
    </Wrap>
  )
}
```

target line count ≤ 140 (예상 ~85 줄).

### 4.2 수정 (2 file)

#### `packages/edge-pages/src/index.ts`

```diff
  export * from './login'
+ export * from './license'
```

#### `stories/pages/edge/0.0.1/License.stories.tsx`

- inline `LicenseScene` 컴포넌트 삭제
- `LicenseView` import + scenario → props 변환
- `handoff` 메타 유지하되 `requiredScenarios` 갱신:
  - 기존: `['valid', 'expired', 'unbound', 'submitting']`
  - 신규: `['key-empty', 'key-filled', 'key-invalid', 'key-submitting', 'bind-mode', 'bind-submitting']`
  - 기존 mockLicense fixture (status: 'valid' / 'expired' / 'unbound') 는 본 view 의 상태 모형과 다름 — view 는 status field 가 없음 (fingerprint + key + mode + error 만). 따라서 fixture 자체는 보존하되 story scenario 만 신규.
- 6 scenario:
  - **KeyEmpty** — mode='key', licenseKey='', error=null
  - **KeyFilled** — mode='key', licenseKey='ABCD1234-EFGH5678-...', error=null
  - **KeyInvalid** — mode='key', licenseKey='WRONG-KEY...', error='License invalid'
  - **KeySubmitting** — mode='key', licenseKey='ABCD...', submitting=true
  - **BindMode** — mode='bind', fingerprint='ABCD-EFGH-...'
  - **BindSubmitting** — mode='bind', submitting=true

target line count ≤ 180. 현재 145 → 약 160 예상.

기본 labels fixture:

```ts
const DEFAULT_LABELS: LicenseLabels = {
  title: 'INGRADIENT Edge',
  subtitle: 'Activate this device to start using Edge.',
  bindHint: 'This package is bound to a server. Bind your device to continue.',
  hint: 'Enter the activation key provided by your administrator.',
  fingerprintLabel: 'Device fingerprint',
  copy: 'Copy',
  copied: 'Copied!',
  keyLabel: 'License key',
  activate: 'Activate',
  activating: 'Activating…',
  bindButton: 'Bind device',
  binding: 'Binding…',
  settingsTitle: 'Settings',
}
```

`langSelector` slot 은 `<div>EN</div>` placeholder, `settingsDialog` 는 항상 `null`.

### 4.3 건드리지 않음

- `ingradient-edge/src/frontend/pages/LicenseScreen.tsx` — Phase 13 에서 변경
- `ingradient-edge/src/frontend/pages/LicenseScreen.styles.ts` — Phase 13 에서 삭제
- `stories/fixtures/edge/0.0.1/` — license fixture 유지 (preset metadata 일부에서 참조될 수 있음)
- 다른 phase 의 view

---

## 5. i18n 키 매핑

ingradient-edge container 가 `t(...)` → `labels` 변환 시 참조:

| labels.* | i18next key | 비고 |
|---|---|---|
| title | (literal) `'INGRADIENT Edge'` | brand string |
| subtitle | `license.subtitle` | non-bind |
| bindHint | `license.bindHint` | bind mode |
| hint | `license.hint` | non-bind |
| fingerprintLabel | `license.fingerprintLabel` | |
| copy | `license.copy` | |
| copied | `license.copied` | |
| keyLabel | `license.keyLabel` | |
| activate | `license.activate` | |
| activating | `license.activating` | |
| bindButton | `license.bindButton` | |
| binding | `license.binding` | |
| settingsTitle | `topbar.settings` | login 과 공유 |

총 12 key + 1 literal. 모두 edge 의 기존 locale json 에 존재.

**별도 처리** — `error` 메시지는 container 가 직접 string 으로 만들어 prop 전달 (`ERR.LICENSE_INVALID`, `t('license.bindError')`). view 안에서 분기하지 않음.

---

## 6. 실행 순서

1. `packages/edge-pages/src/license/LicenseView.styles.ts` 작성 — edge `LicenseScreen.styles.ts` 복사
2. `packages/edge-pages/src/license/types.ts` 작성 — §3 의 types
3. `packages/edge-pages/src/license/LicenseView.tsx` 작성 — §4.1 의 골격
4. `packages/edge-pages/src/license/index.ts` 작성
5. `packages/edge-pages/src/index.ts` 수정 — `export * from './license'` 추가
6. `stories/pages/edge/0.0.1/License.stories.tsx` rewrite — §4.2
7. typecheck + build + storybook build

---

## 7. 검증

| # | 명령 | 기대 결과 |
|---|---|---|
| 1 | `ls packages/edge-pages/src/license/` | 4 파일 |
| 2 | `cd packages/edge-pages && npx tsc --noEmit` | 0 error |
| 3 | `cd packages/edge-pages && npm run build` | `lib/index.{js,d.ts}` 갱신, `LicenseView` export 포함 |
| 4 | `wc -l packages/edge-pages/src/license/LicenseView.tsx` | ≤ 140 |
| 5 | `wc -l stories/pages/edge/0.0.1/License.stories.tsx` | ≤ 180 |
| 6 | `npx tsc --noEmit -p tsconfig.json` (root) | 0 error |
| 7 | `npm run build:storybook` | exit 0 |
| 8 | Storybook 수동 확인 — 6 scenario 모두 정상 렌더 | KeyEmpty / KeyFilled / KeyInvalid / KeySubmitting / BindMode / BindSubmitting |
| 9 | grep — view 안 금지 import 0 | `grep -rE 'useTranslation\|window\.electron\|zustand\|i18next' packages/edge-pages/src/license/` → 0 match |

---

## 8. 성공 기준

- 검증 1~9 통과
- `LicenseView` 가 store / IPC / i18n hook 의존 0
- 6 storybook scenario 가 props 만으로 렌더 (Phase 1 의 패턴 재검증)
- diff 가 6 file (신규 4 + 수정 2) 범위
- Phase 1 패턴이 form 류 view 에 일반화됨을 확인

---

## 9. 리스크

### 9.1 storybook fixture (`mockLicense`) 와 새 view shape 불일치

위험: 기존 `mockLicense.status` (valid/expired/unbound) 가 새 view 의 `mode` (bind/key) 와 의미가 다름.

대응:
- mockLicense fixture 는 보존 (preset/metadata 가 참조할 수 있음 — Phase 12 story 정리에서 일괄 점검)
- license story 는 새 scenario 로 rewrite — mockLicense 직접 의존 제거
- 향후 다른 story 가 mockLicense 를 참조하면 그 시점에 별도 처리

### 9.2 `error` 메시지 i18n 처리 위치

위험: `ERR.LICENSE_INVALID` 같은 error string 이 view 안에서 처리되어야 한다고 오해 가능.

대응:
- view 는 `error: string | null` 만 받음 (이미 translated)
- container 가 `result.reason` → translated string 변환 책임
- Phase 13 spec 에 명시

### 9.3 `KEY_PLACEHOLDER` 상수의 i18n 누락

위험: `XXXXXXXX-XXXXXXXX-XXXXXXXX-XXXXXXXX` 패턴이 향후 다른 license key 형식 (예: short key) 으로 바뀌면 view 수정 필요.

대응:
- 본 phase 는 현 edge 의 hard-coded placeholder 그대로 이전
- format change 시 별도 PR (요청받은 것만 구현 원칙)
- 대안: placeholder 도 `labels` 의 일부로 받기 → 본 phase 에선 채택 안 함 (단순성 우선)

### 9.4 `copied` state lifting

위험: 기존 edge 는 view 안 `setCopied(true)` + `setTimeout` 1500ms. container 로 들어내면 hook 신설 필요.

대응:
- container 가 `useCopyToClipboard()` 같은 hook 신설 (Phase 13 에서 결정)
- 본 phase 는 `copied: boolean` prop 만 노출
- storybook 에선 `copied=false` 고정 (선택적으로 한 scenario 만 true)

### 9.5 `bindMode` 와 `keyMode` 의 동시 표시 불가

위험: 실제 edge UX 는 한 화면에 둘 중 하나만 표시. view 가 둘 다 그리려 하면 충돌.

대응:
- `mode` prop 으로 강제 분기. union type 으로 mutually exclusive 보장 가능하지만 본 phase 에선 string literal type 사용 (단순성).
- view 안 `isBind` 분기 한 곳에서만 결정.

---

## 10. Rollback

git revert. 산출물:
- `packages/edge-pages/src/license/` 디렉토리 삭제
- `packages/edge-pages/src/index.ts` 에서 license export 제거
- `stories/pages/edge/0.0.1/License.stories.tsx` 원본 복구
- `npm run build --workspace packages/edge-pages` 재실행

---

## 11. 종료 후 상태

- `@ingradient/edge-pages` 가 `LoginView` 와 `LicenseView` 둘 다 export
- storybook `Pages/Edge/0.0.1/{Login, License}` 둘 다 view import 기반 동작
- ingradient-edge 미변경
- Phase 1 패턴이 form 류 view 에 두 번 검증됨 → 후속 form view (DatasetSelect 모달 등) 동일 패턴 적용 안전
- Phase 3 (DatasetSelectView + 모달) 진입 준비 완료

---

## 12. 다음 액션

1. 본 spec ok
2. 실행 (§6 의 7 step)
3. 검증 (§7 의 9 step)
4. Phase 3 spec 작성 (`edge-pages-phase-3-spec.md`)
