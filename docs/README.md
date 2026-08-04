# Docs

이 폴더는 현재 코드와 운영 계약을 설명하는 활성 문서의 시작점이다.

기존에 누적돼 있던 문서는 보존을 위해 [`docs-legacy/`](../docs-legacy/README.md)로 이동했다.
새 `docs/`는 기준을 다시 정리하면서 필요한 문서부터 순서대로 다시 쓴다.

## Current Scope

활성 문서는 다음 계약을 다룬다.

1. `@ingradient/ui`의 token → primitive → component → pattern 경계
2. `@ingradient/platform-pages`와 `@ingradient/edge-pages`의 controlled product view 경계
3. Storybook의 executable documentation 계약
4. package build, unit, accessibility, probe, visual validation
5. `docs-legacy/`에 보존된 audit/plan의 역사적 판단 기록으로 가는 index

## Reading Order

1. [Root Architecture](../README.md)
2. [Design Contract](../DESIGN.md)
3. [Reference Index](./reference/README.md)
4. [Components Vs Patterns](./reference/components-vs-patterns.md)
5. [UI Refactoring Rules](../ui-refactoring-rule.md)
6. [UI Workflow Guide](./guides/ui-workflow.md)
7. [UI Audit Guide](./guides/ui-audit.md)
8. [Platform Pages Package](../packages/platform-pages/README.md)
9. [Platform Story Contract](../stories/pages/platform/0.0.1/README.md)
10. [Platform Migration and Verification](../stories/pages/platform/0.0.1/MIGRATION.md)

## Legacy Docs

기존 운영 문서, 계획 문서, 릴리즈 노트, 상세 reference는 당분간 `docs-legacy/`에 유지한다.

- [Legacy Docs Index](../docs-legacy/README.md)
- [Legacy Reference](../docs-legacy/reference/README.md)
- [Legacy Releases](../docs-legacy/releases/README.md)

## Rewrite Principle

새 문서는 이전 문서를 그대로 복사하지 않는다.

- 먼저 현재 팀이 실제로 쓰는 판단 기준을 정리한다
- 중복된 설명은 줄인다
- Storybook과 코드 구조를 기준으로 다시 쓴다
- reference와 rule을 분리해서 유지한다

## Current Documentation Strategy

- 코드, public exports, Storybook IDs, probes, visual targets, 문서를 하나의 contract migration으로 취급한다.
- package-owned view가 바뀌면 소비 story와 검증 경로를 같은 변경에서 갱신한다.
- 완료된 audit/plan은 `docs-legacy/`에 보존하고, 현재 authority 문서로 오해되지 않도록 status banner와 최신 문서 링크를 둔다.
- 새 운영 기준은 active docs에 기록하고, 더 이상 현재 구조를 설명하지 않는 문서는 `docs-legacy/`에 보존한다.
