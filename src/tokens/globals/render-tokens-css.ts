import { legacyPortalCssVariables } from './legacy-css-variables'
import { tokenCssVariables } from './token-css-variables'

export function renderVariableBlock(
  selector: string,
  variables: Record<string, string>
) {
  const lines = Object.entries(variables).map(([name, value]) => `  ${name}: ${value};`)
  return `${selector} {\n${lines.join('\n')}\n}`
}

export function renderTokensCss() {
  return `${renderVariableBlock(':root', tokenCssVariables)}\n\n${renderVariableBlock(
    ':root',
    legacyPortalCssVariables
  )}\n`
}
