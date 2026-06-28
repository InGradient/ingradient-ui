import styled from 'styled-components'
import { Button } from '@ingradient/ui/components'

export const Container = styled.aside`
  width: var(--ig-popup-sm);
  flex-shrink: 0;
  display: flex;
  flex-direction: column;
  background: var(--ig-color-surface-panel);
  border-left: var(--ig-border-1px) solid var(--ig-color-border-subtle);
  height: 100%;
`

export const Section = styled.div`
  padding: var(--ig-space-5);
  display: flex;
  flex-direction: column;
  gap: var(--ig-space-3);
  border-bottom: var(--ig-border-1px) solid var(--ig-color-border-subtle);
`

export const GrowSection = styled(Section)`
  flex: 1;
  min-height: 0;
  overflow-y: auto;
`

export const Label = styled.div`
  font-size: var(--ig-font-size-2xs);
  font-weight: var(--ig-font-weight-bold);
  text-transform: uppercase;
  letter-spacing: var(--ig-letter-spacing-wide);
  color: var(--ig-color-text-muted);
`

export const ClassList = styled.div`
  display: flex;
  flex-direction: column;
  gap: var(--ig-space-2);
`

export const SetupSlot = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
`

export const PatternGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: var(--ig-space-2);
`

export const PatternButton = styled(Button).attrs({
  variant: 'secondary' as const,
  size: 'sm' as const,
})<{ $active: boolean }>`
  && {
    background: ${({ $active }) => ($active ? 'var(--ig-color-blue-tint-18)' : 'var(--ig-color-white-04)')};
    border-color: ${({ $active }) => ($active ? 'var(--ig-color-blue-tint-85)' : 'var(--ig-color-white-12)')};
  }
`

export const RoiPrimaryButton = styled(Button).attrs({
  variant: 'accent' as const,
})<{ $active: boolean }>`
  && {
    background: ${({ $active }) => ($active ? 'var(--ig-color-accent)' : 'var(--ig-color-white-04)')};
    border-color: ${({ $active }) => ($active ? 'var(--ig-color-accent)' : 'var(--ig-color-white-12)')};
  }
`
