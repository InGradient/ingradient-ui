# Context Menu

## Import

```ts
import {
  ContextMenuBackdrop,
  ContextMenuList,
  ContextMenuItem,
  ContextMenuButton,
  ContextMenuSub,
  ContextMenuSubItem,
} from '@ingradient/ui/components'
```

## What It Is

우클릭 또는 특정 trigger에서 cursor 좌표에 fixed 배치되는 메뉴 primitives 세트다.

## When To Use

- 이미지/행 우클릭 secondary action
- cursor 위치 기반 contextual action
- submenu가 필요한 계층형 context action

## Main Props

- `$x / $y: number` — `ContextMenuList`의 fixed 위치 좌표 (e.clientX / e.clientY)
- `$left / $top: number` — `ContextMenuSub`의 fixed 위치 좌표
- `$danger?: boolean` — `ContextMenuButton`에서 destructive 색상 적용
- `$color?: string` — `ContextMenuSubItem`의 개별 CSS 색상 값

## Choose The Right Component

- `ContextMenuList` — cursor 위치에 뜨는 메뉴 컨테이너
- `ContextMenuSub` — 서브메뉴 컨테이너
- `ContextMenuButton` — 일반 또는 danger action 버튼
- `ContextMenuSubItem` — 서브메뉴 항목 버튼
- `ContextMenuItem` — hover 이벤트 감지용 wrapper
- `ContextMenuBackdrop` — click-outside 처리용 투명 backdrop

## Common Composition

```tsx
const [menu, setMenu] = useState<{ x: number; y: number } | null>(null)

<div onContextMenu={(e) => { e.preventDefault(); setMenu({ x: e.clientX, y: e.clientY }) }}>
  {/* content */}
</div>

{menu && (
  <>
    <ContextMenuBackdrop onClick={() => setMenu(null)} aria-hidden />
    <ContextMenuList $x={menu.x} $y={menu.y}>
      <ContextMenuButton type="button" $danger onClick={handleDelete}>Delete</ContextMenuButton>
      <ContextMenuItem onMouseEnter={...} onMouseLeave={...}>
        <ContextMenuButton as="div">Set class ›</ContextMenuButton>
      </ContextMenuItem>
    </ContextMenuList>
  </>
)}
```

## Do

- `ContextMenuBackdrop`의 `onClick`으로 click-outside를 처리한다
- z-index는 backdrop=100, list=101, sub=102 순서로 고정되어 있다
- 우클릭 trigger에는 `e.preventDefault()`를 호출한다

## Don't

- trigger 버튼에 anchored되는 메뉴에는 MenuPopover를 쓴다 (ContextMenu 아님)
- primary action을 context menu 안에만 넣지 않는다 (발견하기 어렵다)

## Related Docs

- [menus-and-overlays.md](./menus-and-overlays.md)
- [overlays.md](./overlays.md)
- [tooltip.md](./tooltip.md)
