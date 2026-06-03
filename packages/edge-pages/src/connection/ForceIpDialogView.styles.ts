import styled from 'styled-components';

export const Hint = styled.div`
  font-size: var(--ig-font-size-xs);
  color: var(--ig-color-text-soft);
  margin-bottom: 8px;
`;

export const RecRow = styled.div`
  font-size: var(--ig-font-size-xs);
  color: var(--ig-color-text-soft);
  margin-bottom: var(--ig-space-5);
  display: flex;
  align-items: center;
  gap: var(--ig-space-2);
`;

export const Field = styled.label`
  display: flex;
  flex-direction: column;
  gap: var(--ig-space-1);
  margin-bottom: 10px;
  font-size: var(--ig-font-size-sm);
`;

export const Input = styled.input`
  padding: var(--ig-space-2) 8px;
  font-size: var(--ig-font-size-sm);
  font-family: monospace;
  background: var(--ig-color-surface-panel);
  color: var(--ig-color-text-primary);
  border: var(--ig-border-1px) solid var(--ig-color-border-subtle);
  border-radius: var(--ig-radius-2xs);
`;

export const ModeRow = styled.div`
  display: flex;
  gap: var(--ig-space-5);
  margin-bottom: 10px;
  font-size: var(--ig-font-size-sm);
`;

export const ConfirmRow = styled.div`
  display: flex;
  align-items: flex-start;
  gap: var(--ig-space-2);
  margin: var(--ig-space-3) 0;
  font-size: var(--ig-font-size-xs);
  color: var(--ig-color-text-soft);
`;

export const ConflictText = styled.div`
  color: var(--ig-color-danger);
  font-size: var(--ig-font-size-xs);
  margin-bottom: 8px;
`;

export const ErrorText = styled.div`
  color: var(--ig-color-danger);
  font-size: var(--ig-font-size-xs);
  margin-bottom: 8px;
`;

export const SuccessText = styled.div`
  color: var(--ig-color-success);
  font-size: var(--ig-font-size-xs);
  margin-bottom: 8px;
`;

export const Footer = styled.div`
  display: flex;
  gap: var(--ig-space-3);
  justify-content: flex-end;
`;

export const PrefixSlash = styled.span`
  color: var(--ig-color-text-soft);
`;
