# Platform Settings 페이지 — 완전 spec

> 목표 — platform 의 **Settings 모달** (`SettingsModal`) 을 storybook 에 1:1 시각 / 상호작용 재현. 페이지가 아닌 **모달** 형태로 동작.

---

## 1. 모달 entry & 구조

- 위치: TopBar 의 UserMenu → "Settings" 클릭 시 열림 (별도 URL 없음)
- 컴포넌트: [frontend/components/settings/SettingsModal.tsx](../../workspace/projects/ingradient-platform/frontend/components/settings/SettingsModal.tsx) (194 lines)
- 스타일: [SettingsModal.styles.tsx](../../workspace/projects/ingradient-platform/frontend/components/settings/SettingsModal.styles.tsx) (81 lines)

```
┌── Overlay (z-index 1000, dark backdrop, click → close) ────────┐
│ ┌── Modal (1200 × 820, radius 12, max 100vw-32 / 100vh-32) ──┐ │
│ │ ┌── Header (16 20, "Settings" + close X) ───────────────┐ │ │
│ │ └────────────────────────────────────────────────────────┘ │ │
│ │ ┌── Main (grid 140px / 1fr, gap 0) ──────────────────────┐ │ │
│ │ │┌── VerticalTabs ────────┬── Body ────────────────────┐│ │ │
│ │ ││ General                │  (current tab content)     ││ │ │
│ │ ││ Account                │  padding 20px, overflow    ││ │ │
│ │ ││ Project                │  auto                      ││ │ │
│ │ ││ Edge                   │                            ││ │ │
│ │ ││ Admin*                 │                            ││ │ │
│ │ │└────────────────────────┴────────────────────────────┘│ │ │
│ │ └────────────────────────────────────────────────────────┘ │ │
│ └────────────────────────────────────────────────────────────┘ │
└────────────────────────────────────────────────────────────────┘
```

- *Admin tab 은 `isAdmin` 일 때만 노출
- mobile (`media.lg` 이하): grid → 1 column (탭 stack)

### 1-1. ui 부품 매핑 (이미 platform 이 사용중)
- `Overlay` ← `ModalBackdrop`
- `Modal` ← `ModalCard`
- `Header` ← `ModalHeader`
- `Title` ← `ModalTitle` (font-size 18px)
- `CloseBtn` ← `DialogCloseButton`
- `Main` ← `SettingsShell`
- `SettingsTabs` ← `VerticalTabs` (radius xs)

## 2. 탭 구조

### 2-1. SETTINGS_TABS (User 권한 — 4 탭)
- `general` — General
- `account` — Account
- `project` — Project
- `edge` — Edge

### 2-2. ADMIN_SETTINGS_TAB (Admin 추가 — isAdmin && 1 탭)
- `admin` — Admin (내부에 ADMIN_SUB_TABS 4 서브탭)

### 2-3. ADMIN_SUB_TABS (UiTabs underline variant, 가로 상단 탭)
- `organization` — Organization
- `members-invitations` — Members
- `devices` — Devices
- `storage` — Storage

---

## 3. Tab — General

[GeneralTab.tsx](../../workspace/projects/ingradient-platform/frontend/components/settings/tabs/GeneralTab.tsx) (98 lines)

### 3-1. 구조
- 모든 row 가 `<label>` 으로 wrap — 클릭 시 input 트리거
- Row: flex space-between, gap 16, padding `12px 0`, border-bottom strong, font-size 14px

### 3-2. SectionTitle 스타일
- `<h3>` margin 0, font-size 13px, weight 600, color text-muted, uppercase, letter-spacing 0.04em

### 3-3. 섹션 1 — Language
| Row | UI |
|---|---|
| "Interface language" | `<DropdownSelect>` `min-width 160`, 옵션 `[en/English, ko/Korean, vi/Vietnamese]` |

### 3-4. 섹션 2 — Workspace
| Row | UI |
|---|---|
| "Enable hover preview in data grids" | `<Checkbox>` |
| "Use single click to open edit flow" | `<Checkbox>` |
| "Show label badges on thumbnails" | `<Checkbox>` |

### 3-5. Hint (Section 끝)
> "These preferences are local to this browser and only affect how the portal UI behaves for your account." — font-size 13px, text-muted, line-height 1.5

### 3-6. 모든 state — localStorage (`useSettings()` store) — 즉시 적용, mutation 없음

