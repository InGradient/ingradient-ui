# Notification Badge

## Import

```ts
import { NotificationBadge, IconButton, Button } from '@ingradient/ui/components'
```

## What It Is

icon이나 compact action 위에 unread count, pending state를 얹는 attached badge helper다.

## When To Use

- notice count
- inbox unread count
- nav action의 pending indicator

## Main Props

- `value?: ReactNode`
- `hidden?: boolean`
- `tone?: 'danger' | 'accent'`
- `children: ReactNode`

## Common Composition

- `NotificationBadge + IconButton`
- `NotificationBadge + Button`
- `Sidebar action + unread count`

## Do

- compact trigger 위에만 붙인다
- count가 없을 때는 `hidden`으로 감춘다

## Don't

- 본문 metadata tag를 NotificationBadge로 대체하지 않는다
- 긴 문구를 badge 안에 넣지 않는다

## Related Docs

- [avatar-badge.md](./avatar-badge.md)
- [navigation.md](./navigation.md)
