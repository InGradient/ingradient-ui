import React, { useState } from 'react'
import { Stack, Text } from '@ingradient/ui/primitives'
import {
  SearchField,
  NumberField,
  MentionTextarea,
  SelectionActionBar,
  EmptyState,
  CommentThread,
  CommentItem,
  CommentInput,
  ColorSwatch,
  TagList,
  TagListSearch,
  ImageViewer,
  ImageViewerToolbar,
  DrawingLayer,
  CopyButton,
  ModeSwitcher,
  ChipGroup,
  FormGroup,
  FieldRow,
  FilterBarLayout,
  KeyboardShortcutHint,
  Button,
  useZoomPan,
  useDrawingCanvas,
  useSelection,
  useClipboard,
  useUndoRedo,
  type DrawingObject,
} from '@ingradient/ui/components'

// ── Hooks Demo ─────────────────────────────────────────────────────

export function HooksDemo() {
  const zoom = useZoomPan({ maxZoom: 4 })
  const { copy, copied } = useClipboard()
  const items = [{ id: 'a' }, { id: 'b' }, { id: 'c' }]
  const sel = useSelection(items)
  const undo = useUndoRedo({ initialState: 0 })

  return (
    <Stack gap={14}>
      <Text>useZoomPan: zoom={zoom.zoom.toFixed(2)}</Text>
      <Text>useClipboard: copied={String(copied)} <button onClick={() => void copy('hello')}>Copy</button></Text>
      <Text>useSelection: {sel.selectedIds.size} selected <button onClick={() => sel.selectAll()}>All</button> <button onClick={() => sel.clearSelection()}>Clear</button></Text>
      <Text>useUndoRedo: state={undo.state} <button onClick={() => undo.setState(undo.state + 1)}>+1</button> <button onClick={() => undo.undo()} disabled={!undo.canUndo}>Undo</button></Text>
    </Stack>
  )
}

// ── SearchField Demo ───────────────────────────────────────────────

export function SearchFieldDemo() {
  const [q, setQ] = useState('')
  return (
    <Stack gap={10}>
      <SearchField value={q} onChange={(e) => setQ(e.target.value)} onClear={() => setQ('')} placeholder="Search..." />
      <SearchField value={q} onChange={(e) => setQ(e.target.value)} onClear={() => setQ('')} placeholder="Small" size="sm" />
    </Stack>
  )
}

// ── NumberField Demo ───────────────────────────────────────────────

export function NumberFieldDemo() {
  const [v, setV] = useState(50)
  return (
    <Stack gap={10}>
      <NumberField value={v} onChange={setV} min={0} max={100} step={5} />
      <Text>Value: {v}</Text>
    </Stack>
  )
}

// ── MentionTextarea Demo ───────────────────────────────────────────

export function MentionTextareaDemo() {
  const [text, setText] = useState('')
  const candidates = [
    { id: '1', name: 'Alice', secondary: 'alice@test.com' },
    { id: '2', name: 'Bob', secondary: 'bob@test.com' },
    { id: '3', name: 'Charlie', secondary: 'charlie@test.com' },
  ]
  return (
    <Stack gap={6}>
      <MentionTextarea value={text} onChange={setText} candidates={candidates} placeholder="Type @ to mention..." />
      <Text style={{ fontSize: 12, opacity: 0.6 }}>Try typing @A or @B</Text>
    </Stack>
  )
}

// ── Feedback Demos ─────────────────────────────────────────────────

export function SelectionActionBarDemo() {
  const [count, setCount] = useState(3)
  return (
    <Stack gap={10}>
      <SelectionActionBar
        selectedCount={count}
        totalCount={20}
        onClearSelection={() => setCount(0)}
        onSelectAll={() => setCount(20)}
        actions={<Button variant="secondary" onClick={() => setCount(0)}>Delete</Button>}
      />
      <button onClick={() => setCount((c) => c + 1)}>Select one more</button>
    </Stack>
  )
}

export function EmptyStateDemo() {
  return (
    <Stack gap={14}>
      <EmptyState title="No results" description="Try a different search query." action={{ label: 'Clear filters', onClick: () => {} }} />
      <EmptyState title="No images yet" />
    </Stack>
  )
}

// ── Data Display Demos ─────────────────────────────────────────────

export function CommentThreadDemo() {
  const [draft, setDraft] = useState('')
  return (
    <Stack gap={10}>
      <CommentThread>
        <CommentItem author="Alice" timestamp="2 hours ago" body="Looks good to me!" />
        <CommentItem author="Bob" timestamp="1 hour ago" body="Can we check the edge case?" />
      </CommentThread>
      <CommentInput value={draft} onChange={setDraft} onSubmit={() => setDraft('')} />
    </Stack>
  )
}

