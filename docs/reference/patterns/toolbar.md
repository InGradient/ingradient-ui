# Toolbar & Filter Bar

## Import

```ts
import { Toolbar, FilterBar } from '@ingradient/ui/patterns'
```

## What It Is

search, action, filter control을 한 줄 또는 래핑 가능한 row로 묶는 page block이다.

## When To Use

- 목록 상단 검색과 action row
- filter-heavy toolbar
- compact control strip

## Main Building Blocks

- `Toolbar`
- `FilterBar`

## Common Composition

- `Toolbar + Button + SearchField`
- `FilterBar + SearchField + SelectField`

## Do

- 검색, 필터, primary action을 같은 row 규칙으로 정리한다

## Don’t

- toolbar마다 별도 shell을 만들지 않는다

## Related Docs

- [../components/button.md](../components/button.md)
- [../components/select.md](../components/select.md)
