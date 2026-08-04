// Dark palette (default). Light counterpart is `foundationColorsLight` below.
export const foundationColors = {
  slate950: '#0f1115',
  slate925: '#10151d',
  slate900: '#111821',
  slate880: 'rgba(12, 15, 20, 0.88)',
  slate860: 'rgba(12, 15, 20, 0.8)',
  slate840: 'rgba(13, 18, 27, 0.92)',
  white04: 'rgba(255, 255, 255, 0.04)',
  white06: 'rgba(255, 255, 255, 0.06)',
  white07: 'rgba(255, 255, 255, 0.07)',
  white08: 'rgba(255, 255, 255, 0.08)',
  white10: 'rgba(255, 255, 255, 0.1)',
  white12: 'rgba(255, 255, 255, 0.12)',
  white18: 'rgba(255, 255, 255, 0.18)',
  white24: 'rgba(255, 255, 255, 0.24)',
  shadowSoft: 'rgba(0, 0, 0, 0.28)',
  shadowMedium: 'rgba(0, 0, 0, 0.35)',
  shadowStrong: 'rgba(0, 0, 0, 0.4)',
  blue500: '#4d88ff',
  blue600: '#2962d9',
  blue300: '#8cb6ff',
  blueTint12: 'rgba(77, 136, 255, 0.12)',
  blueTint14: 'rgba(77, 136, 255, 0.14)',
  blueTint16: 'rgba(77, 136, 255, 0.16)',
  blueTint18: 'rgba(77, 136, 255, 0.18)',
  blueTint28: 'rgba(77, 136, 255, 0.28)',
  blueTint38: 'rgba(91, 144, 255, 0.38)',
  blueTint42: 'rgba(77, 136, 255, 0.42)',
  green500: '#35c6a7',
  greenTint12: 'rgba(43, 181, 114, 0.12)',
  greenTint18: 'rgba(43, 181, 114, 0.18)',
  amber500: '#ffd179',
  amberTint18: 'rgba(251, 146, 60, 0.18)',
  amberTint20: 'rgba(255, 196, 61, 0.2)',
  red300: '#ff9a9a',
  redTint12: 'rgba(239, 68, 68, 0.12)',
  redTint18: 'rgba(239, 68, 68, 0.18)',
  cyanTint18: 'rgba(56, 189, 248, 0.18)',
  violet300: '#c084fc',
  borderStrong: 'rgba(148, 163, 184, 0.18)',
  overlayBackdrop: 'rgba(4, 8, 14, 0.72)',
  radialA: 'rgba(66, 139, 202, 0.18)',
  radialB: 'rgba(0, 158, 115, 0.12)',
  textPrimary: '#edf2f7',
  textSecondary: '#d7deea',
  textMuted: '#98a2b3',
  textSoft: '#7e8fa3',
  textSuccess: '#9ef0c1',
  textWarning: '#ffe08a',
  textDanger: '#fca5a5',
  textInfo: '#cfe0ff',
  textSuccessSoft: '#b7f6d1',
  textWarningSoft: '#ffd6a5',
  textDangerSoft: '#fecaca',
  textCyan: '#8fe6ff',
  textBlue: '#a9c6ff',
  textSlate: '#cbd5e1',
  textSlateSoft: '#d5dee9',
  textOrange: '#fdba74',
  // Catalog-specific (platform 와 매칭)
  tagClassificationBg: 'rgba(110, 200, 122, 0.15)',
  tagClassificationText: '#6ec87a',
  tagSegmentationBg: 'rgba(180, 120, 230, 0.15)',
  tagSegmentationText: '#c084fc',
  tagObjectDetectionBg: 'rgba(77, 136, 255, 0.15)',
  tagObjectDetectionText: '#8cb6ff',
  syncChipSyncedBg: 'rgba(34, 197, 94, 0.92)',
  syncChipUploadingBg: 'rgba(234, 179, 8, 0.92)',
  syncChipFailedBg: 'rgba(220, 38, 38, 0.92)',
  syncChipLocalBg: 'rgba(75, 85, 99, 0.92)',
  syncChipOnText: '#ffffff',
  imageGroupCircleBg: 'rgba(12, 16, 24, 0.92)',
  imageGroupCircleBorder: 'rgba(255, 255, 255, 0.14)',
  dangerDimBg: 'rgba(120, 28, 28, 0.18)',
  dangerDimBorder: 'rgba(224, 92, 92, 0.45)',
} as const

