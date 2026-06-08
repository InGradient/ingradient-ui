import styled from 'styled-components'
import { AppShell } from '@ingradient/ui/patterns'

export const Page = styled(AppShell)`
  overflow: hidden;
`

export const Content = styled.div`
  flex: 1;
  min-height: 0;
  padding: var(--ig-space-7) var(--ig-space-9);
  overflow: auto;
  display: flex;
  flex-direction: column;
  gap: var(--ig-space-7);
`
