# ingradient-ui 코드 품질 개선 계획

작성일: 2026-03-26
기준 문서: [ingradient-docs/dev/](../../../ingradient-docs/dev/README.md)

---

## 현재 상태 요약

ingradient-ui는 디자인 시스템 컴포넌트 라이브러리로,
아키텍처(레이어 분리, 토큰 전략, export 전략)와 문서화는 **매우 우수**하지만,
**테스트, 린팅, CI 파이프라인**이 완전히 빠져있다.

### 감사 결과

| 기준 | 항목 | 상태 | 심각도 |
|------|------|------|--------|
| structure.md | 파일 분리, 네이밍, 레이어 | ✅ 충족 | — |
| structure.md | 200줄 이하 | ⚠️ 1개 위반 (vertical-tabs.tsx 224줄) | 🟡 |
| env-and-config.md | 환경 변수 검증 | ✅ 해당 없음 (라이브러리) | — |
| data-integrity.md | 경계 입력 검증 | ✅ 해당 없음 (UI 라이브러리) | — |
| testing.md | 단위 테스트 | ❌ 전무 | 🔴 |
| testing.md | CI 파이프라인 | ❌ PR 검증 없음 | 🔴 |
| security.md | ESLint 보안 규칙 | ❌ ESLint 자체가 없음 | 🔴 |
| security.md | npm 취약점 | ⚠️ jspdf 1건 (high) | 🟡 |
| — | 접근성 (a11y) | ⚠️ ARIA 있지만 자동 테스트 없음 | 🟡 |
| — | 문서화 | ✅ 우수 (48개 참조 문서 + 커버리지 검증) | — |
| — | 토큰 전략 | ✅ 우수 (TS → CSS 자동 생성 + 리터럴 검사) | — |

### 강점 (이미 잘 되어있는 것)

- 레이어 구조: tokens → primitives → components → patterns
- export 전략: 7개 진입점, barrel file, named export only
- 토큰 파이프라인: TS 소스 → CSS 변수 자동 생성 + 리터럴 사용 검증
- 문서화: 48개 참조 문서 + showcase 앱 + 커버리지 검증 스크립트
- 접근성: ARIA role, aria-label, aria-expanded 사용

---

## 실행 로드맵

```
 순서    Phase                              상태
────────────────────────────────────────────────────
  1     Phase 1  ESLint + 파일 크기 수정          DONE
        ├ 1-1 ESLint flat config + security 플러그인
        ├ 1-2 vertical-tabs.tsx 110줄 + styles 106줄
        └ 1-3 npm 취약점 수정 (jspdf)

  2     Phase 2  테스트 인프라 + CI              DONE
        ├ 2-1 Vitest 설정 (jsdom, @testing-library/react)
        ├ 2-2 토큰 단위 테스트 (alertToneStyles)
        ├ 2-3 컴포넌트 렌더링 테스트 (Alert, Badge, Spinner)
        └ 2-4 GitHub Actions CI (lint + typecheck + test + build)

  2.5   Phase 4-1  watch 모드                   DONE
        └ dev:lib script (tsup --watch)

  3     Phase 3  접근성 + 품질 게이트             DONE
        ├ 3-1 axe 접근성 자동 테스트 (Alert, Spinner)
        ├ 3-2 번들 크기 추적 (check-bundle-size.mjs, 231KB/500KB)
        └ 3-3 커버리지 임계값 (lines 30%, branches 20% — 점진적 상향)

  4     Phase 4  개발 워크플로우 나머지            DONE
        ├ 4-2 pre-publish 검증 (publish.yml: lint+test+build+검증 전체)
        ├ 4-3 export 호환성 검증 (check-exports.mjs)
        └ 4-4 소비 프로젝트 버전 동기화 가이드 (문서화)
```

**실행 순서: Phase 1 → Phase 2 + 4-1 (병렬) → Phase 3 → Phase 4 나머지**

---

## Phase 1. ESLint + 파일 크기 수정

### 1-1. ESLint flat config

**현재:** ESLint 설정 없음. 코드 품질 게이트 없음.

