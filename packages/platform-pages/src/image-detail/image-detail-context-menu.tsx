import { useEffect, useRef, useState } from 'react'
import {
  ColorSwatch, ContextMenuBackdrop, ContextMenuButton, ContextMenuItem, ContextMenuList, ContextMenuSub, ContextMenuSubItem,
} from '@ingradient/ui/components'
import { popupSizeNumbers } from '@ingradient/ui/tokens'

/** Keeps the class list open while the pointer crosses the gap between the two menus. */
const SUBMENU_CLOSE_DELAY_MS = 200
const SUBMENU_OFFSET_X = popupSizeNumbers['2xsNarrow']
const CLASS_ROW_STYLE = {
  cursor: 'default',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  gap: 'var(--ig-space-4)',
}

export interface ImageDetailContextMenuClass {
  id: string
  name: string
  color: string
}

export interface ImageDetailContextMenuProps {
  /** Viewport point the menu opens at. Null keeps it closed. */
  position: { x: number; y: number } | null
  onClose: () => void
  /** Shows Delete, for when an annotation is selected. The app closes the menu. */
  onDelete?: () => void
  /** Shows Archive image or Unarchive image, depending on `archived`. The app closes the menu. */
  onToggleArchive?: () => void
  archived?: boolean
  classes: ImageDetailContextMenuClass[]
  /** Called with the chosen class id; the menu then asks to close. */
  onAssignClass: (classId: string) => void
  onHoverClass?: (classId: string, anchor: HTMLElement) => void
  onHoverLeave?: (classId: string) => void
}

/** Right-click menu of the image detail canvas: Delete, Archive, and a class list that opens on hover. */
export function ImageDetailContextMenu(props: ImageDetailContextMenuProps) {
  return props.position ? <ContextMenuBody {...props} position={props.position} /> : null
}

function ContextMenuBody({
  position, onClose, onDelete, onToggleArchive, archived, classes, onAssignClass, onHoverClass, onHoverLeave,
}: ImageDetailContextMenuProps & { position: { x: number; y: number } }) {
  const [classListOpen, setClassListOpen] = useState(false)
  const closeTimer = useRef<ReturnType<typeof setTimeout> | null>(null)

  const cancelClose = () => {
    if (closeTimer.current) clearTimeout(closeTimer.current)
    closeTimer.current = null
  }
  const scheduleClose = () => {
    cancelClose()
    closeTimer.current = setTimeout(() => setClassListOpen(false), SUBMENU_CLOSE_DELAY_MS)
  }
  useEffect(() => cancelClose, [])

  return (
    <>
      <ContextMenuBackdrop onClick={onClose} aria-hidden />
      <ContextMenuList $x={position.x} $y={position.y} role="menu" aria-label="Image actions" onClick={(event) => event.stopPropagation()}>
        {onDelete ? <ContextMenuButton type="button" role="menuitem" $danger onClick={onDelete}>Delete</ContextMenuButton> : null}
        {onToggleArchive ? (
          <ContextMenuButton type="button" role="menuitem" onClick={onToggleArchive}>
            {archived ? 'Unarchive image' : 'Archive image'}
          </ContextMenuButton>
        ) : null}
        <ContextMenuItem onMouseEnter={() => { cancelClose(); setClassListOpen(true) }} onMouseLeave={scheduleClose}>
          <ContextMenuButton
            type="button"
            role="menuitem"
            aria-haspopup="menu"
            aria-expanded={classListOpen}
            style={CLASS_ROW_STYLE}
            onClick={() => setClassListOpen(true)}
          >
            <span>Class</span>
            <span aria-hidden>→</span>
          </ContextMenuButton>
        </ContextMenuItem>
      </ContextMenuList>
      {classListOpen ? (
        <ContextMenuSub
          $left={position.x + SUBMENU_OFFSET_X}
          $top={position.y}
          role="menu"
          aria-label="Class"
          onMouseEnter={cancelClose}
          onMouseLeave={scheduleClose}
          onClick={(event) => event.stopPropagation()}
        >
          {classes.map((item) => (
            <ContextMenuSubItem
              key={item.id}
              type="button"
              role="menuitem"
              $color={item.color}
              onMouseEnter={(event) => onHoverClass?.(item.id, event.currentTarget)}
              onMouseLeave={() => onHoverLeave?.(item.id)}
              onFocus={(event) => onHoverClass?.(item.id, event.currentTarget)}
              onBlur={() => onHoverLeave?.(item.id)}
              onClick={() => { onAssignClass(item.id); onClose() }}
            >
              <ColorSwatch $color={item.color} $size="xs" $shape="square" />
              {item.name}
            </ContextMenuSubItem>
          ))}
        </ContextMenuSub>
      ) : null}
    </>
  )
}
