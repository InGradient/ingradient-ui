import React from 'react'
import styled, { css } from 'styled-components'

const ThemeContext = React.createContext<Record<string, unknown> | null>(null)

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  return <ThemeContext.Provider value={{}}>{children}</ThemeContext.Provider>
}

export const portalPanelSurface = css`
  background: var(--portal-surface-panel);
  border: 1px solid var(--portal-border);
  box-shadow: var(--portal-shadow);
`

export const portalRoundedPanel = css`
  ${portalPanelSurface}
  border-radius: 24px;
  overflow: hidden;
`

export const portalModalSurface = css`
  background: var(--portal-surface-elevated);
  border: 1px solid var(--portal-border);
  box-shadow: 0 30px 80px rgba(0, 0, 0, 0.45);
`

export const portalCardSurface = css`
  background: linear-gradient(180deg, rgba(18, 21, 28, 0.96) 0%, rgba(10, 14, 20, 0.96) 100%);
  border: 1px solid var(--portal-border);
  box-shadow: var(--portal-shadow);
`

export const portalControl = css`
  width: 100%;
  min-width: 0;
  box-sizing: border-box;
  padding: 11px 12px;
  border-radius: 12px;
  border: 1px solid var(--portal-border-strong);
  background: var(--portal-surface-muted);
  color: var(--portal-text-primary);
  line-height: 1.4;
  transition:
    border-color 0.16s ease,
    box-shadow 0.16s ease,
    background-color 0.16s ease;

  &::placeholder {
    color: var(--portal-text-soft);
  }

  &:focus {
    outline: none;
    border-color: rgba(91, 144, 255, 0.7);
    box-shadow: 0 0 0 3px rgba(77, 136, 255, 0.16);
    background: rgba(16, 22, 32, 0.98);
  }

  &:where(select) {
    appearance: none;
    -webkit-appearance: none;
    -moz-appearance: none;
    padding-right: 40px;
    border-radius: 14px;
    background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='10' height='6' viewBox='0 0 10 6' fill='none'%3E%3Cpath d='M1 1L5 5L9 1' stroke='%2398A2B3' stroke-width='1.4' stroke-linecap='round' stroke-linejoin='round'/%3E%3C/svg%3E");
    background-repeat: no-repeat;
    background-position: calc(100% - 16px) center;
    background-size: 10px 6px;
    box-shadow:
      inset 0 1px 0 rgba(255, 255, 255, 0.04),
      0 10px 24px rgba(0, 0, 0, 0.12);
  }
`

export const portalPrimaryButton = css`
  border-radius: 10px;
  border: 1px solid var(--portal-accent-strong);
  background: linear-gradient(135deg, var(--portal-accent) 0%, var(--portal-accent-strong) 100%);
  color: white;
  cursor: pointer;
  transition:
    transform 0.16s ease,
    box-shadow 0.16s ease,
    opacity 0.16s ease;

  &:hover:not(:disabled) {
    transform: translateY(-1px);
    box-shadow: 0 12px 24px rgba(41, 98, 217, 0.24);
  }

  &:disabled {
    opacity: 0.55;
    cursor: not-allowed;
  }
`

export const portalGhostButton = css`
  border-radius: 10px;
  border: 1px solid var(--portal-border);
  background: var(--portal-surface-interactive);
  color: var(--portal-text-secondary);
  cursor: pointer;
  transition:
    background-color 0.16s ease,
    border-color 0.16s ease,
    color 0.16s ease,
    opacity 0.16s ease;

  &:hover:not(:disabled) {
    border-color: rgba(91, 144, 255, 0.38);
    background: rgba(255, 255, 255, 0.07);
    color: var(--portal-text-primary);
  }

  &:disabled {
    opacity: 0.55;
    cursor: not-allowed;
  }
`

export const portalAccentButton = css`
  border-radius: 10px;
  border: 1px solid var(--portal-accent);
  background: rgba(77, 136, 255, 0.12);
  color: var(--portal-accent-soft);
  cursor: pointer;
  transition:
    background-color 0.16s ease,
    color 0.16s ease,
    border-color 0.16s ease,
    opacity 0.16s ease;

  &:hover:not(:disabled) {
    background: rgba(77, 136, 255, 0.18);
    color: var(--portal-text-primary);
  }

  &:disabled {
    opacity: 0.55;
    cursor: not-allowed;
  }
`

