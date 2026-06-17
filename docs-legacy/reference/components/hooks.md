# Hooks

`@ingradient/ui/components`에서 import 가능한 커스텀 hooks.

## useZoomPan

이미지, 캔버스 등에서 줌/팬 상태를 관리한다.

```tsx
import { useZoomPan } from '@ingradient/ui/components'

const { zoom, pan, reset, handleWheel, startPan, movePan, endPan, isZoomPanning, hasPanned } = useZoomPan({
  minZoom: 1,   // default 1
  maxZoom: 8,   // default 8
  zoomStep: 0.25, // default 0.25
})
```

| 반환값 | 타입 | 설명 |
|--------|------|------|
| `zoom` | `number` | 현재 줌 레벨 |
| `pan` | `{ x, y }` | 현재 팬 오프셋 (px) |
| `reset` | `() => void` | 줌/팬 초기화 |
| `handleWheel` | `(e: WheelEvent) => void` | wheel 이벤트 핸들러 (non-passive로 등록) |
| `startPan` | `(clientX, clientY, panX, panY) => void` | 팬 드래그 시작 |
| `movePan` | `(clientX, clientY) => boolean` | 팬 드래그 이동 (threshold 미만이면 false) |
| `endPan` | `() => void` | 팬 드래그 종료 |

## useSelection

멀티 셀렉트 상태 관리. toggle, range, single, selectAll 지원.

```tsx
import { useSelection } from '@ingradient/ui/components'

const { selectedIds, clearSelection, selectAll, onSelectionChange } = useSelection(items)

onSelectionChange('toggle', 'item-1')         // 토글
onSelectionChange('range', 'item-5', 'item-1') // 범위 선택
onSelectionChange('single', 'item-3')          // 단일 선택
selectAll()                                     // 전체 선택
```

## useClipboard

클립보드 복사 + 자동 리셋 상태.

```tsx
import { useClipboard } from '@ingradient/ui/components'

const { copy, copied } = useClipboard({ resetDelay: 2000 })

await copy('텍스트')
// copied === true (2초 후 자동 false)
```

## useUndoRedo

제네릭 상태 히스토리. 어떤 타입이든 undo/redo 가능.

```tsx
import { useUndoRedo } from '@ingradient/ui/components'

const { state, setState, undo, redo, canUndo, canRedo, reset } = useUndoRedo({
  initialState: [],
  maxHistory: 50,
})
```

## useDrawingCanvas

이미지 위에 rect/point를 그리는 인터랙션 로직. `DrawingLayer`와 함께 사용.

```tsx
import { useDrawingCanvas } from '@ingradient/ui/components'

const { selectedId, drawingPreview, cursor, bindings } = useDrawingCanvas({
  objects,
  mode: 'rect', // 'cursor' | 'rect' | 'point'
  onObjectsChange: setObjects,
  onSelectionChange: setSelectedId,
})

// bindings = { onMouseDown, onMouseMove, onMouseUp, onMouseLeave }
```

### 드래그 동작

- 드래그 시작 시 `document`에 mousemove/mouseup을 등록하여, 마우스가 컨테이너 밖으로 나가도 드래그가 계속된다
- 좌표는 0~1로 자동 clamp — 이미지 경계를 넘으면 가장자리에 고정
- 드래그 중 `user-select: none`이 body에 적용되어 텍스트 선택이 방지된다
- mouseup 또는 컴포넌트 unmount 시 자동 해제
