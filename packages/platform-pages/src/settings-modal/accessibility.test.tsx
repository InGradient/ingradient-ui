import { render, screen } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'
import { SettingsModalView } from './SettingsModalView'
import type { SettingsModalViewProps } from './types'
import { DevicesForms, type DevicesFormsProps } from './devices/devices-forms'
import { DevicesTable } from './devices/devices-table'
import { DeflectometryPreview } from './edge-tab/DeflectometryPreview'
import type { DeflectometryConfig } from './edge-tab/edge-types'
import { ExportTabUI } from './edge-tab/ExportTabUI'
import { SettingsGeneralTab } from './general/settings-general-tab'
import { InvitationsSection } from './organization/invitations-section'
import { JoinCodesSection } from './organization/join-codes-section'
import { OrgMembersTab } from './organization/org-members-tab'
import { ProjectSettingsForm, type ProjectSettingsFormProps } from './project/project-settings-form'
import { StorageStatsTable } from './storage/storage-stats-table'

const noop = () => undefined

const generalProps: SettingsModalViewProps['general'] = {
  locale: 'en',
  enableHoverPreview: true,
  singleClickToEdit: false,
  showLabelsOnThumbnails: true,
  onChangeLocale: noop,
  onChangeEnableHoverPreview: noop,
  onChangeSingleClickToEdit: noop,
  onChangeShowLabelsOnThumbnails: noop,
}

const projectFormProps: ProjectSettingsFormProps = {
  projectType: 'deflectometry',
  canEdit: true,
  isOwner: false,
  saveState: 'idle',
  nameInvalid: false,
  name: 'Inspection',
  onChangeName: noop,
  description: 'Surface inspection',
  onChangeDescription: noop,
  groupEnabled: false,
  onChangeGroupEnabled: noop,
  groupRegex: '',
  onChangeGroupRegex: noop,
  groupRepRegex: '',
  onChangeGroupRepRegex: noop,
  allowDup: false,
  onChangeAllowDup: noop,
  showFilenameInGallery: true,
  onChangeShowFilenameInGallery: noop,
  showBboxClassNamesInDetail: true,
  onChangeShowBboxClassNamesInDetail: noop,
  groupVisible: 'all',
  onChangeGroupVisible: noop,
}