// Light palette — same shape as foundationColors. Used by ingradientThemeLight.
// Color choices target WCAG AA (4.5:1) on light surfaces, mirroring the contrast
// principles of the dark palette (PR-D4b textSoft lift kept consistent).
export const foundationColorsLight = {
  // Surfaces — flipped from slate900-tinted dark to white/near-white tints
  slate950: '#ffffff',                              // canvas
  slate925: '#f7f9fb',                              // raised
  slate900: '#eef2f7',                              // raised-alt
  slate880: 'rgba(255, 255, 255, 0.92)',            // header
  slate860: 'rgba(255, 255, 255, 0.85)',            // panel
  slate840: 'rgba(247, 249, 251, 0.92)',            // muted
  // "white tint" tokens become "black tint" in light mode for inset/hover overlays
  white04: 'rgba(15, 18, 25, 0.04)',
  white06: 'rgba(15, 18, 25, 0.05)',
  white07: 'rgba(15, 18, 25, 0.06)',
  white08: 'rgba(15, 18, 25, 0.08)',
  white10: 'rgba(15, 18, 25, 0.09)',
  white12: 'rgba(15, 18, 25, 0.10)',
  white18: 'rgba(15, 18, 25, 0.14)',
  white24: 'rgba(15, 18, 25, 0.18)',
  shadowSoft: 'rgba(0, 0, 0, 0.28)',
  shadowMedium: 'rgba(0, 0, 0, 0.35)',
  shadowStrong: 'rgba(0, 0, 0, 0.4)',
  // Accent — saturated variants for light bg contrast.
  // All three meet 4.5:1 on white and on accent-soft-surface tints. Hierarchy
  // is "deeper accent" rather than "lighter tint" in light mode (the soft tier
  // can't be lighter without failing contrast).
  blue500: '#214bb8',                                // ~5.7:1 on white tints
  blue600: '#143fa6',                                // strongest; on-accent uses white text token
  blue300: '#214bb8',                                // soft = same as primary in light (hierarchy collapse)
  blueTint12: 'rgba(58, 115, 230, 0.12)',
  blueTint14: 'rgba(58, 115, 230, 0.14)',
  blueTint16: 'rgba(58, 115, 230, 0.16)',
  blueTint18: 'rgba(58, 115, 230, 0.18)',
  blueTint28: 'rgba(58, 115, 230, 0.28)',
  blueTint38: 'rgba(58, 115, 230, 0.38)',
  blueTint42: 'rgba(58, 115, 230, 0.42)',
  // Semantic colors lifted for light bg contrast
  green500: '#1a8f6f',
  greenTint12: 'rgba(26, 143, 111, 0.12)',
  greenTint18: 'rgba(26, 143, 111, 0.18)',
  amber500: '#b8761a',
  amberTint18: 'rgba(184, 118, 26, 0.18)',
  amberTint20: 'rgba(184, 118, 26, 0.2)',
  red300: '#cc2929',
  redTint12: 'rgba(204, 41, 41, 0.12)',
  redTint18: 'rgba(204, 41, 41, 0.18)',
  cyanTint18: 'rgba(14, 116, 144, 0.18)',
  violet300: '#7c3aed',
  // Borders — subtle dark tints on light surface
  borderStrong: 'rgba(15, 23, 42, 0.14)',
  // Overlay backdrop — keep heavy dark for clarity over light page
  overlayBackdrop: 'rgba(15, 23, 42, 0.32)',
  // Radials — softer / neutral on light
  radialA: 'rgba(58, 115, 230, 0.10)',
  radialB: 'rgba(26, 143, 111, 0.07)',
  // Text — dark-on-light, mirroring contrast tiers of dark palette
  textPrimary: '#0f1219',                            // ~16:1 on white
  textSecondary: '#384155',                          // ~9.5:1
  textMuted: '#475467',                              // ~7:1
  textSoft: '#5e6776',                               // ~5.6:1 — safe, hierarchy preserved
  // Status text tokens — "soft" tier still needs >=4.5:1 on its tint bg (~#e0f0ea
  // for success, ~#efe2c4 for warning, etc.). Darkened from initial draft.
  textSuccess: '#0e5a44',
  textWarning: '#7a4f10',
  textDanger: '#8a1818',
  textInfo: '#1f4fb8',
  textSuccessSoft: '#0e5a44',
  textWarningSoft: '#7a4f10',
  textDangerSoft: '#8a1818',
  textCyan: '#0e5b6c',
  textBlue: '#1f4fb8',
  textSlate: '#374151',
  textSlateSoft: '#384155',
  textOrange: '#7d4310',
  // Catalog-specific — light mode 변형
  tagClassificationBg: 'rgba(34, 139, 50, 0.12)',
  tagClassificationText: '#2f7a3a',
  tagSegmentationBg: 'rgba(120, 60, 175, 0.12)',
  tagSegmentationText: '#7c3aed',
  tagObjectDetectionBg: 'rgba(33, 75, 184, 0.12)',
  tagObjectDetectionText: '#214bb8',
  syncChipSyncedBg: 'rgba(22, 163, 74, 0.92)',
  syncChipUploadingBg: 'rgba(202, 138, 4, 0.92)',
  syncChipFailedBg: 'rgba(185, 28, 28, 0.92)',
  syncChipLocalBg: 'rgba(75, 85, 99, 0.92)',
  syncChipOnText: '#ffffff',
  imageGroupCircleBg: 'rgba(15, 23, 42, 0.85)',
  imageGroupCircleBorder: 'var(--ig-color-white-18)',
  dangerDimBg: 'rgba(185, 28, 28, 0.10)',
  dangerDimBorder: 'rgba(185, 28, 28, 0.40)',
} as const

// Both palettes share the exact same key shape — type guard.
foundationColorsLight satisfies Record<keyof typeof foundationColors, string>
