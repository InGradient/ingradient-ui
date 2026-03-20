import React from 'react'
import { Button } from './button'

export function FileInput({
  onFiles,
  accept,
  multiple = true,
  label = 'Choose files',
}: {
  onFiles: (files: File[]) => void
  accept?: string
  multiple?: boolean
  label?: React.ReactNode
}) {
  const inputRef = React.useRef<HTMLInputElement | null>(null)

  return (
    <>
      <input
        ref={inputRef}
        type="file"
        accept={accept}
        multiple={multiple}
        hidden
        onChange={(event) => {
          onFiles(Array.from(event.target.files ?? []))
          event.target.value = ''
        }}
      />
      <Button type="button" variant="secondary" onClick={() => inputRef.current?.click()}>
        {label}
      </Button>
    </>
  )
}
