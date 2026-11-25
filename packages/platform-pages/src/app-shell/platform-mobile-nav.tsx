import { BrandMark, brandAssets } from '@ingradient/ui/brand'
import {
  BellIcon,
  CommentIcon,
  FolderIcon,
  MobileNavShell,
  SettingsIcon,
  UserCircleIcon,
  type MobileNavShellItem,
} from '@ingradient/ui/components'
import { iconSizeNumbers } from '@ingradient/ui/tokens'
import { defaultPlatformNavItems } from './PlatformAppShell'
import type { PlatformNavItem } from './types'

const ROW_ICON_SIZE = iconSizeNumbers.xl

export interface PlatformMobileNavProps {
  /** Controlled drawer state. The app closes the drawer when it navigates or opens something. */
  open: boolean
  onOpen: () => void
  onClose: () => void
  /** Key of the current page, as in `PlatformAppShell`. */
  activeKey: string
  onNavigate: (key: string) => void
  /** Menu rows. Defaults to Dashboard, Catalog, and Classes. */
  items?: PlatformNavItem[]
  projectName?: string
  onOpenProjects?: () => void
  /** Unseen notice count shown as a badge on the Notice row. */
  noticeCount?: number
  /** Bottom rows render only when their handler is provided, in the same order as the desktop shell. */
  onOpenNotices?: () => void
  onOpenComments?: () => void
  onOpenSettings?: () => void
  /** Receives the pressed row. The row unmounts with the drawer, so keep the drawer open while a menu is anchored to it. */
  onOpenUser?: (anchor: HTMLElement) => void
}

/**
 * Mobile counterpart of `PlatformAppShell`'s sidebar: a fixed top header and a drawer with the same
 * rows. It renders no page area; mobile page views keep their own layout below the header.
 */
export function PlatformMobileNav({
  open, onOpen, onClose, activeKey, onNavigate, items = defaultPlatformNavItems,
  projectName, onOpenProjects, noticeCount = 0, onOpenNotices, onOpenComments, onOpenSettings, onOpenUser,
}: PlatformMobileNavProps) {
  const mainItems: MobileNavShellItem[] = items.map((item) => ({
    key: item.key,
    label: item.label,
    icon: item.icon,
    active: item.key === activeKey,
    onClick: () => onNavigate(item.key),
  }))

  const bottomItems: MobileNavShellItem[] = [
    ...(onOpenNotices ? [{ key: 'notice', label: 'Notice', icon: <BellIcon size={ROW_ICON_SIZE} aria-hidden />, badge: noticeCount, onClick: () => onOpenNotices() }] : []),
    ...(onOpenComments ? [{ key: 'comment', label: 'Comment', icon: <CommentIcon size={ROW_ICON_SIZE} aria-hidden />, onClick: () => onOpenComments() }] : []),
    ...(onOpenSettings ? [{ key: 'settings', label: 'Settings', icon: <SettingsIcon size={ROW_ICON_SIZE} aria-hidden />, onClick: () => onOpenSettings() }] : []),
    ...(onOpenUser ? [{ key: 'user', label: 'User', icon: <UserCircleIcon size={ROW_ICON_SIZE} aria-hidden />, onClick: (event: React.MouseEvent<HTMLButtonElement>) => onOpenUser(event.currentTarget) }] : []),
  ]

  return (
    <MobileNavShell
      open={open}
      onOpen={onOpen}
      onClose={onClose}
      appHeaderBrand={<BrandMark src={brandAssets.appIcon} size={iconSizeNumbers['3xl']} alt="" />}
      appHeaderTitle="Ingradient"
      drawerBrand={<BrandMark src={brandAssets.appIcon} size={iconSizeNumbers['3xl']} alt="" />}
      drawerTitle={projectName}
      drawerTitleIcon={projectName !== undefined ? <FolderIcon size={iconSizeNumbers.md} aria-hidden /> : undefined}
      onDrawerTitleClick={onOpenProjects}
      mainItems={mainItems}
      bottomItems={bottomItems}
      navLabel="Main"
    />
  )
}
