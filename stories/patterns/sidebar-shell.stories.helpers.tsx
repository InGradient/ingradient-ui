import React from 'react'
import type { SidebarShellAction, SidebarShellItem } from '../../src/patterns'

export function DashboardIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
      <rect x="3" y="3" width="7" height="9" rx="1.4" />
      <rect x="14" y="3" width="7" height="5" rx="1.4" />
      <rect x="14" y="12" width="7" height="9" rx="1.4" />
      <rect x="3" y="16" width="7" height="5" rx="1.4" />
    </svg>
  )
}
export function CatalogIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
      <rect x="3" y="4" width="18" height="16" rx="2" /><path d="M3 9h18" />
    </svg>
  )
}
export function ClassesIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
      <circle cx="12" cy="12" r="8" /><path d="M4 12h16M12 4v16" />
    </svg>
  )
}
export function FolderIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
      <path d="M3 7a2 2 0 0 1 2-2h4l2 2h8a2 2 0 0 1 2 2v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
    </svg>
  )
}
export function NoticeIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
      <path d="M18 8a6 6 0 0 0-12 0c0 7-3 7-3 9h18c0-2-3-2-3-9Z" /><path d="M10 21h4" />
    </svg>
  )
}
export function SettingsIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
      <circle cx="12" cy="12" r="3" />
      <path d="M19.4 15a1.7 1.7 0 0 0 .3 1.8l.1.1a2 2 0 1 1-2.8 2.8l-.1-.1a1.7 1.7 0 0 0-1.8-.3 1.7 1.7 0 0 0-1 1.5V21a2 2 0 0 1-4 0v-.2a1.7 1.7 0 0 0-1-1.5 1.7 1.7 0 0 0-1.8.3l-.1.1A2 2 0 1 1 4.4 16.9l.1-.1a1.7 1.7 0 0 0 .3-1.8 1.7 1.7 0 0 0-1.5-1H3a2 2 0 0 1 0-4h.2a1.7 1.7 0 0 0 1.5-1 1.7 1.7 0 0 0-.3-1.8l-.1-.1A2 2 0 1 1 7.1 4.4l.1.1a1.7 1.7 0 0 0 1.8.3 1.7 1.7 0 0 0 1-1.5V3a2 2 0 0 1 4 0v.2a1.7 1.7 0 0 0 1 1.5 1.7 1.7 0 0 0 1.8-.3l.1-.1a2 2 0 1 1 2.8 2.8l-.1.1a1.7 1.7 0 0 0-.3 1.8c.2.6.7 1 1.3 1.1H21a2 2 0 0 1 0 4h-.2a1.7 1.7 0 0 0-1.4 1Z" />
    </svg>
  )
}

export function BrandMark() {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 8, color: 'var(--ig-color-text-primary)', fontWeight: 700, fontSize: 14 }}>
      <span style={{ width: 28, height: 28, borderRadius: 8, background: 'linear-gradient(135deg, var(--ig-color-accent), var(--ig-color-info))' }} />
      <span>Ingradient</span>
    </div>
  )
}

export function FakeNavLink({ to, className, children, ...rest }: { to?: string; className?: string; children?: React.ReactNode; [k: string]: unknown }) {
  const isActive = to === '/catalog'
  return (
    <a href={to ?? '#'} className={isActive ? 'active' : className} aria-current={isActive ? 'page' : undefined} {...rest}>
      {children}
    </a>
  )
}

export function ProjectButton({ expanded }: { expanded: boolean }) {
  return (
    <button
      type="button"
      aria-label="Select project"
      title="Select project"
      style={{
        width: '100%', padding: '12px 18px', border: 'none', background: 'none',
        color: 'var(--ig-color-text-muted)', fontSize: 14, cursor: 'pointer',
        display: 'flex', alignItems: 'center',
        justifyContent: expanded ? 'flex-start' : 'center',
        gap: 10, textAlign: 'left',
      }}
    >
      <FolderIcon />
      {expanded ? <span style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>Defect Inspection A</span> : null}
    </button>
  )
}

export const baseItems: SidebarShellItem[] = [
  { key: 'dashboard', to: '/dashboard', title: 'Dashboard', label: 'Dashboard', icon: <DashboardIcon /> },
  { key: 'catalog', to: '/catalog', title: 'Catalog', label: 'Catalog', icon: <CatalogIcon />, linkComponent: FakeNavLink as React.ElementType },
  { key: 'classes', to: '/classes', title: 'Classes', label: 'Classes', icon: <ClassesIcon /> },
]

export const baseActions: SidebarShellAction[] = [
  { key: 'notice', title: 'Notice', label: 'Notice', icon: <NoticeIcon /> },
  { key: 'settings', title: 'Settings', label: 'Settings', icon: <SettingsIcon /> },
]
