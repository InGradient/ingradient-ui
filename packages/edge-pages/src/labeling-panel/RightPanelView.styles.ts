import styled from 'styled-components'

export const Container = styled.aside`
  width: 240px;
  flex-shrink: 0;
  display: flex;
  flex-direction: column;
  background: var(--ig-color-surface-panel);
  border-left: 1px solid var(--ig-color-border-subtle);
  height: 100%;
`

export const Section = styled.div`
  padding: var(--ig-space-5);
  display: flex;
  flex-direction: column;
  gap: var(--ig-space-3);
  border-bottom: 1px solid var(--ig-color-border-subtle);
`

export const GrowSection = styled(Section)`
  flex: 1;
  min-height: 0;
  overflow-y: auto;
`

export const Label = styled.div`
  font-size: var(--ig-font-size-2xs);
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.05em;
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

export const PatternButton = styled.button<{ $active: boolean }>`
  padding: var(--ig-space-3);
  font-size: var(--ig-font-size-xs);
  font-weight: 600;
  border-radius: var(--ig-radius-xs);
  cursor: pointer;
  background: ${({ $active }) => ($active ? 'rgba(59, 130, 246, 0.18)' : 'var(--ig-color-white-04)')};
  border: 1px solid ${({ $active }) => ($active ? 'rgba(96, 165, 250, 0.85)' : 'var(--ig-color-white-12)')};
  color: var(--ig-color-text-primary);
`

export const RoiPrimaryButton = styled.button<{ $active: boolean }>`
  display: flex;
  align-items: center;
  gap: var(--ig-space-2);
  justify-content: center;
  padding: var(--ig-space-3);
  font-size: var(--ig-font-size-sm);
  font-weight: 600;
  border-radius: var(--ig-radius-xs);
  cursor: pointer;
  background: ${({ $active }) => ($active ? 'var(--ig-color-accent)' : 'var(--ig-color-white-04)')};
  border: 1px solid ${({ $active }) => ($active ? 'var(--ig-color-accent)' : 'var(--ig-color-white-12)')};
  color: var(--ig-color-text-primary);
`
