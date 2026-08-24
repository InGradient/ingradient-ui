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

const spinAnim = keyframes`to { transform: rotate(${rotations.full}); }`

export const RefreshBtn = styled(IconButton).attrs({ variant: 'secondary' as const, size: 'sm' as const })<{ $spinning?: boolean }>`
  svg {
    ${(p) => p.$spinning && css`animation: ${spinAnim} var(--ig-motion-spinner) linear infinite;`}
  }
`

