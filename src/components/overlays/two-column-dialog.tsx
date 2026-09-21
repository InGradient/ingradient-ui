import React, { useEffect, useId, useRef } from 'react'
import { createPortal } from 'react-dom'
import styled from 'styled-components'
import { Heading } from '../../primitives'
import { ModalBackdrop } from './modal-primitives'
import { DialogCloseButton } from './dialog-close-button'

const Shell = styled.div<{ $width: string; $height: string | null; $maxHeight: string }>`
  width: ${(p) => p.$width};
  max-width: calc(100vw - var(--ig-space-13));
  ${(p) => (p.$height ? `height: ${p.$height};` : `max-height: ${p.$maxHeight};`)}
  background-color: var(--ig-color-surface-muted);
  border: var(--ig-border-1px) solid var(--ig-color-border-strong);
  border-radius: var(--ig-radius-lg);
  display: flex;
  flex-direction: column;
  box-shadow: var(--ig-shadow-floating);
  overflow: hidden;
`

const Header = styled.div`
  padding: var(--ig-space-7) var(--ig-space-11);
  border-bottom: var(--ig-border-1px) solid var(--ig-color-border-subtle);
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-shrink: 0;
`

const Body = styled.div`
  flex: 1;
  min-height: 0;
  display: flex;
  overflow: hidden;
`

const Sidebar = styled.div<{ $width: string }>`
  width: ${(p) => p.$width};
  background-color: var(--ig-color-surface-panel);
  border-right: var(--ig-border-1px) solid var(--ig-color-border-subtle);
  padding: var(--ig-space-5) 0;
  flex-shrink: 0;
  overflow-y: auto;
`

const MainPanel = styled.div`
  flex: 1;
  padding: var(--ig-space-11);
  overflow-y: auto;
`

export interface TwoColumnDialogProps {
  title: React.ReactNode
  sidebar?: React.ReactNode
  children: React.ReactNode
  onClose: () => void
  width?: string
  /** 고정 높이. 지정 시 dialog 가 항상 같은 높이 (content 와 무관). 미지정 시 max-height fallback. */
  height?: string
  maxHeight?: string
  sidebarWidth?: string
}

export function TwoColumnDialog({
  title,
  sidebar,
  children,
  onClose,
  width = 'var(--ig-popup-3xl-wide)',
  height,
  maxHeight = 'calc(100dvh - var(--ig-space-13))',
  sidebarWidth = 'var(--ig-popup-xs-narrow)',
}: TwoColumnDialogProps) {
  const titleId = useId()
  const shellRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const prevFocus = document.activeElement as HTMLElement | null
    shellRef.current?.focus()
    return () => { if (prevFocus?.isConnected) prevFocus.focus() }
  }, [])

  const onKeyDown = (event: React.KeyboardEvent<HTMLDivElement>) => {
    const shell = shellRef.current
    const target = event.target as HTMLElement
    // React portal events bubble through this shell too. Child overlays own their
    // keys; do not steal focus or Escape from a dropdown or a nested dialog.
    if (!shell || event.defaultPrevented || !shell.contains(target) || target.closest('[role="dialog"]') !== shell) return
    if (event.key === 'Escape') {
      event.preventDefault()
      event.stopPropagation()
      onClose()
    }
    if (event.key === 'Tab') {
      const focusable = Array.from(shell.querySelectorAll<HTMLElement>(
        'button:not([disabled]), [href], input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])',
      )).filter((element) => element.tabIndex >= 0 && !element.closest('[hidden], [inert]') && element.getClientRects().length > 0)
      const first = focusable[0]
      const last = focusable[focusable.length - 1]
      if (!first) {
        event.preventDefault()
        shell.focus()
      } else if (event.shiftKey && (document.activeElement === first || document.activeElement === shell)) {
        event.preventDefault()
        last.focus()
      } else if (!event.shiftKey && (document.activeElement === last || document.activeElement === shell)) {
        event.preventDefault()
        first.focus()
      }
    }
  }

  if (typeof document === 'undefined') return null
  return createPortal(
    <ModalBackdrop onClick={() => onClose()}>
      <Shell
        ref={shellRef}
        $width={width}
        $height={height ?? null}
        $maxHeight={maxHeight}
        onClick={(e) => e.stopPropagation()}
        onKeyDown={onKeyDown}
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        tabIndex={-1}
      >
        <Header>
          <Heading id={titleId} level={2} style={{ fontSize: 'var(--ig-font-size-xl)' }}>{title}</Heading>
          <DialogCloseButton onClick={onClose} />
        </Header>
        <Body>
          {sidebar && <Sidebar $width={sidebarWidth}>{sidebar}</Sidebar>}
          <MainPanel>{children}</MainPanel>
        </Body>
      </Shell>
    </ModalBackdrop>,
    document.body,
  )
}
