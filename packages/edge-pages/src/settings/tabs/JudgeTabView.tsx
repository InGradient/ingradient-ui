import { Button, DropdownSelect, FieldRow } from '@ingradient/ui'
import { ScanSearchIcon } from '@ingradient/ui/components'
import { iconSizeNumbers } from '@ingradient/ui/tokens'

import type { JudgeTabViewProps } from '../types'
import { ActionRow, Hint, SectionLabel, TabTitle, TabWrap } from './tab-shell'

export function JudgeTabView(props: JudgeTabViewProps): JSX.Element {
  const {
    state, version, detail, hasProject, projectClasses, classesLoading,
    rows, unlinkedNames, dirty, message, labels,
    onChangeLink, onSave,
  } = props

  const status = [
    labels.state[state],
    version ? ` · ${version}` : '',
    state === 'failed' && detail ? ` — ${detail}` : '',
  ].join('')

  const options = [
    { value: '', label: labels.unlinked },
    ...projectClasses.map((c) => ({ value: c.id, label: c.name })),
  ]

  return (
    <TabWrap>
      <TabTitle>
        <ScanSearchIcon size={iconSizeNumbers.xs} />
        {labels.title}
      </TabTitle>
      <SectionLabel>{labels.model}</SectionLabel>
      <Hint role="status">{status}</Hint>

      {/* 모델이 준비되기 전에는 클래스를 모른다 — 상태만 보인다. */}
      {state !== 'ready' ? null : !hasProject ? (
        <Hint>{labels.noProject}</Hint>
      ) : (
        <>
          <SectionLabel>{labels.classes}</SectionLabel>
          <Hint>{labels.classesHint}</Hint>
          {!classesLoading && projectClasses.length === 0 && (
            <Hint role="alert">{labels.noProjectClasses}</Hint>
          )}
          {rows.map((row) => (
            <FieldRow key={row.modelKey} label={row.modelName}>
              <DropdownSelect
                value={row.classId}
                options={options}
                aria-label={row.modelName}
                onChange={(classId) => onChangeLink(row.modelKey, classId)}
              />
              {row.suggested && <Hint>{labels.suggested}</Hint>}
            </FieldRow>
          ))}
          {unlinkedNames.length > 0 && (
            <Hint role="alert">{labels.unlinkedWarn(unlinkedNames.join(', '))}</Hint>
          )}
          <ActionRow>
            <Button size="sm" variant="solid" type="button" disabled={!dirty} onClick={onSave}>
              {labels.save}
            </Button>
            {message && <Hint role="status">{message}</Hint>}
          </ActionRow>
        </>
      )}
    </TabWrap>
  )
}
