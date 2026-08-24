import styled from 'styled-components'
import { ChevronDownIcon, ChevronRightIcon } from '@ingradient/ui/components'
import { iconSizeNumbers } from '@ingradient/ui'
import { Stack } from '@ingradient/ui/primitives'
import type { AdvancedSectionViewProps } from '../types'

const Header = styled.button`
  display: flex;
  align-items: center;
  gap: var(--ig-space-2);
  background: transparent;
  border: none;
  font-size: var(--ig-font-size-md);
  font-weight: var(--ig-font-weight-bold);
  color: var(--ig-color-text-primary);
  cursor: pointer;
  padding: 0;
  margin-bottom: var(--ig-space-3);
`

export function AdvancedSectionView(props: AdvancedSectionViewProps): JSX.Element {
  const { expanded, children, labels, onToggleExpanded } = props
  return (
    <Stack as="section" gap="var(--ig-space-5)" style={{ marginBottom: 'var(--ig-space-7)' }}>
      <Header type="button" onClick={onToggleExpanded}>
        {expanded ? <ChevronDownIcon size={iconSizeNumbers.sm} /> : <ChevronRightIcon size={iconSizeNumbers.sm} />}
        {labels.advancedTitle}
      </Header>
      {expanded && <div>{children}</div>}
    </Stack>
  )
}
