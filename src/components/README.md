# Components Layer

이 폴더는 `@ingradient/ui/components`의 구현을 가진다.

## Put Here

- form/input controls
- feedback blocks
- data display components
- navigation widgets
- overlays
- charts
- icon registry UI

## Do Not Put Here

- page-level shell
- multi-pane layout
- app-wide navigation structure
- product-specific workflow

그런 것은 `patterns` 또는 소비 앱에 둔다.

## Rule Of Thumb

- 독립적으로 import해서 바로 쓸 수 있으면 `components`
- 여러 components/primitives를 조립한 화면 골격이면 `patterns`
- 제품 의미를 알아야 하면 앱에 남긴다
