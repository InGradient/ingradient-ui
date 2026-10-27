import React from 'react'
import {
  SidebarActionButton,
  SidebarBottom,
  SidebarBrandRow,
  SidebarBrandSlot,
  SidebarChevronSlot,
  SidebarHoverExpandOverlay,
  SidebarIconHolder,
  SidebarItemRow,
  SidebarNavList,
  SidebarShellWrap,
  SidebarSubList,
  SidebarToggleButton,
  SidebarTopActionWrap,
} from './sidebar-shell.styles'
import { iconSizeNumbers, svgStrokeWidths } from '../../tokens/core'
import { PanelLeftCloseIcon, PanelLeftOpenIcon } from '../../components/icons/catalog-icons'

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
  /** Sub-items 가 있으면 row 는 expandable button 으로 렌더 (link 대신). 펼침 시 children 노출. */
  children?: SidebarShellItem[]
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
  /** items 외 자유 body 컨텐츠. rich 한 nav (Projects / Conversations / Jobs 등) 를 가진 caller 가
   *  items 모델 (icon + label) 대신 임의 React 노드를 body 에 삽입할 때 사용. */
  children?: React.ReactNode
  /** `aria-label` on the inner `<nav>` — must be unique when multiple sidebars
   *  share a page (a11y landmark-unique). Default `"Sidebar"`. */
  navLabel?: string
  /** `aria-label` on the outer `<aside>` landmark — must be unique on the page. Default `"Sidebar"`. */
  label?: string
  className?: string
}

const DEFAULT_WIDTH_EXPANDED = 180
const DEFAULT_WIDTH_COLLAPSED = 72

// Panel collapse/expand uses the shared panel icon pair (DESIGN.md §9, IconButton rule).
function CollapseIcon() {
  return <PanelLeftCloseIcon size={iconSizeNumbers.md} aria-hidden />
}

function ExpandIcon() {
  return <PanelLeftOpenIcon size={iconSizeNumbers.md} aria-hidden />
}

function ChevronDownIcon({ rotated }: { rotated?: boolean }) {
  return (
    <svg
      viewBox="0 0 24 24" fill="none" stroke="currentColor"
      strokeWidth={svgStrokeWidths.regular} strokeLinecap="round" strokeLinejoin="round"
      style={{ transform: rotated ? 'rotate(0)' : 'rotate(-90deg)', transition: 'transform var(--ig-motion-fast)' }}
      aria-hidden
    >
      <polyline points="6 9 12 15 18 9" />
    </svg>
  )
}

function SidebarItemNode({ item, sidebarExpanded }: { item: SidebarShellItem; sidebarExpanded: boolean }) {
  const [open, setOpen] = React.useState(false)
  const hasChildren = !!item.children && item.children.length > 0

  if (hasChildren) {
    // 접힘 sidebar 에선 sub-item 안 보이게 (실제 앱과 동일) — row 만 노출, 클릭 시 펼치기는 caller 책임.
    return (
      <>
        <SidebarItemRow
          as="button"
          type="button"
          title={item.title}
          aria-expanded={open}
          onClick={() => setOpen((p) => !p)}
        >
          <SidebarIconHolder>{item.badge ?? item.icon}</SidebarIconHolder>
          {sidebarExpanded ? <span>{item.label}</span> : null}
          {sidebarExpanded ? (
            <SidebarChevronSlot aria-hidden>
              <ChevronDownIcon rotated={open} />
            </SidebarChevronSlot>
          ) : null}
        </SidebarItemRow>
        {open && sidebarExpanded ? (
          <SidebarSubList>
            {item.children!.map((child) => (
              <SidebarItemNode key={child.key} item={child} sidebarExpanded={sidebarExpanded} />
            ))}
          </SidebarSubList>
        ) : null}
      </>
    )
  }

  const LinkComp = item.linkComponent
  const extraProps = LinkComp ? { to: item.to } : { href: item.to ?? '#' }
  return (
    <SidebarItemRow as={LinkComp ?? 'a'} title={item.title} {...extraProps}>
      <SidebarIconHolder>{item.badge ?? item.icon}</SidebarIconHolder>
      {sidebarExpanded ? <span>{item.label}</span> : null}
    </SidebarItemRow>
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
  children,
  navLabel = 'Sidebar',
  label = 'Sidebar',
  className,
}: SidebarShellProps) {
  const widthExpanded = width?.expanded ?? DEFAULT_WIDTH_EXPANDED
  const widthCollapsed = width?.collapsed ?? DEFAULT_WIDTH_COLLAPSED
  // Toggle names follow the landmark name so several sidebars on one page stay distinguishable.
  const toggleNoun = label === 'Sidebar' ? 'sidebar' : label.toLowerCase()
  return (
    <SidebarShellWrap
      $expanded={expanded}
      $widthExpanded={widthExpanded}
      $widthCollapsed={widthCollapsed}
      className={className}
      aria-label={label}
      data-expanded={expanded ? 'true' : 'false'}
    >
      {(brand !== undefined || onToggleExpanded) ? (
        <SidebarBrandRow
          $expanded={expanded}
          as={!expanded && onToggleExpanded ? 'button' : 'div'}
          type={!expanded && onToggleExpanded ? 'button' : undefined}
          onClick={!expanded && onToggleExpanded ? onToggleExpanded : undefined}
          aria-label={!expanded && onToggleExpanded ? `Expand ${toggleNoun}` : undefined}
        >
          {brand !== undefined ? <SidebarBrandSlot $expanded={expanded}>{brand}</SidebarBrandSlot> : null}
          {!expanded && onToggleExpanded ? (
            <SidebarHoverExpandOverlay aria-hidden>
              <ExpandIcon />
            </SidebarHoverExpandOverlay>
          ) : null}
          {expanded && onToggleExpanded ? (
            <SidebarToggleButton
              type="button"
              onClick={onToggleExpanded}
              aria-label={`Collapse ${toggleNoun}`}
              title={`Collapse ${toggleNoun}`}
            >
              <CollapseIcon />
            </SidebarToggleButton>
          ) : null}
        </SidebarBrandRow>
      ) : null}
      {topAction !== undefined ? <SidebarTopActionWrap>{topAction}</SidebarTopActionWrap> : null}
      {items && items.length > 0 ? (
        <SidebarNavList aria-label={navLabel}>
          {items.map((item) => (
            <SidebarItemNode key={item.key} item={item} sidebarExpanded={expanded} />
          ))}
        </SidebarNavList>
      ) : null}
      {children}
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