export const PortalInput = styled.input`
  ${portalControl}
`

export const PortalTextarea = styled.textarea`
  ${portalControl}
`

export const PortalSelect = styled.select`
  ${portalControl}
`

const PortalDropdownRoot = styled.div`
  position: relative;
  min-width: 0;
`

const PortalDropdownTrigger = styled.button<{ $open: boolean }>`
  ${portalControl}
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  text-align: left;
  cursor: pointer;
  padding-right: 14px;
  border-radius: 16px;
  box-shadow:
    inset 0 1px 0 rgba(255, 255, 255, 0.04),
    0 10px 24px rgba(0, 0, 0, 0.12);

  ${(p) =>
    p.$open &&
    css`
      border-color: rgba(91, 144, 255, 0.7);
      box-shadow:
        0 0 0 3px rgba(77, 136, 255, 0.16),
        0 18px 36px rgba(0, 0, 0, 0.18);
      background: rgba(16, 22, 32, 0.98);
    `}
`

const PortalDropdownValue = styled.span`
  min-width: 0;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
`

const PortalDropdownChevron = styled.span<{ $open: boolean }>`
  width: 28px;
  height: 28px;
  flex-shrink: 0;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  border-radius: 999px;
  background: rgba(255, 255, 255, 0.04);
  border: 1px solid rgba(148, 163, 184, 0.14);
  color: var(--portal-text-soft);
  transition:
    transform 0.16s ease,
    background-color 0.16s ease,
    color 0.16s ease;
  transform: ${(p) => (p.$open ? 'rotate(180deg)' : 'rotate(0deg)')};

  ${PortalDropdownTrigger}:hover & {
    background: rgba(77, 136, 255, 0.12);
    color: var(--portal-accent-soft);
  }
`

interface PortalDropdownMenuLayout {
  left: number
  width: number
  maxHeight: number
  top?: number
  bottom?: number
}

const PortalDropdownMenu = styled.div.attrs<{ $layout: PortalDropdownMenuLayout }>(({ $layout }) => ({
  style: {
    left: `${$layout.left}px`,
    width: `${$layout.width}px`,
    maxHeight: `${$layout.maxHeight}px`,
    ...(typeof $layout.top === 'number' ? { top: `${$layout.top}px` } : {}),
    ...(typeof $layout.bottom === 'number' ? { bottom: `${$layout.bottom}px` } : {}),
  },
}))<{ $layout: PortalDropdownMenuLayout }>`
  position: fixed;
  z-index: 200;
  padding: 10px;
  border-radius: 20px;
  background: linear-gradient(180deg, rgba(18, 24, 34, 0.98) 0%, rgba(10, 14, 20, 0.98) 100%);
  border: 1px solid rgba(148, 163, 184, 0.18);
  box-shadow:
    0 24px 60px rgba(0, 0, 0, 0.34),
    inset 0 1px 0 rgba(255, 255, 255, 0.05);
  backdrop-filter: blur(16px);

  &::before {
    content: '';
    position: absolute;
    inset: 0 0 auto;
    height: 1px;
    background: linear-gradient(
      90deg,
      rgba(255, 255, 255, 0.02),
      rgba(255, 255, 255, 0.16),
      rgba(255, 255, 255, 0.02)
    );
    pointer-events: none;
  }

  overflow-y: auto;
`

const PortalDropdownOptionButton = styled.button<{ $active: boolean }>`
  width: 100%;
  padding: 12px 14px;
  border: 1px solid ${(p) => (p.$active ? 'rgba(91, 144, 255, 0.38)' : 'transparent')};
  border-radius: 14px;
  background: ${(p) => (p.$active ? 'rgba(77, 136, 255, 0.14)' : 'transparent')};
  color: ${(p) => (p.$active ? 'var(--portal-text-primary)' : 'var(--portal-text-secondary)')};
  text-align: left;
  cursor: pointer;
  transition:
    background-color 0.16s ease,
    border-color 0.16s ease,
    color 0.16s ease,
    transform 0.16s ease;

  &:hover {
    border-color: rgba(91, 144, 255, 0.28);
    background: rgba(255, 255, 255, 0.06);
    color: var(--portal-text-primary);
    transform: translateY(-1px);
  }

  &:not(:last-child) {
    margin-bottom: 6px;
  }
`

