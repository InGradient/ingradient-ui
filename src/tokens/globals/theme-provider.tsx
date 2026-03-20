import React from 'react'
import { ThemeProvider as StyledThemeProvider } from 'styled-components'
import { ingradientTheme } from '../semantic/theme'
import type { IngradientTheme } from '../semantic/types'

export function IngradientThemeProvider({
  children,
  theme = ingradientTheme,
}: {
  children: React.ReactNode
  theme?: IngradientTheme
}) {
  return <StyledThemeProvider theme={theme}>{children}</StyledThemeProvider>
}
