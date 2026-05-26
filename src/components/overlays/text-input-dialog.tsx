import { useEffect, useRef, type KeyboardEvent } from 'react'
import { Button } from '../inputs/button'
import { TextField } from '../inputs/text-fields'
import { DialogShell } from './dialog-shell'

const INPUT_STYLE = { marginBottom: 'var(--ig-space-7)' }

export interface TextInputDialogProps {
  open: boolean
  value: string
  onChange: (value: string) => void
  onClose: () => void
  onConfirm: () => void
  title?: string
  placeholder?: string
  confirmLabel?: string
  cancelLabel?: string
  autoFocus?: boolean
  /** Confirm 버튼 비활성화 조건 — 기본 trim 후 빈 문자열. */
  isInvalid?: (value: string) => boolean
}

/**
 * Single text input + Confirm/Cancel 의 dialog.
 * Enter = Confirm, Escape = Close.
 * Class / dataset / tag 등 단순 이름 입력에 generic.
 */
export function TextInputDialog({
  open, value, onChange, onClose, onConfirm,
  title = 'Name',
  placeholder = 'Enter name',
  confirmLabel = 'Add',
  cancelLabel = 'Cancel',
  autoFocus = true,
  isInvalid,
}: TextInputDialogProps) {
  const inputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    if (open && autoFocus) {
      const t = window.setTimeout(() => inputRef.current?.focus(), 30)
      return () => window.clearTimeout(t)
    }
  }, [open, autoFocus])

  if (!open) return null

  const invalid = isInvalid ? isInvalid(value) : !value.trim()

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && !invalid) onConfirm()
    if (e.key === 'Escape') onClose()
  }

  return (
    <DialogShell
      title={title}
      onClose={onClose}
      width="360px"
      actions={
        <>
          <Button type="button" size="sm" variant="secondary" onClick={onClose}>{cancelLabel}</Button>
          <Button type="button" size="sm" variant="accent" onClick={onConfirm} disabled={invalid}>{confirmLabel}</Button>
        </>
      }
    >
      <TextField
        ref={inputRef}
        size="sm"
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        onKeyDown={handleKeyDown}
        placeholder={placeholder}
        aria-label={title}
        style={INPUT_STYLE}
      />
    </DialogShell>
  )
}
