import { type MouseEvent, type ReactNode } from 'react'
import styled from 'styled-components'
import { Menu, X } from 'lucide-react'
import { media } from '../../tokens'
import { Inline, Stack } from '../../primitives'
import { IconButton } from '../inputs/icon-button'

const AppHeader = styled.header`
  display: none;
  ${media.md} {
    display: flex;
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    height: 52px;
    z-index: var(--ig-z-dropdown);
    align-items: center;
    gap: var(--ig-space-3);
    padding: 0 var(--ig-space-4);
    background: var(--ig-color-surface-header);
    border-bottom: var(--ig-border-1px) solid var(--ig-color-border-subtle);
    backdrop-filter: blur(14px);
  }
`

const HEADER_TITLE_STYLE = {
  flex: 1,
  fontSize: 'var(--ig-font-size-md)',
  fontWeight: 'var(--ig-font-weight-bold)',
  color: 'var(--ig-color-text-primary)',
}

const Backdrop = styled.div<{ $visible: boolean }>`
  display: none;
  ${media.md} {
    display: block;
    position: fixed;
    inset: 0;
    background: var(--ig-color-modal-backdrop);
    z-index: var(--ig-z-mobile-nav-backdrop);
    opacity: ${(p) => (p.$visible ? 1 : 0)};
    pointer-events: ${(p) => (p.$visible ? 'auto' : 'none')};
    transition: opacity var(--ig-motion-normal);
  }
`

const DrawerPanel = styled.aside<{ $open: boolean }>`
  display: none;
  ${media.md} {
    display: flex;
    flex-direction: column;
    position: fixed;
    inset: 0 0 auto 0;
    max-height: 85vh;
    overflow-y: auto;
    background: var(--ig-color-surface-header);
    border-bottom: var(--ig-border-1px) solid var(--ig-color-border-subtle);
    box-shadow: var(--ig-shadow-drawer-lift);
    z-index: var(--ig-z-mobile-nav);
    transform: translateY(${(p) => (p.$open ? '0' : '-105%')});
    /* Material standard ease — slow tier 의 360ms ease 보다 specific 한 곡선 의도 */
    transition: transform 0.28s cubic-bezier(0.4, 0, 0.2, 1);
    padding-bottom: env(safe-area-inset-bottom, var(--ig-space-0));
    border-radius: 0 0 var(--ig-radius-xl) var(--ig-radius-xl);
  }
`

const DRAWER_HEADER_STYLE = {
  padding: 'var(--ig-space-5) var(--ig-space-6) var(--ig-space-4)',
  borderBottom: '1px solid var(--ig-color-white-07)',
}

const DrawerTitleRow = styled.button`
  display: flex;
  align-items: center;
  gap: var(--ig-space-3);
  background: none;
  border: none;
  cursor: pointer;
  padding: 0;
  color: var(--ig-color-text-primary);
  span {
    font-size: var(--ig-font-size-md);
    font-weight: var(--ig-font-weight-bold);
    max-width: 160px;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }
`

const SECTION_STYLE = { padding: 'var(--ig-space-3) var(--ig-space-4)', gap: 'var(--ig-space-2px)' }

const Item = styled.button<{ $active?: boolean }>`
  display: flex;
  align-items: center;
  gap: var(--ig-space-4);
  height: 52px;
  width: 100%;
  padding: 0 var(--ig-space-4);
  border-radius: var(--ig-radius-lg);
  border: none;
  background: ${(p) => (p.$active ? 'var(--ig-color-blue-tint-16)' : 'none')};
  color: ${(p) => (p.$active ? 'var(--ig-color-accent-soft)' : 'var(--ig-color-text-muted)')};
  font-size: var(--ig-font-size-md);
  font-weight: var(--ig-font-weight-medium);
  text-align: left;
  cursor: pointer;
  transition: background var(--ig-motion-fast), color var(--ig-motion-fast);
  &:hover {
    color: var(--ig-color-text-primary);
    background: var(--ig-color-white-07);
  }
  svg { width: 22px; height: 22px; flex-shrink: 0; }
`

const DIVIDER_STYLE = {
  height: 1,
  background: 'var(--ig-color-white-07)',
  margin: 'var(--ig-space-1) var(--ig-space-4)',
}

