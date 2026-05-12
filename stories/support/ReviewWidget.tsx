import React, { useState } from 'react'
import { getReviewStatus, setReviewStatus, type ReviewStatus } from './review-status'

/**
 * 페이지 story 우하단 fixed widget — 디자이너가 현재 story 의 review 상태를 표시/변경.
 * Phase 15 / § 23 Scenario Matrix 동적 보완.
 */

const containerStyle: React.CSSProperties = {
  position: 'fixed',
  right: 16,
  bottom: 16,
  zIndex: 9999,
  background: 'var(--ig-color-surface-raised)',
  border: '1px solid var(--ig-color-border-subtle)',
  borderRadius: 12,
  padding: 'var(--ig-space-3) var(--ig-space-4)',
  boxShadow: 'var(--ig-shadow-floating)',
  display: 'flex',
  flexDirection: 'column',
  gap: 'var(--ig-space-2)',
  fontSize: 'var(--ig-font-size-xs)',
  fontFamily: 'var(--ig-font-sans)',
  minWidth: 220,
}

const labelStyle: React.CSSProperties = {
  color: 'var(--ig-color-text-muted)',
  textTransform: 'uppercase',
  fontWeight: 600,
  letterSpacing: '0.04em',
}

const rowStyle: React.CSSProperties = {
  display: 'flex',
  gap: 'var(--ig-space-1)',
}

const btnBase: React.CSSProperties = {
  flex: 1,
  padding: 'var(--ig-space-1) var(--ig-space-2)',
  border: '1px solid var(--ig-color-border-subtle)',
  borderRadius: 6,
  fontSize: 'var(--ig-font-size-xs)',
  fontWeight: 600,
  cursor: 'pointer',
  background: 'transparent',
  color: 'var(--ig-color-text-secondary)',
}

const colors: Record<ReviewStatus, { bg: string; fg: string; border: string }> = {
  pending: {
    bg: 'var(--ig-color-surface-muted)',
    fg: 'var(--ig-color-text-secondary)',
    border: 'var(--ig-color-border-strong)',
  },
  reviewed: {
    bg: 'var(--ig-color-success-soft, rgba(34, 197, 94, 0.16))',
    fg: 'var(--ig-color-success, #22c55e)',
    border: 'var(--ig-color-success, #22c55e)',
  },
  'needs-work': {
    bg: 'var(--ig-color-warning-soft, rgba(245, 158, 11, 0.16))',
    fg: 'var(--ig-color-warning, #f59e0b)',
    border: 'var(--ig-color-warning, #f59e0b)',
  },
}

const labels: Record<ReviewStatus, string> = {
  pending: 'Pending',
  reviewed: 'Reviewed',
  'needs-work': 'Needs work',
}

interface Props {
  storyId: string
}

export function ReviewWidget({ storyId }: Props) {
  const [status, setStatus] = useState<ReviewStatus>(() => getReviewStatus(storyId))

  const handleSet = (next: ReviewStatus) => {
    setReviewStatus(storyId, next)
    setStatus(next)
  }

  const current = colors[status]

  return (
    <div style={containerStyle} aria-label="Story review status">
      <span style={labelStyle}>Review status</span>
      <span
        style={{
          padding: '2px 8px',
          borderRadius: 999,
          background: current.bg,
          color: current.fg,
          border: `1px solid ${current.border}`,
          fontWeight: 600,
          display: 'inline-block',
          alignSelf: 'flex-start',
        }}
      >
        {labels[status]}
      </span>
      <div style={rowStyle}>
        {(['pending', 'reviewed', 'needs-work'] as ReviewStatus[]).map((s) => {
          const active = s === status
          return (
            <button
              key={s}
              type="button"
              onClick={() => handleSet(s)}
              style={{
                ...btnBase,
                background: active ? colors[s].bg : 'transparent',
                color: active ? colors[s].fg : btnBase.color,
                borderColor: active ? colors[s].border : 'var(--ig-color-border-subtle)',
              }}
            >
              {labels[s]}
            </button>
          )
        })}
      </div>
    </div>
  )
}