**작업:**
1. `eslint`, `@eslint/js`, `typescript-eslint`, `eslint-plugin-security`, `globals` 설치
2. `eslint.config.js` 생성
3. `package.json`에 `"lint"` 스크립트 추가

```javascript
// eslint.config.js
import js from '@eslint/js'
import tseslint from 'typescript-eslint'
import security from 'eslint-plugin-security'
import globals from 'globals'

export default tseslint.config(
  { ignores: ['lib/', 'dist/', 'node_modules/', 'apps/'] },
  js.configs.recommended,
  ...tseslint.configs.recommended,
  {
    files: ['src/**/*.{ts,tsx}'],
    languageOptions: { globals: { ...globals.browser } },
    plugins: { security },
    rules: {
      '@typescript-eslint/no-explicit-any': 'warn',
      '@typescript-eslint/no-unused-vars': ['warn', {
        argsIgnorePattern: '^_', varsIgnorePattern: '^_'
      }],
      'security/detect-eval-with-expression': 'error',
      'no-debugger': 'error',
    },
  },
)
```

### 1-2. vertical-tabs.tsx 분리

**현재:** 224줄 — FILE_RULES.md 위반 (200줄 제한)

**작업:**
- styled components를 `vertical-tabs.styles.ts`로 분리
- 또는 `VerticalTabItem` 컴포넌트를 별도 파일로 분리

### 1-3. npm 취약점 수정

**현재:** jspdf <=4.2.0 high severity (design-showcase 의존성)

**작업:**
- `apps/design-showcase/package.json`에서 jspdf 업데이트 또는 제거
- 메인 패키지에는 영향 없음

---

## Phase 2. 테스트 인프라 + CI

### 2-1. Vitest 설정

**현재:** 테스트 러너 없음

**작업:**
1. `vitest`, `@testing-library/react`, `@testing-library/jest-dom`, `jsdom` 설치
2. `vitest.config.ts` 생성
3. `package.json`에 `"test"` 스크립트 추가

```typescript
// vitest.config.ts
import { defineConfig } from 'vitest/config'

export default defineConfig({
  test: {
    environment: 'jsdom',
    globals: true,
    include: ['src/**/*.test.{ts,tsx}'],
  },
})
```

### 2-2. 유틸리티/토큰 단위 테스트

테스트 우선순위가 높은 코드:

| 대상 | 이유 |
|------|------|
| `tokens/globals/css-contract.ts` | TS 토큰 → CSS 변수 변환 로직 |
| `tokens/variants/*.ts` | tone 매핑이 올바른지 |
| `components/feedback/toast.tsx` | 상태 관리 + 타이머 로직 |
| `scripts/check-style-literals.mjs` | 빌드 게이트 정확성 |

### 2-3. 컴포넌트 렌더링 테스트

최소한의 "깨지지 않는지" 확인:

```typescript
// src/components/feedback/__tests__/alert.test.tsx
import { render, screen } from '@testing-library/react'
import { Alert } from '../alert'

test('Alert renders children', () => {
  render(<Alert $tone="info">Test message</Alert>)
  expect(screen.getByText('Test message')).toBeInTheDocument()
})
```

대상: Alert, Badge, Button, Spinner, TextField — 가장 많이 사용되는 5개 컴포넌트

### 2-4. GitHub Actions CI

```yaml
# .github/workflows/ci.yml
name: CI
on: [push, pull_request]
jobs:
  validate:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with: { node-version: '20', cache: npm }
      - run: npm ci
      - run: npm run lint
      - run: npx tsc --noEmit
      - run: npm test
      - run: npm run build:package
      - run: npm run check:style-literals
      - run: npm run check:doc-coverage
```

기존 `publish.yml`은 유지하되, CI가 통과한 후에만 publish되도록 연결.

---

## Phase 3. 접근성 + 품질 게이트

### 3-1. axe 접근성 자동 테스트

design-showcase 앱에 axe-playwright 테스트 추가:

```typescript
// apps/design-showcase/e2e/a11y.spec.ts
import { test, expect } from '@playwright/test'
import AxeBuilder from '@axe-core/playwright'

test('components page has no a11y violations', async ({ page }) => {
  await page.goto('/components')
  const results = await new AxeBuilder({ page }).analyze()
  expect(results.violations).toEqual([])
})
```

