import {
  reviewDistributionData,
  reviewPipelineData,
  reviewTableRows,
  reviewTagItems,
  reviewTrendData,
  reviewViewerObjects,
  type ReviewScale,
} from '../fixtures/review-fixtures'

export type { ReviewScale } from '../fixtures/review-fixtures'
export type ReviewRole = 'viewer' | 'editor' | 'admin'
export type ContentLength = 'short' | 'long'
export type ValidationState = 'none' | 'warning' | 'error' | 'success'

export function resolveReviewScale(value: unknown): ReviewScale {
  if (value === 'sparse' || value === 'overloaded') return value
  return 'realistic'
}

export function cloneTableRows(scale: ReviewScale) {
  return reviewTableRows[scale].map((row) => ({ ...row }))
}

export function buildTagItems(scale: ReviewScale, contentLength: ContentLength = 'short') {
  return reviewTagItems[scale].map((item) => ({
    ...item,
    label:
      contentLength === 'long' && item.id === 'person'
        ? 'Person with long semantic review label'
        : item.label,
  }))
}

export function buildChartData(scale: ReviewScale) {
  return {
    trend: reviewTrendData[scale].map((item) => ({ ...item })),
    pipeline: reviewPipelineData[scale].map((item) => ({ ...item })),
    distribution: reviewDistributionData[scale].map((item) => ({ ...item })),
  }
}

export function buildViewerObjects(scale: ReviewScale) {
  return reviewViewerObjects[scale].map((item) => ({ ...item }))
}

export function buildButtonLabel(contentLength: ContentLength) {
  return contentLength === 'long'
    ? 'Export all selected annotations and publish the reviewed result'
    : 'Create workspace'
}

export function buildDialogScenario(scenario: 'publish' | 'destructive' | 'permissions', role: ReviewRole) {
  if (scenario === 'destructive') {
    return {
      title: 'Discard staged review draft',
      description: 'This removes the current review draft, local notes, and queued publish metadata.',
      actions: ['Cancel', 'Discard draft', 'Delete all references'],
    }
  }

  if (scenario === 'permissions') {
    return {
      title: role === 'viewer' ? 'Request publish access' : 'Publish review package',
      description:
        role === 'viewer'
          ? 'You can inspect the current draft, but publish access must be granted by an editor or admin.'
          : 'This action bundles selected changes and makes them visible to downstream consumers.',
      actions:
        role === 'viewer'
          ? ['Close', 'Request access']
          : ['Review later', 'Request admin approval', 'Publish now'],
    }
  }

  return {
    title: 'Publish review package',
    description: 'This action bundles selected changes and makes them visible to downstream consumers.',
    actions: ['Review later', 'Discard draft', 'Publish now'],
  }
}

export function buildTextFieldCopy(validationState: ValidationState, contentLength: ContentLength) {
  const placeholder =
    contentLength === 'long'
      ? 'Enter a descriptive workspace name that downstream teams can recognize immediately'
      : 'Workspace name'

  const helperByState = {
    none: 'Use concise labels that survive table, breadcrumb, and dialog contexts.',
    warning: 'The current label is valid, but it may be too long for compact layouts.',
    error: 'This field is required before reviewers can publish changes.',
    success: 'Naming pattern looks good and matches the shared workspace convention.',
  } as const

  return {
    placeholder,
    helperText: helperByState[validationState],
    titleValue: contentLength === 'long' ? 'Vehicle damage verification queue' : 'Quality Review',
    notesValue:
      contentLength === 'long'
        ? 'Reusable text input surfaces should keep helper copy readable even when the field description becomes much longer than usual.'
        : 'Reusable text input surfaces should share spacing, border, and focus behavior.',
  }
}
