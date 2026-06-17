# Platform Settings 모달 — storybook 재현 로드맵

> 기반: [platform-settings-page-spec.md](./platform-settings-page-spec.md). 사용자가 platform 같이 modal 형태로 진행.

## 원칙

1. 모든 UI 부품은 ingradient-ui 의 정식 component / pattern 으로 추가 — platform 이 hook 만 연결하면 동일 화면.
2. 각 신규 pattern 200줄 미만 + `*.stories.tsx` 동반.
3. SettingsModal story 는 얇은 orchestrator — UI 본체는 모두 ui pattern, mock state 는 `useSettingsModalScene` hook.
4. 매 phase 끝에 typecheck + build + playwright probe 통과 필수.
5. 이미 platform 이 ui 의 `ModalBackdrop / ModalCard / SettingsShell / VerticalTabs / Tabs / DialogShell` 등을 사용중 — **그대로 재사용**.

## Phase 의존 관계

```
Phase 1 (SettingsShell + GeneralTab — 가장 단순, 검증용)
   └→ Phase 2 (AccountTab + PasswordDialog + DeleteAccountDialog)
        └→ Phase 3 (ProjectSettingsForm — 가장 복잡한 form)
             └→ Phase 4 (ProjectMemberInvite + ProjectMembersList + DeleteProjectSection)
                  └→ Phase 5 (ProjectPermissionMatrix)
                       └→ Phase 6 (OrgTab + OrgMembersTab)
                            └→ Phase 7 (InvitationsTab + JoinCodes)
                                 └→ Phase 8 (DevicesTab — License + Forms + Table + Detail dialog)
                                      └→ Phase 9 (StorageAnalyticsTab — 4 charts + 2 tables)
                                           └→ Phase 10 (Page orchestrator + scenarios)
                                                └→ Phase 11 (Polish / fidelity audit)
```

각 phase 결과물 = ingradient-ui 의 신규 pattern + 해당 story + 시나리오.

---

## Phase 1 — SettingsModalShell + GeneralTab [S]

**목적**: SettingsModal 의 shell + 가장 단순한 General 탭 — 전체 흐름 검증용.

### 1-1. ui pattern (이미 platform 사용중인 ui 컴포넌트 활용)
- 이미 있는 것 활용: ModalBackdrop / ModalCard / ModalHeader / ModalTitle / DialogCloseButton / SettingsShell / VerticalTabs

### 1-2. 신규 pattern
- `src/patterns/shells/settings-section.tsx` — SettingsSection (title + children, font-size 13 weight 600 muted uppercase)
- `src/patterns/shells/settings-row.tsx` — SettingsRow (`<label>` wrapper, flex space-between, gap 16, padding 12 0, border-bottom strong, font-size 14)
- `src/patterns/shells/settings-hint.tsx` — SettingsHint (font-size 13, text-muted, line-height 1.5)
- `src/patterns/shells/settings-general-tab.tsx` — GeneralTab (Section + Row 사용, locale select + 3 checkboxes + hint)

### 1-3. Verification
- 4 신규 pattern stories
- modal open / close interaction
- locale 변경 / checkbox 토글

---

## Phase 2 — AccountTab + Password / Delete Account dialogs [M]

### 2-1. 신규 pattern
- `src/patterns/shells/license-info-display.tsx` — LicenseInfoDisplay (4 state: loading / expired / organization / personal)
- `src/patterns/shells/settings-account-tab.tsx` — AccountTab (Profile / License / Access / Delete 4 sections)
- `src/patterns/shells/password-change-dialog.tsx` — PasswordChangeDialog (3 PasswordField + match validation + 2 alerts)
- `src/patterns/shells/project-resolution-card.tsx` — ProjectResolutionCard (radio: transfer/delete + transfer target select)
- `src/patterns/shells/delete-account-dialog.tsx` — DeleteAccountDialog (DialogShell + solo cards + resolution list + password + final confirm)

### 2-2. Verification
- 5 신규 stories
- PasswordChangeDialog 의 confirm match validation 확인 (불일치 시 Alert)
- DeleteAccountDialog 의 disabled submit 로직 (unresolvedCount > 0 / password / final !== "DELETE")

