import styled from 'styled-components';
import { media } from '@ingradient/ui';
import { surfacePanel, surfaceRaised } from '@ingradient/ui';

// ── Guided Connection ──
export const GuideCard = styled.div`
  ${surfacePanel}
  display:grid;
  grid-template-columns:minmax(0,1fr) auto;
  gap: var(--ig-spacing-16);
  align-items:start;
  padding: var(--ig-spacing-16);
  border-radius: var(--ig-radius-xs);
  border:var(--ig-border-1px) solid var(--ig-color-border-subtle);
  margin-bottom: var(--ig-spacing-16);
  ${media.smPlus}{ grid-template-columns:1fr; }
`;
export const GuideSummary = styled.div`font-size:var(--ig-text-caption);color:var(--ig-color-text-secondary);line-height: var(--ig-line-height-relaxed);`;
export const GuideWarning = styled.div`font-size:var(--ig-text-micro);color:var(--ig-color-warning);line-height: var(--ig-line-height-snug);`;
export const NetworkSummaryGrid = styled.div`display:grid;grid-template-columns:repeat(4,minmax(0,1fr));gap: var(--ig-spacing-8);margin:var(--ig-spacing-8) 0 0;${media.mdWide}{grid-template-columns:repeat(2,minmax(0,1fr));}`;
export const NetworkSummaryItem = styled.div`
  ${surfaceRaised}
  padding: var(--ig-spacing-8) var(--ig-spacing-8);
  border-radius:var(--ig-radius-xs);
  min-width:0;
`;
export const NetworkSummaryValue = styled.div`font-size:var(--ig-text-caption);font-weight: var(--ig-font-weight-semibold);color:var(--ig-color-text-primary);white-space:nowrap;overflow:hidden;text-overflow:ellipsis;`;

// ── Camera Discovery ──
export const DeviceList = styled.div`display:flex;flex-direction:column;gap: var(--ig-spacing-8);max-height: var(--ig-popup-list-min);min-height:0;overflow-y:auto;padding-right: var(--ig-spacing-4);`;
// DeviceCard: 선택 가능한 list-row → ui SelectableListItem(variant="card") 로 이동 (2026-06-28)
export const DeviceInfo = styled.div`flex:1;min-width:0;`;
export const DeviceName = styled.div`font-size: var(--ig-text-body-sm);font-weight: var(--ig-font-weight-semibold);display:flex;align-items:center;gap: var(--ig-spacing-8);`;
export const DeviceMeta = styled.div`font-size: var(--ig-text-micro);color:var(--ig-color-text-muted);margin-top: var(--ig-spacing-2);white-space:nowrap;overflow:hidden;text-overflow:ellipsis;`;

// ── Activity Log ──
export const LogArea = styled.div`
  ${surfacePanel}
  max-height: var(--ig-popup-2xs-narrow);
  min-height:0;
  overflow-y:auto;
  padding: var(--ig-spacing-8);
  border-radius: var(--ig-radius-xs);
  font-family:var(--ig-font-mono);
  font-size: var(--ig-text-micro);
`;
export const LogEntryLine = styled.div<{$type:'info'|'error'|'success'}>`padding: var(--ig-spacing-4) var(--ig-spacing-8);font-size: var(--ig-text-micro);color:${p=>p.$type==='error'?'var(--ig-color-danger)':p.$type==='success'?'var(--ig-color-success)':'var(--ig-color-text-secondary)'};`;

// ── Recovery / NIC Status ──
export const NicStatusText = styled.span<{$ok:boolean}>`display:inline-flex;align-items:center;gap: var(--ig-spacing-4);font-size: var(--ig-text-caption);color:${p=>p.$ok?'var(--ig-color-success,var(--ig-color-success))':'var(--ig-color-danger,var(--ig-color-danger))'};`;

