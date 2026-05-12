/**
 * Designer comments — storyId 별로 댓글 list 를 localStorage 에 저장. § 25.3 V2 의 마지막 항목.
 */

const STORAGE_KEY = 'ingradient-ui:comments'

export interface Comment {
  id: string
  author: string
  body: string
  createdAt: number
}

type CommentMap = Record<string, Comment[]>

function safeRead(): CommentMap {
  if (typeof localStorage === 'undefined') return {}
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    return raw ? (JSON.parse(raw) as CommentMap) : {}
  } catch {
    return {}
  }
}

function safeWrite(map: CommentMap): void {
  if (typeof localStorage === 'undefined') return
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(map))
  } catch {
    // quota exceeded — silently ignore
  }
}

export function listComments(storyId: string): Comment[] {
  return safeRead()[storyId] ?? []
}

export function addComment(storyId: string, author: string, body: string): Comment | null {
  const trimmed = body.trim()
  const trimmedAuthor = author.trim() || 'anonymous'
  if (!trimmed) return null
  const map = safeRead()
  const comment: Comment = {
    id: `c-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
    author: trimmedAuthor,
    body: trimmed,
    createdAt: Date.now(),
  }
  map[storyId] = [...(map[storyId] ?? []), comment]
  safeWrite(map)
  return comment
}

export function deleteComment(storyId: string, id: string): void {
  const map = safeRead()
  const list = map[storyId]
  if (!list) return
  map[storyId] = list.filter((c) => c.id !== id)
  safeWrite(map)
}

const AUTHOR_KEY = 'ingradient-ui:comments:author'

export function getStoredAuthor(): string {
  if (typeof localStorage === 'undefined') return ''
  try {
    return localStorage.getItem(AUTHOR_KEY) ?? ''
  } catch {
    return ''
  }
}

export function setStoredAuthor(author: string): void {
  if (typeof localStorage === 'undefined') return
  try {
    localStorage.setItem(AUTHOR_KEY, author)
  } catch {
    // ignore
  }
}
