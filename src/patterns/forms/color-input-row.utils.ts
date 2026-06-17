export interface HslColor {
  h: number
  s: number
  l: number
}

const toHex = (value: number) => Math.round(value).toString(16).padStart(2, '0')

export function hslToHex({ h, s, l }: HslColor): string {
  const saturation = s / 100
  const lightness = l / 100
  const chroma = (1 - Math.abs(2 * lightness - 1)) * saturation
  const segment = h / 60
  const x = chroma * (1 - Math.abs((segment % 2) - 1))
  const [r1, g1, b1] =
    segment < 1 ? [chroma, x, 0]
      : segment < 2 ? [x, chroma, 0]
        : segment < 3 ? [0, chroma, x]
          : segment < 4 ? [0, x, chroma]
            : segment < 5 ? [x, 0, chroma]
              : [chroma, 0, x]
  const match = lightness - chroma / 2
  return `#${toHex((r1 + match) * 255)}${toHex((g1 + match) * 255)}${toHex((b1 + match) * 255)}`
}

export function hexToHsl(hex: string): HslColor {
  const numeric = Number.parseInt(hex.slice(1), 16)
  const r = ((numeric >> 16) & 255) / 255
  const g = ((numeric >> 8) & 255) / 255
  const b = (numeric & 255) / 255
  const max = Math.max(r, g, b)
  const min = Math.min(r, g, b)
  const delta = max - min
  const lightness = (max + min) / 2
  let hue = 0

  if (delta) {
    if (max === r) hue = ((g - b) / delta) % 6
    else if (max === g) hue = (b - r) / delta + 2
    else hue = (r - g) / delta + 4
    hue = Math.round(hue * 60)
    if (hue < 0) hue += 360
  }

  const saturation = delta === 0 ? 0 : delta / (1 - Math.abs(2 * lightness - 1))
  return { h: hue, s: Math.round(saturation * 100), l: Math.round(lightness * 100) }
}
