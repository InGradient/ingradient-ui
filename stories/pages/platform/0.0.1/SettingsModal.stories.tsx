import type { Meta, StoryObj } from '@storybook/react-vite'
import { SettingsModalView } from '@ingradient/platform-pages'
import { settingsScenarios, type SettingsScenarioKey } from '../../../fixtures/platform/0.0.1/settings-scenarios'
import { useSettingsModalScene } from './settings/use-settings-modal-scene'
import { useEdgeTabState } from './settings/use-edge-tab-state'
import { buildSettingsViewProps } from './settings/build-view-props'
import { defineHandoff } from '../../../support/handoff'

const handoff = defineHandoff({
  service: 'platform',
  version: '0.0.1',
  page: 'SettingsModal',
  referenceStory: 'Pages / Platform / 0.0.1 / SettingsModal / Default',
  preset: 'platform-0.0.1',
  fixturesPath: 'stories/fixtures/platform/0.0.1/settings-{account,project,org,devices,storage,scenarios}.ts',
  requiredScenarios: ['default', 'account-default', 'project-default', 'admin-organization', 'admin-devices', 'admin-storage'],
  interactions: ['탭 전환', '폼 입력 / 저장', '모달 dialog open/close', 'admin 서브탭 전환', '권한 매트릭스 셀 토글'],
  platformIntegration: [
    'SettingsModalView 를 그대로 import — props 에 hook 결과 연결',
    'useSettings() localStorage',
    'useSettingsAccountState / ProjectState',
    'IAM API (org, members, invitations, devices)',
    'fetchStorageAnalytics',
  ],
})

type Args = { scenario: SettingsScenarioKey }

function SettingsModalScene({ scenario: key }: Args) {
  const scenario = settingsScenarios[key]
  const s = useSettingsModalScene(scenario)
  const edge = useEdgeTabState(scenario)
  return <SettingsModalView {...buildSettingsViewProps(scenario, s, edge)} />
}

const SCENARIO_KEYS = Object.keys(settingsScenarios) as SettingsScenarioKey[]

const meta = {
  title: 'Pages/Platform/0.0.1/SettingsModal',
  component: SettingsModalScene,
  parameters: { layout: 'fullscreen', ...handoff },
  argTypes: { scenario: { control: 'select', options: SCENARIO_KEYS, table: { category: 'Page' } } },
  args: { scenario: 'default' as SettingsScenarioKey },
} satisfies Meta<typeof SettingsModalScene>

export default meta

type Story = StoryObj<typeof meta>

export const Default: Story = {}
export const AccountDefault: Story = { args: { scenario: 'account-default' } }
export const AccountLicense: Story = { args: { scenario: 'account-license' } }
export const AccountSaved: Story = { args: { scenario: 'account-saved' } }
export const AccountPasswordDialog: Story = { args: { scenario: 'account-password-dialog' } }
export const AccountDeleteDialog: Story = { args: { scenario: 'account-delete-dialog' } }
/** 8 project 변형 (Default / Deflectometry / ReadOnly / GroupingEnabled / Saving / NameInvalid / NoProject / PermissionsExpandAll) — Controls 의 scenario 로 전환. */
export const ProjectShowcase: Story = { args: { scenario: 'project-default' } }
export const EdgeNoProject: Story = { args: { scenario: 'edge-no-project' } }
/** 4 edge 변형 (WorkDefault / WorkDeflectometry / ExportWithPackages / Import) — Controls 의 scenario 로 전환. */
export const EdgeShowcase: Story = { args: { scenario: 'edge-work-default' } }
/** 5 admin 변형 (Organization / Members / InvitationsSearch / Devices / Storage) — Controls 의 scenario 로 전환. */
export const AdminShowcase: Story = { args: { scenario: 'admin-organization' } }
export const NonAdmin: Story = { args: { scenario: 'non-admin' } }
