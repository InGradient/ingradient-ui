---
title: Phase 0 — packages/edge-pages Scaffold
purpose: packages/edge-pages/ 빈 entry + tsup/exports/tsconfig/storybook alias 배선만 완성. view 이동 없음
audience: ingradient-ui contributor
date: 2026-05-18
status: draft
related:
  - ./edge-pages-extraction-roadmap.md
  - ./edge-pages-package-plan.md
  - ./platform-pages-phase-2-5-spec.md
---

# Phase 0 — packages/edge-pages Scaffold

> Roadmap: [edge-pages-extraction-roadmap.md](./edge-pages-extraction-roadmap.md) § Phase 0
> Plan: [edge-pages-package-plan.md](./edge-pages-package-plan.md) §4, §5
> 참조 패턴: [platform-pages-phase-2-5-spec.md](./platform-pages-phase-2-5-spec.md) (workspace 분리 spec). platform-pages 가 Stage A→B 두 단계로 진입한 것과 달리, edge-pages 는 이미 platform-pages 가 검증한 workspace 패턴을 처음부터 적용.

---

## 1. 목적

`ingradient-ui` 안에 `@ingradient/edge-pages` 라는 **신규 workspace package** 의 빈 골격을 만든다. 실제 view 파일은 Phase 1 부터.

이 phase 후 다음이 가능해야 한다.

```ts
// Storybook 안에서 또는 외부 consumer 가
import { /* nothing yet */ } from '@ingradient/edge-pages'
```

— 빌드 통과 / import 통과 / 빈 export 일 뿐.

---

## 2. 범위 (Scope)

**포함**:
- `packages/edge-pages/` 디렉토리 신설
- 빈 `src/index.ts` (`export {}`)
- package.json / tsup.config.ts / tsconfig.json
- root `tsconfig.json` `paths` 에 `@ingradient/edge-pages` 추가
- root `package.json` `build:package` 에 edge-pages workspace 빌드 추가
- `.storybook/main.ts` alias 에 `@ingradient/edge-pages` 추가

**제외** (별도 phase):
- 실제 view 코드 이동 (Phase 1~11)
- 신규 stories 추가 (기존 3개 story 는 Phase 1, 2, 3 에서 view 로 rewrite)
- ingradient-edge 측 dependency 등록 (Phase 13)
- publish flow

**건드리지 않음**:
- root `src/` (`@ingradient/ui`)
- 기존 `packages/platform-pages/`
- 기존 stories
- playwright / vitest config
- smoke-consumer
- eslint config

root `package.json` 의 `workspaces` 는 이미 `packages/*` 패턴이라 **추가 변경 없음** — `packages/edge-pages/` 디렉토리 신설만으로 npm workspace 가 자동 인식 ([package-plan §5](./edge-pages-package-plan.md) 확인).

---

## 3. 변경 파일

### 3.1 신규 (4 file)

```
packages/edge-pages/
├─ package.json
├─ tsup.config.ts
├─ tsconfig.json
└─ src/
   └─ index.ts        ← export {}
```

#### `packages/edge-pages/package.json`

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

`@dnd-kit/core` 는 platform-pages 와 달리 edge 가 사용 안 함 → 제외. recharts / react-i18next 는 view 안에서 쓰지 않으므로 peer 없음 (chart 는 Phase 8 에서 slot/children 으로 받거나 sub-view 가 import — 그 시점에 추가 결정).

#### `packages/edge-pages/tsup.config.ts`

`packages/platform-pages/tsup.config.ts` 와 동일:

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

#### `packages/edge-pages/tsconfig.json`

`packages/platform-pages/tsconfig.json` 과 동일 구조:

```json
{
  "extends": "../../tsconfig.json",
  "compilerOptions": {
    "outDir": "lib",
    "rootDir": "src",
    "composite": false,
    "baseUrl": ".",
    "paths": {
      "@ingradient/ui": ["../../lib/index.d.ts"],
      "@ingradient/ui/brand": ["../../lib/brand.d.ts"],
      "@ingradient/ui/tokens": ["../../lib/tokens.d.ts"],
      "@ingradient/ui/primitives": ["../../lib/primitives.d.ts"],
      "@ingradient/ui/components": ["../../lib/components.d.ts"],
      "@ingradient/ui/patterns": ["../../lib/patterns.d.ts"],
      "@ingradient/ui/utils": ["../../lib/utils.d.ts"]
    }
  },
  "include": ["src", "tsup.config.ts"]
}
```

paths 가 `lib/*.d.ts` 를 가리키는 이유: workspace 내부의 edge-pages 가 typecheck 할 때 `@ingradient/ui` 의 빌드 산출물을 참조하도록. platform-pages 와 동일.