const BADGE_STYLE = {
  marginLeft: 'auto',
  minWidth: 20,
  height: 20,
  padding: '0 var(--ig-space-2)',
  borderRadius: 'var(--ig-radius-pill)',
  background: 'var(--ig-color-danger)',
  color: 'var(--ig-color-text-primary)',
  fontSize: 'var(--ig-font-size-2xs)',
  fontWeight: 'var(--ig-font-weight-bold)',
  display: 'flex' as const,
  alignItems: 'center' as const,
  justifyContent: 'center' as const,
}

export interface MobileNavShellItem {
  key: string
  label: string
  icon: ReactNode
  active?: boolean
  /** When provided and > 0, shown as a red badge at row end. */
  badge?: number
  onClick: (event: MouseEvent<HTMLButtonElement>) => void
}

export interface MobileNavShellProps {
  open: boolean
  onOpen: () => void
  onClose: () => void

  /** App header brand element (left of title in fixed top header). */
  appHeaderBrand: ReactNode
  /** App header title text shown beside brand. */
  appHeaderTitle?: ReactNode
  /** App header hamburger icon (default: lucide Menu). */
  hamburgerIcon?: ReactNode

  /** Drawer header brand element (shown above project title button). */
  drawerBrand: ReactNode
  /** Drawer title button label — typically current project name. */
  drawerTitle?: string
  /** Drawer title icon (folder etc) appended after label. */
  drawerTitleIcon?: ReactNode
  /** Click handler for drawer title row — typically opens project modal. */
  onDrawerTitleClick?: () => void
  /** Close icon (default: lucide X). */
  closeIcon?: ReactNode

  /** Main navigation rows. */
  mainItems: MobileNavShellItem[]
  /** Bottom action rows (notice / comment / settings / user etc). */
  bottomItems: MobileNavShellItem[]

  /** aria-label for the main nav section. */
  navLabel?: string
  className?: string
}

/**
 * Mobile app shell: fixed top header with hamburger + drop-down drawer with
 * main nav and bottom actions. Platform 의 SidebarShell 의 mobile counterpart.
 *
 * Items are configured via `mainItems` / `bottomItems` props — same pattern
 * as `SidebarShell` (icon + label + onClick + optional active/badge).
 */
export function MobileNavShell({
  open,
  onOpen,
  onClose,
  appHeaderBrand,
  appHeaderTitle,
  hamburgerIcon,
  drawerBrand,
  drawerTitle,
  drawerTitleIcon,
  onDrawerTitleClick,
  closeIcon,
  mainItems,
  bottomItems,
  navLabel = 'Main navigation',
  className,
}: MobileNavShellProps) {
  return (
    <>
      <AppHeader>
        <IconButton variant="secondary" type="button" aria-label="Open menu" onClick={onOpen}>
          {hamburgerIcon ?? <Menu size={22} />}
        </IconButton>
        <Inline gap={2} style={HEADER_TITLE_STYLE}>
          {appHeaderBrand}
          {appHeaderTitle}
        </Inline>
      </AppHeader>

      <Backdrop $visible={open} onClick={onClose} />
      <DrawerPanel
        $open={open}
        role="dialog"
        aria-modal="true"
        aria-label="Navigation menu"
        className={className}
      >
        <Inline justify="space-between" style={DRAWER_HEADER_STYLE}>
          <DrawerTitleRow type="button" onClick={onDrawerTitleClick}>
            {drawerBrand}
            {drawerTitle ? <span>{drawerTitle}</span> : null}
            {drawerTitleIcon}
          </DrawerTitleRow>
          <IconButton variant="secondary" size="sm" type="button" aria-label="Close menu" onClick={onClose}>
            {closeIcon ?? <X size={20} />}
          </IconButton>
        </Inline>

        <Stack as="nav" gap={0} aria-label={navLabel} style={SECTION_STYLE}>
          {mainItems.map((it) => (
            <Item key={it.key} type="button" $active={it.active} onClick={it.onClick}>
              {it.icon}
              <span>{it.label}</span>
              {it.badge != null && it.badge > 0 ? <span style={BADGE_STYLE}>{it.badge}</span> : null}
            </Item>
          ))}
        </Stack>

        <div style={DIVIDER_STYLE} />

        <Stack gap={0} style={SECTION_STYLE}>
          {bottomItems.map((it) => (
            <Item key={it.key} type="button" $active={it.active} onClick={it.onClick}>
              {it.icon}
              <span>{it.label}</span>
              {it.badge != null && it.badge > 0 ? <span style={BADGE_STYLE}>{it.badge}</span> : null}
            </Item>
          ))}
        </Stack>
      </DrawerPanel>
    </>
  )
}
