import styled from 'styled-components'

export const Wrap = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100%;
  gap: var(--ig-space-11);
  padding: var(--ig-space-13);
  background: var(--ig-color-bg-canvas);
  position: relative;
`

export const LangCorner = styled.div`
  position: absolute;
  top: var(--ig-space-7);
  right: var(--ig-space-7);
  display: flex;
  gap: var(--ig-space-3);
  align-items: center;
`

export const Title = styled.h1`
  font-size: var(--ig-font-size-3xl);
  font-weight: var(--ig-font-weight-bold);
  color: var(--ig-color-text-primary);
  margin: 0;
  text-align: center;
`

export const PackageSection = styled.div`
  display: flex;
  flex-direction: column;
  gap: var(--ig-space-3);
`

export const PackageInfo = styled.div`
  font-size: var(--ig-font-size-sm);
  color: var(--ig-color-text-muted);
  text-align: center;
  padding: var(--ig-space-4);
  background: var(--ig-color-white-04);
  border-radius: var(--ig-radius-xs);
  border: var(--ig-border-1px) solid var(--ig-color-white-07);
`

export const Divider = styled.div`
  height: var(--ig-space-1px);
  background: var(--ig-color-white-08);
`

export const LoginForm = styled.form`
  display: flex;
  flex-direction: column;
  gap: var(--ig-space-7);
`

export const Field = styled.div`
  display: flex;
  flex-direction: column;
  gap: var(--ig-space-2);
`

export const FieldLabel = styled.label`
  font-size: var(--ig-font-size-xs);
  font-weight: var(--ig-font-weight-semibold);
  color: var(--ig-color-text-muted);
  text-transform: uppercase;
  letter-spacing: var(--ig-letter-spacing-wide);
`

export const CheckOptions = styled.div`
  display: flex;
  flex-direction: column;
  gap: var(--ig-space-3);
`

export const ErrorMsg = styled.div`
  font-size: var(--ig-font-size-sm);
  color: var(--ig-color-danger);
  text-align: center;
`

export const SessionBox = styled.div`
  display: flex;
  flex-direction: column;
  gap: var(--ig-space-5);
`

export const SessionGreeting = styled.div`
  font-size: var(--ig-font-size-lg);
  font-weight: var(--ig-font-weight-semibold);
  color: var(--ig-color-text-primary);
  text-align: center;
`

export const SessionMeta = styled.div`
  font-size: var(--ig-font-size-xs);
  color: var(--ig-color-text-muted);
  text-align: center;
`

export const AccountList = styled.div`
  display: flex;
  flex-direction: column;
  gap: var(--ig-space-2);
`

export const AccountItemName = styled.span`
  font-size: var(--ig-font-size-md);
  color: var(--ig-color-text-primary);
`

export const AccountItemEmail = styled.span`
  font-size: var(--ig-font-size-xs);
  color: var(--ig-color-text-muted);
`
export const FooterRow = styled.div`
  display: flex;
  justify-content: center;
  gap: var(--ig-space-7);
`
