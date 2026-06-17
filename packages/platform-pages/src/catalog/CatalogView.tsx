import { CatalogDesktopView } from './CatalogDesktopView'
import { CatalogMobileView } from './CatalogMobileView'
import { CatalogOverlays } from './CatalogOverlays'
import { Page } from './CatalogView.styles'
import type { CatalogViewProps } from './types'

export function CatalogView({
  isMobile = false,
  page,
  datasets,
  toolbar,
  images,
  rightSidebar,
  mobile,
  statsContent,
  detailContent,
  overlays,
}: CatalogViewProps) {
  return (
    <Page data-ig-component="CatalogView" data-ig-layer="pages">
      {isMobile && mobile ? (
        <CatalogMobileView
          page={page}
          datasets={datasets}
          toolbar={toolbar}
          images={images}
          mobile={mobile}
          statsContent={statsContent}
        />
      ) : (
        <CatalogDesktopView
          page={page}
          datasets={datasets}
          toolbar={toolbar}
          images={images}
          rightSidebar={rightSidebar}
          statsContent={statsContent}
        />
      )}
      <CatalogOverlays {...overlays} detailContent={detailContent} />
    </Page>
  )
}
