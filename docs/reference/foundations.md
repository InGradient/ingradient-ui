# Foundations Reference

## What This Covers

`@ingradient/ui`의 foundations는 다음 다섯 가지를 기준으로 본다.

- token source
- semantic theme
- generated `tokens.css`
- primitives
- brand assets

## Imports

```ts
import { IngradientThemeProvider, IngradientGlobalStyle } from '@ingradient/ui/tokens'
import { Box, Stack, Inline, Grid, Container, Surface, Text, Heading } from '@ingradient/ui/primitives'
import { BrandMark, BrandLogo } from '@ingradient/ui/brand'
```

## When To Use

- 새 앱에서 디자인 시스템을 처음 붙일 때
- semantic token 구조를 이해할 때
- raw style 대신 primitives로 화면을 조립할 때
- 공식 브랜드 자산을 재사용할 때

## Token Model

1. `foundations`
   - raw color, spacing, radius, typography, shadow, motion
2. `semantic`
   - 실제 UI 의미 단위
3. `recipes`
   - 반복되는 스타일 조합
4. `variants`
   - public prop과 연결되는 선택지

## CSS Consumption

- React/styled-components 환경
  - `IngradientThemeProvider`
  - `IngradientGlobalStyle`
- CSS-only 환경
  - `@ingradient/ui/tokens.css`

## Primitives

### Layout

- `Box`
- `Stack`
- `Inline`
- `Grid`
- `Container`

### Typography

- `Text`
- `Heading`

### Surface

- `Surface`

## Surface Elevation

- `panel`
  - 기본 데이터 화면 surface
- `raised`
  - dialog, floating menu, overlay
- `card`
  - 강조된 highlight block

## Brand

- `BrandMark`
  - 좁은 공간, app chrome, favicon-like usage
- `BrandLogo`
  - 헤더, intro, auth, larger brand placement

## Do

- semantic token을 우선 사용한다
- primitives 조합으로 먼저 해결한다
- 브랜드 자산은 `@ingradient/ui/brand`에서만 가져온다

## Don’t

- raw hex, raw spacing, raw radius를 화면 코드에 직접 넣지 않는다
- feature마다 별도 typography/surface 체계를 만들지 않는다
- 브랜드 표기를 임의 텍스트 이니셜로 대체하지 않는다
