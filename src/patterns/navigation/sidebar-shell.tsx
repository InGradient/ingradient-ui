import React from 'react'
import {
  SidebarActionButton,
  SidebarBottom,
  SidebarBrandRow,
  SidebarCloseButton,
  SidebarIconHolder,
  SidebarItemRow,
  SidebarNavList,
  SidebarShellWrap,
  SidebarTopActionWrap,
} from './sidebar-shell.styles'

export interface SidebarShellItem {
  key: string
  title: string
  label: string
  icon: React.ReactNode
  /** Route path. Passed as `to` to `linkComponent`, or as `href` to plain `<a>`. */
  to?: string
  /** Component used for the clickable row. Use react-router's NavLink for active-aware items.
   *  Default: plain `<a>`. Active styling (`.active` / `aria-current="page"`) stays on the shell. */
  linkComponent?: React.ElementType
  /** Optional badge (e.g. NotificationBadge). Wraps the icon. */
  badge?: React.ReactNode
}

export interface SidebarShellAction {
  key: string
  title: string
  label: string
  icon: React.ReactNode
  onClick?: (event: React.MouseEvent<HTMLButtonElement>) => void
  badge?: React.ReactNode
}

export interface SidebarShellProps {
  expanded: boolean
  onToggleExpanded?: () => void
  width?: { expanded?: number; collapsed?: number }
  brand?: React.ReactNode
  topAction?: React.ReactNode
  items?: SidebarShellItem[]
  actions?: SidebarShellAction[]
  /** `aria-label` on the inner `<nav>` — must be unique when multiple sidebars
   *  share a page (a11y landmark-unique). Default `"Sidebar"`. */
  navLabel?: string
  className?: string
}

const DEFAULT_WIDTH_EXPANDED = 180
const DEFAULT_WIDTH_COLLAPSED = 72

function CloseIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
      <polyline points="15 18 9 12 15 6" />
    </svg>
  )
}

export function SidebarShell({
  expanded,
  onToggleExpanded,
  width,
  brand,
  topAction,
  items,
  actions,
  navLabel = 'Sidebar',
  className,
}: SidebarShellProps) {
  const widthExpanded = width?.expanded ?? DEFAULT_WIDTH_EXPANDED
  const widthCollapsed = width?.collapsed ?? DEFAULT_WIDTH_COLLAPSED
  return (
    <SidebarShellWrap
      $expanded={expanded}
      $widthExpanded={widthExpanded}
      $widthCollapsed={widthCollapsed}
      className={className}
      data-expanded={expanded ? 'true' : 'false'}
    >
      {brand !== undefined ? (
        <SidebarBrandRow>
          {brand}
          {expanded && onToggleExpanded ? (
            <SidebarCloseButton type="button" onClick={onToggleExpanded} aria-label="Collapse sidebar" title="Collapse sidebar">
              <CloseIcon />
            </SidebarCloseButton>
          ) : null}
        </SidebarBrandRow>
      ) : null}
      {topAction !== undefined ? <SidebarTopActionWrap>{topAction}</SidebarTopActionWrap> : null}
      {items && items.length > 0 ? (
        <SidebarNavList aria-label={navLabel}>
          {items.map((item) => {
            const LinkComp = item.linkComponent
            const extraProps = LinkComp ? { to: item.to } : { href: item.to ?? '#' }
            return (
              <SidebarItemRow key={item.key} as={LinkComp ?? 'a'} title={item.title} {...extraProps}>
                <SidebarIconHolder>{item.badge ?? item.icon}</SidebarIconHolder>
                {expanded ? <span>{item.label}</span> : null}
              </SidebarItemRow>
            )
          })}
        </SidebarNavList>
      ) : null}
      {actions && actions.length > 0 ? (
        <SidebarBottom>
          {actions.map((action) => (
            <SidebarActionButton
              key={action.key}
              type="button"
              title={action.title}
              onClick={action.onClick}
            >
              <SidebarIconHolder>{action.badge ?? action.icon}</SidebarIconHolder>
              {expanded ? <span>{action.label}</span> : null}
            </SidebarActionButton>
          ))}
        </SidebarBottom>
      ) : null}
    </SidebarShellWrap>
  )
}