### 3-2. 번들 크기 추적

`build:package` 후 번들 크기를 기록:

```bash
# scripts/check-bundle-size.mjs
// lib/*.js 파일 크기 합산, 임계값 초과 시 경고
```

### 3-3. 커버리지 임계값

```typescript
// vitest.config.ts
export default defineConfig({
  test: {
    coverage: {
      provider: 'v8',
      thresholds: { lines: 60, branches: 50 },
    },
  },
})
```

초기에는 60% 목표, 점진적으로 80%까지 올림.

---

## 파일 변경 범위 예측

| Phase | 새 파일 | 수정 파일 |
|-------|---------|----------|
| Phase 1 | `eslint.config.js`, `vertical-tabs.styles.ts` (또는 분리 파일) | `package.json`, `vertical-tabs.tsx` |
| Phase 2 | `vitest.config.ts`, 5~10개 테스트 파일, `.github/workflows/ci.yml` | `package.json` |
| Phase 3 | `e2e/a11y.spec.ts`, `scripts/check-bundle-size.mjs` | `vitest.config.ts` (커버리지 추가) |

---

## ingradient-ui에 해당하지 않는 기준

| 기준 | 사유 |
|------|------|
| env-and-config.md | UI 라이브러리는 환경 변수 불필요 |
| data-integrity.md | DB/API 경계 없음 |
| error-policy.md | 비즈니스 로직 없음 — 에러 표시 컴포넌트만 제공 |
| logging-and-debugging.md | 라이브러리에서 로깅 불필요 (소비자가 처리) |

---

## Phase 4. 개발 워크플로우 개선

ingradient-ui는 다른 프로젝트(platform, auth-service, edge)와 **동시 개발**되면서
**패키징/배포** 시에는 독립적으로 버전 관리되는 특수한 구조다.

### 현재 워크플로우

```
개발 시:                          배포 시:
ingradient-ui/src/ 수정           git tag v0.0.2
      ↓ (수동 빌드)               publish.yml → npm pack → .tgz
npm run build:package             GitHub Release에 업로드
      ↓                                ↓
ingradient-ui/lib/ 갱신           소비 프로젝트에서 다운로드
      ↓ (Vite alias)               (edge: download-ui.mjs)
platform/auth-service HMR         (platform: file: 링크)
```

### 문제점

| 문제 | 영향 |
|------|------|
| **수동 빌드 필요** | UI 변경 후 `npm run build:package` 잊으면 소비 프로젝트가 stale 코드 사용 |
| **watch 모드 없음** | 매번 수동 빌드 → 개발 속도 저하 |
| **버전 수동 관리** | `package.json` version 직접 수정 → 실수 가능 |
| **changelog 자동화 없음** | 어떤 변경이 어떤 버전에 포함됐는지 추적 어려움 |
| **소비 프로젝트 간 버전 불일치 가능** | platform은 최신 lib/, edge는 이전 .tgz 사용 가능 |
| **CI에서 빌드 검증 없음** | publish 전에 타입 에러, 린트 에러 확인 안 됨 |

### 4-1. watch 모드 추가

```json
// package.json scripts
"dev:lib": "tsup --watch src"
```

tsup은 `--watch` 옵션을 지원한다. 이걸 쓰면:
1. `npm run dev:lib` 실행 (터미널 1)
2. 소비 프로젝트 dev 서버 실행 (터미널 2)
3. UI 소스 변경 → tsup 자동 빌드 → Vite가 lib/ 변경 감지 → HMR

**컴포넌트/스타일 변경 시 수동 빌드 문제 해결.**

> **주의:** tsup `--watch`는 TypeScript 컴파일만 재실행한다.
> `copy-assets.mjs`(브랜드 자산)와 `generate-tokens-css.mjs`(CSS 변수)는
> watch에 포함되지 않으므로, **토큰이나 브랜드 자산을 변경했을 때는
> 여전히 `npm run build:package` 수동 실행이 필요**하다.
> 대부분의 일상 개발(컴포넌트 수정, 스타일 변경)은 watch로 충분하다.

