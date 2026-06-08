import { ConfirmDialog } from '@ingradient/ui/components'
import { AddClassDialog, ClassLightbox, DatasetMenu, ImageContextMenu } from '@ingradient/ui/patterns'
import type { ClassManageOverlaysProps } from './types'

const CONTEXT_MENU_BASE = [{ key: 'add-ref', label: 'Add to Reference Image' }] as const

export function ClassManageOverlays({
  addClass,
  classMenu,
  contextMenu,
  lightbox,
  deleteConfirm,
}: ClassManageOverlaysProps) {
  return (
    <>
      <AddClassDialog
        open={addClass.open}
        name={addClass.name}
        onChangeName={addClass.onNameChange}
        onClose={addClass.onClose}
        onConfirm={addClass.onConfirm}
      />
      {classMenu ? (
        <DatasetMenu
          anchorEl={classMenu.anchorEl}
          onClose={classMenu.onClose}
          actions={[
            { key: 'duplicate', label: 'Duplicate', onClick: classMenu.onDuplicate },
            { key: 'delete', label: 'Delete', tone: 'danger', onClick: classMenu.onDelete },
          ]}
        />
      ) : null}
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