---

## Phase 3 — ProjectSettingsForm [M]

가장 복잡한 form — 10+ fields, 4 conditional sections, autosave status.

### 3-1. 신규 pattern
- `src/patterns/shells/auto-save-status.tsx` — AutoSaveStatus (`$error` boolean → 다른 색)
- `src/patterns/shells/project-type-tag.tsx` — ProjectTypeTag (`$tone="deflectometry"|"general"`)
- `src/patterns/shells/settings-field-row.tsx` — SettingsFieldRow (label + control + hint)
- `src/patterns/shells/project-settings-form.tsx` — ProjectSettingsForm
  - Sections: Project name + type tag / Description / Data grouping (conditional regex inputs) / Upload / Display / Group visibility (owner only, conditional)
  - 모든 field disabled if !canEdit
  - 모든 변경 = onChange handler (autosave debounce 는 platform hook 에서)

### 3-2. Verification
- 4 신규 stories
- conditional 섹션 (grouping enabled / owner only) 토글
- autosave 5 상태별 메시지 표시

---

## Phase 4 — Project members section [M]

ProjectMemberInvite + ProjectMembersList + DeleteProjectSection.

### 4-1. 신규 pattern
- `src/patterns/shells/project-member-invite.tsx` — ProjectMemberInvite (search input + SearchResultRow list + placeholder text 분기)
- `src/patterns/shells/project-member-row.tsx` — ProjectMemberRow (5-grid columns + RoleSelect + Remove button)
- `src/patterns/shells/project-members-list.tsx` — ProjectMembersList (ul + rows + 빈 상태 + RemoveMemberConfirmDialog)
- `src/patterns/shells/delete-project-section.tsx` — DeleteProjectSection (name 입력 + danger button)

### 4-2. Verification
- 4 신규 stories
- isOnlyOwner 일 때 role select / remove disabled + title 표시
- Remove member confirm dialog interaction

---

## Phase 5 — ProjectPermissionMatrix [M]

### 5-1. 신규 pattern
- `src/patterns/shells/permission-help-tooltip.tsx` — `?` icon + hover tooltip
- `src/patterns/shells/project-permission-matrix.tsx` — Sticky table:
  - 6 roles × N permissions (summary 5 / expand all 더 많음)
  - 그룹 헤더 (Labeling / Share / Edge)
  - role 별 row + 각 permission 셀 checkbox (owner 비활성, indeterminate 가능)
  - Role search 입력 (좌상단)
  - sticky 좌측 role 컬럼

### 5-2. Verification
- 2 신규 stories
- summary vs expandAll 토글
- role search filter
- indeterminate 상태 표시

---

## Phase 6 — OrgTab + OrgMembersTab [S]

### 6-1. 신규 pattern
- `src/patterns/shells/org-settings-tab.tsx` — OrgTab (Code display / Name TextField / Status display / Save row + success/error msg)
- `src/patterns/shells/org-members-tab.tsx` — OrgMembersTab (SectionTitle + Table + remove confirm)

### 6-2. Verification
- 2 신규 stories
- isAdmin 권한별 다른 렌더 (name editable vs read-only, Save button vs hidden)
- 빈 상태 표시

---

## Phase 7 — InvitationsTab [M]

### 7-1. 신규 pattern
- `src/patterns/shells/invitations-section.tsx` — Invitations 섹션
  - search form (TextField + SelectField role) + result list (SearchResultRow)
  - Table (email / role / status / expires / [Revoke])
  - status 별 color (pending muted / accepted success / revoked/expired danger)
- `src/patterns/shells/join-codes-section.tsx` — Join Codes 섹션
  - form (SelectField role + TextField max uses + Button)
  - Table (code mono / role / uses / expires / [Delete])
- `src/patterns/shells/invitations-tab.tsx` — 두 섹션 wrapper

### 7-2. Verification
- 3 신규 stories
- 4 status color 확인
- monospace code 표시
- isAdmin / non-admin 분기

