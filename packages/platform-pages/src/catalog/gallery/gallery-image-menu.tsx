import { ContextMenuWithSubmenus, type ContextMenuWithSubmenusAction } from '@ingradient/ui/components'

export interface GalleryImageMenuDatasetOption {
  id: string
  name: string
}

export interface GalleryImageMenuProps {
  anchorEl: HTMLElement | null
  onClose: () => void
  /** Dataset list 가 있으면 "Copy to" / "Move to" 서브메뉴로 렌더 */
  datasets?: GalleryImageMenuDatasetOption[]
  /** clipboard 에 image 가 담겨있으면 Paste 가 활성화 */
  clipboardHasImages?: boolean
  /** 이 image 가 archived 면 "Unarchive", 아니면 "Archive" */
  archived?: boolean
  onCopyTo?: (datasetId: string) => void
  onMoveTo?: (datasetId: string) => void
  onCut?: () => void
  onPaste?: () => void
  onArchive?: () => void
  onUnarchive?: () => void
  onDelete?: () => void
  onOpenLabeling?: () => void
  customActions?: ContextMenuWithSubmenusAction[]
  defaultOpenSubmenuKey?: string
}

export function GalleryImageMenu({
  anchorEl, onClose, datasets, clipboardHasImages, archived,
  onCopyTo, onMoveTo, onCut, onPaste, onArchive, onUnarchive, onDelete, onOpenLabeling,
  customActions, defaultOpenSubmenuKey,
}: GalleryImageMenuProps) {
  const actions: ContextMenuWithSubmenusAction[] = customActions ?? buildDefaultActions({
    datasets, clipboardHasImages, archived,
    onCopyTo, onMoveTo, onCut, onPaste, onArchive, onUnarchive, onDelete, onOpenLabeling,
  })
  return (
    <ContextMenuWithSubmenus
      anchorEl={anchorEl}
      onClose={onClose}
      actions={actions}
      defaultOpenSubmenuKey={defaultOpenSubmenuKey}
    />
  )
}

function buildDefaultActions({
  datasets, clipboardHasImages, archived,
  onCopyTo, onMoveTo, onCut, onPaste, onArchive, onUnarchive, onDelete, onOpenLabeling,
}: Omit<GalleryImageMenuProps, 'anchorEl' | 'onClose' | 'customActions' | 'defaultOpenSubmenuKey'>): ContextMenuWithSubmenusAction[] {
  const out: ContextMenuWithSubmenusAction[] = []
  if (onOpenLabeling) out.push({ key: 'label', label: 'Open in labeling', onClick: onOpenLabeling })
  if (onOpenLabeling) out.push({ key: 'sep-1', label: '', separator: true })
  if (datasets && onCopyTo) {
    out.push({
      key: 'copy-to',
      label: 'Copy to…',
      subActions: datasets.map((d) => ({ key: `copy-${d.id}`, label: d.name, onClick: () => onCopyTo(d.id) })),
    })
  }
  if (datasets && onMoveTo) {
    out.push({
      key: 'move-to',
      label: 'Move to…',
      subActions: datasets.map((d) => ({ key: `move-${d.id}`, label: d.name, onClick: () => onMoveTo(d.id) })),
    })
  }
  if (onCut) out.push({ key: 'cut', label: 'Cut', onClick: onCut })
  if (onPaste) out.push({ key: 'paste', label: 'Paste', onClick: onPaste, disabled: !clipboardHasImages })
  if (onArchive || onUnarchive) {
    out.push({ key: 'sep-2', label: '', separator: true })
    if (archived && onUnarchive) {
      out.push({ key: 'unarchive', label: 'Unarchive', onClick: onUnarchive })
    } else if (!archived && onArchive) {
      out.push({ key: 'archive', label: 'Archive', onClick: onArchive })
    }
  }
  if (onDelete) {
    out.push({ key: 'sep-3', label: '', separator: true })
    out.push({ key: 'delete', label: 'Delete', tone: 'danger', onClick: onDelete })
  }
  return out
}
