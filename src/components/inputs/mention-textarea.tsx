import React, { useState, useCallback, useRef, useMemo, useEffect } from 'react'
import styled from 'styled-components'
import { controlField } from '../../primitives'

// ── Styled ─────────────────────────────────────────────────────────

const Wrap = styled.div`
  position: relative;
  width: 100%;
`

const Textarea = styled.textarea`
  ${controlField}
  font-size: var(--ig-font-size-xs);
  resize: vertical;
  min-height: 60px;
`

const Menu = styled.div`
  position: absolute;
  bottom: 100%;
  left: 0;
  right: 0;
  max-height: 160px;
  overflow-y: auto;
  background: var(--ig-color-surface-raised);
  border: 1px solid var(--ig-color-border-subtle);
  border-radius: var(--ig-radius-sm);
  box-shadow: var(--ig-shadow-md);
  z-index: var(--ig-z-dropdown);
`

const Option = styled.button<{ $active: boolean }>`
  display: flex;
  flex-direction: column;
  width: 100%;
  padding: var(--ig-space-3) var(--ig-space-4);
  border: none;
  background: ${(p) => (p.$active ? 'var(--ig-color-surface-interactive)' : 'transparent')};
  color: var(--ig-color-text-primary);
  text-align: left;
  cursor: pointer;
  &:hover { background: var(--ig-color-surface-interactive); }
`

const Primary = styled.span`
  font-size: var(--ig-font-size-sm);
  font-weight: 500;
`

const Secondary = styled.span`
  font-size: var(--ig-font-size-xs);
  color: var(--ig-color-text-muted);
`

// ── Types ──────────────────────────────────────────────────────────

export interface MentionCandidate {
  id: string
  name: string
  secondary?: string
}

export interface MentionTextareaProps {
  value: string
  onChange: (value: string) => void
  candidates: MentionCandidate[]
  onSubmit?: (text: string, mentionIds: string[]) => void
  placeholder?: string
  maxLength?: number
  disabled?: boolean
  className?: string
  triggerChar?: string
}

// ── Helpers ────────────────────────────────────────────────────────

interface MentionRange { start: number; end: number; query: string }

function detectMention(text: string, caretPos: number | null, trigger: string): MentionRange | null {
  if (caretPos === null || caretPos === 0) return null
  const before = text.slice(0, caretPos)
  const atIdx = before.lastIndexOf(trigger)
  if (atIdx === -1) return null
  if (atIdx > 0 && before[atIdx - 1] !== ' ' && before[atIdx - 1] !== '\n') return null
  const query = before.slice(atIdx + trigger.length)
  if (/\s/.test(query)) return null
  return { start: atIdx, end: caretPos, query }
}

function extractMentionIds(text: string, candidates: MentionCandidate[], trigger: string): string[] {
  const ids: string[] = []
  for (const c of candidates) {
    if (text.includes(`${trigger}${c.name}`)) ids.push(c.id)
  }
  return ids
}

// ── Component ──────────────────────────────────────────────────────

export function MentionTextarea({
  value, onChange, candidates, onSubmit,
  placeholder, maxLength, disabled, className,
  triggerChar = '@',
}: MentionTextareaProps) {
  const [mentionRange, setMentionRange] = useState<MentionRange | null>(null)
  const [menuIndex, setMenuIndex] = useState(0)
  const textareaRef = useRef<HTMLTextAreaElement>(null)

  const filtered = useMemo(() => {
    if (!mentionRange) return []
    const q = mentionRange.query.toLowerCase()
    return candidates.filter(
      (c) => c.name.toLowerCase().includes(q) || (c.secondary?.toLowerCase().includes(q) ?? false),
    )
  }, [candidates, mentionRange])

  useEffect(() => {
    if (menuIndex >= filtered.length) setMenuIndex(0)
  }, [filtered.length, menuIndex])

  const updateMention = useCallback(
    (text: string, caret: number | null) => {
      setMentionRange(detectMention(text, caret, triggerChar))
    },
    [triggerChar],
  )

  const insertMention = useCallback(
    (candidate: MentionCandidate) => {
      if (!mentionRange) return
      const replacement = `${triggerChar}${candidate.name} `
      const next = value.slice(0, mentionRange.start) + replacement + value.slice(mentionRange.end)
      onChange(next)
      setMentionRange(null)
      setMenuIndex(0)
      const caret = mentionRange.start + replacement.length
      requestAnimationFrame(() => {
        textareaRef.current?.setSelectionRange(caret, caret)
        textareaRef.current?.focus()
      })
    },
    [mentionRange, value, onChange, triggerChar],
  )

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
      if (mentionRange && filtered.length > 0) {
        if (e.key === 'ArrowDown') {
          e.preventDefault()
          setMenuIndex((i) => (i + 1) % filtered.length)
          return
        }
        if (e.key === 'ArrowUp') {
          e.preventDefault()
          setMenuIndex((i) => (i - 1 + filtered.length) % filtered.length)
          return
        }
        if (e.key === 'Enter' || e.key === 'Tab') {
          e.preventDefault()
          insertMention(filtered[menuIndex])
          return
        }
        if (e.key === 'Escape') {
          setMentionRange(null)
          return
        }
      }
      if (e.key === 'Enter' && (e.ctrlKey || e.metaKey) && onSubmit) {
        e.preventDefault()
        onSubmit(value, extractMentionIds(value, candidates, triggerChar))
      }
    },
    [mentionRange, filtered, menuIndex, insertMention, onSubmit, value, candidates, triggerChar],
  )

  return (
    <Wrap className={className}>
      {mentionRange && filtered.length > 0 && (
        <Menu role="listbox">
          {filtered.map((c, i) => (
            <Option
              key={c.id}
              type="button"
              role="option"
              aria-selected={i === menuIndex}
              $active={i === menuIndex}
              onMouseDown={(e) => { e.preventDefault(); insertMention(c) }}
            >
              <Primary>{c.name}</Primary>
              {c.secondary && <Secondary>{c.secondary}</Secondary>}
            </Option>
          ))}
        </Menu>
      )}
      <Textarea
        ref={textareaRef}
        value={value}
        onChange={(e) => { onChange(e.target.value); updateMention(e.target.value, e.target.selectionStart) }}
        onKeyUp={(e) => updateMention(value, e.currentTarget.selectionStart)}
        onKeyDown={handleKeyDown}
        onClick={(e) => updateMention(value, e.currentTarget.selectionStart)}
        placeholder={placeholder}
        maxLength={maxLength}
        disabled={disabled}
      />
    </Wrap>
  )
}