#### `packages/edge-pages/src/index.ts`

```ts
export {}
```

placeholder. Phase 1 부터 `export * from './login'` 등이 추가됨.

### 3.2 수정 (3 file)

#### `tsconfig.json` (root)

`paths` 객체에 1 line 추가:

```diff
   "paths": {
     "@ingradient/ui": ["./src/index.ts"],
     "@ingradient/ui/legacy": ["./src/legacy/index.ts"],
     "@ingradient/ui/tokens": ["./src/tokens/index.ts"],
     "@ingradient/ui/primitives": ["./src/primitives/index.ts"],
     "@ingradient/ui/components": ["./src/components/index.ts"],
     "@ingradient/ui/patterns": ["./src/patterns/index.ts"],
     "@ingradient/ui/brand": ["./src/brand/index.tsx"],
     "@ingradient/ui/utils": ["./src/utils/index.ts"],
     "@ingradient/platform-pages": ["./packages/platform-pages/src/index.ts"],
+    "@ingradient/edge-pages": ["./packages/edge-pages/src/index.ts"],
     "@storybook-support/*": ["./stories/support/*"]
   }
```

#### `package.json` (root)

`build:package` 스크립트 끝에 edge-pages workspace 빌드 추가:

```diff
-  "build:package": "rimraf lib && tsup --config tsup.config.ts && node scripts/copy-assets.mjs && node scripts/generate-tokens-css.mjs && npm run build --workspace packages/platform-pages",
+  "build:package": "rimraf lib && tsup --config tsup.config.ts && node scripts/copy-assets.mjs && node scripts/generate-tokens-css.mjs && npm run build --workspace packages/platform-pages && npm run build --workspace packages/edge-pages",
```

#### `.storybook/main.ts`

`viteFinal` 안 `resolve.alias` 에 1 line 추가 (line 102 부근):

```diff
         '@ingradient/ui/patterns': path.resolve(__dirname, '../src/patterns/index.ts'),
         '@ingradient/ui/utils': path.resolve(__dirname, '../src/utils/index.ts'),
         '@ingradient/platform-pages': path.resolve(__dirname, '../packages/platform-pages/src/index.ts'),
+        '@ingradient/edge-pages': path.resolve(__dirname, '../packages/edge-pages/src/index.ts'),
         '@ingradient/ui': path.resolve(__dirname, '../src/index.ts'),
```

`@ingradient/ui` alias 가 prefix 매칭이라 `@ingradient/edge-pages` 보다 **뒤에 와야** 안전 — 위 diff 처럼 ui 위 줄에 삽입.

### 3.3 건드리지 않음

- root `tsup.config.ts` — edge-pages 는 별도 workspace 라 root tsup 의 entry 추가 안 함 (platform-pages 와 동일)
- root `src/index.ts` — edge-pages 는 root re-export 하지 않음
- root `package.json` 의 `workspaces` 배열 — 이미 `packages/*` 라 자동 인식
- 기존 stories — Phase 1 부터 rewrite
- ingradient-edge repo — Phase 13 이후에야 변경

---

## 4. 실행 순서

1. `mkdir -p packages/edge-pages/src`
2. `packages/edge-pages/src/index.ts` 작성 (`export {}`)
3. `packages/edge-pages/package.json` 작성
4. `packages/edge-pages/tsup.config.ts` 작성
5. `packages/edge-pages/tsconfig.json` 작성
6. root `tsconfig.json` paths 1 line 추가
7. root `package.json` build:package 1 line 수정
8. `.storybook/main.ts` alias 1 line 추가
9. `npm install` (workspace 인식)

`Write` + `Edit` tool 만 사용. install 외에 추가 도구 없음.

---

## 5. 검증

순서대로 실행:

| # | 명령 | 기대 결과 |
|---|---|---|
| 1 | `ls packages/edge-pages/src/` | `index.ts` 한 파일 |
| 2 | `npm install` | exit 0, workspace 인식, `node_modules/@ingradient/edge-pages` symlink 생성 |
| 3 | `npx tsc --noEmit -p tsconfig.json` | 0 error |
| 4 | `npm run build --workspace packages/edge-pages` | `packages/edge-pages/lib/index.{js,d.ts,js.map}` 생성 |
| 5 | `npm run build:package` | exit 0, platform-pages + edge-pages workspace 둘 다 빌드, root `lib/*` 정상 |
| 6 | `npm run build:storybook` | exit 0 (storybook 측 영향 없음, 새 alias 만 추가됨) |
| 7 | `cat packages/edge-pages/lib/index.js` | 빈 export 형태 (`export {};` 또는 sourcemap 주석만) |

