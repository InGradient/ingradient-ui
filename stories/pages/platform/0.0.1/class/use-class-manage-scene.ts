import { useEffect, useState } from 'react'
import type { ClassScene } from '../../../../fixtures/platform/0.0.1/class-scenarios'
import type { MockClass } from '../../../../fixtures/platform/0.0.1/class-classes'
import type { MockClassImage } from '../../../../fixtures/platform/0.0.1/class-images'

export interface ClassManageSceneState {
  classes: MockClass[]
  selectedClassId: string | null
  sidebarCollapsed: boolean
  activeDatasetIds: Set<string>
  isReferenceDragOver: boolean
  isAddClassOpen: boolean
  addClassName: string
  contextMenuOpen: { imageId: string; top: number; left: number } | null
  classMenuOpen: { id: string; anchor: HTMLElement } | null
  lightboxImage: MockClassImage | null
  deleteConfirmOpen: boolean
  currentMapping: string

  setSelectedClassId: (id: string | null) => void
  setSidebarCollapsed: (v: boolean) => void
  toggleDataset: (id: string) => void
  setReferenceDragOver: (v: boolean) => void
  setAddClassOpen: (v: boolean) => void
  setAddClassName: (s: string) => void
  setContextMenu: (m: { imageId: string; top: number; left: number } | null) => void
  setClassMenuOpen: (m: { id: string; anchor: HTMLElement } | null) => void
  setLightboxImage: (img: MockClassImage | null) => void
  setDeleteConfirmOpen: (v: boolean) => void
  setCurrentMapping: (m: string) => void
  updateClass: (id: string, patch: Partial<MockClass>) => void
  randomizeColor: () => void
  addClass: (name: string) => string | null
  removeSelectedClass: () => void
  duplicateSelectedClass: () => void
}

const STORY_CLASS_COLORS = ['#8b5cf6', '#06b6d4', '#f59e0b', '#10b981'] as const

export function useClassManageScene(scenario: ClassScene): ClassManageSceneState {
  const [classes, setClasses] = useState<MockClass[]>(scenario.classes)
  const [selectedClassId, setSelectedClassId] = useState<string | null>(scenario.selectedClassId)
  const [sidebarCollapsed, setSidebarCollapsed] = useState<boolean>(!!scenario.sidebarCollapsed)
  const [activeDatasetIds, setActiveDatasetIds] = useState<Set<string>>(new Set(scenario.activeDatasetIds))
  const [isReferenceDragOver, setReferenceDragOver] = useState<boolean>(!!scenario.isReferenceDragOver)
  const [isAddClassOpen, setAddClassOpen] = useState<boolean>(!!scenario.isAddClassOpen)
  const [addClassName, setAddClassName] = useState<string>(scenario.addClassName ?? '')
  const [contextMenuOpen, setContextMenu] = useState<{ imageId: string; top: number; left: number } | null>(scenario.contextMenuOpen ?? null)
  const [classMenuOpen, setClassMenuOpen] = useState<{ id: string; anchor: HTMLElement } | null>(null)
  const [lightboxImage, setLightboxImage] = useState<MockClassImage | null>(scenario.lightboxImage ?? null)
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState<boolean>(!!scenario.deleteConfirmOpen)
  const [currentMapping, setCurrentMapping] = useState<string>(scenario.currentMapping ?? '')

  // scenario 변경 시 reset
  useEffect(() => {
    setClasses(scenario.classes)
    setSelectedClassId(scenario.selectedClassId)
    setSidebarCollapsed(!!scenario.sidebarCollapsed)
    setActiveDatasetIds(new Set(scenario.activeDatasetIds))
    setReferenceDragOver(!!scenario.isReferenceDragOver)
    setAddClassOpen(!!scenario.isAddClassOpen)
    setAddClassName(scenario.addClassName ?? '')
    setContextMenu(scenario.contextMenuOpen ?? null)
    setClassMenuOpen(null)
    setLightboxImage(scenario.lightboxImage ?? null)
    setDeleteConfirmOpen(!!scenario.deleteConfirmOpen)
    setCurrentMapping(scenario.currentMapping ?? '')
  }, [scenario])

  const toggleDataset = (id: string) => setActiveDatasetIds((prev) => {
    const allIds = scenario.datasets.map((dataset) => dataset.id)
    const next = prev.size === 0 ? new Set(allIds) : new Set(prev)
    if (next.has(id)) next.delete(id); else next.add(id)
    return next.size === allIds.length ? new Set() : next
  })

  const updateClass = (id: string, patch: Partial<MockClass>) => {
    setClasses((prev) => prev.map((c) => (c.id === id ? { ...c, ...patch } : c)))
  }

  const randomizeColor = () => {
    if (!selectedClassId) return
    const current = classes.find((entry) => entry.id === selectedClassId)?.color
    const currentIndex = STORY_CLASS_COLORS.findIndex((color) => color === current)
    updateClass(selectedClassId, {
      color: STORY_CLASS_COLORS[(currentIndex + 1) % STORY_CLASS_COLORS.length],
    })
  }

  const addClass = (name: string) => {
    const trimmedName = name.trim()
    if (!trimmedName) return null
    const id = `cl-story-${classes.length + 1}`
    const nextClass: MockClass = {
      id,
      name: trimmedName,
      color: STORY_CLASS_COLORS[0],
      description: null,
      image_count: 0,
    }
    setClasses((prev) => [...prev, nextClass])
    setSelectedClassId(id)
    return id
  }

  const removeSelectedClass = () => {
    if (!selectedClassId) return
    setClasses((prev) => prev.filter((c) => c.id !== selectedClassId))
    setSelectedClassId(null)
  }

  const duplicateSelectedClass = () => {
    if (!selectedClassId) return
    setClasses((prev) => {
      const source = prev.find((c) => c.id === selectedClassId)
      if (!source) return prev
      const duplicate = { ...source, id: `${source.id}-copy`, name: `${source.name} Copy` }
      setSelectedClassId(duplicate.id)
      return [...prev, duplicate]
    })
  }

  return {
    classes, selectedClassId, sidebarCollapsed, activeDatasetIds, isReferenceDragOver,
    isAddClassOpen, addClassName, contextMenuOpen, classMenuOpen, lightboxImage,
    deleteConfirmOpen, currentMapping,
    setSelectedClassId, setSidebarCollapsed, toggleDataset, setReferenceDragOver,
    setAddClassOpen, setAddClassName, setContextMenu, setClassMenuOpen, setLightboxImage,
    setDeleteConfirmOpen, setCurrentMapping,
    updateClass, randomizeColor, addClass, removeSelectedClass, duplicateSelectedClass,
  }
}
