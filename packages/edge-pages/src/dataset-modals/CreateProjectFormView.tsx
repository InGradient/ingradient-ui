import styled from 'styled-components'
import { EmptyState } from '@ingradient/ui/components'
import type { CreateProjectFormViewProps } from './types'

const CreateProjectWrap = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: var(--ig-space-9);
  padding: var(--ig-space-13) 0;
`

const StatusMsg = styled.div`
  font-size: var(--ig-font-size-xs);
  color: var(--ig-color-text-muted);
`

export function CreateProjectFormView({ labels }: CreateProjectFormViewProps): JSX.Element {
  return (
    <CreateProjectWrap>
      <EmptyState>{labels.emptyOnline}</EmptyState>
      <StatusMsg>{labels.createOnPlatform}</StatusMsg>
    </CreateProjectWrap>
  )
}
