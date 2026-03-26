import styled from 'styled-components'

export type ColorSwatchSize = 'xs' | 'sm' | 'md'
export type ColorSwatchShape = 'circle' | 'square'

const sizeMap: Record<ColorSwatchSize, string> = {
  xs: '8px',
  sm: '12px',
  md: '16px',
}

export const ColorSwatch = styled.span<{
  $color: string
  $size?: ColorSwatchSize
  $shape?: ColorSwatchShape
}>`
  display: inline-block;
  flex-shrink: 0;
  width: ${(p) => sizeMap[p.$size ?? 'sm']};
  height: ${(p) => sizeMap[p.$size ?? 'sm']};
  border-radius: ${(p) => (p.$shape === 'square' ? 'var(--ig-radius-xs)' : '50%')};
  background: ${(p) => p.$color};
`
