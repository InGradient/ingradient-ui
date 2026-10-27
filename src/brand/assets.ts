/**
 * Brand asset URL registry (Foundation layer).
 * Provides resolved URLs for brand images bundled by the build system.
 * Separated from React components so asset references can be consumed
 * without pulling in styled-components.
 */

const faviconIcoUrl = new URL('./assets/favicon.ico', import.meta.url).href
const faviconPngUrl = new URL('./assets/favicon.png', import.meta.url).href
const brandMarkUrl = new URL('./assets/brand-mark.png', import.meta.url).href
const logoWordmarkUrl = new URL('./assets/ingradient_logo_l_white.png', import.meta.url).href
/** Square app icon (mark on a light tile); readable at 24px in the app sidebar. */
const appIconUrl = new URL('./assets/app-icon.png', import.meta.url).href

export const brandAssets = {
  faviconIco: faviconIcoUrl,
  faviconPng: faviconPngUrl,
  brandMark: brandMarkUrl,
  logoWordmark: logoWordmarkUrl,
  appIcon: appIconUrl,
} as const