const PortalDropdownOptionLabel = styled.div`
  font-size: 13px;
  font-weight: 600;
`

const PortalDropdownOptionDescription = styled.div`
  margin-top: 4px;
  font-size: 12px;
  color: var(--portal-text-soft);
`

export interface PortalDropdownOption {
  value: string
  label: string
  description?: string
}

export function PortalDropdownSelect({
  value,
  options,
  onChange,
  disabled = false,
}: {
  value: string
  options: PortalDropdownOption[]
  onChange: (value: string) => void
  disabled?: boolean
}) {
  const [open, setOpen] = React.useState(false)
  const [menuLayout, setMenuLayout] = React.useState<PortalDropdownMenuLayout | null>(null)
  const rootRef = React.useRef<HTMLDivElement | null>(null)
  const updateMenuLayout = React.useCallback(() => {
    const root = rootRef.current
    if (!root) return
    const rect = root.getBoundingClientRect()
    const viewportPadding = 12
    const gap = 10
    const clampedWidth = Math.min(rect.width, window.innerWidth - viewportPadding * 2)
    const clampedLeft = Math.min(
      Math.max(rect.left, viewportPadding),
      window.innerWidth - viewportPadding - clampedWidth
    )
    const spaceBelow = Math.max(140, window.innerHeight - rect.bottom - gap - viewportPadding)
    const spaceAbove = Math.max(140, rect.top - gap - viewportPadding)
    const shouldOpenUpward = window.innerHeight - rect.bottom < 240 && spaceAbove > spaceBelow

    setMenuLayout(
      shouldOpenUpward
        ? {
            left: clampedLeft,
            width: clampedWidth,
            maxHeight: Math.min(360, spaceAbove),
            bottom: window.innerHeight - rect.top + gap,
          }
        : {
            left: clampedLeft,
            width: clampedWidth,
            maxHeight: Math.min(360, spaceBelow),
            top: rect.bottom + gap,
          }
    )
  }, [])

  React.useEffect(() => {
    if (!open) return
    const handlePointerDown = (event: MouseEvent) => {
      if (!rootRef.current?.contains(event.target as Node)) {
        setOpen(false)
      }
    }
    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setOpen(false)
      }
    }
    updateMenuLayout()
    document.addEventListener('mousedown', handlePointerDown)
    document.addEventListener('keydown', handleEscape)
    window.addEventListener('resize', updateMenuLayout)
    window.addEventListener('scroll', updateMenuLayout, true)
    return () => {
      document.removeEventListener('mousedown', handlePointerDown)
      document.removeEventListener('keydown', handleEscape)
      window.removeEventListener('resize', updateMenuLayout)
      window.removeEventListener('scroll', updateMenuLayout, true)
    }
  }, [open, updateMenuLayout])

  const selectedOption = options.find((option) => option.value === value) ?? options[0]

  return (
    <PortalDropdownRoot ref={rootRef}>
      <PortalDropdownTrigger
        type="button"
        $open={open}
        disabled={disabled}
        aria-haspopup="listbox"
        aria-expanded={open}
        onClick={() => setOpen((prev) => !prev)}
      >
        <PortalDropdownValue>{selectedOption?.label ?? ''}</PortalDropdownValue>
        <PortalDropdownChevron $open={open} aria-hidden="true">
          <svg width="10" height="6" viewBox="0 0 10 6" fill="none">
            <path
              d="M1 1L5 5L9 1"
              stroke="currentColor"
              strokeWidth="1.4"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </PortalDropdownChevron>
      </PortalDropdownTrigger>
      {open && menuLayout && (
        <PortalDropdownMenu role="listbox" $layout={menuLayout}>
          {options.map((option) => (
            <PortalDropdownOptionButton
              key={option.value}
              type="button"
              $active={option.value === value}
              onClick={() => {
                onChange(option.value)
                setOpen(false)
              }}
            >
              <PortalDropdownOptionLabel>{option.label}</PortalDropdownOptionLabel>
              {option.description && (
                <PortalDropdownOptionDescription>{option.description}</PortalDropdownOptionDescription>
              )}
            </PortalDropdownOptionButton>
          ))}
        </PortalDropdownMenu>
      )}
    </PortalDropdownRoot>
  )
}

