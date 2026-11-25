import type { ReactNode } from 'react'
import {
  CircleDotIcon, PointerIcon, RedoIcon, ResetIcon, SquareIcon, TagIcon,
  ToolbarShell, TrashIcon, UndoIcon, type ToolbarShellAction,
} from '@ingradient/ui/components'
import { iconSizeNumbers } from '@ingradient/ui/tokens'
import type { ImageDetailTool, ImageDetailToolbarProps } from './image-detail-main.types'

const ICON_SIZE = iconSizeNumbers.lg

const TOOLS: Array<{ key: ImageDetailTool; title: string; icon: ReactNode }> = [
  { key: 'cursor', title: 'Cursor (select & move)', icon: <PointerIcon size={ICON_SIZE} /> },
  { key: 'bbox', title: 'Draw bbox', icon: <SquareIcon size={ICON_SIZE} /> },
  { key: 'point', title: 'Add point', icon: <CircleDotIcon size={ICON_SIZE} /> },
  { key: 'classification', title: 'Classification', icon: <TagIcon size={ICON_SIZE} /> },
]

/** Bottom toolbar of the image detail: drawing tools, history, and delete. */
export function ImageDetailMainToolbar({
  mode, tools, onSelectTool, canUndo, canRedo, canReset, onUndo, onRedo, onReset, onDelete, deleting,
}: ImageDetailToolbarProps) {
  const actions: Array<ToolbarShellAction | 'separator'> = [
    ...TOOLS.filter((tool) => tools.includes(tool.key)).map((tool) => ({
      ...tool,
      active: mode === tool.key,
      onClick: () => onSelectTool(tool.key),
    })),
    'separator',
    { key: 'undo', title: 'Undo (Ctrl+Z)', icon: <UndoIcon size={ICON_SIZE} />, disabled: !canUndo, onClick: onUndo },
    { key: 'redo', title: 'Redo (Ctrl+Y)', icon: <RedoIcon size={ICON_SIZE} />, disabled: !canRedo, onClick: onRedo },
    { key: 'reset', title: 'Reset (clear all bboxes & points)', icon: <ResetIcon size={ICON_SIZE} />, disabled: !canReset, onClick: onReset },
    { key: 'delete', title: 'Delete image', icon: <TrashIcon size={ICON_SIZE} />, danger: true, disabled: !onDelete || deleting, onClick: () => onDelete?.() },
  ]

  return <ToolbarShell placement="bottom" ariaLabel="Image detail toolbar" actions={actions} />
}
