import { IconButton } from '../../components/inputs/icon-button'
import { MenuIcon } from '../../components/icons/catalog-icons'

export interface ExpandSidebarBtnProps {
  onClick?: () => void
  ariaLabel?: string
}

export function ExpandSidebarBtn({ onClick, ariaLabel = 'Expand sidebar' }: ExpandSidebarBtnProps) {
  return (
    <IconButton variant="secondary" size="sm" aria-label={ariaLabel} onClick={onClick} data-ig-component="ExpandSidebarBtn">
      <MenuIcon size={18} />
    </IconButton>
  )
}