---

## 4. Tab — Account

[AccountTab.tsx](../../workspace/projects/ingradient-platform/frontend/components/settings/account/AccountTab.tsx) (149 lines) + [PasswordDialog.tsx](../../workspace/projects/ingradient-platform/frontend/components/settings/account/PasswordDialog.tsx) (99) + [DeleteAccountDialog.tsx](../../workspace/projects/ingradient-platform/frontend/components/settings/account/DeleteAccountDialog.tsx) (127) + [ProjectResolutionCard.tsx](../../workspace/projects/ingradient-platform/frontend/components/settings/account/ProjectResolutionCard.tsx) (64)

### 4-1. 섹션 1 — Profile
| 요소 | 값 |
|---|---|
| Field | `<TextField>` `min-width 240`, value=accountName, placeholder "Display name", aria "Display name" |
| Save button | `<Button variant="accent">` — disabled if saving 또는 빈값 또는 user.name 동일. 라벨 "Saving…" / "Save" |
| Hint | "Signed in as {email}" / "Signed in user account." |
| Alert | `accountMessage` 있을 시 — tone "success" if "Saved." else "info" |

### 4-2. 섹션 2 — License
4가지 표시 모드:
1. **License loading** — "라이선스 정보를 불러오는 중…"
2. **Expired** — `<LicenseExpired>만료됨</LicenseExpired>` — color danger, weight 600
3. **Organization** — "조직 라이선스 ({name}) | 만료: {date} ({N}일)"
4. **Personal** — "개인 라이선스 | 만료: {date} ({N}일)"

(font-size 13px, text-muted, weight 600 if expired)

### 4-3. 섹션 3 — Access
2 buttons (variant secondary):
- "Change password" → PasswordDialog 열림
- "Log out" → logout()

### 4-4. 섹션 4 — Delete account
- Hint: "Type your email address exactly, then press Delete Account. You will be asked for your password to confirm, and any shared projects will need to be transferred or deleted before the account is removed."
- Row:
  - Field (placeholder=user.email): email 매칭 확인
  - DangerButton (`Button secondary tone="danger"`) — disabled until match. 라벨 "Preparing…" / "Delete Account"
- Alert (`tone="danger"`) — `deleteAccountMessage` 있을 시

### 4-5. PasswordDialog
- `DialogShell width "min(420px, 100%)"`, title "Change Password"
- 3 fields (`PasswordField` width 100%):
  - "Current password"
  - "New password"
  - "Confirm new password"
- 검증:
  - confirm 입력했지만 newPassword !== confirm → `Alert tone="danger">"New password and confirmation must match."`
  - passwordMessage 있을 시 — tone "success" if "Password changed." else "danger"
- Actions:
  - Cancel (secondary)
  - Save (accent) — disabled if saving 또는 current 빈값 또는 new 빈값 또는 match 불일치

### 4-6. DeleteAccountDialog
- `DialogShell width "min(640px, 100%)"`, title "Delete Account"
- 본문:
  - Copy (설명 텍스트)
  - solo_projects (남은 유일 멤버 프로젝트 — 삭제됨 경고): `Alert tone="warning"` + 각 `<SoloProjectCard>` (Title + Meta `role: X · members: N`)
  - requires_resolution (소유권 이전 필요): `<ProjectResolutionCard>` 각 — Transfer / Delete radio + transfer target select
  - unresolvedCount > 0 일 시: `Alert tone="danger">"Select a transfer target..."`
  - Password label + PasswordField
  - Final confirm label + ConfirmTextField (사용자가 "DELETE" 입력 필요)
- Actions:
  - Cancel (secondary)
  - "Delete account" (secondary tone=danger) — disabled if pending 또는 unresolvedCount > 0 또는 password 없음 또는 final !== "DELETE"

---

## 5. Tab — Project

[ProjectTab.tsx](../../workspace/projects/ingradient-platform/frontend/components/settings/project/ProjectTab.tsx) (166 lines) — Project 가 선택 안 됐을 시 `<Placeholder>No project selected. Select a project first.</Placeholder>`.

구성: `ProjectSettingsForm` → `ProjectMemberInvite` → "Members" Subsection → `ProjectMembersList` → `ProjectPermissionsPanel` (canManagePermissions 일때만) → `DeleteProjectSection` (canDeleteProject && projectsCount ≥ 2 일때만).

