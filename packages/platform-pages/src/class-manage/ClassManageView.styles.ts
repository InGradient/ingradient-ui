import styled from 'styled-components'
import { AppShell } from '@ingradient/ui/patterns'

export const Page = styled(AppShell)`
  overflow: hidden;
`

export const BodyRow = styled.div`
  display: flex;
  flex-direction: row;
  gap: var(--ig-space-8);
  flex: 1;
  min-height: 0;
  overflow: hidden;
  padding: var(--ig-space-8) var(--ig-space-11) var(--ig-space-11);
`

