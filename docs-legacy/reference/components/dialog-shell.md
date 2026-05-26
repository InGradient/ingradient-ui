# Dialog Shell

## Import

```ts
import { DialogShell, DialogCloseButton, ConfirmDialog } from '@ingradient/ui/components'
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
- `height?: string | number` — 고정 높이 모달 (예: `height="min(600px, 80dvh)"`)

### Height & Tab Modals

- 탭이 있는 모달은 `height`를 설정하여 탭 전환 시 크기 점프를 방지한다
- `DialogContent` 영역은 `flex: 1; min-height: 0; overflow-y: auto`가 적용되어 콘텐츠가 넘칠 때 스크롤된다

### `ConfirmDialog`

- `title`
- `description`
- `confirmLabel?`
- `cancelLabel?`
- `onConfirm`
- `onCancel`
- `confirmVariant?`

### `DialogCloseButton`

- custom dialog header에서도 같은 close affordance를 유지할 때 사용한다
- generic `IconButton` 대신 dialog tone을 그대로 쓴다

## Do

- 공용 dialog shell에 feature body만 주입한다
- 짧고 명확한 action row를 둔다
- custom modal header를 만들 때도 `DialogCloseButton`을 재사용한다

## Don’t

- 긴 multi-pane workflow를 작은 dialog 안에 욱여넣지 않는다
- generic `IconButton`을 dialog close 용도로 직접 덮어쓰지 않는다
