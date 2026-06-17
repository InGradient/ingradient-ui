import styled from 'styled-components'

export const Wrap = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 100%;
  gap: var(--ig-space-11);
  padding: var(--ig-space-13);
  background: var(--ig-color-bg-canvas);
  overflow-y: auto;
  box-sizing: border-box;
`

export const LangCorner = styled.div`
  position: fixed;
  top: var(--ig-control-height-xl);
  right: var(--ig-space-7);
  z-index: var(--ig-z-sticky);
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
  max-width: var(--ig-popup-lg-plus);
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

export const Subtitle = styled.p`
  font-size: var(--ig-font-size-sm);
  color: var(--ig-color-text-muted);
  margin: 0;
  text-align: center;
  line-height: var(--ig-line-height-loose);
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

export const FingerprintBox = styled.div`
  display: flex;
  align-items: center;
  gap: var(--ig-space-3);
  padding: var(--ig-space-4) 12px;
  border-radius: var(--ig-radius-xs);
  border: var(--ig-border-1px) solid var(--ig-color-white-12);
  background: var(--ig-color-white-04);
`

export const FingerprintText = styled.span`
  flex: 1;
  font-family: 'Courier New', monospace;
  font-size: var(--ig-font-size-lg);
  font-weight: var(--ig-font-weight-bold);
  letter-spacing: var(--ig-letter-spacing-widest);
  color: var(--ig-color-accent-soft);
`

export const CopyBtn = styled.button`
  height: var(--ig-control-height-xs);
  padding: 0 var(--ig-space-4);
  border-radius: var(--ig-radius-xs);
  border: none;
  background: var(--ig-color-selection-bg);
  color: var(--ig-color-accent-soft);
  font-size: var(--ig-font-size-2xs);
  font-weight: var(--ig-font-weight-semibold);
  cursor: pointer;
  transition: background var(--ig-motion-swift);
  &:hover {
    background: var(--ig-color-blue-tint-25);
  }
`

export const Input = styled.input`
  width: 100%;
  height: var(--ig-control-height-mid-plus);
  padding: 0 var(--ig-space-5);
  border-radius: var(--ig-radius-xs);
  border: var(--ig-border-1px) solid var(--ig-color-white-12);
  background: var(--ig-color-white-06);
  color: var(--ig-color-text-primary);
  font-size: var(--ig-font-size-md);
  font-family: 'Courier New', monospace;
  letter-spacing: var(--ig-letter-spacing-wide);
  box-sizing: border-box;
  outline: none;
  &:focus {
    border-color: var(--ig-color-blue-tint-60);
  }
  &::placeholder {
    color: var(--ig-color-white-20);
    font-family: inherit;
    letter-spacing: 0;
  }
`

export const LicenseForm = styled.form`
  display: flex;
  flex-direction: column;
  gap: var(--ig-space-5);
`

export const SubmitBtn = styled.button`
  height: var(--ig-control-height-mid-plus);
  border-radius: var(--ig-radius-xs);
  border: none;
  cursor: pointer;
  font-size: var(--ig-font-size-md);
  font-weight: var(--ig-font-weight-semibold);
  background: var(--ig-color-accent);
  color: var(--ig-color-text-primary);
  transition: opacity var(--ig-motion-swift);
  &:hover {
    opacity: var(--ig-opacity-loud);
  }
  &:disabled {
    opacity: var(--ig-opacity-faded);
    cursor: not-allowed;
  }
`

export const ErrorMsg = styled.div`
  font-size: var(--ig-font-size-sm);
  color: var(--ig-color-danger);
  text-align: center;
`

export const HintBox = styled.div`
  font-size: var(--ig-font-size-xs);
  color: var(--ig-color-text-muted);
  padding: var(--ig-space-5);
  border-radius: var(--ig-radius-xs);
  background: var(--ig-color-blue-tint-06);
  border: var(--ig-border-1px) solid var(--ig-color-selection-bg);
  line-height: var(--ig-line-height-loose);
`
