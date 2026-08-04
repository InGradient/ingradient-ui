# UI 규칙 검토 가이드

Lint, source review, Storybook, browser probe를 조합해 UI 규칙을 검증하는 현재 저장소 절차다. 규칙 자체는 [`ui-refactoring-rule.md`](../../ui-refactoring-rule.md)를 따른다.

## 1. 변경 전 안전 확인

```bash
git status --short
git diff --stat
```

기존 dirty 변경을 reset, stash, format하지 않는다. package 변경 전에는 `README.md`, `DESIGN.md`, package README와 현재 story contract를 읽는다.

## 2. Static guardrails

```bash
npm run lint
npm run lint:style
npx tsc --noEmit
npm run check:style-literals
npm run check:doc-coverage
git diff --check
```

- 기존 failure가 있으면 변경 범위와 분리해 보고한다.
- raw-value checker가 허용하지 않는 값을 우회하지 않는다.
- public export나 story coverage 변경은 문서를 같은 변경에서 갱신한다.

## 3. Source-level review

Lint만으로 다음 항목은 충분히 판정할 수 없다.

- component가 product entity/state shape를 알고 있는지
- same-layer component를 우회해 UI를 재구현하는지
- focus/hover/pressed/disabled precedence가 맞는지
- landmark/heading/accessible name이 화면 문맥에서 고유한지
- hooks가 runtime early return보다 뒤에 있어 순서가 바뀌는지

변경 파일과 직접 consumer를 읽고, contract가 달라지면 unit test를 추가한다.

## 4. Unit과 package build

```bash
npm run test:unit
npm run build:package
```

Focused Vitest가 필요하면 변경 파일과 직접 관련된 test path를 지정한다. `build:package`는 UI, Platform Pages, Edge Pages의 JavaScript/DTS boundary를 함께 검증한다.

## 5. Storybook contract

실행 surface:

```bash
npm run storybook
```

가능하면 `http://127.0.0.1:6006/mcp`의 official Storybook MCP를 사용해 affected story를 찾고 focused test를 실행한다. CLI 진단은 현재 Vitest Storybook project를 사용한다.

```bash
npx vitest run --project "storybook:*" <affected-story-files>
npm run test-storybook
npm run build:storybook
```

검토 항목:

- relevant Controls와 explicit Action payload
- named workflow의 실제 post-interaction state
- blocking accessibility
- loading/error/empty/permission/long-content 상태
- 필요한 desktop/tablet/mobile viewport
- canonical story ID와 handoff metadata

성공적으로 load됐다는 사실만으로 visual fidelity를 통과 처리하지 않는다.

## 6. Static probes와 visual regression

Platform page 계약은 해당 `tests/probes/*.mjs`를 실행해 production iframe 상태와 console error를 확인한다.

```bash
npm run build:storybook
npm run test:visual
```

- visual baseline은 platform-specific이다.
- macOS/Darwin capture를 `chromium-linux` baseline으로 대체하지 않는다.
- snapshot update는 의도된 visual 변경 승인을 받은 뒤에만 수행한다.
- responsive review는 viewport, state, overflow, interaction 결과를 구체적으로 기록한다.

## 7. 완료 보고

다음을 구분해 기록한다.

1. 통과한 변경 범위 검증
2. 현재 repository-wide 결과
3. 기존 또는 범위 밖 failure
4. visual/reference에서 확인하지 못한 항목
5. 남은 migration, baseline, consumer 작업

검증하지 않은 내용을 “완료”라고 표현하지 않는다.
