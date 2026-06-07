import { iconSizeNumbers } from '@ingradient/ui'
import { Button, ProgressBar, UploadDropzone } from '@ingradient/ui/components'
import {
  ErrorHintInline,
  Hint,
  ReportBox,
  ReportGrid,
  ReportStat,
  Section,
  SectionTitle,
  SectionTitleMt,
  StatusPillMb,
  WarningBox,
} from './edge.styles'
import { getEdgeStatusTone } from './edge-status-tone'
import type { EdgeImportJobView } from './edge-types'

const PROGRESS_WRAP_STYLE: React.CSSProperties = {
  width: '100%',
  maxWidth: 'var(--ig-popup-2xl-narrow)',
  margin: 'var(--ig-space-5) auto 0',
}

const PROGRESS_LABEL_STYLE: React.CSSProperties = {
  marginTop: 'var(--ig-space-2)',
  fontSize: iconSizeNumbers.xs,
  color: 'var(--ig-color-text-muted)',
  fontVariantNumeric: 'tabular-nums',
}

const DROPZONE_WRAP_STYLE: React.CSSProperties = { marginTop: 'var(--ig-space-7)' }

export interface ImportTabUIProps {
  /** 현재 import job 상태. null 이면 dropzone 만 표시. */
  job: EdgeImportJobView | null
  /** Upload 진행 중인지 여부. dropzone disable + progress 표시 결정. */
  busy: boolean
  /** Upload 진행률 (0~100). */
  pct: number
  /** Progress label (예: "Uploading 12 MB"). */
  label: string
  /** Cancel 진행 중인지. cancel 버튼 disable. */
  cancelling?: boolean
  /** Dropzone 에 파일이 떨어졌을 때 호출. caller 가 import 시작. */
  onFiles: (files: File[]) => void
  /** Cancel 버튼 클릭 시 호출. */
  onCancel: () => void
}

/**
 * Edge 결과 import tab UI. Platform 의 `ImportTab` 의 pure UI 추출.
 * `useImportTab()` hook 의 return shape 을 그대로 props 로 받음.
 */
export function ImportTabUI({ job, busy, pct, label, cancelling = false, onFiles, onCancel }: ImportTabUIProps) {
  const report = job?.report

  return (
    <>
      <Section>
        <SectionTitle>Import Edge Results</SectionTitle>
        <Hint>
          Drop the ZIP file exported from an Edge device. Each image_id found in the platform will be overwritten; new
          images will be created.
        </Hint>
        <div style={DROPZONE_WRAP_STYLE}>
          <UploadDropzone accept=".igp,.ige,.zip" multiple={false} disabled={busy} onFiles={onFiles}>
            {busy ? (
              <div>
                <div>{label}</div>
                <div style={PROGRESS_WRAP_STYLE}>
                  <ProgressBar value={pct} />
                </div>
                <div style={PROGRESS_LABEL_STYLE}>{pct}%</div>
                <div style={{ marginTop: 'var(--ig-space-5)' }}>
                  <Button
                    variant="secondary"
                    onClick={(e) => {
                      e.stopPropagation()
                      onCancel()
                    }}
                    disabled={cancelling}
                  >
                    {cancelling ? 'Cancelling…' : 'Cancel'}
                  </Button>
                </div>
              </div>
            ) : (
              'Drop .igp or .zip here or click to select'
            )}
          </UploadDropzone>
        </div>
      </Section>

      {job && (
        <Section>
          <SectionTitle>Import Result</SectionTitle>
          <StatusPillMb tone={getEdgeStatusTone(job.status)}>{job.status}</StatusPillMb>
          {job.status === 'failed' && job.error && <WarningBox>{job.error}</WarningBox>}
          {report && (
            <ReportBox>
              <ReportGrid>
                <ReportStat>
                  <span>{report.total}</span>
                  <span>Total</span>
                </ReportStat>
                <ReportStat>
                  <span>{report.imported_new}</span>
                  <span>New</span>
                </ReportStat>
                <ReportStat>
                  <span>{report.overwritten}</span>
                  <span>Overwritten</span>
                </ReportStat>
                <ReportStat>
                  <span>{report.failed}</span>
                  <span>Failed</span>
                </ReportStat>
              </ReportGrid>
              {report.failed_details.length > 0 && (
                <>
                  <SectionTitleMt>Errors</SectionTitleMt>
                  {report.failed_details.map((detail, index) => (
                    <ErrorHintInline key={index}>
                      {detail.file}: {detail.reason}
                    </ErrorHintInline>
                  ))}
                </>
              )}
            </ReportBox>
          )}
        </Section>
      )}
    </>
  )
}
