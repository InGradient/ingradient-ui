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
export const AccountLicensePersonal: Story = { args: { scenario: 'account-license-personal' } }
export const AccountLicenseExpired: Story = { args: { scenario: 'account-license-expired' } }
export const AccountLicenseLoading: Story = { args: { scenario: 'account-license-loading' } }
export const AccountSaved: Story = { args: { scenario: 'account-saved' } }
export const AccountPasswordDialog: Story = { args: { scenario: 'account-password-dialog' } }
export const AccountPasswordMismatch: Story = { args: { scenario: 'account-password-mismatch' } }
export const AccountDeleteDialog: Story = { args: { scenario: 'account-delete-dialog' } }
export const AccountDeleteWithSolo: Story = { args: { scenario: 'account-delete-with-solo' } }
export const ProjectDefault: Story = { args: { scenario: 'project-default' } }
export const ProjectDeflectometry: Story = { args: { scenario: 'project-deflectometry' } }
export const ProjectReadOnly: Story = { args: { scenario: 'project-readonly' } }
export const ProjectGroupingEnabled: Story = { args: { scenario: 'project-grouping-enabled' } }
export const ProjectSaving: Story = { args: { scenario: 'project-saving' } }
export const ProjectNameInvalid: Story = { args: { scenario: 'project-name-invalid' } }
export const ProjectNoProject: Story = { args: { scenario: 'project-no-project' } }
export const ProjectPermissionsExpandAll: Story = { args: { scenario: 'project-permissions-expand-all' } }
export const EdgeNoProject: Story = { args: { scenario: 'edge-no-project' } }
export const EdgeWorkDefault: Story = { args: { scenario: 'edge-work-default' } }
export const EdgeWorkDeflectometry: Story = { args: { scenario: 'edge-work-deflectometry' } }
export const EdgeExportWithPackages: Story = { args: { scenario: 'edge-export-with-packages' } }
export const EdgeImportIdle: Story = { args: { scenario: 'edge-import-idle' } }
export const EdgeImportUploading: Story = { args: { scenario: 'edge-import-uploading' } }
export const EdgeImportCompleted: Story = { args: { scenario: 'edge-import-completed' } }
export const AdminOrganization: Story = { args: { scenario: 'admin-organization' } }
export const AdminOrgSaved: Story = { args: { scenario: 'admin-org-saved' } }
export const AdminMembers: Story = { args: { scenario: 'admin-members' } }
export const AdminInvitationsSearch: Story = { args: { scenario: 'admin-invitations-search' } }
export const AdminDevices: Story = { args: { scenario: 'admin-devices' } }
export const AdminDevicesLoading: Story = { args: { scenario: 'admin-devices-loading' } }
export const AdminDevicesTokenIssued: Story = { args: { scenario: 'admin-devices-token-issued' } }
export const AdminStorage: Story = { args: { scenario: 'admin-storage' } }
export const AdminStorageLoading: Story = { args: { scenario: 'admin-storage-loading' } }
export const AdminStorageError: Story = { args: { scenario: 'admin-storage-error' } }
export const NonAdmin: Story = { args: { scenario: 'non-admin' } }
