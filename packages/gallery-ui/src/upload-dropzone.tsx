import React, { useCallback, useRef } from 'react'
import styled from 'styled-components'
import type { UploadFileState } from './types'

// --- UploadDropzone ---
const UploadRoot = styled.div`
  flex-shrink: 0;
`
const DropWrap = styled.div`
  border: 1px dashed rgba(141, 161, 183, 0.4);
  border-radius: 16px;
  padding: 24px;
  text-align: center;
  color: var(--portal-text-muted);
  cursor: pointer;
  background: rgba(255, 255, 255, 0.03);
  transition:
    border-color 0.16s ease,
    background-color 0.16s ease,
    color 0.16s ease;

  &:hover {
    border-color: rgba(91, 144, 255, 0.48);
    background: rgba(77, 136, 255, 0.08);
    color: var(--portal-text-primary);
  }
`
const UploadStatus = styled.div`
  margin-top: 12px;
`
const ProgressTrack = styled.div`
  height: 8px;
  background: rgba(255, 255, 255, 0.08);
  border-radius: 4px;
  overflow: hidden;
`
const ProgressFill = styled.div<{ $pct: number }>`
  height: 100%;
  width: ${(p) => p.$pct}%;
  background: linear-gradient(135deg, var(--portal-accent) 0%, var(--portal-accent-strong) 100%);
  border-radius: 4px;
  transition: width 0.15s ease-out;
`
const UploadSummary = styled.div`
  margin-top: 6px;
  font-size: 13px;
  color: var(--portal-text-secondary);
`
const UploadErrorHint = styled.span`
  color: var(--portal-danger);
  margin-left: 8px;
`

export interface UploadDropzoneProps {
  onFiles: (files: File[]) => void
  uploads: UploadFileState[]
  onRetry: (index: number) => void
  /** true면 드롭 칸 숨기고 업로드 진행/완료만 표시 */
  hideDropZone?: boolean
}

export function UploadDropzone({ onFiles, uploads, onRetry, hideDropZone = false }: UploadDropzoneProps) {
  const inputRef = useRef<HTMLInputElement>(null)

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault()
      const files = Array.from(e.dataTransfer.files)
      if (files.length) onFiles(files)
    },
    [onFiles]
  )
  const handleDragOver = useCallback((e: React.DragEvent) => e.preventDefault(), [])
  const handleClick = useCallback(() => inputRef.current?.click(), [])
  const handleChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const files = Array.from(e.target.files ?? [])
      if (files.length) onFiles(files)
      e.target.value = ''
    },
    [onFiles]
  )

  return (
    <UploadRoot>
      {!hideDropZone && (
        <DropWrap onDrop={handleDrop} onDragOver={handleDragOver} onClick={handleClick}>
          <input
            ref={inputRef}
            type="file"
            multiple
            accept="image/*"
            style={{ display: 'none' }}
            aria-label="Upload images"
            title="Upload images"
            onChange={handleChange}
          />
          Drag files here or click to upload
        </DropWrap>
      )}
      {uploads.length > 0 && (
        <UploadStatus>
          {(() => {
            const allDone = uploads.every((u) => u.done || u.error)
            const errorCount = uploads.filter((u) => u.error).length
            const avgProgress =
              uploads.length === 0
                ? 0
                : Math.round(
                    uploads.reduce((sum, u) => sum + (u.done ? 100 : u.progress ?? 0), 0) / uploads.length
                  )
            if (allDone) {
              return (
                <UploadSummary>
                  {uploads.length} uploaded
                  {errorCount > 0 && (
                    <UploadErrorHint>
                      ({errorCount} failed)
                      <button
                        type="button"
                        onClick={() => uploads.forEach((u, i) => u.error && onRetry(i))}
                        style={{
                          marginLeft: 6,
                          background: 'none',
                          border: 'none',
                          color: 'var(--portal-accent-soft)',
                          cursor: 'pointer',
                          fontSize: 'inherit',
                        }}
                      >
                        Retry
                      </button>
                    </UploadErrorHint>
                  )}
                </UploadSummary>
              )
            }
            return (
              <>
                <ProgressTrack>
                  <ProgressFill $pct={avgProgress} />
                </ProgressTrack>
                <UploadSummary>Uploading {uploads.length} file(s)…</UploadSummary>
              </>
            )
          })()}
        </UploadStatus>
      )}
    </UploadRoot>
  )
}
