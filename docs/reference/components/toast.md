# Toast

## Import

```ts
import { ToastProvider, useToast } from '@ingradient/ui/components'
```

## What It Is

짧게 사라지는 non-blocking feedback layer다.

## When To Use

- 저장/업로드/동기화 결과를 잠깐 알릴 때
- 현재 작업 흐름을 막지 않고 상태를 알려야 할 때
- dialog보다 가벼운 피드백이 필요할 때

## Main Building Blocks

- `ToastProvider`
- `useToast()`

## Example

```tsx
function SaveButton() {
  const toast = useToast()

  return (
    <button onClick={() => toast('Saved successfully', { tone: 'success' })}>
      Save
    </button>
  )
}
```

## Notes

- 기본 duration은 4초다
- toast 자체를 클릭하면 즉시 dismiss 된다
- `tone`은 alert tone과 같은 semantic tone을 따른다

## Do

- success, warning, failure 같은 짧은 결과 알림에 쓴다
- 화면을 막아야 하는 경우는 `DialogShell`이나 `Alert`를 검토한다

## Don’t

- 긴 설명이나 다단계 action을 toast에 넣지 않는다
- 영구 상태 배너 용도로 쓰지 않는다

## Related Docs

- [feedback.md](./feedback.md)
- [alert.md](./alert.md)
