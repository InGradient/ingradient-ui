import { IngradientThemeProvider } from '@ingradient/ui'
import { BrandMark } from '@ingradient/ui/brand'
import { useSelection } from '@ingradient/ui/hooks'
import { renderTokensCss } from '@ingradient/ui/tokens'
import { Box } from '@ingradient/ui/primitives'
import { ImageCard } from '@ingradient/ui/components'
import { CommentThread } from '@ingradient/ui/patterns'
import { logger } from '@ingradient/ui/utils'
import { CatalogView } from '@ingradient/platform-pages'
import { LicenseView } from '@ingradient/edge-pages'
import '@ingradient/ui/tokens.css'

export function verifyPublicImports(): void {
  const imports = { IngradientThemeProvider, BrandMark, useSelection, renderTokensCss, Box, ImageCard, CommentThread, logger, CatalogView, LicenseView }
  for (const [name, value] of Object.entries(imports)) {
    if (value === undefined) throw new Error(`Public package export did not resolve: ${name}`)
  }
}
