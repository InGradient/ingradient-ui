import { useState, useRef, useEffect } from 'react'
import { createPortal } from 'react-dom'
import styled from 'styled-components'
import { DayPicker } from 'react-day-picker'
import { format, parse, isValid } from 'date-fns'
import { controlField } from '../../primitives'

const Wrap = styled.div`
  position: relative;
`

const Trigger = styled.button`
  ${controlField}
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: var(--ig-space-3);
  text-align: left;
  cursor: pointer;
  border-radius: var(--ig-radius-md);
  min-width: 150px;
`

const Placeholder = styled.span`
  color: var(--ig-color-text-soft);
`

const CalendarIcon = () => (
  <svg width="14" height="14" viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink: 0, opacity: 0.6 }}>
    <rect x="1" y="2" width="12" height="11" rx="2" />
    <path d="M1 5.5h12M4.5 1v2M9.5 1v2" />
  </svg>
)

const Popover = styled.div<{ $top: number; $left: number }>`
  position: fixed;
  top: ${p => p.$top}px;
  left: ${p => p.$left}px;
  z-index: calc(var(--ig-z-modal) + 10);
  border-radius: var(--ig-radius-lg);
  background: linear-gradient(180deg, var(--ig-color-dropdown-menu-a) 0%, var(--ig-color-dropdown-menu-b) 100%);
  border: 1px solid var(--ig-color-border-strong);
  box-shadow: var(--ig-shadow-popover);
  backdrop-filter: blur(16px);
  padding: var(--ig-space-4);

  .rdp-root {
    --rdp-accent-color: var(--ig-color-accent);
    --rdp-accent-background-color: var(--ig-color-accent-soft-surface);
    --rdp-day_button-height: 32px;
    --rdp-day_button-width: 32px;
    font-family: var(--ig-font-sans);
    font-size: var(--ig-font-size-sm);
    color: var(--ig-color-text-primary);
  }

  .rdp-month_caption {
    display: flex;
    align-items: center;
    justify-content: center;
    padding: var(--ig-space-2) 0 var(--ig-space-3);
    font-weight: 600;
    font-size: var(--ig-font-size-sm);
  }

  .rdp-nav {
    display: flex;
    gap: var(--ig-space-2);
  }

  .rdp-button_previous,
  .rdp-button_next {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    width: 28px;
    height: 28px;
    border: none;
    border-radius: var(--ig-radius-sm);
    background: var(--ig-color-surface-interactive);
    color: var(--ig-color-text-primary);
    cursor: pointer;

    svg { color: var(--ig-color-text-primary); }
  }

  .rdp-button_previous:hover,
  .rdp-button_next:hover {
    background: var(--ig-color-surface-active);
    color: var(--ig-color-accent);

    svg { color: var(--ig-color-accent); }
  }

  .rdp-weekday {
    font-size: var(--ig-font-size-xs);
    color: var(--ig-color-text-muted);
    font-weight: 500;
    padding-bottom: var(--ig-space-2);
  }

  .rdp-day {
    border-radius: var(--ig-radius-sm);
  }

  .rdp-day_button {
    border: none;
    background: transparent;
    color: var(--ig-color-text-secondary);
    cursor: pointer;
    border-radius: var(--ig-radius-sm);
    font-size: var(--ig-font-size-sm);
    width: var(--rdp-day_button-width);
    height: var(--rdp-day_button-height);
  }

  .rdp-day_button:hover {
    background: var(--ig-color-surface-interactive);
    color: var(--ig-color-text-primary);
  }

  .rdp-selected .rdp-day_button {
    background: var(--ig-color-accent);
    color: white;
    font-weight: 600;
  }

  .rdp-today .rdp-day_button {
    font-weight: 700;
    color: var(--ig-color-accent);
  }

  .rdp-today.rdp-selected .rdp-day_button {
    color: white;
  }

  .rdp-outside .rdp-day_button {
    color: var(--ig-color-text-muted);
    opacity: 0.4;
  }

  .rdp-disabled .rdp-day_button {
    opacity: 0.3;
    cursor: default;
  }
`

export interface DatePickerProps {
  value: string
  onChange: (value: string) => void
  placeholder?: string
  disabled?: boolean
  className?: string
}

export function DatePickerField({
  value,
  onChange,
  placeholder = 'Select date',
  disabled = false,
  className,
}: DatePickerProps) {
  const [open, setOpen] = useState(false)
  const [pos, setPos] = useState({ top: 0, left: 0 })
  const wrapRef = useRef<HTMLDivElement>(null)

  const selected = value ? parse(value, 'yyyy-MM-dd', new Date()) : undefined
  const displayValue = selected && isValid(selected) ? format(selected, 'yyyy-MM-dd') : ''

  const popoverRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!open) return
    const handleClick = (e: MouseEvent) => {
      if (
        !wrapRef.current?.contains(e.target as Node) &&
        !popoverRef.current?.contains(e.target as Node)
      ) setOpen(false)
    }
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setOpen(false)
    }
    // Calculate fixed position based on trigger rect
    const rect = wrapRef.current?.getBoundingClientRect()
    if (rect) {
      const showAbove = window.innerHeight - rect.bottom < 320 && rect.top > 320
      setPos({
        top: showAbove ? rect.top - 320 : rect.bottom + 6,
        left: rect.left,
      })
    }

    document.addEventListener('mousedown', handleClick)
    document.addEventListener('keydown', handleEsc)
    return () => {
      document.removeEventListener('mousedown', handleClick)
      document.removeEventListener('keydown', handleEsc)
    }
  }, [open])

  const handleSelect = (day: Date | undefined) => {
    if (day) {
      onChange(format(day, 'yyyy-MM-dd'))
    }
    setOpen(false)
  }

  return (
    <Wrap ref={wrapRef} className={className}>
      <Trigger type="button" disabled={disabled} onClick={() => setOpen(!open)}>
        {displayValue || <Placeholder>{placeholder}</Placeholder>}
        <CalendarIcon />
      </Trigger>
      {open && createPortal(
        <Popover ref={popoverRef} $top={pos.top} $left={pos.left}>
          <DayPicker
            mode="single"
            selected={selected}
            onSelect={handleSelect}
            showOutsideDays
          />
        </Popover>,
        document.body,
      )}
    </Wrap>
  )
}
