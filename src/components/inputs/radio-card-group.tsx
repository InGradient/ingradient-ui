import styled from 'styled-components'

const Stack = styled.div`
  display: flex;
  flex-direction: column;
  gap: var(--ig-space-2);
`

const OptionBtn = styled.button<{ $active: boolean }>`
  width: 100%;
  padding: var(--ig-space-3) var(--ig-space-5);
  text-align: left;
  border-radius: var(--ig-radius-md);
  border: var(--ig-border-1px) solid
    ${(p) => (p.$active ? 'var(--ig-color-accent)' : 'var(--ig-color-border-subtle)')};
  background: ${(p) =>
    p.$active ? 'var(--ig-color-accent-soft-surface)' : 'var(--ig-color-surface-muted)'};
  color: ${(p) => (p.$active ? 'var(--ig-color-accent)' : 'var(--ig-color-text-primary)')};
  font-size: var(--ig-font-size-sm);
  font-weight: ${(p) => (p.$active ? 'var(--ig-font-weight-semibold)' : 'var(--ig-font-weight-regular)')};
  font-family: inherit;
  cursor: pointer;
  transition:
    border-color var(--ig-motion-fast),
    background-color var(--ig-motion-fast),
    color var(--ig-motion-fast);

  &:hover:not(:disabled) {
    border-color: var(--ig-color-accent);
  }

  &:disabled {
    opacity: var(--ig-opacity-faded);
    cursor: not-allowed;
  }
`

export interface RadioCardGroupOption {
  value: string
  label: string
  disabled?: boolean
}

export interface RadioCardGroupProps {
  options: RadioCardGroupOption[]
  value: string
  onChange: (value: string) => void
  className?: string
}

export function RadioCardGroup({ options, value, onChange, className }: RadioCardGroupProps) {
  return (
    <Stack className={className} role="radiogroup">
      {options.map((opt) => (
        <OptionBtn
          key={opt.value}
          type="button"
          role="radio"
          aria-checked={opt.value === value}
          $active={opt.value === value}
          disabled={opt.disabled}
          onClick={() => !opt.disabled && onChange(opt.value)}
        >
          {opt.label}
        </OptionBtn>
      ))}
    </Stack>
  )
}
