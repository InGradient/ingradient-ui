import type { ReactNode } from 'react'
import { chartHeights } from '@ingradient/ui'
import { BrandLogo } from '@ingradient/ui/brand'
import { Card, Content, Footer, LogoWrap, Page, Title } from './AuthView.styles'

interface AuthPageShellProps {
  page: 'login' | 'signup'
  title: string
  children: ReactNode
  footer: ReactNode
}

export function AuthPageShell({ page, title, children, footer }: AuthPageShellProps) {
  return (
    <Page data-ig-page={`platform-auth-${page}`}>
      <Content>
        <LogoWrap>
          <BrandLogo width={chartHeights.smPlus} />
        </LogoWrap>
        <Card>
          <Title>{title}</Title>
          {children}
          <Footer>{footer}</Footer>
        </Card>
      </Content>
    </Page>
  )
}
