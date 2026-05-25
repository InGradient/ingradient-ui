import React from 'react'
import { Stack } from '../../primitives'

export interface CommentThreadProps {
  children: React.ReactNode
  className?: string
}

export function CommentThread({ children, className }: CommentThreadProps) {
  return <Stack gap={3} className={className}>{children}</Stack>
}
