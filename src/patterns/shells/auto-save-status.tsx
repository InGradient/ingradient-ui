import styled from 'styled-components'

const Status = styled.p<{ $error?: boolean }>`
  margin: 0 0 16px;
  font-size: 13px;
  color: ${(p) => (p.$error ? 'var(--ig-color-danger)' : 'var(--ig-color-text-muted)')};
`

export type AutoSaveState = 'idle' | 'pending' | 'saving' | 'saved' | 'error'

export interface AutoSaveStatusProps {
  /** form 의 현재 저장 상태 */
  state: AutoSaveState
  /** error 상태일 때 표시할 메시지 (없으면 fallback) */
  errorMessage?: string | null
  /** 추가 컨디션: editing 권한 없을 시 read-only 메시지 */
  readOnly?: boolean
  /** 추가 컨디션: 값 유효성 실패 (e.g. 이름 빈 값) */
  invalid?: boolean
  invalidMessage?: string
  readOnlyMessage?: string
  idleMessage?: string
  pendingMessage?: string
  savingMessage?: string
  savedMessage?: string
  fallbackErrorMessage?: string
  className?: string
}

export function AutoSaveStatus({
  state, errorMessage, readOnly, invalid,
  invalidMessage = 'Field cannot be empty.',
  readOnlyMessage = 'You can view this, but settings are read-only for your role.',
  idleMessage = 'Changes save automatically.',
  pendingMessage = 'Saving shortly…',
  savingMessage = 'Saving…',
  savedMessage = 'All changes saved.',
  fallbackErrorMessage = 'Failed to save settings.',
  className,
}: AutoSaveStatusProps) {
  const isError = state === 'error' || invalid
  const message = (() => {
    if (readOnly) return readOnlyMessage
    if (invalid) return invalidMessage
    if (state === 'saving') return savingMessage
    if (state === 'pending') return pendingMessage
    if (state === 'saved') return savedMessage
    if (state === 'error') return errorMessage ?? fallbackErrorMessage
    return idleMessage
  })()
  return <Status $error={isError} className={className}>{message}</Status>
}
