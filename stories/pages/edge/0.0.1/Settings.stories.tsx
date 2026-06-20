import type { Meta, StoryObj } from '@storybook/react-vite'
import { defineHandoff } from '../../../support/handoff'
import { SettingsModalContent } from './settings/build-settings-modal'
import { ConnectionTabContent } from './settings/build-connection-content'

const handoff = defineHandoff({
  service: 'edge',
  version: '0.0.1',
  page: 'Settings',
  referenceStory: 'Pages / Edge / 0.0.1 / Settings / Server',
  preset: 'edge-0.0.1',
  fixturesPath: 'stories/fixtures/edge/0.0.1/settings-data.ts, connection-data.ts',
  requiredScenarios: ['server', 'connection', 'camera', 'logs', 'about', 'data', 'fieldtest'],
  interactions: [
    'Settings 다이얼로그 사이드바 탭 전환',
    'Server 탭: baseUrl / runtimeMode 변경 + 저장',
    'Connection 탭: device scan / NIC 선택 / 가이드',
    'Camera 탭: exposure / gain / gamma / ROI / trigger 등 파라미터 조정',
    'Logs 탭: backend / frontend 로그 source 전환',
    'About 탭: 버전 / 업데이트 정보 + Update 액션',
    'Data 탭: 디바이스 데이터 정리 / cleanup',
    'FieldTest 탭: 현장 진단 / 캡처',
  ],
  platformIntegration: [
    'TopBarView 의 onOpenSettings → 실제 앱에서 SettingsDialog 호출',
    '각 탭 content 는 edge-pages 의 별도 View 컴포넌트 (Server/Connection/Camera/...) 가 채움',
    '본 stories 는 SettingsModalContent scene 으로 전체 합성을 노출',
  ],
})

function SettingsScene(args: { activeTab?: 'server' | 'connection' | 'camera' | 'logs' | 'about' | 'data' | 'fieldtest' }): JSX.Element {
  return (
    <SettingsModalContent
      activeTab={args.activeTab ?? 'server'}
      connectionContent={<ConnectionTabContent />}
    />
  )
}

const meta = {
  title: 'Pages/Edge/0.0.1/Settings',
  component: SettingsScene,
  tags: ['autodocs'],
  parameters: { layout: 'fullscreen', ...handoff },
} satisfies Meta<typeof SettingsScene>

export default meta

type Story = StoryObj<typeof SettingsScene>

export const Server: Story = { args: { activeTab: 'server' } }
export const Connection: Story = { args: { activeTab: 'connection' } }
export const Camera: Story = { args: { activeTab: 'camera' } }
export const Logs: Story = { args: { activeTab: 'logs' } }
export const About: Story = { args: { activeTab: 'about' } }
export const Data: Story = { args: { activeTab: 'data' } }
export const FieldTest: Story = { args: { activeTab: 'fieldtest' } }
