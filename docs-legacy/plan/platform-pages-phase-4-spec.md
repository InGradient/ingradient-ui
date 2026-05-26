---
title: Phase 4 — Settings Modal 추출
purpose: storybook 의 SettingsModalScene JSX 를 @ingradient/platform-pages/settings-modal 로 추출. Modal + 5 tab (general/account/project/edge/admin) + admin 4 sub-tab. 31 scenario story 를 view import 기반으로 rewrite
audience: ingradient-ui contributor
date: 2026-05-15
status: draft
related:
  - ./platform-pages-extraction-roadmap.md
  - ./platform-pages-phase-3-spec.md
---

# Phase 4 — Settings Modal 추출

> Roadmap: [platform-pages-extraction-roadmap.md](./platform-pages-extraction-roadmap.md) § Phase 4

---

## 1. 목적

storybook 의 `SettingsModalScene` (462 줄 + scene hook 206 줄 + 31 scenario) 를 `@ingradient/platform-pages/settings-modal` 의 `SettingsModalView` 로 추출.

성공 후 platform 의 SettingsModal 컨테이너가 view 를 import 하고 hook → props 만 주입.

---

## 2. 핵심 구조

| 레이어 | 내용 | 이미 ui 에 있는 patterns |
|---|---|---|
| **Modal shell** | ModalBackdrop + ModalCard + Header (Title + Close) | ModalBackdrop, ModalCard, ModalHeader, ModalTitle, DialogCloseButton |
| **SettingsShell** | 좌 140px tabs / 우 body 의 2-column 레이아웃 | SettingsShell |
| **Left tab list** | VerticalTabs (General/Account/Project/Edge/[Admin]) | VerticalTabs |
| **Tab body** | 5 tab 별 분기 | (tab 별 pattern) |
| → **General** | toggle 4개 | SettingsGeneralTab |
| → **Account** | form + 2 dialog | SettingsAccountTab, PasswordChangeDialog, DeleteAccountDialog |
| → **Project** | form + invite + members + permissions + delete | ProjectSettingsForm, ProjectMemberInvite, ProjectMembersList, ProjectPermissionMatrix, DeleteProjectSection |
| → **Edge** | placeholder | (텍스트만) |
| → **Admin** | 4 sub-tab (Tabs underline) | Tabs |
| → → Organization | name form | OrgSettingsTab |
| → → Members | members + invitations | OrgMembersTab, InvitationsTab |
| → → Devices | license + forms + table 3 section | DevicesTab |
| → → Storage | overview + 4 chart + 2 table + recs | StorageAnalyticsTab, StorageOverview, StorageStatsTable, StorageRecommendationsList + BarChartCard/PieChartCard (slot) |

UI 부품 모두 patterns 에 존재. view 는 modal shell + tab dispatch + props pass-through.

---

## 3. View 파일 분할 — 12 file

```
packages/platform-pages/src/settings-modal/
├─ SettingsModalView.tsx          — 최상위 (Modal shell + tab dispatch)
├─ SettingsModalView.styles.ts    — Modal/Header/Title/Main/Body 등 styled
├─ tabs/GeneralTab.tsx            — SettingsGeneralTab pass-through
├─ tabs/AccountTab.tsx            — SettingsAccountTab + 2 dialog
├─ tabs/ProjectTab.tsx            — 5 pattern 묶음 + permissions toggle
├─ tabs/EdgeTab.tsx               — placeholder
├─ tabs/AdminTab.tsx              — sub-tabs + sub-view dispatch
├─ tabs/admin/AdminOrganization.tsx  — OrgSettingsTab
├─ tabs/admin/AdminMembers.tsx       — OrgMembersTab + InvitationsTab
├─ tabs/admin/AdminDevices.tsx       — DevicesTab
├─ tabs/admin/AdminStorage.tsx       — StorageAnalyticsTab + chart slots
├─ types.ts                       — Props
└─ index.ts                       — barrel
```

각 파일 < 200 줄 목표.

---

## 4. Props 그룹핑 — 7 group

