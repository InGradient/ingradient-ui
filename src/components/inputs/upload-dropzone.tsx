import React, { useCallback, useRef, useState } from 'react'
import styled from 'styled-components'
import { DropZone } from './drop-zone'

const HiddenInput = styled.input`
  display: none;
`

const ZONE_STYLE = {
  flexDirection: 'column' as const,
  gap: 'var(--ig-space-4)',
  padding: 'var(--ig-space-10) var(--ig-space-6)',
  textAlign: 'center' as const,
  fontSize: 'var(--ig-font-size-sm)',
}

const ZONE_CLICKABLE_STYLE = { ...ZONE_STYLE, cursor: 'pointer' as const }

export interface UploadDropzoneProps {
  accept?: string
  multiple?: boolean
  onFiles: (files: File[]) => void
  disabled?: boolean
  children?: React.ReactNode
  className?: string
}

export function UploadDropzone({
  accept, multiple = true, onFiles, disabled = false, children, className,
}: UploadDropzoneProps) {
  const [active, setActive] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)
  const dragCounter = useRef(0)

  const handleFiles = useCallback(
    (fileList: FileList | null) => {
      if (!fileList || disabled) return
      onFiles(Array.from(fileList))
    },
    [onFiles, disabled],
  )

  const onDragEnter = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    dragCounter.current += 1
    setActive(true)
  }, [])

  const onDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    dragCounter.current -= 1
    if (dragCounter.current <= 0) { dragCounter.current = 0; setActive(false) }
  }, [])

  const onDragOver = useCallback((e: React.DragEvent) => { e.preventDefault() }, [])

  const onDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault()
      dragCounter.current = 0
      setActive(false)
      handleFiles(e.dataTransfer.files)
    },
    [handleFiles],
  )

  return (
    <DropZone
      variant="outlined"
      active={active}
      disabled={disabled}
      className={className}
      style={disabled ? ZONE_STYLE : ZONE_CLICKABLE_STYLE}
      role={!disabled ? 'button' : undefined}
      tabIndex={!disabled ? 0 : -1}
      aria-label="Upload files"
      onClick={() => !disabled && inputRef.current?.click()}
      onKeyDown={(e) => {
        if (!disabled && (e.key === 'Enter' || e.key === ' ')) {
          e.preventDefault()
          inputRef.current?.click()
        }
      }}
      onDragEnter={onDragEnter}
      onDragLeave={onDragLeave}
      onDragOver={onDragOver}
      onDrop={onDrop}
    >
      <HiddenInput
        ref={inputRef}
        type="file"
        accept={accept}
        multiple={multiple}
        onChange={(e) => { handleFiles(e.target.files); e.target.value = '' }}
      />
      {children ?? 'Drop files here or click to browse'}
    </DropZone>
  )
}
