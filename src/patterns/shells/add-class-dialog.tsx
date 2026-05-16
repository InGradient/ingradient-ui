import { useEffect, useRef, type KeyboardEvent } from 'react'
import styled from 'styled-components'
import { Button } from '../../components/inputs/button'
import { TextField } from '../../components/inputs/text-fields'
import { DialogShell } from '../../components/overlays/dialog-shell'

const Input = styled(TextField).attrs({ size: 'sm' as const })`
  margin-bottom: 16px;
`

export interface AddClassDialogProps {
  open: boolean
  name: string
  onChangeName: (value: string) => void
  onClose: () => void
  onConfirm: () => void
  title?: string
  placeholder?: string
  confirmLabel?: string
  cancelLabel?: string
  autoFocus?: boolean
}

export function AddClassDialog({
  open, name, onChangeName, onClose, onConfirm,
  title = 'Class name',
  placeholder = 'Enter class name',
  confirmLabel = 'Add',
  cancelLabel = 'Cancel',
  autoFocus = true,
}: AddClassDialogProps) {
  const inputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    if (open && autoFocus) {
      const t = window.setTimeout(() => inputRef.current?.focus(), 30)
      return () => window.clearTimeout(t)
    }
  }, [open, autoFocus])

  if (!open) return null

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') onConfirm()
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
          <Button type="button" size="sm" variant="accent" onClick={onConfirm} disabled={!name.trim()}>{confirmLabel}</Button>
        </>
      }
    >
      <Input
        ref={inputRef}
        type="text"
        value={name}
        onChange={(e) => onChangeName(e.target.value)}
        onKeyDown={handleKeyDown}
        placeholder={placeholder}
        aria-label={title}
      />
    </DialogShell>
  )
}
