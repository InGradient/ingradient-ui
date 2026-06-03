import styled from 'styled-components';
import { surfacePanel, surfaceRaised } from '@ingradient/ui';

// ── Layout ──
// Section / SectionTitle / FormGroup / FieldLabel: @ingradient/ui patterns 로 이동 (PR-0.1, 2026-05-09)
export const ActionRow = styled.div`display:flex;align-items:center;gap: var(--ig-space-5);flex-wrap:wrap;`;

// ── Guided Connection ──
export const GuideCard = styled.div`
  ${surfacePanel}
  display:grid;
  grid-template-columns:minmax(0,1fr) auto;
  gap: var(--ig-space-7);
  align-items:start;
  padding: var(--ig-space-7);
  border-radius: var(--ig-radius-xs);
  border:var(--ig-border-1px) solid var(--ig-color-border-subtle);
  margin-bottom: var(--ig-space-7);
  @media (max-width: 720px){ grid-template-columns:1fr; }
`;
export const GuideHeader = styled.div`display:flex;align-items:center;gap: var(--ig-space-4);margin-bottom: var(--ig-space-2);`;
export const GuideTitle = styled.div`font-size:var(--ig-font-size-lg);font-weight: var(--ig-font-weight-bold);color:var(--ig-color-text-primary);`;
export const GuideSummary = styled.div`font-size:var(--ig-font-size-xs);color:var(--ig-color-text-secondary);line-height: var(--ig-line-height-relaxed);`;
export const GuideActions = styled.div`display:flex;align-items:center;justify-content:flex-end;gap: var(--ig-space-3);flex-wrap:wrap;`;
export const GuideWarningList = styled.div`display:flex;flex-direction:column;gap: var(--ig-space-1);margin-top: var(--ig-space-4);`;
export const GuideWarning = styled.div`font-size:var(--ig-font-size-2xs);color:var(--ig-color-warning);line-height: var(--ig-line-height-snug);`;
export const NetworkSummaryGrid = styled.div`display:grid;grid-template-columns:repeat(4,minmax(0,1fr));gap: var(--ig-space-3);margin:10px 0 0;@media (max-width: 860px){grid-template-columns:repeat(2,minmax(0,1fr));}`;
export const NetworkSummaryItem = styled.div`
  ${surfaceRaised}
  padding: var(--ig-space-3) 10px;
  border-radius:var(--ig-radius-xs);
  min-width:0;
`;
export const NetworkSummaryLabel = styled.div`font-size:var(--ig-font-size-2xs);text-transform:uppercase;letter-spacing:.04em;color:var(--ig-color-text-muted);margin-bottom: var(--ig-space-2px);`;
export const NetworkSummaryValue = styled.div`font-size:var(--ig-font-size-xs);font-weight: var(--ig-font-weight-semibold);color:var(--ig-color-text-primary);white-space:nowrap;overflow:hidden;text-overflow:ellipsis;`;

// ── Camera Discovery ──
export const DiscoverBar = styled.div`display:flex;align-items:center;gap: var(--ig-space-4);margin-bottom: var(--ig-space-5);`;
export const DiscoverHint = styled.span`font-size: var(--ig-font-size-2xs);color:var(--ig-color-text-soft);`;
export const DeviceList = styled.div`display:flex;flex-direction:column;gap: var(--ig-space-2);max-height: 200px;min-height:0;overflow-y:auto;padding-right:4px;`;
export const DeviceCard = styled.button<{$selected?:boolean}>`
  ${surfaceRaised}
  display:flex;
  align-items:center;
  gap: var(--ig-space-5);
  padding: var(--ig-space-4) 14px;
  border-radius: var(--ig-radius-xs);
  border:var(--ig-border-1px) solid ${p=>p.$selected?'var(--ig-color-accent-border-strong)':'var(--ig-color-border-subtle)'};
  background:${p=>p.$selected?'var(--ig-color-accent-soft-surface)':'var(--ig-color-surface-interactive)'};
  color:var(--ig-color-text-primary);
  cursor:pointer;
  text-align:left;
  transition:all .15s;
  &:hover{
    border-color:var(--ig-color-accent-border-strong);
    background:var(--ig-color-surface-interactive-hover);
  }
`;
export const DeviceInfo = styled.div`flex:1;min-width:0;`;
export const DeviceName = styled.div`font-size: var(--ig-font-size-sm);font-weight: var(--ig-font-weight-semibold);display:flex;align-items:center;gap: var(--ig-space-3);`;
export const DeviceMeta = styled.div`font-size: var(--ig-font-size-2xs);color:var(--ig-color-text-muted);margin-top: var(--ig-space-2px);white-space:nowrap;overflow:hidden;text-overflow:ellipsis;`;
export const DeviceSelectedTag = styled.span`font-size: var(--ig-font-size-2xs);color:var(--ig-color-success);font-weight: var(--ig-font-weight-bold);`;

// ── Activity Log ──
export const LogArea = styled.div`
  ${surfacePanel}
  max-height:120px;
  min-height:0;
  overflow-y:auto;
  padding: var(--ig-space-4);
  border-radius: var(--ig-radius-xs);
  font-family:'JetBrains Mono',monospace;
  font-size: var(--ig-font-size-2xs);
`;
export const LogEntryLine = styled.div<{$type:'info'|'error'|'success'}>`padding: var(--ig-space-3px) 6px;font-size: var(--ig-font-size-2xs);color:${p=>p.$type==='error'?'var(--ig-color-danger)':p.$type==='success'?'var(--ig-color-success)':'var(--ig-color-text-secondary)'};`;