---

## Phase 8 — DevicesTab [M-L]

가장 복잡한 admin 서브탭 — 4 컴포넌트 컴포지션.

### 8-1. 신규 pattern
- `src/patterns/shells/devices-license-section.tsx` — DevicesLicenseSection (license info + renew toggle + date picker + submit)
- `src/patterns/shells/devices-forms.tsx` — DevicesForms (2 toggle forms: Register + IssueLicense, issuedToken 표시)
- `src/patterns/shells/devices-table.tsx` — DevicesTable (header + filter bar + table + actions per row)
- `src/patterns/shells/device-status-badge.tsx` — StatusBadge (`$status="ACTIVE"|"REVOKED"`)
- `src/patterns/shells/device-detail-dialog.tsx` — DeviceDetailDialog (metadata 표시)
- `src/patterns/shells/devices-tab.tsx` — 4 컴포넌트 컴포지션

### 8-2. Verification
- 6 신규 stories
- 다양한 device status / filter / 빈 상태
- toggle form 열림 / 닫힘

---

## Phase 9 — StorageAnalyticsTab [M]

### 9-1. 신규 pattern
- `src/patterns/shells/storage-overview.tsx` — Overview cards (totalSize / totalImages / activeProjects / etc.)
- `src/patterns/shells/storage-tier-chart.tsx` — StorageTierChart (BarChart wrapping)
- `src/patterns/shells/storage-project-chart.tsx` — top 10 projects BarChart
- `src/patterns/shells/storage-resolution-chart.tsx` — BarChart
- `src/patterns/shells/storage-format-chart.tsx` — PieChart
- `src/patterns/shells/storage-tier-table.tsx` — Tier efficiency table
- `src/patterns/shells/storage-cost-table.tsx` — Cost estimate table
- `src/patterns/shells/storage-recommendations.tsx` — recommendations list
- `src/patterns/shells/storage-analytics-tab.tsx` — composition with SectionGrid

### 9-2. Verification
- 9 신규 stories
- loading state 표시
- "Copy Report" 버튼 동작 (clipboard mock)

---

## Phase 10 — Page orchestrator + scenarios [M-L]

### 10-1. 신규 / 수정 파일
- `stories/pages/platform/0.0.1/settings/use-settings-modal-scene.ts` — 통합 mock state hook
- `stories/fixtures/platform/0.0.1/settings-user.ts` — 1 user mock
- `stories/fixtures/platform/0.0.1/settings-license.ts` — 3 license states (org / personal / expired)
- `stories/fixtures/platform/0.0.1/settings-project.ts` — 2-3 project mock (deflectometry / general)
- `stories/fixtures/platform/0.0.1/settings-members.ts` — 5-10 project members
- `stories/fixtures/platform/0.0.1/settings-permissions.ts` — RoleMatrix 기본값
- `stories/fixtures/platform/0.0.1/settings-org.ts` — Org members + Invitations + Join codes mock
- `stories/fixtures/platform/0.0.1/settings-devices.ts` — 10+ devices (active / revoked)
- `stories/fixtures/platform/0.0.1/settings-storage.ts` — StorageAnalyticsData mock (overview + 모든 차트)
- `stories/fixtures/platform/0.0.1/settings-scenarios.ts` — 30+ scenarios
- `stories/pages/platform/0.0.1/SettingsModal.stories.tsx` — orchestrator (얇은, 200줄 미만)

### 10-2. 시나리오 (30+)
**Priority 1 — 핵심**:
- `default` — General tab 열림
- `account-default` / `account-license-org` / `account-license-personal` / `account-license-expired` / `account-license-loading`
- `account-password-dialog-open` / `account-delete-dialog-open` / `account-delete-with-solo-projects`
- `project-default` / `project-readonly` / `project-grouping-enabled` / `project-owner-view`
- `project-members-list` / `project-members-only-owner` / `project-member-invite-results`
- `project-permissions-summary` / `project-permissions-expand-all`
- `project-delete-section-visible`
- `edge-no-project` (placeholder)
- `admin-organization` / `admin-org-members` / `admin-invitations-pending`
- `admin-devices` / `admin-devices-empty` / `admin-devices-detail-dialog-open`
- `admin-storage` / `admin-storage-loading`

