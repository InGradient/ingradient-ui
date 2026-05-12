import { industrialDarkTheme } from './industrial-dark'
import { medicalDarkTheme } from './medical-dark'
import type { TokenCategory } from '../density/types'

export { industrialDarkTheme } from './industrial-dark'
export { medicalDarkTheme } from './medical-dark'

export const themeRegistry: Record<string, TokenCategory> = {
  'industrial-dark': industrialDarkTheme,
  'medical-dark': medicalDarkTheme,
}
