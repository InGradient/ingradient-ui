import {
  breakpoints,
  foundationColors,
  motionScale,
  radiusScale,
  shadowScale,
  typographyScale,
} from '../foundations'
import type { IngradientTheme } from './types'

export const ingradientTheme: IngradientTheme = {
  name: 'portalDark',
  colors: {
    bgCanvas: foundationColors.slate950,
    bgCanvasAlt: foundationColors.slate925,
    bgRadialA: foundationColors.radialA,
    bgRadialB: foundationColors.radialB,
    surfaceHeader: foundationColors.slate880,
    surfacePanel: foundationColors.slate860,
    surfaceRaised: foundationColors.slate925,
    surfaceMuted: foundationColors.slate840,
    surfaceInteractive: foundationColors.white04,
    surfaceActive: foundationColors.blueTint16,
    borderSubtle: foundationColors.white08,
    borderStrong: foundationColors.borderStrong,
    textPrimary: foundationColors.textPrimary,
    textSecondary: foundationColors.textSecondary,
    textMuted: foundationColors.textMuted,
    textSoft: foundationColors.textSoft,
    accent: foundationColors.blue500,
    accentStrong: foundationColors.blue600,
    accentSoft: foundationColors.blue300,
    success: foundationColors.green500,
    warning: foundationColors.amber500,
    danger: foundationColors.red300,
  },
  radius: {
    sm: radiusScale.xs,
    md: radiusScale.md,
    lg: radiusScale['2xl'],
    xl: radiusScale['4xl'],
    pill: radiusScale.pill,
  },
  shadows: {
    panel: shadowScale.panel,
    floating: shadowScale.floating,
  },
  breakpoints,
  motion: motionScale,
  typography: {
    fontSans: typographyScale.fontSans,
    fontMono: typographyScale.fontMono,
  },
}

export const themes = {
  portalDark: ingradientTheme,
}
