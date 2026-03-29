import React from 'react'
import styled from 'styled-components'
import { ModalBackdrop } from './modal-primitives'
import { DialogCloseButton } from './dialog-close-button'

const Shell = styled.div<{ $width: string; $maxHeight: string }>`
  width: ${(p) => p.$width};
  max-width: calc(100vw - 32px);
  max-height: ${(p) => p.$maxHeight};
  background-color: var(--ig-color-surface-muted);
  border: 1px solid var(--ig-color-border-strong);
  border-radius: var(--ig-radius-lg);
  display: flex;
  flex-direction: column;
  box-shadow: var(--ig-shadow-floating);
  overflow: hidden;
`

const Header = styled.div`
  padding: var(--ig-space-7) var(--ig-space-11);
  border-bottom: 1px solid var(--ig-color-border-subtle);
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-shrink: 0;
`

const Title = styled.h2`
  font-size: var(--ig-font-size-xl);
  font-weight: 600;
  color: var(--ig-color-text-primary);
  margin: 0;
`

const Body = styled.div`
  flex: 1;
  min-height: 0;
  display: flex;
  overflow: hidden;
`

const Sidebar = styled.div`
  width: 190px;
  background-color: var(--ig-color-surface-panel);
  border-right: 1px solid var(--ig-color-border-subtle);
  padding: var(--ig-space-5) 0;
  flex-shrink: 0;
  overflow-y: auto;
`

const MainPanel = styled.div`
  flex: 1;
  padding: var(--ig-space-11);
  overflow-y: auto;
`

export interface SettingsDialogProps {
  title: React.ReactNode
  sidebar?: React.ReactNode
  children: React.ReactNode
  onClose: () => void
  width?: string
  maxHeight?: string
}

export function SettingsDialog({
  title,
  sidebar,
  children,
  onClose,
  width = '820px',
  maxHeight = 'calc(100dvh - 32px)',
}: SettingsDialogProps) {
  return (
    <ModalBackdrop onClick={() => onClose()}>
      <Shell $width={width} $maxHeight={maxHeight} onClick={(e) => e.stopPropagation()}>
        <Header>
          <Title>{title}</Title>
          <DialogCloseButton onClick={onClose} />
        </Header>
        <Body>
          {sidebar && <Sidebar>{sidebar}</Sidebar>}
          <MainPanel>{children}</MainPanel>
        </Body>
      </Shell>
    </ModalBackdrop>
  )
}
