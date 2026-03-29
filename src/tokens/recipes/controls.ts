import { css } from 'styled-components'

export const controlField = css`
  width: 100%;
  min-width: 0;
  box-sizing: border-box;
  height: var(--ig-control-height-md);
  padding: 0 var(--ig-space-5);
  border-radius: var(--ig-radius-md);
  border: 1px solid var(--ig-color-border-strong);
  background: var(--ig-color-surface-muted);
  color: var(--ig-color-text-primary);
  font-size: var(--ig-font-size-md);
  line-height: 1;
  transition:
    border-color var(--ig-motion-fast),
    box-shadow var(--ig-motion-fast),
    background-color var(--ig-motion-fast);

  &::placeholder {
    color: var(--ig-color-text-soft);
  }

  &:focus-visible {
    outline: 2px solid var(--ig-color-accent-ring);
    outline-offset: -2px;
    box-shadow: var(--ig-shadow-focus-ring);
    background: var(--ig-color-surface-focus);
  }

  &:where(textarea) {
    height: auto;
    padding: var(--ig-space-4) var(--ig-space-5);
    line-height: 1.4;
  }

  &:where([type='date']),
  &:where([type='datetime-local']),
  &:where([type='time']) {
    padding-right: var(--ig-space-4);

    &::-webkit-calendar-picker-indicator {
      filter: invert(0.8) brightness(1.2);
      cursor: pointer;
      padding: var(--ig-space-1);
      border-radius: var(--ig-radius-xs);
      opacity: 0.7;
      transition: opacity 0.15s;
    }

    &::-webkit-calendar-picker-indicator:hover {
      opacity: 1;
    }

    &::-webkit-datetime-edit {
      color: var(--ig-color-text-primary);
      font-size: var(--ig-font-size-sm);
    }

    &::-webkit-datetime-edit-fields-wrapper {
      padding: 0;
    }

    &::-webkit-datetime-edit-month-field,
    &::-webkit-datetime-edit-day-field,
    &::-webkit-datetime-edit-year-field {
      color: var(--ig-color-text-primary);
      padding: 2px;
      border-radius: 2px;
    }

    &::-webkit-datetime-edit-month-field:focus,
    &::-webkit-datetime-edit-day-field:focus,
    &::-webkit-datetime-edit-year-field:focus {
      background: var(--ig-color-accent-soft-surface);
      color: var(--ig-color-text-primary);
    }

    &::-webkit-datetime-edit-text {
      color: var(--ig-color-text-muted);
      padding: 0 1px;
    }
  }

  &:where(select) {
    appearance: none;
    -webkit-appearance: none;
    -moz-appearance: none;
    padding-right: calc(var(--ig-space-7) * 2.5);
    border-radius: var(--ig-radius-md);
    background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='10' height='6' viewBox='0 0 10 6' fill='none'%3E%3Cpath d='M1 1L5 5L9 1' stroke='%2398A2B3' stroke-width='1.4' stroke-linecap='round' stroke-linejoin='round'/%3E%3C/svg%3E");
    background-repeat: no-repeat;
    background-position: calc(100% - var(--ig-space-7)) center;
    background-size: 10px 6px;
    box-shadow:
      inset 0 1px 0 var(--ig-color-inset-highlight),
      0 10px 24px rgba(0, 0, 0, 0.12);
  }
`
