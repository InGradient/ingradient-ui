import type { Preset } from '@ingradient/ui/tokens'

export { downloadFile, copyToClipboard } from '../../support/download'

/**
 * user override (color picker / spacing / radius 등에서 입력한 CSS var 값) 을
 * preset.overrides 에 머지한 사본을 만든다. 빈 overrides 면 원본 그대로 반환.
 */
function mergeOverrides(preset: Preset, overrides: Record<string, string>): Preset {
  if (!overrides || Object.keys(overrides).length === 0) return preset
  return { ...preset, overrides: { ...(preset.overrides ?? {}), ...overrides } }
}

/**
 * Preset → JSON 문자열 (pretty-print). user override 가 있으면 preset.overrides 에 머지됨.
 */
export function exportPresetJson(preset: Preset, overrides: Record<string, string> = {}): string {
  return JSON.stringify(mergeOverrides(preset, overrides), null, 2)
}

/**
 * Preset → TypeScript 파일 코드. src/tokens/presets/{service}/{version}/preset.ts 에
 * 그대로 붙여 넣을 수 있는 형태. user override 는 preset.overrides 에 머지되어 직렬화됨.
 */
export function exportPresetTs(preset: Preset, overrides: Record<string, string> = {}): string {
  const ident = toIdentifier(preset.id)
  const json = JSON.stringify(mergeOverrides(preset, overrides), null, 2)
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
