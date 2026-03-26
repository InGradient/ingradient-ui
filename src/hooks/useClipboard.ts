import { useCallback, useRef, useState } from 'react'

export interface UseClipboardOptions {
  /** Duration in ms to keep `copied` true after a successful copy. Default 2000. */
  resetDelay?: number
}

export function useClipboard(options: UseClipboardOptions = {}) {
  const { resetDelay = 2000 } = options
  const [copied, setCopied] = useState(false)
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  const copy = useCallback(
    async (text: string) => {
      try {
        await navigator.clipboard.writeText(text)
        setCopied(true)
        if (timerRef.current) clearTimeout(timerRef.current)
        timerRef.current = setTimeout(() => setCopied(false), resetDelay)
      } catch {
        setCopied(false)
      }
    },
    [resetDelay],
  )

  return { copy, copied }
}
