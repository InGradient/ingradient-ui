# Surfaces

## Import

```ts
import { Card, Paper, Accordion } from '@ingradient/ui/components'
import { Surface } from '@ingradient/ui/primitives'
```

## What It Covers

- `Surface`
- `Paper`
- `Card`
- `Accordion`

## When To Use

- 콘텐츠를 레이어로 구분할 때
- 강조된 block이 필요할 때
- progressive disclosure가 필요할 때

## Choosing The Right Surface

- `Surface`
  - 가장 기본적인 elevation primitive
- `Paper`
  - 일반 section shell
- `Card`
  - 강조된 콘텐츠 묶음
- `Accordion`
  - 접고 펼치는 보조 정보

## Do

- information hierarchy를 surface elevation으로 만든다
- 단순 section은 `Surface`나 `Paper`부터 시작한다

## Don’t

- 모든 block을 card로 올려서 위계를 흐리지 않는다
- 필수 입력을 accordion 안에 숨기지 않는다
