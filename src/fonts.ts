/**
 * Loads the design-system typefaces (DESIGN.draft.md §3): IBM Plex Sans for Latin text,
 * IBM Plex Sans KR for Korean, and IBM Plex Mono for code and numbers. Without this import
 * the declared font stack falls back to whatever the viewer's machine has installed, so
 * different machines rendered different fonts. Import once at the app root:
 *
 *   import '@ingradient/ui/fonts'
 *
 * Only the weights the type scale uses are loaded. Korean is split by `unicode-range`, so a
 * browser downloads only the subsets that contain characters on screen. Fonts are licensed
 * under the SIL Open Font License 1.1.
 */
import '@fontsource/ibm-plex-sans/400.css'
import '@fontsource/ibm-plex-sans/500.css'
import '@fontsource/ibm-plex-sans/600.css'
import '@fontsource/ibm-plex-sans/700.css'
import '@fontsource/ibm-plex-sans-kr/400.css'
import '@fontsource/ibm-plex-sans-kr/500.css'
import '@fontsource/ibm-plex-sans-kr/600.css'
import '@fontsource/ibm-plex-sans-kr/700.css'
import '@fontsource/ibm-plex-mono/400.css'
import '@fontsource/ibm-plex-mono/500.css'
import '@fontsource/ibm-plex-mono/600.css'

export {}
