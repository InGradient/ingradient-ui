import styled from 'styled-components'
import { controlField } from '../../primitives'

export const Trigger = styled.button`
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

export const Placeholder = styled.span`
  color: var(--ig-color-text-soft);
`

export const Popover = styled.div`
  z-index: calc(var(--ig-z-modal) + 10);
  border-radius: var(--ig-radius-lg);
  background: linear-gradient(180deg, var(--ig-color-dropdown-menu-a) 0%, var(--ig-color-dropdown-menu-b) 100%);
  border: var(--ig-border-1px) solid var(--ig-color-border-strong);
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
    font-weight: var(--ig-font-weight-semibold);
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
    font-weight: var(--ig-font-weight-medium);
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
    color: var(--ig-color-on-accent);
    font-weight: var(--ig-font-weight-semibold);
  }

  .rdp-today .rdp-day_button {
    font-weight: var(--ig-font-weight-bold);
    color: var(--ig-color-accent);
  }

  .rdp-today.rdp-selected .rdp-day_button {
    color: var(--ig-color-on-accent);
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
