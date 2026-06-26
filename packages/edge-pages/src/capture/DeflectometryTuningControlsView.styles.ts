import styled from 'styled-components';

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
  background: ${(p) => (p.$kind === 'warn' ? 'rgba(255, 180, 60, 0.14)' : 'var(--ig-color-selection-bg)')};
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
