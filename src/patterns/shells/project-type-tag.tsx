import styled from 'styled-components'

export type ProjectTypeTone = 'general' | 'deflectometry'

const Tag = styled.span<{ $tone: ProjectTypeTone }>`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  height: 22px;
  padding: 0 10px;
  border-radius: 999px;
  font-size: 10px;
  font-weight: 700;
  letter-spacing: 0.06em;
  text-transform: uppercase;
  color: var(--ig-color-text-primary);
  background: ${(p) => (p.$tone === 'deflectometry' ? 'rgba(14, 165, 233, 0.92)' : 'rgba(100, 116, 139, 0.92)')};
`

export interface ProjectTypeTagProps {
  tone: ProjectTypeTone
  children?: React.ReactNode
  className?: string
}

const DEFAULT_LABELS: Record<ProjectTypeTone, string> = {
  general: 'General Project',
  deflectometry: 'Deflectometry Project',
}

export function ProjectTypeTag({ tone, children, className }: ProjectTypeTagProps) {
  return (
    <Tag $tone={tone} className={className}>
      {children ?? DEFAULT_LABELS[tone]}
    </Tag>
  )
}
