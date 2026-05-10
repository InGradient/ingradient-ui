import {
  breakpoints,
  foundationColors,
  foundationColorsLight,
  motionScale,
  radiusScale,
  shadowScale,
  shadowScaleLight,
  typographyScale,
} from '../foundations'
import type { IngradientTheme } from './types'

type Palette = Record<keyof typeof foundationColors, string>
type Shadows = Record<keyof typeof shadowScale, string>

function buildTheme(name: string, palette: Palette, shadows: Shadows): IngradientTheme {
  return {
    name,
    colors: {
      bgCanvas: palette.slate950,
      bgCanvasAlt: palette.slate925,
      bgRadialA: palette.radialA,
      bgRadialB: palette.radialB,
      surfaceHeader: palette.slate880,
      surfacePanel: palette.slate860,
      surfaceRaised: palette.slate925,
      surfaceMuted: palette.slate840,
      surfaceInteractive: palette.white04,
      surfaceActive: palette.blueTint16,
      borderSubtle: palette.white08,
      borderStrong: palette.borderStrong,
      textPrimary: palette.textPrimary,
      textSecondary: palette.textSecondary,
      textMuted: palette.textMuted,
      textSoft: palette.textSoft,
      accent: palette.blue500,
      accentStrong: palette.blue600,
      accentSoft: palette.blue300,
      success: palette.green500,
      warning: palette.amber500,
      danger: palette.red300,
    },
    radius: {
      sm: radiusScale.xs,
      md: radiusScale.md,
      lg: radiusScale['2xl'],
      xl: radiusScale['4xl'],
      pill: radiusScale.pill,
    },
    shadows: {
      panel: shadows.panel,
      floating: shadows.floating,
    },
    breakpoints,
    motion: motionScale,
    typography: {
      fontSans: typographyScale.fontSans,
      fontMono: typographyScale.fontMono,
    },
  }
}

export const ingradientThemeDark: IngradientTheme = buildTheme('portalDark', foundationColors, shadowScale)
export const ingradientThemeLight: IngradientTheme = buildTheme('portalLight', foundationColorsLight, shadowScaleLight)

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
