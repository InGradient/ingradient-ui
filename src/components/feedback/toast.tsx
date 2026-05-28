import React, { createContext, useCallback, useContext, useEffect, useRef, useState } from 'react'
import styled, { css, keyframes } from 'styled-components'
import { alertToneStyles } from '../../tokens/semantic/states'

// ── Toast item ───────────────────────────────────────────────────────────────

export type ToastTone = keyof typeof alertToneStyles
export interface ToastAction {
  label: string
  onClick: () => void
}
export interface ToastItem {
  id: string
  message: React.ReactNode
  tone?: ToastTone
  duration?: number
  action?: ToastAction
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
  border: var(--ig-border-1px) solid;
  border-radius: var(--ig-radius-md);
  font-size: var(--ig-font-size-sm);
  box-shadow: var(--ig-shadow-floating);
  pointer-events: auto;
  animation: ${({ $leaving }) => ($leaving ? slideOut : slideIn)} var(--ig-motion-normal) forwards;
  max-width: var(--ig-popup-lg);
  word-break: break-word;
  display: flex;
  align-items: center;
  gap: var(--ig-space-3);
`

const Message = styled.span`
  flex: 1;
`

const ActionButton = styled.button`
  flex-shrink: 0;
  background: transparent;
  border: var(--ig-border-1px) solid currentColor;
  border-radius: var(--ig-radius-sm);
  color: inherit;
  font: inherit;
  padding: var(--ig-space-2px) var(--ig-space-3);
  cursor: pointer;
  opacity: var(--ig-opacity-loud);
  &:hover { opacity: 1; }
`

const CloseButton = styled.button`
  flex-shrink: 0;
  background: transparent;
  border: none;
  color: inherit;
  font-size: var(--ig-font-size-xl);
  line-height: var(--ig-line-height-none);
  padding: 0 var(--ig-space-2px);
  cursor: pointer;
  opacity: var(--ig-opacity-overlay);
  &:hover { opacity: 1; }
`

const Container = styled.div`
  position: fixed;
  bottom: var(--ig-space-6, 24px);
  right: var(--ig-space-6, 24px);
  z-index: var(--ig-z-toast, 9000);
  display: flex;
  flex-direction: column-reverse;
  gap: var(--ig-space-3, var(--ig-space-3));
  pointer-events: none;
`

// ── Context + Provider ───────────────────────────────────────────────────────

type ToastFn = (message: React.ReactNode, opts?: { tone?: ToastTone; duration?: number; action?: ToastAction }) => void

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
    setItems((prev) => [...prev, { id, message, tone: opts?.tone ?? 'info', duration: opts?.duration ?? DEFAULT_DURATION, action: opts?.action }])
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
  const duration = item.duration ?? DEFAULT_DURATION
  const persistent = duration <= 0 || !Number.isFinite(duration)

  useEffect(() => {
    if (leaving || persistent) return
    const timer = setTimeout(() => onDismiss(item.id), duration)
    return () => clearTimeout(timer)
  }, [item.id, duration, persistent, leaving, onDismiss])

  return (
    <Item $tone={item.tone ?? 'info'} $leaving={leaving} role="alert">
      <Message>{item.message}</Message>
      {item.action && (
        <ActionButton
          type="button"
          onClick={(e) => {
            e.stopPropagation()
            item.action!.onClick()
            onDismiss(item.id)
          }}
        >
          {item.action.label}
        </ActionButton>
      )}
      <CloseButton type="button" aria-label="Dismiss" onClick={() => onDismiss(item.id)}>
        ×
      </CloseButton>
    </Item>
  )
}