```ts
export interface SettingsModalViewProps {
  open: boolean
  onClose: () => void
  tab: SettingsTab
  onTabChange: (tab: SettingsTab) => void
  isAdmin: boolean

  general: GeneralTabProps
  account: AccountTabProps
  project: ProjectTabProps
  admin?: AdminTabProps          // null/undefined when isAdmin false
}

export type SettingsTab = 'general' | 'account' | 'project' | 'edge' | 'admin'
export type AdminSubTab = 'organization' | 'members-invitations' | 'devices' | 'storage'

export interface GeneralTabProps {
  locale: string
  enableHoverPreview: boolean
  singleClickToEdit: boolean
  showLabelsOnThumbnails: boolean
  onChangeLocale: (v: string) => void
  onChangeEnableHoverPreview: (v: boolean) => void
  onChangeSingleClickToEdit: (v: boolean) => void
  onChangeShowLabelsOnThumbnails: (v: boolean) => void
}

export interface AccountTabProps {
  user: SettingsAccountTabUser | null   // re-export from @ingradient/ui/patterns
  license: LicenseInfo | null

  // form
  name: string
  onChangeName: (v: string) => void
  message?: string
  onSaveName: () => void
  onLogout: () => void

  // password dialog
  passwordDialogOpen: boolean
  passwordMessage?: string
  currentPassword: string
  newPassword: string
  newPasswordConfirm: string
  onChangeCurrentPassword: (v: string) => void
  onChangeNewPassword: (v: string) => void
  onChangeNewPasswordConfirm: (v: string) => void
  onOpenPasswordDialog: () => void
  onClosePasswordDialog: () => void
  onSubmitPassword: () => void

  // delete account dialog
  deleteAccountDialogOpen: boolean
  deleteAccountConfirmInput: string
  onChangeDeleteAccountConfirmInput: (v: string) => void
  deleteAccountPreview: DeleteAccountPreview | null
  deleteAccountResolutions: DeleteAccountResolutions
  onChangeDeleteAccountResolutions: (r: DeleteAccountResolutions) => void
  deleteAccountPassword: string
  onChangeDeleteAccountPassword: (v: string) => void
  deleteAccountFinalConfirm: string
  onChangeDeleteAccountFinalConfirm: (v: string) => void
  deleteAccountMessage?: string
  onOpenDeleteAccountDialog: () => void
  onCloseDeleteAccountDialog: () => void
  onSubmitDeleteAccount: () => void
}

export interface ProjectTabProps {
  noProject?: boolean
  canEdit: boolean
  isOwner: boolean
  canManagePermissions: boolean
  canDeleteProject: boolean
  projectsCount: number

  // draft form
  draft: ProjectFormDraft
  onChangeDraft: (patch: Partial<ProjectFormDraft>) => void
  saveState: 'idle' | 'saving' | 'saved' | 'error'
  saveErrorMessage?: string
  nameInvalid?: boolean

  // invite
  memberSearchQuery: string
  onChangeMemberSearchQuery: (v: string) => void
  candidates: SearchableUserCandidate[]
  onAddMember: (id: string) => void

  // members
  members: ProjectMemberRowMember[]
  roleOptions: ProjectMemberRowRoleOption[]
  onChangeRole: (memberId: string, roleId: string) => void
  onRemoveMember: (memberId: string) => void

  // permissions matrix
  permissionsExpandAll: boolean
  onTogglePermissionsExpand: () => void
  expandedPermissionGroups: ExpandedPermissionGroup[]
  summaryPermissionGroups: SummaryPermissionGroup[]
  draftRoles: RoleMatrix
  onChangeRolePermission: (role: string, key: string, checked: boolean) => void
  onChangeRolePermissions: (role: string, keys: string[], checked: boolean) => void

  // delete
  deleteConfirmInput: string
  onChangeDeleteConfirmInput: (v: string) => void
  onDelete: () => void
}

export interface AdminTabProps {
  subTab: AdminSubTab
  onSubTabChange: (sub: AdminSubTab) => void
  organization: AdminOrganizationProps
  members: AdminMembersProps
  devices: AdminDevicesProps
  storage: AdminStorageProps
}
```

`organization` / `members` / `devices` / `storage` 의 세부 prop interface 는 각 sub-tab 의 pattern (`OrgSettingsTab`, `OrgMembersTab + InvitationsTab`, `DevicesTab`, `StorageAnalyticsTab`) 에 직접 pass-through 하는 모양으로 정의.

**Storage chart slots**: BarChartCard / PieChartCard 의 JSX 는 caller 가 직접 작성해 slot 으로 전달 (Catalog stats 와 동일 패턴):
```ts
interface AdminStorageProps {
  loading?: boolean
  error?: string
  overviewSlot: ReactNode
  tierChartSlot: ReactNode
  projectChartSlot: ReactNode
  resolutionChartSlot: ReactNode
  formatChartSlot: ReactNode
  tierTableSlot: ReactNode
  costTableSlot: ReactNode
  recommendationsSlot: ReactNode
  onCopyReport: () => void
}
```

---

## 5. 도메인 type

