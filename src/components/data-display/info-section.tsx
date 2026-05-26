import type { ReactNode } from 'react'
import { Stack, Text } from '../../primitives'

export interface InfoSectionProps {
  title: string
  children: ReactNode
  className?: string
}

/**
 * 작은 uppercase title + 자식 content 의 section.
 * 사이드바 / 패널 안의 도메인 정보 묶음에 generic.
 */
export function InfoSection({ title, children, className }: InfoSectionProps) {
  return (
    <Stack as="section" gap={3} className={className}>
      <Text as="h3" tone="muted" size="12px" weight={600} uppercase letterSpacing="0.04em">{title}</Text>
      {children}
    </Stack>
  )
}
