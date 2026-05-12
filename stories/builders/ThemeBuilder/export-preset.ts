import type { Preset } from '@ingradient/ui/tokens'

export { downloadFile, copyToClipboard } from '../../support/download'

/**
 * Preset → JSON 문자열 (pretty-print).
 */
export function exportPresetJson(preset: Preset): string {
  return JSON.stringify(preset, null, 2)
}

/**
 * Preset → TypeScript 파일 코드. src/tokens/presets/{service}/{version}/preset.ts 에
 * 그대로 붙여 넣을 수 있는 형태. JSON 은 JS object literal 의 부분집합이라 그대로 사용.
 */
export function exportPresetTs(preset: Preset): string {
  const ident = toIdentifier(preset.id)
  const json = JSON.stringify(preset, null, 2)
  return [
    `import type { Preset } from '@ingradient/ui/tokens'`,
    ``,
    `export const ${ident}: Preset = ${json}`,
    ``,
  ].join('\n')
}

function toIdentifier(id: string): string {
  // 'platform-0.0.1' → 'platform001' (semver dots → 숫자만)
  // 'platform-custom-1' → 'platformCustom1'
  const parts = id.split(/[-_.]/).filter(Boolean)
  if (parts.length === 0) return 'preset'
  return parts
    .map((p, i) => {
      const safe = p.replace(/[^A-Za-z0-9]/g, '')
      if (i === 0) return safe
      return safe.charAt(0).toUpperCase() + safe.slice(1)
    })
    .join('')
}
