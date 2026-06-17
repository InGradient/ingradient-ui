import { useCallback, useEffect, useRef, useState, type RefObject } from 'react'

export function useFullscreen<T extends HTMLElement>(externalRef?: RefObject<T>) {
  const internalRef = useRef<T>(null)
  const ref = externalRef ?? internalRef

  const [isFullscreen, setIsFullscreen] = useState(false)

  useEffect(() => {
    const handler = () => setIsFullscreen(document.fullscreenElement === ref.current)
    document.addEventListener('fullscreenchange', handler)
    return () => document.removeEventListener('fullscreenchange', handler)
  }, [ref])

  const toggle = useCallback(() => {
    if (document.fullscreenElement) {
      void document.exitFullscreen()
    } else {
      void ref.current?.requestFullscreen()
    }
  }, [ref])

  return { ref, isFullscreen, toggle }
}
