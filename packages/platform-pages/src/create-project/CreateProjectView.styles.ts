import styled from 'styled-components'
import { Card as UiCard } from '@ingradient/ui/components'
import { Grid, Stack, surfaceRaised } from '@ingradient/ui/primitives'
import { media } from '@ingradient/ui/tokens'

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
  width: min(var(--ig-popup-3xl-mid), calc(100vw - var(--ig-space-7) * 2));
  gap: var(--ig-space-6);
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
  margin: 0;
  font-size: var(--ig-font-size-2xl);
  font-weight: var(--ig-font-weight-bold);
  color: var(--ig-color-text-primary);
`

export const Subtitle = styled.p`
  margin: var(--ig-space-2) 0 0;
  font-size: var(--ig-font-size-sm);
  line-height: var(--ig-line-height-relaxed);
  color: var(--ig-color-text-muted);
`

export const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: var(--ig-space-6);
  margin-top: var(--ig-space-7);
`

export const Section = styled.section`
  ${surfaceRaised}
  border-radius: var(--ig-radius-lg);
  overflow: hidden;
`

export const SectionHeader = styled.header`
  padding: var(--ig-space-5) var(--ig-space-6);
  border-bottom: var(--ig-border-1px) solid var(--ig-color-border-subtle);
  background: var(--ig-color-surface-interactive);
`

export const SectionTitle = styled.h2`
  margin: 0;
  font-size: var(--ig-font-size-md);
  font-weight: var(--ig-font-weight-bold);
  color: var(--ig-color-text-primary);
`

export const SectionDescription = styled.p`
  margin: var(--ig-space-2) 0 0;
  font-size: var(--ig-font-size-xs);
  line-height: var(--ig-line-height-relaxed);
  color: var(--ig-color-text-muted);
`

export const SectionBody = styled.div`
  display: flex;
  flex-direction: column;
  gap: var(--ig-space-5);
  padding: var(--ig-space-6);
`

export const FieldsBody = styled(SectionBody)`
  gap: 0;

  > * {
    padding: var(--ig-space-5) 0;
  }

  > *:first-child {
    padding-top: 0;
  }

  > *:last-child {
    padding-bottom: 0;
  }

  > * + * {
    border-top: var(--ig-border-1px) solid var(--ig-color-border-subtle);
  }
`

export const Actions = styled.div`
  display: flex;
  justify-content: flex-end;
  gap: var(--ig-space-3);
  padding-top: var(--ig-space-2);
`

export const OptionalLabel = styled.span`
  font-size: var(--ig-font-size-xs);
  color: var(--ig-color-text-muted);
  font-weight: var(--ig-font-weight-regular);
  margin-left: var(--ig-space-2);
`

export const Dropzone = styled.button<{ $active?: boolean }>`
  display: block;
  width: 100%;
  border: var(--ig-border-2px) dashed
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
    opacity: var(--ig-opacity-muted);
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
})`
  ${media.sm} {
    grid-template-columns: 1fr;
  }
`

export const OptionCard = styled.button<{ $active?: boolean }>`
  width: 100%;
  padding: var(--ig-space-5);
  text-align: left;
  border-radius: var(--ig-radius-lg);
  border: var(--ig-border-1px) solid
    ${(p) => (p.$active ? 'var(--ig-color-accent)' : 'var(--ig-color-border-subtle)')};
  background: ${(p) =>
    p.$active ? 'var(--ig-color-surface-focus)' : 'var(--ig-color-surface-muted)'};
  box-shadow: ${(p) => (p.$active ? 'inset 0 0 0 var(--ig-border-1px) var(--ig-color-accent)' : 'none')};
  color: var(--ig-color-text-primary);
  cursor: pointer;

  &:hover {
    border-color: var(--ig-color-accent);
  }

  &:disabled {
    cursor: not-allowed;
    opacity: var(--ig-opacity-muted);
  }
`

export const OptionTitle = styled.div`
  font-size: var(--ig-font-size-sm);
  font-weight: var(--ig-font-weight-semibold);
  margin-bottom: var(--ig-space-2);
`

export const OptionText = styled.div`
  font-size: var(--ig-font-size-xs);
  color: var(--ig-color-text-muted);
  line-height: var(--ig-line-height-relaxed);
`
