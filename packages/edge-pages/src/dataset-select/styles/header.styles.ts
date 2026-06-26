import { rotations } from '@ingradient/ui'
import styled, { css, keyframes } from 'styled-components'

export const Header = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  min-height: var(--ig-control-height-xl);
  padding: 0 var(--ig-space-7);
  border-bottom: var(--ig-border-1px) solid var(--ig-color-white-08);
  flex-shrink: 0;
`

export const HeaderLeft = styled.div`
  display: flex;
  align-items: center;
  min-height: 0;
`

export const Title = styled.h1`
  font-size: var(--ig-font-size-2xl);
  font-weight: var(--ig-font-weight-bold);
  color: var(--ig-color-text-primary);
  margin: 0;
`

export const HeaderRight = styled.div`
  display: flex;
  align-items: center;
  gap: var(--ig-space-4);
`

const spinAnim = keyframes`to { transform: rotate(${rotations.full}); }`

export const RefreshBtn = styled.button<{ $spinning?: boolean }>`
  display: flex;
  align-items: center;
  justify-content: center;
  width: var(--ig-control-height-md);
  height: var(--ig-control-height-md);
  padding: 0;
  border-radius: var(--ig-radius-xs);
  border: var(--ig-border-1px) solid transparent;
  background: transparent;
  color: var(--ig-color-text-muted);
  cursor: pointer;
  transition: all var(--ig-motion-fast-ease);
  flex-shrink: 0;
  svg {
    ${(p) => p.$spinning && css`animation: ${spinAnim} var(--ig-motion-spinner) linear infinite;`}
  }
  &:hover {
    color: var(--ig-color-text-primary);
    background: var(--ig-color-white-06);
    border-color: var(--ig-color-white-12);
  }
  &:disabled { opacity: var(--ig-opacity-faded); cursor: not-allowed; }
`

export const IconBtn = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;
  width: var(--ig-control-height-md);
  height: var(--ig-control-height-md);
  padding: 0;
  border: var(--ig-border-1px) solid transparent;
  border-radius: var(--ig-radius-xs);
  background: transparent;
  color: var(--ig-color-text-muted);
  cursor: pointer;
  transition: all var(--ig-motion-fast-ease);
  &:hover {
    color: var(--ig-color-text-primary);
    background: var(--ig-color-white-06);
    border-color: var(--ig-color-white-12);
  }
`

export const StatusItem = styled.div`
  display: flex;
  align-items: center;
  margin-right: var(--ig-space-1);
`

