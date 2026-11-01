import styled from 'styled-components'
import { useId } from 'react'
import { Button, DialogShell, EmptyState, TextField } from '@ingradient/ui'
import type { CreateProjectFormViewProps } from './types'

const CreateProjectWrap = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: var(--ig-spacing-20);
  padding: var(--ig-spacing-32) 0;
`

const StatusMsg = styled.div`
  font-size: var(--ig-text-caption);
  color: var(--ig-color-text-muted);
`

export function CreateProjectFormView({ labels, form }: CreateProjectFormViewProps): JSX.Element {
  const id = useId()
  return (<>
    <CreateProjectWrap>
      <EmptyState>{labels.emptyOnline}</EmptyState>
      <StatusMsg>{labels.createOnPlatform}</StatusMsg>
      {form && <Button onClick={form.onOpen}>{form.title}</Button>}
    </CreateProjectWrap>
    {form?.open && <DialogShell title={form.title} onClose={form.onClose} actions={<>
      <Button variant="secondary" onClick={form.onClose}>{form.cancelLabel}</Button>
      <Button type="submit" form={`${id}-form`} disabled={form.busy}>{form.submitLabel}</Button>
    </>}>
      <form id={`${id}-form`} aria-busy={form.busy} onSubmit={(event) => { if (form.busy) event.preventDefault(); else form.onSubmit(event) }}>
        <label htmlFor={`${id}-name`}>{form.nameLabel}</label>
        <TextField id={`${id}-name`} value={form.name} disabled={form.busy}
          aria-invalid={Boolean(form.error)} aria-describedby={form.error ? `${id}-error` : undefined}
          onChange={(event) => form.onNameChange(event.target.value)} />
        {form.error && <p id={`${id}-error`} role="alert">{form.error}</p>}
      </form>
    </DialogShell>}
  </>)
}
