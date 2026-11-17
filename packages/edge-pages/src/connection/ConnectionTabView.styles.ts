import styled from 'styled-components';

// ── Camera Discovery ──
export const DeviceList = styled.div`display:flex;flex-direction:column;gap: var(--ig-spacing-8);max-height: var(--ig-popup-list-min);min-height:0;overflow-y:auto;padding-right: var(--ig-spacing-4);`;
// DeviceCard: 선택 가능한 list-row → ui SelectableListItem(variant="card") 로 이동 (2026-06-28)
export const DeviceInfo = styled.div`flex:1;min-width:0;`;
export const DeviceName = styled.div`font-size: var(--ig-text-body-sm);
  line-height: var(--ig-text-body-sm-leading);font-weight: var(--ig-font-weight-semibold);display:flex;align-items:center;gap: var(--ig-spacing-8);`;
export const DeviceMeta = styled.div`font-size: var(--ig-text-micro);
  line-height: var(--ig-text-micro-leading);color:var(--ig-color-text-muted);white-space:nowrap;overflow:hidden;text-overflow:ellipsis;`;
