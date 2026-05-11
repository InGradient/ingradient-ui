import type { MentionCandidate } from './mention-textarea'

export interface MentionRange {
  start: number
  end: number
  query: string
}

/** Detect mention range from caret position. Returns null if no trigger char before caret. */
export function detectMention(text: string, caretPos: number | null, trigger: string): MentionRange | null {
  if (caretPos === null || caretPos === 0) return null
  const before = text.slice(0, caretPos)
  const atIdx = before.lastIndexOf(trigger)
  if (atIdx === -1) return null
  if (atIdx > 0 && before[atIdx - 1] !== ' ' && before[atIdx - 1] !== '\n') return null
  const query = before.slice(atIdx + trigger.length)
  if (/\s/.test(query)) return null
  return { start: atIdx, end: caretPos, query }
}

/** Extract mention candidate ids from submitted text. */
export function extractMentionIds(text: string, candidates: MentionCandidate[], trigger: string): string[] {
  const ids: string[] = []
  for (const c of candidates) {
    if (text.includes(`${trigger}${c.name}`)) ids.push(c.id)
  }
  return ids
}
