import { rotations } from '@ingradient/ui'
import { IconButton } from '@ingradient/ui/components'
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

export const RefreshBtn = styled(IconButton).attrs({ variant: 'secondary' as const, size: 'sm' as const })<{ $spinning?: boolean }>`
  svg {
    ${(p) => p.$spinning && css`animation: ${spinAnim} var(--ig-motion-spinner) linear infinite;`}
  }
`

export const StatusItem = styled.div`
  display: flex;
  align-items: center;
  margin-right: var(--ig-space-1);
`

