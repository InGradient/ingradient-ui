import { useEffect, useRef, useState } from 'react'
import { LoaderIcon, AlertTriangleIcon, CloudOffIcon, TrashIcon, Badge, IconButton } from '@ingradient/ui/components'
import { AnnotationOverlay, VirtualizedImageGrid, iconSizeNumbers } from '@ingradient/ui'
import {
  GroupBadgeWrap, ImagesContainer, SyncStateIcon,
} from './ImagesView.styles'
import { getGroupKey, type ImageItem } from './image-helpers'
import type { EdgeImagesGridViewProps } from './types'

const CELL_MIN_PX = 140
const GAP_PX = 8
const CELL_HEIGHT_PX = 192
const PADDING_PX = 12

export function EdgeImagesGridView(props: EdgeImagesGridViewProps): JSX.Element {
  const {
    items, selectedIds, hasMore, loadingMore, onLoadMore,
    groupMap, sequenceGroupMap, groupSettings, selectedDatasetClasses,
    labels, getDisplayedGroupMembers, onCellClick, onDeleteGroupRequest,
  } = props

  const containerRef = useRef<HTMLDivElement>(null)
  const [columns, setColumns] = useState(4)

  useEffect(() => {
    const update = () => {
      const width = containerRef.current?.clientWidth ?? 0
      const usable = Math.max(CELL_MIN_PX, width - PADDING_PX * 2)
      const next = Math.max(1, Math.floor((usable + GAP_PX) / (CELL_MIN_PX + GAP_PX)))
      setColumns(next)
    }
    update()
    const observer = new ResizeObserver(update)
    if (containerRef.current) observer.observe(containerRef.current)
    return () => observer.disconnect()
  }, [])

  const getBadgeCount = (img: ImageItem): number => {
    const key = getGroupKey(img.label, groupSettings?.group_key_regex)
    const groupSize = key ? (groupMap.get(key)?.length ?? 1) : 1
    const sequenceGroupSize = img.sequenceId
      ? Math.max(sequenceGroupMap.get(img.sequenceId)?.length ?? 1, img.groupCount ?? 1)
      : 1
    return Math.max(groupSize, sequenceGroupSize)
  }

  const getSyncIconState = (img: ImageItem) => {
    const isProcessing = img.syncState === 'uploading' || img.conversionStatus === 'pending'
    return { isProcessing, state: isProcessing ? 'uploading' : img.syncState }
  }

  const getSyncIconTitle = (img: ImageItem): string | undefined => {
    if (img.syncState === 'upload_failed') return labels.uploadFailed(img.uploadError)
    if (img.conversionStatus === 'pending') return labels.conversionPending
    if (img.syncState === 'uploading') return labels.uploading
    return undefined
  }

  return (
    <ImagesContainer ref={containerRef}>
      <VirtualizedImageGrid<ImageItem>
        items={items}
        getThumbnailUrl={(img) => img.src}
        columns={columns}
        layout={{ gap: 2 }}
        estimatedItemHeight={CELL_HEIGHT_PX + GAP_PX}
        selectedIds={selectedIds}
        hasMore={hasMore}
        isLoadingMore={loadingMore}
        onLoadMore={onLoadMore}
        onItemClick={(img, _index, event) => {
          const members = getDisplayedGroupMembers(img)
          void onCellClick(event, img, members)
        }}
        renderCellOverlay={(img) => (
          <AnnotationOverlay
            bboxes={img.bboxes}
            getColor={(id) => selectedDatasetClasses.find((c) => c.class_id === id)?.color}
            imageWidth={img.width}
            imageHeight={img.height}
          />
        )}
        renderCellTopRight={(img) => {
          const badgeCount = getBadgeCount(img)
          const { isProcessing, state } = getSyncIconState(img)
          const showSync = isProcessing || (img.syncState && img.syncState !== 'synced')
          const showBadge = badgeCount > 1
          if (!showSync && !showBadge) return null
          return (
            <>
              {showSync && (
                <SyncStateIcon $state={state ?? 'synced'} title={getSyncIconTitle(img)}>
                  {!isProcessing && img.syncState === 'local_only' && <CloudOffIcon size={iconSizeNumbers.xs} />}
                  {isProcessing && <LoaderIcon size={iconSizeNumbers.xs} />}
                  {!isProcessing && img.syncState === 'upload_failed' && <AlertTriangleIcon size={iconSizeNumbers.xs} />}
                </SyncStateIcon>
              )}
              {showBadge && (
                <GroupBadgeWrap>
                  <IconButton
                    variant="secondary"
                    size="sm"
                    type="button"
                    title={labels.deleteGroup}
                    aria-label={labels.deleteGroup}
                    onClick={(event) => {
                      event.stopPropagation()
                      const members = getDisplayedGroupMembers(img)
                      void onDeleteGroupRequest(img, members, badgeCount)
                    }}
                  >
                    <TrashIcon size={iconSizeNumbers.sm} />
                  </IconButton>
                  <Badge>{badgeCount}</Badge>
                </GroupBadgeWrap>
              )}
            </>
          )
        }}
        renderCellFooter={(img) => <span title={img.label}>{img.label}</span>}
      />
    </ImagesContainer>
  )
}