선택:
- `node -e "import('@ingradient/edge-pages').then(m => console.log(Object.keys(m)))"` 같은 ESM 적합성 체크는 lib 산출물이 type:module 빌드라 직접 실행 어려움. 빌드 산출물 존재 + tsc 통과로 갈음.

---

## 6. 성공 기준

- 검증 1~7 통과
- diff 가 7 file (신규 4 + 수정 3) 범위 내
- 빈 entry 이므로 `packages/edge-pages/lib/index.js` 크기 수십 byte 수준
- `node_modules/@ingradient/edge-pages` 가 workspace symlink 로 존재 (npm 8+)

---

## 7. 리스크

### 7.1 npm workspace 등록 시 install 실패

위험: `peerDependencies: { "@ingradient/ui": "*" }` 가 root package 와 매칭 안 될 수 있음.

대응: platform-pages 가 이미 동일 패턴으로 동작 중 ([packages/platform-pages/package.json:21](../../packages/platform-pages/package.json#L21)). 동일 형식 유지. `npm install` 후 `node_modules/@ingradient/edge-pages` symlink 존재 확인. 실패 시 `dependencies` 로 변경 또는 `workspace:*` (npm 9+) 사용.

### 7.2 tsup 가 `@ingradient/ui` 를 번들에 포함

위험: external 누락 시 ui 코드 일부가 edge-pages.js 에 중복 포함되어 산출물 비대화.

대응: §3.1 의 tsup external 리스트가 platform-pages 와 동일하게 모든 sub-export 명시. 빌드 후 산출물 사이즈로 검증 — 빈 entry 라면 수십 byte 여야 함. 1KB 초과 시 번들 의심.

### 7.3 root tsconfig paths 와 packages/edge-pages 의 자체 tsconfig 충돌

위험: edge-pages 안에서 `@ingradient/ui` import 시 path 가 src 인지 lib 인지 헷갈림.

대응: `packages/edge-pages/tsconfig.json` 이 root 를 extends 하되 `paths` 를 **overwrite** 해서 `lib/*.d.ts` 를 가리키게. platform-pages 와 동일 패턴. Phase 1 이후 view 가 실제 import 할 때 검증됨.

### 7.4 storybook alias 순서

위험: vite resolve alias 가 prefix 매칭이라 `@ingradient/ui` 가 `@ingradient/edge-pages` 보다 먼저 오면 `@ingradient/edge-pages/...` 가 `@ingradient/ui/...` 로 잘못 매칭.

대응: §3.2 의 diff 처럼 `@ingradient/edge-pages` 를 `@ingradient/ui` 보다 **위** 에 배치. platform-pages 와 동일 패턴 (line 102 → 103).

### 7.5 tsc 가 stories/ 까지 잡으면서 새 path alias 가 우선시 안 됨

위험: tsconfig include 에 `stories/` 가 있어 typecheck 시 story 가 path 해석에 실패.

대응: paths 가 추가만 되고 기존 alias 그대로라 영향 없음. 검증 3 에서 즉시 잡힘.

### 7.6 ingradient-edge 측 영향

위험: ingradient-edge repo 가 같은 npm registry / file 시스템을 share 한다고 가정하면 안 됨. 본 phase 는 ingradient-ui 만 건드림.

대응: ingradient-edge 측 변경 없음. Phase 13 까지 무관. 검증 단계에서도 ingradient-edge 빌드 안 함.

---

## 8. Rollback

git revert. 산출물:
- `packages/edge-pages/` 디렉토리 통째로 삭제
- root `tsconfig.json`, `package.json`, `.storybook/main.ts` 의 추가 line 제거
- `npm install` 재실행해서 node_modules symlink 정리

storybook / smoke-consumer / 기존 build 영향 없음 (추가만 했고 기존 alias / entry 그대로).

---

## 9. 종료 후 상태

- `packages/edge-pages/{package.json, tsup.config.ts, tsconfig.json, src/index.ts}` 존재
- `packages/edge-pages/lib/index.{js,d.ts,js.map}` 빌드됨
- `import {} from '@ingradient/edge-pages'` 가 tsc / vite / tsup 모두 인식
- `node_modules/@ingradient/edge-pages` workspace symlink 존재
- Phase 1 (LoginView 추출) 진입 준비 완료

---

## 10. 다음 액션

1. 본 spec ok
2. 실행 (§4 의 9 step)
3. 검증 (§5 의 7 step)
4. Phase 1 spec 작성 (`edge-pages-phase-1-spec.md`)
