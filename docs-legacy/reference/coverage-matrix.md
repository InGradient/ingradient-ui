# Coverage Matrix

이 문서는 public surface가 어디에서 문서화되는지 추적하는 기준표다.

## Coverage Levels

- `storybook documented`
- `markdown reference documented`
- `recipe documented`

## Core Surface

| Surface | Storybook | Reference | Recipe |
| --- | --- | --- | --- |
| tokens / theming | yes | yes | n/a |
| primitives | yes | yes | yes |
| brand | yes | yes | yes |
| inputs | yes | yes | yes |
| navigation | yes | yes | yes |
| data display | yes | yes | yes |
| overlays | yes | yes | yes |
| charts | yes | yes | yes |
| patterns | yes | yes | yes |
| TextField / PasswordField | yes | yes | yes |
| Alert | yes | yes | — |
| Badge / Chip / StatusPill | yes | yes | — |
| Spinner | yes | yes | — |
| button destructive tone | yes | yes | yes |
| field label/group helpers | yes | yes | yes |
| FileInput | yes | yes | — |
| ToastProvider / useToast | yes | yes | — |
| **신규 (Phase 1~9)** | | | |
| hooks (useZoomPan, useSelection, useClipboard, useUndoRedo, useDrawingCanvas) | yes | yes | yes |
| SearchField | yes | yes | yes |
| NumberField | yes | yes | yes |
| MentionTextarea | yes | yes | — |
| SelectionActionBar | yes | yes | yes |
| EmptyState | yes | yes | — |
| CommentThread / CommentItem / CommentInput | yes | yes | — |
| ColorSwatch | yes | yes | — |
| TagList / TagListSearch | yes | yes | yes |
| ImageViewer / ImageViewerToolbar | yes | yes | yes |
| DrawingLayer | yes | yes | yes |
| UploadDropzone | yes | yes | — |
| CopyButton | yes | yes | — |
| ModeSwitcher | yes | yes | yes |
| ResizablePanel | yes | yes | — |
| ChipGroup | yes | yes | — |
| FormGroup / FieldRow | yes | yes | yes |
| FilterBarLayout | yes | yes | — |
| KeyboardShortcutHint | yes | yes | — |

## Rule

- Storybook이 없는 public surface는 불완전한 API로 본다
- 자주 쓰는 surface는 markdown reference도 있어야 한다
- 실제 페이지 조립에 자주 쓰는 조합은 recipe 문서도 있어야 한다
