import styled, { keyframes } from 'styled-components';

const spin = keyframes`
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
`;

export const Spinner = styled.span`
  display: inline-block;
  width: var(--ig-space-6);
  height: var(--ig-space-6);
  border: var(--ig-border-2px) solid var(--ig-color-white-35);
  border-top-color: var(--ig-color-text-primary);
  border-radius: 50%;
  animation: ${spin} 0.7s linear infinite;
  vertical-align: var(--ig-space-neg-2px);
  margin-right: var(--ig-space-3);
`;

export const Wrap = styled.div`
  display: flex;
  flex-direction: column;
  gap: var(--ig-space-4);
  padding-top: var(--ig-space-4);
  border-top: var(--ig-border-1px) solid var(--ig-color-border-subtle);
`;

export const SectionTitle = styled.div`
  font-size: var(--ig-font-size-xs);
  font-weight: var(--ig-font-weight-bold);
  text-transform: uppercase;
  letter-spacing: var(--ig-letter-spacing-wide);
  color: var(--ig-color-text-muted);
`;

export const CollapsibleHeader = styled.button`
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 100%;
  padding: 0;
  background: none;
  border: none;
  cursor: pointer;
  font-size: var(--ig-font-size-xs);
  font-weight: var(--ig-font-weight-bold);
  text-transform: uppercase;
  letter-spacing: var(--ig-letter-spacing-wide);
  color: var(--ig-color-text-muted);
  &:hover { color: var(--ig-color-text-primary); }
  svg { transition: transform var(--ig-motion-swift) ease; }
`;

export const Row = styled.div`
  display: flex;
  flex-direction: column;
  gap: var(--ig-space-1);
`;

export const Label = styled.div`
  display: flex;
  justify-content: space-between;
  font-size: var(--ig-font-size-xs);
  color: var(--ig-color-text-secondary);
`;

export const LabelName = styled.span`
  color: var(--ig-color-text-muted);
`;

export const LabelValue = styled.span`
  color: var(--ig-color-text-primary);
  font-variant-numeric: tabular-nums;
`;

export const Slider = styled.input.attrs({ type: 'range' })`
  width: 100%;
  accent-color: var(--ig-color-blue-tint-90);
`;

export const Select = styled.select`
  width: 100%;
  height: var(--ig-control-height-xs);
  padding: 0 var(--ig-space-3);
  border-radius: var(--ig-radius-xs);
  border: var(--ig-border-1px) solid var(--ig-color-border-subtle);
  background: var(--ig-color-white-06);
  color: var(--ig-color-text-primary);
  font-size: var(--ig-font-size-sm);
  cursor: pointer;
  &:disabled {
    opacity: var(--ig-opacity-faded);
    cursor: not-allowed;
  }
  option {
    background: var(--ig-color-surface-panel);
    color: var(--ig-color-text-primary);
  }
  optgroup {
    background: var(--ig-color-surface-panel);
    color: var(--ig-color-text-soft);
    font-style: italic;
    font-weight: var(--ig-font-weight-semibold);
  }
`;

export const CheckRow = styled.label`
  display: inline-flex;
  align-items: center;
  gap: var(--ig-space-1);
  font-size: var(--ig-font-size-xs);
  color: var(--ig-color-text-secondary);
  cursor: pointer;
  user-select: none;
  white-space: nowrap;
  input[type='checkbox'] {
    accent-color: var(--ig-color-blue-tint-90);
    margin: 0;
  }
`;

/** 슬라이더 + 체크박스를 한 줄에 배치. 슬라이더가 남은 공간을 가져가고 체크박스는 우측. */
export const SliderInline = styled.div`
  display: flex;
  align-items: center;
  gap: var(--ig-space-3);
  input[type='range'] {
    flex: 1;
    min-width: 0;
  }
`;

