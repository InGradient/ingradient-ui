import { DetailPanelSidebar, UserPoolList, type UserPoolItem } from '@ingradient/ui/components'
import { CommentsPanel, type CommentsPanelProps } from './comments-panel'
import { ImageDetailCameraParams, type ImageDetailCameraParamsProps } from './image-detail-camera-params'
import { ImageDetailClassList, type ImageDetailClassListClass } from './image-detail-class-list'
import { ImageDetailInfoPanel, type ImageDetailInfo } from './image-detail-info-panel'
import { MobileBackdrop, SidebarRoot } from './ImageDetailSidebarView.styles'

export interface ImageDetailSidebarInfoPane {
  image: ImageDetailInfo
  /** Position inside an image group, already worded for display. */
  positionLabel?: string
  detailsOpen: boolean
  onToggleDetails: () => void
  cameraParams?: ImageDetailCameraParamsProps
}

export interface ImageDetailSidebarClassesPane {
  items: ImageDetailClassListClass[]
  /** Highlighted class in cursor, bbox, and point modes. */
  selectedClassId?: string | null
  /** Checked classes in classification mode. */
  classifiedClassIds?: string[]
  onSelectClass: (id: string) => void
  onHoverClass?: (id: string, anchor: HTMLElement) => void
  onHoverLeave?: (id: string) => void
}

export interface ImageDetailSidebarLabelersPane {
  users: UserPoolItem[]
  selectedIds: Set<string>
  onToggle: (id: string) => void
  onHover?: (id: string | null) => void
}

export interface ImageDetailSidebarViewProps {
  info: ImageDetailSidebarInfoPane
  classes: ImageDetailSidebarClassesPane
  /** Passed to `CommentsPanel` unchanged. */
  comments: CommentsPanelProps
  /** Users who labeled this image. The section is hidden when absent or empty. */
  labelers?: ImageDetailSidebarLabelersPane
  /** Mobile drawer state. On desktop the panel is always visible and this is ignored. */
  mobile?: { visible: boolean; onClose: () => void }
}

/**
 * Sidebar of the Platform image detail: image info, class list, comments, and labelers.
 * Render it in the detail modal's `sidebar` slot (`CatalogView` `detailContent.sidebar`).
 * The app owns every value and callback; this view holds no state.
 */
export function ImageDetailSidebarView({ info, classes, comments, labelers, mobile }: ImageDetailSidebarViewProps) {
  const mobileVisible = mobile?.visible ?? false
  return (
    <>
      <SidebarRoot $mobileVisible={mobileVisible} data-ig-component="ImageDetailSidebarView" data-ig-layer="pages">
        <DetailPanelSidebar
          headerSlot={
            <ImageDetailInfoPanel
              image={info.image}
              positionLabel={info.positionLabel}
              detailsOpen={info.detailsOpen}
              onToggleDetails={info.onToggleDetails}
              cameraParamsSlot={info.cameraParams ? <ImageDetailCameraParams {...info.cameraParams} /> : undefined}
            />
          }
          bodySectionTitle="Class"
          bodySlot={
            <ImageDetailClassList
              classes={classes.items}
              selectedClassId={classes.selectedClassId}
              classifiedClassIds={classes.classifiedClassIds}
              onSelectClass={classes.onSelectClass}
              onHoverClass={classes.onHoverClass ? (cls, anchor) => classes.onHoverClass?.(cls.id, anchor) : undefined}
              onHoverLeave={classes.onHoverLeave ? (cls) => classes.onHoverLeave?.(cls.id) : undefined}
            />
          }
          footerSlots={[
            <CommentsPanel key="comments" {...comments} />,
            ...(labelers && labelers.users.length > 0
              ? [<UserPoolList key="labelers" users={labelers.users} selectedIds={labelers.selectedIds} onToggle={labelers.onToggle} onHover={labelers.onHover} />]
              : []),
          ]}
        />
      </SidebarRoot>
      {mobileVisible ? <MobileBackdrop onClick={mobile?.onClose} data-ig-slot="mobile-backdrop" /> : null}
    </>
  )
}
