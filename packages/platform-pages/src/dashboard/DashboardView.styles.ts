import styled from 'styled-components'
import { AppShell } from '@ingradient/ui/patterns'

export const Page = styled(AppShell)`
  height: 100vh;
  overflow: hidden;
`

export const Content = styled.div`
  flex: 1;
  min-height: 0;
  /* Flush main region like Catalog: no inset card, regions divided by 1px lines. */
  overflow: auto;
  display: flex;
  flex-direction: column;
`
