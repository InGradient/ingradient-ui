import type { DrawingObject } from '../../src/hooks'

export type ReviewScale = 'sparse' | 'realistic' | 'overloaded'

export type ReviewWorkspaceRow = {
  id: string
  name: string
  owner: string
  status: string
}

export const reviewTableRows: Record<ReviewScale, ReviewWorkspaceRow[]> = {
  sparse: [
    { id: '1', name: 'Review queue', owner: 'J. Kim', status: 'Active' },
  ],
  realistic: [
    { id: '1', name: 'Review queue', owner: 'J. Kim', status: 'Active' },
    { id: '2', name: 'Label audit', owner: 'M. Park', status: 'Needs review' },
    { id: '3', name: 'Export approval', owner: 'S. Lee', status: 'Blocked' },
  ],
  overloaded: [
    { id: '1', name: 'Review queue', owner: 'J. Kim', status: 'Active' },
    { id: '2', name: 'Label audit', owner: 'M. Park', status: 'Needs review' },
    { id: '3', name: 'Export approval', owner: 'S. Lee', status: 'Blocked' },
    { id: '4', name: 'Field validation', owner: 'A. Choi', status: 'Syncing' },
    { id: '5', name: 'Long-tail exceptions', owner: 'R. Han', status: 'Escalated' },
    { id: '6', name: 'Delayed import', owner: 'N. Yun', status: 'Queued' },
  ],
}

export type ReviewTagItem = {
  id: string
  color: string
  label: string
  count?: number
}

export const reviewTagItems: Record<ReviewScale, ReviewTagItem[]> = {
  sparse: [
    { id: 'car', color: '#5da0ff', label: 'Car', count: 14 },
    { id: 'person', color: '#6ee7b7', label: 'Person', count: 8 },
  ],
  realistic: [
    { id: 'car', color: '#5da0ff', label: 'Car', count: 142 },
    { id: 'person', color: '#6ee7b7', label: 'Person', count: 88 },
    { id: 'pedestrian-crossing', color: '#fbbf24', label: 'Pedestrian crossing', count: 14 },
  ],
  overloaded: [
    { id: 'car', color: '#5da0ff', label: 'Car', count: 142 },
    { id: 'person', color: '#6ee7b7', label: 'Person', count: 88 },
    { id: 'pedestrian-crossing', color: '#fbbf24', label: 'Pedestrian crossing with extended warning zone', count: 14 },
    { id: 'delivery-van', color: '#f87171', label: 'Delivery van', count: 26 },
    { id: 'temporary-signage', color: '#a78bfa', label: 'Temporary signage', count: 7 },
    { id: 'construction-cone', color: '#fb923c', label: 'Construction cone', count: 33 },
  ],
}

export const reviewTrendData: Record<ReviewScale, Array<{ period: string; reviewed: number; approved: number }>> = {
  sparse: [
    { period: 'Mon', reviewed: 18, approved: 11 },
    { period: 'Tue', reviewed: 23, approved: 16 },
    { period: 'Wed', reviewed: 19, approved: 15 },
  ],
  realistic: [
    { period: 'Mon', reviewed: 42, approved: 27 },
    { period: 'Tue', reviewed: 55, approved: 34 },
    { period: 'Wed', reviewed: 49, approved: 31 },
    { period: 'Thu', reviewed: 68, approved: 40 },
    { period: 'Fri', reviewed: 72, approved: 46 },
  ],
  overloaded: [
    { period: 'Mon', reviewed: 42, approved: 27 },
    { period: 'Tue', reviewed: 55, approved: 34 },
    { period: 'Wed', reviewed: 49, approved: 31 },
    { period: 'Thu', reviewed: 68, approved: 40 },
    { period: 'Fri', reviewed: 72, approved: 46 },
    { period: 'Sat', reviewed: 58, approved: 29 },
    { period: 'Sun', reviewed: 46, approved: 18 },
  ],
}

export const reviewPipelineData: Record<ReviewScale, Array<{ stage: string; items: number }>> = {
  sparse: [
    { stage: 'Queued', items: 16 },
    { stage: 'Review', items: 7 },
    { stage: 'Export', items: 2 },
  ],
  realistic: [
    { stage: 'Queued', items: 84 },
    { stage: 'Labeling', items: 56 },
    { stage: 'Review', items: 28 },
    { stage: 'Export', items: 12 },
  ],
  overloaded: [
    { stage: 'Queued', items: 136 },
    { stage: 'Syncing', items: 62 },
    { stage: 'Labeling', items: 98 },
    { stage: 'Review', items: 51 },
    { stage: 'Export', items: 24 },
  ],
}

export const reviewDistributionData: Record<ReviewScale, Array<{ name: string; value: number }>> = {
  sparse: [
    { name: 'Approved', value: 21 },
    { name: 'Needs review', value: 7 },
    { name: 'Blocked', value: 3 },
  ],
  realistic: [
    { name: 'Approved', value: 46 },
    { name: 'Needs review', value: 32 },
    { name: 'Blocked', value: 14 },
    { name: 'Draft', value: 8 },
  ],
  overloaded: [
    { name: 'Approved', value: 54 },
    { name: 'Needs review', value: 24 },
    { name: 'Blocked', value: 8 },
    { name: 'Draft', value: 6 },
    { name: 'Queued', value: 8 },
  ],
}

export const reviewViewerObjects: Record<ReviewScale, DrawingObject[]> = {
  sparse: [
    { id: 'draw-a', type: 'rect', x: 0.16, y: 0.2, w: 0.24, h: 0.18, color: '#ff7f66', label: 'Dent' },
  ],
  realistic: [
    { id: 'draw-a', type: 'rect', x: 0.16, y: 0.2, w: 0.24, h: 0.18, color: '#ff7f66', label: 'Dent' },
    { id: 'draw-b', type: 'point', x: 0.66, y: 0.54, color: '#79d3b4', label: 'Spot' },
  ],
  overloaded: [
    { id: 'draw-a', type: 'rect', x: 0.16, y: 0.2, w: 0.24, h: 0.18, color: '#ff7f66', label: 'Dent' },
    { id: 'draw-b', type: 'point', x: 0.66, y: 0.54, color: '#79d3b4', label: 'Spot' },
    { id: 'draw-c', type: 'rect', x: 0.58, y: 0.18, w: 0.18, h: 0.14, color: '#fbbf24', label: 'Scratch' },
    { id: 'draw-d', type: 'point', x: 0.34, y: 0.68, color: '#8b5cf6', label: 'Dust' },
  ],
}
