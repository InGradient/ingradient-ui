/** Lexical guardrails, not a CSS parser: inspect literal text without hiding mixed token/literal lines. */

/** Preserve quoted strings (including URLs), blank out comments without shifting line numbers. */
function stripComments(source) {
  return source.replace(
    /"(?:\\.|[^"\\])*"|'(?:\\.|[^'\\])*'|\/\*[\s\S]*?\*\/|\/\/[^\r\n]*/gu,
    (match) => match.startsWith('//') || match.startsWith('/*') ? match.replace(/[^\r\n]/gu, ' ') : match,
  )
}

export function rawColorLines(source) {
  return stripComments(source).split('\n').flatMap((line, index) => {
    // Ignore only the entity itself, not neighboring CSS on the same line.
    const text = line.replace(/&#(?:x[\da-f]+|\d+);/giu, '')
    return /#(?:[\da-f]{8}|[\da-f]{6}|[\da-f]{4}|[\da-f]{3})\b/iu.test(text)
      || /\b(?:rgba?|hsla?|oklch|oklab)\s*\(/iu.test(text) ? [index + 1] : []
  })
}

/**
 * `var(--ig-…)` references with their line. A name assembled at runtime
 * (`var(--ig-space-${n})`) stops at the trailing "-" and is skipped.
 */
export function tokenReferences(source) {
  return stripComments(source).split('\n').flatMap((line, index) =>
    [...line.matchAll(/var\(\s*(--ig-[a-z0-9-]+)/gu)]
      .filter(([, name]) => !name.endsWith('-'))
      .map(([, name]) => ({ line: index + 1, name })))
}

/** Custom properties a file declares itself (`--ig-catalog-gap: …`): valid to reference without being tokens. */
export function declaredCustomProperties(source) {
  return [...stripComments(source).matchAll(/(--ig-[a-z0-9-]+)['"]?\s*:/gu)].map(([, name]) => name)
}

/** React turns a bare number on these properties into px, so a number here is a raw length. */
const LENGTH_PROPERTY = /^(?:(?:min|max)?(?:Width|Height)|width|height|padding\w*|margin\w*|gap|rowGap|columnGap|top|right|bottom|left|inset\w*|fontSize|borderRadius|borderWidth|letterSpacing|flexBasis)$/u
const RAW_UNIT = /(?<![\w-])\d+(?:\.\d+)?(?:px|rem|em)\b/u

/**
 * Lines inside `style={{ … }}` that set a length to a bare number or a px/rem/em string
 * instead of a token. `0`, percentages, viewport units, `calc(…)` and values computed at
 * runtime (variables, template interpolation) are left alone, as stylelint leaves them.
 */
export function inlineStyleRawLines(source) {
  const code = stripComments(source)
  const lines = []
  for (const open of code.matchAll(/style=\{\{/gu)) {
    const start = open.index + open[0].length
    let depth = 2
    let end = start
    while (end < code.length && depth > 0) {
      const char = code[end++]
      if (char === '{') depth++
      else if (char === '}') depth--
    }
    const firstLine = code.slice(0, start).split('\n').length
    code.slice(start, end).split('\n').forEach((text, offset) => {
      const rawNumber = [...text.matchAll(/\b([A-Za-z]+)\s*:\s*-?(\d+(?:\.\d+)?)\s*(?=[,}]|$)/gu)]
        .some(([, property, value]) => LENGTH_PROPERTY.test(property) && Number(value) !== 0)
      const rawUnit = (text.match(/'[^'\n]*'|"[^"\n]*"/gu) ?? [])
        .some((quoted) => !quoted.includes('calc(') && RAW_UNIT.test(quoted.replace(/var\([^)]*\)/gu, '')))
      if (rawNumber || rawUnit) lines.push(firstLine + offset)
    })
  }
  return lines
}