view 자체 type 재정의는 최소화하고 `@ingradient/ui/patterns` 의 type 을 re-export 또는 inline import:
- `SettingsAccountTabUser`, `LicenseInfo`
- `DeleteAccountPreview`, `DeleteAccountResolutions`
- `SearchableUserCandidate`, `ProjectMemberRowMember`, `ProjectMemberRowRoleOption`
- `ExpandedPermissionGroup`, `SummaryPermissionGroup`, `RoleMatrix`
- `OrgMember`, `InvitationRow`, `InvitationsRoleOption`, `InvitationsCandidate`
- `JoinCodeRow`, `JoinCodesRoleOption`
- `DeviceRow`, `DeviceOption`, `DeviceLicense`, `IssuedToken` 등

`ProjectFormDraft` 는 view 가 자체 정의 (scene hook 과 매칭하는 shape):
```ts
export interface ProjectFormDraft {
  id: string
  projectType: 'general' | 'deflectometry'
  name: string
  description: string
  groupEnabled: boolean
  groupRegex: string
  groupRepRegex: string
  allowDup: boolean
  showFilenameInGallery: boolean
  showBboxClassNamesInDetail: boolean
  groupVisible: GroupVisible
}
```

---

## 6. 변경 파일

### 6.1 신규 13 file (위 §3 + tests/probes/settings-modal.mjs)

### 6.2 수정 (2 file)

- `packages/platform-pages/src/index.ts` — `export * from './settings-modal'` 추가
- `stories/pages/platform/0.0.1/SettingsModal.stories.tsx` — view 호출로 교체. scene hook + fixtures → props 변환. ≤ 200 줄 목표 (현재 462)
- 필요 시 `stories/pages/platform/0.0.1/settings/build-view-props.ts` helper 추가 (Catalog 패턴)

### 6.3 건드리지 않음

- `stories/fixtures/platform/0.0.1/settings-*.ts`
- `stories/pages/platform/0.0.1/settings/use-settings-modal-scene.ts`
- 모든 settings 관련 patterns

---

## 7. 검증

| # | 명령 | 기대 |
|---|---|---|
| 1 | `npx tsc --noEmit -p tsconfig.json` | 0 error |
| 2 | `npm run build:package` | `packages/platform-pages/lib/index.js` 41 KB → ~70 KB |
| 3 | `npm run build:storybook` | exit 0 |
| 4 | Playwright probe — 8 scenario | 8/8 pass |

probe 8 scenario:
- `default` — General tab (default)
- `account-default` — Account tab + form
- `account-password-dialog` — password dialog visible
- `account-delete-dialog` — delete dialog visible
- `project-default` — Project tab + form
- `admin-organization` — Admin org sub-tab
- `admin-devices` — Admin devices sub-tab
- `admin-storage` — Admin storage sub-tab

---

## 8. 성공 기준

- 검증 1~4 통과
- view 파일 12개 각 200 줄 미만
- story file ≤ 200 (현재 462, 57% 감소 목표)
- 회귀 없음 (다른 페이지 probe 통과)

---

## 9. 리스크

### 9.1 Project tab props 가 매우 큼 (~30개)

대응: `ProjectTabProps` 하나로 묶음. caller 는 scene hook 의 출력을 직접 spread.

### 9.2 admin sub-tab 의 4 patterns 가 모두 다른 props 모양

대응: `AdminTabProps` 안에 4 sub-props (organization/members/devices/storage). 각 sub-tab 컴포넌트가 자기 props 만 사용.

### 9.3 fixture-side data (mockProjectMembers, mockInvitations 등) 가 view 의 props 로 들어와야 함

대응: 모두 prop 으로 받음. story 가 fixture import 후 view 에 전달. (view 는 fixture 모름)

### 9.4 storage chart slots 가 많음 (4 chart + 2 table + recs)

대응: 모두 ReactNode slot. caller 가 BarChartCard 등 직접 작성. Catalog stats 패턴 일관성 유지.

### 9.5 types.ts 가 200 줄 초과

대응: Catalog 와 동일 — props 큰 그룹 (특히 ProjectTabProps, AdminTabProps) 을 별도 type file 로 분리 가능. 작성 도중 측정.

### 9.6 ProjectFormDraft 등 view 자체 type vs scene hook type 매칭

대응: scene hook 의 `projectDraft` 가 ProjectFormDraft 와 같은 shape 인지 확인. mismatch 시 view type 을 scene 모양에 맞춤.

---

## 10. Rollback

git revert 신규 13 + 수정 2. workspace 빌드 동일 상태. probe 회귀.

---

## 11. 다음 액션

1. 본 spec ok
2. types → styles → tabs/* → admin/* → SettingsModalView → barrel 순 작성
3. story rewrite + helper (필요 시)
4. probe 작성
5. 검증
6. Phase 5 (Dashboard) spec 으로 이동