// ── GigE Advanced ──
export const GigeHint = styled.div`font-size: var(--ig-text-micro);color:var(--ig-color-text-soft);line-height: var(--ig-line-height-relaxed);`;
export const GevscpdModeLabel = styled.span<{$active:boolean}>`font-size: var(--ig-text-micro);font-weight:${p=>p.$active?'var(--ig-font-weight-semibold)':'var(--ig-font-weight-regular)'};color:${p=>p.$active?'var(--ig-color-text-primary)':'var(--ig-color-text-soft)'};transition:color var(--ig-motion-swift);`;
export const GevscpdReadout = styled.div`
  ${surfacePanel}
  font-size: var(--ig-text-caption);
  color:var(--ig-color-text-secondary);
  padding: var(--ig-spacing-8) var(--ig-spacing-8);
  border-radius: var(--ig-radius-xs);
`;
export const GevscpdUs = styled.span`font-size: var(--ig-text-caption);color:var(--ig-color-accent);font-weight: var(--ig-font-weight-medium);`;

// ── Diagnostics Cards ──
export const DiagActionRow = styled.div`display:flex;align-items:center;gap: var(--ig-spacing-8);margin-bottom: var(--ig-spacing-12);`;
export const GigeDiagCard = styled.div`
  ${surfacePanel}
  border-radius: var(--ig-radius-xs);
  overflow:hidden;
`;
// DiagRow / DiagLabel / DiagValue: @ingradient/ui InfoRow 로 이동 (PR-0.2, 2026-05-09)
export const DiagRecommendTitle = styled.div`font-size: var(--ig-text-micro);color:var(--ig-color-text-muted);text-transform:uppercase;letter-spacing: var(--ig-letter-spacing-normal);padding: var(--ig-spacing-8) var(--ig-spacing-12) var(--ig-spacing-2);`;
export const DiagRecRow = styled.div<{$severity:'warn'|'info'}>`display:flex;align-items:flex-start;gap: var(--ig-spacing-8);padding: var(--ig-spacing-4) var(--ig-spacing-12);font-size: var(--ig-text-caption);color:${p=>p.$severity==='warn'?'var(--ig-color-warning)':p.$severity==='info'?'var(--ig-color-accent)':'var(--ig-color-success)'};line-height: var(--ig-line-height-relaxed);svg{flex-shrink:0;margin-top: var(--ig-spacing-2);}`;

// ── Diagnostic Report ──
export const DiagReportWrap = styled.div`
  ${surfacePanel}
  margin-top: var(--ig-spacing-12);
  border-radius: var(--ig-radius-xs);
  overflow:hidden;
`;
export const DiagReportToolbar = styled.div`
  ${surfacePanel}
  display:flex;
  gap: var(--ig-spacing-8);
  padding: var(--ig-spacing-8) var(--ig-spacing-8);
  border-bottom: var(--ig-space-1px) solid var(--ig-color-border-subtle);
`;
export const DiagReportText = styled.pre`margin:0;padding: var(--ig-spacing-12);max-height: var(--ig-popup-md);min-height:0;overflow-y:auto;font-family:var(--ig-font-mono);font-size: var(--ig-text-micro);line-height: var(--ig-line-height-relaxed);color:var(--ig-color-text-secondary);background:var(--ig-color-surface-muted);white-space:pre-wrap;word-break:break-all;`;
export const DiagResultMsg = styled.div<{$ok:boolean}>`margin-top: var(--ig-spacing-8);font-size: var(--ig-text-caption);padding: var(--ig-spacing-8) var(--ig-spacing-8);border-radius: var(--ig-radius-xs);background:${p=>p.$ok?'var(--ig-color-alert-success-bg)':'var(--ig-color-danger-bg-soft)'};color:${p=>p.$ok?'var(--ig-color-success)':'var(--ig-color-danger)'};word-break:break-all;`;

// DiagStepList / DiagStepRow / DiagStepIcon / DiagStepLabel: ui StepIndicator 로 이동 (PR-B2, 2026-05-09)
// ProgressWrap/ProgressBar/ProgressLabel: 미사용 죽은코드 제거 (2026-06-28 재검토). 진행률 필요 시 ui ProgressBar 사용.

// ── DLL Path ──
