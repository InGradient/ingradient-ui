import { SettingsModalView } from '@ingradient/platform-pages'
import { fn } from 'storybook/test'
import {
  settingsScenarios,
  type SettingsScenarioKey,
} from '../../../../fixtures/platform/0.0.1/settings-scenarios'
import { defineHandoff } from '../../../../support/handoff'
import { buildSettingsViewProps } from './build-view-props'
import type { SettingsModalStoryActions } from './settings-modal-story-actions'
import { useEdgeTabState } from './use-edge-tab-state'
import { useSettingsModalScene } from './use-settings-modal-scene'

export interface SettingsModalStoryArgs extends SettingsModalStoryActions {
  scenario: SettingsScenarioKey
}

export const SETTINGS_SCENARIO_LABELS: Record<SettingsScenarioKey, string> = {
  general: 'General preferences',
  'account-default': 'Organization license account',
  'account-license-personal': 'Personal license account',
  'account-license-expired': 'Expired account license',
  'account-license-loading': 'Account license loading',
  'account-saved': 'Account profile saved',
  'account-delete-dialog': 'Delete account with shared projects',
  'account-delete-with-solo': 'Delete account with solo project',
  'project-default': 'General project configuration',
  'project-deflectometry': 'Deflectometry project',
  'project-readonly': 'Non-owner project details',
  'project-saving': 'Project settings saving',
  'project-name-invalid': 'Invalid project name',
  'project-no-project': 'No project selected',
  'project-permissions-expand-all': 'Project permission matrix expanded',
  'edge-no-project': 'No Edge project selected',
  'edge-work-default': 'General Edge work options',
  'edge-work-deflectometry': 'Deflectometry Edge work options',
  'edge-export-with-packages': 'Edge export with packages',
  'edge-import-idle': 'Edge import idle',
  'edge-import-uploading': 'Edge import uploading',
  'edge-import-completed': 'Edge import completed with failures',
  'admin-organization': 'Organization settings',
  'admin-org-saved': 'Organization settings saved',
  'admin-members': 'Members and invitations',
  'admin-devices': 'Devices',
  'admin-devices-loading': 'Devices loading',
  'admin-devices-token-issued': 'Offline token issued',
  'admin-storage': 'Storage analytics',
  'admin-storage-loading': 'Storage analytics loading',
  'admin-storage-error': 'Storage analytics error',
  'non-admin': 'Non-admin navigation',
}

const settingsHandoff = defineHandoff({
  service: 'platform',
  version: '0.0.1',
  page: 'Settings Modal',
  referenceStory: 'Pages / Platform / 0.0.1 / Settings Modal / General / Preferences',
  preset: 'platform-0.0.1',
  fixturesPath:
    'stories/fixtures/platform/0.0.1/settings-{account,project,org,devices,storage,edge,scenarios}.ts',
  requiredScenarios: [
    'general',
    'account-default',
    'account-license-expired',
    'account-delete-with-solo',
    'project-default',
    'project-readonly',
    'project-no-project',
    'project-permissions-expand-all',
    'edge-work-default',
    'edge-export-with-packages',
    'edge-import-completed',
    'admin-organization',
    'admin-members',
    'admin-devices',
    'admin-storage',
    'non-admin',
  ],
  interactions: [
    'General preference 변경 → controlled value + Action payload',
    'Account password dialog → mismatch validation → corrected submit',
    'Project grouping / permission matrix → dependent controls + Action payload',
    'Edge export dataset/user 선택 → package request Action',
    'Organization invitation 검색 → filtered result + invite Action',
    'Device 검색/form toggle → filtered table + lifecycle Action',
  ],
  platformIntegration: [
    'SettingsModalView 를 그대로 import — story runtime 이 controlled props 를 구성',
    'General / Account / Project → settings hooks + persistence callbacks',
    'Admin → IAM, device-license, storage analytics hooks',
    'Edge → project package export/import hooks',
  ],
})

const ACTION_ARG_TYPE = {
  control: { disable: true },
  table: { category: 'Actions', disable: true },
} as const

export function createSettingsModalActionArgs(): SettingsModalStoryActions {
  return {
    onModalAction: fn<(action: string) => void>(),
    onTabChange: fn<SettingsModalStoryActions['onTabChange']>(),
    onAdminSubTabChange: fn<SettingsModalStoryActions['onAdminSubTabChange']>(),
    onEdgeSubTabChange: fn<SettingsModalStoryActions['onEdgeSubTabChange']>(),
    onGeneralPreferenceChange: fn<SettingsModalStoryActions['onGeneralPreferenceChange']>(),
    onAccountAction: fn<SettingsModalStoryActions['onAccountAction']>(),
    onProjectAction: fn<SettingsModalStoryActions['onProjectAction']>(),
    onOrganizationAction: fn<SettingsModalStoryActions['onOrganizationAction']>(),
    onDeviceAction: fn<SettingsModalStoryActions['onDeviceAction']>(),
    onStorageAction: fn<SettingsModalStoryActions['onStorageAction']>(),
    onEdgeAction: fn<SettingsModalStoryActions['onEdgeAction']>(),
    onDialogAction: fn<SettingsModalStoryActions['onDialogAction']>(),
  }
}

export function settingsModalArgTypes(options: readonly SettingsScenarioKey[]) {
  return {
    scenario: {
      control: {
        type: 'select' as const,
        labels: Object.fromEntries(options.map((key) => [key, SETTINGS_SCENARIO_LABELS[key]])),
      },
      options: [...options],
      description: 'Choose a documented Settings Modal state in this group.',
      table: { category: 'Settings state' },
    },
    onModalAction: ACTION_ARG_TYPE,
    onTabChange: ACTION_ARG_TYPE,
    onAdminSubTabChange: ACTION_ARG_TYPE,
    onEdgeSubTabChange: ACTION_ARG_TYPE,
    onGeneralPreferenceChange: ACTION_ARG_TYPE,
    onAccountAction: ACTION_ARG_TYPE,
    onProjectAction: ACTION_ARG_TYPE,
    onOrganizationAction: ACTION_ARG_TYPE,
    onDeviceAction: ACTION_ARG_TYPE,
    onStorageAction: ACTION_ARG_TYPE,
    onEdgeAction: ACTION_ARG_TYPE,
    onDialogAction: ACTION_ARG_TYPE,
  }
}

export function settingsModalParameters(description: string) {
  return {
    layout: 'fullscreen' as const,
    ...settingsHandoff,
    a11y: { test: 'error' as const },
    controls: { expanded: true },
    docs: {
      ...settingsHandoff.docs,
      description: {
        component: `${description}\n\n${settingsHandoff.docs.description.component}`,
      },
    },
  }
}

export function SettingsModalScene({ scenario: key, ...actions }: SettingsModalStoryArgs) {
  const scenario = settingsScenarios[key]
  const state = useSettingsModalScene(scenario)
  const edge = useEdgeTabState(scenario)
  return <SettingsModalView {...buildSettingsViewProps(scenario, state, edge, actions)} />
}
