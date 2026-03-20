# Troubleshooting

## Package Installs But Styles Do Not Appear

확인할 것:

- `IngradientThemeProvider`를 최상단에 넣었는가
- `IngradientGlobalStyle`를 같이 렌더링했는가
- `styled-components` peer dependency가 설치되어 있는가

## CSS-Only Environment

React/styled-components가 아니라면:

```ts
import '@ingradient/ui/tokens.css'
```

이 경로를 직접 import한다.

## Tokens Were Changed But CSS Does Not Match

확인 순서:

1. `src/tokens/**`를 수정했는가
2. `lib/tokens.css`를 직접 수정하지 않았는가
3. `npm run build:package`를 다시 돌렸는가

## I Cannot Find The Right Component

순서:

1. `docs/reference/getting-started.md`
2. `docs/reference/components/README.md`
3. `docs/reference/patterns/README.md`
4. interactive showcase

## Dialog Or Drawer?

- 짧은 confirm or short form -> `DialogShell`
- supporting side context -> `Drawer`

## Table Or Image Grid?

- row/column comparison -> `Table`
- visual browsing -> `ImageGrid`

## SplitLayout Or SettingsShell?

- generic browser/workspace multi-pane -> `SplitLayout`
- menu + content settings structure -> `SettingsShell`

## Legacy Imports

새 코드는 `@ingradient/ui/legacy`를 기본으로 쓰지 않는다.

legacy는 다음 경우만 허용한다.

- migration compatibility가 당장 필요할 때
- 기존 앱 consumer를 단계적으로 정리할 때