### 5-1. ProjectSettingsForm
[ProjectSettingsForm.tsx](../../workspace/projects/ingradient-platform/frontend/components/settings/project/ProjectSettingsForm.tsx) (156 lines)

**AutoSaveStatus** (form 상단):
- 5 상태 메시지:
  - `!canEditProjectSettings` → "You can view this project, but project settings are read-only for your role."
  - `nameInvalid` → "Project name cannot be empty."
  - `'saving'` → "Saving project settings…"
  - `'pending'` → "Saving shortly…"
  - `'saved'` → "All project changes saved."
  - `'error'` → error message 또는 "Failed to save project settings."
  - default → "Changes save automatically."
- `$error` 일때 다른 색상

**Project name 섹션**:
- `TitleRow`: SectionTitle "Project name" + ProjectTypeTag (`$tone="deflectometry"|"general"`) — "Deflectometry Project" / "General Project"
- Row: `Input` value=draft, placeholder "Project name", disabled if !canEdit

**Description 섹션**:
- Row: `Textarea` placeholder "Project description (optional)", rows 3, disabled if !canEdit

**Data grouping 섹션**:
- Row: Label "Group multiple images as one item (for labeling)" + Checkbox
- 조건부 (groupEnabledDraft true):
  - Label "Group key pattern (regex with one capture group)" + Input (placeholder `^([^_]+_[^_]+)_`) + Hint "File name is matched against this regex; the first captured group becomes the group key."
  - Label "Representative image pattern (optional regex)" + Input (placeholder `_x_orig\\.png$`) + Hint "If set, the matching file becomes the representative image for each group."

**Upload 섹션**:
- Row: Label "Allow duplicate file names" + Checkbox

**Display 섹션**:
- Row: Label "Show file name below each thumbnail in Catalog" + Checkbox
- Row: Label "Show class name on bbox in Image Detail" + Checkbox

**Group visibility (owner only) 섹션**:
- 조건부 (isProjectOwner 만 노출)
- Row: Label "Only owner can see all images in group" + Checkbox (groupVisibleDraft !== 'all')
- 조건부 (groupVisibleDraft !== 'all'):
  - Row: Label "Include manager" + Checkbox (groupVisibleDraft === 'owner_and_manager')

### 5-2. ProjectMemberInvite
[ProjectMemberInvite.tsx](../../workspace/projects/ingradient-platform/frontend/components/settings/project/ProjectMemberInvite.tsx) (105 lines) — canInviteMembers 아닐 시 null.

- SectionTitle "Add member"
- Input (type=search) value=memberSearchQuery, placeholder "Search registered users by name or email"
- 조건부 (≥3 chars):
  - 결과 list (`<SearchResultRow primary=... secondary=... actionLabel="Add"|"Adding…">`)
  - 없으면 `<Placeholder>No registered users found.</Placeholder>`
- 조건부 (<3 chars):
  - `<Placeholder>Type at least 3 characters to search registered users.</Placeholder>`
- inviteMessage 있을 시: 별도 Row + Placeholder

### 5-3. ProjectMembersList
[ProjectMembers.tsx](../../workspace/projects/ingradient-platform/frontend/components/settings/project/ProjectMembers.tsx) (185 lines)

- `<ul>` MemberList
- 각 MemberRow: 5-grid `minmax(140px,1.1fr) minmax(140px,1fr) minmax(220px,1.3fr) auto auto`, gap 12, padding `10px 0`, border-bottom strong
- 컬럼 (member 당):
  - name (ellipsis)
  - organization (ellipsis)
  - email (ellipsis)
  - role: `<SelectField>` `min-width 100`, 옵션 ROLES (owner/manager/labeler/reviewer/client/viewer) — disabled if !canManagePermissions or isOnlyOwner
  - actions: DangerButton "Remove" (`size sm padding 6 10`) — disabled if !canManagePermissions or isOnlyOwner
- 빈 상태: `Placeholder>No members yet. Invite users above.</Placeholder>`
- isOnlyOwner 일 경우 role select / remove 모두 disabled + title "Add another owner before changing this role." / "Add another owner before removing this account."

**RemoveMemberConfirmDialog** (`pendingRemoveMember`):
- `DialogShell title="Remove Member" width="min(420px, 100%)"`
- 본문: "Remove {email} from this project?" + "This member will lose access to the project immediately."
- Actions: Cancel + DangerButton "Remove" / "Removing…"

