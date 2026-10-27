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
  width: var(--ig-size-switch-track-width);
  height: var(--ig-size-switch-track-height);
  border-radius: var(--ig-radius-pill);
  background: ${(p) => (p.$checked ? 'var(--ig-color-toggle-on-bg)' : 'var(--ig-color-toggle-off-bg)')};
  border: var(--ig-border-1px) solid ${(p) => (p.$checked ? 'var(--ig-color-toggle-on-border)' : 'var(--ig-color-toggle-off-border)')};
  position: relative;
  transition: background-color var(--ig-motion-fast);

  input:focus-visible + & {
    outline: var(--ig-border-2px) solid var(--ig-color-accent-ring);
    outline-offset: var(--ig-space-2px);
  }

  &::after {
    content: '';
    position: absolute;
    top: calc((var(--ig-size-switch-track-height) - 2 * var(--ig-border-1px) - var(--ig-size-switch-thumb)) / 2);
    left: ${(p) => (p.$checked ? 'calc(100% - var(--ig-size-switch-thumb) - calc((var(--ig-size-switch-track-height) - 2 * var(--ig-border-1px) - var(--ig-size-switch-thumb)) / 2))' : 'calc((var(--ig-size-switch-track-height) - 2 * var(--ig-border-1px) - var(--ig-size-switch-thumb)) / 2)')};
    width: var(--ig-size-switch-thumb);
    height: var(--ig-size-switch-thumb);
    border-radius: var(--ig-radius-pill);
    background: var(--ig-color-on-accent);
    transition: left var(--ig-motion-fast);
  }
`

const HiddenInput = styled.input`
  position: absolute;
  opacity: 0;
  width: 0;
  height: 0;
  pointer-events: none;
`

const CheckboxBox = styled.span<{ $checked: boolean; $disabled?: boolean }>`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: var(--ig-size-checkbox);
  height: var(--ig-size-checkbox);
  border-radius: var(--ig-radius-2xs);
  border: var(--ig-border-2px) solid ${(p) => (p.$checked ? 'var(--ig-color-accent)' : 'var(--ig-color-border-strong)')};
  background: ${(p) => (p.$checked ? 'var(--ig-color-accent)' : 'transparent')};
  transition: background-color var(--ig-motion-fast), border-color var(--ig-motion-fast);
  flex-shrink: 0;
  opacity: ${(p) => (p.$disabled ? 'var(--ig-opacity-disabled)' : 1)};

  input:focus-visible + & {
    outline: var(--ig-border-2px) solid var(--ig-color-accent-ring);
    outline-offset: var(--ig-space-2px);
  }

  svg {
    width: var(--ig-icon-xs);
    height: var(--ig-icon-xs);
    stroke: var(--ig-color-on-accent);
    stroke-width: var(--ig-svg-stroke-bold);
    fill: none;
    opacity: ${(p) => (p.$checked ? 1 : 0)};
    transition: opacity var(--ig-motion-fast);
  }
`

const RadioDot = styled.span<{ $checked: boolean; $disabled?: boolean }>`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: var(--ig-size-radio);
  height: var(--ig-size-radio);
  border-radius: var(--ig-radius-pill);
  border: var(--ig-border-2px) solid ${(p) => (p.$checked ? 'var(--ig-color-accent)' : 'var(--ig-color-border-strong)')};
  background: transparent;
  transition: border-color var(--ig-motion-fast);
  flex-shrink: 0;
  opacity: ${(p) => (p.$disabled ? 'var(--ig-opacity-disabled)' : 1)};

  input:focus-visible + & {
    outline: var(--ig-border-2px) solid var(--ig-color-accent-ring);
    outline-offset: var(--ig-space-2px);
  }

  &::after {
    content: '';
    width: var(--ig-size-radio-dot);
    height: var(--ig-size-radio-dot);
    border-radius: var(--ig-radius-pill);
    background: var(--ig-color-accent);
    opacity: ${(p) => (p.$checked ? 1 : 0)};
    transition: opacity var(--ig-motion-fast);
  }
