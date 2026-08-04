import type {
  AdminSubTab,
  SettingsTab,
} from '../../../../fixtures/platform/0.0.1/settings-scenarios'
import type { EdgeTabKey } from '@ingradient/platform-pages'

export interface SettingsModalStoryActions {
  onModalAction: (action: string) => void
  onTabChange: (tab: SettingsTab) => void
  onAdminSubTabChange: (tab: AdminSubTab) => void
  onEdgeSubTabChange: (tab: EdgeTabKey) => void
  onGeneralPreferenceChange: (field: string, value: string | boolean) => void
  onAccountAction: (action: string, value?: string) => void
  onProjectAction: (action: string, value?: string | boolean) => void
  onOrganizationAction: (action: string, value?: string) => void
  onDeviceAction: (action: string, value?: string | boolean) => void
  onStorageAction: (action: string) => void
  onEdgeAction: (action: string, value?: string | boolean) => void
  onDialogAction: (dialog: string, action: string) => void
}
