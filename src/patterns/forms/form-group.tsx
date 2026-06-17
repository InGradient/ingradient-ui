import React from 'react'
import { Stack, Text } from '../../primitives'

const DESC_STYLE = { marginTop: 'calc(-1 * var(--ig-space-2))' }

export interface FormGroupProps {
  title?: string
  description?: string
  children: React.ReactNode
  className?: string
}

export function FormGroup({ title, description, children, className }: FormGroupProps) {
  return (
    <Stack gap={4} className={className}>
      {title && <Text size="var(--ig-font-size-sm)" weight="bold">{title}</Text>}
      {description && <Text size="var(--ig-font-size-xs)" tone="muted" style={DESC_STYLE}>{description}</Text>}
      {children}
    </Stack>
  )
}
