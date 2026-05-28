import type { ReactNode } from 'react'
import { Stack, Text } from '../../primitives'

export interface SettingsSectionProps {
  title?: string
  children: ReactNode
  className?: string
}

export function SettingsSection({ title, children, className }: SettingsSectionProps) {
  return (
    <Stack as="section" gap={5} className={className}>
      {title ? <Text as="h3" tone="muted" size="var(--ig-font-size-sm)" weight="semibold" uppercase letterSpacing="normal">{title}</Text> : null}
      {children}
    </Stack>
  )
}
