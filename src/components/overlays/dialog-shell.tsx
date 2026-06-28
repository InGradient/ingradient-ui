import React, { useEffect, useId, useRef } from 'react'
import styled from 'styled-components'

const FOCUSABLE = 'button:not([disabled]), [href], input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])'
import { B3 } from '../../primitives'
import { Button } from '../inputs/button'
import { DialogCloseButton } from './dialog-close-button'
import { ModalActions, ModalBackdrop, ModalCard, ModalHeader, ModalTitle } from './modal-primitives'
import type { ButtonVariant } from '../shared/button-types'

const DialogContent = styled.div`
  padding: var(--ig-space-9) var(--ig-space-10) var(--ig-space-10);
  display: flex;
  flex-direction: column;
  gap: var(--ig-space-7);
  flex: 1;
  min-height: 0;
  overflow-y: auto;
`

const DIALOG_DESCRIPTION_STYLE = { margin: 0, lineHeight: 'var(--ig-line-height-loose)' }

export function DialogShell({
  title,
  description,
  children,
  actions,
  onClose,
  width = 'min(var(--ig-popup-3xl-mid), 100%)',
  height,
}: {
  title: React.ReactNode
  description?: React.ReactNode
  children?: React.ReactNode
  actions?: React.ReactNode
  onClose?: () => void
  width?: string | number
  height?: string | number
}) {
  const titleId = useId()
  const cardRef = useRef<HTMLDivElement>(null)

  // 열릴 때 다이얼로그로 포커스 이동, 닫힐 때 원래 위치로 복원.
  useEffect(() => {
    const prevFocus = document.activeElement as HTMLElement | null
    cardRef.current?.focus()
    return () => prevFocus?.focus?.()
  }, [])

  // Escape 닫기 + Tab 포커스 트랩(다이얼로그 밖으로 못 나가게).
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && onClose) {
        e.stopPropagation()
        onClose()
        return
      }
      if (e.key === 'Tab') {
        const card = cardRef.current
        if (!card) return
        const f = Array.from(card.querySelectorAll<HTMLElement>(FOCUSABLE)).filter((el) => el.offsetParent !== null)
        if (f.length === 0) {
          e.preventDefault()
          card.focus()
          return
        }
        const first = f[0]
        const last = f[f.length - 1]
        if (e.shiftKey && document.activeElement === first) {
          e.preventDefault()
          last.focus()
        } else if (!e.shiftKey && document.activeElement === last) {
          e.preventDefault()
          first.focus()
        }
      }
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [onClose])
  return (
    <ModalBackdrop onClick={() => onClose?.()}>
      <ModalCard
        ref={cardRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        tabIndex={-1}
        onClick={(event) => event.stopPropagation()}
        style={{ width, ...(height ? { height } : {}) }}
      >
        <ModalHeader>
          <ModalTitle id={titleId}>{title}</ModalTitle>
          {onClose ? <DialogCloseButton onClick={() => onClose()} /> : null}
        </ModalHeader>
        <DialogContent>
          {description ? <B3 as="p" tone="muted" style={DIALOG_DESCRIPTION_STYLE}>{description}</B3> : null}
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
      width="min(var(--ig-popup-2xl-wide), 100%)"
      actions={
        <>
          <Button type="button" variant="secondary" onClick={onCancel}>{cancelLabel}</Button>
          <Button type="button" variant={confirmVariant} tone={danger ? 'danger' : 'default'} onClick={onConfirm}>{confirmLabel}</Button>
        </>
      }
    />
  )
}
