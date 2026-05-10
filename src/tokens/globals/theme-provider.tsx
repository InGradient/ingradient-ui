import React, { useLayoutEffect } from 'react'
import { ThemeProvider as StyledThemeProvider } from 'styled-components'
import { ingradientThemeDark, ingradientThemeLight, type ThemeMode } from '../semantic/theme'
import type { IngradientTheme } from '../semantic/types'

export interface IngradientThemeProviderProps {
  children: React.ReactNode
  /** Theme mode — toggles `data-theme` attr on html + selects styled-components theme. Default 'dark'. */
  mode?: ThemeMode
  /** Override theme object directly (overrides `mode`). For custom themes. */
  theme?: IngradientTheme
}

// Sync set on module load if browser — covers the SSR/initial-render gap
// before the first useLayoutEffect runs. Storybook test runner inspects DOM
// before effects fire otherwise, picking up the wrong CSS block.
function syncSetDataTheme(mode: ThemeMode) {
  if (typeof document === 'undefined') return
  document.documentElement.dataset.theme = mode
}

export function IngradientThemeProvider({
  children,
  mode = 'dark',
  theme,
}: IngradientThemeProviderProps) {
  // Run synchronously during render so initial DOM matches mode immediately.
  // Safe because we're only reading/writing the html data-theme attr.
  syncSetDataTheme(mode)

  useLayoutEffect(() => {
    syncSetDataTheme(mode)
  }, [mode])

  const resolvedTheme = theme ?? (mode === 'light' ? ingradientThemeLight : ingradientThemeDark)
  return <StyledThemeProvider theme={resolvedTheme}>{children}</StyledThemeProvider>
}
