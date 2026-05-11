import React, { useState, useCallback, useRef, useMemo, useEffect } from 'react'
import { Menu, Option, Primary, Secondary, Textarea, Wrap } from './mention-textarea.styles'
import { detectMention, extractMentionIds, type MentionRange } from './mention-textarea.utils'

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
  'aria-label'?: string
}

export function MentionTextarea({
  value, onChange, candidates, onSubmit,
  placeholder, maxLength, disabled, className,
  triggerChar = '@',
  'aria-label': ariaLabel,
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
        aria-label={ariaLabel ?? placeholder ?? 'Mention textarea'}
      />
    </Wrap>
  )
}