export const Btn = styled.button<{ $primary?: boolean; $active?: boolean; $danger?: boolean }>`
  height: var(--ig-control-height-sm);
  border-radius: var(--ig-radius-xs);
  border: var(--ig-border-1px) solid ${(p) =>
    p.$danger ? 'var(--ig-color-red-tint-60)'
    : p.$active ? 'var(--ig-color-blue-tint-80)'
    : 'var(--ig-color-border-subtle)'};
  background: ${(p) =>
    p.$danger ? 'var(--ig-color-red-tint-15)'
    : p.$primary ? 'var(--ig-color-blue-tint-90)'
    : p.$active ? 'var(--ig-color-blue-tint-18)'
    : 'var(--ig-color-white-06)'};
  color: ${(p) =>
    p.$danger ? 'var(--ig-color-danger)'
    : p.$primary ? 'var(--ig-color-text-primary)'
    : 'var(--ig-color-text-primary)'};
  font-size: var(--ig-font-size-sm);
  font-weight: var(--ig-font-weight-semibold);
  cursor: pointer;
  &:hover {
    opacity: var(--ig-opacity-near);
  }
  &:disabled {
    opacity: var(--ig-opacity-faded);
    cursor: not-allowed;
  }
`;

export const BtnRow = styled.div`
  display: flex;
  gap: var(--ig-space-2);
`;

export const MetricRow = styled.div`
  display: flex;
  justify-content: space-between;
  font-size: var(--ig-font-size-xs);
  color: var(--ig-color-text-secondary);
  font-variant-numeric: tabular-nums;
`;

export const Warning = styled.div<{ $kind: 'info' | 'warn' }>`
  padding: var(--ig-space-2) 8px;
  border-radius: var(--ig-radius-xs);
  font-size: var(--ig-font-size-xs);
  font-weight: var(--ig-font-weight-semibold);
  background: ${(p) => (p.$kind === 'warn' ? 'rgba(255, 180, 60, 0.14)' : 'var(--ig-color-blue-tint-14)')};
  color: ${(p) => (p.$kind === 'warn' ? 'var(--ig-color-warning)' : 'var(--ig-color-accent-soft)')};
  border: var(--ig-border-1px) solid ${(p) => (p.$kind === 'warn' ? 'rgba(255, 180, 60, 0.35)' : 'var(--ig-color-blue-tint-35)')};
`;

// ── Setup Quality Indicator ─────────────────────────────────────────────────

export type QualityStatusValue =
  | 'good' | 'fair' | 'poor'
  | 'high' | 'medium' | 'low'
  | null;

export const QualityCard = styled.div`
  display: flex;
  flex-direction: column;
  gap: var(--ig-space-2);
  padding: var(--ig-space-3);
  background: var(--ig-color-white-04);
  border: var(--ig-border-1px) solid var(--ig-color-border-subtle);
  border-radius: var(--ig-radius-xs);
`;

export const QualityHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  font-size: var(--ig-font-size-sm);
`;

export const IndicatorRow = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  font-size: var(--ig-font-size-sm);
`;

export const QualityLabel = styled.span`
  color: var(--ig-color-text-muted);
`;

export const QualityStatus = styled.span<{ $status: QualityStatusValue }>`
  display: inline-flex;
  align-items: center;
  gap: var(--ig-space-2);
  font-weight: var(--ig-font-weight-bold);
  color: ${(p) =>
    p.$status === 'good' || p.$status === 'high' ? 'var(--ig-color-success)'
    : p.$status === 'fair' || p.$status === 'medium' ? 'var(--ig-color-warning)'
    : p.$status === 'poor' || p.$status === 'low' ? 'var(--ig-color-danger)'
    : 'var(--ig-color-text-muted)'};
  &::before {
    content: '';
    display: inline-block;
    width: var(--ig-space-3);
    height: var(--ig-space-3);
    border-radius: 50%;
    background: currentColor;
  }
`;

export const BestAxisValue = styled.span`
  font-weight: var(--ig-font-weight-bold);
  color: var(--ig-color-text-primary);
`;

export const IndicatorRight = styled.div`
  display: inline-flex;
  align-items: center;
  gap: var(--ig-space-3);
`;

export const IndicatorValue = styled.span`
  font-size: var(--ig-font-size-xs);
  color: var(--ig-color-text-muted);
  font-variant-numeric: tabular-nums;
`;

export const QualityDivider = styled.div`
  height: var(--ig-space-1px);
  background: var(--ig-color-border-subtle);
  margin: var(--ig-space-2px) 0;
`;

export const RoiSectionLabel = styled.div`
  font-size: var(--ig-font-size-xs);
  font-weight: var(--ig-font-weight-bold);
  text-transform: uppercase;
  letter-spacing: var(--ig-letter-spacing-wide);
  color: var(--ig-color-text-muted);
  margin-top: var(--ig-space-2px);
`;
