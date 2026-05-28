import React from 'react'
import styled from 'styled-components'

const Adornment = styled.div<{ $side: 'left' | 'right'; $inset: string; $stretchY: boolean }>`
  position: absolute;
  ${(p) => (p.$side === 'left' ? `left: ${p.$inset};` : `right: ${p.$inset};`)}
  ${(p) =>
    p.$stretchY
      ? `top: var(--ig-space-1px); bottom: var(--ig-space-1px);`
      : `top: 50%; transform: translateY(-50%);`}
  display: flex;
  align-items: center;
`

export interface InputAdornmentProps extends React.HTMLAttributes<HTMLDivElement> {
  side: 'left' | 'right'
  inset?: string
  stretchY?: boolean
  children: React.ReactNode
}

export function InputAdornment({
  side,
  inset = 'var(--ig-space-3)',
  stretchY = false,
  children,
  ...rest
}: InputAdornmentProps) {
  return (
    <Adornment $side={side} $inset={inset} $stretchY={stretchY} {...rest}>
      {children}
    </Adornment>
  )
}
