import styled from 'styled-components'
import { Card as UiCard } from '@ingradient/ui/components'

export const Page = styled.div`
  min-height: 100vh;
  display: grid;
  place-items: center;
  padding: var(--ig-space-8);
  background: var(--ig-color-bg-canvas);
`

export const Content = styled.div`
  display: flex;
  flex-direction: column;
  gap: var(--ig-space-2);
  width: min(var(--ig-popup-2xl-narrow), calc(100vw - var(--ig-space-13)));
`

export const LogoWrap = styled.div`
  display: flex;
  justify-content: center;
`

export const Card = styled(UiCard)`
  padding: var(--ig-space-8);
  border-radius: var(--ig-radius-xl);
`

export const Title = styled.h1`
  margin: 0 0 var(--ig-space-6);
  font-size: var(--ig-font-size-2xl);
  font-weight: var(--ig-font-weight-semibold);
  text-align: center;
`

export const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: var(--ig-space-4);
`

export const CheckboxRow = styled.div`
  display: flex;
  justify-content: space-between;
  gap: var(--ig-space-3);
  flex-wrap: wrap;
`

export const Footer = styled.p`
  margin: var(--ig-space-5) 0 0;
  font-size: var(--ig-font-size-sm);
  color: var(--ig-color-text-muted);
  text-align: center;
`

export const AuthLink = styled.a`
  color: var(--ig-color-accent-soft);
  text-decoration: underline;
  text-underline-offset: var(--ig-space-1);
`
