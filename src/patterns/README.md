# Patterns Layer

이 폴더는 `@ingradient/ui/patterns`의 구현을 가진다.

## Put Here

- app shell
- page header
- toolbar / filter bar
- sidebar shell
- split layout
- settings shell
- dashboard grid
- form section

## Do Not Put Here

- primitive-level input/display component
- product-specific workflow
- API-aware stateful screen

## Rule Of Thumb

- 화면 골격과 layout rhythm을 재사용하면 `patterns`
- product semantics가 들어가지만 API/store와 분리된 controlled composition이면 `@ingradient/platform-pages` 또는 `@ingradient/edge-pages`를 검토한다
- business rule, persistence, permission 판정이 들어가면 소비 앱에 남긴다
