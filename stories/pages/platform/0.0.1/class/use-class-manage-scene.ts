import { useEffect, useState } from 'react'
import type { ClassScene } from '../../../../fixtures/platform/0.0.1/class-scenarios'
import type { MockClass } from '../../../../fixtures/platform/0.0.1/class-classes'
import type { MockClassImage } from '../../../../fixtures/platform/0.0.1/class-images'

export interface ClassManageSceneState {
  classes: MockClass[]
  selectedClassId: string | null
  activeDatasetIds: Set<string>
  isReferenceDragOver: boolean
  isAddClassOpen: boolean
  addClassName: string
  contextMenuOpen: { imageId: string; top: number; left: number } | null
  lightboxImage: MockClassImage | null
  deleteConfirmOpen: boolean
  currentMapping: string
  sidebarCollapsed: boolean
  classMenu: { classId: string; anchorEl: HTMLElement } | null

  setSelectedClassId: (id: string | null) => void
  toggleDataset: (id: string) => void
  setReferenceDragOver: (v: boolean) => void
  setAddClassOpen: (v: boolean) => void
  setAddClassName: (s: string) => void
  setContextMenu: (m: { imageId: string; top: number; left: number } | null) => void
  setLightboxImage: (img: MockClassImage | null) => void
  setDeleteConfirmOpen: (v: boolean) => void
  setCurrentMapping: (m: string) => void
  updateClass: (id: string, patch: Partial<MockClass>) => void
  randomizeColor: () => void
  removeSelectedClass: () => void
  collapseSidebar: () => void
  expandSidebar: () => void
  openClassMenu: (classId: string, anchor: HTMLElement) => void
  closeClassMenu: () => void
  duplicateMenuClass: () => void
}

const randHex = () =>
  '#' + Math.floor(Math.random() * 0xffffff).toString(16).padStart(6, '0')

export function useClassManageScene(scenario: ClassScene): ClassManageSceneState {
  const [classes, setClasses] = useState<MockClass[]>(scenario.classes)
  const [selectedClassId, setSelectedClassId] = useState<string | null>(scenario.selectedClassId)
  const [activeDatasetIds, setActiveDatasetIds] = useState<Set<string>>(new Set(scenario.activeDatasetIds))
  const [isReferenceDragOver, setReferenceDragOver] = useState<boolean>(!!scenario.isReferenceDragOver)
  const [isAddClassOpen, setAddClassOpen] = useState<boolean>(!!scenario.isAddClassOpen)
  const [addClassName, setAddClassName] = useState<string>(scenario.addClassName ?? '')
  const [contextMenuOpen, setContextMenu] = useState<{ imageId: string; top: number; left: number } | null>(scenario.contextMenuOpen ?? null)
  const [lightboxImage, setLightboxImage] = useState<MockClassImage | null>(scenario.lightboxImage ?? null)
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState<boolean>(!!scenario.deleteConfirmOpen)
  const [currentMapping, setCurrentMapping] = useState<string>(scenario.currentMapping ?? '')
  const [sidebarCollapsed, setSidebarCollapsed] = useState<boolean>(!!scenario.sidebarCollapsed)
  const [classMenu, setClassMenuState] = useState<{ classId: string; anchorEl: HTMLElement } | null>(
    scenario.openMenuClassId ? { classId: scenario.openMenuClassId, anchorEl: null as unknown as HTMLElement } : null,
  )

  // scenario 변경 시 reset
  useEffect(() => {
    setClasses(scenario.classes)
    setSelectedClassId(scenario.selectedClassId)
    setActiveDatasetIds(new Set(scenario.activeDatasetIds))
    setReferenceDragOver(!!scenario.isReferenceDragOver)
    setAddClassOpen(!!scenario.isAddClassOpen)
    setAddClassName(scenario.addClassName ?? '')
    setContextMenu(scenario.contextMenuOpen ?? null)
    setLightboxImage(scenario.lightboxImage ?? null)
    setDeleteConfirmOpen(!!scenario.deleteConfirmOpen)
    setCurrentMapping(scenario.currentMapping ?? '')
    setSidebarCollapsed(!!scenario.sidebarCollapsed)
    setClassMenuState(
      scenario.openMenuClassId
        ? { classId: scenario.openMenuClassId, anchorEl: null as unknown as HTMLElement }
        : null,
    )
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

  const collapseSidebar = () => setSidebarCollapsed(true)
  const expandSidebar = () => setSidebarCollapsed(false)
  const openClassMenu = (classId: string, anchor: HTMLElement) => setClassMenuState({ classId, anchorEl: anchor })
  const closeClassMenu = () => setClassMenuState(null)
  const duplicateMenuClass = () => {
    if (!classMenu) return
    const src = classes.find((c) => c.id === classMenu.classId)
    if (!src) {
      closeClassMenu()
      return
    }
    const newId = `${src.id}-copy-${Date.now()}`
    setClasses((prev) => [...prev, { ...src, id: newId, name: `${src.name} copy`, image_count: 0 }])
    closeClassMenu()
  }

  return {
    classes, selectedClassId, activeDatasetIds, isReferenceDragOver,
    isAddClassOpen, addClassName, contextMenuOpen, lightboxImage,
    deleteConfirmOpen, currentMapping,
    sidebarCollapsed, classMenu,
    setSelectedClassId, toggleDataset, setReferenceDragOver,
    setAddClassOpen, setAddClassName, setContextMenu, setLightboxImage,
    setDeleteConfirmOpen, setCurrentMapping,
    updateClass, randomizeColor, removeSelectedClass,
    collapseSidebar, expandSidebar, openClassMenu, closeClassMenu, duplicateMenuClass,
  }
}
