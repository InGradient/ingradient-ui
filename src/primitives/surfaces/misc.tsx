import React from 'react'
import styled from 'styled-components'
import { iconSizeNumbers } from '../../tokens/core'

export const Divider = styled.hr`
  width: 100%;
  height: var(--ig-space-1px);
  margin: 0;
  border: 0;
  background: var(--ig-color-border-subtle);
`

export const ScrollArea = styled.div`
  min-width: 0;
  min-height: 0;
  overflow: auto;
`

const IconRoot = styled.span<{ $size?: number }>`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: ${(p) => `${p.$size ?? iconSizeNumbers.lg}px`};
  height: ${(p) => `${p.$size ?? iconSizeNumbers.lg}px`};
  flex-shrink: 0;

  svg {
    width: 100%;
    height: 100%;
  }
`

export function Icon({
  size = iconSizeNumbers.lg,
  ...props
}: React.HTMLAttributes<HTMLSpanElement> & { size?: number }) {
  return <IconRoot $size={size} {...props} />
}
