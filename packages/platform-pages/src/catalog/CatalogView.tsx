import { CatalogDesktopView } from './CatalogDesktopView'
import { CatalogMobileView } from './CatalogMobileView'
import { CatalogOverlays } from './CatalogOverlays'
import { Page } from './CatalogView.styles'
import type { CatalogViewProps } from './types'

export function CatalogView(props: CatalogViewProps) {
  return (
    <Page data-ig-component="CatalogView" data-ig-layer="pages">
      {props.isMobile ? (
        <CatalogMobileView
          page={props.page}
          datasets={props.datasets}
          toolbar={props.toolbar}
          images={props.images}
          mobile={props.mobile}
        />
      ) : (
        <CatalogDesktopView
          page={props.page}
          datasets={props.datasets}
          toolbar={props.toolbar}
          images={props.images}
          rightSidebar={props.rightSidebar}
          statsContent={props.statsContent}
        />
      )}
      <CatalogOverlays {...props.overlays} detailContent={props.detailContent} />
    </Page>
  )
}
