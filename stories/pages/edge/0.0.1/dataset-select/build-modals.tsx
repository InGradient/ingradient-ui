// DatasetSelectView 의 addDatasetModal / exportModal 슬롯 scene.
import { useState } from 'react'
import { AddDatasetModalView, ExportModalView } from '@ingradient/edge-pages'
import { ADD_DATASET_LABELS, EXPORT_LABELS, SAMPLE_ADD_CLASSES } from './labels'

export function AddModalScene(): JSX.Element {
  const [name, setName] = useState('')
  const [taskType, setTaskType] = useState<'object_detection'>('object_detection')
  const [selectedClassIds, setSelectedClassIds] = useState(
    new Set(SAMPLE_ADD_CLASSES.map((c) => c.class_id)),
  )
  return (
    <AddDatasetModalView
      name={name}
      taskType={taskType}
      selectedClassIds={selectedClassIds}
      allClasses={SAMPLE_ADD_CLASSES}
      namePlaceholder="2026-05-19"
      adding={false}
      error={null}
      labels={ADD_DATASET_LABELS}
      onNameChange={setName}
      onTaskTypeChange={(v) => setTaskType(v as 'object_detection')}
      onClassesChange={setSelectedClassIds}
      onSubmit={(e) => e.preventDefault()}
      onClose={() => undefined}
    />
  )
}

export function ExportModalScene(): JSX.Element {
  return (
    <ExportModalView
      datasetName="2026-05-19 morning shift"
      imageCount={1248}
      localImageCount={812}
      phase="idle"
      error={null}
      labels={EXPORT_LABELS}
      onClose={() => undefined}
      onExport={() => undefined}
    />
  )
}
