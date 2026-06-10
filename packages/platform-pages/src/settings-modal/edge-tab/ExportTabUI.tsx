import { Button, Checkbox, TextField } from '@ingradient/ui/components'
import {
  ActionsRow,
  CheckDivider,
  CheckItem,
  CheckList,
  ErrorHint,
  FieldRow,
  Hint,
  Section,
  SectionTitle,
  UserEmailNote,
  WarningBox,
} from './edge.styles'
import { ExportHistory } from './ExportHistory'
import type { EdgeDatasetOption, EdgeMemberOption, EdgePackageView } from './edge-types'

export interface ExportTabUIProps {
  datasets: EdgeDatasetOption[]
  members: EdgeMemberOption[]
  packages: EdgePackageView[]
  selectedDatasets: Set<string>
  selectedUsers: Set<string>
  deviceName: string
  /** 인증 캐시 누락 user 이름 목록. 비어있지 않으면 경고 표시. */
  uniqueMissingHash: string[]
  pending: {
    create: boolean
    download: boolean
    reissue: boolean
    rename: boolean
  }
  /** Create mutation 의 error 메시지. 있으면 ErrorHint 표시. */
  createError?: string | null
  onDeviceNameChange: (value: string) => void
  onToggleDataset: (id: string) => void
  onToggleUser: (userId: string) => void
  onSelectAllDatasets: (checked: boolean) => void
  onCreate: () => void
  onDownload: (packageId: string) => void
  onReissue: (packageId: string) => void
  onRenameDevice: (packageId: string, newName: string) => void
}

/**
 * Edge project file 생성 + 이력 tab UI. Platform 의 `ExportTab` 의 pure UI 추출.
 * `useExportTab()` hook 의 return shape 을 그대로 props 로 받음.
 */
export function ExportTabUI({
  datasets,
  members,
  packages,
  selectedDatasets,
  selectedUsers,
  deviceName,
  uniqueMissingHash,
  pending,
  createError,
  onDeviceNameChange,
  onToggleDataset,
  onToggleUser,
  onSelectAllDatasets,
  onCreate,
  onDownload,
  onReissue,
  onRenameDevice,
}: ExportTabUIProps) {
  const allDatasetsSelected = datasets.length > 0 && selectedDatasets.size === datasets.length

  return (
    <>
      <Section>
        <SectionTitle>Datasets</SectionTitle>
        {datasets.length === 0 ? (
          <Hint>No datasets found for this project.</Hint>
        ) : (
          <CheckList>
            <CheckItem>
              <Checkbox
                aria-label="Select all datasets"
                label="Select All"
                checked={allDatasetsSelected}
                onChange={(event) => onSelectAllDatasets(event.target.checked)}
              />
            </CheckItem>
            <CheckDivider />
            {datasets.map((dataset) => (
              <CheckItem key={dataset.id}>
                <Checkbox
                  aria-label={dataset.name}
                  label={dataset.name}
                  checked={selectedDatasets.has(dataset.id)}
                  onChange={() => onToggleDataset(dataset.id)}
                />
              </CheckItem>
            ))}
          </CheckList>
        )}
      </Section>

      <Section>
        <SectionTitle>Users</SectionTitle>
        {members.length === 0 ? (
          <Hint>No members found. Add members to this project first.</Hint>
        ) : (
          <CheckList>
            {members.map((member) => (
              <CheckItem key={member.id}>
                <Checkbox
                  aria-label={member.name || member.email}
                  label={<>{member.name || member.email} <UserEmailNote>({member.email})</UserEmailNote></>}
                  checked={selectedUsers.has(member.user_id)}
                  onChange={() => onToggleUser(member.user_id)}
                />
              </CheckItem>
            ))}
          </CheckList>
        )}
      </Section>

      <Section>
        <SectionTitle>Device Name</SectionTitle>
        <FieldRow>
          <TextField
            id="device-name"
            type="text"
            value={deviceName}
            onChange={(e) => onDeviceNameChange(e.target.value)}
            placeholder="예: 공장 A - 1번 라인"
            required
          />
        </FieldRow>
        {uniqueMissingHash.length > 0 && (
          <WarningBox>
            These users haven't logged in since the auth migration and cannot authenticate on Edge:
            <strong> {uniqueMissingHash.join(', ')}</strong>. Ask them to log into Platform once.
          </WarningBox>
        )}
      </Section>

      <ActionsRow>
        <Button
          variant="solid"
          onClick={onCreate}
          disabled={pending.create || !deviceName.trim()}
        >
          {pending.create ? 'Creating…' : 'Create Project File (.ige)'}
        </Button>
        {createError && <ErrorHint>{createError}</ErrorHint>}
      </ActionsRow>

      <ExportHistory
        packages={packages}
        downloadPending={pending.download}
        reissuePending={pending.reissue}
        renamePending={pending.rename}
        onDownload={onDownload}
        onReissue={onReissue}
        onRenameDevice={onRenameDevice}
      />
    </>
  )
}