**Priority 2 — Edge cases**:
- `org-loading` / `org-error`
- `delete-project-confirm-open`
- `password-mismatch`

### 10-3. Verification
- 30+ story root 렌더 확인 (모두 console error 0)
- 각 탭 전환 작동
- 핵심 dialog interaction 확인

---

## Phase 11 — Polish + design fidelity audit [S-M]

### 11-1. 후보 fixes
- VerticalTabs 의 selected state 색·padding 매칭
- SectionTitle 색·spacing
- Table 컬럼 정렬 / 컬럼 width
- DialogShell 의 width / 본문 line-height
- AutoSaveStatus 의 $error 색
- ProjectMemberRow 의 5-grid 컬럼 비율
- PermissionMatrix sticky 헤더 / 좌측 컬럼 z-index / shadow
- StatusBadge 의 색 매핑
- StorageAnalytics 의 차트 색 / 라벨 폰트

### 11-2. Verification
- 핵심 6 scenarios playwright probe
- 사용자 수동 visual review — platform 의 실제 SettingsModal 과 storybook 좌우 비교

---

## Cross-cutting

매 phase 마다:
1. typecheck — `npx tsc --noEmit -p tsconfig.json`
2. build — `npm run build:storybook`
3. probe — playwright 신규 story id 정상 렌더 + console error 0
4. barrel update — `src/patterns/index.ts`

커밋 메시지 한국어, feat: / refactor: prefix.

---

## 신규 file 누적 추정

### Patterns (ingradient-ui)
- Phase 1: 4 patterns
- Phase 2: 5 patterns
- Phase 3: 4 patterns
- Phase 4: 4 patterns
- Phase 5: 2 patterns
- Phase 6: 2 patterns
- Phase 7: 3 patterns
- Phase 8: 6 patterns
- Phase 9: 9 patterns
- **합계: 39 신규 patterns + 39 stories (78 신규 파일)**

### Fixtures (storybook)
- 9 fixtures + 1 scenarios = 10 파일

### Story side
- 1 hook + 1 orchestrator = 2 파일

---

## Mock 데이터 규모 추정

- **user**: 1 (mock)
- **license**: 3 변형 (org / personal / expired)
- **projects**: 2-3 (deflectometry / general / readonly)
- **project members**: 5-10 (다양한 role)
- **role permissions**: 6 roles × ~15 permissions
- **org members**: 5-8 (다양한 role.code / status)
- **invitations**: 5-8 (4 status 모두)
- **join codes**: 2-4
- **devices**: 10+ (active / revoked / different statuses)
- **storage**: full mock (overview + 4 charts + 2 tables + 3 recommendations)

---

## Gaps — 추후 platform 마이그레이션 시 작업

storybook 에서 mock 으로 처리한 부분 = platform 에서 실제 연결 필요:
- `useSettings()` localStorage store (General 탭)
- `useSettingsAccountState()` (Account 탭) — API mutation, query
- `useSettingsProjectState()` (Project 탭) — autosave debounce, members query/mutation
- IAM API (`getOrganization`, `listMembers`, `removeMember`, invitations / join codes)
- Devices API (`useDevicesTabState()`)
- Storage Analytics API (`fetchStorageAnalytics`, `buildReportText`)
- `useConfirm()` / `useToast()` hooks 통합

ingradient-ui 에 들어가지 않는 platform 전용:
- `useSettingsModalOpen()` (모달 open state)
- 각 탭의 hook 의 business logic
- IAM / API call

---

## 시나리오 채택 우선순위

**Priority 1 (반드시 필요)**: default, account-default, project-default, admin-organization, admin-devices
**Priority 2 (시각 검증)**: 각 탭의 modal open / loading / empty / error
**Priority 3 (edge cases)**: only-owner / no-project / readonly / 모든 license 변형

---

## 변경 이력
- 2026-05-15: 초안 (Joon Ho Lee)
