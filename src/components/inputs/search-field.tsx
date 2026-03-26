import React, { useCallback, useRef } from 'react'
import styled from 'styled-components'
import { controlField } from '../../primitives'

const Wrap = styled.div<{ $size: 'sm' | 'md' }>`
  position: relative;
  display: flex;
  align-items: center;
  width: 100%;
`

const Input = styled.input<{ $size: 'sm' | 'md' }>`
  ${controlField}
  padding-left: calc(var(--ig-space-5) + 20px);
  padding-right: calc(var(--ig-space-5) + 20px);
  ${(p) => p.$size === 'sm' && 'padding-top: var(--ig-space-3); padding-bottom: var(--ig-space-3); font-size: var(--ig-font-size-sm);'}
`

const IconLeft = styled.span`
  position: absolute;
  left: var(--ig-space-4);
  display: flex;
  pointer-events: none;
  color: var(--ig-color-text-soft);
`

const ClearBtn = styled.button`
  position: absolute;
  right: var(--ig-space-3);
  display: flex;
  align-items: center;
  justify-content: center;
  width: 20px;
  height: 20px;
  border: none;
  border-radius: var(--ig-radius-xs);
  background: transparent;
  color: var(--ig-color-text-soft);
  cursor: pointer;
  &:hover { color: var(--ig-color-text-primary); }
`

export interface SearchFieldProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'type' | 'size'> {
  onClear?: () => void
  size?: 'sm' | 'md'
}

export function SearchField({ onClear, size = 'md', value, ...rest }: SearchFieldProps) {
  const ref = useRef<HTMLInputElement>(null)
  const showClear = onClear && value && String(value).length > 0

  const handleClear = useCallback(() => {
    onClear?.()
    ref.current?.focus()
  }, [onClear])

  return (
    <Wrap $size={size}>
      <IconLeft>
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="11" cy="11" r="8" /><path d="m21 21-4.3-4.3" />
        </svg>
      </IconLeft>
      <Input ref={ref} type="search" $size={size} value={value} {...rest} />
      {showClear && (
        <ClearBtn type="button" onClick={handleClear} aria-label="Clear search">
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
            <path d="M18 6 6 18" /><path d="m6 6 12 12" />
          </svg>
        </ClearBtn>
      )}
    </Wrap>
  )
}
