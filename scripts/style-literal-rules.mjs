/** Lexical guardrail, not a CSS parser: inspect literal text without hiding mixed token/literal lines. */
export function rawColorLines(source) {
  // Preserve quoted strings (including URLs), remove comments without shifting line numbers.
  const code = source.replace(
    /"(?:\\.|[^"\\])*"|'(?:\\.|[^'\\])*'|\/\*[\s\S]*?\*\/|\/\/[^\r\n]*/gu,
    (match) => match.startsWith('//') || match.startsWith('/*') ? match.replace(/[^\r\n]/gu, ' ') : match,
  )
  return code.split('\n').flatMap((line, index) => {
    // Ignore only the entity itself, not neighboring CSS on the same line.
    const text = line.replace(/&#(?:x[\da-f]+|\d+);/giu, '')
    return /#(?:[\da-f]{8}|[\da-f]{6}|[\da-f]{4}|[\da-f]{3})\b/iu.test(text)
      || /\b(?:rgba?|hsla?|oklch|oklab)\s*\(/iu.test(text) ? [index + 1] : []
  })
}
