import type { ImgHTMLAttributes, ReactNode } from 'react'
import styled from 'styled-components'
import { gradientAngles } from '../../tokens/core'

export type AspectRatio = '1/1' | '4/3' | '16/9' | '16/10'

const Frame = styled.div<{ $ratio: AspectRatio }>`
  position: relative;
  aspect-ratio: ${(p) => p.$ratio};
  background: linear-gradient(
      ${gradientAngles.diagonal},
      var(--ig-color-media-placeholder-a) 0%,
      var(--ig-color-media-placeholder-b) 100%
    ),
    var(--ig-color-surface-interactive);

  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    display: block;
  }
`

export interface AspectRatioImageProps extends Omit<ImgHTMLAttributes<HTMLImageElement>, 'alt'> {
  ratio?: AspectRatio
  alt?: string
  children?: ReactNode
}

/**
 * Fixed-ratio thumbnail frame. Renders an `<img>` with `object-fit: cover` over a
 * subtle gradient fallback so the cell never goes empty during load.
 * Pass overlay slots (badges, OverlayLayer) as children — they layer above the image.
 */
export function AspectRatioImage({
  ratio = '1/1', alt = '', children, ...imgProps
}: AspectRatioImageProps) {
  return (
    <Frame $ratio={ratio}>
      <img alt={alt} {...imgProps} />
      {children}
    </Frame>
  )
}
