/**
 * Story review status — § 23 Scenario Matrix 의 정적 한계 동적 보완.
 *
 * 각 storyId 별로 review 상태를 localStorage 에 저장.
 */

const STORAGE_KEY = 'ingradient-ui:review-status'

export type ReviewStatus = 'pending' | 'reviewed' | 'needs-work'

function safeRead(): Record<string, ReviewStatus> {
  if (typeof localStorage === 'undefined') return {}
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    return raw ? (JSON.parse(raw) as Record<string, ReviewStatus>) : {}
  } catch {
    return {}
  }
}

function safeWrite(map: Record<string, ReviewStatus>): void {
  if (typeof localStorage === 'undefined') return
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(map))
  } catch {
    // quota exceeded — silently ignore
  }
}

export function getReviewStatus(storyId: string): ReviewStatus {
  return safeRead()[storyId] ?? 'pending'
}

export function setReviewStatus(storyId: string, status: ReviewStatus): void {
  const map = safeRead()
  map[storyId] = status
  safeWrite(map)
}

export function clearReviewStatus(storyId: string): void {
  const map = safeRead()
  if (!(storyId in map)) return
  delete map[storyId]
  safeWrite(map)
}
