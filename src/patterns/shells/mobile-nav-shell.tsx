import { type MouseEvent, type ReactNode } from 'react'
import styled from 'styled-components'
import { Menu, X } from 'lucide-react'
import { media } from '../../tokens'

const AppHeader = styled.header`
  display: none;
  ${media.md} {
    display: flex;
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    height: 52px;
    z-index: 100;
    align-items: center;
    gap: var(--ig-space-3);
    padding: 0 var(--ig-space-4);
    background: var(--ig-color-surface-header);
    border-bottom: 1px solid var(--ig-color-border-subtle);
    backdrop-filter: blur(14px);
  }
`

const HamburgerBtn = styled.button`
  background: none;
  border: none;
  color: var(--ig-color-text-primary);
  cursor: pointer;
  padding: var(--ig-space-2);
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: var(--ig-radius-md);
  &:hover { background: var(--ig-color-white-08); }
  svg { width: 22px; height: 22px; }
`

const HeaderTitle = styled.div`
  flex: 1;
  font-size: var(--ig-font-size-md);
  font-weight: 700;
  color: var(--ig-color-text-primary);
  display: flex;
  align-items: center;
  gap: var(--ig-space-2);
`

const Backdrop = styled.div<{ $visible: boolean }>`
  display: none;
  ${media.md} {
    display: block;
    position: fixed;
    inset: 0;
    background: var(--ig-color-modal-backdrop);
    z-index: 110;
    opacity: ${(p) => (p.$visible ? 1 : 0)};
    pointer-events: ${(p) => (p.$visible ? 'auto' : 'none')};
    transition: opacity 0.22s ease;
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
    border-bottom: 1px solid var(--ig-color-border-subtle);
    box-shadow: 0 16px 48px var(--ig-color-modal-backdrop);
    z-index: 120;
    transform: translateY(${(p) => (p.$open ? '0' : '-105%')});
    transition: transform 0.28s cubic-bezier(0.4, 0, 0.2, 1);
    padding-bottom: env(safe-area-inset-bottom, var(--ig-space-0));
    border-radius: 0 0 var(--ig-radius-xl) var(--ig-radius-xl);
  }
`

const DrawerHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: var(--ig-space-5) var(--ig-space-6) var(--ig-space-4);
  border-bottom: 1px solid var(--ig-color-white-07);
`

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
    font-weight: 700;
    max-width: 160px;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }
`

const CloseBtn = styled.button`
  background: none;
  border: none;
  color: var(--ig-color-text-muted);
  cursor: pointer;
  padding: var(--ig-space-2);
  display: flex;
  align-items: center;
  border-radius: var(--ig-radius-md);
  &:hover {
    color: var(--ig-color-text-primary);
    background: var(--ig-color-white-08);
  }
  svg { width: 20px; height: 20px; }
`

const Section = styled.nav`
  padding: var(--ig-space-3) var(--ig-space-4);
  display: flex;
  flex-direction: column;
  gap: 2px;
`

const BottomSection = styled.div`
  padding: var(--ig-space-3) var(--ig-space-4);
  display: flex;
  flex-direction: column;
  gap: 2px;
`

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
  font-weight: 500;
  text-align: left;
  cursor: pointer;
  transition: background 0.15s, color 0.15s;
  &:hover {
    color: var(--ig-color-text-primary);
    background: var(--ig-color-white-07);
  }
  svg { width: 22px; height: 22px; flex-shrink: 0; }
`

const Divider = styled.div`
  height: 1px;
  background: var(--ig-color-white-07);
  margin: var(--ig-space-1) var(--ig-space-4);
`

const Badge = styled.span`
  margin-left: auto;
  min-width: 20px;
  height: 20px;
  padding: 0 var(--ig-space-2);
  border-radius: var(--ig-radius-pill);
  background: var(--ig-color-danger);
  color: var(--ig-color-text-primary);
  font-size: 11px;
  font-weight: 700;
  display: flex;
  align-items: center;
  justify-content: center;
`

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
        <HamburgerBtn type="button" aria-label="Open menu" onClick={onOpen}>
          {hamburgerIcon ?? <Menu size={22} />}
        </HamburgerBtn>
        <HeaderTitle>
          {appHeaderBrand}
          {appHeaderTitle}
        </HeaderTitle>
      </AppHeader>

      <Backdrop $visible={open} onClick={onClose} />
      <DrawerPanel
        $open={open}
        role="dialog"
        aria-modal="true"
        aria-label="Navigation menu"
        className={className}
      >
        <DrawerHeader>
          <DrawerTitleRow type="button" onClick={onDrawerTitleClick}>
            {drawerBrand}
            {drawerTitle ? <span>{drawerTitle}</span> : null}
            {drawerTitleIcon}
          </DrawerTitleRow>
          <CloseBtn type="button" aria-label="Close menu" onClick={onClose}>
            {closeIcon ?? <X size={20} />}
          </CloseBtn>
        </DrawerHeader>

        <Section aria-label={navLabel}>
          {mainItems.map((it) => (
            <Item key={it.key} type="button" $active={it.active} onClick={it.onClick}>
              {it.icon}
              <span>{it.label}</span>
              {it.badge != null && it.badge > 0 ? <Badge>{it.badge}</Badge> : null}
            </Item>
          ))}
        </Section>

        <Divider />

        <BottomSection>
          {bottomItems.map((it) => (
            <Item key={it.key} type="button" $active={it.active} onClick={it.onClick}>
              {it.icon}
              <span>{it.label}</span>
              {it.badge != null && it.badge > 0 ? <Badge>{it.badge}</Badge> : null}
            </Item>
          ))}
        </BottomSection>
      </DrawerPanel>
    </>
  )
}
