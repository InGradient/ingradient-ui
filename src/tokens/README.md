# Tokens Layer

이 폴더는 디자인 값의 source of truth를 가진다.

## Layers

- `foundations`
  - raw design values
- `semantic`
  - UI 의미 단위의 토큰
- `recipes`
  - 반복되는 스타일 조합
- `variants`
  - component props와 연결되는 선택지
- `globals`
  - CSS 변수 계약과 global style

## Rule Of Thumb

- raw value면 `foundations`
- 의미 기반 이름이면 `semantic`
- 반복 조합이면 `recipes`
- public prop surface면 `variants`

## Important

- 직접 수정하는 곳은 `src/tokens/**`
- `lib/tokens.css`는 generated output이다
