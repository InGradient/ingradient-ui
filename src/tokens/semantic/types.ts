export interface IngradientTheme {
  name: string
  colors: {
    bgCanvas: string
    bgCanvasAlt: string
    bgRadialA: string
    bgRadialB: string
    surfaceHeader: string
    surfacePanel: string
    surfaceRaised: string
    surfaceMuted: string
    surfaceInteractive: string
    surfaceActive: string
    borderSubtle: string
    borderStrong: string
    textPrimary: string
    textSecondary: string
    textMuted: string
    textSoft: string
    accent: string
    accentStrong: string
    accentSoft: string
    success: string
    warning: string
    danger: string
  }
  radius: {
    sm: string
    md: string
    lg: string
    xl: string
    pill: string
  }
  shadows: {
    panel: string
    floating: string
  }
  breakpoints: {
    sm: number
    md: number
    lg: number
    xl: number
  }
  motion: {
    fast: string
    normal: string
  }
  typography: {
    fontSans: string
    fontMono: string
  }
}
