import { PagePrimaryHeader } from '@ingradient/ui/patterns'
import { ClassManageBody } from './ClassManageBody'
import { ClassManageOverlays } from './ClassManageOverlays'
import { Page } from './ClassManageView.styles'
import type { ClassManageViewProps } from './types'
import { SurfaceDepthProvider } from '@ingradient/ui/primitives'

const PAGE_SUBTITLE =
  'Review project classes, linked datasets, reference images, and mapping settings.'

function ClassManageViewContent({
  projectName,
  permissionDenied,
  error,
  noProject,
  list,
  images,
  info,
  overlays,
}: ClassManageViewProps) {
  return (
    <Page>
      <PagePrimaryHeader
        title="Class"
        subtitle={PAGE_SUBTITLE}
        rightSlot={projectName ?? undefined}
      />
      <ClassManageBody
        permissionDenied={permissionDenied}
        error={error}
        noProject={noProject}
        list={list}
        images={images}
        info={info}
      />
      <ClassManageOverlays {...overlays} />
    </Page>
  )
}

/**
 * Platform pages turn on surface depth so a rounded surface inside another rounded surface is
 * always less rounded than its parent (DESIGN.draft.md §5).
 */
export function ClassManageView(props: ClassManageViewProps) {
  return (
    <SurfaceDepthProvider>
      <ClassManageViewContent {...props} />
    </SurfaceDepthProvider>
  )
}