### 5-4. ProjectPermissionsPanel
[ProjectPermissions.tsx](../../workspace/projects/ingradient-platform/frontend/components/settings/project/ProjectPermissions.tsx) (96 lines) → 내부에 [ProjectPermissionMatrix.tsx](../../workspace/projects/ingradient-platform/frontend/components/settings/project/ProjectPermissionMatrix.tsx) (192 lines)

**Matrix table**:
- 가로: 5 권한 그룹 ("Labeling" 3 / "Share / Analysis" 2 / "Edge" 1) 또는 expandAll 시 전체 권한
- 세로: 6 roles (owner/manager/labeler/reviewer/client/viewer)
- 각 셀: `<Checkbox>` — disabled if role === 'owner', indeterminate 상태 가능 (summary mode 에서)
- "Role" search (좌상단)

**컬럼 헤더**:
- 1행: 권한 그룹 라벨 (Labeling / Share / Edge)
- 2행: 각 권한 라벨 + `?` 아이콘 (description 있을 시 hover tooltip)

**Sticky 헤더 / 좌측 role 컬럼**.

### 5-5. DeleteProjectSection
[DeleteProjectSection.tsx](../../workspace/projects/ingradient-platform/frontend/components/settings/project/DeleteProjectSection.tsx) (75 lines)

- SubsectionTitle "Delete Project"
- Hint: 프로젝트 이름 입력 안내
- Row: TextField (placeholder = projectName) + DangerButton "Delete project" (`pending` 시 "Deleting…")
- Disabled until input === projectName

---

## 6. Tab — Edge

- 빈 프로젝트일 시: `<Placeholder>No project selected. Select a project first.</Placeholder>`
- 그 외: `<EdgeManagementPanel projectId={currentProjectId} />` 위임 — 외부 컴포넌트.

**Storybook scope**: EdgeManagementPanel 은 별도 페이지로 다룸. 본 spec 에서는 placeholder + 외부 위임만 표현.

---

## 7. Tab — Admin (서브탭 4개)

[SettingsAdminContent.tsx](../../workspace/projects/ingradient-platform/frontend/components/settings/SettingsAdminContent.tsx) (52 lines)

- `<UiTabs items={ADMIN_SUB_TABS} variant="underline">` (가로 상단)
- 각 서브탭 위에 `<AdminTabDesc>` (margin 8 0 16, font-size 13, text-muted, line-height 1.5):
  - organization: "Manage your organization's name and general settings."
  - members-invitations: "View and manage organization members, their roles, and send invitations to new members."
  - devices: "View and manage Edge devices registered to your organization."
  - storage: "Analyze image storage and bandwidth usage for cost optimization."

### 7-1. Sub — Organization
[OrgTab.tsx](../../workspace/projects/ingradient-platform/frontend/components/settings/tabs/OrgTab.tsx) (130 lines)

- Wrap: column gap 20, max-width 480
- SectionTitle "Organization" (font-size 16, weight 600)
- Fields:
  - "Code" — display-only (`FieldValue` text-muted)
  - "Name" — TextField if isAdmin else FieldValue
  - "Status" — display-only
- SaveRow (isAdmin 만): Button "Save" / "Saving…" — disabled if saving 또는 nameDraft empty
- SuccessMsg / ErrorMsg 영역
- 로딩 / 빈 상태: `<LoadingState>No organization | Loading…</LoadingState>`

### 7-2. Sub — Members & Invitations
2 컴포넌트가 스택:

#### 7-2-A. OrgMembersTab
[OrgMembersTab.tsx](../../workspace/projects/ingradient-platform/frontend/components/settings/tabs/OrgMembersTab.tsx) (99 lines)

- SectionTitle "Members" (15px weight 600)
- `<Table columns rows ariaLabel="Members table">` 사용
- 컬럼: loginId / displayName / role.code (text-muted) / status (text-muted) / [actions if isAdmin]
- Action: Remove button (size sm danger secondary) — own user 면 null
- Confirm dialog (`useConfirm`): "Remove this member?", danger
- 빈 상태: `<Empty>No members</Empty>` (margin 16 0 0, text center)

#### 7-2-B. InvitationsTab
[InvitationsTab.tsx](../../workspace/projects/ingradient-platform/frontend/components/settings/tabs/InvitationsTab.tsx) (260 lines)

- 2 섹션 (Wrap gap 32)

