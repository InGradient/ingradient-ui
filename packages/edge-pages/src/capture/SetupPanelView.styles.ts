import { rotations } from '@ingradient/ui'
import styled from 'styled-components';

export const SetupPanel = styled.div`
  display: flex;
  flex-direction: column;
  flex: 1;
  min-height: 0;
`;

export const SetupPanelHeader = styled.div`
  padding: var(--ig-space-7) 16px 14px;
  border-bottom: var(--ig-border-1px) solid var(--ig-color-white-08);
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: var(--ig-space-5);
`;

export const SetupPanelTitle = styled.div`
  color: var(--ig-color-text-primary);
  font-size: var(--ig-font-size-md);
  font-weight: var(--ig-font-weight-bold);
`;

// SetupResetButton / SetupSaveButton: ui Button (variant secondary/accent, size sm) (PR-B1, 2026-05-09)

export const SetupHeaderActions = styled.div`
  display: flex;
  gap: var(--ig-space-2);
  align-items: center;
`;

export const SetupPanelBody = styled.div`
  padding: var(--ig-space-6) 16px 16px;
  overflow-x: hidden;
  overflow-y: auto;
  display: flex;
  flex-direction: column;
  gap: var(--ig-space-7);
  flex: 1;
  min-height: 0;

  > * {
    flex-shrink: 0;
  }
`;

// SetupSection / SetupSectionTitle / SetupField / SetupInput: ui FieldGroup / SectionTitle / FieldLabel / TextField (PR-B1, 2026-05-09)

export const PatternGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: var(--ig-space-3);
`;

export const PatternButton = styled.button<{ $active: boolean }>`
  border: var(--ig-border-1px) solid ${({ $active }) => ($active ? 'var(--ig-color-blue-tint-85)' : 'var(--ig-color-white-12)')};
  background: ${({ $active }) => ($active ? 'var(--ig-color-blue-tint-18)' : 'var(--ig-color-white-04)')};
  color: var(--ig-color-text-primary);
  border-radius: var(--ig-radius-sm);
  padding: var(--ig-space-4);
  font-size: var(--ig-font-size-xs);
  font-weight: var(--ig-font-weight-semibold);
  cursor: pointer;
`;

export const SetupMetaText = styled.div`
  color: var(--ig-color-white-70);
  font-size: var(--ig-font-size-xs);
  line-height: var(--ig-line-height-relaxed);
`;

export const SetupInlineRow = styled.div`
  display: flex;
  align-items: center;
  gap: var(--ig-space-4);
`;

// SetupInlineHint: ui FieldHint (PR-B1, 2026-05-09)

export const SetupFieldLabelRow = styled.div`
  display: flex;
  align-items: center;
  gap: var(--ig-space-1-plus);
`;

export const SetupAccordionSummaryRow = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;

  svg {
    transition: transform var(--ig-motion-normal-ease);
    opacity: var(--ig-opacity-muted);
  }

  details[open] & svg {
    transform: rotate(${rotations.half});
  }
`;
