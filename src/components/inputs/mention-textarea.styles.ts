import styled from 'styled-components'
import { controlField } from '../../primitives'

export const Wrap = styled.div`
  position: relative;
  width: 100%;
`

export const Textarea = styled.textarea`
  ${controlField}
  font-size: var(--ig-font-size-xs);
  resize: vertical;
  min-height: var(--ig-control-height-mid-plus-tall);
`

export const Menu = styled.div`
  position: absolute;
  bottom: 100%;
  left: 0;
  right: 0;
  max-height: var(--ig-popup-2xs-plus);
  overflow-y: auto;
  background: var(--ig-color-surface-raised);
  border: var(--ig-border-1px) solid var(--ig-color-border-subtle);
  border-radius: var(--ig-radius-sm);
  box-shadow: var(--ig-shadow-menu);
  z-index: var(--ig-z-dropdown);
`

export const Option = styled.button<{ $active: boolean }>`
  display: flex;
  flex-direction: column;
  width: 100%;
  padding: var(--ig-space-3) var(--ig-space-4);
  border: none;
  background: ${(p) => (p.$active ? 'var(--ig-color-surface-interactive)' : 'transparent')};
  color: var(--ig-color-text-primary);
  text-align: left;
  cursor: pointer;
  &:hover { background: var(--ig-color-surface-interactive); }
`

export const Primary = styled.span`
  font-size: var(--ig-font-size-sm);
  font-weight: var(--ig-font-weight-medium);
`

export const Secondary = styled.span`
  font-size: var(--ig-font-size-xs);
  color: var(--ig-color-text-muted);
`
