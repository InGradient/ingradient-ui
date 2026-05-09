import React, { forwardRef } from 'react'
import styled, { css } from 'styled-components'
import { controlField } from '../../primitives'

export type TextFieldSize = 'sm' | 'md' | 'lg'

const sizeStyles: Record<TextFieldSize, ReturnType<typeof css>> = {
  sm: css`
    height: var(--ig-control-height-sm);
    padding: 0 var(--ig-space-4);
    font-size: var(--ig-font-size-sm);
  `,
  md: css``,
  lg: css`
    height: var(--ig-control-height-lg);
    padding: 0 var(--ig-space-6);
  `,
}

const TextFieldRoot = styled.input<{ $size: TextFieldSize }>`
  ${controlField}
  ${(p) => sizeStyles[p.$size]}
`

export interface TextFieldProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'size'> {
  size?: TextFieldSize
}

export const TextField = forwardRef<HTMLInputElement, TextFieldProps>(
  ({ size = 'md', ...rest }, ref) => <TextFieldRoot ref={ref} $size={size} {...rest} />,
)
TextField.displayName = 'TextField'

export const TextareaField = styled.textarea`
  ${controlField}
`

export const PasswordField = forwardRef<HTMLInputElement, TextFieldProps>(
  ({ size = 'md', ...rest }, ref) => <TextFieldRoot ref={ref} $size={size} type="password" {...rest} />,
)
PasswordField.displayName = 'PasswordField'
