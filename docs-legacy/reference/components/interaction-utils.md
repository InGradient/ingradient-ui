# Interaction Utilities

CopyButton, ModeSwitcher, ResizablePanel, ChipGroup, FormGroup, FilterBarLayout, KeyboardShortcutHint.

## CopyButton

클립보드 복사 버튼. 복사 후 "Copied!" 피드백.

```tsx
import { CopyButton } from '@ingradient/ui/components'
<CopyButton value="복사할 텍스트">Copy Token</CopyButton>
```

| Prop | Type | Default | 설명 |
|------|------|---------|------|
| `value` | `string` | — | 복사할 텍스트 |
| `copiedLabel` | `string` | `'Copied!'` | 복사 후 표시 텍스트 |
| `size` | `'sm' \| 'md'` | `'md'` | 크기 |

## ModeSwitcher

N개 옵션 중 1개 선택하는 pill 버튼 그룹.

```tsx
import { ModeSwitcher } from '@ingradient/ui/components'
<ModeSwitcher
  options={[{ value: 'cursor', label: 'Cursor' }, { value: 'rect', label: 'Rect' }]}
  value={mode}
  onChange={setMode}
/>
```

## ResizablePanel

마우스 드래그로 리사이즈 가능한 2분할 패널.

```tsx
import { ResizablePanel } from '@ingradient/ui/components'
<ResizablePanel defaultSize={280} minSize={150} maxSize={500} storageKey="sidebar-w">
  <Sidebar />
  <Content />
</ResizablePanel>
```

| Prop | Type | Default | 설명 |
|------|------|---------|------|
| `direction` | `'horizontal' \| 'vertical'` | `'horizontal'` | 분할 방향 |
| `defaultSize` | `number` | `240` | 첫 번째 패널 초기 크기 (px) |
| `minSize` / `maxSize` | `number` | `100` / `600` | 최소/최대 크기 |
| `storageKey` | `string` | — | localStorage 자동 저장 키 |

## ChipGroup

여러 칩을 보여주고 초과 시 "+N more" 표시.

```tsx
import { ChipGroup } from '@ingradient/ui/components'
<ChipGroup items={tags} maxVisible={3} onItemClick={handleClick} />
```

## FormGroup & FieldRow

설정 폼의 라벨-입력 쌍 레이아웃.

```tsx
import { FormGroup, FieldRow } from '@ingradient/ui/components'
<FormGroup title="Camera Settings">
  <FieldRow label="Exposure" hint="0~100">
    <NumberField value={exposure} onChange={setExposure} min={0} max={100} />
  </FieldRow>
</FormGroup>
```

## FilterBarLayout

검색 + 필터 컨테이너. children으로 SearchField, SelectField 등을 배치.

```tsx
import { FilterBarLayout, SearchField } from '@ingradient/ui/components'
<FilterBarLayout onClear={resetFilters}>
  <SearchField value={q} onChange={e => setQ(e.target.value)} />
</FilterBarLayout>
```

## KeyboardShortcutHint

키보드 단축키 표시.

```tsx
import { KeyboardShortcutHint } from '@ingradient/ui/components'
<KeyboardShortcutHint keys={['⌘', 'C']} />
```
