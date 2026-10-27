import React, { createContext, forwardRef, useContext, useMemo, useState } from 'react'
import { BrandMark, brandAssets } from '@ingradient/ui/brand'
import {
  FolderIcon,
  GridIcon,
  ImageIcon,
  LogOutIcon,
  SettingsIcon,
  TagIcon,
} from '@ingradient/ui/components'
import { SidebarShell, type SidebarShellAction, type SidebarShellItem } from '@ingradient/ui/patterns'
import { iconSizeNumbers } from '@ingradient/ui/tokens'
import { BrandRow, ProjectButton, ShellMain, ShellRoot } from './PlatformAppShell.styles'
import type { PlatformAppShellProps, PlatformNavItem } from './types'

/** Width at which the sidebar starts expanded when the app does not control it. */
export const PLATFORM_SIDEBAR_EXPAND_MIN_WIDTH = 1440

export const defaultPlatformNavItems: PlatformNavItem[] = [
  { key: 'dashboard', label: 'Dashboard', icon: <GridIcon size={iconSizeNumbers.md} aria-hidden />, href: '/dashboard' },
  { key: 'catalog', label: 'Catalog', icon: <ImageIcon size={iconSizeNumbers.md} aria-hidden />, href: '/catalog' },
  { key: 'classes', label: 'Classes', icon: <TagIcon size={iconSizeNumbers.md} aria-hidden />, href: '/classes' },
]

interface NavContextValue {
  activeKey: string
  onNavigate?: (key: string) => void
  hrefOf: (key: string) => string
}

const NavContext = createContext<NavContextValue>({ activeKey: '', hrefOf: () => '#' })

/**
 * Router-agnostic row link: the shell marks the active row with aria-current and hands clicks to
 * the app's onNavigate, so the package never imports a router.
 */
const ShellNavLink = forwardRef<HTMLAnchorElement, React.AnchorHTMLAttributes<HTMLAnchorElement> & { to?: string }>(
  function ShellNavLink({ to = '', onClick, ...rest }, ref) {
    const { activeKey, onNavigate, hrefOf } = useContext(NavContext)
    return (
      <a
        ref={ref}
        {...rest}
        href={hrefOf(to)}
        aria-current={to === activeKey ? 'page' : undefined}
        onClick={(event) => {
          onClick?.(event)
          if (!onNavigate || event.defaultPrevented) return
          // Keep modifier-clicks (new tab/window) as normal browser navigation.
          if (event.metaKey || event.ctrlKey || event.shiftKey || event.altKey || event.button !== 0) return
          event.preventDefault()
          onNavigate(to)
        }}
      />
    )
  },
)

function initialExpanded(defaultExpanded?: boolean): boolean {
  if (defaultExpanded !== undefined) return defaultExpanded
  if (typeof window === 'undefined' || !window.matchMedia) return true
  return window.matchMedia(`(min-width: ${PLATFORM_SIDEBAR_EXPAND_MIN_WIDTH}px)`).matches
}

/**
 * Platform app frame: the app-wide sidebar plus the page area. Render it once at the route-layout
 * level so the sidebar keeps its state while pages change. Page views stay router-free; the app
 * passes the active key and performs navigation.
 */
export function PlatformAppShell({
  activeKey,
  onNavigate,
  items = defaultPlatformNavItems,
  projectName,
  onOpenProjects,
  onOpenSettings,
  onSignOut,
  expanded: expandedProp,
  defaultExpanded,
  onExpandedChange,
  children,
}: PlatformAppShellProps) {
  const [expandedState, setExpandedState] = useState(() => initialExpanded(defaultExpanded))
  const expanded = expandedProp ?? expandedState
  const toggle = () => {
    const next = !expanded
    if (expandedProp === undefined) setExpandedState(next)
    onExpandedChange?.(next)
  }

  const nav = useMemo<NavContextValue>(() => {
    const hrefs = new Map(items.map((item) => [item.key, item.href ?? '#']))
    return { activeKey, onNavigate, hrefOf: (key) => hrefs.get(key) ?? '#' }
  }, [activeKey, onNavigate, items])

  const shellItems: SidebarShellItem[] = items.map((item) => ({
    key: item.key,
    title: item.label,
    label: item.label,
    icon: item.icon,
    to: item.key,
    linkComponent: ShellNavLink,
  }))

  const actions: SidebarShellAction[] = [
    ...(onOpenSettings ? [{ key: 'settings', title: 'Settings', label: 'Settings', icon: <SettingsIcon size={iconSizeNumbers.md} aria-hidden />, onClick: () => onOpenSettings() }] : []),
    ...(onSignOut ? [{ key: 'sign-out', title: 'Sign out', label: 'Sign out', icon: <LogOutIcon size={iconSizeNumbers.md} aria-hidden />, onClick: () => onSignOut() }] : []),
  ]

  return (
    <NavContext.Provider value={nav}>
      <ShellRoot data-ig-component="PlatformAppShell" data-ig-layer="pages">
        <SidebarShell
          expanded={expanded}
          onToggleExpanded={toggle}
          navLabel="Main"
          label="App sidebar"
          brand={
            <BrandRow>
              <BrandMark src={brandAssets.appIcon} size={iconSizeNumbers['3xl']} alt={expanded ? '' : 'Ingradient'} />
              {expanded ? <span>Ingradient</span> : null}
            </BrandRow>
          }
          topAction={
            projectName !== undefined ? (
              <ProjectButton
                type="button"
                onClick={onOpenProjects}
                aria-label={`Project: ${projectName}`}
                title={projectName}
              >
                <FolderIcon size={iconSizeNumbers.md} aria-hidden />
                {expanded ? <span>{projectName}</span> : null}
              </ProjectButton>
            ) : undefined
          }
          items={shellItems}
          actions={actions}
        />
        <ShellMain>{children}</ShellMain>
      </ShellRoot>
    </NavContext.Provider>
  )
}