export function ColorSwatchTagListDemo() {
  const [selected, setSelected] = useState<string | null>(null)
  const tags = [
    { id: '1', color: '#ef4444', label: 'Defect', count: 12 },
    { id: '2', color: '#3b82f6', label: 'Normal', count: 45 },
    { id: '3', color: '#22c55e', label: 'Good', count: 8 },
  ]
  return (
    <Stack gap={14}>
      <Stack gap={4} style={{ flexDirection: 'row', alignItems: 'center' }}>
        <ColorSwatch $color="#ef4444" $size="xs" />
        <ColorSwatch $color="#3b82f6" $size="sm" />
        <ColorSwatch $color="#22c55e" $size="md" />
        <ColorSwatch $color="#f59e0b" $size="md" $shape="square" />
      </Stack>
      <TagList items={tags} selectedId={selected} onItemClick={setSelected} />
      <TagListSearch
        placeholder="Search class..."
        candidates={[{ id: '4', color: '#8b5cf6', label: 'Scratch' }, { id: '5', color: '#f97316', label: 'Dent' }]}
        onSelect={(id) => alert(`Selected: ${id}`)}
        emptyMessage="No matching classes."
      />
    </Stack>
  )
}

// ── ImageViewer + DrawingLayer Demo ────────────────────────────────

export function ImageViewerDemo() {
  const [mode, setMode] = useState<'cursor' | 'rect' | 'point'>('cursor')
  const [objects, setObjects] = useState<DrawingObject[]>([
    { id: 'demo-1', type: 'rect', x: 0.1, y: 0.1, w: 0.3, h: 0.25, color: '#ef4444', label: 'Defect' },
    { id: 'demo-2', type: 'point', x: 0.7, y: 0.6, color: '#3b82f6' },
  ])
  const { selectedId, drawingPreview, cursor, bindings } = useDrawingCanvas({
    objects, mode, onObjectsChange: setObjects,
  })

  return (
    <Stack gap={8}>
      <ModeSwitcher
        options={[{ value: 'cursor', label: 'Select' }, { value: 'rect', label: 'Rect' }, { value: 'point', label: 'Point' }]}
        value={mode}
        onChange={(v) => setMode(v as typeof mode)}
        size="sm"
      />
      <div style={{ height: 300, border: '1px solid var(--ig-color-border-subtle)', borderRadius: 8, overflow: 'hidden', cursor, position: 'relative' }} {...bindings}>
        <ImageViewer src="data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='800' height='600'%3E%3Crect fill='%23222' width='800' height='600'/%3E%3Ctext x='400' y='300' text-anchor='middle' fill='%23555' font-size='24'%3ESample Image%3C/text%3E%3C/svg%3E" alt="Sample">
          <DrawingLayer objects={objects} selectedId={selectedId} drawingPreview={drawingPreview} showHandles showLabels />
        </ImageViewer>
      </div>
    </Stack>
  )
}

// ── Interaction Demos ──────────────────────────────────────────────

export function InteractionDemo() {
  const [mode, setMode] = useState('cursor')
  return (
    <Stack gap={14}>
      <Stack gap={4}>
        <Text style={{ fontWeight: 600, fontSize: 13 }}>CopyButton</Text>
        <CopyButton value="Hello from ingradient-ui!">Copy text</CopyButton>
      </Stack>
      <Stack gap={4}>
        <Text style={{ fontWeight: 600, fontSize: 13 }}>ModeSwitcher</Text>
        <ModeSwitcher
          options={[{ value: 'cursor', label: 'Cursor' }, { value: 'rect', label: 'Rect' }, { value: 'point', label: 'Point' }]}
          value={mode}
          onChange={setMode}
        />
      </Stack>
      <Stack gap={4}>
        <Text style={{ fontWeight: 600, fontSize: 13 }}>KeyboardShortcutHint</Text>
        <Stack gap={6} style={{ flexDirection: 'row' }}>
          <KeyboardShortcutHint keys={['⌘', 'C']} />
          <KeyboardShortcutHint keys={['⌘', 'Z']} />
          <KeyboardShortcutHint keys={['Del']} size="sm" />
        </Stack>
      </Stack>
    </Stack>
  )
}

// ── Layout Demos ───────────────────────────────────────────────────

export function LayoutDemo() {
  const chips = [
    { id: '1', label: 'Defect', color: '#ef4444' },
    { id: '2', label: 'Normal', color: '#3b82f6' },
    { id: '3', label: 'Good', color: '#22c55e' },
    { id: '4', label: 'Scratch', color: '#8b5cf6' },
    { id: '5', label: 'Dent', color: '#f97316' },
  ]
  const [v, setV] = useState(50)

  return (
    <Stack gap={18}>
      <Stack gap={4}>
        <Text style={{ fontWeight: 600, fontSize: 13 }}>ChipGroup (maxVisible=3)</Text>
        <ChipGroup items={chips} maxVisible={3} />
      </Stack>
      <FormGroup title="Camera Settings" description="Capture parameters">
        <FieldRow label="Exposure" hint="0~100">
          <NumberField value={v} onChange={setV} min={0} max={100} />
        </FieldRow>
      </FormGroup>
      <Stack gap={4}>
        <Text style={{ fontWeight: 600, fontSize: 13 }}>FilterBarLayout</Text>
        <FilterBarLayout onClear={() => {}}>
          <SearchField value="" onChange={() => {}} placeholder="Filter..." size="sm" />
        </FilterBarLayout>
      </Stack>
    </Stack>
  )
}
