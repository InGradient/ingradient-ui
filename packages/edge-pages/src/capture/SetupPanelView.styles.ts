import { rotations } from '@ingradient/ui'
import { Button } from '@ingradient/ui/components'
import styled from 'styled-components';

export const SetupPanel = styled.div`
  display: flex;
  flex-direction: column;
  flex: 1;
  min-height: 0;
`;

export const SetupPanelHeader = styled.div`
  padding: var(--ig-space-7) var(--ig-space-7) var(--ig-space-6);
  border-bottom: var(--ig-border-1px) solid var(--ig-color-white-08);
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: var(--ig-space-5);
`;

// SetupResetButton / SetupSaveButton: ui Button (variant secondary/accent, size sm) (PR-B1, 2026-05-09)

export const SetupPanelBody = styled.div`
  padding: var(--ig-space-6) var(--ig-space-7) var(--ig-space-7);
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

export const PatternButton = styled(Button).attrs({
  variant: 'secondary' as const,
  size: 'sm' as const,
})<{ $active: boolean }>`
  && {
    border-color: ${({ $active }) => ($active ? 'var(--ig-color-blue-tint-85)' : 'var(--ig-color-white-12)')};
    background: ${({ $active }) => ($active ? 'var(--ig-color-blue-tint-18)' : 'var(--ig-color-white-04)')};
    color: var(--ig-color-text-primary);
  }
`;

export const SetupMetaText = styled.div`
  color: var(--ig-color-white-70);
  font-size: var(--ig-font-size-xs);
  line-height: var(--ig-line-height-relaxed);
`;

// SetupInlineHint: ui FieldHint (PR-B1, 2026-05-09)

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
