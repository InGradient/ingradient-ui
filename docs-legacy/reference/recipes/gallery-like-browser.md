# Recipe: Gallery-like Browser

## Use This When

- thumbnail browsing과 inspector-like detail이 같이 필요한 화면

## Recommended Building Blocks

- `AppShell`
- `Toolbar`
- `SplitLayout` or `InspectorLayout`
- `ImageGrid`
- `SectionPanel`
- `MenuPopover`
- `DialogShell`

## Composition Order

1. `AppShell`로 외곽 프레임 구성
2. 상단에 `Toolbar` 배치
3. 본문은 `SplitLayout` 또는 `InspectorLayout`
4. main 영역에는 `ImageGrid`
5. inspector 영역에는 `SectionPanel`
6. item action은 `MenuPopover`, confirm은 `DialogShell`

## Don’t

- dataset/export/annotation semantics를 core recipe 자체에 고정하지 않는다

## Related Docs

- [../patterns/split-layout.md](../patterns/split-layout.md)
- [../components/image-grid.md](../components/image-grid.md)
- [../components/menus-and-overlays.md](../components/menus-and-overlays.md)
