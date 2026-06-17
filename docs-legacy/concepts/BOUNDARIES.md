# Boundaries

## Core Boundary Rule

판단 기준은 하나다.

`새 프로젝트에서 제품 의미 없이 바로 쓸 수 있는가?`

- `예`이면 `@ingradient/ui`
- `아니오`이면 앱 저장소

## What Belongs In `@ingradient/ui`

- tokens, theme, global style
- button, input, select, checkbox, radio, switch
- modal, dialog, menu, popover, tooltip, drawer
- tabs, sidebar, top bar, filter bar, action bar
- table, image grid shell, stat card, progress block, hover card
- auth/settings/data-view shell
- brand, icon, chart wrapper

## What Stays In Apps

- dataset copy, move, export
- annotation workflow
- bbox and point review semantics
- project permission and member role meaning
- camera discovery and recovery flow
- device settings meaning
- training/model business action flow

## Token Boundary Rule

값을 어디에 둘지도 같은 수준으로 중요하다.

- raw value면 `foundations`
- UI 의미로 재매핑하면 `semantic`
- 여러 컴포넌트가 공유하는 CSS 조합이면 `recipes`
- prop 선택지와 직접 연결되면 `variants`

## Concrete Examples

- `Tabs`, `Table`, `ImageGrid`, `DialogShell` -> core
- status tone map, alert tone map, chart palette -> `tokens/variants`
- `surfacePanel`, `controlField`, `pageHeaderSurface` -> `tokens/recipes`
- dataset export dialog, annotation editor, camera reconnect flow -> app

## Guardrails

- core 저장소에 제품 이름이 붙은 새 패키지를 만들지 않는다.
- 제품 workflow를 docs 샘플 이상의 수준으로 끌고 오지 않는다.
- 새 raw style을 만들기 전에 token layer로 올릴 수 있는지 먼저 본다.
