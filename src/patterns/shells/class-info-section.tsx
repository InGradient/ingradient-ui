import type { ReactNode } from 'react'
import { Stack, Text } from '../../primitives'

export interface ClassInfoSectionProps {
  title: string
  children: ReactNode
  className?: string
}

export function ClassInfoSection({ title, children, className }: ClassInfoSectionProps) {
  return (
    <Stack as="section" gap={3} className={className}>
      <Text as="h3" tone="muted" size="12px" weight={600} uppercase letterSpacing="0.04em">{title}</Text>
      {children}
    </Stack>
  )
}
