import React from 'react'
import styled from 'styled-components'
import { controlField } from '../../primitives'

export const TextField = styled.input`
  ${controlField}
`

export const TextareaField = styled.textarea`
  ${controlField}
`

export function PasswordField(props: React.InputHTMLAttributes<HTMLInputElement>) {
  return <TextField type="password" {...props} />
}
