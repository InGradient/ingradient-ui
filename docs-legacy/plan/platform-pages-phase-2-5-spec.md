---
title: Phase 2.5 — packages/platform-pages/ Migration (Stage B, partial)
purpose: src/platform-pages/ 를 packages/platform-pages/ 의 별도 npm workspace package 로 분리. 패키지 이름은 @ingradient/platform-pages
audience: ingradient-ui contributor
date: 2026-05-15
status: draft
related:
  - ./platform-pages-extraction-roadmap.md
  - ./platform-pages-package-plan.md
---

# Phase 2.5 — packages/platform-pages/ Migration

> Roadmap 보강: 원래 [extraction-roadmap §3.2](./platform-pages-extraction-roadmap.md) 에서 Stage B 를 "별도 roadmap" 으로 유예했으나, plan 문서 §4 의 목표 구조와 사용자 의도를 따라 **Phase 3 진입 전에 이동** 으로 결정.

---

## 1. 목적

현재:
```
ingradient-ui/
├─ src/platform-pages/        ← Phase 0~2 에서 생성한 코드
└─ ...
```

목표:
```
ingradient-ui/
├─ packages/
│  └─ platform-pages/         ← 별도 workspace package, 이름 @ingradient/platform-pages
│     ├─ src/                 ← src/platform-pages/* 가 그대로 이동
│     ├─ lib/                 ← tsup 산출물
│     ├─ package.json
│     ├─ tsup.config.ts
│     └─ tsconfig.json
├─ src/                       ← @ingradient/ui (그대로 유지 — 본 phase 범위 밖)
└─ ...
```

Import path 변화:
- Storybook & 외부 consumer: `@ingradient/ui/platform-pages` → `@ingradient/platform-pages`

---

## 2. 범위 (Scope)

**포함**:
- `src/platform-pages/` 내용 전부를 `packages/platform-pages/src/` 로 이동 (create-project, class-manage)
- 별도 package.json / tsup / tsconfig 구성
- workspace 등록 (root `package.json` 의 `workspaces` 에 `packages/*` 추가)
- import path 일괄 치환 (story 2개)
- root build 파이프라인에서 platform-pages 제거 (tsup entry, exports, tsconfig paths, vite alias)

**제외** (별도 phase 또는 영구 유예):
- `src/` (현 `@ingradient/ui`) 를 `packages/ui/` 로 이동 (변경 파일 수 30+ 예상, 별도 phase)
- 새 package 의 publish flow (현재는 dev-only 사용)
- npm install 흐름의 정식 dependency 등록 (workspace 내부 link 로 충분)

---

## 3. 변경 파일

### 3.1 신규 (4 file)

```
packages/platform-pages/
├─ package.json
├─ tsup.config.ts
├─ tsconfig.json
└─ src/                    ← src/platform-pages/ 통째로 이동 (git mv)
   ├─ index.ts
   ├─ create-project/...
   └─ class-manage/...
```

#### `packages/platform-pages/package.json`

```json
{
  "name": "@ingradient/platform-pages",
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

#### `packages/platform-pages/tsup.config.ts`

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

#### `packages/platform-pages/tsconfig.json`

```json
{
  "extends": "../../tsconfig.json",
  "compilerOptions": {
    "outDir": "lib",
    "rootDir": "src",
    "composite": false
  },
  "include": ["src", "tsup.config.ts"]
}
```

### 3.2 삭제 (1 dir)

- `src/platform-pages/` (이동 후 빈 디렉터리 삭제)

### 3.3 수정 (6 file)

#### `package.json` (root)

```diff
 "workspaces": [
+  "packages/*",
   "apps/storybook-smoke-consumer"
 ],
 "exports": {
   ...
-  "./platform-pages": "./lib/platform-pages.js"
 }
```

Build script 변경 (root build:package 에 platform-pages 도 빌드되게):
```diff
- "build:package": "rimraf lib && tsup --config tsup.config.ts && node scripts/copy-assets.mjs && node scripts/generate-tokens-css.mjs",
+ "build:package": "rimraf lib && tsup --config tsup.config.ts && node scripts/copy-assets.mjs && node scripts/generate-tokens-css.mjs && npm run build --workspace packages/platform-pages",
```

#### `tsup.config.ts` (root)

```diff
   utils: 'src/utils/index.ts',
-  'platform-pages': 'src/platform-pages/index.ts',
 },
```

#### `tsconfig.json` (root)

```diff
   "paths": {
     ...
     "@ingradient/ui/brand": ["./src/brand/index.tsx"],
-    "@ingradient/ui/platform-pages": ["./src/platform-pages/index.ts"],
+    "@ingradient/platform-pages": ["./packages/platform-pages/src/index.ts"],
     "@storybook-support/*": ["./stories/support/*"]
   }
```

#### `.storybook/main.ts`

```diff
     '@ingradient/ui/patterns': path.resolve(__dirname, '../src/patterns/index.ts'),
-    '@ingradient/ui/platform-pages': path.resolve(__dirname, '../src/platform-pages/index.ts'),
+    '@ingradient/platform-pages': path.resolve(__dirname, '../packages/platform-pages/src/index.ts'),
     '@ingradient/ui': path.resolve(__dirname, '../src/index.ts'),
