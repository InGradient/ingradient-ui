import React, { createContext, useCallback, useContext, useMemo, useRef, useState } from 'react'
import { ConfirmDialog } from './dialog-shell'

interface ConfirmOptions {
  title: React.ReactNode
  description?: React.ReactNode
  confirmLabel?: React.ReactNode
  cancelLabel?: React.ReactNode
  danger?: boolean
}

type ConfirmFn = (options: ConfirmOptions) => Promise<boolean>

const ConfirmContext = createContext<ConfirmFn | null>(null)

export function useConfirm(): ConfirmFn {
  const ctx = useContext(ConfirmContext)
  if (!ctx) {
    throw new Error('useConfirm must be used within a ConfirmProvider')
  }
  return ctx
}

interface PendingState {
  options: ConfirmOptions
  resolve: (value: boolean) => void
}

export function ConfirmProvider({ children }: { children: React.ReactNode }) {
  const [pending, setPending] = useState<PendingState | null>(null)
  const pendingRef = useRef<PendingState | null>(null)
  pendingRef.current = pending

  const confirm = useCallback<ConfirmFn>((options) => {
    return new Promise<boolean>((resolve) => {
      setPending({ options, resolve })
    })
  }, [])

  const close = useCallback((value: boolean) => {
    const current = pendingRef.current
    if (current) {
      current.resolve(value)
      setPending(null)
    }
  }, [])

  const value = useMemo(() => confirm, [confirm])

  return (
    <ConfirmContext.Provider value={value}>
      {children}
      {pending ? (
        <ConfirmDialog
          title={pending.options.title}
          description={pending.options.description ?? ''}
          confirmLabel={pending.options.confirmLabel ?? 'Confirm'}
          cancelLabel={pending.options.cancelLabel ?? 'Cancel'}
          danger={pending.options.danger ?? false}
          onConfirm={() => close(true)}
          onCancel={() => close(false)}
        />
      ) : null}
    </ConfirmContext.Provider>
  )
}
