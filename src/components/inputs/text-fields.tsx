import React from 'react'
import styled from 'styled-components'
import { controlField } from '../../primitives'

export const TextField = styled.input`
  ${controlField}
`

export const TextareaField = styled.textarea`
  ${controlField}
`

export function NumberField(props: React.InputHTMLAttributes<HTMLInputElement>) {
  return <TextField type="number" {...props} />
}

export function PasswordField(props: React.InputHTMLAttributes<HTMLInputElement>) {
  return <TextField type="password" {...props} />
}

export function SearchField(props: React.InputHTMLAttributes<HTMLInputElement>) {
  return <TextField type="search" {...props} />
}
