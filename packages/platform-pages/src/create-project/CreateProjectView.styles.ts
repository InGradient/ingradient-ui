import styled from 'styled-components'
import { Card as UiCard } from '@ingradient/ui/components'
import { Grid, Stack, withSurfaceDepth } from '@ingradient/ui/primitives'
import { media } from '@ingradient/ui/tokens'

export const Page = styled.div`
  height: 100%;
  overflow-y: auto;
  display: flex;
  flex-direction: column;
  padding: var(--ig-space-10) var(--ig-space-5);
  background: var(--ig-color-bg-canvas);
`

export const Content = styled(Stack)`
  width: min(var(--ig-popup-3xl-mid), calc(100vw - var(--ig-space-7) * 2));
  /* Single-form page: generous spacing like Login and Signup (DESIGN.md §4). */
  gap: var(--ig-spacing-24);
  margin: auto;
`

export const LogoWrap = styled.div`
  display: flex;
  justify-content: center;
`

export const Card = styled(UiCard)`
  padding: var(--ig-spacing-32);
`

export const Title = styled.h1`
  margin: 0;
  font-size: var(--ig-text-title);
  font-weight: var(--ig-font-weight-bold);
  color: var(--ig-color-text-primary);
`

export const Subtitle = styled.p`
  margin: var(--ig-space-2) 0 0;
  font-size: var(--ig-text-body-sm);
  line-height: var(--ig-line-height-relaxed);
  color: var(--ig-color-text-muted);
`

export const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: var(--ig-spacing-24);
  margin-top: var(--ig-spacing-24);
`

/**
 * A form section is a heading and its fields, not a box: sections are separated by a 1px line
 * so fields sit at the same 32px inset as Login and Signup (DESIGN.md §4).
 */
export const Section = styled.section`
  display: flex;
  flex-direction: column;
  gap: var(--ig-spacing-16);
  & + & {
    border-top: var(--ig-border-1px) solid var(--ig-color-border-subtle);
    padding-top: var(--ig-spacing-24);
  }
`

export const SectionHeader = styled.header``

export const SectionTitle = styled.h2`
  margin: 0;
  font-size: var(--ig-text-body);
  font-weight: var(--ig-font-weight-bold);
  color: var(--ig-color-text-primary);
`

export const SectionDescription = styled.p`
  margin: var(--ig-space-2) 0 0;
  font-size: var(--ig-text-caption);
  line-height: var(--ig-line-height-relaxed);
  color: var(--ig-color-text-muted);
`

export const SectionBody = styled.div`
  display: flex;
  flex-direction: column;
  gap: var(--ig-spacing-16);
`

export const FieldsBody = styled(SectionBody)``

export const Actions = styled.div`
  display: flex;
  justify-content: flex-end;
  gap: var(--ig-spacing-8);
`

export const OptionalLabel = styled.span`
  font-size: var(--ig-text-caption);
  color: var(--ig-color-text-muted);
  font-weight: var(--ig-font-weight-regular);
  margin-left: var(--ig-space-2);
`

export const FileInput = styled.input`
  display: none;
`

export const FileList = styled.ul`
  list-style: none;
  margin: 0;
  padding: 0;
  font-size: var(--ig-text-caption);
  color: var(--ig-color-text-muted);
`

export const FileItem = styled.li`
  padding: var(--ig-space-2) 0;
`

export const OptionGrid = styled(Grid).attrs({
  columns: 'repeat(2, minmax(0, 1fr))',
  gap: 'var(--ig-gap-related)',
})`
  ${media.sm} {
    grid-template-columns: 1fr;
  }
`

const OptionCardBase = styled.button<{ $active?: boolean }>`
  width: 100%;
  padding: var(--ig-space-5);
  text-align: left;
  /* Buttons centre their content vertically; top-align so titles line up across a row. */
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  align-items: stretch;
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

export const OptionCard = withSurfaceDepth(OptionCardBase, { displayName: 'CreateProjectOptionCard' })

export const OptionTitle = styled.div`
  font-size: var(--ig-text-body-sm);
  font-weight: var(--ig-font-weight-semibold);
  margin-bottom: var(--ig-space-2);
`

export const OptionText = styled.div`
  font-size: var(--ig-text-caption);
  color: var(--ig-color-text-muted);
  line-height: var(--ig-line-height-relaxed);
`
