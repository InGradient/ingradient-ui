import {
  IdentityItemList,
  SidePanelLayout,
  SwatchItemList,
  TagListSearch,
} from '@ingradient/ui/components'
import { RightSideLoadingText } from './CatalogView.styles'
import type { CatalogRightSidebarPaneProps } from './types'

const EMPTY_TEXT_CLASSES = 'No classes available.'
const NO_CLASS_CONNECTED_TEXT = 'No classes connected.'
const EMPTY_TEXT_MEMBERS = 'No members.'
const LOADING_TEXT = 'Loading…'

export function CatalogRightSidebar({
  classesLoading,
  membersLoading,
  connectedClasses,
  candidateClasses,
  members,
  onAddClass,
  onRemoveClass,
  onRemoveMember,
}: CatalogRightSidebarPaneProps) {
  const classBody = classesLoading ? (
    <RightSideLoadingText>{LOADING_TEXT}</RightSideLoadingText>
  ) : connectedClasses.length === 0 && candidateClasses.length === 0 ? (
    <RightSideLoadingText>{EMPTY_TEXT_CLASSES}</RightSideLoadingText>
  ) : (
    <>
      <TagListSearch
        placeholder="Search class to add"
        candidates={candidateClasses}
        onSelect={onAddClass}
        emptyMessage="No more classes."
      />
      {connectedClasses.length > 0 ? (
        <SwatchItemList
          items={connectedClasses.map((c) => ({ id: c.id, label: c.name, color: c.color, count: c.count }))}
          onRemove={onRemoveClass}
        />
      ) : (
        <RightSideLoadingText>{NO_CLASS_CONNECTED_TEXT}</RightSideLoadingText>
      )}
    </>
  )

  const memberBody = membersLoading ? (
    <RightSideLoadingText>{LOADING_TEXT}</RightSideLoadingText>
  ) : members.length === 0 ? (
    <RightSideLoadingText>{EMPTY_TEXT_MEMBERS}</RightSideLoadingText>
  ) : (
    <IdentityItemList
      items={members.map((member) => ({
        id: member.id,
        label: member.name,
        meta: member.role,
        avatarUrl: member.avatarUrl,
        initials: member.initials,
      }))}
      onRemove={onRemoveMember}
    />
  )

  return (
    <SidePanelLayout
      sections={[
        { title: 'Class', body: classBody },
        { title: 'Members', body: memberBody },
      ]}
    />
  )
}
