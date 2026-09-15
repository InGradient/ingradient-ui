import { EmptyState } from '@ingradient/ui'
import { LightbulbIcon } from '@ingradient/ui/components'
import { iconSizeNumbers } from '@ingradient/ui/tokens'

import type { LightingTabViewProps } from '../types'
import { Hint, TabTitle, TabWrap } from './tab-shell'

/** mode 에 맞는 내용 하나. 어느 쪽인지는 프로젝트 설정을 읽어야 알 수 있어 consumer 가 정한다. */
function LightingBody(props: LightingTabViewProps): JSX.Element | null {
  const { mode, labels, monitorContent, psContent } = props
  switch (mode) {
    case 'loading':
      return null
    case 'no-project':
      return <EmptyState description={labels.noProject} />
    case 'deflectometry':
      return <>{monitorContent}</>
    case 'photometric-stereo':
      return <>{psContent}</>
    default:
      return <EmptyState description={labels.noSettings} />
  }
}

export function LightingTabView(props: LightingTabViewProps): JSX.Element {
  const { mode, isCapturing, labels } = props
  const hasControls = mode === 'deflectometry' || mode === 'photometric-stereo'

  return (
    <TabWrap>
      <TabTitle>
        <LightbulbIcon size={iconSizeNumbers.xs} />
        {labels.title}
      </TabTitle>

      <LightingBody {...props} />

      {hasControls && isCapturing && <Hint>{labels.capturingHint}</Hint>}
    </TabWrap>
  )
}