### 4-2. pre-publish 검증

publish.yml이 CI(ci.yml)와 동일한 검증을 반복하지 않도록,
**CI 통과를 전제 조건**으로 설정하고 publish.yml은 빌드+패키징만 담당:

```yaml
# .github/workflows/publish.yml (개선)
on:
  push:
    tags: ['v*']
jobs:
  publish:
    runs-on: ubuntu-latest
    # CI가 같은 커밋에서 통과했을 때만 실행 (수동 tag push이므로 CI는 이미 완료됨)
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with: { node-version: '20', cache: npm }
      - run: npm ci
      - run: npm run lint
      - run: npx tsc --noEmit
      - run: npm test
      - run: npm run build:package
      - run: npm run check:style-literals
      - run: npm run check:doc-coverage
      - run: npm pack
      - uses: softprops/action-gh-release@v2
```

> 참고: tag push 시 CI와 publish가 동시에 트리거되므로,
> publish에서도 검증을 포함하는 게 안전하다 (CI가 실패해도 publish는 자체 검증).
> 중복이지만 **깨진 패키지 배포 방지**가 우선.

### 4-3. export 호환성 검증 스크립트

소비 프로젝트가 사용하는 import 경로가 실제로 동작하는지 빌드 후 자동 확인:

```javascript
// scripts/check-exports.mjs
import { readFileSync, existsSync } from 'fs'

const pkg = JSON.parse(readFileSync('package.json', 'utf8'))
const exports = pkg.exports

let failed = false
for (const [key, path] of Object.entries(exports)) {
  if (!existsSync(path)) {
    console.error(`MISSING: ${key} → ${path}`)
    failed = true
  }
}

// 소비 프로젝트가 실제로 사용하는 주요 export 확인
const requiredExports = [
  'Button', 'TextField', 'Alert', 'Badge', 'Spinner',
  'ToastProvider', 'useToast',
  'IngradientThemeProvider', 'IngradientGlobalStyle',
]
// lib/components.js에서 named export 확인
const componentsCode = readFileSync('lib/components.js', 'utf8')
for (const name of requiredExports) {
  if (!componentsCode.includes(name)) {
    console.error(`MISSING EXPORT: ${name} not found in lib/components.js`)
    failed = true
  }
}

if (failed) process.exit(1)
console.log('All exports verified.')
```

### 4-4. 소비 프로젝트 버전 동기화 가이드

현재 상태:
- **platform/auth-service**: `file:` 링크 → 항상 로컬 최신 (개발 시)
- **edge**: `.tgz` 다운로드 → 특정 버전 고정 (배포 시)

이 차이는 의도적이지만, 모든 프로젝트가 배포 시 **같은 버전**을 사용하도록
`package.json`의 version과 GitHub Release tag를 일치시키는 것이 중요.

배포 체크리스트:
1. ingradient-ui 변경 완료 → `npm version patch/minor/major`
2. tag push → publish.yml → .tgz 생성
3. edge: `npm run update-ui v{version}` 으로 업데이트
4. platform/auth-service: `file:` 링크라 빌드 시 자동 반영 (CI에서 `npm run build:package` 필요)

---

## 확장 시나리오 검증

이 계획 완료 후 아래 작업 시 변경 범위:

| 새 기능 | 변경 범위 |
|---------|----------|
| 새 컴포넌트 추가 | `src/components/{category}/` 파일 + index.ts export + 테스트 + 참조 문서 |
| 토큰 추가/변경 | `src/tokens/` 수정 → CSS 자동 재생성 → check-style-literals 통과 |
| 접근성 개선 | axe 테스트에서 자동 감지 → 해당 컴포넌트 수정 |
| 버전 릴리스 | CI 통과 → `npm version` → tag push → publish.yml 자동 |
| UI 수정 중 platform 동시 개발 | `npm run dev:lib` (watch) + platform dev 서버 → 실시간 HMR |
| export 경로 변경 | check-exports.mjs에서 자동 감지 → 소비 프로젝트 alias 업데이트 |
