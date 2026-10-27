import type { ReactNode } from 'react'

export interface PlatformNavItem {
  /** Stable key the app maps to and from its routes. */
  key: string
  label: string
  icon: ReactNode
  /** Real URL for the row, so middle-click and "open in new tab" work. */
  href?: string
}

export interface PlatformAppShellProps {
  /** Key of the current page. The app derives it from its router. */
  activeKey: string
  /** Called when a menu row is clicked; the app performs the navigation. */
  onNavigate?: (key: string) => void
  /** Menu rows. Defaults to Dashboard, Catalog, and Classes. */
  items?: PlatformNavItem[]
  /** Current project shown in the project switcher row. */
  projectName?: string
  onOpenProjects?: () => void
  onOpenSettings?: () => void
  onSignOut?: () => void
  /**
   * Controlled sidebar state. Omit to let the shell decide: expanded at 1440px and wider,
   * collapsed below so workspace pages keep enough room for their own side panels.
   */
  expanded?: boolean
  defaultExpanded?: boolean
  onExpandedChange?: (expanded: boolean) => void
  /** The current page view (Dashboard, Catalog, ClassManage, …). */
  children: ReactNode
}
