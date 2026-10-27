import styled from 'styled-components'
import { AppShell } from '@ingradient/ui/patterns'

export const Page = styled(AppShell)`
  /* Fills the app shell's page area; standalone it takes the viewport. */
  height: var(--ig-page-height, 100vh);
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
