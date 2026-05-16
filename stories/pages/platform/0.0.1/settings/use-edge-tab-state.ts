import { useEffect, useState } from 'react'
import type {
  DeflectometryConfig,
  EdgePackageOptions,
  EdgeTabKey,
} from '@ingradient/platform-pages'
import { DEFAULT_DEFLECTOMETRY_CONFIG } from '@ingradient/platform-pages'
import type { SettingsScene } from '../../../../fixtures/platform/0.0.1/settings-scenarios'
import { mockEdgeOptions } from '../../../../fixtures/platform/0.0.1/settings-edge'

export interface EdgeTabSceneState {
  subTab: EdgeTabKey
  setSubTab: (next: EdgeTabKey) => void
  options: EdgePackageOptions
  setOptions: (next: EdgePackageOptions) => void
  defl: DeflectometryConfig
  setDefl: React.Dispatch<React.SetStateAction<DeflectometryConfig>>
  selectedDatasets: Set<string>
  toggleDataset: (id: string) => void
  selectAllDatasets: (allIds: string[], checked: boolean) => void
  selectedUsers: Set<string>
  toggleUser: (userId: string) => void
  deviceName: string
  setDeviceName: (v: string) => void
}

export function useEdgeTabState(scenario: SettingsScene): EdgeTabSceneState {
  const [subTab, setSubTab] = useState<EdgeTabKey>(scenario.edgeSubTab ?? 'work')
  const [options, setOptions] = useState<EdgePackageOptions>(mockEdgeOptions)
  const [defl, setDefl] = useState<DeflectometryConfig>(DEFAULT_DEFLECTOMETRY_CONFIG)
  const [selectedDatasets, setSelectedDatasets] = useState<Set<string>>(new Set(['ds-1']))
  const [selectedUsers, setSelectedUsers] = useState<Set<string>>(new Set(['u-1']))
  const [deviceName, setDeviceName] = useState<string>('Line A — Edge 03')

  useEffect(() => {
    setSubTab(scenario.edgeSubTab ?? 'work')
    setOptions(mockEdgeOptions)
    setDefl(DEFAULT_DEFLECTOMETRY_CONFIG)
    setSelectedDatasets(new Set(['ds-1']))
    setSelectedUsers(new Set(['u-1']))
    setDeviceName('Line A — Edge 03')
  }, [scenario])

  const toggleDataset = (id: string) =>
    setSelectedDatasets((prev) => {
      const next = new Set(prev)
      if (next.has(id)) next.delete(id)
      else next.add(id)
      return next
    })

  const selectAllDatasets = (allIds: string[], checked: boolean) =>
    setSelectedDatasets(checked ? new Set(allIds) : new Set())

  const toggleUser = (userId: string) =>
    setSelectedUsers((prev) => {
      const next = new Set(prev)
      if (next.has(userId)) next.delete(userId)
      else next.add(userId)
      return next
    })

  return {
    subTab, setSubTab,
    options, setOptions,
    defl, setDefl,
    selectedDatasets, toggleDataset, selectAllDatasets,
    selectedUsers, toggleUser,
    deviceName, setDeviceName,
  }
}
