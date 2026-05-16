import styled from 'styled-components'
import { Card as UiCard } from '@ingradient/ui/components'
import { Grid, Stack } from '@ingradient/ui/primitives'

export const Page = styled.div`
  min-height: 100vh;
  display: grid;
  place-items: center;
  padding: var(--ig-space-10) var(--ig-space-5);
  background: var(--ig-color-bg-canvas);
  @supports (min-height: 100dvh) {
    min-height: 100dvh;
  }
`

export const Content = styled(Stack)`
  width: min(520px, calc(100vw - 32px));
  gap: var(--ig-space-6);
`

export const LogoWrap = styled.div`
  display: flex;
  justify-content: center;
`

export const Card = styled(UiCard)`
  padding: var(--ig-space-7);
  border-radius: var(--ig-radius-xl);
`

export const Title = styled.h1`
  margin: 0 0 var(--ig-space-6);
  font-size: var(--ig-font-size-xl);
  font-weight: 600;
`

export const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: var(--ig-space-5);
`

export const OptionalLabel = styled.span`
  font-size: var(--ig-font-size-xs);
  color: var(--ig-color-text-muted);
  font-weight: 400;
  margin-left: var(--ig-space-2);
`

export const Dropzone = styled.button<{ $active?: boolean }>`
  display: block;
  width: 100%;
  border: 2px dashed
    ${(p) => (p.$active ? 'var(--ig-color-accent)' : 'var(--ig-color-border-subtle)')};
  border-radius: var(--ig-radius-lg);
  padding: var(--ig-space-7);
  text-align: center;
  color: var(--ig-color-text-muted);
  font-size: var(--ig-font-size-sm);
  cursor: pointer;
  background: ${(p) =>
    p.$active ? 'var(--ig-color-surface-focus)' : 'var(--ig-color-surface-muted)'};

  &:hover {
    border-color: var(--ig-color-accent);
    color: var(--ig-color-text-secondary);
  }

  &:disabled {
    cursor: not-allowed;
    opacity: 0.6;
  }
`

export const FileInput = styled.input`
  display: none;
`

export const FileList = styled.ul`
  list-style: none;
  margin: 0;
  padding: 0;
  font-size: var(--ig-font-size-xs);
  color: var(--ig-color-text-muted);
`

export const FileItem = styled.li`
  padding: var(--ig-space-2) 0;
`

export const OptionGrid = styled(Grid).attrs({
  columns: 'repeat(2, minmax(0, 1fr))',
  gap: 3,
})``

export const OptionCard = styled.button<{ $active?: boolean }>`
  width: 100%;
  padding: var(--ig-space-5);
  text-align: left;
  border-radius: var(--ig-radius-lg);
  border: 1px solid
    ${(p) => (p.$active ? 'var(--ig-color-accent)' : 'var(--ig-color-border-subtle)')};
  background: ${(p) =>
    p.$active ? 'var(--ig-color-surface-focus)' : 'var(--ig-color-surface-muted)'};
  color: var(--ig-color-text-primary);
  cursor: pointer;

  &:hover {
    border-color: var(--ig-color-accent);
  }

  &:disabled {
    cursor: not-allowed;
    opacity: 0.6;
  }
`

export const OptionTitle = styled.div`
  font-size: var(--ig-font-size-sm);
  font-weight: 600;
  margin-bottom: var(--ig-space-2);
`

export const OptionText = styled.div`
  font-size: var(--ig-font-size-xs);
  color: var(--ig-color-text-muted);
  line-height: 1.5;
`
