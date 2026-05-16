import { PagePrimaryHeader } from '@ingradient/ui/patterns'
import { ClassManageBody } from './ClassManageBody'
import { ClassManageOverlays } from './ClassManageOverlays'
import { Page } from './ClassManageView.styles'
import type { ClassManageViewProps } from './types'

const PAGE_SUBTITLE =
  'Review project classes, linked datasets, reference images, and mapping settings.'

export function ClassManageView({
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