// ── Recovery / NIC Status ──
export const NicStatusText = styled.span<{$ok:boolean}>`display:inline-flex;align-items:center;gap:5px;font-size: var(--ig-font-size-xs);color:${p=>p.$ok?'var(--ig-color-success,var(--ig-color-success))':'var(--ig-color-danger,var(--ig-color-danger))'};`;
export const NicDetailText = styled.span`font-size: var(--ig-font-size-2xs);color:var(--ig-color-success,var(--ig-color-success));margin-left:4px;`;

// ── GigE Advanced ──
export const GigeHint = styled.div`font-size: var(--ig-font-size-2xs);color:var(--ig-color-text-soft);line-height: var(--ig-line-height-relaxed);`;
export const GevscpdLabelRow = styled.div`display:flex;align-items:center;justify-content:space-between;gap: var(--ig-space-3);margin-bottom: var(--ig-space-1);`;
export const GevscpdModeRow = styled.div`display:flex;align-items:center;gap: var(--ig-space-2);`;
export const GevscpdModeLabel = styled.span<{$active:boolean}>`font-size: var(--ig-font-size-2xs);font-weight:${p=>p.$active?600:400};color:${p=>p.$active?'var(--ig-color-text-primary)':'var(--ig-color-text-soft)'};transition:color .15s;`;
export const GevscpdReadout = styled.div`
  ${surfacePanel}
  font-size: var(--ig-font-size-xs);
  color:var(--ig-color-text-secondary);
  padding: var(--ig-space-2) 10px;
  border-radius: var(--ig-radius-xs);
`;
export const GevscpdPresetRow = styled.div`display:flex;align-items:center;gap: var(--ig-space-3);flex-wrap:wrap;margin-bottom: var(--ig-space-3);`;
export const GevscpdManualRow = styled.div`display:flex;align-items:center;gap: var(--ig-space-3);`;
export const GevscpdUnit = styled.span`font-size: var(--ig-font-size-xs);color:var(--ig-color-text-muted);`;
export const GevscpdUs = styled.span`font-size: var(--ig-font-size-xs);color:var(--ig-color-accent);font-weight: var(--ig-font-weight-medium);`;

// ── Diagnostics Cards ──
export const DiagActionRow = styled.div`display:flex;align-items:center;gap: var(--ig-space-3);margin-bottom: var(--ig-space-5);`;
export const GigeDiagCard = styled.div`
  ${surfacePanel}
  border-radius: var(--ig-radius-xs);
  overflow:hidden;
`;
// DiagRow / DiagLabel / DiagValue: @ingradient/ui InfoRow 로 이동 (PR-0.2, 2026-05-09)
export const DiagDivider = styled.div`height:1px;background:var(--ig-color-border-subtle);`;
export const DiagRecommendTitle = styled.div`font-size: var(--ig-font-size-2xs);color:var(--ig-color-text-muted);text-transform:uppercase;letter-spacing:.04em;padding: var(--ig-space-2) 12px 2px;`;
export const DiagRecRow = styled.div<{$severity:'warn'|'info'}>`display:flex;align-items:flex-start;gap: var(--ig-space-2);padding: 5px 12px;font-size: var(--ig-font-size-xs);color:${p=>p.$severity==='warn'?'var(--ig-color-warning)':p.$severity==='info'?'var(--ig-color-accent)':'var(--ig-color-success)'};line-height: var(--ig-line-height-relaxed);svg{flex-shrink:0;margin-top: var(--ig-space-2px);}`;

// ── Diagnostic Report ──
export const DiagReportWrap = styled.div`
  ${surfacePanel}
  margin-top: var(--ig-space-5);
  border-radius: var(--ig-radius-xs);
  overflow:hidden;
`;
export const DiagReportToolbar = styled.div`
  ${surfacePanel}
  display:flex;
  gap: var(--ig-space-2);
  padding: var(--ig-space-3) 10px;
  border-bottom: var(--ig-space-1px) solid var(--ig-color-border-subtle);
`;
export const DiagReportText = styled.pre`margin:0;padding: var(--ig-space-5);max-height: var(--ig-popup-md);min-height:0;overflow-y:auto;font-family:'JetBrains Mono',monospace;font-size: var(--ig-font-size-2xs);line-height: var(--ig-line-height-relaxed);color:var(--ig-color-text-secondary);background:var(--ig-color-surface-muted);white-space:pre-wrap;word-break:break-all;`;
export const DiagResultMsg = styled.div<{$ok:boolean}>`margin-top: var(--ig-space-3);font-size: var(--ig-font-size-xs);padding: var(--ig-space-3) 10px;border-radius: var(--ig-radius-xs);background:${p=>p.$ok?'rgba(34,197,94,0.08)':'var(--ig-color-red-tint-08)'};color:${p=>p.$ok?'var(--ig-color-success)':'var(--ig-color-danger)'};word-break:break-all;`;

// DiagStepList / DiagStepRow / DiagStepIcon / DiagStepLabel: ui StepIndicator 로 이동 (PR-B2, 2026-05-09)
export const ProgressWrap = styled.div`margin-top: var(--ig-space-5);height:6px;border-radius: var(--ig-space-3px);background:var(--ig-color-border-subtle);overflow:hidden;position:relative;`;
export const ProgressBar = styled.div`height:100%;border-radius: var(--ig-space-3px);background:var(--ig-color-accent);transition:width 0.3s ease;`;
export const ProgressLabel = styled.div`font-size: var(--ig-font-size-2xs);color:var(--ig-color-text-muted);text-align:right;margin-top: var(--ig-space-1);`;

// ── DLL Path ──
export const DllPathRow = styled.div`display:flex;align-items:center;gap: var(--ig-space-2);`;
export const DllHint = styled.div`font-size: var(--ig-font-size-2xs);color:var(--ig-color-text-soft);margin-top: var(--ig-space-2);`;

