import React from 'react'
import { Stack } from '../../primitives'

export interface CommentThreadProps {
  children: React.ReactNode
  className?: string
}

export function CommentThread({ children, className }: CommentThreadProps) {
  return <Stack gap="var(--ig-space-3px)" className={className}>{children}</Stack>
}
