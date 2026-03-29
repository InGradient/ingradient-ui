import React from 'react'
import styled from 'styled-components'
import { Button } from '../inputs/button'
import { DialogCloseButton } from './dialog-close-button'
import { ModalActions, ModalBackdrop, ModalCard, ModalHeader, ModalTitle } from './modal-primitives'
import type { ButtonVariant } from '../shared/button-types'

const DialogContent = styled.div`
  padding: var(--ig-space-9) var(--ig-space-10) var(--ig-space-10);
  display: flex;
  flex-direction: column;
  gap: var(--ig-space-7);
`

const DialogDescription = styled.p`
  margin: 0;
  font-size: var(--ig-font-size-sm);
  line-height: 1.6;
  color: var(--ig-color-text-muted);
`

export function DialogShell({
  title,
  description,
  children,
  actions,
  onClose,
  width = 'min(720px, 100%)',
}: {
  title: React.ReactNode
  description?: React.ReactNode
  children?: React.ReactNode
  actions?: React.ReactNode
  onClose?: () => void
  width?: string | number
}) {
  return (
    <ModalBackdrop onClick={() => onClose?.()}>
      <ModalCard onClick={(event) => event.stopPropagation()} style={{ width }}>
        <ModalHeader>
          <ModalTitle>{title}</ModalTitle>
          {onClose ? <DialogCloseButton onClick={() => onClose()} /> : null}
        </ModalHeader>
        <DialogContent>
          {description ? <DialogDescription>{description}</DialogDescription> : null}
          {children}
          {actions ? <ModalActions>{actions}</ModalActions> : null}
        </DialogContent>
      </ModalCard>
    </ModalBackdrop>
  )
}

export function ConfirmDialog({
  title,
  description,
  confirmLabel = 'Confirm',
  cancelLabel = 'Cancel',
  onConfirm,
  onCancel,
  confirmVariant = 'solid',
  danger = false,
}: {
  title: React.ReactNode
  description: React.ReactNode
  confirmLabel?: React.ReactNode
  cancelLabel?: React.ReactNode
  onConfirm: () => void
  onCancel: () => void
  confirmVariant?: ButtonVariant
  danger?: boolean
}) {
  return (
    <DialogShell
      title={title}
      description={description}
      onClose={onCancel}
      width="min(520px, 100%)"
      actions={
        <>
          <Button type="button" variant="secondary" onClick={onCancel}>{cancelLabel}</Button>
          <Button type="button" variant={confirmVariant} tone={danger ? 'danger' : 'default'} onClick={onConfirm}>{confirmLabel}</Button>
        </>
      }
    />
  )
}
