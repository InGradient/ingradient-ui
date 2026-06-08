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
  removeSelectedClass: () => void
  duplicateSelectedClass: () => void
}

const randHex = () =>
  '#' + Math.floor(Math.random() * 0xffffff).toString(16).padStart(6, '0')

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

  useEffect(() => {
    if (!scenario.classMenuOpenId) return
    const timeout = window.setTimeout(() => {
      const row = document.querySelector(`[data-class-id="${scenario.classMenuOpenId}"]`)
      const button = row?.querySelector<HTMLButtonElement>('button[aria-label^="Open menu"]')
      if (button) setClassMenuOpen({ id: scenario.classMenuOpenId!, anchor: button })
    }, 0)
    return () => window.clearTimeout(timeout)
  }, [scenario])

  const toggleDataset = (id: string) => setActiveDatasetIds((prev) => {
    const next = new Set(prev)
    if (next.has(id)) next.delete(id); else next.add(id)
    return next
  })

  const updateClass = (id: string, patch: Partial<MockClass>) => {
    setClasses((prev) => prev.map((c) => (c.id === id ? { ...c, ...patch } : c)))
  }

  const randomizeColor = () => {
    if (selectedClassId) updateClass(selectedClassId, { color: randHex() })
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
    updateClass, randomizeColor, removeSelectedClass, duplicateSelectedClass,
  }
}
