import type { ReactNode } from 'react'
import { Badge } from '../../components/feedback/badge'

export type ProjectTypeTone = 'general' | 'deflectometry'

const TONE_TO_BG: Record<ProjectTypeTone, string> = {
  general: 'rgba(100, 116, 139, 0.92)',
  deflectometry: 'rgba(14, 165, 233, 0.92)',
}

const BASE_STYLE = {
  letterSpacing: '0.06em',
  textTransform: 'uppercase' as const,
}

export interface ProjectTypeTagProps {
  tone: ProjectTypeTone
  children?: ReactNode
  className?: string
}

const DEFAULT_LABELS: Record<ProjectTypeTone, string> = {
  general: 'General Project',
  deflectometry: 'Deflectometry Project',
}

/**
 * Project type pill — generic Badge surface (radius-pill / pill size) + uppercase
 * styling, with the project-type color applied via inline background override.
 * 도메인 라벨이 children 으로 전달되지 않으면 DEFAULT_LABELS 사용.
 */
export function ProjectTypeTag({ tone, children, className }: ProjectTypeTagProps) {
  const style = { ...BASE_STYLE, background: TONE_TO_BG[tone] }
  return (
    <Badge $tone="neutral" className={className} style={style}>
      {children ?? DEFAULT_LABELS[tone]}
    </Badge>
  )
}
