import { defaultBrand } from './default'
import { finemtechBrand } from './finemtech'
import { samsungBrand } from './samsung'
import type { TokenCategory } from '../density/types'

export { defaultBrand } from './default'
export { finemtechBrand } from './finemtech'
export { samsungBrand } from './samsung'

export const brandRegistry: Record<string, TokenCategory> = {
  default: defaultBrand,
  finemtech: finemtechBrand,
  samsung: samsungBrand,
}
