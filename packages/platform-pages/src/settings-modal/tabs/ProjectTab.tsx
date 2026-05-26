import {
  DeleteProjectSection,
  ProjectMemberInvite,
  ProjectMembersList,
  ProjectPermissionMatrix,
  ProjectSettingsForm,
} from '../project'
import {
  ExpandToggle,
  Placeholder,
  PermissionsHeader,
  PermissionsScopeNote,
  SubsectionTitle,
} from '../SettingsModalView.styles'
import type { ProjectTabProps } from '../types'

const PERMISSIONS_SCOPE_NOTE =
  'Project membership is managed separately. This matrix only shows role permissions that remain meaningful alongside dataset-specific access.'

const NO_PROJECT_TEXT = 'No project selected. Select a project first.'

export function ProjectTab(props: ProjectTabProps) {
  if (props.noProject || !props.draft.id) {
    return <Placeholder>{NO_PROJECT_TEXT}</Placeholder>
  }
  return (
    <>
      <ProjectSettingsForm
        projectType={props.draft.projectType}
        canEdit={props.canEdit}
        isOwner={props.isOwner}
        saveState={props.saveState}
        saveErrorMessage={props.saveErrorMessage}
        nameInvalid={!!props.nameInvalid}
        name={props.draft.name}
        onChangeName={(v) => props.onChangeDraft({ name: v })}
        description={props.draft.description}
        onChangeDescription={(v) => props.onChangeDraft({ description: v })}
        groupEnabled={props.draft.groupEnabled}
        onChangeGroupEnabled={(v) => props.onChangeDraft({ groupEnabled: v })}
        groupRegex={props.draft.groupRegex}
        onChangeGroupRegex={(v) => props.onChangeDraft({ groupRegex: v })}
        groupRepRegex={props.draft.groupRepRegex}
        onChangeGroupRepRegex={(v) => props.onChangeDraft({ groupRepRegex: v })}
        allowDup={props.draft.allowDup}
        onChangeAllowDup={(v) => props.onChangeDraft({ allowDup: v })}
        showFilenameInGallery={props.draft.showFilenameInGallery}
        onChangeShowFilenameInGallery={(v) => props.onChangeDraft({ showFilenameInGallery: v })}
        showBboxClassNamesInDetail={props.draft.showBboxClassNamesInDetail}
        onChangeShowBboxClassNamesInDetail={(v) =>
          props.onChangeDraft({ showBboxClassNamesInDetail: v })
        }
        groupVisible={props.draft.groupVisible}
        onChangeGroupVisible={(v) => props.onChangeDraft({ groupVisible: v })}
      />
      <ProjectMemberInvite
        query={props.memberSearchQuery}
        onChangeQuery={props.onChangeMemberSearchQuery}
        candidates={props.candidates}
        onAdd={props.onAddMember}
      />
      <SubsectionTitle>Members</SubsectionTitle>
      <ProjectMembersList
        members={props.members}
        roleOptions={props.roleOptions}
        canManagePermissions={props.canManagePermissions}
        onChangeRole={props.onChangeRole}
        onRemove={props.onRemoveMember}
      />
      {props.canManagePermissions ? (
        <>
          <PermissionsHeader>
            <SubsectionTitle style={{ margin: 0 }}>Permissions</SubsectionTitle>
            <ExpandToggle type="button" onClick={props.onTogglePermissionsExpand}>
              {props.permissionsExpandAll ? 'Collapse All' : 'Expand All'}
            </ExpandToggle>
          </PermissionsHeader>
          <PermissionsScopeNote>{PERMISSIONS_SCOPE_NOTE}</PermissionsScopeNote>
          <ProjectPermissionMatrix
            roles={props.permissionRoleOptions}
            expandAll={props.permissionsExpandAll}
            groups={props.expandedPermissionGroups}
            summaryGroups={props.summaryPermissionGroups}
            draftRoles={props.draftRoles}
            onChangeRolePermission={props.onChangeRolePermission}
            onChangeRolePermissions={props.onChangeRolePermissions}
          />
        </>
      ) : null}
      {props.canDeleteProject && props.projectsCount >= 2 ? (
        <DeleteProjectSection
          projectName={props.draft.name}
          confirmInput={props.deleteConfirmInput}
          onChangeConfirmInput={props.onChangeDeleteConfirmInput}
          onDelete={props.onDelete}
        />
      ) : null}
    </>
  )
}
