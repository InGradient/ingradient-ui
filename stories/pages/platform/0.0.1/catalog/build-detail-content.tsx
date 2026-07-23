import { useState, type ReactNode } from 'react'
import {
  CircleDotIcon,
  DetailPanelSidebar,
  PointerIcon,
  RedoIcon,
  ResetIcon,
  SquareIcon,
  TagIcon,
  ToolbarShell,
  TrashIcon,
  type ToolbarShellAction,
  UndoIcon,
  UserPoolList,
} from '@ingradient/ui/components'
import { iconSizeNumbers } from '@ingradient/ui/tokens'
import { ImageInspectorCanvas } from '@ingradient/ui/patterns'
import {
  CommentsPanel,
  ImageDetailClassList,
  ImageDetailInfoPanel,
  type ImageDetailInfo,
} from '@ingradient/platform-pages'
import type { CatalogScene } from '../../../../fixtures/platform/0.0.1/catalog-scenarios'
import {
  sampleAnnotations,
  sampleClassTags,
  sampleComments,
  sampleMultiClassTags,
} from './mock-detail'

type DetailMode = 'cursor' | 'bbox' | 'point' | 'classification'

const MAIN_WRAP_STYLE: React.CSSProperties = {
  display: 'flex',
  flexDirection: 'column',
  height: '100%',
  minHeight: 0,
}
const CANVAS_WRAP_STYLE: React.CSSProperties = { flex: 1, minHeight: 0, position: 'relative' }
const TOOLBAR_WRAP_STYLE: React.CSSProperties = {
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  flexShrink: 0,
  minHeight: 64,
  borderTop: 'var(--ig-border-1px) solid var(--ig-color-border-subtle)',
  background: 'var(--ig-color-surface-raised)',
}

function DetailMainMount({
  image,
  variant,
}: {
  image: CatalogScene['images'][number]
  variant: CatalogScene['detailVariant']
}) {
  const [mode, setMode] = useState<DetailMode>('cursor')
  const noop = () => undefined
  const actions: Array<ToolbarShellAction | 'separator'> = [
    { key: 'cursor', title: 'Cursor (select)', icon: <PointerIcon size={iconSizeNumbers.lg} />, active: mode === 'cursor', onClick: () => setMode('cursor') },
    { key: 'bbox', title: 'Draw bbox', icon: <SquareIcon size={iconSizeNumbers.lg} />, active: mode === 'bbox', onClick: () => setMode('bbox') },
    { key: 'point', title: 'Add point', icon: <CircleDotIcon size={iconSizeNumbers.lg} />, active: mode === 'point', onClick: () => setMode('point') },
    { key: 'classification', title: 'Classification', icon: <TagIcon size={iconSizeNumbers.lg} />, active: mode === 'classification', onClick: () => setMode('classification') },
    'separator',
    { key: 'undo', title: 'Undo', icon: <UndoIcon size={iconSizeNumbers.lg} />, disabled: true, onClick: noop },
    { key: 'redo', title: 'Redo', icon: <RedoIcon size={iconSizeNumbers.lg} />, disabled: true, onClick: noop },
    { key: 'reset', title: 'Reset', icon: <ResetIcon size={iconSizeNumbers.lg} />, disabled: true, onClick: noop },
    { key: 'delete', title: 'Delete image', icon: <TrashIcon size={iconSizeNumbers.lg} />, danger: true, onClick: noop },
  ]
  return (
    <div style={MAIN_WRAP_STYLE}>
      <div style={CANVAS_WRAP_STYLE}>
        <ImageInspectorCanvas
          imageUrl={image.thumb_url}
          imageAlt={image.name}
          boxes={variant === 'minimal' ? [] : sampleAnnotations}
        />
      </div>
      <div style={TOOLBAR_WRAP_STYLE}>
        <ToolbarShell placement="bottom" actions={actions} ariaLabel="Image detail toolbar" />
      </div>
    </div>
  )
}

const MOCK_LABELERS = [
  { email: 'jhlee@ingradient.ai', name: 'June Lee' },
  { email: 'spark@ingradient.ai', name: 'Soyeon Park' },
  { email: 'dkim@ingradient.ai', name: 'Daniel Kim' },
]

function DetailSidebarMount({
  image,
  datasetNameById,
  variant,
}: {
  image: CatalogScene['images'][number]
  datasetNameById: Record<string, string>
  variant: CatalogScene['detailVariant']
}) {
  const [detailsOpen, setDetailsOpen] = useState(false)
  const [selectedClassId, setSelectedClassId] = useState<string | null>(null)
  const [selectedUsers, setSelectedUsers] = useState<Set<string>>(
    () => new Set(MOCK_LABELERS.map((u) => u.email)),
  )
  const info: ImageDetailInfo = {
    name: image.name,
    created_at: image.created_at,
    uploader: image.uploader,
    dimensions:
      image.width && image.height ? { width: image.width, height: image.height } : undefined,
    size_bytes: image.size_bytes,
    sequence_id: image.sequence_id,
    sequence_step: image.sequence_step,
    pattern_label: image.pattern_label,
    upload_source: datasetNameById[image.dataset_id ?? ''] ?? image.dataset_id ?? undefined,
  }
  const classes = (variant === 'multi-class' ? sampleMultiClassTags : sampleClassTags).map((c) => ({
    id: c.id,
    name: c.name,
    color: c.color,
  }))
  return (
    <DetailPanelSidebar
      headerSlot={
        <ImageDetailInfoPanel
          image={info}
          detailsOpen={detailsOpen}
          onToggleDetails={() => setDetailsOpen((v) => !v)}
        />
      }
      bodySlot={
        <ImageDetailClassList
          classes={classes}
          selectedClassId={selectedClassId}
          onSelectClass={(id) => setSelectedClassId((prev) => (prev === id ? null : id))}
        />
      }
      bodySectionTitle="Class"
      footerSlots={[
        <CommentsPanel
          key="comments"
          comments={variant === 'with-comments' ? sampleComments : []}
          onReply={() => undefined}
          listMaxHeight="var(--ig-popup-xs-narrow)"
        />,
        <UserPoolList
          key="labelers"
          users={MOCK_LABELERS.map((u) => ({ id: u.email, label: u.name ?? u.email, tooltip: u.email }))}
          selectedIds={selectedUsers}
          onToggle={(id) =>
            setSelectedUsers((prev) => {
              const next = new Set(prev)
              if (next.has(id)) next.delete(id)
              else next.add(id)
              return next
            })
          }
        />,
      ]}
    />
  )
}

export function buildDetailContent(
  image: CatalogScene['images'][number] | undefined,
  datasetNameById: Record<string, string>,
  variant: CatalogScene['detailVariant'],
): { main: ReactNode; sidebar: ReactNode } | undefined {
  if (!image) return undefined
  return {
    main: <DetailMainMount image={image} variant={variant} />,
    sidebar: (
      <DetailSidebarMount image={image} datasetNameById={datasetNameById} variant={variant} />
    ),
  }
}
