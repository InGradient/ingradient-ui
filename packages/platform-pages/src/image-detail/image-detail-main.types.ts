import type { ReactNode, Ref } from 'react'
import type { LabelingCanvasProps } from '@ingradient/ui/patterns'

export type ImageDetailTool = 'cursor' | 'bbox' | 'point' | 'classification'

/** Everything `LabelingCanvas` draws. The view fills the overlay slots itself. */
export type ImageDetailCanvasProps = Omit<LabelingCanvasProps, 'overlays' | 'underlays' | 'floatingOverlays' | 'className'>

export interface ImageDetailToolbarProps {
  /** Tool currently in use. */
  mode: ImageDetailTool
  /** Tools the app allows for this task, shown in a fixed order: cursor, bbox, point, classification. */
  tools: ImageDetailTool[]
  onSelectTool: (tool: ImageDetailTool) => void
  canUndo: boolean
  canRedo: boolean
  canReset: boolean
  onUndo: () => void
  onRedo: () => void
  onReset: () => void
  /** Opens the app's delete confirmation. Absent keeps the button disabled. */
  onDelete?: () => void
  deleting?: boolean
}

export interface ImageDetailGroupTab {
  id: string
  name?: string | null
  pattern_label?: string | null
}

export interface ImageDetailGroupProps {
  items: ImageDetailGroupTab[]
  currentId: string
  onSelect: (id: string) => void
  /** Ref to the floating tab bar, for apps that measure it or scroll it into view. */
  tabBarRef?: Ref<HTMLDivElement>
}

export interface ImageDetailMainViewProps {
  canvas: ImageDetailCanvasProps
  onZoomIn: () => void
  onZoomOut: () => void
  onClose: () => void
  /** Zoom level at which zoom-out turns off. Defaults to 1. */
  minZoom?: number
  /** Cursor coordinate text under the canvas. */
  coordText?: ReactNode
  /** Dims the image and shows a spinner while the first image loads. */
  loading?: boolean
  /** Shows a small notice while the full-resolution image replaces the preview. */
  hiResLoading?: boolean
  /** Hatches the image to mark it archived. */
  archived?: boolean
  toolbar: ImageDetailToolbarProps
  /**
   * Shows the "Info & classes" button beside the zoom buttons at the mobile breakpoint,
   * where the side panel is a drawer. `active` is whether that drawer is open.
   */
  mobileInfo?: { active: boolean; onToggle: () => void }
  /** Tabs for the images of one group. Takes the place of `viewSwitcherSlot`. */
  group?: ImageDetailGroupProps
  /** Floating content shown over the canvas when there is no group, e.g. `ImageViewList`. */
  viewSwitcherSlot?: ReactNode
}
