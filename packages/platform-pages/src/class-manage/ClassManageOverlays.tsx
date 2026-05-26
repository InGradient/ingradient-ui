import { ConfirmDialog, TextInputDialog } from '@ingradient/ui/components'
import { ClassLightbox, ImageContextMenu } from '@ingradient/ui/patterns'
import type { ClassManageOverlaysProps } from './types'

const CONTEXT_MENU_BASE = [{ key: 'add-ref', label: 'Add to Reference Image' }] as const

export function ClassManageOverlays({
  addClass,
  contextMenu,
  lightbox,
  deleteConfirm,
}: ClassManageOverlaysProps) {
  return (
    <>
      <TextInputDialog
        open={addClass.open}
        value={addClass.name}
        onChange={addClass.onNameChange}
        onClose={addClass.onClose}
        onConfirm={addClass.onConfirm}
        title="Class name"
        placeholder="Enter class name"
      />
      <ImageContextMenu
        position={contextMenu.position}
        items={CONTEXT_MENU_BASE.map((item) => ({
          key: item.key,
          label: item.label,
          onClick: () => contextMenu.onAction?.(item.key),
        }))}
        onClose={contextMenu.onClose}
      />
      <ClassLightbox
        open={!!lightbox.image}
        item={lightbox.image}
        imageUrl={lightbox.image?.original_url ?? lightbox.image?.thumb_url ?? null}
        siblings={lightbox.siblings}
        selectedClassId={lightbox.selectedClassId}
        classIdToColor={lightbox.classIdToColor}
        onClose={lightbox.onClose}
      />
      {deleteConfirm.open && deleteConfirm.selectedClass ? (
        <ConfirmDialog
          title="Delete this class?"
          description={
            deleteConfirm.selectedClass.image_count > 0
              ? `This class has labels on ${deleteConfirm.selectedClass.image_count.toLocaleString()} image(s).`
              : undefined
          }
          confirmLabel="Delete"
          danger
          onConfirm={deleteConfirm.onConfirm}
          onCancel={deleteConfirm.onCancel}
        />
      ) : null}
    </>
  )
}
