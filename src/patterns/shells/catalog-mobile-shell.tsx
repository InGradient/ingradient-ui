import type { ReactNode } from 'react'
import styled from 'styled-components'

const Root = styled.div`
  height: 100%;
  width: 100%;
  display: flex;
  flex-direction: column;
  background: var(--ig-color-surface-page);
  color: var(--ig-color-text-primary);
  overflow: hidden;
`

const TopBar = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 10px 14px;
  background: var(--ig-color-surface-raised);
  border-bottom: 1px solid var(--ig-color-border-subtle);
  flex-shrink: 0;
  position: relative;
  z-index: 20;
`

const Body = styled.div`
  flex: 1;
  min-height: 0;
  display: flex;
  flex-direction: column;
  overflow: hidden;
`

const BottomBar = styled.div`
  flex-shrink: 0;
  position: sticky;
  bottom: 0;
  z-index: 10;
`

export interface CatalogMobileShellProps {
  topBar: ReactNode
  body: ReactNode
  bottomBar?: ReactNode
}

export function CatalogMobileShell({ topBar, body, bottomBar }: CatalogMobileShellProps) {
  return (
    <Root>
      <TopBar>{topBar}</TopBar>
      <Body>{body}</Body>
      {bottomBar ? <BottomBar>{bottomBar}</BottomBar> : null}
    </Root>
  )
}
