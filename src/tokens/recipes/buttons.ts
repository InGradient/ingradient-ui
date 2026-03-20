import { css } from 'styled-components'

export const buttonPrimary = css`
  border-radius: var(--ig-radius-sm);
  border: 1px solid var(--ig-color-accent-strong);
  background: linear-gradient(135deg, var(--ig-color-accent) 0%, var(--ig-color-accent-strong) 100%);
  color: white;
  cursor: pointer;
  transition:
    transform var(--ig-motion-fast),
    box-shadow var(--ig-motion-fast),
    opacity var(--ig-motion-fast);

  &:hover:not(:disabled) {
    transform: translateY(-1px);
    box-shadow: var(--ig-shadow-hover-lift);
  }

  &:disabled {
    opacity: 0.55;
    cursor: not-allowed;
  }
`

export const buttonSecondary = css`
  border-radius: var(--ig-radius-sm);
  border: 1px solid var(--ig-color-border-subtle);
  background: var(--ig-color-surface-interactive);
  color: var(--ig-color-text-secondary);
  cursor: pointer;
  transition:
    background-color var(--ig-motion-fast),
    border-color var(--ig-motion-fast),
    color var(--ig-motion-fast),
    opacity var(--ig-motion-fast);

  &:hover:not(:disabled) {
    border-color: var(--ig-color-accent-border-strong);
    background: var(--ig-color-surface-interactive-hover);
    color: var(--ig-color-text-primary);
  }

  &:disabled {
    opacity: 0.55;
    cursor: not-allowed;
  }
`

export const buttonAccent = css`
  border-radius: var(--ig-radius-sm);
  border: 1px solid var(--ig-color-accent);
  background: var(--ig-color-accent-soft-surface);
  color: var(--ig-color-accent-soft);
  cursor: pointer;
  transition:
    background-color var(--ig-motion-fast),
    color var(--ig-motion-fast),
    border-color var(--ig-motion-fast),
    opacity var(--ig-motion-fast);

  &:hover:not(:disabled) {
    background: var(--ig-color-accent-soft-surface-hover);
    color: var(--ig-color-text-primary);
  }

  &:disabled {
    opacity: 0.55;
    cursor: not-allowed;
  }
`

export const buttonDanger = css`
  border-radius: var(--ig-radius-sm);
  border: 1px solid color-mix(in srgb, var(--ig-color-alert-danger-border) 90%, transparent);
  background: linear-gradient(135deg, color-mix(in srgb, var(--ig-color-danger) 88%, #7f1d1d) 0%, #8f2f2f 100%);
  color: #fff4f4;
  cursor: pointer;
  transition:
    transform var(--ig-motion-fast),
    box-shadow var(--ig-motion-fast),
    opacity var(--ig-motion-fast),
    background-color var(--ig-motion-fast);

  &:hover:not(:disabled) {
    transform: translateY(-1px);
    box-shadow: 0 10px 28px rgba(127, 29, 29, 0.32);
  }

  &:disabled {
    opacity: 0.55;
    cursor: not-allowed;
  }
`

export const buttonDangerSecondary = css`
  border-radius: var(--ig-radius-sm);
  border: 1px solid color-mix(in srgb, var(--ig-color-alert-danger-border) 78%, transparent);
  background: color-mix(in srgb, var(--ig-color-alert-danger-bg) 82%, transparent);
  color: var(--ig-color-alert-danger-text);
  cursor: pointer;
  transition:
    background-color var(--ig-motion-fast),
    border-color var(--ig-motion-fast),
    color var(--ig-motion-fast),
    opacity var(--ig-motion-fast);

  &:hover:not(:disabled) {
    border-color: var(--ig-color-alert-danger-border);
    background: color-mix(in srgb, var(--ig-color-alert-danger-bg) 96%, transparent);
    color: #ffe1e1;
  }

  &:disabled {
    opacity: 0.55;
    cursor: not-allowed;
  }
`
