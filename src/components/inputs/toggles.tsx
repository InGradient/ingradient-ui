import React from 'react'
import styled from 'styled-components'

const ToggleLabel = styled.label`
  display: inline-flex;
  align-items: center;
  gap: var(--ig-space-3);
  color: var(--ig-color-text-secondary);
  font-size: var(--ig-font-size-sm);
  cursor: pointer;
  user-select: none;
`

const SwitchTrack = styled.span<{ $checked: boolean }>`
  width: 40px;
  height: 24px;
  border-radius: var(--ig-radius-pill);
  background: ${(p) => (p.$checked ? 'var(--ig-color-toggle-on-bg)' : 'var(--ig-color-toggle-off-bg)')};
  border: 1px solid ${(p) => (p.$checked ? 'var(--ig-color-toggle-on-border)' : 'var(--ig-color-toggle-off-border)')};
  position: relative;
  transition: background-color var(--ig-motion-fast);

  &::after {
    content: '';
    position: absolute;
    top: 2px;
    left: ${(p) => (p.$checked ? '18px' : '2px')};
    width: 18px;
    height: 18px;
    border-radius: var(--ig-radius-pill);
    background: white;
    transition: left var(--ig-motion-fast);
  }
`

export function Checkbox({
  label,
  ...props
}: React.InputHTMLAttributes<HTMLInputElement> & { label?: React.ReactNode }) {
  return (
    <ToggleLabel>
      <input type="checkbox" {...props} />
      {label}
    </ToggleLabel>
  )
}

export function Radio({
  label,
  ...props
}: React.InputHTMLAttributes<HTMLInputElement> & { label?: React.ReactNode }) {
  return (
    <ToggleLabel>
      <input type="radio" {...props} />
      {label}
    </ToggleLabel>
  )
}

export function Switch({
  checked = false,
  label,
  ...props
}: Omit<React.InputHTMLAttributes<HTMLInputElement>, 'type'> & { label?: React.ReactNode }) {
  return (
    <ToggleLabel>
      <input type="checkbox" checked={checked} {...props} style={{ display: 'none' }} />
      <SwitchTrack $checked={checked} />
      {label}
    </ToggleLabel>
  )
}
