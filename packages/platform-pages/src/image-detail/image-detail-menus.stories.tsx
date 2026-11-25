import { useState } from 'react'
import type { Meta, StoryObj } from '@storybook/react-vite'
import { expect, fn, userEvent, within } from 'storybook/test'
import { ClassHoverCard, useClassHoverCard } from './class-hover-card'
import { ImageDetailConfirmDialogs, type ImageDetailDeleteScope } from './image-detail-confirm-dialogs'
import { ImageDetailContextMenu } from './image-detail-context-menu'

const FRAME_STYLE = { position: 'relative' as const, height: '100vh', background: 'var(--ig-color-bg-canvas)' }
const HINT_STYLE = { padding: 'var(--ig-spacing-16)', color: 'var(--ig-color-text-muted)' }
const MENU_POSITION = { x: 120, y: 80 }
const CLASSES = [
  { id: 'c1', name: 'Scratch', color: 'var(--ig-color-danger)', description: 'A thin line cut into the surface.\nLonger than it is wide.' },
  { id: 'c2', name: 'Dent', color: 'var(--ig-color-accent)', description: 'A shallow pressed-in area.' },
  { id: 'c3', name: 'Stain', color: 'var(--ig-color-success)' },
]

type DemoProps = {
  menuOpen?: boolean
  annotationSelected?: boolean
  archived?: boolean
  archiveCommentOpen?: boolean
  deleteImageOpen?: boolean
  grouped?: boolean
  deleting?: boolean
  error?: string
  onAssignClass: (classId: string) => void
  onDelete: () => void
  onToggleArchive: () => void
  onConfirmDelete: (scope: ImageDetailDeleteScope) => void
  onCancel: () => void
}

/** Holds the state the app would own: where the menu is, and which class is hovered. */
function MenusDemo({
  menuOpen, annotationSelected, archived, archiveCommentOpen, deleteImageOpen, grouped, deleting, error,
  onAssignClass, onDelete, onToggleArchive, onConfirmDelete, onCancel,
}: DemoProps) {
  const [position, setPosition] = useState(menuOpen ? MENU_POSITION : null)
  const hover = useClassHoverCard(CLASSES)
  return (
    <div style={FRAME_STYLE} onContextMenu={(event) => { event.preventDefault(); setPosition({ x: event.clientX, y: event.clientY }) }}>
      <div style={HINT_STYLE}>Right-click anywhere to open the menu.</div>
      <ImageDetailContextMenu
        position={position}
        onClose={() => { hover.hide(); setPosition(null) }}
        onDelete={annotationSelected ? () => { onDelete(); setPosition(null) } : undefined}
        onToggleArchive={() => { onToggleArchive(); setPosition(null) }}
        archived={archived}
        classes={CLASSES}
        onAssignClass={onAssignClass}
        onHoverClass={hover.show}
        onHoverLeave={hover.hide}
      />
      <ClassHoverCard item={hover.item} top={hover.position?.top ?? 0} left={hover.position?.left ?? 0} />
      <ImageDetailConfirmDialogs
        archiveComment={{ open: !!archiveCommentOpen, saving: deleting, onCancel, onConfirm: onCancel }}
        deleteImage={{ open: !!deleteImageOpen, grouped, deleting, error, onCancel, onConfirm: onConfirmDelete }}
      />
    </div>
  )
}

const meta: Meta<typeof MenusDemo> = {
  id: 'platform-pages-image-detail-menus',
  title: 'Components/Platform/Image Detail/Menus and Confirms',
  component: MenusDemo,
  parameters: { layout: 'fullscreen' },
  args: {
    onAssignClass: fn().mockName('onAssignClass'),
    onDelete: fn().mockName('onDelete'),
    onToggleArchive: fn().mockName('onToggleArchive'),
    onConfirmDelete: fn().mockName('onConfirmDelete'),
    onCancel: fn().mockName('onCancel'),
  },
}
export default meta

type Story = StoryObj<typeof meta>

export const ContextMenu: Story = { args: { menuOpen: true, annotationSelected: true } }
export const ContextMenuArchivedImage: Story = { args: { menuOpen: true, archived: true } }
/** Hovering Class opens the class list; hovering a class with a description shows its card; choosing one closes the menu. */
export const AssignClassWorkflow: Story = {
  args: { menuOpen: true },
  play: async ({ args, canvasElement }) => {
    const body = within(canvasElement.ownerDocument.body)
    await userEvent.hover(body.getByRole('menuitem', { name: 'Class' }))
    const dent = await body.findByRole('menuitem', { name: 'Dent' })
    await userEvent.hover(dent)
    await expect(await body.findByRole('tooltip')).toHaveTextContent('A shallow pressed-in area.')
    await userEvent.click(dent)
    await expect(args.onAssignClass).toHaveBeenCalledWith('c2')
    await expect(body.queryByRole('menu')).not.toBeInTheDocument()
  },
}
export const ArchiveCommentConfirm: Story = { args: { archiveCommentOpen: true } }
export const DeleteImageConfirm: Story = {
  args: { deleteImageOpen: true },
  play: async ({ args, canvasElement }) => {
    const dialog = within(within(canvasElement).getByRole('alertdialog', { name: 'Delete image?' }))
    await userEvent.click(dialog.getByRole('button', { name: 'Delete' }))
    await expect(args.onConfirmDelete).toHaveBeenCalledWith('image')
  },
}
export const DeleteFromGroupConfirm: Story = {
  args: { deleteImageOpen: true, grouped: true },
  play: async ({ args, canvasElement }) => {
    const dialog = within(within(canvasElement).getByRole('alertdialog', { name: 'Delete from group?' }))
    await userEvent.click(dialog.getByRole('button', { name: 'Entire group' }))
    await expect(args.onConfirmDelete).toHaveBeenCalledWith('group')
  },
}
export const DeleteImageFailed: Story = { args: { deleteImageOpen: true, error: 'Could not delete the image. Try again.' } }
export const DeleteImageInProgress: Story = { args: { deleteImageOpen: true, grouped: true, deleting: true } }
