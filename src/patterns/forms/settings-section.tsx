import type { ReactNode } from 'react'
import styled from 'styled-components'
import { withSurfaceDepth } from '../../primitives'

type SettingsSectionTone = 'default' | 'danger'

/**
 * A settings section is a heading plus its rows, separated from the previous section by a 1px line
 * (24px above and below with the 8px stack gap), not a box inside the modal (DESIGN.md §5).
 * The danger tone keeps an alert box: it marks a real boundary around irreversible actions.
 */
const SectionBase = styled.section<{ $tone: SettingsSectionTone }>`
  display: flex;
  flex-direction: column;
  gap: var(--ig-spacing-12);
  & + & {
    margin-top: var(--ig-spacing-16);
    padding-top: var(--ig-spacing-24);
    border-top: var(--ig-border-1px) solid var(--ig-color-border-subtle);
  }
  ${(p) => p.$tone === 'danger' && `
    padding: var(--ig-spacing-16);
    border: var(--ig-border-1px) solid var(--ig-color-alert-danger-border);
    background: var(--ig-color-alert-danger-bg);
    && + & { padding-top: var(--ig-spacing-16); border-top: var(--ig-border-1px) solid var(--ig-color-alert-danger-border); }
  `}
`

/**
 * Only the danger box is a surface (depth radius); a plain section stays square so its top
 * divider is a straight line rather than following a rounded corner.
 */
const DangerSection = withSurfaceDepth(SectionBase, { displayName: 'SettingsSection' })

const Title = styled.h3<{ $tone: SettingsSectionTone }>`
  margin: 0;
  font-size: var(--ig-font-size-md);
  font-weight: var(--ig-font-weight-semibold);
  color: ${(p) => (p.$tone === 'danger' ? 'var(--ig-color-alert-danger-text)' : 'var(--ig-color-text-primary)')};
`

const Body = styled.div`
  display: flex;
  flex-direction: column;
  gap: var(--ig-spacing-8);
`

export interface SettingsSectionProps {
  title?: string
  children: ReactNode
  className?: string
  tone?: SettingsSectionTone
}

export function SettingsSection({ title, children, className, tone = 'default' }: SettingsSectionProps) {
  const Root = tone === 'danger' ? DangerSection : SectionBase
  return (
    <Root className={className} $tone={tone}>
      {title ? <Title $tone={tone}>{title}</Title> : null}
      <Body>{children}</Body>
    </Root>
  )
}
