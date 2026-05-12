import { comfortableDensity } from './comfortable'
import { compactDensity } from './compact'
import { ultraDenseDensity } from './ultra-dense'
import type { TokenCategory } from './types'

export type { TokenCategory } from './types'
export { comfortableDensity } from './comfortable'
export { compactDensity } from './compact'
export { ultraDenseDensity } from './ultra-dense'

export const densityRegistry: Record<string, TokenCategory> = {
  comfortable: comfortableDensity,
  compact: compactDensity,
  'ultra-dense': ultraDenseDensity,
}
