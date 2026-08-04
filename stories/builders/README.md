# Storybook Builders

Storybook 안에서 layout, page composition, theme preset을 조정하고 결과를 즉시 검토하는 실험 도구다. 각 builder는 native Storybook args를 사용하며 production package API로 export하지 않는다.

## Builders

- `LayoutComposer` — Flex, Grid, Stack 등의 gap, columns, alignment 조합을 검토한다.
- `PageComposer` — pattern/layout slot을 조합하고 결과와 JSX 형태를 확인한다.
- `ThemeBuilder` — theme, brand, density, token override를 조합하고 preset export를 지원한다.

공통 draft/export support는 `stories/support/`에 둔다.

Historical context:

- [Storybook architecture](../../docs-legacy/storybook_architecture_restructure.md)
- [Builder implementation plan](../../docs-legacy/plan/storybook-restructure-phase-5-builders.md)
