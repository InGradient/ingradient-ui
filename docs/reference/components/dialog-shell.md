# Dialog Shell

## Import

```ts
import { DialogShell, ConfirmDialog } from '@ingradient/ui/components'
```

## What It Is

확인, 짧은 폼, destructive action을 위한 재사용 가능한 modal shell이다.

## When To Use

- 확인 dialog
- 짧은 생성/편집 폼
- destructive action confirm

## Main Props

### `DialogShell`

- `title: ReactNode`
- `description?: ReactNode`
- `children?: ReactNode`
- `actions?: ReactNode`
- `onClose?: () => void`
- `width?: string | number`

### `ConfirmDialog`

- `title`
- `description`
- `confirmLabel?`
- `cancelLabel?`
- `onConfirm`
- `onCancel`
- `confirmVariant?`

## Do

- 공용 dialog shell에 feature body만 주입한다
- 짧고 명확한 action row를 둔다

## Don’t

- 긴 multi-pane workflow를 작은 dialog 안에 욱여넣지 않는다
