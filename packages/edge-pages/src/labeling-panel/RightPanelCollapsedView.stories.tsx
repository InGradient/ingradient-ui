// 접힌 우측 패널 — 좁힌 상태에서 클래스 색 동그라미만 남는다.
import { useState } from 'react'
import type { Meta, StoryObj } from '@storybook/react-vite'

import { RightPanelCollapsedView } from './RightPanelCollapsedView'

const CLASSES = [
  { id: 'scratch', name: '스크래치', color: '#ef4444' },
  { id: 'dent', name: '눌림', color: '#f59e0b' },
  { id: 'wrinkle', name: '주름', color: '#22d3ee' },
  { id: 'dust', name: '이물', color: '#a3e635' },
]

function CollapsedRail(): JSX.Element {
  const [selected, setSelected] = useState<string | null>('wrinkle')
  return (
    <div style={{
      display: 'flex', justifyContent: 'flex-end',
      height: 320, background: 'var(--ig-color-surface-sunken)',
    }}>
      <div style={{ borderLeft: '1px solid var(--ig-color-border-subtle)' }}>
        <RightPanelCollapsedView
          classes={CLASSES}
          selectedClassId={selected}
          labels={{ expand: '패널 펼치기' }}
          onClassClick={setSelected}
          onExpand={() => undefined}
        />
      </div>
    </div>
  )
}

const meta: Meta<typeof CollapsedRail> = {
  title: 'Edge Pages/Labeling/RightPanelCollapsed',
  component: CollapsedRail,
  parameters: { layout: 'fullscreen' },
}

export default meta
type Story = StoryObj<typeof CollapsedRail>

/** 이름은 툴팁으로만 나온다 — 검색·ROI·코멘트가 필요하면 펼쳐야 한다. */
export const Collapsed: Story = {}
