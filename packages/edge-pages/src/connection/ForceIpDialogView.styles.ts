import styled from 'styled-components';

export const Hint = styled.div`
  font-size: 12px;
  color: var(--ig-color-text-soft);
  margin-bottom: 8px;
`;

export const RecRow = styled.div`
  font-size: 12px;
  color: var(--ig-color-text-soft);
  margin-bottom: 12px;
  display: flex;
  align-items: center;
  gap: 6px;
`;

export const Field = styled.label`
  display: flex;
  flex-direction: column;
  gap: 4px;
  margin-bottom: 10px;
  font-size: 13px;
`;

export const Input = styled.input`
  padding: 6px 8px;
  font-size: 13px;
  font-family: monospace;
  background: var(--ig-color-surface-panel);
  color: var(--ig-color-text-primary);
  border: 1px solid var(--ig-color-border-subtle);
  border-radius: 4px;
`;

export const ModeRow = styled.div`
  display: flex;
  gap: 12px;
  margin-bottom: 10px;
  font-size: 13px;
`;

export const ConfirmRow = styled.div`
  display: flex;
  align-items: flex-start;
  gap: 6px;
  margin: 8px 0;
  font-size: 12px;
  color: var(--ig-color-text-soft);
`;

export const ConflictText = styled.div`
  color: var(--ig-color-danger);
  font-size: 12px;
  margin-bottom: 8px;
`;

export const ErrorText = styled.div`
  color: var(--ig-color-danger);
  font-size: 12px;
  margin-bottom: 8px;
`;

export const SuccessText = styled.div`
  color: var(--ig-color-success);
  font-size: 12px;
  margin-bottom: 8px;
`;

export const Footer = styled.div`
  display: flex;
  gap: 8px;
  justify-content: flex-end;
`;

export const PrefixSlash = styled.span`
  color: var(--ig-color-text-soft);
`;
