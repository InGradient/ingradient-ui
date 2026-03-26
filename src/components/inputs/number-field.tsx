import React, { useState, useCallback, useRef, useEffect } from 'react'
import styled from 'styled-components'
import { controlField } from '../../primitives'

const Input = styled.input`
  ${controlField}
  -moz-appearance: textfield;
  &::-webkit-inner-spin-button,
  &::-webkit-outer-spin-button { -webkit-appearance: none; margin: 0; }
`

export interface NumberFieldProps {
  value: number
  onChange: (v: number) => void
  min?: number
  max?: number
  step?: number
  disabled?: boolean
  placeholder?: string
  format?: (v: number) => string
  className?: string
  id?: string
}

function clamp(v: number, min?: number, max?: number): number {
  let n = v
  if (min !== undefined && n < min) n = min
  if (max !== undefined && n > max) n = max
  return n
}

export function NumberField({
  value, onChange, min, max, step = 1,
  disabled, placeholder, format, className, id,
}: NumberFieldProps) {
  const [draft, setDraft] = useState(() => format ? format(value) : String(value))
  const prevValueRef = useRef(value)

  useEffect(() => {
    if (prevValueRef.current !== value) {
      setDraft(format ? format(value) : String(value))
      prevValueRef.current = value
    }
  }, [value, format])

  const commit = useCallback(() => {
    const parsed = parseFloat(draft)
    if (Number.isNaN(parsed)) {
      setDraft(format ? format(value) : String(value))
      return
    }
    const clamped = clamp(parsed, min, max)
    onChange(clamped)
    prevValueRef.current = clamped
    setDraft(format ? format(clamped) : String(clamped))
  }, [draft, value, min, max, onChange, format])

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent<HTMLInputElement>) => {
      if (e.key === 'Enter') { commit(); return }
      if (e.key === 'ArrowUp' || e.key === 'ArrowDown') {
        e.preventDefault()
        const delta = e.key === 'ArrowUp' ? step : -step
        const next = clamp(value + delta, min, max)
        onChange(next)
      }
    },
    [commit, value, step, min, max, onChange],
  )

  return (
    <Input
      id={id}
      className={className}
      type="text"
      inputMode="decimal"
      value={draft}
      disabled={disabled}
      placeholder={placeholder}
      onChange={(e) => setDraft(e.target.value)}
      onBlur={commit}
      onKeyDown={handleKeyDown}
    />
  )
}