```

#### `stories/pages/platform/0.0.1/CreateProject.stories.tsx`

```diff
- import { CreateProjectView, type ProjectType } from '@ingradient/ui/platform-pages'
+ import { CreateProjectView, type ProjectType } from '@ingradient/platform-pages'
```

#### `stories/pages/platform/0.0.1/ClassManage.stories.tsx`

```diff
- import { ClassManageView } from '@ingradient/ui/platform-pages'
+ import { ClassManageView } from '@ingradient/platform-pages'
```

### 3.4 건드리지 않음

- `src/` (ui) 자체
- 모든 ui pattern / component
- 25 scenario fixture
- scene hook
- probe scripts (대상 view 는 동일하므로 selector 변경 없음)

---

## 4. 실행 순서

1. `mkdir packages` 후 `git mv src/platform-pages packages/platform-pages/src` (또는 mv 후 add/delete)
2. `packages/platform-pages/{package.json, tsup.config.ts, tsconfig.json}` 작성
3. root `package.json` workspaces / exports / scripts 수정
4. root `tsup.config.ts` 의 entry 제거
5. root `tsconfig.json` paths 수정
6. `.storybook/main.ts` alias 수정
7. story 2개의 import path 수정
8. `npm install` (workspace 인식)

---

## 5. 검증

| # | 명령 | 기대 |
|---|---|---|
| 1 | `ls packages/platform-pages/src/` | `create-project/`, `class-manage/`, `index.ts` |
| 2 | `ls src/platform-pages` | not a directory (지워짐) |
| 3 | `npm install` | exit 0, workspaces 인식됨 |
| 4 | `npx tsc --noEmit -p tsconfig.json` | 0 error |
| 5 | `npm run build --workspace packages/platform-pages` | `packages/platform-pages/lib/index.{js,d.ts}` 생성 |
| 6 | `npm run build:package` | root tsup 에서 `lib/platform-pages.*` 안 생김 (entry 제거됨), platform-pages workspace 도 같이 빌드 |
| 7 | `npm run build:storybook` | exit 0 |
| 8 | `node tests/probes/create-project.mjs` | 5/5 pass |
| 9 | `node tests/probes/class-manage.mjs` | 7/7 pass |

---

## 6. 리스크

### 6.1 workspaces 등록 시 npm install 실패

위험: `peerDependencies` 의 `@ingradient/ui: "*"` 가 workspace 안의 root package 와 매칭 안 될 수 있음

대응: workspace 내부에선 `peerDependencies` 만으로 충분. npm 8+ 는 자동으로 root package 를 link. 실패 시 `dependencies` 로 변경 또는 file: 프로토콜 사용. `npm install` 후 `node_modules/@ingradient/platform-pages` 와 `node_modules/@ingradient/ui` 존재 확인.

### 6.2 tsup 이 `@ingradient/ui/*` import 를 번들에 포함

위험: external 리스트 누락 시 ui 코드 일부가 platform-pages.js 에 중복 포함

대응: external 에 `@ingradient/ui` prefix 의 5개 sub-export 모두 명시 (위 §3.1 의 tsup.config.ts). 빌드 후 산출물 사이즈로 검증 — 이전 19 KB 보다 너무 커지면 번들 의심.

### 6.3 root tsconfig paths 와 packages/* 의 자체 tsconfig 충돌

위험: storybook 빌드 시 path 가 packages 안으로 안 들어감

대응: packages/platform-pages/tsconfig.json 이 root 를 extends, 추가 paths 정의 안 함. 모든 path 해석은 root tsconfig 에서.

### 6.4 stories 가 storybook 의 vite alias 로 packages/* 를 못 찾음

위험: vite alias 가 `'../src/platform-pages/index.ts'` 였는데 경로만 바뀌면 끝나야 함

대응: §3.3 .storybook/main.ts 수정으로 alias 도 `'../packages/platform-pages/src/index.ts'` 로 점프. 검증 7번에서 확인.

### 6.5 git mv 시 history loss

위험: `mv` 사용 시 git 이 rename 인식 못함

대응: `git mv src/platform-pages packages/platform-pages/src` 사용. add+remove 가 아니라 rename 으로 tracking.

---

## 7. Rollback

git revert 또는 reset. workspace 등록까지 되돌리려면 `npm install` 다시. 위험은 작음 (산출물 외엔 다 git tracked).

---

## 8. 성공 기준

- 검증 1~9 통과
- `src/platform-pages/` 사라지고 `packages/platform-pages/src/` 에 동일 코드 존재
- 모든 story 가 새 import path 사용
- 모든 ingradient-ui 의 기존 빌드 / story / probe 결과 유지

---

## 9. 종료 후 효과

- ingradient-platform 이 향후 `@ingradient/platform-pages` 로 import 가능 (Phase 7)
- `@ingradient/ui` 와 `@ingradient/platform-pages` 의 의존 방향이 코드 / npm 양쪽에서 명시
- 향후 `src/` → `packages/ui/` 이동 시 import path 일관성 (모두 `@ingradient/...`)

---

## 10. 다음 액션

1. 본 spec ok
2. 실행 (§4 의 8 step)
3. 검증
4. Phase 3 (Catalog) spec 으로 이동