**Section 1 — Invitations**:
- SectionTitle "Invitations"
- SectionDesc "Search for a registered user and send them an invitation..."
- isAdmin 일때 search form:
  - SearchRow: TextField (≥3 chars 검색) + SelectField role (organizer/member)
  - 결과 list (`<SearchResultRow>`) — invitingUserId 동안 "Inviting…"
  - "Type at least 3 characters..." 힌트
  - inviteMsg 있을 시 FeedbackMsg
- Table:
  - 컬럼: email / role / status (status 별 색: pending muted, accepted success, revoked/expired danger) / expires / [Revoke if pending && isAdmin]
- 빈 상태: "No invitations"

**Section 2 — Join Codes**:
- SectionTitle "Join Codes"
- SectionDesc "Generate a shareable code..."
- isAdmin 일때 form:
  - SelectField role + TextField "Max uses (optional)" (digits only) + Button "Create Code" (현재 비활성 — "Coming soon")
- Table:
  - 컬럼: code (monospace) / role / uses / expires / [Delete if isAdmin]
- 빈 상태: "No join codes"

### 7-3. Sub — Devices
[DevicesTab.tsx](../../workspace/projects/ingradient-platform/frontend/components/settings/devices/DevicesTab.tsx) (83 lines) — 4 컴포넌트 컴포지션

#### 7-3-A. DevicesLicenseSection (94 lines)
- 현재 라이선스 표시 (만료일 / 타입 / 비용)
- "Renew" 토글 → 보이면: date picker + Submit "Renew"
- Pending: "Renewing…"

#### 7-3-B. DevicesForms (155 lines)
2 토글 form:
- **Register Device** form: UID Input + Name Input + Button "Register"
- **Issue License** form: Device DropdownSelect (activeDevices) + ValidDays NumberField + Button "Issue"
- 발급 후: `issuedToken` 표시 (사용자가 copy)

#### 7-3-C. DevicesTable (139 lines)
- TableHeader: SectionTitle "Devices" + TableActions (Issue License / Register Device buttons — isAdmin 만)
- FilterBar: SearchField (UID/name) + DropdownSelect status (all/active/revoked)
- Table:
  - 컬럼: Device UID (mono) / Name / Status (StatusBadge `$status`) / Registered (date) / Last seen (datetime) / [actions if isAdmin]
- Actions per row: Details / Revoke (if not REVOKED) / Delete (모두 size sm secondary danger 등)
- 빈 상태: "No devices registered" 또는 "No devices match the filter"
- 로딩: "Loading…"

#### 7-3-D. DeviceDetailDialog (68 lines)
- `DialogShell` 로 device metadata 표시 (UID / Name / Token issued / Last seen / Project / etc.)

### 7-4. Sub — Storage Analytics
[StorageAnalyticsTab.tsx](../../workspace/projects/ingradient-platform/frontend/components/settings/tabs/StorageAnalyticsTab.tsx) (95 lines) + 8 sub components

- AnalyticsHeader:
  - AnalyticsTitle "Storage Analytics"
  - Button "Copy Report" (secondary sm) — clipboard copy + toast
- StorageOverview (overview cards)
- SectionTitle "Storage by Tier" + StorageTierChart
- SectionTitle "Storage by Project (Top 10)" + StorageProjectChart
- SectionGrid (2 column):
  - "Image Size Distribution" + StorageResolutionChart
  - "Upload Format" + StorageFormatChart
- SectionTitle "Tier Efficiency" + StorageTierTable
- SectionTitle "Monthly Cost Estimate" + StorageCostTable
- StorageRecommendations
- Error 시: "{error}" + Retry button

**모든 chart 는 recharts 사용** — 이미 ui 에 BarChartCard / LineChartCard / PieChartCard 등 있음.

---

## 8. 모달 외부 컴포넌트 (이미 ui 에 존재)