export const PortalButton = styled.button<{ $variant?: 'primary' | 'ghost' | 'accent' }>`
  ${(p) =>
    p.$variant === 'ghost'
      ? portalGhostButton
      : p.$variant === 'accent'
        ? portalAccentButton
        : portalPrimaryButton}
`

export type PortalStatusTone =
  | 'running'
  | 'completed'
  | 'queued'
  | 'draft'
  | 'failed'
  | 'stopped'
  | 'interrupted'
  | 'warning'
  | 'idle'

export const PortalSmallText = styled.span`
  color: var(--portal-text-muted);
  font-size: 12px;
  word-break: break-word;
`

export const PortalEmptyState = styled.div`
  padding: 28px;
  text-align: center;
  color: var(--portal-text-muted);
  font-size: 14px;
`

export const PortalLoadingState = styled(PortalEmptyState)`
  text-align: left;
`

export const PortalStatusPill = styled.span<{ $tone: PortalStatusTone }>`
  padding: 4px 10px;
  border-radius: 999px;
  background: ${(p) =>
    p.$tone === 'running'
      ? 'rgba(43, 181, 114, 0.18)'
      : p.$tone === 'completed'
        ? 'rgba(56, 189, 248, 0.18)'
        : p.$tone === 'queued'
          ? 'rgba(77, 136, 255, 0.18)'
          : p.$tone === 'draft'
            ? 'rgba(255, 196, 61, 0.2)'
            : p.$tone === 'failed'
              ? 'rgba(239, 68, 68, 0.18)'
              : p.$tone === 'stopped'
                ? 'rgba(148, 163, 184, 0.16)'
                : p.$tone === 'interrupted' || p.$tone === 'warning'
                  ? 'rgba(251, 146, 60, 0.18)'
                  : 'rgba(67, 76, 94, 0.22)'};
  color: ${(p) =>
    p.$tone === 'running'
      ? '#9ef0c1'
      : p.$tone === 'completed'
        ? '#8fe6ff'
        : p.$tone === 'queued'
          ? '#a9c6ff'
          : p.$tone === 'draft'
            ? '#ffe08a'
            : p.$tone === 'failed'
              ? '#fca5a5'
              : p.$tone === 'stopped'
                ? '#d5dee9'
                : p.$tone === 'interrupted' || p.$tone === 'warning'
                  ? '#fdba74'
                  : '#cbd5e1'};
  font-size: 11px;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.05em;
`

export const PortalModalBackdrop = styled.div`
  position: fixed;
  inset: 0;
  background: rgba(4, 8, 14, 0.72);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1200;
  padding: 24px;
`

export const PortalModalCard = styled.div`
  ${portalModalSurface}
  width: min(920px, 100%);
  max-height: calc(100vh - 48px);
  overflow: auto;
  border-radius: 24px;
`

export const PortalCompactModalCard = styled(PortalModalCard)`
  width: auto;
  min-width: 320px;
  max-width: min(560px, calc(100vw - 48px));
  padding: 20px;
  border-radius: 16px;
`

export const PortalModalHeader = styled.div`
  padding: 20px 22px 16px;
  border-bottom: 1px solid rgba(255, 255, 255, 0.08);
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 16px;
  flex-wrap: wrap;
`

export const PortalModalTitle = styled.h2`
  margin: 0;
  font-size: 20px;
  font-weight: 700;
`

export const PortalModalActions = styled.div`
  display: flex;
  justify-content: flex-end;
  gap: 8px;
`
