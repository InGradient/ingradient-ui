import { describe, expectTypeOf, it } from 'vitest'
import type {
  CatalogDesktopViewProps,
  CatalogMobilePaneProps,
  CatalogMobileViewMode,
  CatalogMobileViewProps,
  CatalogRightSidebarPaneProps,
  CatalogViewProps,
} from './types'

describe('CatalogView responsive contract', () => {
  it('keeps mobile layout explicit and excludes desktop-only state', () => {
    expectTypeOf<CatalogMobileViewProps>().toMatchTypeOf<CatalogViewProps>()
    expectTypeOf<CatalogMobileViewProps['isMobile']>().toEqualTypeOf<true>()
    expectTypeOf<CatalogMobileViewProps['mobile']>().toEqualTypeOf<CatalogMobilePaneProps>()
    expectTypeOf<CatalogMobileViewProps['toolbar']['viewMode']>()
      .toEqualTypeOf<CatalogMobileViewMode>()
    expectTypeOf<CatalogMobileViewProps['rightSidebar']>().toEqualTypeOf<undefined>()
    expectTypeOf<CatalogMobileViewProps['statsContent']>().toEqualTypeOf<undefined>()
  })

  it('keeps desktop-only state out of the mobile contract', () => {
    expectTypeOf<CatalogDesktopViewProps>().toMatchTypeOf<CatalogViewProps>()
    expectTypeOf<CatalogDesktopViewProps['isMobile']>().toEqualTypeOf<false | undefined>()
    expectTypeOf<CatalogDesktopViewProps['mobile']>().toEqualTypeOf<undefined>()
    expectTypeOf<CatalogDesktopViewProps['rightSidebar']>()
      .toEqualTypeOf<CatalogRightSidebarPaneProps | null>()
  })
})
