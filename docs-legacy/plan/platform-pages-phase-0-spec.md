---
title: Phase 0 — Sub-export Scaffold
purpose: src/platform-pages/ 빈 entry + tsup/exports/tsconfig 배선만 완성. view 이동 없음
audience: ingradient-ui contributor
date: 2026-05-15
status: draft
related:
  - ./platform-pages-extraction-roadmap.md
  - ./platform-pages-package-plan.md
---

# Phase 0 — Sub-export Scaffold

> Roadmap: [platform-pages-extraction-roadmap.md](./platform-pages-extraction-roadmap.md) § Phase 0

---

## 1. 목적

`ingradient-ui` 가 새 sub-export `@ingradient/ui/platform-pages` 를 빌드하고 노출할 수 있는 **빈 골격**만 만든다. 실제 view 파일은 Phase 1 부터.

이 phase 후 다음이 가능해야 한다.

```ts
// Storybook 안에서 또는 외부 consumer 가
import { /* nothing yet */ } from '@ingradient/ui/platform-pages'
```

— 빌드 통과 / import 통과 / 빈 export 일 뿐.

---

## 2. 변경 파일

### 2.1 신규 (1 file)

- `src/platform-pages/index.ts` — 빈 barrel. 내용은 placeholder `export {}` 한 줄.

### 2.2 수정 (3 file)

#### `tsup.config.ts`

`entry` 객체에 1 line 추가:

```ts
entry: {
  index: 'src/index.ts',
  legacy: 'src/legacy/index.ts',
  tokens: 'src/tokens/index.ts',
  primitives: 'src/primitives/index.ts',
  components: 'src/components/index.ts',
  patterns: 'src/patterns/index.ts',
  brand: 'src/brand/index.tsx',
  utils: 'src/utils/index.ts',
  'platform-pages': 'src/platform-pages/index.ts',   // ← 추가
},
```

#### `package.json`

`exports` 객체에 1 line 추가:

```json
"exports": {
  ".": "./lib/index.js",
  "./brand": "./lib/brand.js",
  "./legacy": "./lib/legacy.js",
  "./tokens.css": "./lib/tokens.css",
  "./tokens": "./lib/tokens.js",
  "./primitives": "./lib/primitives.js",
  "./components": "./lib/components.js",
  "./patterns": "./lib/patterns.js",
  "./utils": "./lib/utils.js",
  "./platform-pages": "./lib/platform-pages.js"
}
```

#### `tsconfig.json`

`paths` 객체에 1 line 추가:

```json
"paths": {
  "@ingradient/ui": ["./src/index.ts"],
  "@ingradient/ui/legacy": ["./src/legacy/index.ts"],
  "@ingradient/ui/tokens": ["./src/tokens/index.ts"],
  "@ingradient/ui/primitives": ["./src/primitives/index.ts"],
  "@ingradient/ui/components": ["./src/components/index.ts"],
  "@ingradient/ui/patterns": ["./src/patterns/index.ts"],
  "@ingradient/ui/brand": ["./src/brand/index.tsx"],
  "@ingradient/ui/platform-pages": ["./src/platform-pages/index.ts"],
  "@storybook-support/*": ["./stories/support/*"]
}
```

### 2.3 건드리지 않음

- `src/index.ts` (root barrel) — platform-pages 는 root re-export 하지 않음 (별도 entry 라 sub-export 로만 접근)
- storybook config (`.storybook/`)
- playwright / vitest config
- smoke-consumer
- eslint config

---

## 3. 실행 순서

1. `src/platform-pages/index.ts` 생성 (`export {}`)
2. `tsup.config.ts` entry 추가
3. `package.json` exports 추가
4. `tsconfig.json` paths 추가

`Write` + `Edit` tool 만 사용. install / config 재생성 없음.

---

## 4. 검증

순서대로 실행:

| # | 명령 | 기대 결과 |
|---|---|---|
| 1 | `npx tsc --noEmit -p tsconfig.json` | 0 error |
| 2 | `npm run build:package` | exit 0, `lib/platform-pages.js`, `lib/platform-pages.d.ts`, `lib/platform-pages.js.map` 생성 |
| 3 | `ls lib/platform-pages.*` | 3 file 확인 |
| 4 | `npm run build:storybook` | exit 0 (storybook 측 영향 없음 확인) |

선택:
- `node -e "import('@ingradient/ui/platform-pages').then(m => console.log(Object.keys(m)))"` 같은 ESM 적합성 체크는 lib 산출물이 type:module 빌드라 직접 실행 어려움. 빌드 산출물 존재 + tsc 통과로 갈음.

---

## 5. 성공 기준

- 위 검증 1~4 통과
- diff 가 4 file (신규 1 + 수정 3) 범위 내
- 빈 entry 이므로 lib 산출물 크기는 수십 byte 수준

---

## 6. 리스크

### 6.1 tsup entry 충돌

위험: `platform-pages` 가 `patterns`/`primitives` 와 dependency 그래프가 얽혀 splitting 부작용

대응: 현재 tsup 은 `splitting: false`. 새 entry 가 비어 있으므로 chunk 생성 없음. 향후 view 추가 시점에서도 splitting:false 유지.

### 6.2 exports map 의 dual package hazard

위험: `./platform-pages` 가 CJS / ESM 양쪽으로 노출되지 않음

대응: 현 package 는 `"type": "module"` + tsup `format: ['esm']` 단일. ESM only 정책 유지. 다른 export 와 동일.

### 6.3 typecheck 가 stories/ 까지 잡으면서 새 path alias 가 우선시 안 됨

위험: tsconfig include 에 `stories/` 가 있어 typecheck 시 story 가 path 해석에 실패

대응: paths 가 추가만 되고 기존 alias 그대로라 영향 없음. 검증 1 에서 즉시 잡힘.

---

## 7. Rollback

git revert 4 file. 산출물 `lib/platform-pages.*` 만 삭제하면 됨. storybook / smoke-consumer 영향 없음.

---

## 8. 종료 후 상태

- `src/platform-pages/index.ts` 존재, 비어 있음
- `lib/platform-pages.{js,d.ts}` 빌드됨
- `import {} from '@ingradient/ui/platform-pages'` 가 tsc 에서 인식됨
- Phase 1 (CreateProject 추출) 진입 준비 완료
