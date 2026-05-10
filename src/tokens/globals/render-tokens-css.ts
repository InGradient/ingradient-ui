import { buildTokenCssVariables, tokenCssVariables } from './token-css-variables'
import { legacyPortalCssVariables } from './legacy-css-variables'

export function renderVariableBlock(
  selector: string,
  variables: Record<string, string>
) {
  const lines = Object.entries(variables).map(([name, value]) => `  ${name}: ${value};`)
  return `${selector} {\n${lines.join('\n')}\n}`
}

// Emits theme-independent legacy aliases first (point to --ig-color-* which
// auto-swaps), then dark default block, then light variant block. Consumers
// switch by setting `data-theme` on the html element (IngradientThemeProvider).
export function renderTokensCss() {
  const darkVars = buildTokenCssVariables('dark')
  const lightVars = buildTokenCssVariables('light')
  return [
    renderVariableBlock(":root", legacyPortalCssVariables),
    renderVariableBlock(":root, :root[data-theme='dark']", darkVars),
    renderVariableBlock(":root[data-theme='light']", lightVars),
  ].join('\n') + '\n'
}

// Legacy single-block renderer kept for callers that don't need theme switching
export function renderTokensCssDarkOnly() {
  return `${renderVariableBlock(':root', { ...tokenCssVariables, ...legacyPortalCssVariables })}\n`
}
