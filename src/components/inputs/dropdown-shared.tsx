import React from 'react'
import styled, { css } from 'styled-components'
import { controlField } from '../../primitives'

export interface DropdownMenuLayout {
  left: number
  width: number
  maxHeight: number
  top?: number
  bottom?: number
}

export interface DropdownOption {
  value: string
  label: string
  description?: string
}

export interface SelectOptionData {
  value: string
  label: string
  disabled?: boolean
}

export const DropdownRoot = styled.div`
  position: relative;
  min-width: 0;
`

export const DropdownTrigger = styled.button<{ $open: boolean }>`
  ${controlField}
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: var(--ig-space-5);
  text-align: left;
  cursor: pointer;
  padding-right: var(--ig-space-6);
  border-radius: var(--ig-radius-lg);
  box-shadow: var(--ig-color-dropdown-trigger-shadow);

  ${(p) =>
    p.$open &&
    css`
      border-color: var(--ig-color-accent-ring);
      box-shadow: var(--ig-color-dropdown-open-shadow);
      background: var(--ig-color-surface-focus);
    `}
`

export const DropdownValue = styled.span`
  min-width: 0;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
`

export const DropdownChevron = styled.span<{ $open: boolean }>`
  width: 28px;
  height: 28px;
  flex-shrink: 0;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  border-radius: var(--ig-radius-pill);
  background: var(--ig-color-dropdown-chevron-bg);
  border: 1px solid var(--ig-color-dropdown-chevron-border);
  color: var(--ig-color-text-soft);
  transform: ${(p) => (p.$open ? 'rotate(180deg)' : 'rotate(0deg)')};
  transition: transform var(--ig-motion-fast), background-color var(--ig-motion-fast), color var(--ig-motion-fast);
`

export const DropdownMenu = styled.div.attrs<{ $layout: DropdownMenuLayout }>(({ $layout }) => ({
  style: {
    left: `${$layout.left}px`,
    width: `${$layout.width}px`,
    maxHeight: `${$layout.maxHeight}px`,
    ...(typeof $layout.top === 'number' ? { top: `${$layout.top}px` } : {}),
    ...(typeof $layout.bottom === 'number' ? { bottom: `${$layout.bottom}px` } : {}),
  },
}))<{ $layout: DropdownMenuLayout }>`
  position: fixed;
  z-index: var(--ig-z-popover);
  padding: var(--ig-space-4);
  border-radius: var(--ig-radius-2xl);
  background: linear-gradient(180deg, var(--ig-color-dropdown-menu-a) 0%, var(--ig-color-dropdown-menu-b) 100%);
  border: 1px solid var(--ig-color-border-strong);
  box-shadow: var(--ig-shadow-popover);
  backdrop-filter: blur(16px);
  overflow-y: auto;
`

export const DropdownOptionButton = styled.button<{ $active: boolean }>`
  width: 100%;
  padding: var(--ig-space-5) var(--ig-space-6);
  border: 1px solid ${(p) => (p.$active ? 'var(--ig-color-accent-border-strong)' : 'transparent')};
  border-radius: var(--ig-radius-md);
  background: ${(p) => (p.$active ? 'var(--ig-color-image-card-gradient-a)' : 'transparent')};
  color: ${(p) => (p.$active ? 'var(--ig-color-text-primary)' : 'var(--ig-color-text-secondary)')};
  text-align: left;
  cursor: pointer;

  &:hover {
    border-color: var(--ig-color-image-card-hover-border);
    background: var(--ig-color-dropdown-option-hover);
    color: var(--ig-color-text-primary);
  }

  &:not(:last-child) {
    margin-bottom: var(--ig-space-2);
  }
`

export const DropdownOptionLabel = styled.div`
  font-size: var(--ig-font-size-sm);
  font-weight: 600;
`

export const DropdownOptionDescription = styled.div`
  margin-top: var(--ig-space-1);
  font-size: var(--ig-font-size-xs);
  color: var(--ig-color-text-soft);
`

export const HiddenSelectInput = styled.select`
  position: absolute;
  width: 1px;
  height: 1px;
  padding: 0;
  margin: -1px;
  overflow: hidden;
  clip: rect(0 0 0 0);
  clip-path: inset(50%);
  border: 0;
  white-space: nowrap;
`

export function readNodeText(node: React.ReactNode): string {
  if (typeof node === 'string' || typeof node === 'number') return String(node)
  if (Array.isArray(node)) return node.map(readNodeText).join('').trim()
  if (React.isValidElement(node)) return readNodeText(node.props.children)
  return ''
}

export function getSelectOptions(children: React.ReactNode): SelectOptionData[] {
  return React.Children.toArray(children).flatMap((child) => {
    if (!React.isValidElement(child) || child.type !== 'option') return []
    const label = readNodeText(child.props.children).trim()
    const value = child.props.value != null ? String(child.props.value) : label
    return [{ value, label: label || value, disabled: Boolean(child.props.disabled) }]
  })
}

export function renderChevron(open: boolean) {
  return (
    <DropdownChevron $open={open} aria-hidden="true">
      <svg width="10" height="6" viewBox="0 0 10 6" fill="none">
        <path
          d="M1 1L5 5L9 1"
          stroke="currentColor"
          strokeWidth="1.4"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    </DropdownChevron>
  )
}