| ui Component | 사용처 |
|---|---|
| `ModalBackdrop` / `ModalCard` / `ModalHeader` / `ModalTitle` / `DialogCloseButton` | 모달 외각 |
| `SettingsShell` | grid layout (sidebar + body) |
| `VerticalTabs` | 좌측 5 탭 |
| `Tabs` (`variant="underline"`) | Admin 4 서브탭 |
| `DialogShell` | 모든 confirm dialog |
| `Alert` | 메시지 표시 (success / info / warning / danger) |
| `TextField` / `PasswordField` / `TextareaField` / `Checkbox` / `DropdownSelect` / `SelectField` / `Button` / `SearchField` / `NumberField` | form inputs |
| `Table` | members / invitations / join codes / devices |
| `SearchResultRow` | member / user search 결과 |
| `LoadingState` / `ErrorState` | 로딩 / 에러 |
| `useConfirm` (hook) | inline confirm |
| `useToast` (hook) | toast |
| Chart cards (`BarChartCard` / `LineChartCard` / `PieChartCard`) | storage analytics |

## 9. 현 storybook 상태 — Gap

| 영역 | Storybook 현재 | 차이 |
|---|---|---|
| SettingsModal shell | 단순 demo (`settings-dialog.stories.tsx`) | platform 의 5 tabs + admin 4 sub-tabs 통합 필요 |
| GeneralTab | 없음 | 신규 — language dropdown + 3 checkboxes + hint |
| AccountTab | 없음 | 신규 — Profile / License / Access / Delete 4 sections + 2 dialog |
| PasswordDialog | 없음 | 신규 — 3 password fields + match validation |
| DeleteAccountDialog | 없음 | 신규 — solo projects + resolution cards + password + final confirm |
| ProjectTab | 없음 | 신규 — form (10+ fields) + invite + members + permissions + delete |
| ProjectSettingsForm | 없음 | 신규 — name / type tag / description / data grouping / upload / display / visibility |
| ProjectMemberInvite | 없음 | 신규 — search + SearchResultRow |
| ProjectMembersList | 없음 | 신규 — 5-grid row + role select + remove + confirm |
| ProjectPermissionMatrix | 없음 | 신규 — sticky table + 6 roles × N permissions checkboxes |
| DeleteProjectSection | 없음 | 신규 — name 매칭 + danger button |
| OrgTab | 없음 | 신규 — Code / Name / Status + save |
| OrgMembersTab | 없음 | 신규 — Members Table + remove |
| InvitationsTab | 없음 | 신규 — Invitations + Join Codes 2 sections |
| DevicesTab | 없음 | 신규 — License + Forms + Table + Detail dialog |
| StorageAnalyticsTab | 없음 | 신규 — 4 charts + 2 tables + recommendations + Copy Report |

## 10. 데이터 모델 — Storybook fixtures 필요

### 10-1. User
```ts
{ id: string, name: string, email: string }
```

### 10-2. LicenseInfo
```ts
{ type: 'organization'|'personal', organizationName?: string,
  expiresAt: string|null, remainingDays: number|null, expired: boolean }
```

### 10-3. Project
```ts
{ id, name, description, deflectometry_enabled, multi_image_group_enabled,
  group_key_regex, group_representative_regex, allow_duplicate_filenames,
  group_all_images_visible_to: 'owner'|'owner_and_manager'|'all',
  show_filename_in_gallery, show_bbox_class_names_in_detail }
```

### 10-4. ProjectMember
```ts
{ id, name?, organization?, email, role: 'owner'|'manager'|...|'viewer' }
```

### 10-5. Permissions matrix
```ts
{ roles: { owner: {...}, manager: {...}, ... } }  // key 별 boolean
```

### 10-6. Org member
```ts
{ id, userId, user: { loginId, displayName }, role: { code }, status }
```

### 10-7. Invitation
```ts
{ id, email, roleId, status: 'pending'|'accepted'|'revoked'|'expired',
  expiresAt: string|null }
```

### 10-8. JoinCode
```ts
{ id, code, roleId, usedCount, maxUses: number|null, expiresAt: string|null }
```

### 10-9. Device
```ts
{ id, deviceUid, name?, status: 'ACTIVE'|'REVOKED', registeredAt, lastSeenAt? }
```

### 10-10. StorageAnalyticsData
```ts
{ overview: { totalSize, totalImages, ... },
  byTier: [...], byProject: [...], byFormat: [...], byResolution: [...],
  costEstimate: [...], recommendations: [...] }
```

## 11. Verification

각 phase 끝에 typecheck + build + playwright probe:
- 모든 신규 story root 렌더
- 모든 콘솔 error 0
- 핵심 시나리오 (modal open / tab 전환 / 폼 입력 / dialog 열림 / table 행 액션) 동작 확인

## 12. 변경 이력
- 2026-05-15: 초안 (Joon Ho Lee)
