import { ingradientThemeDark } from './dark'
import { ingradientThemeLight } from './light'

export { ingradientThemeDark } from './dark'
export { ingradientThemeLight } from './light'

// Backward-compat default — existing callers that import `ingradientTheme` keep dark.
export const ingradientTheme = ingradientThemeDark

export const themes = {
  dark: ingradientThemeDark,
  light: ingradientThemeLight,
  // legacy aliases
  portalDark: ingradientThemeDark,
  portalLight: ingradientThemeLight,
}

export type ThemeMode = 'dark' | 'light'
