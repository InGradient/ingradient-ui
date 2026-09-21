import { useEffect, useState } from 'react'
import {
  AddDatasetModalView, CreateProjectFormView, ExportModalView,
  type EdgeDataset, type EdgeProjectGroup, type EdgeTaskType, type ExportPhase,
} from '@ingradient/edge-pages'
import { SAMPLE_GROUPS, SAMPLE_CLASSES_FULL } from '../../../fixtures/edge/0.0.5'

export function useDatasetRuntime(empty: boolean, failFirstExport: boolean, action?: (action: string) => void) {
  const [groups, setGroups] = useState<EdgeProjectGroup[]>(() => empty ? [] : SAMPLE_GROUPS)
  const [projectId, setProjectId] = useState<string | null>(null)
  const [projectOpen, setProjectOpen] = useState(false)
  const [name, setName] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [taskType, setTaskType] = useState<EdgeTaskType>('object_detection')
  const [classes, setClasses] = useState<Set<string>>(new Set())
  const [job, setJob] = useState<'dataset' | 'project' | 'export' | null>(null)
  const [exportDataset, setExportDataset] = useState<EdgeDataset | null>(null)
  const [phase, setPhase] = useState<ExportPhase>('idle')
  const [exportAttempt, setExportAttempt] = useState(0)
  const [status, setStatus] = useState('')
  const closeForm = () => {
    setJob(null); setProjectId(null); setProjectOpen(false); setError(null)
    action?.('create-cancel'); setStatus('Mock creation cancelled; nothing was saved.')
  }
  const submit = (kind: 'dataset' | 'project', event: React.FormEvent) => {
    event.preventDefault()
    if (!name.trim()) { setError('Enter a name.'); return }
    const names = kind === 'project' ? groups.map((group) => group.project_name) : groups.find((group) => group.project_id === projectId)?.datasets.map((dataset) => dataset.dataset_name) ?? []
    if (names.some((existing) => existing.toLowerCase() === name.trim().toLowerCase())) { setError('That name already exists.'); return }
    setError(null); setJob(kind); action?.(`${kind}-create-request`)
  }
  // Cancellable deterministic mock. Cleanup prevents late completion after close/unmount.
  useEffect(() => {
    if (!job) return
    const timer = setTimeout(() => {
      if (job === 'export') {
        const failed = failFirstExport && exportAttempt === 1
        setPhase(failed ? 'error' : 'done')
        setError(failed ? 'Synthetic export failed. Retry is available; no files were written.' : null)
        action?.(failed ? 'export-error' : 'export-done')
      } else if (job === 'project') {
        setGroups((current) => [...current, { project_id: `mock-project-${current.length}`, project_name: name.trim(), role: 'owner', deflectometry_enabled: false, datasets: [] }])
        setProjectOpen(false); setStatus(`Mock project “${name.trim()}” created in preview memory only.`)
        action?.('project-create-done')
      } else {
        setGroups((current) => current.map((group) => group.project_id === projectId ? { ...group, datasets: [...group.datasets, {
          dataset_id: `mock-dataset-${group.datasets.length}`, dataset_name: name.trim(), project_id: group.project_id,
          image_count: 0, task_type: taskType, classes: SAMPLE_CLASSES_FULL.filter((item) => classes.has(item.class_id)).map((item) => ({ class_id: item.class_id, name: item.class_name ?? item.class_id, color: item.color })),
        }] } : group))
        setProjectId(null); setStatus(`Mock dataset “${name.trim()}” created with 0 synthetic images. Nothing was persisted.`)
        action?.('dataset-create-done')
      }
      setJob(null)
    }, 700)
    return () => clearTimeout(timer)
  }, [job, name, projectId, classes, taskType, failFirstExport, exportAttempt, action])

  const openAdd = (id: string) => { setName(''); setError(null); setClasses(new Set()); setProjectId(id); action?.('dataset-open') }
  const openExport = (dataset: EdgeDataset) => { setExportDataset(dataset); setPhase('idle'); setError(null); setExportAttempt(0); action?.('export-open') }
  return {
    groups, status, openAdd, openExport,
    addDatasetModal: projectId !== null ? <AddDatasetModalView name={name} taskType={taskType} selectedClassIds={classes}
      allClasses={SAMPLE_CLASSES_FULL.map((item) => ({ ...item, class_name: item.class_name ?? item.class_id }))}
      namePlaceholder="New dataset" adding={job === 'dataset'} error={error}
      labels={{ title: 'Add mock dataset', cancel: 'Cancel', add: 'Add dataset', adding: 'Adding…', datasetNameLabel: 'Dataset name', taskTypeLabel: 'Task type', classesLabel: (selected, total) => `Classes (${selected}/${total})`, taskTypeOptions: { classification: 'Classification', object_detection: 'Object detection', segmentation: 'Segmentation', point: 'Point' } }}
      onNameChange={setName} onTaskTypeChange={setTaskType} onClassesChange={setClasses} onSubmit={(event) => submit('dataset', event)} onClose={closeForm} /> : null,
    exportModal: exportDataset ? <ExportModalView datasetName={`${exportDataset.dataset_name} — synthetic preview`}
      imageCount={12} localImageCount={8} phase={phase} error={error}
      labels={{ title: 'Export mock dataset', cancel: 'Cancel', close: 'Close', export: phase === 'error' ? 'Retry export' : 'Export', exporting: 'Exporting synthetic images', complete: 'Mock export complete. No archive or files were created.', images: (count) => `${count} synthetic images`, localImages: (count) => `${count} synthetic local images available` }}
      onClose={() => { setExportDataset(null); setJob(null); action?.('export-close') }}
      onCancel={() => { setExportDataset(null); setJob(null); setStatus('Mock export cancelled. No files were written.'); action?.('export-cancel') }}
      onExport={() => { setPhase('running'); setError(null); setExportAttempt((attempt) => attempt + 1); setJob('export'); action?.('export-request') }} /> : null,
    createProjectForm: groups.length === 0 ? <CreateProjectFormView labels={{ emptyOnline: 'No preview projects', createOnPlatform: 'Create a synthetic project here; real projects are managed on the platform.' }}
      form={{ open: projectOpen, name, busy: job === 'project', error, title: 'Create mock project', nameLabel: 'Project name', submitLabel: job === 'project' ? 'Creating…' : 'Create project', cancelLabel: 'Cancel',
        onOpen: () => { setName(''); setError(null); setProjectOpen(true) }, onClose: closeForm, onNameChange: setName, onSubmit: (event) => submit('project', event) }} /> : null,
  }
}
