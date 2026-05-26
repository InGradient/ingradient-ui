import styled from 'styled-components'
import { ChevronDown, ChevronRight } from 'lucide-react'
import { FormSection } from '@ingradient/ui'
import type { AdvancedSectionViewProps } from '../types'

const Header = styled.button`
  display: flex;
  align-items: center;
  gap: var(--ig-space-2);
  background: transparent;
  border: none;
  font-size: var(--ig-font-size-md);
  font-weight: 700;
  color: var(--ig-color-text-primary);
  cursor: pointer;
  padding: 0;
  margin-bottom: var(--ig-space-3);
`

export function AdvancedSectionView(props: AdvancedSectionViewProps): JSX.Element {
  const { expanded, children, labels, onToggleExpanded } = props
  return (
    <FormSection>
      <Header type="button" onClick={onToggleExpanded}>
        {expanded ? <ChevronDown size={14} /> : <ChevronRight size={14} />}
        {labels.advancedTitle}
      </Header>
      {expanded && <div>{children}</div>}
    </FormSection>
  )
}
