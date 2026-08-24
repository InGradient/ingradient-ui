# Primitives Reference

`@ingradient/ui/primitives` is the lowest reusable React layer above tokens. It provides generic layout, typography, surface, and SVG geometry contracts; it must not know product terminology, router state, API data, or page workflow.

## Public areas

| Area | Public API | Use it for | Storybook |
|---|---|---|---|
| Layout | `Box`, `Stack`, `Inline`, `Grid`, `Container` | generic composition and responsive flow | `Primitives / Layout` |
| Typography | `Heading`, `Text`, `H1`–`H4`, `B1`–`B3`, `C1`, `L1` | semantic text hierarchy and tokenized variants | `Primitives / Typography` |
| Surfaces | `Surface`, `Divider`, `ScrollArea`, `Icon` | generic elevation, separation, overflow, icon sizing | `Primitives / Surfaces` |
| SVG | `SvgBboxRect`, `SvgPointDot`, `SvgShapeHandle`, `SvgShapeLabel` | annotation geometry in SVG coordinate space | `Primitives / SVG` |

## Consumption rules

- Use `Stack`, `Inline`, or `Grid` before adding a one-off flex/grid styled component.
- Numeric `gap` values are raw pixels (`space(3)` → `3px`). Pass `var(--ig-space-N)` when a consumer must resolve a spacing token; use `tokenSpace(N)` when constructing CSS values in source.
- Use semantic `Text` weight aliases (`regular`, `medium`, `semibold`, `bold`) and letter-spacing aliases (`tight`, `normal`, `wide`, `wider`, `widest`).
- `Heading level={1}` renders an `h1`; preserve heading order in page and Storybook canvas structure.
- `Surface` provides generic elevation only. Keep product-specific border, interaction, and state visuals in the owning pattern or page package.
- SVG primitives own geometry, not product color decisions. Supply theme-token colors from their consumer.

## Boundary

```text
tokens → primitives → components → patterns → page packages
```

- If the reusable value is a single generic control or display unit, use `components`.
- If the reusable value is a generic arrangement of multiple units, use `patterns`.
- If it knows product/domain terms or controlled page state, keep it in `platform-pages` or `edge-pages`.

See [Components vs Patterns](../components-vs-patterns.md) for the complete classification guide.
