# List Detail

## Import

```ts
import { ListDetailLayout } from '@ingradient/ui/patterns'
```

## What It Is

목록과 상세/에디터를 좌우로 나누는 master-detail layout이다.

## When To Use

- 설정 카테고리 + detail
- 멤버 목록 + 편집 영역
- template list + editor

## Main Building Blocks

- `ListDetailLayout`

## Common Composition

- `ListDetailLayout + Table + FormSection`
- `ListDetailLayout + SidebarNav + SectionPanel`

## Do

- 목록-상세 관계가 명확한 화면에 사용한다

## Don’t

- 관계가 약한 두 영역을 억지로 붙이지 않는다

## Related Docs

- [settings-shell.md](./settings-shell.md)
- [layouts.md](./layouts.md)
