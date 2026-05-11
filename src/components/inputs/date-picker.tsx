import { useState, useRef, useEffect } from 'react'
import { createPortal } from 'react-dom'
import { DayPicker } from 'react-day-picker'
import { format, parse, isValid } from 'date-fns'
import { Placeholder, Popover, Trigger, Wrap } from './date-picker.styles'

const CalendarIcon = () => (
  <svg width="14" height="14" viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink: 0, opacity: 0.6 }}>
    <rect x="1" y="2" width="12" height="11" rx="2" />
    <path d="M1 5.5h12M4.5 1v2M9.5 1v2" />
  </svg>
)

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
  const popoverRef = useRef<HTMLDivElement>(null)

  const selected = value ? parse(value, 'yyyy-MM-dd', new Date()) : undefined
  const displayValue = selected && isValid(selected) ? format(selected, 'yyyy-MM-dd') : ''

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
    if (day) onChange(format(day, 'yyyy-MM-dd'))
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
