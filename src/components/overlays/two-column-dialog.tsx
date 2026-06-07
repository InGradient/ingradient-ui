import React from 'react'
import styled from 'styled-components'
import { H4 } from '../../primitives'
import { ModalBackdrop } from './modal-primitives'
import { DialogCloseButton } from './dialog-close-button'

const Shell = styled.div<{ $width: string; $maxHeight: string }>`
  width: ${(p) => p.$width};
  max-width: calc(100vw - var(--ig-space-13));
  max-height: ${(p) => p.$maxHeight};
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
  maxHeight?: string
  sidebarWidth?: string
}

export function TwoColumnDialog({
  title,
  sidebar,
  children,
  onClose,
  width = 'var(--ig-popup-3xl-wide)',
  maxHeight = 'calc(100dvh - var(--ig-space-13))',
  sidebarWidth = 'var(--ig-popup-xs-narrow)',
}: TwoColumnDialogProps) {
  return (
    <ModalBackdrop onClick={() => onClose()}>
      <Shell $width={width} $maxHeight={maxHeight} onClick={(e) => e.stopPropagation()}>
        <Header>
          <H4>{title}</H4>
          <DialogCloseButton onClick={onClose} />
        </Header>
        <Body>
          {sidebar && <Sidebar $width={sidebarWidth}>{sidebar}</Sidebar>}
          <MainPanel>{children}</MainPanel>
        </Body>
      </Shell>
    </ModalBackdrop>
  )
}
