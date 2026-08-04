# Reference

이 폴더는 새 문서 체계의 활성 reference다.

## Current contracts

1. [Design Contract](../../DESIGN.md)
2. [Components Vs Patterns](./components-vs-patterns.md)
3. [Platform Pages Package](../../packages/platform-pages/README.md)
4. [Platform Story Contract](../../stories/pages/platform/0.0.1/README.md)
5. [Platform Migration and Verification](../../stories/pages/platform/0.0.1/MIGRATION.md)

현재 계층 흐름은 다음과 같다.

```text
tokens → primitives → components → patterns
  → platform-pages / edge-pages
  → consumer application state and services
```

Storybook page stories are executable consumers of the page packages, not an additional production implementation layer.

## Historical audits

아래 문서는 날짜가 고정된 판단 근거로 `docs-legacy/`에 보존한다. 현재 파일 위치와 public API의 authority는 위 current contracts다.

- [Components Pattern Audit — 2026-05](../../docs-legacy/reports/components-pattern-audit-2026-05.md)
- [Components Extraction Candidates — 2026-05](../../docs-legacy/reports/components-extraction-candidates-2026-05.md)
- [Layer Chain Audit — 2026-06-21](../../docs-legacy/reports/layer-chain-audit-2026-06-21.md)
- [UI Layer Violations — 2026-06-25](../../docs-legacy/ui-layer-violations.md)
- [UI Rule Re-audit — 2026-06-28](../../docs-legacy/ui-rule-reaudit-2026-06-28.md)

Layer-specific indexes:

- [Components Reference](./components/README.md)
- [Patterns Reference](./patterns/README.md)

## Legacy Reference

이전 reference 문서는 아직 [`docs-legacy/reference/`](../../docs-legacy/reference/README.md)에 있다.
