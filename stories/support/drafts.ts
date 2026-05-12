/**
 * Storybook builders 용 localStorage drafts CRUD.
 *
 * scope namespace 로 ThemeBuilder / PageComposer / LayoutComposer 의 drafts 를 분리 저장.
 */

const STORAGE_PREFIX = 'ingradient-ui:drafts'

export interface Draft<TArgs> {
  name: string
  args: TArgs
  savedAt: number
}

function storageKey(scope: string): string {
  return `${STORAGE_PREFIX}:${scope}`
}

function safeRead<TArgs>(scope: string): Record<string, Draft<TArgs>> {
  if (typeof localStorage === 'undefined') return {}
  try {
    const raw = localStorage.getItem(storageKey(scope))
    return raw ? (JSON.parse(raw) as Record<string, Draft<TArgs>>) : {}
  } catch {
    return {}
  }
}

function safeWrite<TArgs>(scope: string, drafts: Record<string, Draft<TArgs>>): void {
  if (typeof localStorage === 'undefined') return
  try {
    localStorage.setItem(storageKey(scope), JSON.stringify(drafts))
  } catch {
    // quota exceeded — silently ignore
  }
}

/**
 * scope 의 모든 drafts 를 savedAt 내림차순으로 반환.
 */
export function listDrafts<TArgs>(scope: string): Draft<TArgs>[] {
  const map = safeRead<TArgs>(scope)
  return Object.values(map).sort((a, b) => b.savedAt - a.savedAt)
}

/**
 * draft 저장 (같은 name 있으면 overwrite).
 */
export function saveDraft<TArgs>(scope: string, name: string, args: TArgs): void {
  const trimmed = name.trim()
  if (!trimmed) return
  const map = safeRead<TArgs>(scope)
  map[trimmed] = { name: trimmed, args, savedAt: Date.now() }
  safeWrite(scope, map)
}

/**
 * draft 삭제.
 */
export function deleteDraft(scope: string, name: string): void {
  const map = safeRead<unknown>(scope)
  if (!(name in map)) return
  delete map[name]
  safeWrite(scope, map)
}
