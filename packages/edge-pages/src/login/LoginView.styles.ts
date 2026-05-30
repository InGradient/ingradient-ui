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
  top: 16px;
  right: 16px;
  display: flex;
  gap: var(--ig-space-3);
  align-items: center;
`

export const SettingsIconBtn = styled.button`
  background: transparent;
  border: none;
  cursor: pointer;
  color: var(--ig-color-text-muted);
  padding: var(--ig-space-1);
  display: flex;
  align-items: center;
  border-radius: var(--ig-radius-2xs);
  &:hover { color: var(--ig-color-text-primary); }
`

export const Card = styled.div`
  width: 100%;
  max-width: 420px;
  background: var(--ig-color-white-04);
  border: var(--ig-border-1px) solid var(--ig-color-white-12);
  border-radius: var(--ig-radius-lg);
  padding: var(--ig-space-13);
  display: flex;
  flex-direction: column;
  gap: var(--ig-space-9);
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
  height: 1px;
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

export const Btn = styled.button<{ $variant?: 'primary' | 'secondary' | 'ghost' }>`
  height: 40px;
  border-radius: var(--ig-radius-xs);
  border: none;
  cursor: pointer;
  font-size: var(--ig-font-size-md);
  font-weight: var(--ig-font-weight-semibold);
  transition: opacity 0.15s;
  &:hover {
    opacity: 0.85;
  }
  &:disabled {
    opacity: 0.4;
    cursor: not-allowed;
  }
  ${(p) =>
    p.$variant === 'primary'
      ? `background: var(--ig-color-accent); color: var(--ig-color-text-primary);`
      : p.$variant === 'ghost'
        ? `background: transparent; color: var(--ig-color-accent-soft); padding: 0; height: auto; font-size: var(--ig-font-size-sm);`
        : `background: var(--ig-color-white-08); color: var(--ig-color-text-primary);`}
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

export const AccountItem = styled.button`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 2px;
  padding: var(--ig-space-4) var(--ig-space-5);
  background: var(--ig-color-white-04);
  border: var(--ig-border-1px) solid var(--ig-color-white-08);
  border-radius: var(--ig-radius-xs);
  cursor: pointer;
  text-align: left;
  transition: background 0.15s, border-color 0.15s;
  &:hover {
    background: var(--ig-color-white-07);
    border-color: rgba(77, 136, 255, 0.4);
  }
`

export const AccountItemName = styled.span`
  font-size: var(--ig-font-size-md);
  color: var(--ig-color-text-primary);
`

export const AccountItemEmail = styled.span`
  font-size: var(--ig-font-size-xs);
  color: var(--ig-color-text-muted);
`
export const ModeTag = styled.span<{ $online: boolean }>`
  display: inline-block;
  font-size: var(--ig-font-size-2xs);
  font-weight: var(--ig-font-weight-bold);
  padding: 2px 7px;
  border-radius: var(--ig-radius-xs);
  margin-left: 6px;
  background: ${(p) => (p.$online ? 'rgba(60,210,120,0.15)' : 'rgba(255,180,60,0.15)')};
  color: ${(p) => (p.$online ? 'var(--ig-color-success)' : 'var(--ig-color-warning)')};
  vertical-align: middle;
`

export const FooterRow = styled.div`
  display: flex;
  justify-content: center;
  gap: var(--ig-space-7);
`
