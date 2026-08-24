import React from 'react'
import styled from 'styled-components'
import { brandAssets } from './assets'

// Re-export asset registry for convenience
export { brandAssets } from './assets'

const BrandImage = styled.img`
  display: block;
  max-width: 100%;
  height: auto;
`

export function BrandMark({
  size = 40,
  alt = 'Ingradient',
  src = brandAssets.brandMark,
  ...props
}: Omit<React.ImgHTMLAttributes<HTMLImageElement>, 'src' | 'alt'> & {
  size?: number
  alt?: string
  src?: string
}) {
  return <BrandImage src={src} alt={alt} width={size} height={size} {...props} />
}

export function BrandLogo({
  width = 180,
  alt = 'Ingradient',
  src = brandAssets.logoWordmark,
  ...props
}: Omit<React.ImgHTMLAttributes<HTMLImageElement>, 'src' | 'alt' | 'width'> & {
  width?: number | string
  alt?: string
  src?: string
}) {
  return <BrandImage src={src} alt={alt} style={{ width, ...props.style }} {...props} />
}