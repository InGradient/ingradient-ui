import styled from 'styled-components'
import { MenuIcon } from '../../components/icons/catalog-icons'

const Btn = styled.button`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 32px;
  height: 32px;
  border: none;
  background: transparent;
  border-radius: var(--ig-radius-sm);
  color: var(--ig-color-text-muted);
  cursor: pointer;
  transition: background-color var(--ig-motion-fast), color var(--ig-motion-fast);
  &:hover {
    background: var(--ig-color-surface-interactive-hover);
    color: var(--ig-color-text-primary);
  }
`

export interface ExpandSidebarBtnProps {
  onClick?: () => void
  ariaLabel?: string
}

export function ExpandSidebarBtn({ onClick, ariaLabel = 'Expand sidebar' }: ExpandSidebarBtnProps) {
  return (
    <Btn type="button" aria-label={ariaLabel} onClick={onClick} data-ig-component="ExpandSidebarBtn">
      <MenuIcon size={18} />
    </Btn>
  )
}
