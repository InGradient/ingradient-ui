import React, { createContext, useCallback, useContext, useEffect, useRef, useState } from 'react'
import styled, { css, keyframes } from 'styled-components'
import { alertToneStyles } from '../../tokens/variants'

// ── Toast item ───────────────────────────────────────────────────────────────

export type ToastTone = keyof typeof alertToneStyles
export interface ToastItem {
  id: string
  message: React.ReactNode
  tone?: ToastTone
  duration?: number
}

const slideIn = keyframes`
  from { opacity: 0; transform: translateY(12px); }
  to   { opacity: 1; transform: translateY(0); }
`

const slideOut = keyframes`
  from { opacity: 1; transform: translateY(0); }
  to   { opacity: 0; transform: translateY(12px); }
`

const Item = styled.div<{ $tone: ToastTone; $leaving: boolean }>`
  ${({ $tone }) => css`
    background: ${alertToneStyles[$tone].background};
    border-color: ${alertToneStyles[$tone].border};
    color: ${alertToneStyles[$tone].color};
  `}
  padding: var(--ig-space-4) var(--ig-space-6);
  border: 1px solid;
  border-radius: var(--ig-radius-md);
  font-size: var(--ig-font-size-sm);
  box-shadow: var(--ig-shadow-floating, 0 4px 16px rgba(0,0,0,.12));
  pointer-events: auto;
  animation: ${({ $leaving }) => ($leaving ? slideOut : slideIn)} 200ms ease forwards;
  max-width: 420px;
  word-break: break-word;
`

const Container = styled.div`
  position: fixed;
  bottom: var(--ig-space-6, 24px);
  right: var(--ig-space-6, 24px);
  z-index: var(--ig-z-toast, 9000);
  display: flex;
  flex-direction: column-reverse;
  gap: var(--ig-space-3, 8px);
  pointer-events: none;
`

// ── Context + Provider ───────────────────────────────────────────────────────

type ToastFn = (message: React.ReactNode, opts?: { tone?: ToastTone; duration?: number }) => void

const ToastContext = createContext<ToastFn>(() => {})

export function useToast(): ToastFn {
  return useContext(ToastContext)
}

let _nextId = 0

const DEFAULT_DURATION = 4000

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<ToastItem[]>([])
  const leavingRef = useRef<Set<string>>(new Set())

  const toast: ToastFn = useCallback((message, opts) => {
    const id = String(++_nextId)
    setItems((prev) => [...prev, { id, message, tone: opts?.tone ?? 'info', duration: opts?.duration ?? DEFAULT_DURATION }])
  }, [])

  const dismiss = useCallback((id: string) => {
    leavingRef.current.add(id)
    setItems((prev) => [...prev]) // trigger re-render
    setTimeout(() => {
      leavingRef.current.delete(id)
      setItems((prev) => prev.filter((t) => t.id !== id))
    }, 200)
  }, [])

  return (
    <ToastContext.Provider value={toast}>
      {children}
      <Container>
        {items.map((item) => (
          <ToastEntry key={item.id} item={item} leaving={leavingRef.current.has(item.id)} onDismiss={dismiss} />
        ))}
      </Container>
    </ToastContext.Provider>
  )
}

// ── Individual toast entry (handles auto-dismiss timer) ──────────────────────

function ToastEntry({
  item,
  leaving,
  onDismiss,
}: {
  item: ToastItem
  leaving: boolean
  onDismiss: (id: string) => void
}) {
  useEffect(() => {
    if (leaving) return
    const timer = setTimeout(() => onDismiss(item.id), item.duration ?? DEFAULT_DURATION)
    return () => clearTimeout(timer)
  }, [item.id, item.duration, leaving, onDismiss])

  return (
    <Item $tone={item.tone ?? 'info'} $leaving={leaving} onClick={() => onDismiss(item.id)} role="alert">
      {item.message}
    </Item>
  )
}
