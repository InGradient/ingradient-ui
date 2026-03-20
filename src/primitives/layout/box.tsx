import React from 'react'
import styled from 'styled-components'
import { numberOrString, space, type Space } from '../shared'

const BoxRoot = styled.div<{
  $display?: string
  $padding?: Space
  $gap?: Space
  $width?: string | number
  $height?: string | number
  $align?: string
  $justify?: string
  $direction?: string
  $wrap?: string
}>`
  display: ${(p) => p.$display ?? 'block'};
  min-width: 0;
  ${(p) => (p.$padding != null ? `padding: ${space(p.$padding)};` : '')}
  ${(p) => (p.$gap != null ? `gap: ${space(p.$gap)};` : '')}
  ${(p) => (p.$width != null ? `width: ${numberOrString(p.$width)};` : '')}
  ${(p) => (p.$height != null ? `height: ${numberOrString(p.$height)};` : '')}
  ${(p) => (p.$align ? `align-items: ${p.$align};` : '')}
  ${(p) => (p.$justify ? `justify-content: ${p.$justify};` : '')}
  ${(p) => (p.$direction ? `flex-direction: ${p.$direction};` : '')}
  ${(p) => (p.$wrap ? `flex-wrap: ${p.$wrap};` : '')}
`

export type BoxProps = React.HTMLAttributes<HTMLDivElement> & {
  display?: string
  padding?: Space
  gap?: Space
  width?: string | number
  height?: string | number
  align?: string
  justify?: string
  direction?: string
  wrap?: string
}

export function Box({
  display,
  padding,
  gap,
  width,
  height,
  align,
  justify,
  direction,
  wrap,
  ...props
}: BoxProps) {
  return (
    <BoxRoot
      $display={display}
      $padding={padding}
      $gap={gap}
      $width={width}
      $height={height}
      $align={align}
      $justify={justify}
      $direction={direction}
      $wrap={wrap}
      {...props}
    />
  )
}
