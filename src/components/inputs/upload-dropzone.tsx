import React, { useCallback, useRef, useState } from 'react'
import styled from 'styled-components'

const DropArea = styled.div<{ $active: boolean; $disabled: boolean }>`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: var(--ig-space-4);
  padding: var(--ig-space-10) var(--ig-space-6);
  border: 2px dashed ${(p) => (p.$active ? 'var(--ig-color-accent-soft)' : 'var(--ig-color-border-subtle)')};
  border-radius: var(--ig-radius-lg);
  background: ${(p) => (p.$active ? 'var(--ig-color-accent-soft-surface)' : 'transparent')};
  color: var(--ig-color-text-muted);
  font-size: var(--ig-font-size-sm);
  text-align: center;
  cursor: ${(p) => (p.$disabled ? 'default' : 'pointer')};
  opacity: ${(p) => (p.$disabled ? 0.5 : 1)};
  transition: border-color var(--ig-motion-fast), background var(--ig-motion-fast);
`

const HiddenInput = styled.input`
  display: none;
`

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
    <DropArea
      className={className}
      $active={active}
      $disabled={disabled}
      onClick={() => !disabled && inputRef.current?.click()}
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
    </DropArea>
  )
}
