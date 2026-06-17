# Docs

이 폴더는 새 문서 체계의 시작점이다.

기존에 누적돼 있던 문서는 보존을 위해 [`docs-legacy/`](../docs-legacy/README.md)로 이동했다.
새 `docs/`는 기준을 다시 정리하면서 필요한 문서부터 순서대로 다시 쓴다.

## Current Scope

지금 활성 문서는 아래 두 층위부터 다시 시작한다.

1. 레이어 경계
2. 재사용 기준

첫 문서는 [`reference/components-vs-patterns.md`](./reference/components-vs-patterns.md)다.

## Reading Order

1. [Reference Index](./reference/README.md)
2. [Components Vs Patterns](./reference/components-vs-patterns.md)

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

지금은 코드를 먼저 재배치하지 않는다.

- 먼저 문서로 기준을 고정한다
- 그 기준으로 현재 코드를 읽고 분류한다
- 구조 변경은 그 다음 단계로 미룬다

첫 적용 대상은 `components vs patterns` 경계다.