describe('SettingsModal accessibility', () => {
  it('exposes the outer modal as a named modal dialog', () => {
    render(
      <SettingsModalView
        open
        onClose={noop}
        tab="general"
        onTabChange={noop}
        isAdmin={false}
        general={generalProps}
        account={{} as SettingsModalViewProps['account']}
        project={{} as SettingsModalViewProps['project']}
      />,
    )

    expect(screen.getByRole('dialog', { name: 'Settings' })).toHaveAttribute('aria-modal', 'true')
  })

  it('gives every General preference checkbox an accessible name', () => {
    render(<SettingsGeneralTab {...generalProps} />)

    expect(screen.getByRole('checkbox', { name: 'Enable hover preview in data grids' })).toBeInTheDocument()
    expect(screen.getByRole('checkbox', { name: 'Use single click to open edit flow' })).toBeInTheDocument()
    expect(screen.getByRole('checkbox', { name: 'Show label badges on thumbnails' })).toBeInTheDocument()
  })

  it('names visually empty Admin action headers', () => {
    const { rerender } = render(
      <OrgMembersTab
        isAdmin
        members={[{ id: 'membership-1', userId: 'user-1', user: { loginId: 'user@example.com', displayName: 'User' }, role: { code: 'member' }, status: 'active' }]}
      />,
    )
    expect(screen.getByRole('columnheader', { name: 'Actions' })).toBeInTheDocument()

    rerender(
      <InvitationsSection
        isAdmin
        invitations={[{ id: 'invite-1', email: 'invite@example.com', roleId: 'member', status: 'pending' }]}
        roleOptions={[{ value: 'member', label: 'Member' }]}
        inviteRoleId="member"
        onChangeInviteRoleId={noop}
        searchQuery=""
        onChangeSearchQuery={noop}
        searchResults={[]}
        onInviteUser={noop}
        onRevoke={noop}
      />,
    )
    expect(screen.getByRole('columnheader', { name: 'Actions' })).toBeInTheDocument()

    rerender(
      <JoinCodesSection
        isAdmin
        joinCodes={[{ id: 'code-1', code: 'STORY-CODE', roleId: 'member', usedCount: 0 }]}
        roleOptions={[{ value: 'member', label: 'Member' }]}
        codeRoleId="member"
        onChangeCodeRoleId={noop}
        codeMaxUses=""
        onChangeCodeMaxUses={noop}
        onDelete={noop}
      />,
    )
    expect(screen.getByRole('columnheader', { name: 'Actions' })).toBeInTheDocument()

    rerender(
      <DevicesTable
        isAdmin
        devices={[{ id: 'device-1', deviceUid: 'uid-1', status: 'ACTIVE', registeredAt: '2026-01-01T00:00:00Z' }]}
        filteredDevices={[{ id: 'device-1', deviceUid: 'uid-1', status: 'ACTIVE', registeredAt: '2026-01-01T00:00:00Z' }]}
        filterSearch=""
        onChangeFilterSearch={noop}
        filterStatus="all"
        onChangeFilterStatus={noop}
      />,
    )
    expect(screen.getByRole('columnheader', { name: 'Actions' })).toBeInTheDocument()
  })

  it('labels invitation search and max-uses fields without relying on title', () => {
    const { rerender } = render(
      <InvitationsSection
        isAdmin
        invitations={[]}
        roleOptions={[{ value: 'member', label: 'Member' }]}
        inviteRoleId="member"
        onChangeInviteRoleId={noop}
        searchQuery=""
        onChangeSearchQuery={noop}
        searchResults={[]}
        onInviteUser={noop}
        onRevoke={noop}
      />,
    )
    expect(screen.getByRole('textbox', { name: 'Search users' })).toBeInTheDocument()

    rerender(
      <JoinCodesSection
        isAdmin
        joinCodes={[]}
        roleOptions={[{ value: 'member', label: 'Member' }]}
        codeRoleId="member"
        onChangeCodeRoleId={noop}
        codeMaxUses=""
        onChangeCodeMaxUses={noop}
        onDelete={noop}
      />,
    )
    expect(screen.getByRole('textbox', { name: 'Max uses' })).toBeInTheDocument()
  })

  it('labels issued-token textareas for admin and non-admin views', () => {
    const props = {
      isAdmin: false,
      registerUid: '',
      onChangeRegisterUid: noop,
      registerName: '',
      onChangeRegisterName: noop,
      onRegister: noop,
      activeDevices: [],
      issueDeviceId: '',
      onChangeIssueDeviceId: noop,
      issueValidDays: '',
      onChangeIssueValidDays: noop,
      onIssue: noop,
      issuedToken: { token: 'offline-token', deviceUid: 'uid-1', validUntil: '2026-01-01T00:00:00Z' },
    } satisfies DevicesFormsProps
    const { rerender } = render(<DevicesForms {...props} />)
    expect(screen.getByRole('textbox', { name: 'Issued offline license token' })).toBeInTheDocument()

    rerender(<DevicesForms {...props} isAdmin />)
    expect(screen.getByRole('textbox', { name: 'Issued offline license token' })).toBeInTheDocument()
  })

  it('derives distinct Storage statistics landmark names from column headings', () => {
    render(
      <>
        <StorageStatsTable columns={[{ key: 'tier', header: 'Tier', render: (row: { tier: string }) => row.tier }]} rows={[{ tier: 'Hot' }]} />
        <StorageStatsTable columns={[{ key: 'item', header: 'Cost item', render: (row: { item: string }) => row.item }]} rows={[{ item: 'Storage' }]} />
      </>,
    )

    expect(screen.getByLabelText('Tier storage statistics')).toBeInTheDocument()
    expect(screen.getByLabelText('Cost item storage statistics')).toBeInTheDocument()
    expect(screen.queryByLabelText('Storage statistics')).not.toBeInTheDocument()
  })

  it('labels narrow project and Edge controls and uses AA project-tag tokens', () => {
    const { rerender } = render(<ProjectSettingsForm {...projectFormProps} />)
    expect(screen.getByRole('textbox', { name: 'Project description' })).toBeInTheDocument()
    expect(screen.getByText('Deflectometry Project').getAttribute('style')).toContain('background: var(--ig-color-accent-strong)')
    expect(screen.getByText('Deflectometry Project').getAttribute('style')).toContain('color: var(--ig-color-on-accent)')

    rerender(
      <ExportTabUI
        datasets={[]}
        members={[]}
        packages={[]}
        selectedDatasets={new Set()}
        selectedUsers={new Set()}
        deviceName="Edge station"
        uniqueMissingHash={[]}
        pending={{ create: false, download: false, reissue: false, rename: false }}
        onDeviceNameChange={noop}
        onToggleDataset={noop}
        onToggleUser={noop}
        onSelectAllDatasets={noop}
        onCreate={noop}
        onDownload={noop}
        onReissue={noop}
        onRenameDevice={noop}
      />,
    )
    expect(screen.getByRole('textbox', { name: 'Device name' })).toBeInTheDocument()
  })

  it('gives the Deflectometry canvas a pattern-specific accessible name', () => {
    render(
      <DeflectometryPreview
        config={{ fringe_period_default: 24 } as DeflectometryConfig}
        patternLabels={['vertical-phase-1']}
        formatBadgeLabel={(label) => `Formatted ${label}`}
        renderPattern={vi.fn()}
      />,
    )

    expect(screen.getByRole('img', { name: 'Deflectometry pattern preview: Formatted vertical-phase-1' })).toBeInTheDocument()
  })
})
