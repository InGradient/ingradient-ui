// 설정 화면 전체를 띄운다 — 탭 하나만 보면 디자인이 어떻게 앉는지 알 수 없다.
// 탭을 눌러 가며 실제 앱과 같은 흐름으로 확인하는 용도라, 상태를 스토리 안에서 들고 있다.
import { useState } from 'react'
import type { Meta, StoryObj } from '@storybook/react-vite'

import { CameraSettingsDialogView } from './CameraSettingsDialogView'
import { ExperimentsTabView } from './tabs'
import type { SettingsTab } from './types'

const LABELS = {
  title: 'System Settings',
  close: '닫기',
  tabGeneral: '일반',
  tabConnection: '연결',
  tabCamera: '카메라',
  tabLighting: '조명',
  tabServer: '서버',
  tabData: '데이터',
  tabLogs: '로그',
  tabExperiments: '실험',
  tabFieldTest: '현장 테스트',
  tabAbout: '정보',
}

const EXPERIMENT_LABELS = {
  title: '실험',
  enabledLabel: '여러 주기로 촬영',
  enabledDesc: '촬영 한 번에 아래 주기를 모두 찍는다',
  disabledHint: '끄면 Setup 에서 정한 주기·축·스텝 수로만 촬영한다.',
  periodsSection: '프린지 주기',
  duplicate: '중복',
  primaryBadge: '기준',
  addPeriod: '주기 추가',
  removePeriod: '이 주기 삭제',
  periodAria: (position: number) => `${position}번째 주기`,
  periodsHint: '4 이상, 최대 6개',
  compositeLabel: '합성 패턴 포함',
  compositeDesc: '주기를 겹친 패턴을 함께 찍는다',
  compositeSteps: '합성 스텝 수',
  total: '이 설정으로 촬영 1회에 42장을 찍는다',
}

/** 아직 옮기지 않은 탭 자리. 실제로는 각 TabView 가 들어간다. */
function Placeholder({ name }: { name: string }): JSX.Element {
  return (
    <div style={{
      display: 'grid', placeItems: 'center', minHeight: 'var(--ig-space-13)',
      border: '1px dashed var(--ig-color-border-subtle)',
      borderRadius: 'var(--ig-radius-xs)',
      color: 'var(--ig-color-text-muted)', fontSize: 'var(--ig-font-size-xs)',
    }}>
      {name} — 아직 edge-pages 로 옮기지 않은 탭
    </div>
  )
}

function SettingsDialogHarness({ initialTab }: { initialTab: SettingsTab }): JSX.Element {
  const [activeTab, setActiveTab] = useState<SettingsTab>(initialTab)
  const [enabled, setEnabled] = useState(true)
  const [periods, setPeriods] = useState<number[]>([12, 24, 48])
  const [compositeEnabled, setCompositeEnabled] = useState(false)
  const [compositeSteps, setCompositeSteps] = useState(8)

  return (
    <CameraSettingsDialogView
      activeTab={activeTab}
      currentUserRole="owner"
      labels={LABELS}
      onClose={() => undefined}
      onSetActiveTab={setActiveTab}
      generalContent={<Placeholder name="General" />}
      connectionContent={<Placeholder name="Connection" />}
      cameraContent={<Placeholder name="Camera Params" />}
      lightingContent={<Placeholder name="Lighting" />}
      serverContent={<Placeholder name="Server" />}
      dataContent={<Placeholder name="Data" />}
      logsContent={<Placeholder name="Logs" />}
      fieldTestContent={<Placeholder name="Field Test" />}
      aboutContent={<Placeholder name="About" />}
      experimentsContent={
        <ExperimentsTabView
          enabled={enabled}
          fringePeriods={periods}
          primaryIndex={1}
          compositeEnabled={compositeEnabled}
          compositeSteps={compositeSteps}
          limits={{ minPeriod: 4, maxPeriods: 6, maxCompositeSteps: 32 }}
          labels={EXPERIMENT_LABELS}
          onToggleEnabled={setEnabled}
          onChangePeriod={(index, period) =>
            setPeriods((prev) => prev.map((p, i) => (i === index ? period : p)))}
          onAddPeriod={() => setPeriods((prev) => [...prev, prev[prev.length - 1] ?? 12])}
          onRemovePeriod={(index) => setPeriods((prev) => prev.filter((_, i) => i !== index))}
          onToggleComposite={setCompositeEnabled}
          onChangeCompositeSteps={setCompositeSteps}
        />
      }
    />
  )
}

const meta: Meta<typeof SettingsDialogHarness> = {
  title: 'Edge Pages/Settings/CameraSettingsDialog',
  component: SettingsDialogHarness,
  parameters: { layout: 'fullscreen' },
}

export default meta
type Story = StoryObj<typeof SettingsDialogHarness>

/** 옮긴 탭이 실제 화면 안에서 어떻게 보이는지. */
export const Experiments: Story = { args: { initialTab: 'experiments' } }

/** 사이드바 전체 — 탭 10개가 edge 앱과 같은 순서로 선다. */
export const FirstTab: Story = { args: { initialTab: 'general' } }