`

export const Checkbox = React.forwardRef<
  HTMLInputElement,
  React.InputHTMLAttributes<HTMLInputElement> & {
    label?: React.ReactNode
    indeterminate?: boolean
    'data-ig-component'?: string
    'data-ig-label'?: string
    'data-ig-slot'?: string
  }
>(function Checkbox({
  label,
  checked,
  disabled,
  indeterminate,
  'data-ig-component': componentHint,
  'data-ig-label': componentLabel,
  'data-ig-slot': slotHint,
  ...props
}, ref) {
  const componentName = 'Checkbox'
  const slotName = slotHint ?? (componentHint && componentHint !== componentName ? componentHint : undefined)
  const innerRef = React.useRef<HTMLInputElement>(null)
  React.useImperativeHandle(ref, () => innerRef.current!)
  React.useEffect(() => {
    if (innerRef.current) innerRef.current.indeterminate = !!indeterminate
  }, [indeterminate])

  const visual = indeterminate ? 'indeterminate' : !!checked
  const labelText = typeof label === 'string' ? label : undefined
  const summaryLabel = componentLabel ?? props['aria-label'] ?? labelText

  return (
    <ToggleLabel
      data-ig-component={componentName}
      data-ig-layer="components"
      data-ig-slot={slotName}
      data-ig-kind="checkbox"
      data-ig-label={summaryLabel}
    >
      <HiddenInput ref={innerRef} type="checkbox" checked={checked} disabled={disabled} {...props} />
      <CheckboxBox $checked={!!visual} $disabled={disabled}>
        {indeterminate ? (
          <svg viewBox="0 0 12 12"><line x1="2" y1="6" x2="10" y2="6" /></svg>
        ) : (
          <svg viewBox="0 0 12 12"><polyline points="2 6 5 9 10 3" /></svg>
        )}
      </CheckboxBox>
      {label}
    </ToggleLabel>
  )
})

export const Radio = React.forwardRef<
  HTMLInputElement,
  React.InputHTMLAttributes<HTMLInputElement> & {
    label?: React.ReactNode
    'data-ig-component'?: string
    'data-ig-label'?: string
    'data-ig-slot'?: string
  }
>(function Radio({
  label,
  checked,
  disabled,
  'data-ig-component': componentHint,
  'data-ig-label': componentLabel,
  'data-ig-slot': slotHint,
  ...props
}, ref) {
  const componentName = 'Radio'
  const slotName = slotHint ?? (componentHint && componentHint !== componentName ? componentHint : undefined)
  const labelText = typeof label === 'string' ? label : undefined
  return (
    <ToggleLabel
      data-ig-component={componentName}
      data-ig-layer="components"
      data-ig-slot={slotName}
      data-ig-kind="radio"
      data-ig-label={componentLabel ?? props['aria-label'] ?? labelText}
    >
      <HiddenInput ref={ref} type="radio" checked={checked} disabled={disabled} {...props} />
      <RadioDot $checked={!!checked} $disabled={disabled} />
      {label}
    </ToggleLabel>
  )
})

export const Switch = React.forwardRef<
  HTMLInputElement,
  Omit<React.InputHTMLAttributes<HTMLInputElement>, 'type'> & {
    label?: React.ReactNode
    'data-ig-component'?: string
    'data-ig-label'?: string
    'data-ig-slot'?: string
  }
>(function Switch({
  checked = false,
  label,
  'data-ig-component': componentHint,
  'data-ig-label': componentLabel,
  'data-ig-slot': slotHint,
  ...props
}, ref) {
  const componentName = 'Switch'
  const slotName = slotHint ?? (componentHint && componentHint !== componentName ? componentHint : undefined)
  const labelText = typeof label === 'string' ? label : undefined
  return (
    <ToggleLabel
      data-ig-component={componentName}
      data-ig-layer="components"
      data-ig-slot={slotName}
      data-ig-kind="switch"
      data-ig-label={componentLabel ?? props['aria-label'] ?? labelText}
    >
      <HiddenInput ref={ref} type="checkbox" checked={checked} {...props} />
      <SwitchTrack $checked={checked} />
      {label}
    </ToggleLabel>
  )
})
