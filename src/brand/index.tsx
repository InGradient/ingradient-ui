import React from 'react'
import styled from 'styled-components'

const faviconIcoUrl = new URL('./assets/favicon.ico', import.meta.url).href
const faviconPngUrl = new URL('./assets/favicon.png', import.meta.url).href
const logoWordmarkUrl = new URL('./assets/ingradient_logo_l_white.png', import.meta.url).href

export const brandAssets = {
  faviconIco: faviconIcoUrl,
  faviconPng: faviconPngUrl,
  logoWordmark: logoWordmarkUrl,
} as const

const BrandImage = styled.img`
  display: block;
  max-width: 100%;
  height: auto;
`

export function BrandMark({
  size = 40,
  alt = 'Ingradient',
  src = brandAssets.faviconPng,
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
