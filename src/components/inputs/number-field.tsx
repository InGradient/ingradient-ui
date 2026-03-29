import React, { useState, useCallback, useRef, useEffect } from 'react'
import styled from 'styled-components'
import { controlField } from '../../primitives'

const Wrap = styled.div`
  position: relative;
  display: flex;
  align-items: center;
`

const Input = styled.input`
  ${controlField}
  padding-right: var(--ig-space-13);
  -moz-appearance: textfield;
  &::-webkit-inner-spin-button,
  &::-webkit-outer-spin-button { -webkit-appearance: none; margin: 0; }
`

const SpinnerGroup = styled.div`
  position: absolute;
  right: 1px;
  top: 1px;
  bottom: 1px;
  display: flex;
  flex-direction: column;
  width: 28px;
  border-left: 1px solid var(--ig-color-border-subtle);
`

const SpinBtn = styled.button`
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  background: transparent;
  border: none;
  color: var(--ig-color-text-soft);
  cursor: pointer;
  font-size: 10px;
  line-height: 1;
  padding: 0;
  &:hover { background: var(--ig-color-surface-interactive); color: var(--ig-color-text-primary); }
  &:first-child { border-bottom: 1px solid var(--ig-color-border-subtle); }
  &:disabled { opacity: 0.3; cursor: default; }
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
  parse?: (s: string) => number
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
  disabled, placeholder, format, parse, className, id,
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
    const parsed = parse ? parse(draft) : parseFloat(draft)
    if (Number.isNaN(parsed)) {
      setDraft(format ? format(value) : String(value))
      return
    }
    const clamped = clamp(parsed, min, max)
    onChange(clamped)
    prevValueRef.current = clamped
    setDraft(format ? format(clamped) : String(clamped))
  }, [draft, value, min, max, onChange, format])

  const nudge = useCallback((delta: number) => {
    const next = clamp(value + delta, min, max)
    onChange(next)
  }, [value, min, max, onChange])

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent<HTMLInputElement>) => {
      if (e.key === 'Enter') { commit(); return }
      if (e.key === 'ArrowUp' || e.key === 'ArrowDown') {
        e.preventDefault()
        nudge(e.key === 'ArrowUp' ? step : -step)
      }
    },
    [commit, nudge, step],
  )

  return (
    <Wrap className={className}>
      <Input
        id={id}
        type="text"
        inputMode="decimal"
        value={draft}
        disabled={disabled}
        placeholder={placeholder}
        onChange={(e) => setDraft(e.target.value)}
        onBlur={commit}
        onKeyDown={handleKeyDown}
      />
      {!disabled && (
        <SpinnerGroup>
          <SpinBtn type="button" tabIndex={-1} aria-label="Increase"
            disabled={max !== undefined && value >= max}
            onClick={() => nudge(step)}>&#9650;</SpinBtn>
          <SpinBtn type="button" tabIndex={-1} aria-label="Decrease"
            disabled={min !== undefined && value <= min}
            onClick={() => nudge(-step)}>&#9660;</SpinBtn>
        </SpinnerGroup>
      )}
    </Wrap>
  )
}
